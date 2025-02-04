import { useState } from "react";

const CreateChannelForm = ({ workspace_id, onChannelCreated }) => {
    const [channelName, setChannelName] = useState("");

    console.log("Workspace ID:", workspace_id);

    const handleCreateChannel = async () => {
        console.log("Se ha llamado a handleCreateChannel");

        if (!channelName.trim()) {
            return alert("El nombre del canal no puede estar vacío");
        }

        console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/channel/${workspace_id}`;
        console.log("URL construida:", apiUrl);

        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                throw new Error("No se encontró el token de autenticación en localStorage.");
            }

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: channelName })
            });

            console.log("Estado de la respuesta:", response.status);

            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(`Error: ${response.status} ${response.statusText} - ${responseText}`);
            }

            const data = await response.json();
            console.log("Data:", data);

            if (data.ok) {
                onChannelCreated(data.data.new_channel); // Actualizar lista de canales
                setChannelName(""); // Limpiar input
            } else {
                alert("Error al crear el canal: " + data.message);
            }
        } catch (error) {
            console.error("Error al crear el canal:", error);
            alert("Hubo un problema al crear el canal. Revisa la consola para más detalles.");
        }
    };

    return (
        <div style={{ marginBottom: "16px" }}>
            <input 
                type="text" 
                value={channelName} 
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Nuevo tema"
            />
            <button className="button-create-channel" onClick={handleCreateChannel}>Crear tema</button>
        </div>
    );
};

export default CreateChannelForm;
