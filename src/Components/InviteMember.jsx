import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import ENVIROMENT from "../utils/constants/enviroment";
import { getAuthenticatedHeaders } from "../fetching/customHeaders";
import '../css/inviteMember.css'

const InviteMember = () => {
  const { workspace, setWorkspace } = useContext(AuthContext)
  const { workspace_id } = useParams()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [currentWorkspace, setCurrentWorkspace] = useState(workspace)

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await fetch(`${ENVIROMENT.API_URL}/api/workspace/${workspace_id}`, {
          method: "GET",
          headers: getAuthenticatedHeaders(),
        });
        const data = await response.json()
        if (data.ok) {
          console.log("Workspace data:", data.data)

          setCurrentWorkspace(data.data)
          setWorkspace(data.data)
          sessionStorage.setItem("workspace", JSON.stringify(data.data))
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError("Hubo un error al obtener el workspace")
      }
    };

    fetchWorkspace();
  }, [workspace_id, setWorkspace])

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

      const data = await response.json()

      if (data.ok) {
        setMessage("Usuario invitado correctamente")
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Hubo un error al invitar al usuario")
    }
  }

  return (
    <div className="invite-member-container">
      <h2 className="invite-member-title">{currentWorkspace ? `Grupo de amigos: ${currentWorkspace.name}` : "Cargando grupo..."}</h2>
      <h2 className="invite-member-advice">Invitar amigo al grupo</h2>
      <form onSubmit={handleInvite}>
        <label className="user-to-invite">
          Correo electrónico:
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <button className="invite-member-button" type="submit">Invitar</button>
      </form>

      {message && <p className="message-success">{message}</p>}
      {error && <p className="message-error" >{error}</p>}
    </div>
  );
};

export default InviteMember;
