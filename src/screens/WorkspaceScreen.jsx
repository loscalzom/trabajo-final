import React, { useContext, useState, useEffect } from 'react';
import { Link,   useNavigate,   useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import ENVIROMENT from '../utils/constants/enviroment';
import { getAuthenticatedHeaders } from '../fetching/customHeaders';
import InviteMember from '../Components/InviteMember';
import { AuthContext } from '../Context/AuthContext';
import CreateChannelForm from '../Components/CreateChannelForm';
import '../css/workspaceScreen.css';

const WorkspaceScreen = () => {
    const { workspace_id , channel_id} = useParams()
    console.log("Workspace ID:", workspace_id)
    const { setWorkspace } = useContext(AuthContext)

    const [channels, setChannels] = useState([])

    const { data: channels_data, error: channels_error, loading: channels_loading } = useFetch(
        `${ENVIROMENT.API_URL}/api/channel/${workspace_id}`, 
        { method: "GET", headers: getAuthenticatedHeaders() }
    )
 
    useEffect(() => {
        

        if (channels_data?.data?.channels) {
            console.log("Asignando canales:", channels_data.data.channels)
            setChannels(channels_data.data.channels)
        }
    }, [channels_data])

    const handleWorkspaceClick = async (workspace_id) => {
        try {
            const response = await fetch(`${ENVIROMENT.API_URL}/api/workspace/${workspace_id}`, {
                method: "GET",
                headers: getAuthenticatedHeaders(),
            });
            const data = await response.json()
            if (data.ok) {
                setWorkspace(data.data);
                sessionStorage.setItem("workspace", JSON.stringify(data.data))
            }
        } catch (err) {
            console.error("Error al obtener el workspace:", err)
        }
    }

    const handleNewChannel = (newChannel) => {
        console.log("Nuevo canal recibido:", newChannel)
        setChannels([...channels, newChannel])
    };

    return (
        <div className="workspace-screen-container">
            <InviteMember />

            <div className="workspace-content">
                {!channel_id && <h2 className='tema-advice'>Aún no has seleccionado ningún tema</h2>}

                <div>
                    {channels_loading ? 
                        <h2>Cargando temas...</h2> : 
                        <ChannelsList 
                            channel_list={channels} 
                            workspace_id={workspace_id} 
                            onWorkspaceClick={handleWorkspaceClick} 
                            onChannelCreated={handleNewChannel} 
                        />
                    }
                </div>
            </div>
        </div>
    );
};

const ChannelsList = ({ channel_list, workspace_id, onWorkspaceClick, onChannelCreated }) => {

    const navigate = useNavigate()

    console.log("Lista de canales en ChannelsList:", channel_list)
    return (
        <div className='channels-container'>
            <div className='channels-list-container'>
                <h2 className='tema-title'>Temas disponibles</h2>
                <div className='channel-items'>
                    {channel_list.length > 0 ? (
                        channel_list.map(channel => (
                            <div key={channel._id}>
                                {console.log("Canal ID:", channel._id)}
                                <Link to={`/workspace/${workspace_id}/${channel._id}`} onClick={() => onWorkspaceClick(workspace_id)}>
                                    {` #${channel.name}`}
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className='tema-advice'>No hay temas disponibles. Puedes crear uno nuevo.</p> 
                    )}
                </div>
            </div>

            <CreateChannelForm workspace_id={workspace_id} onChannelCreated={onChannelCreated} />
            <button className='go-back' onClick={() => navigate(-1)}>Volver</button>
        </div>
        
    )
}

export default WorkspaceScreen;
