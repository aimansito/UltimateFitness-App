<?php

namespace App\Service;

use League\Flysystem\FilesystemOperator;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\DependencyInjection\Attribute\AutowireServiceClosure;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Guarda fotos de perfil (carpeta avatars) y fotos de entreno (carpeta entrenos).
 *  - Con SUPABASE_STORAGE_URL configurado: Flysystem (S3), devuelve URL absoluta.
 *  - Sin él (desarrollo): public/uploads/avatars, devuelve ruta relativa "/uploads/avatars/...".
 */
class AvatarStorage
{
    public const MAX_BYTES = 2 * 1024 * 1024;
    private const MAX_LADO = 4000;
    private const EXTENSIONES = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];
    private const CARPETA = 'avatars';
    public const CARPETA_ENTRENOS = 'entrenos';
    public const MAX_BYTES_ENTRENO = 4 * 1024 * 1024;

    public function __construct(
        #[Autowire('%kernel.project_dir%')] private string $projectDir,
        #[AutowireServiceClosure('default.storage')] private \Closure $storage
    ) {
    }

    /**
     * Valida el archivo por su contenido real y lo guarda con un nombre generado en servidor.
     *
     * @throws \InvalidArgumentException con un mensaje apto para mostrar al usuario
     */
    public function guardar(UploadedFile $archivo): string
    {
        return $this->guardarEn($archivo, self::CARPETA, self::MAX_BYTES, false);
    }

    /**
     * Foto de un entreno. Se le quitan los metadatos (EXIF con GPS, modelo del móvil, fecha...)
     * porque pueden revelar dónde vive o entrena la persona.
     */
    public function guardarFotoEntreno(UploadedFile $archivo): string
    {
        return $this->guardarEn($archivo, self::CARPETA_ENTRENOS, self::MAX_BYTES_ENTRENO, true);
    }

    public function borrarFotoEntreno(?string $url): void
    {
        $this->borrarDe($url, self::CARPETA_ENTRENOS);
    }

    private function guardarEn(UploadedFile $archivo, string $carpeta, int $maxBytes, bool $limpiarMetadatos): string
    {
        $mb = (int) round($maxBytes / 1024 / 1024);
        if (!$archivo->isValid()) {
            throw new \InvalidArgumentException("No se pudo subir el archivo. Recuerda que el máximo es $mb MB.");
        }
        if ($archivo->getSize() > $maxBytes) {
            throw new \InvalidArgumentException("La imagen supera el máximo de $mb MB.");
        }

        $ruta = $archivo->getPathname();
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($ruta) ?: '';
        $info = @getimagesize($ruta);

        if (!isset(self::EXTENSIONES[$mime]) || $info === false || image_type_to_mime_type($info[2]) !== $mime) {
            throw new \InvalidArgumentException('Formato no permitido. Usa una imagen JPG, PNG o WebP.');
        }
        if ($info[0] < 1 || $info[1] < 1 || $info[0] > self::MAX_LADO || $info[1] > self::MAX_LADO) {
            throw new \InvalidArgumentException('La imagen es demasiado grande (máximo 4000 px por lado).');
        }

        if ($limpiarMetadatos) {
            if ($mime !== 'image/jpeg') {
                // La app convierte siempre la foto a JPEG en el navegador; así los metadatos se pueden limpiar aquí
                throw new \InvalidArgumentException('Formato no permitido. Usa una imagen JPG.');
            }
            $limpio = self::quitarMetadatosJpeg((string) file_get_contents($ruta));
            if ($limpio === null) {
                throw new \InvalidArgumentException('La imagen está dañada.');
            }
            file_put_contents($ruta, $limpio);
        }

        $nombre = $carpeta . '/' . bin2hex(random_bytes(16)) . '.' . self::EXTENSIONES[$mime];

        if ($this->usaNube()) {
            $flujo = fopen($ruta, 'r');
            $this->fs()->writeStream($nombre, $flujo);
            if (is_resource($flujo)) {
                fclose($flujo);
            }
            return rtrim($this->basePublicaNube(), '/') . '/' . $nombre;
        }

        $dir = $this->projectDir . '/public/uploads/' . $carpeta;
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new \RuntimeException('No se pudo preparar la carpeta de imágenes');
        }
        $archivo->move($dir, basename($nombre));

        return '/uploads/' . $nombre;
    }

    /** Borra una foto guardada por este servicio. Ignora URLs ajenas. */
    public function borrar(?string $url): void
    {
        $this->borrarDe($url, self::CARPETA);
    }

    private function borrarDe(?string $url, string $carpeta): void
    {
        if (!$url) {
            return;
        }

        try {
            if (preg_match('#^/uploads/' . $carpeta . '/([a-f0-9]{32}\.(?:jpg|png|webp))$#', $url, $m)) {
                $fichero = $this->projectDir . '/public/uploads/' . $carpeta . '/' . $m[1];
                if (is_file($fichero)) {
                    @unlink($fichero);
                }
                return;
            }

            if ($this->usaNube()) {
                $base = rtrim($this->basePublicaNube(), '/') . '/' . $carpeta . '/';
                if (str_starts_with($url, $base)
                    && preg_match('#^[a-f0-9]{32}\.(?:jpg|png|webp)$#', substr($url, strlen($base)))) {
                    $this->fs()->delete($carpeta . '/' . substr($url, strlen($base)));
                }
            }
        } catch (\Throwable) {
            // Un fallo al limpiar la foto antigua no debe impedir cambiarla
        }
    }

    /**
     * Quita de un JPEG los segmentos de metadatos (APP1-APP13, APP15: EXIF, XMP, IPTC... y comentarios).
     * Conserva APP0 (JFIF) y APP14 (Adobe, color). Devuelve null si el archivo no es un JPEG válido.
     */
    public static function quitarMetadatosJpeg(string $jpeg): ?string
    {
        $n = strlen($jpeg);
        if ($n < 4 || substr($jpeg, 0, 2) !== "\xFF\xD8") {
            return null;
        }
        $salida = "\xFF\xD8";
        $i = 2;
        while ($i < $n) {
            if ($jpeg[$i] !== "\xFF") {
                return null;
            }
            // Bytes de relleno 0xFF entre segmentos
            while ($i < $n && $jpeg[$i] === "\xFF") {
                $i++;
            }
            if ($i >= $n) {
                return null;
            }
            $marcador = ord($jpeg[$i]);
            $i++;
            if ($marcador === 0xD9) {
                return $salida . "\xFF\xD9";
            }
            if (($marcador >= 0xD0 && $marcador <= 0xD7) || $marcador === 0x01) {
                $salida .= "\xFF" . chr($marcador);
                continue;
            }
            if ($i + 2 > $n) {
                return null;
            }
            $longitud = (ord($jpeg[$i]) << 8) | ord($jpeg[$i + 1]);
            if ($longitud < 2 || $i + $longitud > $n) {
                return null;
            }
            $segmento = substr($jpeg, $i, $longitud);
            $i += $longitud;

            if ($marcador === 0xDA) {
                // Inicio de los datos de imagen: el resto se copia tal cual
                return $salida . "\xFF\xDA" . $segmento . substr($jpeg, $i);
            }
            $esMetadato = ($marcador >= 0xE1 && $marcador <= 0xED) || $marcador === 0xEF || $marcador === 0xFE;
            if (!$esMetadato) {
                $salida .= "\xFF" . chr($marcador) . $segmento;
            }
        }
        return null;
    }

    private function usaNube(): bool
    {
        return !empty($_ENV['SUPABASE_STORAGE_URL'] ?? $_SERVER['SUPABASE_STORAGE_URL'] ?? getenv('SUPABASE_STORAGE_URL'));
    }

    private function fs(): FilesystemOperator
    {
        return ($this->storage)();
    }

    /** https://<proyecto>.supabase.co/storage/v1/object/public/<bucket> */
    private function basePublicaNube(): string
    {
        $env = fn (string $k) => $_ENV[$k] ?? $_SERVER[$k] ?? (getenv($k) ?: '');
        $publica = $env('SUPABASE_PUBLIC_URL');
        if ($publica) {
            return $publica;
        }
        // SUPABASE_STORAGE_URL suele ser https://<proyecto>.supabase.co/storage/v1/s3
        $origen = preg_replace('#/storage/v1/s3/?$#', '', $env('SUPABASE_STORAGE_URL'));
        return $origen . '/storage/v1/object/public/' . ($env('SUPABASE_BUCKET') ?: 'uploads');
    }
}
