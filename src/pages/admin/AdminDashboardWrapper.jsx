import { Outlet } from 'react-router'
import AdminNavBar from '../../components/partials/AdminNavBar.jsx'
import { useNavigate } from 'react-router';
import { useState, useEffect } from "react";
import apiClient from '../../config/API/axiosConfig.mjs';
import { logError } from '../../config/logging/loggerFunctions.mjs';

export const AdminDashboardWrapper = () => {
    
    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await apiClient.get(`/api/v1/auth/check-session`);
                
                setLoading(false);




            } catch (error) {
                logError('Failed to check session', error);
                setLoading(false);
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
            <AdminNavBar />
            <h1>This is the admin dashboard and is followed by outlets</h1>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminDashboardWrapper;