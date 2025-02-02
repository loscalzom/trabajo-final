/* import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import ENVIROMENT from '../utils/constants/enviroment';
import { getAuthenticatedHeaders } from '../fetching/customHeaders'

const InviteMember = () => {
  const { workspace_id } = useParams()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleInvite = async (event) => {
    event.preventDefault()

    console.log("Token enviado:", sessionStorage.getItem('access_token'))

    try {
      const response = await fetch(ENVIROMENT.API_URL + `/api/workspace/${workspace_id}/invite`, {
        method: 'POST',
        headers: {
            ...getAuthenticatedHeaders(),
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`, 
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json()

      if (data.ok) {
        setMessage('Usuario invitado correctamente')
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Hubo un error al invitar al usuario')
    }
  };

  return (
    <div>
      <h2>Invitar miembro al workspace</h2>
      <form onSubmit={handleInvite}>
        <label>
          Correo electrónico:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <button type="submit">Invitar</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default InviteMember */
import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import ENVIROMENT from "../utils/constants/enviroment";
import { getAuthenticatedHeaders } from "../fetching/customHeaders";

const InviteMember = () => {
  const { workspace } = useContext(AuthContext);
  const { workspace_id } = useParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  useEffect(() => {
    // Obtener los detalles del workspace correspondiente al workspace_id
    const fetchWorkspace = async () => {
      try {
        const response = await fetch(`${ENVIROMENT.API_URL}/api/workspace/${workspace_id}`, {
          method: "GET",
          headers: getAuthenticatedHeaders(),
        });
        const data = await response.json();
        if (data.ok) {
          setWorkspace(data.data); // Actualizar el estado del workspace
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Hubo un error al obtener el workspace");
      }
    };

    fetchWorkspace();
  }, [workspace_id]);






  const handleInvite = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${ENVIROMENT.API_URL}/api/workspace/${workspace_id}/invite`, {
        method: "POST",
        headers: {
          ...getAuthenticatedHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.ok) {
        setMessage("Usuario invitado correctamente");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Hubo un error al invitar al usuario");
    }
  };

  return (
    <div>
      <h2>{workspace ? `Workspace: ${workspace.name}` : "Cargando workspace..."}</h2>
      <h2>Invitar miembro al workspace</h2>
      <form onSubmit={handleInvite}>
        <label>
          Correo electrónico:
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <button type="submit">Invitar</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default InviteMember;