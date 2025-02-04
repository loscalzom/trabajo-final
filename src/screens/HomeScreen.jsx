import React from 'react'
import ENVIROMENT from '../utils/constants/enviroment'
import { getAuthenticatedHeaders } from '../fetching/customHeaders'
import { useFetch } from '../hooks/useFetch'
import { Link } from 'react-router-dom'
import '../css/homeScreen.css'

const HomeScreen = () => {
    const { 
        data: workspace_response, 
        error: workspace_response_error, 
        loading: workspace_loading 
    } = useFetch(ENVIROMENT.API_URL + '/api/workspace', {
        method: "GET",
        headers: getAuthenticatedHeaders()
    })
   console.log(workspace_response)
  return (
    <div className="home-container">
        <h1>Bienvenido al Chat de Amigos</h1>
        <div className='workspace-container'>
            <h2>Tus grupos de amigos</h2>
            <div>
                {
                workspace_loading
                ? <h2>Cargando</h2>
                : (
                    workspace_response.data.workspaces.length ?  
                    workspace_response.data.workspaces.map(workspace => {
                        return (
                            <div key={workspace._id} className='workspace-item'>
                                <h3>{workspace.name}</h3>
                                <Link to={`/workspace/${workspace._id}`}>Ir al grupo</Link>
                            </div>
                        )
                    })
                    : <h3>Aun no creaste ningún grupo!</h3>
                )
                }
            </div>
        </div>
        <div className='workspace-container create-group' >
            <span className='create-group'>Quieres crear un grupo?</span>
            <Link to='/workspace/new'>Crear un grupo de amigos</Link>
        </div>
    </div>
  )
}

export default HomeScreen