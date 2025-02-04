import { useState } from "react";

const CreateChannelForm = ({ workspace_id, onChannelCreated }) => {
    const [channelName, setChannelName] = useState("");

    const handleCreateChannel = async () => {
        if (!channelName.trim()) return alert("El nombre del canal no puede estar vacío");

        try {
            const response = await fetch(`http://localhost:3000/api/workspaces/${workspace_id}/channels`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ name: channelName })
            });

            const data = await response.json();
            if (data.ok) {
                onChannelCreated(data.data.new_channel); // Actualizar lista de canales
                setChannelName(""); // Limpiar input
            } else {
                alert("Error al crear el canal");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un problema al crear el canal");
        }
    };

    return (
        <div style={{ marginBottom: "16px" }}>
            <input 
                type="text" 
                value={channelName} 
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Nuevo canal"
            />
            <button onClick={handleCreateChannel}>Crear Canal</button>
        </div>
    );
};

export default CreateChannelForm;