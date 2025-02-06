import React, { useEffect, useState } from 'react';
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

    // Imprime el contenido de channel_data para ver la estructura real
    useEffect(() => {
        console.log("Channel Data:", channel_data);
    }, [channel_data]);

    // Estado para mensajes
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (channel_data && channel_data.messages) {
            setMessages(channel_data.messages); // Si los mensajes están directamente en channel_data
        }
    }, [channel_data]);

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

        // Si el mensaje se envía correctamente, actualiza la lista de mensajes
        if (responseData.ok) {
            setMessages([...messages, responseData.data]); // Agregar el nuevo mensaje a la lista
        }
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
            <h2 className="channel-title">{channel_data?.name || "Canal no disponible"}</h2>
            
            {/* Verifica que los mensajes estén disponibles antes de renderizarlos */}
            {messages.length > 0 ? (
                <div className="messages-container">
                    {messages.map(message => (
                        <div key={message._id} className="message-item">
                            <h4 className="message-author">Autor: {message.sender.username}</h4>
                            <p className="message-content">{message.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-messages">No hay mensajes en este canal.</p>
            )}

            {/* Formulario para enviar mensaje */}
            <div className="send-message-form">
                <form onSubmit={handleSubmitNewMessage}>
                    <input
                        className="message-input"
                        placeholder="Escribe un mensaje"
                        type="text"
                        name="content"
                        onChange={handleChangeInput}
                        value={form_state.content}
                    />
                    <button type="submit" className="send-button">Enviar</button>
                </form>
            </div>

            {/* Botón para volver al workspace o a la página anterior */}
            <button onClick={() => navigate(-1)} className="back-button">Volver</button>
        </div>
    );
};

export default Channel;
