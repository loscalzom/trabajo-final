import React, { useState } from 'react'
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

    try {
      const response = await fetch(ENVIROMENT.API_URL + `/api/workspace/${workspace_id}/invite`, {
        method: 'POST',
        headers: {
            ...getAuthenticatedHeaders(),
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
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

export default InviteMember