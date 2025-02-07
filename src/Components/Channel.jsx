import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getAuthenticatedHeaders } from '../fetching/customHeaders';
import useForm from '../hooks/useForm';
import ENVIROMENT from '../utils/constants/enviroment';

const Channel = () => {
    const { workspace_id, channel_id } = useParams();  // Asegúrate de que useParams esté extrayendo correctamente los parámetros
    const navigate = useNavigate();  // Para redirigir al usuario

    console.log("Workspace ID:", workspace_id);
    console.log("Channel ID:", channel_id);

    const { data: channel_data, loading: channel_loading, error: channel_error } = useFetch(
        ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}`, 
        {
            method: 'GET',
            headers: getAuthenticatedHeaders()
        }
    );
    console.log(channel_data);
    const { form_state, handleChangeInput } = useForm({ content: "" });

    const handleSubmitNewMessage = async (e) => {
        e.preventDefault();
        const response = await fetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}/send-message`, {
            method: 'POST',
            headers: getAuthenticatedHeaders(),
            body: JSON.stringify(form_state)
        });
        const responseData = await response.json();
        console.log(responseData);
    };

    // Verifica que los datos del canal se hayan cargado correctamente
    if (channel_loading) {
        return <h3>Cargando canal...</h3>;
    }

    if (channel_error) {
        return <h3>Error al cargar el canal: {channel_error.message}</h3>;
    }

    return (
        <div className="channel-container">
            {/* Asegúrate de que channel.name esté disponible antes de mostrarlo */}
            <h2>{channel_data?.data?.name || "Canal no disponible"}</h2>
            
            {/* Verifica que los mensajes estén disponibles antes de renderizarlos */}
            {channel_data?.data?.messages?.length > 0 ? (
                <div>
                    {channel_data.data.messages.map(message => (
                        <div key={message._id}>
                            <h4>Autor: {message.sender.username}</h4>
                            <p>{message.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay mensajes en este canal.</p>
            )}

            {/* Formulario para enviar mensaje */}
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

            {/* Botón para volver al workspace o a la página anterior */}
            <button onClick={() => navigate(-1)}>Volver</button>
        </div>
    );
};

export default Channel;