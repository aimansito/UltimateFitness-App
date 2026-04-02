import React from 'react';
import { UserCheck, Mail, Phone, Award, Star } from 'lucide-react';

export function EntrenadorCard({ entrenador }) {
  if (!entrenador) return null;

  return (
    <div className="mb-8 border-2 border-uf-gold rounded-lg overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-uf-gold to-yellow-600 px-6 py-4">
        <h3 className="text-black text-2xl font-bold flex items-center gap-2">
          <UserCheck className="w-6 h-6" />
          Mi Entrenador Personal
        </h3>
      </div>
      <div className="bg-gray-900 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-uf-gold to-yellow-600 rounded-full flex items-center justify-center text-black text-5xl font-bold">
              {entrenador.nombre.charAt(0)}{entrenador.apellidos.charAt(0)}
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-white mb-2">{entrenador.nombre_completo}</h4>
            <p className="text-uf-gold font-bold mb-4 uppercase">{entrenador.especialidad_formateada}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-uf-gold" />
                <span className="text-sm">{entrenador.email}</span>
              </div>
              {entrenador.telefono && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-4 h-4 text-uf-gold" />
                  <span className="text-sm">{entrenador.telefono}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-300">
                <Award className="w-4 h-4 text-uf-gold" />
                <span className="text-sm">{entrenador.anos_experiencia} años de experiencia</span>
              </div>
              {entrenador.total_valoraciones > 0 && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm">
                    {entrenador.valoracion_promedio.toFixed(1)} / 5.0 ({entrenador.total_valoraciones} valoraciones)
                  </span>
                </div>
              )}
            </div>

            {entrenador.biografia && (
              <p className="text-gray-400 text-sm mb-4">{entrenador.biografia}</p>
            )}

            {entrenador.certificacion && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Certificación:</p>
                <p className="text-white text-sm">{entrenador.certificacion}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
