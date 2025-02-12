import { useState } from "react";
import  "../css/createNewChannel.css" 
const CreateChannelForm = ({ workspace_id, onChannelCreated }) => {
    const [channelName, setChannelName] = useState("")

    const handleCreateChannel = async () => {

        if (!channelName.trim()) {
            return alert("El nombre del tema no puede estar vacío")
        }

        const apiUrl = `${import.meta.env.VITE_API_URL}/api/channel/${workspace_id}`

        try {
            const token = sessionStorage.getItem("token")
            if (!token) {
                throw new Error("No se encontró el token de autenticación en localStorage.")
            }

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: channelName })
            });


            if (!response.ok) {
                const responseText = await response.text()
                throw new Error(`Error: ${response.status} ${response.statusText} - ${responseText}`)
            }

            const data = await response.json()

            if (data.ok) {
                onChannelCreated(data.data.new_channel)
                setChannelName("")
            } else {
                alert("Error al crear el tema: " + data.message)
            }
        } catch (error) {

            alert("Hubo un problema al crear el tema. Revisa la consola para más detalles.")
        }
    };

    return (
        <div className="create-new-channel-container">
            <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Nuevo tema"
            />
            <button className="button-create-channel" onClick={handleCreateChannel}>Crear tema</button>
            <button className='volver' onClick={() => navigate(-1)}>Volver</button>
        </div>
    );
};

export default CreateChannelForm;
