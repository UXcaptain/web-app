import { useState, useEffect } from 'react';
import apiClient from '../../config/API/axiosConfig.mjs';
import { useParams } from 'react-router';
import { AnalysisEntriesTable } from './AnalysisEntriesTable';

export const ViewAnalysisPage = () => {
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);


    const { id } = useParams();


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
  <div>Cargando datos del análisis...</div>
)

if (error) return (
  <div>Ha habido un error: {error}</div>
)

    return (
        <>
        <div className="analysisData">
        <h2>Resumen del análisis</h2>
          <p><b>Titulo:</b> {analysisData.name}</p>
          <p><b>url:</b> {analysisData.url}</p>
          <p><b>Participantes:</b> {analysisData.max_number_of_participants}</p>
          <p><b>Fecha de creación</b> {analysisData.created_at}</p>
          <p><b>Tareas:</b></p>
          <ul>

            { analysisData && analysisData.tasks &&  analysisData.tasks.map((task) => (
              <div key={task.id} className="taskDetails">
              <p className="taskType">{task.taskType}</p>
              <p className="taskContent">{task.taskContent}</p>
              </div>
            ))}
          </ul>
        </div>


          <AnalysisEntriesTable participants={analysisData.AnalysisEntries} />
        </>
    );
};
