import { useNavigate } from "react-router";
import apiClient from "../../config/API/axiosConfig.mjs";
import { logError } from "../../config/logging/loggerFunctions.mjs";


const LogOutButton = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {
    try {
        
     await apiClient.post(`/api/v1/auth/logout`)
        navigate('/')

    } catch (error) {
        logError('Error in logout functionality', error, 'N/A');
        }
    
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    );

};

export default LogOutButton;