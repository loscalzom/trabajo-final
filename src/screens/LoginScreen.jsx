import React, { useContext } from 'react'
import useForm from '../hooks/useForm'
import ENVIROMENT from '../utils/constants/enviroment'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'

const LoginScreen = () => {


    const { login, isAuthenticatedState } = useContext(AuthContext)

    const navigate = useNavigate()

    const { form_state, handleChangeInput } = useForm({ email: "", password: "" })

    const url = new URLSearchParams(window.location.search)
    if (url.get("verified")) { alert("Cuenta verificada") }

    const handleSubmitForm = async (event) => {

        event.preventDefault()
        try {
            const res = await fetch(ENVIROMENT.API_URL + "/api/auth/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify(form_state)
            })
            const data = await res.json()

            console.log("Datos recibidos de la API:", data)


            if (data.data && data.data.access_token) {
                const userData = data.data.user_info;
                const workspaceData = data.data.workspace;

                console.log("User data:", userData)
                console.log("Workspace data:", workspaceData)
                console.log("Datos completos de la respuesta:", data.data)

                if (userData && workspaceData) {
                    sessionStorage.setItem('user', JSON.stringify(userData));
                    sessionStorage.setItem('workspace', JSON.stringify(workspaceData));
                } else {
                    console.error("Error: userData o workspaceData son undefined");
                }


                sessionStorage.setItem('token', data.data.access_token)
                

                console.log('Token guardado:', sessionStorage.getItem('token'));
                console.log('User guardado:', sessionStorage.getItem('user'));
                console.log('Workspace guardado:', sessionStorage.getItem('workspace'))

                login(data.data.access_token, userData, workspaceData)
                navigate("/home")
            } else {
                console.error("Token no encontrado en la respuesta")
            }



        } catch (error) {
            console.error("Error al loguear", error)
        }



    }


    const errores = {
        email: [
        ],
        password: []

    }

    form_state.email && form_state.email.length > 30 && errores.email.push("El límite de caracteres es 30")
    form_state.email && form_state.email.length < 5 && errores.email.push("El mínimo de caracteres es 5")

    form_state.password && form_state.password.length > 30 && errores.password.push("El máximo de caracteres es 30")
    form_state.password && form_state.password.length < 5 && errores.password.push("El mínimo de caracteres es 5")


    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmitForm}>
                <div>
                    <label htmlFor="email">Ingresa tu email:</label>
                    <input name='email' id='email' placeholder='joedoe@gmail' value={form_state.email} onChange={handleChangeInput} />

                    {errores.email?.map((error, index) => <p key={index} style={{ color: "red" }}>{error}</p>)}
                </div>

                <div>
                    <label htmlFor="password">Ingresa tu contraseña:</label>
                    <input name='password' id='password' value={form_state.password} onChange={handleChangeInput} />
                    <button type='submit' disabled={errores.email.length > 0 || errores.password.length || !form_state.email || !form_state.password}>Iniciar sesión</button>
                    {errores.password?.map((error, index) => <p key={index} style={{ color: "red" }}>{error}</p>)}

                </div>
                <span>Aún no tienes cuenta? <Link to="/register">Regístrate</Link></span>
                <br />
                <Link to="/forgot-password">Olvidé mi contraseña</Link>
            </form>

        </div>
    )
}

export default LoginScreen
