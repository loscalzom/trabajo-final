/* import { createContext, useEffect, useState } from "react"

//Crear el contexto
export const AuthContext = createContext()


//Crear el proveedor de contexto (Es un componente)

export const AuthContextProvider = ({children}) =>{

    const [isAuthenticatedState, setIsAuthenticatedState] = useState(Boolean(sessionStorage.getItem('access_token')))
    const login = (access_token) =>{
        sessionStorage.setItem('access_token', access_token)
        setIsAuthenticatedState(true)
    }
  

    return (
        <AuthContext.Provider value={{isAuthenticatedState, login}}>
            {children}
        </AuthContext.Provider>
    )
}
 */

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(Boolean(sessionStorage.getItem("access_token")));
  const [user, setUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const storedWorkspace = JSON.parse(sessionStorage.getItem("workspace"));

    if (storedUser) setUser(storedUser);
    if (storedWorkspace) setWorkspace(storedWorkspace);
  }, []);


 
  const login = (access_token, userData, workspaceData) => {
    console.log("Datos del workspace antes de llamar a login:", workspaceData)

    sessionStorage.setItem("access_token", access_token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("workspace", JSON.stringify(workspaceData));

    console.log("Workspace guardado en sessionStorage:", sessionStorage.getItem("workspace"))

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




















/* export const AuthContext = createContext()

const AuthContextProvider = ({children}) => {
    let isAuthenticated = Boolean(sessionStorage.getItem('access_token'))
    const [isAuthenticatedState, setIsAuthenticatedState] = useState(isAuthenticated)

    useEffect(() =>{
        const auth_token = sessionStorage.getItem('access_token')
        if(auth_token) {
            setIsAuthenticatedState(true)
        }
    }, [])
    return ( 
        <AuthContext.Provider value={{isAuthenticatedState}}>
            {children}
        </AuthContext.Provider>
    )
} */