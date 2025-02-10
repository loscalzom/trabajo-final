import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getAuthenticatedHeaders } from '../fetching/customHeaders';
import useForm from '../hooks/useForm';
import ENVIROMENT from '../utils/constants/enviroment';
import '../css/channel.css';

const Channel = () => {
    const { workspace_id, channel_id } = useParams();
    const navigate = useNavigate();
    const [reload, setReload] = useState(false); // Estado para forzar la recarga

    // Fetch de los datos del canal y mensajes, que se ejecuta cada vez que cambia "reload"
    const { data: channel_data, loading: channel_loading, error: channel_error } = useFetch(
        ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}`,
        {
            method: 'GET',
            headers: getAuthenticatedHeaders()
        },
        [reload] // Dependencia para recargar los datos cuando "reload" cambia
    );

    const { form_state, handleChangeInput } = useForm({ content: "" });

    const handleSubmitNewMessage = async (e) => {
        e.preventDefault();
        const response = await fetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}/send-message`, {
            method: 'POST',
            headers: getAuthenticatedHeaders(),
            body: JSON.stringify(form_state)
        });

        if (response.ok) {
            setReload(prev => !prev); // Cambia el estado para forzar la recarga de mensajes
            handleChangeInput({ target: { name: "content", value: "" } }); // Limpia el formulario
        }
    };

    if (channel_loading) {
        return <h3>Cargando tema...</h3>;
    }

    if (channel_error) {
        return <h3>Error al cargar el tema: {channel_error.message}</h3>;
    }

    return (
        <div className="channel-container">
            <h2>{channel_data?.data?.channel?.name || "Tema no disponible"}</h2>

            {channel_data?.data?.messages?.length > 0 ? (
                <div className="messages-container">
                    {channel_data.data.messages.map(message => (
                        <div key={message._id} className="message-item">
                            <h4 className='autor'>Autor: {message.sender.username}</h4>
                            <p className='message-content'>{message.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay mensajes en este tema.</p>
            )}

            <div className="send-message-form">
                <form onSubmit={handleSubmitNewMessage}>
                    <input
                        placeholder="Escribe un mensaje"
                        type="text"
                        name="content"
                        onChange={handleChangeInput}
                        value={form_state.content}
                    />
                    <button type="submit">Enviar</button>
                </form>
            </div>

            <button className='volver' onClick={() => navigate(-1)}>Volver</button>
        </div>
    );
};

export default Channel;
