<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;
use Twig\TemplateWrapper;

/* @ApiPlatform/GraphQlPlayground/index.html.twig */
class __TwigTemplate_4e32540dd695b37a0d0737741ac8ba0b extends Template
{
    private Source $source;
    /**
     * @var array<string, Template>
     */
    private array $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
            'head_metas' => [$this, 'block_head_metas'],
            'title' => [$this, 'block_title'],
            'head_stylesheets' => [$this, 'block_head_stylesheets'],
            'head_javascript' => [$this, 'block_head_javascript'],
            'body_stylesheets' => [$this, 'block_body_stylesheets'],
            'logo' => [$this, 'block_logo'],
            'loading' => [$this, 'block_loading'],
            'body_javascript' => [$this, 'block_body_javascript'],
        ];
    }

    protected function doDisplay(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 1
        yield "<!DOCTYPE html>
<html>
<head>
    ";
        // line 4
        yield from $this->unwrap()->yieldBlock('head_metas', $context, $blocks);
        // line 8
        yield "
    ";
        // line 9
        yield from $this->unwrap()->yieldBlock('title', $context, $blocks);
        // line 12
        yield "
    ";
        // line 13
        yield from $this->unwrap()->yieldBlock('head_stylesheets', $context, $blocks);
        // line 16
        yield "
    ";
        // line 17
        yield from $this->unwrap()->yieldBlock('head_javascript', $context, $blocks);
        // line 22
        yield "</head>

<body>
";
        // line 25
        yield from $this->unwrap()->yieldBlock('body_stylesheets', $context, $blocks);
        // line 28
        yield "
<div id=\"loading-wrapper\">
    ";
        // line 30
        yield from $this->unwrap()->yieldBlock('logo', $context, $blocks);
        // line 60
        yield "
    ";
        // line 61
        yield from $this->unwrap()->yieldBlock('loading', $context, $blocks);
        // line 66
        yield "</div>

<div id=\"graphql-playground\" />

";
        // line 70
        yield from $this->unwrap()->yieldBlock('body_javascript', $context, $blocks);
        // line 73
        yield "</body>
</html>
";
        yield from [];
    }

    // line 4
    /**
     * @return iterable<null|scalar|\Stringable>
     */
    public function block_head_metas(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 5
        yield "        <meta charset=\"UTF-8\">
        <meta name=\"viewport\" content=\"user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui\">
    ";
        yield from [];
    }

    // line 9
    /**
     * @return iterable<null|scalar|\Stringable>
     */
    public function block_title(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 10
        yield "        <title>";
        if ((($tmp = ($context["title"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["title"] ?? null), "html", null, true);
            yield " - ";
        }
        yield "API Platform</title>
    ";
        yield from [];
    }

    // line 13
    /**
     * @return iterable<null|scalar|\Stringable>
     */
    public function block_head_stylesheets(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 14
        yield "        <link rel=\"stylesheet\" href=\"";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Symfony\Bridge\Twig\Extension\AssetExtension']->getAssetUrl("bundles/apiplatform/graphql-playground/index.css", ($context["assetPackage"] ?? null)), "html", null, true);
        yield "\">
    ";
        yield from [];
    }

    // line 17
    /**
     * @return iterable<null|scalar|\Stringable>
     */
    public function block_head_javascript(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 18
        yield "        <script src=\"";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Symfony\Bridge\Twig\Extension\AssetExtension']->getAssetUrl("bundles/apiplatform/graphql-playground/middleware.js", ($context["assetPackage"] ?? null)), "html", null, true);
        yield "\"></script>
        ";
        // line 20
        yield "        <script id=\"graphql-playground-data\" type=\"application/json\">";
        yield json_encode(($context["graphql_playground_data"] ?? null), 65);
        yield "</script>
    ";
        yield from [];
    }

    // line 25
    /**
     * @return iterable<null|scalar|\Stringable>
     */
    public function block_body_stylesheets(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 26
        yield "    <link rel=\"stylesheet\" href=\"";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Symfony\Bridge\Twig\Extension\AssetExtension']->getAssetUrl("bundles/apiplatform/graphql-playground-style.css", ($context["assetPackage"] ?? null)), "html", null, true);
        yield "\">
";
        yield from [];
    }

    // line 30
    /**
     * @return iterable<null|scalar|\Stringable>
     */
    public function block_logo(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 31
        yield "        <svg class=\"logo\" viewBox=\"0 0 128 128\">
        <title>GraphQL Playground Logo</title>
        <defs>
            <linearGradient id=\"linearGradient-1\" x1=\"4.86%\" x2=\"96.21%\" y1=\"0%\" y2=\"99.66%\">
                <stop stop-color=\"#E00082\" stop-opacity=\".8\" offset=\"0%\"></stop>
                <stop stop-color=\"#E00082\" offset=\"100%\"></stop>
            </linearGradient>
        </defs>
        <g>
            <rect id=\"Gradient\" width=\"127.96\" height=\"127.96\" y=\"1\" fill=\"url(#linearGradient-1)\" rx=\"4\"></rect>
            <path id=\"Border\" fill=\"#E00082\" fill-rule=\"nonzero\" d=\"M4.7 2.84c-1.58 0-2.86 1.28-2.86 2.85v116.57c0 1.57 1.28 2.84 2.85 2.84h116.57c1.57 0 2.84-1.26 2.84-2.83V5.67c0-1.55-1.26-2.83-2.83-2.83H4.67zM4.7 0h116.58c3.14 0 5.68 2.55 5.68 5.7v116.58c0 3.14-2.54 5.68-5.68 5.68H4.68c-3.13 0-5.68-2.54-5.68-5.68V5.68C-1 2.56 1.55 0 4.7 0z\"></path>
            <path class=\"bglIGM transform-translate-100x100\" x=\"64\" y=\"28\" fill=\"#fff\" d=\"M64 36c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8\"></path>
            <path class=\"ksxRII transform-translate-100x100\" x=\"95.98500061035156\" y=\"46.510000228881836\" fill=\"#fff\" d=\"M89.04 50.52c-2.2-3.84-.9-8.73 2.94-10.96 3.83-2.2 8.72-.9 10.95 2.94 2.2 3.84.9 8.73-2.94 10.96-3.85 2.2-8.76.9-10.97-2.94\"></path>
            <path class=\"cWrBmb transform-translate-100x100\" x=\"95.97162628173828\" y=\"83.4900016784668\" fill=\"#fff\" d=\"M102.9 87.5c-2.2 3.84-7.1 5.15-10.94 2.94-3.84-2.2-5.14-7.12-2.94-10.96 2.2-3.84 7.12-5.15 10.95-2.94 3.86 2.23 5.16 7.12 2.94 10.96\"></path>
            <path class=\"Wnusb transform-translate-100x100\" x=\"64\" y=\"101.97999572753906\" fill=\"#fff\" d=\"M64 110c-4.43 0-8-3.6-8-8.02 0-4.44 3.57-8.02 8-8.02s8 3.58 8 8.02c0 4.4-3.57 8.02-8 8.02\" ></path>
            <path class=\"bfPqf transform-translate-100x100\" x=\"32.03982162475586\" y=\"83.4900016784668\" fill=\"#fff\" d=\"M25.1 87.5c-2.2-3.84-.9-8.73 2.93-10.96 3.83-2.2 8.72-.9 10.95 2.94 2.2 3.84.9 8.73-2.94 10.96-3.85 2.2-8.74.9-10.95-2.94\"></path>
            <path class=\"edRCTN transform-translate-100x100\" x=\"32.033552169799805\" y=\"46.510000228881836\" fill=\"#fff\" d=\"M38.96 50.52c-2.2 3.84-7.12 5.15-10.95 2.94-3.82-2.2-5.12-7.12-2.92-10.96 2.2-3.84 7.12-5.15 10.95-2.94 3.83 2.23 5.14 7.12 2.94 10.96\"></path>
            <path class=\"iEGVWn\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M63.55 27.5l32.9 19-32.9-19z\"></path>
            <path class=\"bsocdx\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M96 46v38-38z\"></path>
            <path class=\"jAZXmP\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M96.45 84.5l-32.9 19 32.9-19z\"></path>
            <path class=\"hSeArx\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M64.45 103.5l-32.9-19 32.9 19z\"></path>
            <path class=\"bVgqGk\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M32 84V46v38z\"></path>
            <path class=\"hEFqBt\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M31.55 46.5l32.9-19-32.9 19z\"></path>
            <path class=\"dzEKCM\" id=\"Triangle-Bottom\" stroke=\"#fff\" stroke-width=\"4\" d=\"M30 84h70\" stroke-linecap=\"round\"></path>
            <path class=\"DYnPx\" id=\"Triangle-Left\" stroke=\"#fff\" stroke-width=\"4\" d=\"M65 26L30 87\" stroke-linecap=\"round\"></path>
            <path class=\"hjPEAQ\" id=\"Triangle-Right\" stroke=\"#fff\" stroke-width=\"4\" d=\"M98 87L63 26\" stroke-linecap=\"round\"></path>
        </g>
    </svg>
    ";
        yield from [];
    }

    // line 61
    /**
     * @return iterable<null|scalar|\Stringable>
     */
    public function block_loading(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 62
        yield "    <div class=\"text\">Loading
        <span class=\"dGfHfc\">API Platform GraphQL Playground</span>
    </div>
    ";
        yield from [];
    }

    // line 70
    /**
     * @return iterable<null|scalar|\Stringable>
     */
    public function block_body_javascript(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 71
        yield "    <script src=\"";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Symfony\Bridge\Twig\Extension\AssetExtension']->getAssetUrl("bundles/apiplatform/init-graphql-playground.js", ($context["assetPackage"] ?? null)), "html", null, true);
        yield "\"></script>
";
        yield from [];
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName(): string
    {
        return "@ApiPlatform/GraphQlPlayground/index.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo(): array
    {
        return array (  249 => 71,  242 => 70,  234 => 62,  227 => 61,  194 => 31,  187 => 30,  179 => 26,  172 => 25,  164 => 20,  159 => 18,  152 => 17,  144 => 14,  137 => 13,  126 => 10,  119 => 9,  112 => 5,  105 => 4,  98 => 73,  96 => 70,  90 => 66,  88 => 61,  85 => 60,  83 => 30,  79 => 28,  77 => 25,  72 => 22,  70 => 17,  67 => 16,  65 => 13,  62 => 12,  60 => 9,  57 => 8,  55 => 4,  50 => 1,);
    }

    public function getSourceContext(): Source
    {
        return new Source("", "@ApiPlatform/GraphQlPlayground/index.html.twig", "C:\\xampp\\htdocs\\ultimate-fitness\\backend\\vendor\\api-platform\\core\\src\\Symfony\\Bundle\\Resources\\views\\GraphQlPlayground\\index.html.twig");
    }
}
