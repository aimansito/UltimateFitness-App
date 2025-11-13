import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //cargar usuario al iniciar
    useEffect(()=>{
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    },[]);


    // login 
    const login = async (email, password) => {
        const result = await authService.login(email,password);
        if(result.sucess){
            setUser(result.usuario);
        }
        return result;
    };
    
    // logout
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isPremium: user?.esPremium || false,
        loading
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function userAuth(){
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
}