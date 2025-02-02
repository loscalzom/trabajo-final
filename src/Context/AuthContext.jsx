import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(Boolean(sessionStorage.getItem("access_token")));
  const [user, setUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const storedWorkspace = sessionStorage.getItem("workspace");

    // Verifica si el valor de workspace existe antes de intentar parsearlo
    if (storedUser) setUser(storedUser);
    if (storedWorkspace) {
      try {
        const parsedWorkspace = JSON.parse(storedWorkspace);
        setWorkspace(parsedWorkspace);
      } catch (error) {
        console.error("Error al parsear el workspace:", error);
      }
    }
  }, []);

  const login = (access_token, userData, workspaceData) => {

    console.log("User Data antes de guardar:", userData);
    console.log("Workspace Data antes de guardar:", workspaceData)

    sessionStorage.setItem("access_token", access_token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("workspace", JSON.stringify(workspaceData));

    console.log("Workspace guardado en sessionStorage:", workspaceData);

    setIsAuthenticatedState(true);
    setUser(userData);
    setWorkspace(workspaceData);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticatedState, login, user, workspace }}>
      {children}
    </AuthContext.Provider>
  );
};

















