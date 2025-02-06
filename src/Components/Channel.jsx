import React from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import ENVIROMENT from "../utils/constants/enviroment";
import { getAuthenticatedHeaders } from "../fetching/customHeaders";

const Channel = () => {
    const { workspace_id, channel_id } = useParams();

    const { data: channel_data, loading: channel_loading, error: channel_error } = useFetch(
        `${ENVIROMENT.API_URL}/api/channel/${workspace_id}/${channel_id}`, 
        {
            method: "GET",
            headers: getAuthenticatedHeaders()
        }
    );

    if (channel_loading) return <h2>Cargando tema...</h2>;
    if (channel_error) return <h2>Error al cargar el tema</h2>;

    return (
        <div>
            <h2>Mensajes del canal</h2>
            {channel_data?.data?.messages.map(message => (
                <div key={message._id}>
                    <h4>Autor: {message.sender.username}</h4>
                    <p>{message.content}</p>
                </div>
            ))}
        </div>
    );
};

export default Channel;