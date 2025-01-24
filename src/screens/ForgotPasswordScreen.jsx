import React from 'react'
import useForm from '../hooks/useForm'
import ENVIROMENT from '../utils/constants/enviroment'

const ForgotPasswordScreen = () => {

    const { form_state ,handleChangeInput } = useForm({ email: "" })
    const handleSubmitForgotPassword = async (event) => {

        try {
            event.preventDefault()
            const res = await fetch(ENVIROMENT.API_URL + "/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form_state)
            })
const data = await res.json()
if(data.ok){
    alert("Se envió el mail de verificación")
}

        } catch (error) {
            console.error("Error al crear usuario", error)

        }


    }



    return (
        <div>
            <h1>Restablecer contraseña</h1>
            <p>Vamos a enviarte un correo electrónico con los pasos a seguir para restablecer tu contraseña</p>
            <form onSubmit={handleSubmitForgotPassword}>
                <label htmlFor="email">Ingresa el email con el que te registrarte:</label>
                <input placeholder='joe@joe' name='email' id='email' type="email" onChange={handleChangeInput} />
                <button>Enviar correo</button>
            </form>
        </div>
    )
}

export default ForgotPasswordScreen
