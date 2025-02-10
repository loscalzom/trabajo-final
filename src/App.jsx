import React from "react"
import ENVIROMENT from "./utils/constants/enviroment"
import { Route, Routes } from "react-router-dom"
import RegisterScreen from "./screens/RegisterScreen"
import LoginScreen from "./screens/LoginScreen"
import ErrorScreen from "./screens/ErrorScreen"
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen"
import ResetPasswordScreen from "./screens/ResetPasswordScreen"
import ProtectedRoute from "./Components/ProtectedRoute"
import HomeScreen from "./screens/HomeScreen"
import CreateWorkspaceScreen from "./screens/CreateWorkspaceScreen"
import WorkspaceScreen from "./screens/WorkspaceScreen"
import "./css/global.css"
import Channel from "./Components/Channel"





const App = () => {




  return (
    <div>
      <Routes>

        <Route path="/" element={<LoginScreen />}></Route>
        <Route path="/login" element={<LoginScreen />} ></Route>
        <Route path="/register" element={<RegisterScreen />} ></Route>
        <Route path="/error" element={<ErrorScreen />} ></Route>
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

        <Route path='/reset-password' element={<ResetPasswordScreen />} />
        <Route element={<ProtectedRoute />} >
        <Route path="/home" element={<HomeScreen />}/>
        <Route path="/workspace/new" element={<CreateWorkspaceScreen />} />
       <Route path="/workspace/:workspace_id" element={<WorkspaceScreen />} />
        
        <Route path="/workspace/:workspace_id/:channel_id" element={<Channel />} />
       
        </Route>

      </Routes>

    </div>
  )
}

export default App
