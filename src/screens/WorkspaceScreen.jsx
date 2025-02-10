import React, { useContext, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import ENVIROMENT from '../utils/constants/enviroment';
import { getAuthenticatedHeaders } from '../fetching/customHeaders';
import useForm from '../hooks/useForm';
import InviteMember from '../Components/InviteMember';
import { AuthContext } from '../Context/AuthContext';
import CreateChannelForm from '../Components/CreateChannelForm';
import '../css/workspaceScreen.css';

const WorkspaceScreen = () => {
    const { workspace_id, channel_id } = useParams();
    const { setWorkspace } = useContext(AuthContext); 
    const [channels, setChannels] = useState([]);

    console.log("Workspace ID:", workspace_id);
    console.log("Channel ID:", channel_id);

    const { data: channels_data, error: channels_error, loading: channels_loading } = useFetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}`, {
        method: "GET",
        headers: getAuthenticatedHeaders()
    });

    useEffect(() => {
        if (channels_data?.data?.channels) {
            setChannels(channels_data.data.channels);
        }
    }, [channels_data]);



    const handleWorkspaceClick = async (workspace_id) => {
        console.log("Workspace ID clicked:", workspace_id);
        try {
            const response = await fetch(`${ENVIROMENT.API_URL}/api/workspace/${workspace_id}`, {
                method: "GET",
                headers: getAuthenticatedHeaders(),
            });
            const data = await response.json();
            if (data.ok) {
                console.log("Workspace data on click:", data.data);
                setWorkspace(data.data);
                sessionStorage.setItem("workspace", JSON.stringify(data.data));
            }
        } catch (err) {
            console.error("Error al obtener el workspace:", err);
        }
    };

    const handleNewChannel = (newChannel) => {
        console.log("Nuevo tema creado:", newChannel)

        setChannels([...channels, newChannel]);
    };

    return (
        <div className="workspace-screen-container">
            <InviteMember />

            <div className="workspace-content">
                <div>
                {!channel_id && <h2 className='tema-advice'>Aún no has seleccionado ningún tema</h2>}
                </div>

                <div>
                    {channels_loading ? <h2>Cargando temas...</h2> : <ChannelsList channel_list={channels} workspace_id={workspace_id} onWorkspaceClick={handleWorkspaceClick} onChannelCreated={handleNewChannel} />}
                </div>
            </div>
        </div>
    );
};

const ChannelsList = ({ channel_list, workspace_id, onWorkspaceClick, onChannelCreated }) => {
    return (
        <div className='channels-container'>
            <div className='channels-list-container'>
                <h2 className='tema-title'>Temas disponibles</h2>
                <div className='channel-items'>
                    {/* Solo muestra los canales si existen, de lo contrario muestra el mensaje */}
                    {channel_list && channel_list.length > 0 ? (
                        channel_list.map(channel => (
                            <div key={channel._id}>
                                <div>
                                    <Link
                                        to={`/workspace/${workspace_id}/${channel._id}`}
                                        onClick={() => onWorkspaceClick(workspace_id)}
                                    >
                                        {` #${channel.name}`}
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='tema-advice'>No hay temas disponibles. Puedes crear uno nuevo.</p> 
                    )}
                </div>
            </div>

            {/* Crear el formulario de creación de canal siempre */}
            <div>
                <CreateChannelForm workspace_id={workspace_id} onChannelCreated={onChannelCreated} />
            </div>
        </div>
    );
};

const Channel = ({ workspace_id, channel_id }) => {
    const { data: channel_data, loading: channel_loading, error: channel_error } = useFetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}`, {
        method: 'GET',
        headers: getAuthenticatedHeaders()
    });

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

    return (
        <div>
             {channel_loading ? (
            <h2>Cargando tema...</h2>
        ) : (
            <div className="messages-container">
                {channel_data.data.messages.map(message => (
                    <div key={message._id} className="message-item">
                        <h4>Autor: {message.sender.username}</h4>
                        <p>{message.content}</p>
                    </div>
                ))}
            </div>
        )}
            <form onSubmit={handleSubmitNewMessage}>
                <input placeholder='Enviar mensaje' type='text' name='content' onChange={handleChangeInput} value={form_state.content} />
                <button type='submit'>Enviar</button>
            </form>
        </div>
    );
};

export default WorkspaceScreen;
