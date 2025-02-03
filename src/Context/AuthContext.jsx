import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(Boolean(sessionStorage.getItem("access_token")));
  const [user, setUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const storedWorkspace = JSON.parse(sessionStorage.getItem("workspace")); // Asegurar que se parsee como JSON

    console.log('User recuperado de sessionStorage:', storedUser);
    console.log('Workspace recuperado de sessionStorage:', storedWorkspace);

    if (storedUser) setUser(storedUser);
    if (storedWorkspace) setWorkspace(storedWorkspace); // Directamente asignar el objeto parseado
  }, []);

  const login = (access_token, userData, workspaceData) => {
    console.log("User Data antes de guardar:", userData);
    console.log("Workspace Data antes de guardar:", workspaceData);

    sessionStorage.setItem("access_token", access_token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("workspace", JSON.stringify(workspaceData));

    setIsAuthenticatedState(true);
    setUser(userData);
    setWorkspace(workspaceData);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticatedState, login, user, workspace, setWorkspace }}>
      {children}
    </AuthContext.Provider>
  );
};
