<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/api/admin/dashboard' => [[['_route' => 'api_admin_dashboard', '_controller' => 'App\\Controller\\AdminController::dashboard'], null, ['GET' => 0], null, false, false, null]],
        '/api/admin/usuarios' => [[['_route' => 'api_admin_usuarios_list', '_controller' => 'App\\Controller\\AdminController::listarUsuarios'], null, ['GET' => 0], null, false, false, null]],
        '/api/admin/estadisticas/usuarios' => [[['_route' => 'api_admin_stats_users', '_controller' => 'App\\Controller\\AdminController::estadisticasUsuarios'], null, ['GET' => 0], null, false, false, null]],
        '/api/admin/entrenadores' => [
            [['_route' => 'api_admin_entrenadores_list', '_controller' => 'App\\Controller\\AdminController::listarEntrenadores'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_admin_entrenadores_create', '_controller' => 'App\\Controller\\AdminController::crearEntrenador'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/admin/dietas' => [[['_route' => 'api_admin_dietas_list', '_controller' => 'App\\Controller\\AdminController::listarDietas'], null, ['GET' => 0], null, false, false, null]],
        '/api/admin/alimentos' => [
            [['_route' => 'api_admin_alimentos_list', '_controller' => 'App\\Controller\\AdminController::listarAlimentos'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_admin_alimentos_create', '_controller' => 'App\\Controller\\AdminController::crearAlimento'], null, ['POST' => 0], null, false, false, null],
            [['_route' => 'api_alimentos_create', '_controller' => 'App\\Controller\\AlimentoController::crearAlimento'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/admin/ejercicios' => [
            [['_route' => 'api_admin_ejercicios_list', '_controller' => 'App\\Controller\\AdminController::listarEjercicios'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_admin_ejercicios_create', '_controller' => 'App\\Controller\\AdminController::crearEjercicio'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/admin/blog' => [
            [['_route' => 'api_admin_blog_list', '_controller' => 'App\\Controller\\AdminController::listarBlogPosts'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_admin_blog_create', '_controller' => 'App\\Controller\\AdminController::crearBlogPost'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/admin/suscripciones' => [[['_route' => 'api_admin_suscripciones_list', '_controller' => 'App\\Controller\\AdminController::listarSuscripciones'], null, ['GET' => 0], null, false, false, null]],
        '/api/alimentos' => [[['_route' => 'api_alimentos_list', '_controller' => 'App\\Controller\\AlimentoController::listarAlimentos'], null, ['GET' => 0], null, false, false, null]],
        '/api/login' => [[['_route' => 'api_login', '_controller' => 'App\\Controller\\AuthController::login'], null, ['POST' => 0], null, false, false, null]],
        '/api/blog/posts/public-preview' => [[['_route' => 'api_blog_public_preview', '_controller' => 'App\\Controller\\BlogController::publicPreview'], null, ['GET' => 0], null, false, false, null]],
        '/api/blog/posts' => [[['_route' => 'api_blog_list', '_controller' => 'App\\Controller\\BlogController::listarPosts'], null, ['GET' => 0], null, false, false, null]],
        '/api/blog/posts/premium' => [[['_route' => 'api_blog_premium_list', '_controller' => 'App\\Controller\\BlogController::listarPostsPremium'], null, ['GET' => 0], null, false, false, null]],
        '/api/blog/search' => [[['_route' => 'api_blog_search', '_controller' => 'App\\Controller\\BlogController::buscarPosts'], null, ['GET' => 0], null, false, false, null]],
        '/api/blog/categorias' => [[['_route' => 'api_blog_categories', '_controller' => 'App\\Controller\\BlogController::listarCategorias'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/calendario/guardar' => [[['_route' => 'calendario_guardar', '_controller' => 'App\\Controller\\CalendarioController::guardarCalendario'], null, ['POST' => 0], null, false, false, null]],
        '/api/entrenador/crear-entrenamiento' => [[['_route' => 'api_entrenador_crear_entrenamiento', '_controller' => 'App\\Controller\\CrearEntrenamientoController::crearEntrenamiento'], null, ['POST' => 0], null, false, false, null]],
        '/api/custom/dietas/populares' => [[['_route' => 'dietas_populares', '_controller' => 'App\\Controller\\DietaController::populares'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/dietas/publicas' => [
            [['_route' => 'dietas_publicas', '_controller' => 'App\\Controller\\DietaController::publicas'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'dietas_publicas_list', '_controller' => 'App\\Controller\\DietasPublicasController::listarDietasPublicas'], null, ['GET' => 0], null, false, false, null],
        ],
        '/api/custom/dietas' => [[['_route' => 'crear_dieta', '_controller' => 'App\\Controller\\DietaController::crearDieta'], null, ['POST' => 0], null, false, false, null]],
        '/api/custom/alimentos/buscar' => [[['_route' => 'alimentos_buscar', '_controller' => 'App\\Controller\\DietaController::buscarAlimentos'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/alimentos/por-tipo' => [[['_route' => 'alimentos_por_tipo', '_controller' => 'App\\Controller\\DietaController::alimentosPorTipo'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/dietas/calcular-calorias' => [[['_route' => 'calcular_calorias', '_controller' => 'App\\Controller\\DietaController::calcularCalorias'], null, ['POST' => 0], null, false, false, null]],
        '/api/custom/ejercicios' => [[['_route' => 'ejercicios_listar_todos', '_controller' => 'App\\Controller\\EjercicioController::listarTodos'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/ejercicios/buscar' => [[['_route' => 'ejercicios_buscar', '_controller' => 'App\\Controller\\EjercicioController::buscar'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/ejercicios/por-musculo' => [[['_route' => 'ejercicios_por_musculo', '_controller' => 'App\\Controller\\EjercicioController::porMusculo'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/ejercicios/populares' => [[['_route' => 'ejercicios_populares', '_controller' => 'App\\Controller\\EjercicioController::populares'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/ejercicios/por-dificultad' => [[['_route' => 'ejercicios_por_dificultad', '_controller' => 'App\\Controller\\EjercicioController::porDificultad'], null, ['GET' => 0], null, false, false, null]],
        '/api/entrenadores' => [
            [['_route' => 'api_entrenadores_list', '_controller' => 'App\\Controller\\EntrenadorController::listarEntrenadores'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_entrenadores_create', '_controller' => 'App\\Controller\\EntrenadorController::crearEntrenador'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/entrenadores/mejores/valorados' => [[['_route' => 'api_entrenadores_best_rated', '_controller' => 'App\\Controller\\EntrenadorController::mejorValorados'], null, ['GET' => 0], null, false, false, null]],
        '/api/entrenadores/admin/all' => [[['_route' => 'api_entrenadores_admin_list', '_controller' => 'App\\Controller\\EntrenadorController::listarTodosAdmin'], null, ['GET' => 0], null, false, false, null]],
        '/api/entrenadores/aplicaciones/pendientes' => [[['_route' => 'api_entrenadores_applications_pending', '_controller' => 'App\\Controller\\EntrenadorController::aplicacionesPendientes'], null, ['GET' => 0], null, false, false, null]],
        '/api/entrenadores/admin/estadisticas' => [[['_route' => 'api_entrenadores_stats', '_controller' => 'App\\Controller\\EntrenadorController::estadisticas'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/entrenamientos/recomendados' => [[['_route' => 'entrenamientos_recomendados', '_controller' => 'App\\Controller\\EntrenamientoController::recomendados'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/entrenamientos/por-tipo' => [[['_route' => 'entrenamientos_por_tipo', '_controller' => 'App\\Controller\\EntrenamientoController::porTipo'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/entrenamientos/por-nivel' => [[['_route' => 'entrenamientos_por_nivel', '_controller' => 'App\\Controller\\EntrenamientoController::porNivel'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/entrenamientos/populares' => [[['_route' => 'entrenamientos_populares', '_controller' => 'App\\Controller\\EntrenamientoController::populares'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/entrenamientos/crear' => [[['_route' => 'entrenamientos_crear', '_controller' => 'App\\Controller\\EntrenamientoController::crearEntrenamiento'], null, ['POST' => 0], null, false, false, null]],
        '/api/custom/mis-entrenamientos' => [[['_route' => 'mis_entrenamientos', '_controller' => 'App\\Controller\\EntrenamientoController::misEntrenamientos'], null, ['GET' => 0], null, false, false, null]],
        '/api/entrenador/crear-dieta' => [[['_route' => 'api_entrenador_crear_dieta', '_controller' => 'App\\Controller\\GuardarDietaController::crearDieta'], null, ['POST' => 0], null, false, false, null]],
        '/api/me' => [[['_route' => 'api_me', '_controller' => 'App\\Controller\\MeController::me'], null, ['GET' => 0], null, false, false, null]],
        '/api/pagos/crear-sesion' => [[['_route' => 'api_pagos_create_session', '_controller' => 'App\\Controller\\PagoController::crearSesionCheckout'], null, ['POST' => 0], null, false, false, null]],
        '/api/pagos/webhook' => [[['_route' => 'api_pagos_webhook', '_controller' => 'App\\Controller\\PagoController::webhookStripe'], null, ['POST' => 0], null, false, false, null]],
        '/api/pagos/confirmar' => [[['_route' => 'api_pagos_confirm', '_controller' => 'App\\Controller\\PagoController::confirmarPago'], null, ['POST' => 0], null, false, false, null]],
        '/api/platos' => [
            [['_route' => 'platos_listar', '_controller' => 'App\\Controller\\PlatoController::listar'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'platos_crear', '_controller' => 'App\\Controller\\PlatoController::crear'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/public/blog/preview' => [[['_route' => 'api_public_blog_preview', '_controller' => 'App\\Controller\\PublicBlogController::preview'], null, ['GET' => 0], null, false, false, null]],
        '/api/public/blog/posts' => [[['_route' => 'api_public_blog_list', '_controller' => 'App\\Controller\\PublicBlogController::list'], null, ['GET' => 0], null, false, false, null]],
        '/api/register' => [[['_route' => 'api_register', '_controller' => 'App\\Controller\\RegistroController::register'], null, ['POST' => 0], null, false, false, null]],
        '/api/suscripciones/activar-premium' => [[['_route' => 'api_suscripciones_activar_premium', '_controller' => 'App\\Controller\\SubscripcionController::activarPremium'], null, ['POST' => 0], null, false, false, null]],
        '/api/suscripciones/info' => [[['_route' => 'api_suscripciones_info', '_controller' => 'App\\Controller\\SubscripcionController::info'], null, ['GET' => 0], null, false, false, null]],
        '/api/suscripciones/mi-suscripcion' => [[['_route' => 'api_suscripciones_mi_suscripcion', '_controller' => 'App\\Controller\\SubscripcionController::miSuscripcion'], null, ['GET' => 0], null, false, false, null]],
        '/api/suscripciones/mi-entrenador' => [[['_route' => 'api_suscripciones_mi_entrenador', '_controller' => 'App\\Controller\\SubscripcionController::miEntrenador'], null, ['GET' => 0], null, false, false, null]],
        '/api/debug/test-token' => [[['_route' => 'test_token_debug', '_controller' => 'App\\Controller\\TestTokenController::testToken'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/usuarios' => [[['_route' => 'usuarios_list_all', '_controller' => 'App\\Controller\\UsuarioController::listarTodos'], null, ['GET' => 0], null, false, false, null]],
        '/api/custom/usuarios/estadisticas-globales' => [[['_route' => 'usuarios_global_stats', '_controller' => 'App\\Controller\\UsuarioController::estadisticasGlobales'], null, ['GET' => 0], null, false, false, null]],
        '/api/usuario/crear-entrenamiento' => [[['_route' => 'usuario_crear_entrenamiento', '_controller' => 'App\\Controller\\UsuarioEntrenamientosController::crearEntrenamiento'], null, ['POST' => 0], null, false, false, null]],
        '/api/health' => [[['_route' => 'api_health', '_controller' => 'App\\Controller\\HealthController::health'], null, ['GET' => 0], null, false, false, null]],
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/_error/(\\d+)(?:\\.([^/]++))?(*:35)'
                .'|/api/(?'
                    .'|a(?'
                        .'|dmin/(?'
                            .'|usuarios/([^/]++)(?'
                                .'|(*:82)'
                                .'|/(?'
                                    .'|hacer\\-premium(*:107)'
                                    .'|quitar\\-premium(*:130)'
                                .')'
                            .')'
                            .'|e(?'
                                .'|ntrenadores/([^/]++)(?'
                                    .'|(*:167)'
                                .')'
                                .'|jercicios/([^/]++)(?'
                                    .'|(*:197)'
                                .')'
                            .')'
                            .'|alimentos/([^/]++)(?'
                                .'|(*:228)'
                            .')'
                            .'|blog/([^/]++)(?'
                                .'|(*:253)'
                            .')'
                        .')'
                        .'|limentos/(?'
                            .'|([^/]++)(*:283)'
                            .'|buscar(*:297)'
                            .'|tipo/([^/]++)(*:318)'
                        .')'
                    .')'
                    .'|blog/posts/(?'
                        .'|categoria/([^/]++)(*:360)'
                        .'|([^/]++)(*:376)'
                    .')'
                    .'|custom/(?'
                        .'|calendario/(?'
                            .'|usuario/([^/]++)(*:425)'
                            .'|completar/([^/]++)(*:451)'
                            .'|notas/([^/]++)(*:473)'
                            .'|estadisticas/([^/]++)(*:502)'
                        .')'
                        .'|dietas/([^/]++)/(?'
                            .'|plan\\-diario(*:542)'
                            .'|valorar(*:557)'
                            .'|asignar(*:572)'
                        .')'
                        .'|e(?'
                            .'|jercicios/([^/]++)/valorar(*:611)'
                            .'|ntrenamientos/([^/]++)/(?'
                                .'|clonar(*:651)'
                                .'|valorar(*:666)'
                                .'|asignar(*:681)'
                            .')'
                        .')'
                        .'|usuarios/([^/]++)/(?'
                            .'|e(?'
                                .'|ntrenamientos(*:729)'
                                .'|s(?'
                                    .'|tadisticas(*:751)'
                                    .'|\\-(?'
                                        .'|premium(*:771)'
                                        .'|admin(*:784)'
                                    .')'
                                .')'
                            .')'
                            .'|dietas(*:801)'
                            .'|p(?'
                                .'|rogreso(*:820)'
                                .'|erfil\\-completo(*:843)'
                            .')'
                            .'|actualizar(*:862)'
                            .'|upgrade\\-premium(*:886)'
                            .'|info\\-premium(*:907)'
                            .'|hacer\\-premium(*:929)'
                            .'|quitar\\-premium(*:952)'
                        .')'
                    .')'
                    .'|entrenador(?'
                        .'|es/([^/]++)(?'
                            .'|(*:989)'
                            .'|/(?'
                                .'|aprobar(*:1008)'
                                .'|rechazar(*:1025)'
                            .')'
                        .')'
                        .'|/(?'
                            .'|dieta(?'
                                .'|s/([^/]++)(*:1058)'
                                .'|/([^/]++)(?'
                                    .'|/usuarios\\-asignados(*:1099)'
                                    .'|(*:1108)'
                                .')'
                            .')'
                            .'|mis\\-(?'
                                .'|entrenamientos/([^/]++)(*:1150)'
                                .'|clientes/([^/]++)(*:1176)'
                            .')'
                            .'|cliente/([^/]++)/(?'
                                .'|dietas(*:1212)'
                                .'|entrenamientos(*:1235)'
                            .')'
                        .')'
                    .')'
                    .'|usuario/(?'
                        .'|mis\\-(?'
                            .'|dietas/([^/]++)(?'
                                .'|(*:1284)'
                            .')'
                            .'|entrenamientos/([^/]++)(*:1317)'
                        .')'
                        .'|dieta/([^/]++)(?'
                            .'|/detalle(*:1352)'
                            .'|(*:1361)'
                        .')'
                        .'|entrenamiento/([^/]++)(*:1393)'
                    .')'
                    .'|p(?'
                        .'|agos/usuario/([^/]++)(*:1428)'
                        .'|latos/(?'
                            .'|([^/]++)(?'
                                .'|(*:1457)'
                            .')'
                            .'|buscar(*:1473)'
                            .'|([^/]++)/valorar(*:1498)'
                            .'|entrenador/([^/]++)(*:1526)'
                            .'|usuario/([^/]++)(*:1551)'
                        .')'
                        .'|ublic/blog/post/([^/]++)(*:1585)'
                    .')'
                .')'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        35 => [[['_route' => '_preview_error', '_controller' => 'error_controller::preview', '_format' => 'html'], ['code', '_format'], null, null, false, true, null]],
        82 => [
            [['_route' => 'api_admin_usuarios_detail', '_controller' => 'App\\Controller\\AdminController::detalleUsuario'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_admin_usuarios_update', '_controller' => 'App\\Controller\\AdminController::actualizarUsuario'], ['id'], ['PUT' => 0], null, false, true, null],
            [['_route' => 'api_admin_usuarios_delete', '_controller' => 'App\\Controller\\AdminController::eliminarUsuario'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        107 => [[['_route' => 'api_admin_usuarios_make_premium', '_controller' => 'App\\Controller\\AdminController::hacerPremium'], ['id'], ['POST' => 0], null, false, false, null]],
        130 => [[['_route' => 'api_admin_usuarios_remove_premium', '_controller' => 'App\\Controller\\AdminController::quitarPremium'], ['id'], ['POST' => 0], null, false, false, null]],
        167 => [
            [['_route' => 'api_admin_entrenadores_update', '_controller' => 'App\\Controller\\AdminController::actualizarEntrenador'], ['id'], ['PUT' => 0], null, false, true, null],
            [['_route' => 'api_admin_entrenadores_delete', '_controller' => 'App\\Controller\\AdminController::eliminarEntrenador'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        197 => [
            [['_route' => 'api_admin_ejercicios_update', '_controller' => 'App\\Controller\\AdminController::actualizarEjercicio'], ['id'], ['PUT' => 0], null, false, true, null],
            [['_route' => 'api_admin_ejercicios_delete', '_controller' => 'App\\Controller\\AdminController::eliminarEjercicio'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        228 => [
            [['_route' => 'api_admin_alimentos_update', '_controller' => 'App\\Controller\\AdminController::actualizarAlimento'], ['id'], ['PUT' => 0], null, false, true, null],
            [['_route' => 'api_admin_alimentos_delete', '_controller' => 'App\\Controller\\AdminController::eliminarAlimento'], ['id'], ['DELETE' => 0], null, false, true, null],
            [['_route' => 'api_alimentos_update', '_controller' => 'App\\Controller\\AlimentoController::actualizarAlimento'], ['id'], ['PUT' => 0], null, false, true, null],
            [['_route' => 'api_alimentos_delete', '_controller' => 'App\\Controller\\AlimentoController::eliminarAlimento'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        253 => [
            [['_route' => 'api_admin_blog_detail', '_controller' => 'App\\Controller\\AdminController::detalleBlogPost'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_admin_blog_update', '_controller' => 'App\\Controller\\AdminController::actualizarBlogPost'], ['id'], ['PUT' => 0], null, false, true, null],
            [['_route' => 'api_admin_blog_delete', '_controller' => 'App\\Controller\\AdminController::eliminarBlogPost'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        283 => [[['_route' => 'api_alimentos_detail', '_controller' => 'App\\Controller\\AlimentoController::obtenerAlimento'], ['id'], ['GET' => 0], null, false, true, null]],
        297 => [[['_route' => 'api_alimentos_search', '_controller' => 'App\\Controller\\AlimentoController::buscarAlimentos'], [], ['GET' => 0], null, false, false, null]],
        318 => [[['_route' => 'api_alimentos_by_type', '_controller' => 'App\\Controller\\AlimentoController::alimentosPorTipo'], ['tipo'], ['GET' => 0], null, false, true, null]],
        360 => [[['_route' => 'api_blog_by_category', '_controller' => 'App\\Controller\\BlogController::listarPorCategoria'], ['categoria'], ['GET' => 0], null, false, true, null]],
        376 => [[['_route' => 'api_blog_detail', '_controller' => 'App\\Controller\\BlogController::detallePost'], ['slug'], ['GET' => 0], null, false, true, null]],
        425 => [[['_route' => 'calendario_usuario', '_controller' => 'App\\Controller\\CalendarioController::obtenerCalendario'], ['usuarioId'], ['GET' => 0], null, false, true, null]],
        451 => [[['_route' => 'calendario_completar', '_controller' => 'App\\Controller\\CalendarioController::marcarCompletado'], ['id'], ['PATCH' => 0], null, false, true, null]],
        473 => [[['_route' => 'calendario_notas', '_controller' => 'App\\Controller\\CalendarioController::actualizarNotas'], ['id'], ['PATCH' => 0], null, false, true, null]],
        502 => [[['_route' => 'calendario_estadisticas', '_controller' => 'App\\Controller\\CalendarioController::obtenerEstadisticas'], ['usuarioId'], ['GET' => 0], null, false, true, null]],
        542 => [[['_route' => 'dieta_plan_diario', '_controller' => 'App\\Controller\\DietaController::planDiario'], ['id'], ['GET' => 0], null, false, false, null]],
        557 => [[['_route' => 'dietas_valorar', '_controller' => 'App\\Controller\\DietaController::valorar'], ['id'], ['POST' => 0], null, false, false, null]],
        572 => [[['_route' => 'asignar_dieta', '_controller' => 'App\\Controller\\DietaController::asignarDieta'], ['id'], ['POST' => 0], null, false, false, null]],
        611 => [[['_route' => 'ejercicios_valorar', '_controller' => 'App\\Controller\\EjercicioController::valorar'], ['id'], ['POST' => 0], null, false, false, null]],
        651 => [[['_route' => 'entrenamientos_clonar', '_controller' => 'App\\Controller\\EntrenamientoController::clonar'], ['id'], ['POST' => 0], null, false, false, null]],
        666 => [[['_route' => 'entrenamientos_valorar', '_controller' => 'App\\Controller\\EntrenamientoController::valorar'], ['id'], ['POST' => 0], null, false, false, null]],
        681 => [[['_route' => 'entrenamientos_asignar', '_controller' => 'App\\Controller\\EntrenamientoController::asignarEntrenamiento'], ['id'], ['POST' => 0], null, false, false, null]],
        729 => [[['_route' => 'usuarios_entrenamientos', '_controller' => 'App\\Controller\\UsuarioController::entrenamientos'], ['id'], ['GET' => 0], null, false, false, null]],
        751 => [[['_route' => 'usuarios_estadisticas', '_controller' => 'App\\Controller\\UsuarioController::estadisticas'], ['id'], ['GET' => 0], null, false, false, null]],
        771 => [[['_route' => 'usuarios_check_premium', '_controller' => 'App\\Controller\\UsuarioController::esPremium'], ['id'], ['GET' => 0], null, false, false, null]],
        784 => [[['_route' => 'usuarios_check_admin', '_controller' => 'App\\Controller\\UsuarioController::esAdmin'], ['id'], ['GET' => 0], null, false, false, null]],
        801 => [[['_route' => 'usuarios_dietas', '_controller' => 'App\\Controller\\UsuarioController::dietas'], ['id'], ['GET' => 0], null, false, false, null]],
        820 => [[['_route' => 'usuarios_progreso', '_controller' => 'App\\Controller\\UsuarioController::progreso'], ['id'], ['GET' => 0], null, false, false, null]],
        843 => [[['_route' => 'usuarios_profile_full', '_controller' => 'App\\Controller\\UsuarioController::perfilCompleto'], ['id'], ['GET' => 0], null, false, false, null]],
        862 => [[['_route' => 'usuarios_actualizar', '_controller' => 'App\\Controller\\UsuarioController::actualizar'], ['id'], ['PUT' => 0, 'PATCH' => 1], null, false, false, null]],
        886 => [[['_route' => 'usuarios_upgrade_premium', '_controller' => 'App\\Controller\\UsuarioController::upgradePremium'], ['id'], ['POST' => 0], null, false, false, null]],
        907 => [[['_route' => 'usuarios_premium_info', '_controller' => 'App\\Controller\\UsuarioController::infoPremium'], ['id'], ['GET' => 0], null, false, false, null]],
        929 => [[['_route' => 'usuarios_make_premium', '_controller' => 'App\\Controller\\UsuarioController::hacerPremium'], ['id'], ['POST' => 0], null, false, false, null]],
        952 => [[['_route' => 'usuarios_remove_premium', '_controller' => 'App\\Controller\\UsuarioController::quitarPremium'], ['id'], ['POST' => 0], null, false, false, null]],
        989 => [
            [['_route' => 'api_entrenadores_detail', '_controller' => 'App\\Controller\\EntrenadorController::detalleEntrenador'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'api_entrenadores_update', '_controller' => 'App\\Controller\\EntrenadorController::actualizarEntrenador'], ['id'], ['PUT' => 0], null, false, true, null],
            [['_route' => 'api_entrenadores_delete', '_controller' => 'App\\Controller\\EntrenadorController::eliminarEntrenador'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        1008 => [[['_route' => 'api_entrenadores_approve', '_controller' => 'App\\Controller\\EntrenadorController::aprobarAplicacion'], ['id'], ['POST' => 0], null, false, false, null]],
        1025 => [[['_route' => 'api_entrenadores_reject', '_controller' => 'App\\Controller\\EntrenadorController::rechazarAplicacion'], ['id'], ['POST' => 0], null, false, false, null]],
        1058 => [[['_route' => 'entrenador_dietas_list', '_controller' => 'App\\Controller\\EntrenadorDietasController::listarDietas'], ['entrenadorId'], ['GET' => 0], null, false, true, null]],
        1099 => [[['_route' => 'entrenador_dieta_usuarios', '_controller' => 'App\\Controller\\EntrenadorDietasController::usuariosAsignados'], ['dietaId'], ['GET' => 0], null, false, false, null]],
        1108 => [[['_route' => 'entrenador_dieta_delete', '_controller' => 'App\\Controller\\EntrenadorDietasController::eliminarDieta'], ['dietaId'], ['DELETE' => 0], null, false, true, null]],
        1150 => [[['_route' => 'entrenador_entrenamientos_list', '_controller' => 'App\\Controller\\EntrenadorEntrenamientosController::listarEntrenamientos'], ['entrenadorId'], ['GET' => 0], null, false, true, null]],
        1176 => [[['_route' => 'api_entrenador_mis_clientes', '_controller' => 'App\\Controller\\MisClientesController::getMisClientes'], ['entrenadorId'], ['GET' => 0], null, false, true, null]],
        1212 => [[['_route' => 'api_entrenador_cliente_dietas', '_controller' => 'App\\Controller\\MisClientesController::getDietasCliente'], ['usuarioId'], ['GET' => 0], null, false, false, null]],
        1235 => [[['_route' => 'api_entrenador_cliente_entrenamientos', '_controller' => 'App\\Controller\\MisClientesController::getEntrenamientosCliente'], ['usuarioId'], ['GET' => 0], null, false, false, null]],
        1284 => [
            [['_route' => 'api_usuario_mis_dietas', '_controller' => 'App\\Controller\\MisDietasController::getMisDietas'], ['usuarioId'], ['GET' => 0], null, false, true, null],
            [['_route' => 'usuario_dietas_list', '_controller' => 'App\\Controller\\UsuarioDietasController::listarDietas'], ['usuarioId'], ['GET' => 0], null, false, true, null],
        ],
        1317 => [[['_route' => 'usuario_entrenamientos_list', '_controller' => 'App\\Controller\\UsuarioEntrenamientosController::listarEntrenamientos'], ['usuarioId'], ['GET' => 0], null, false, true, null]],
        1352 => [[['_route' => 'api_usuario_detalle_dieta', '_controller' => 'App\\Controller\\MisDietasController::getDetalleDieta'], ['dietaId'], ['GET' => 0], null, false, false, null]],
        1361 => [[['_route' => 'usuario_dieta_detalle', '_controller' => 'App\\Controller\\UsuarioDietasController::verDetalleDieta'], ['dietaId'], ['GET' => 0], null, false, true, null]],
        1393 => [[['_route' => 'usuario_entrenamiento_detalle', '_controller' => 'App\\Controller\\UsuarioEntrenamientosController::detalleEntrenamiento'], ['entrenamientoId'], ['GET' => 0], null, false, true, null]],
        1428 => [[['_route' => 'api_pagos_user_history', '_controller' => 'App\\Controller\\PagoController::historialUsuario'], ['id'], ['GET' => 0], null, false, true, null]],
        1457 => [
            [['_route' => 'platos_detalle', '_controller' => 'App\\Controller\\PlatoController::detalle'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'platos_actualizar', '_controller' => 'App\\Controller\\PlatoController::actualizar'], ['id'], ['PUT' => 0, 'PATCH' => 1], null, false, true, null],
            [['_route' => 'platos_eliminar', '_controller' => 'App\\Controller\\PlatoController::eliminar'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        1473 => [[['_route' => 'platos_buscar', '_controller' => 'App\\Controller\\PlatoController::buscar'], [], ['GET' => 0], null, false, false, null]],
        1498 => [[['_route' => 'platos_valorar', '_controller' => 'App\\Controller\\PlatoController::valorar'], ['id'], ['POST' => 0], null, false, false, null]],
        1526 => [[['_route' => 'platos_entrenador', '_controller' => 'App\\Controller\\PlatoController::platosEntrenador'], ['entrenadorId'], ['GET' => 0], null, false, true, null]],
        1551 => [[['_route' => 'platos_usuario', '_controller' => 'App\\Controller\\PlatoController::platosUsuario'], ['usuarioId'], ['GET' => 0], null, false, true, null]],
        1585 => [
            [['_route' => 'api_public_blog_detail', '_controller' => 'App\\Controller\\PublicBlogController::detail'], ['slug'], ['GET' => 0], null, false, true, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
