import { Outlet } from "react-router";
import UserNavBar from "../../components/partials/UserNavBar";
import UserFooter from "../../components/partials/UserFooter";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import apiClient from "../../config/API/axiosConfig.mjs";
import { logError } from "../../config/logging/loggerFunctions.mjs";

const UserWrapper = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await apiClient.get(`/api/v1/auth/check-session`);
                
                setLoading(false);


            } catch (error) {
                logError('Failed to check session', error);
                navigate('/auth/login');
            }
        };

        checkAuth();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        
        
        
        <div>
            <UserNavBar /> {/* Add UserNavBar component here */}
            <h1>This is the user profile wrapper, which contains different outlets</h1>
            <Outlet />
            <UserFooter />
        </div>
    )
}

export default UserWrapper;