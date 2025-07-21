import apiClient from "../../config/API/axiosConfig.mjs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";



const UserHome = () => {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        
        const fetchAnalysis = async () => {
            try {
                const response = await apiClient.get(`/api/v1/analysis`);
                    setLoading(false);
                    setAnalyses(response.data.analyses);
            } catch (err) {
                    setError(err.message);
                    setLoading(false);
            }
        };

        fetchAnalysis();
        
    }, []);
    
    if (loading) return <div>Loading Analysis...</div>;
    if (error) return <div>Error: {error}</div>;
    if (analyses.analysisCount === 0) 
        return (
            <>
        <div>You have not created any analysis, create one using the button below.</div>
            <button onClick={() => navigate('/user/create-analysis')}>Create New Analysis</button>
            </>
        );


    return (
        <>
            <div>
                <h1>My Analysis</h1>
                <button onClick={() => navigate('/user/create-analysis')}>Create New Analysis</button>

                <div className="analysisList">
                    { analyses.map((item) => (
                        <div key={item?.id || 'default'} className="analysisCard">
                            <h2>{item?.name || 'Untitled Analysis'}</h2>
                            <p>{item?.id || 'ID not found'}</p>
                            <p>{item?.url || 'No URL available'}</p>
                            <p>{item?.status || 'No status available'}</p>
                            <p>{item?.created_at || 'No creation date available'}</p>
                            <p>Participants {item?._count.entries}/{item?.max_number_of_participants || 'No participants number available'}</p>

                            <button onClick={() => item?.id && navigate(`/user/analysis/${item.id}`)}>View Details</button>
                        </div>
                    ))}
                </div>
                <button onClick={() => navigate('/user/create-analysis')}>Create New Analysis</button>
            </div>
        </>

    );
}

export default UserHome