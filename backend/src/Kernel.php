<?php

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    public function registerBundles(): iterable
    {
        $contents = require $this->getProjectDir().'/config/bundles.php';
        $apiPlatformFound = false;
        foreach ($contents as $class => $envs) {
            if ($envs[$this->environment] ?? $envs['all'] ?? false) {
                if ($class === \ApiPlatform\Symfony\Bundle\ApiPlatformBundle::class) {
                    $apiPlatformFound = true;
                }
                yield new $class();
            }
        }

        if (!$apiPlatformFound && class_exists(\ApiPlatform\Symfony\Bundle\ApiPlatformBundle::class)) {
            yield new \ApiPlatform\Symfony\Bundle\ApiPlatformBundle();
        }
    }
}
