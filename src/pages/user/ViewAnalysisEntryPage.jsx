import { useState, useEffect } from 'react';
import apiClient from '../../config/API/axiosConfig.mjs';
import { useParams } from 'react-router';

export const ViewAnalysisPage = () => {

    console.log(useParams())
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get(`/api/v1/analysis/analysis-entry-details/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log('Analysis data:', response.data);
            } catch (error) {
                console.error('Error fetching analysis data:', error);
            }
        };
        fetchData();
    }, [id]);


    return (
        <>
            <div>
                <h1>Tasks</h1>
                {/* Add your analysis view components here */}
            </div>

            <div className="videoContent">
                this is the video
            </div>
        </>
    );
};
