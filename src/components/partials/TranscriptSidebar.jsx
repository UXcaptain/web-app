import { 
  Box, 
  Title, 
  ScrollArea, 
  Stack, 
  Card, 
  Group, 
  Text,
  Highlight
} from '@mantine/core';

const TranscriptSidebar = ({ transcript, activeTranscriptId, onTranscriptClick, formatTime }) => {
  return (
    <Box style={{
      width: '400px',
      backgroundColor: 'var(--mantine-color-gray-0)',
      borderLeft: '1px solid var(--mantine-color-gray-3)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Title order={4}>Transcripción</Title>
      </Box>
      
      <ScrollArea style={{ flex: 1 }} type="auto">
        <Stack spacing="xs" p="md">
          {transcript.map((segment) => (
            <Card
              key={`${segment.id}-${segment.start}`}
              p="xs"
              shadow="xs"
              radius="sm"
              withBorder
              onClick={() => onTranscriptClick(segment.start)}
              style={{
                cursor: 'pointer',
                backgroundColor: activeTranscriptId === segment.id ? 'var(--mantine-color-blue-1)' : 'transparent',
                border: activeTranscriptId === segment.id ? '1px solid var(--mantine-color-blue-5)' : '1px solid var(--mantine-color-gray-3)'
              }}
            >
              <Group position="apart" align="flex-start">
                <Text size="xs" color="blue" fw={500} w={60} style={{ flexShrink: 0 }}>
                  {formatTime(segment.start)}
                </Text>
                <Text size="sm" style={{ flex: 1 }} component="div">
                  <Highlight highlight={activeTranscriptId === segment.id ? [] : []}>
                    {segment.text}
                  </Highlight>
                </Text>
              </Group>
            </Card>
          ))}
        </Stack>
      </ScrollArea>
    </Box>
  );
};

export default TranscriptSidebar;