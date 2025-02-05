import React from 'react'
import useForm from '../hooks/useForm'
import ENVIROMENT from '../utils/constants/enviroment'
import { useState } from 'react'
import  '../css/loginScreen.css'

const ResetPasswordScreen = () => {

    const url= new URLSearchParams(window.location.search)

const reset_token= url.get('reset_token')
const {form_state,handleChangeInput}=useForm({password:""})

const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

const handleSubmitResetPassword= async (event) => {
   
    event.preventDefault()

    if (!form_state.password) {
        setMessage('⚠️ La contraseña no puede estar vacía.');
        return;
    }

    if (!reset_token) {
        setMessage('❌ Error: Token no válido.');
        return;
    }

    setLoading(true)

    try {
      
        const res = await fetch(`${ENVIROMENT.API_URL}/api/auth/reset-password?reset_token=${reset_token}`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(form_state)
        }) 

        const data= await res.json()
        console.log('Respuesta del servidor:', data);

        if (res.ok) {
            setMessage('✅ Contraseña cambiada con éxito. Ahora puedes iniciar sesión.');
        } else {
            setMessage(`❌ Error: ${data.message || 'No se pudo cambiar la contraseña.'}`);
        }

        
    } catch (error) {

        console.error('Error en la solicitud:', error);
        setMessage('❌ Error de conexión. Inténtalo nuevamente.')
        
    }
    setLoading(false);

}
const handleGoHome = () => {
    history.push('/')
}

return (
    <div>
        <h1 className='reset-password-title'>Elige una nueva contraseña</h1>
        {message && <p style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}

        <form onSubmit={handleSubmitResetPassword}>
            <label htmlFor="password" className="new-password">Nueva contraseña:</label>
            <input
                type="password"
                name="password"
                id="password"
                placeholder="*******"
                onChange={handleChangeInput}
            />

            <button type="submit" disabled={loading}>
                {loading ? 'Procesando...' : 'Enviar'}
            </button>
            <button type="button" onClick={handleGoHome} className="home-button">
                    Volver a Inicio
                </button>

        </form>
       
    </div>
);
};

export default ResetPasswordScreen
