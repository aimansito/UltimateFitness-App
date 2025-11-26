<?php

namespace App\Security;

use App\Entity\Usuario;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Servicio para verificar roles de usuarios
 * 
 * Este servicio actúa como "middleware" para comprobar
 * si un usuario tiene los permisos necesarios para
 * realizar ciertas acciones.
 */
class RoleChecker
{
    /**
     * Verificar si un usuario es admin
     * 
     * @param Usuario|null $usuario El usuario a verificar
     * @return bool true si es admin, false si no
     */
    public function isAdmin(?Usuario $usuario): bool
    {
        if (!$usuario) {
            return false;
        }

        return $usuario->getRol() === 'admin';
    }

    /**
     * Verificar si un usuario es premium
     * 
     * @param Usuario|null $usuario El usuario a verificar
     * @return bool true si es premium, false si no
     */
    public function isPremium(?Usuario $usuario): bool
    {
        if (!$usuario) {
            return false;
        }

        return $usuario->isEsPremium();
    }

    /**
     * Verificar si un usuario es cliente (no admin)
     * 
     * @param Usuario|null $usuario El usuario a verificar
     * @return bool true si es cliente, false si no
     */
    public function isCliente(?Usuario $usuario): bool
    {
        if (!$usuario) {
            return false;
        }

        return $usuario->getRol() === 'cliente';
    }

    /**
     * Generar respuesta de acceso denegado
     * 
     * @param string $mensaje Mensaje personalizado
     * @return JsonResponse Respuesta JSON con error 403
     */
    public function denyAccess(string $mensaje = 'Acceso denegado'): JsonResponse
    {
        return new JsonResponse([
            'success' => false,
            'error' => $mensaje,
            'required_role' => 'Se requieren permisos especiales'
        ], Response::HTTP_FORBIDDEN);
    }

    /**
     * Generar respuesta de requiere premium
     * 
     * @return JsonResponse Respuesta JSON con error 403
     */
    public function requiresPremium(): JsonResponse
    {
        return new JsonResponse([
            'success' => false,
            'error' => 'Esta función requiere una cuenta Premium',
            'action' => 'upgrade',
            'upgrade_url' => '/planes'
        ], Response::HTTP_FORBIDDEN);
    }

    /**
     * Verificar múltiples roles (OR)
     * El usuario debe tener AL MENOS uno de los roles
     * 
     * @param Usuario|null $usuario
     * @param array $roles Array de roles permitidos ['admin', 'premium']
     * @return bool
     */
    public function hasAnyRole(?Usuario $usuario, array $roles): bool
    {
        if (!$usuario) {
            return false;
        }

        foreach ($roles as $role) {
            switch ($role) {
                case 'admin':
                    if ($this->isAdmin($usuario)) return true;
                    break;
                case 'premium':
                    if ($this->isPremium($usuario)) return true;
                    break;
                case 'cliente':
                    if ($this->isCliente($usuario)) return true;
                    break;
            }
        }

        return false;
    }

    /**
     * Verificar que el usuario tiene todos los roles (AND)
     * El usuario debe tener TODOS los roles
     * 
     * @param Usuario|null $usuario
     * @param array $roles Array de roles requeridos
     * @return bool
     */
    public function hasAllRoles(?Usuario $usuario, array $roles): bool
    {
        if (!$usuario) {
            return false;
        }

        foreach ($roles as $role) {
            switch ($role) {
                case 'admin':
                    if (!$this->isAdmin($usuario)) return false;
                    break;
                case 'premium':
                    if (!$this->isPremium($usuario)) return false;
                    break;
                case 'cliente':
                    if (!$this->isCliente($usuario)) return false;
                    break;
            }
        }

        return true;
    }

    /**
     * Verificar si el usuario puede acceder a un recurso
     * 
     * @param Usuario|null $usuario Usuario que intenta acceder
     * @param Usuario $recursoOwner Dueño del recurso
     * @return bool true si puede acceder, false si no
     */
    public function canAccess(?Usuario $usuario, Usuario $recursoOwner): bool
    {
        if (!$usuario) {
            return false;
        }

        // Los admins pueden acceder a todo
        if ($this->isAdmin($usuario)) {
            return true;
        }

        // Los usuarios solo pueden acceder a sus propios recursos
        return $usuario->getId() === $recursoOwner->getId();
    }
}