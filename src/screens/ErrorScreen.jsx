import React from 'react'
import RequestEmailForm from '../Components/RequestEmailForm'

const ErrorScreen = () => {

    const url = new URLSearchParams(window.location.search)
    const error = url.get("error")

    const ERRORS = {

        "RESEND_VERIFY_TOKEN": {
            title: "No se pudo verificar tu cuenta",
            message: "Volvimos a enviar el enlace de verificación a tu correo",
            Component: null
        },
        "REQUEST_EMAIL-VERIFY_TOKEN": {
            title: "No se pudo verificar tu cuenta",
            message: "Debes volver a escribir tu mail para poder envierte el correo de verificación",
            Component: RequestEmailForm

        },

        "DEFAULT": {
            title: "Error",
            message: "Ocurrió un error inesperado",
            Component: null
        }
    }

    const { title, message, Component } = ERRORS[error] || ERRORS["DEFAULT"]

console.log(title)

    return (
        <div>
            <h1>{title}</h1>
            <p>{message}</p>
            {Component && <Component />}
        </div >
    )
}



export default ErrorScreen
