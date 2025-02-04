import { useState } from "react";

const CreateChannelForm = ({ workspace_id, onChannelCreated }) => {
    const [channelName, setChannelName] = useState("");

    console.log("Workspace ID:", workspace_id)

    const handleCreateChannel = async () => {
        if (!channelName.trim()) return alert("El nombre del canal no puede estar vacío");

        const apiUrl = `${process.env.REACT_APP_API_URL}/api/channel/${workspace_id}`;
        console.log("URL construida:", apiUrl);

        try {
            const response = await fetch(`${ENVIROMENT.API_URL}/api/channel/${workspace_id}`,
                
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ name: channelName })
            });

            console.log("Response:", response)

            const data = await response.json();
            console.log("Data:", data);
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