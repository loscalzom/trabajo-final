import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getAuthenticatedHeaders } from '../fetching/customHeaders';
import useForm from '../hooks/useForm';
import ENVIROMENT from '../utils/constants/enviroment';

const Channel = ({ workspace_id, channel_id }) => {
    const { data: channel_data, loading: channel_loading, error: channel_error } = useFetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}`, {
        method: 'GET',
        headers: getAuthenticatedHeaders()
    });

    const { form_state, handleChangeInput } = useForm({ content: "" });

    useEffect(() => {
        // Aquí puedes hacer alguna acción si es necesario cuando el canal cambie
        console.log("Canal cargado:", channel_id);
    }, [channel_id]);

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

    return (
        <div className="channel-container">
            <h2>Canal: {channel_data?.data?.name}</h2>
            {channel_loading ? <h3>Cargando canal...</h3> : (
                <div>
                    {channel_data.data.messages.map(message => (
                        <div key={message._id}>
                            <h4>Autor: {message.sender.username}</h4>
                            <p>{message.content}</p>
                        </div>
                    ))}
                </div>
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
        </div>
    );
};

export default Channel;
