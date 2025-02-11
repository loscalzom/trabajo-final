import React from 'react'
import useForm from '../hooks/useForm'
import { useFetch } from '../hooks/useFetch'
import ENVIROMENT from '../utils/constants/enviroment'
import { getAuthenticatedHeaders } from '../fetching/customHeaders'
import { useNavigate } from 'react-router-dom'
import '../css/createWorkspaceScreen.css'

const CreateWorkspaceScreen = () => {
    const navigate = useNavigate()
    const {handleChangeInput, form_state} = useForm({name: ''})
    
    const handleCreateWorkspace = async (event) =>{
        event.preventDefault()
        const response = await fetch(ENVIROMENT.API_URL + '/api/workspace', {
            method: "POST",
            headers: getAuthenticatedHeaders(),
            body: JSON.stringify(form_state)
        })
        const data = await response.json()
        navigate('/home')
    }
  return (
    <div className='create-workspace-screen-container'>
        <h1 className='create-workspace-title'>Crear un nuevo grupo</h1>
        <form onSubmit={handleCreateWorkspace}>
            <div className='input-container'>
                <label htmlFor="name">Ingresa el nombre</label>
                <input 
                    id='name' 
                    type='text' 
                    name='name' 
                    placeholder='nombre del grupo' 
                    onChange={handleChangeInput}
                    value={form_state.name}
                />
            </div>
            <button type='submit'>Crear</button>
        </form>
    </div>
  )
}

export default CreateWorkspaceScreen