import { useState, useEffect } from 'react';
import apiClient from '../../config/API/axiosConfig.mjs';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';

export const ViewAnalysisPage = () => {
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);


    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get(`/api/v1/analysis/${id}`);
                setAnalysisData(response.data.analysisData)
                setLoading(false);

            } catch (error) {
                console.error('Error fetching analysis data:', error);
                setError(error.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);


if (loading) return (
  <div>Loading Analysis Data...</div>
)

if (error) return (
  <div>Error fetching analysis data: {error}</div>
)

    return (
        <>
        <div className="analysisData">
        <h2>Analysis details</h2>
          <p>Title: {analysisData.name}</p>
          <p>url: {analysisData.url}</p>
          <p>participants number: {analysisData.max_number_of_participants}</p>

          <p>Created At: {analysisData.created_at}</p>
          <p>Tasks:</p>
          <ul>
            { analysisData && analysisData.tasks && <p>Tasks: {analysisData.tasks.length} tasks</p>}

            { analysisData && analysisData.tasks &&  analysisData.tasks.map((task) => (
              <div key={task.id} className="taskDetails">
              <p className="taskType">{task.taskType}</p>
              <p className="taskType">{task.taskContent}</p>
              </div>
            ))}
          </ul>
          <p></p>
          <p></p>
        </div>

            <div className="participantsList">
        <h1>Participants: {analysisData.entries.length} / {analysisData.max_number_of_participants}</h1>
        {analysisData && analysisData.entries && analysisData.entries.length === 0 ? (
          <p>No participants found.</p>
        ) : (
          analysisData.entries.map((entry) => (
                <div key={entry.id}>
              <p>Name: {entry.id}</p>
              <p>age: </p>
              <p>gender: </p>
             <p> country:    </p>

              <p>Status: {entry.status}</p>
              <p>{entry.url}</p>

              <button onClick={() => entry?.id && navigate(`/user/analysis/${entry.id}`)}>View analysis</button> 


                </div>
          ))
        )}
            </div>
        </>
    );
};
