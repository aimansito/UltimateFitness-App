import api from './api';
const authService = {
    //buscar usuario por email
    async login(email,password){
        try{
            const response = await api.get('/usuarios?email=${email}');

            if(response.data.member && response.data.member.length > 0){
                const usuario = response.data.member[0]; 
                

                localStorage.setItem('usuario',JSON.stringify(usuario));
                return { success: true,usuario };
            }else{
                return { success: false, error: 'Usuario no encontrado'};
            }
        }catch(error){
            console.error('Error en login: ',error);
            return {success: false,error: 'Error al iniciar sesión'};
        }
    },


    // logout
    logout(){
        localStorage.removeItem('usuario');
    },

    // obtener usuario actual
    getCurrentUser(){
        const userStr = localStorage.getItem('usuario');
        return userStr ? JSON.parse(userStr) : null; 
    },

    //Verificar si está autenticado 
    isAuthenticated(){
        return !!localStorage.getItem('usuario');
    }
};

export default authService;