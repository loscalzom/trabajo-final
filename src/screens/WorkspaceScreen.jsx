import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import ENVIROMENT from '../utils/constants/enviroment';
import { getAuthenticatedHeaders } from '../fetching/customHeaders';
import useForm from '../hooks/useForm';
import InviteMember from '../Components/InviteMember';
import { AuthContext } from '../Context/AuthContext';

const WorkspaceScreen = () => {
  const { workspace_id, channel_id } = useParams();
  const { setWorkspace } = useContext(AuthContext);

  console.log("Workspace ID:", workspace_id);
  console.log("Channel ID:", channel_id);

  const { data: channels_data, error: channels_error, loading: channels_loading } = useFetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}`, {
    method: "GET",
    headers: getAuthenticatedHeaders()
  });

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

  return (
    <div>
      {channels_loading ? <h2>Cargando</h2> : <ChannelsList channel_list={channels_data.data.channels} workspace_id={workspace_id} onWorkspaceClick={handleWorkspaceClick} />}
      <div>
        {channel_id ? <Channel workspace_id={workspace_id} channel_id={channel_id} /> : <h2>Aun no has seleccionado ningun canal</h2>}
      </div>
      <InviteMember />
    </div>
  );
};

const ChannelsList = ({ channel_list, workspace_id, onWorkspaceClick }) => {
  if (!channel_list || channel_list.length === 0) {
    return <p>No hay canales disponibles</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: "column", gap: '8px' }}>
      {channel_list.map(channel => {
        return (
          <Link
            key={channel._id}
            to={`/workspace/${workspace_id}/${channel._id}`}
            onClick={() => onWorkspaceClick(workspace_id)}
          >
            #{channel.name}
          </Link>
        );
      })}
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
      {channel_loading ? <h2>Cargando canal</h2> : channel_data.data.messages.map(message => {
        return (
          <div key={message._id}>
            <h4>Autor: {message.sender.username}</h4>
            <p>{message.content}</p>
          </div>
        );
      })}
      <form onSubmit={handleSubmitNewMessage}>
        <input placeholder='Enviar mensaje' type='text' name='content' onChange={handleChangeInput} value={form_state.content} />
        <button type='submit'>Enviar</button>
      </form>
    </div>
  );
};

export default WorkspaceScreen;