import { useState, useEffect } from 'react';
import apiClient from '../../config/API/axiosConfig.mjs';
import { useParams } from 'react-router';
import { AnalysisEntriesTable } from './AnalysisEntriesTable';
import { Container, Title, Text, Loader, Alert, Stack, List, ListItem, Card, Anchor, Divider, Grid, Badge, Group } from '@mantine/core';
import { CopyInviteLinkButton } from '../../components/partials/CopyInviteLinkButton';

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

  // Calculate statistics
  const participantCount = analysisData.AnalysisEntries?.length || 0;
  const maxParticipants = analysisData.max_number_of_participants || 0;

  return (
    <Container size="lg">

      
      <Card shadow="sm" padding="sm" radius="md" withBorder mb="lg">
        <Stack spacing="xs">
          <Text size="sm"><strong>Nombre del análisis:</strong> {analysisData.name}</Text>
          <Text size="sm"><strong>URL:</strong> <Anchor href={analysisData.url} target="_blank" size="sm">{analysisData.url}</Anchor></Text>
          <Group spacing="xs" align="center">
            <Text size="sm" component="span"><strong>Dispositivo:</strong></Text>
            <Badge color={analysisData.device === 'computer' ? 'blue' : 'green'} size="sm">{analysisData.device === 'computer' ? 'Ordenador' : 'Móvil'}</Badge>
          </Group>
          <Text size="sm"><strong>Fecha de Creación:</strong> {new Date(analysisData.created_at).toLocaleDateString('es-ES', { 
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit' 
            })
          }</Text>
          
          {analysisData.scenario && (
            <Text size="sm"><strong>Escenario:</strong> {analysisData.scenario}</Text>
          )}
          
          <Divider my="xs" />
          
          <Group position="apart">
            <Text size="sm"><strong>Participantes:</strong> {participantCount} de {maxParticipants}</Text>
            <CopyInviteLinkButton analysisId={id} size="xs" />
          </Group>
        </Stack>
      </Card>
      
      <Card shadow="sm" padding="sm" radius="md" withBorder mb="lg">
        <Text size="md" fw={700} mb="xs">Tareas</Text>
        <List type="ordered" spacing="xs" size="sm">
          {analysisData.tasks.map((task, index) => (
            <ListItem key={index} py="xs">
              <Text size="sm">{task.taskContent}</Text>
            </ListItem>
          ))}
        </List>
      </Card>
      
      <Card shadow="sm" padding="sm" radius="md" withBorder>
        <Text size="md" fw={700} mb="xs">Participantes</Text>
        <AnalysisEntriesTable AnalysisEntries={analysisData.AnalysisEntries} analysisId={id} />
      </Card>
    </Container>
  );
};
