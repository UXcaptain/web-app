import {
  Box,
  Title,
  ScrollArea,
  Stack,
  Card,
  Group,
  Text,
  Highlight,
  Tabs,
} from '@mantine/core';
import { useMemo } from 'react';

export const VideoPlayerSidebar = ({
  transcript,
  activeTranscriptId,
  onTranscriptClick,
  formatTime,
  participant = {},
  tasks = [],
  notes = [],
  scenario = '',
}) => {
  // Memoized transcript transformation to avoid expensive recalculations
  const transformedTranscript = useMemo(() => {
    if (!transcript) return null;
    
    // Handle case where transcript is already the transcription array
    if (Array.isArray(transcript)) {
      return transcript.map((segment, index) => ({
        id: index,
        start: segment.start_time,
        text: segment.transcript,
        end_time: segment.end_time
      }));
    }
    
    // Handle new API response format
    if (transcript.transcription && Array.isArray(transcript.transcription)) {
      return transcript.transcription.map((segment, index) => ({
        id: index,
        start: segment.start_time,
        text: segment.transcript,
        end_time: segment.end_time
      }));
    }
    
    return null;
  }, [transcript]);
  
  // Simple check for transcript tab visibility
  const hasTranscript = transcript !== null;
  
  // Set default tab based on transcript availability
  const defaultTab = hasTranscript ? "transcript" : "tasks";

  return (
    <Box style={{
      width: '400px',
      backgroundColor: 'var(--mantine-color-gray-0)',
      borderLeft: '1px solid var(--mantine-color-gray-3)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100%'
    }}>
      
      <Tabs defaultValue={defaultTab} orientation="horizontal">
        <Tabs.List style={{ flexWrap: 'wrap', padding: '0 10px' }}>
          {/* <Tabs.Tab value="participant">Participante</Tabs.Tab> // TODO -- Add participants view */}
          <Tabs.Tab value="tasks">Tareas</Tabs.Tab>
          {/* <Tabs.Tab value="notes">Notas</Tabs.Tab> // TODO - Add notes view */}
          {hasTranscript && <Tabs.Tab value="transcript">Transcripción</Tabs.Tab>}
        </Tabs.List>

        <Tabs.Panel value="participant" p="md" style={{ flex: 1 }}>
          <ScrollArea style={{ height: 'calc(100vh - 180px)' }} type="auto">
            <Stack spacing="xs">
              <Card p="sm" shadow="xs" radius="sm" withBorder>
                <Title order={5} mb="xs">Detalles del Participante</Title>
                <Text size="sm"><strong>ID:</strong> {participant.name || 'N/A'}</Text>
                <Text size="sm"><strong>Edad:</strong> {participant.age || 'N/A'}</Text>
                <Text size="sm"><strong>Género:</strong> {participant.gender || 'N/A'}</Text>
              </Card>
            </Stack>
          </ScrollArea> 
        </Tabs.Panel>

        <Tabs.Panel value="tasks" p="md" style={{ flex: 1 }}>
          <ScrollArea style={{ height: 'calc(100vh - 180px)' }} type="auto">
            <Stack spacing="xs">
              <Card p="sm" shadow="xs" radius="sm" withBorder>
                <Title order={5} mb="xs">Escenario de los participantes</Title>
                

                  <Stack spacing="xs">
                    <Text size="sm">{scenario}</Text>
                  </Stack>


              </Card>
              <Card p="sm" shadow="xs" radius="sm" withBorder>
                <Title order={5} mb="xs">Tareas del análisis</Title>
                {tasks && tasks.length > 0 ? (
                  <Stack spacing="xs">
                    {tasks.map((task, index) => (
                      <Box key={index}>
                        <Text size="sm" fw={500}>{task.title || `Tarea ${index + 1}`}</Text>
                        <Text size="sm">{task.description || 'Sin descripción'}</Text>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Text size="sm">No hay tareas definidas</Text>
                )}
              </Card>
            </Stack>
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="notes" p="md" style={{ flex: 1 }}>
          <ScrollArea style={{ height: 'calc(100vh - 180px)' }} type="auto">
            <Stack spacing="xs">
              <Card p="sm" shadow="xs" radius="sm" withBorder>
                <Title order={5} mb="xs">Notas del Análisis</Title>
                {notes && notes.length > 0 ? (
                  <Stack spacing="xs">
                    {notes.map((note, index) => (
                      <Box key={index}>
                        <Text size="sm">{note.content || 'Sin contenido'}</Text>
                        {note.timestamp && (
                          <Text size="xs" color="dimmed">Tiempo: {formatTime ? formatTime(note.timestamp) : note.timestamp}</Text>
                        )}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Text size="sm">No hay notas registradas</Text>
                )}
              </Card>
            </Stack>
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="transcript" p="md" style={{ flex: 1 }}>
          <ScrollArea style={{ height: 'calc(100vh - 180px)' }} type="auto">
            <Stack spacing="xs">
              <Text size="sm" color="dimmed" >Haz click para navegar a un momento específico</Text>
              
              {transformedTranscript && transformedTranscript.length > 0 ? (
                transformedTranscript.map((segment) => (
                  <Card
                    key={`${segment.id}-${segment.start}`}
                    p="xs"
                    shadow="xs"
                    radius="sm"
                    withBorder
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onTranscriptClick && onTranscriptClick(segment.start);
                    }}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: activeTranscriptId === segment.id ? 'var(--mantine-color-blue-1)' : 'transparent',
                      border: activeTranscriptId === segment.id ? '1px solid var(--mantine-color-blue-5)' : '1px solid var(--mantine-color-gray-3)'
                    }}
                  >
                    <Group position="apart" align="flex-start">
                      <Text size="xs" color="blue" fw={500} w={60} style={{ flexShrink: 0 }}>
                        {formatTime && segment.start ? formatTime(segment.start) : segment.start?.toFixed(1) || '0.0'}
                      </Text>
                      <Text size="sm" style={{ flex: 1 }} component="div">
                        <Highlight highlight={activeTranscriptId === segment.id ? [] : []}>
                          {segment.text}
                        </Highlight>
                      </Text>
                    </Group>
                  </Card>
                ))
              ) : (
                <Text size="sm">La transcripción aún no está disponible</Text>
              )}
            </Stack>
          </ScrollArea>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};