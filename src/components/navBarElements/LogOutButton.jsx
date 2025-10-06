import { useNavigate } from "react-router";
import apiClient from "../../config/API/axiosConfig.mjs";
import { usePostHog } from 'posthog-js/react'


const LogOutButton = () => {

    const posthog = usePostHog()
    const navigate = useNavigate();

    const handleLogout = async () => {
    try {
        
     await apiClient.post(`/api/v1/auth/logout`)
        navigate('/')

        posthog.reset(); //! FIX

    } catch (error) {
        }
    
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    );

};

export default LogOutButton;