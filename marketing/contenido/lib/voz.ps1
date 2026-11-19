# Locución con las voces de Windows (gratis y sin conexión).
# Recibe un JSON con [{ "salida": "ruta sin extensión", "texto": "..." }] y por cada frase escribe
# <salida>.wav y <salida>.json con el instante de cada palabra (para los subtítulos).
param(
  [Parameter(Mandatory = $true)][string]$Lista,
  [string]$Voz = 'Pablo',
  [double]$Velocidad = 1.1
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime]
$null = [Windows.Storage.Streams.DataReader, Windows.Storage.Streams, ContentType = WindowsRuntime]
$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
  })[0]
function Esperar($op, [Type]$tipo) {
  $tarea = $asTask.MakeGenericMethod($tipo).Invoke($null, @($op))
  $tarea.Wait(-1) | Out-Null
  $tarea.Result
}

$sintetizador = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$voces = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.DisplayName -like "*$Voz*" }
if (-not $voces) { throw "No está instalada la voz $Voz" }
$sintetizador.Voice = $voces | Select-Object -First 1
$sintetizador.Options.SpeakingRate = $Velocidad
$sintetizador.Options.IncludeWordBoundaryMetadata = $true

$frases = Get-Content -Raw -Encoding UTF8 $Lista | ConvertFrom-Json
foreach ($f in $frases) {
  $flujo = Esperar ($sintetizador.SynthesizeTextToStreamAsync($f.texto)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
  $lector = New-Object Windows.Storage.Streams.DataReader($flujo.GetInputStreamAt(0))
  $null = Esperar ($lector.LoadAsync([uint32]$flujo.Size)) ([uint32])
  $bytes = New-Object byte[] $flujo.Size
  $lector.ReadBytes($bytes)
  [IO.File]::WriteAllBytes("$($f.salida).wav", $bytes)

  $palabras = @()
  foreach ($pista in $flujo.TimedMetadataTracks) {
    foreach ($cue in $pista.Cues) {
      $palabras += [pscustomobject]@{ t = $cue.StartTime.TotalSeconds; d = $cue.Duration.TotalSeconds; w = $cue.Text }
    }
  }
  $json = ConvertTo-Json -InputObject @($palabras) -Compress
  [IO.File]::WriteAllText("$($f.salida).json", $json, (New-Object System.Text.UTF8Encoding($false)))
}
Write-Output "voz: $($frases.Count) frases"
