// ============================================
// Cálculo de calorías y macros (Mifflin-St Jeor) y datos pendientes
// de la calculadora del landing hasta que la persona crea su cuenta.
// ============================================

export const NIVELES_ACTIVIDAD = {
  sedentario: { nombre: 'Sedentario', descripcion: 'Poco o ningún ejercicio', factor: 1.2 },
  ligero: { nombre: 'Ligero', descripcion: '1-3 días/semana', factor: 1.375 },
  moderado: { nombre: 'Moderado', descripcion: '3-5 días/semana', factor: 1.55 },
  activo: { nombre: 'Activo', descripcion: '6-7 días/semana', factor: 1.725 },
  muy_activo: { nombre: 'Muy activo', descripcion: 'Ejercicio intenso a diario', factor: 1.9 },
};

export const OBJETIVOS = {
  perder_peso: { nombre: 'Perder grasa', ajuste: -500, proteinaPorKg: 2.0 },
  tonificar: { nombre: 'Tonificar', ajuste: -250, proteinaPorKg: 2.0 },
  mantener: { nombre: 'Mantener peso', ajuste: 0, proteinaPorKg: 1.6 },
  ganar_masa: { nombre: 'Ganar músculo', ajuste: 350, proteinaPorKg: 1.8 },
};

export const DATOS_VACIOS = { peso: '', altura: '', edad: '', sexo: 'hombre', actividad: 'moderado', objetivo: 'mantener' };

const CLAVE_PENDIENTE = 'uf_calculadora_pendiente';

/** Devuelve un mensaje de error o null si los datos sirven para calcular */
export function validarDatos({ peso, altura, edad }) {
  const p = parseFloat(peso);
  const a = parseFloat(altura);
  const e = parseInt(edad, 10);
  if (!p || !a || !e) return 'Rellena peso, altura y edad';
  if (p < 30 || p > 300) return 'El peso debe estar entre 30 y 300 kg';
  if (a < 100 || a > 250) return 'La altura debe estar entre 100 y 250 cm';
  if (e < 14 || e > 120) return 'La edad debe estar entre 14 y 120 años';
  return null;
}

/**
 * Necesidades diarias. TMB con Mifflin-St Jeor (más precisa que Harris-Benedict),
 * proteína por kg de peso según objetivo, grasas al 25% y el resto en carbohidratos.
 */
export function calcularNecesidades(datos) {
  const peso = parseFloat(datos.peso);
  const altura = parseFloat(datos.altura);
  const edad = parseInt(datos.edad, 10);
  const nivel = NIVELES_ACTIVIDAD[datos.actividad] || NIVELES_ACTIVIDAD.moderado;
  const objetivo = OBJETIVOS[datos.objetivo] || OBJETIVOS.mantener;

  const tmb = 10 * peso + 6.25 * altura - 5 * edad + (datos.sexo === 'mujer' ? -161 : 5);
  const mantenimiento = tmb * nivel.factor;
  // Nunca por debajo de 1200 kcal: un déficit mayor no es seguro sin supervisión
  const caloriasObjetivo = Math.max(1200, mantenimiento + objetivo.ajuste);

  const proteinas = Math.round(peso * objetivo.proteinaPorKg);
  const grasas = Math.round((caloriasObjetivo * 0.25) / 9);
  const carbohidratos = Math.max(0, Math.round((caloriasObjetivo - proteinas * 4 - grasas * 9) / 4));

  return {
    tmb: Math.round(tmb),
    caloriasMantenimiento: Math.round(mantenimiento),
    caloriasObjetivo: Math.round(caloriasObjetivo),
    proteinas,
    carbohidratos,
    grasas,
    objetivo: objetivo.nombre,
    objetivoClave: datos.objetivo,
  };
}

// ---------- Datos pendientes (landing -> registro -> resultado) ----------

export function guardarPendiente(datos) {
  try {
    localStorage.setItem(CLAVE_PENDIENTE, JSON.stringify({ ...datos, fecha: Date.now() }));
  } catch {
    /* almacenamiento no disponible: el flujo sigue sin guardar */
  }
}

export function leerPendiente() {
  try {
    const bruto = localStorage.getItem(CLAVE_PENDIENTE);
    if (!bruto) return null;
    const datos = JSON.parse(bruto);
    // Caduca a los 7 días para no arrastrar datos viejos
    if (!datos || Date.now() - (datos.fecha || 0) > 7 * 24 * 3600 * 1000) return null;
    return datos;
  } catch {
    return null;
  }
}

export function borrarPendiente() {
  try {
    localStorage.removeItem(CLAVE_PENDIENTE);
  } catch {
    /* nada que borrar */
  }
}

// ---------- Equivalencias con el perfil de la cuenta ----------

const ACTIVIDAD_A_PERFIL = { sedentario: 'sedentario', ligero: 'ligero', moderado: 'moderado', activo: 'intenso', muy_activo: 'muy_intenso' };
const PERFIL_A_ACTIVIDAD = { sedentario: 'sedentario', ligero: 'ligero', moderado: 'moderado', intenso: 'activo', activo: 'activo', muy_intenso: 'muy_activo', muy_activo: 'muy_activo' };
const OBJETIVO_A_PERFIL = { perder_peso: 'perdida_peso', tonificar: 'cuidar_alimentacion', mantener: 'mantenimiento', ganar_masa: 'ganancia_muscular' };
const PERFIL_A_OBJETIVO = { perdida_peso: 'perder_peso', cuidar_alimentacion: 'tonificar', mantenimiento: 'mantener', ganancia_muscular: 'ganar_masa', rendimiento: 'mantener' };

/** Campos del perfil (PUT /custom/usuarios/{id}/actualizar) a partir de los datos de la calculadora */
export function datosAPerfil(datos) {
  return {
    peso_actual: parseFloat(datos.peso),
    altura: parseInt(datos.altura, 10),
    edad: parseInt(datos.edad, 10),
    sexo: datos.sexo === 'mujer' ? 'femenino' : 'masculino',
    nivel_actividad: ACTIVIDAD_A_PERFIL[datos.actividad] || 'moderado',
    objetivo: OBJETIVO_A_PERFIL[datos.objetivo] || 'mantenimiento',
  };
}

/** Datos de la calculadora a partir del perfil guardado (para no volver a teclearlos) */
export function perfilADatos(usuario) {
  if (!usuario) return DATOS_VACIOS;
  return {
    peso: usuario.peso_actual || '',
    altura: usuario.altura || '',
    edad: usuario.edad || '',
    sexo: usuario.sexo === 'femenino' ? 'mujer' : 'hombre',
    actividad: PERFIL_A_ACTIVIDAD[usuario.nivel_actividad] || 'moderado',
    objetivo: PERFIL_A_OBJETIVO[usuario.objetivo] || 'mantener',
  };
}

/** Datos de la calculadora en el formato del formulario de registro (paso 2 y 3) */
export function datosARegistro(datos) {
  const perfil = datosAPerfil(datos);
  return {
    sexo: perfil.sexo,
    edad: String(perfil.edad),
    peso_actual: String(perfil.peso_actual),
    altura: String(perfil.altura),
    nivel_actividad: perfil.nivel_actividad,
    objetivo: perfil.objetivo,
  };
}
