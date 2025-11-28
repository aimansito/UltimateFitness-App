import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Target, 
  Calendar, 
  Activity, 
  Weight, 
  Ruler,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Star,
  Shield
} from 'lucide-react';

function MisDatosPersonales() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    objetivo: '',
    peso_actual: '',
    altura: '',
    edad: '',
    sexo: '',
    nivel_actividad: '',
  });

  const [originalData, setOriginalData] = useState({}); // Para comparar cambios

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      const userData = {
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
        telefono: user.telefono || '',
        objetivo: user.objetivo || 'cuidar_alimentacion',
        peso_actual: user.peso_actual || '',
        altura: user.altura || '',
        edad: user.edad || '',
        sexo: user.sexo || '',
        nivel_actividad: user.nivel_actividad || 'ligero',
      };
      setFormData(userData);
      setOriginalData(userData); // Guardar datos originales
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setEditing(true);
    setMessage({ type: '', text: '' }); // Limpiar mensajes
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(originalData); // Restaurar datos originales
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar si hay cambios
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    
    if (!hasChanges) {
      setMessage({
        type: 'error',
        text: 'No se han realizado cambios'
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // TODO: Llamar al endpoint de actualización del backend
      // const response = await axios.put(`/api/usuarios/${user.id}`, formData);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación

      setOriginalData(formData); // Actualizar datos originales
      setMessage({
        type: 'success',
        text: 'Datos actualizados correctamente'
      });
      setEditing(false);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al actualizar los datos'
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcular IMC
  const calcularIMC = () => {
    if (formData.peso_actual && formData.altura) {
      const peso = parseFloat(formData.peso_actual);
      const alturaM = parseFloat(formData.altura) / 100;
      const imc = (peso / (alturaM * alturaM)).toFixed(2);
      return imc;
    }
    return null;
  };

  const imc = calcularIMC();

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-uf-gold to-yellow-600 py-6 text-center rounded-t-lg shadow-lg">
          <h1 className="text-3xl font-bold text-black uppercase tracking-wider flex items-center justify-center gap-3">
            <User className="w-8 h-8" />
            Mis Datos Personales
          </h1>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-b-lg shadow-2xl border border-gray-700">
          
          {/* Mensaje de éxito/error */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-900/50 text-green-300 border border-green-700' 
                : 'bg-red-900/50 text-red-300 border border-red-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="font-semibold">{message.text}</span>
            </div>
          )}

          {/* Badge Premium / Admin */}
          <div className="mb-6 flex gap-3">
            {user?.es_premium && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-uf-red to-red-700 text-white text-sm font-bold rounded-full uppercase shadow-lg">
                <Star className="w-4 h-4" />
                Usuario Premium
              </span>
            )}
            {user?.rol === 'admin' && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-bold rounded-full uppercase shadow-lg">
                <Shield className="w-4 h-4" />
                Administrador
              </span>
            )}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Información Básica */}
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-uf-gold" />
                Información Básica
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">
                    Nombre <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border-b-2 border-uf-gold text-white focus:outline-none focus:border-uf-blue transition disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
                  />
                </div>

                {/* Apellidos */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">
                    Apellidos <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border-b-2 border-uf-gold text-white focus:outline-none focus:border-uf-blue transition disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-uf-gold" />
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 bg-gray-800 border-b-2 border-gray-600 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-uf-gold" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="600123456"
                    className="w-full px-4 py-3 bg-gray-900 border-b-2 border-uf-gold text-white focus:outline-none focus:border-uf-blue transition disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Información Física */}
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-uf-gold" />
                Información Física
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Peso */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm flex items-center gap-2">
                    <Weight className="w-4 h-4 text-uf-gold" />
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="peso_actual"
                    value={formData.peso_actual}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="70.5"
                    className="w-full px-4 py-3 bg-gray-900 border-b-2 border-uf-gold text-white focus:outline-none focus:border-uf-blue transition disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
                  />
                </div>

                {/* Altura */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-uf-gold" />
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    name="altura"
                    value={formData.altura}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="175"
                    className="w-full px-4 py-3 bg-gray-900 border-b-2 border-uf-gold text-white focus:outline-none focus:border-uf-blue transition disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
                  />
                </div>

                {/* Edad */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-uf-gold" />
                    Edad
                  </label>
                  <input
                    type="number"
                    name="edad"
                    value={formData.edad}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="30"
                    className="w-full px-4 py-3 bg-gray-900 border-b-2 border-uf-gold text-white focus:outline-none focus:border-uf-blue transition disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
                  />
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">
                    Sexo
                  </label>
                  <select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 bg-gray-900 border-b-2 border-uf-gold text-white focus:outline-none focus:border-uf-blue transition disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                  </select>
                </div>

                {/* Nivel de Actividad */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-2 text-sm">
                    Nivel de Actividad
                  </label>
                  <select
                    name="nivel_actividad"
                    value={formData.nivel_actividad}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 bg-gray-900 border-b-2 border-uf-gold text-white focus:outline-none focus:border-uf-blue transition disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    <option value="sedentario">Sedentario</option>
                    <option value="ligero">Ligero</option>
                    <option value="moderado">Moderado</option>
                    <option value="activo">Activo</option>
                    <option value="muy_activo">Muy Activo</option>
                  </select>
                </div>

                {/* IMC */}
                {imc && (
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2 text-sm">
                      IMC Calculado
                    </label>
                    <div className="px-4 py-3 bg-uf-gold/20 border-2 border-uf-gold rounded-lg font-bold text-xl text-uf-gold text-center">
                      {imc}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-center font-semibold">
                      {parseFloat(imc) < 18.5 && 'Bajo peso'}
                      {parseFloat(imc) >= 18.5 && parseFloat(imc) < 25 && 'Peso normal'}
                      {parseFloat(imc) >= 25 && parseFloat(imc) < 30 && 'Sobrepeso'}
                      {parseFloat(imc) >= 30 && 'Obesidad'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Objetivo */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-uf-gold" />
                Objetivo
              </h2>
              
              <select
                name="objetivo"
                value={formData.objetivo}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 bg-gray-900 border-b-2 border-uf-gold text-white focus:outline-none focus:border-uf-blue transition disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                <option value="perder_peso">Perder peso</option>
                <option value="ganar_masa">Ganar masa muscular</option>
                <option value="mantener">Mantener peso</option>
                <option value="tonificar">Tonificar</option>
                <option value="cuidar_alimentacion">Cuidar alimentación</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              {!editing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex-1 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-4 rounded-lg uppercase tracking-wider hover:from-yellow-600 hover:to-uf-gold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-xl"
                >
                  <Edit3 className="w-5 h-5" />
                  Editar Datos
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 rounded-lg uppercase tracking-wider hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-4 rounded-lg uppercase tracking-wider hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MisDatosPersonales;