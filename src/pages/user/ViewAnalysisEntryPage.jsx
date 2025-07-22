import { useState, useEffect } from 'react';
import apiClient from '../../config/API/axiosConfig.mjs';
import { useParams } from 'react-router';

export const ViewAnalysisEntryPage = () => {

    const [entryUrl, setEntryUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get(`/api/v1/entry/${id}`);
                setLoading(false);
                setEntryUrl(response.entryUrl)
            } catch (error) {
                console.error('Error fetching analysis data:', error);
                setLoading(false);
                setError(error.message)
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div>Loading Analysis Entry...</div>
    )
    if (error) return (
        <div>Error retrieving video entry: {error}</div>
    )

    return (
        <>
            <div>
                <h1>Tasks</h1>
                {/* Add your analysis view components here */}
            </div>
            
            <video controls
        src={entryUrl}></video>
        </>
    );
};
