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

    console.log("Workspace ID:", workspace_id);
    console.log("Channel ID:", channel_id);

    const [messages, setMessages] = useState([]);

    // Fetch para obtener los datos del canal y los mensajes
    const { data: channel_data, loading: channel_loading, error: channel_error, refetch } = useFetch(
        ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}`, 
        {
            method: 'GET',
            headers: getAuthenticatedHeaders()
        }
    );

    useEffect(() => {
        if (channel_data?.data?.messages) {
            setMessages(channel_data.data.messages);
        }
    }, [channel_data]);

    const { form_state, handleChangeInput, resetForm } = useForm({ content: "" });

    const handleSubmitNewMessage = async (e) => {
        e.preventDefault();

        const response = await fetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}/send-message`, {
            method: 'POST',
            headers: getAuthenticatedHeaders(),
            body: JSON.stringify(form_state)
        });

        const responseData = await response.json();
        console.log(responseData);

        if (response.ok) {
            // Agregar el nuevo mensaje al estado local
            setMessages([...messages, responseData.data]);

            // Limpiar input
            resetForm();

            // Opcional: Vuelve a hacer fetch para asegurarte de que los datos estén actualizados
            refetch();
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

            {messages.length > 0 ? (
                <div className="messages-container">
                    {messages.map(message => (
                        <div key={message._id} className="message-item">
                            <h4>Autor: {message.sender.username}</h4>
                            <p>{message.content}</p>
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

            <button className="volver" onClick={() => navigate(-1)}>Volver</button>
        </div>
    );
};

export default Channel;
