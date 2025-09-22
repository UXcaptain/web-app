import { useState, useEffect } from 'react';
import apiClient from '../../config/API/axiosConfig.mjs';
import { useParams } from 'react-router';
import { AnalysisEntriesTable } from './AnalysisEntriesTable';
import { Container, Title, Text, Loader, Alert, Stack, List, ListItem, Card, Anchor } from '@mantine/core';

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
  <Container>
    <Stack align="center">
      <Loader size="xl" />
      <Text>Cargando datos del análisis...</Text>
    </Stack>
  </Container>
)

if (error) return (
  <Container>
    <Alert color="red" title="Error">
      {error}
    </Alert>
  </Container>
)

    return (
      <Container>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack>
            <Text><strong>Id:</strong> {analysisData.id}</Text>
            <Text><strong>Titulo:</strong> {analysisData.name}</Text>
            <Text><strong>URL:</strong> <Anchor href={analysisData.url} target="_blank">{analysisData.url}</Anchor></Text>
            <Text><strong>Participantes:</strong> {analysisData.max_number_of_participants}</Text>
            <Text><strong>Fecha de creación:</strong> {new Date(analysisData.created_at).toLocaleDateString('es-ES')}</Text>
            <Text><strong>Tareas:</strong></Text>
            <List type="ordered">
              {analysisData.tasks.map((task) => (
                <ListItem key={task.id}>
                  <Text>{task.taskContent}</Text>
                </ListItem>
              ))}
            </List>
          </Stack>
        </Card>
        <AnalysisEntriesTable AnalysisEntries={analysisData.AnalysisEntries} />
      </Container>
    );
};
