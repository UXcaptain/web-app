import { Card, Text, List, ThemeIcon, Stack } from '@mantine/core';
import { IconInfoCircle, IconScreenShare, IconMicrophone, IconPlayerPlay, IconAlertTriangle } from '@tabler/icons-react';

export const Instructions = ({ phase = 'setup' }) => {
  const setupInstructions = [
    "Enter your analysis ID provided by the researcher",
    "Grant permission to share your screen and microphone when prompted",
    "Review and accept the security terms before starting",
    "Follow the step-by-step instructions during the analysis"
  ];

  const analysisInstructions = [
    "Complete each task as instructed",
    "Your screen and audio are being recorded for research purposes",
    "Do not close this window or stop sharing until analysis is complete",
    "If you need to stop, click the 'Exit Analysis' button"
  ];

  const warnings = [
    "Do not navigate away from this page during recording",
    "Ensure your microphone is working properly",
    "Make sure your screen content is appropriate for recording",
    "If recording stops unexpectedly, the analysis will be cancelled"
  ];

  return (
    <Card withBorder shadow="sm" p="lg" radius="md" mb="xl">
      <Stack spacing="md">
        <Text size="lg" fw={600} c="blue">
          <IconInfoCircle size={20} style={{ marginRight: 8 }} />
          Instructions
        </Text>
        
        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <ThemeIcon color="blue" size={24} radius="xl">
              <IconPlayerPlay size={16} />
            </ThemeIcon>
          }
        >
          {(phase === 'setup' ? setupInstructions : analysisInstructions).map((instruction, index) => (
            <List.Item key={index}>{instruction}</List.Item>
          ))}
        </List>
        
        {phase === 'analysis' && (
          <>
            <Text size="md" fw={600} c="orange" mt="md">
              <IconAlertTriangle size={20} style={{ marginRight: 8 }} />
              Important Reminders
            </Text>
            
            <List
              spacing="xs"
              size="sm"
              center
              icon={
                <ThemeIcon color="orange" size={24} radius="xl">
                  <IconAlertTriangle size={16} />
                </ThemeIcon>
              }
            >
              {warnings.map((warning, index) => (
                <List.Item key={index}>{warning}</List.Item>
              ))}
            </List>
          </>
        )}
      </Stack>
    </Card>
  );
};