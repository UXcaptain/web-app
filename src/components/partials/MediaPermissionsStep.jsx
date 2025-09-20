import { Button, Stack, Text, Alert, Group, Badge, Card, Loader, List, ThemeIcon } from '@mantine/core';
import { 
  IconScreenShare, 
  IconMicrophone, 
  IconAlertCircle, 
  IconRefresh,
  IconCheck,
  IconX,
  IconExternalLink,
  IconInfoCircle
} from '@tabler/icons-react';
import { useMediaPermissions } from '../../contexts/MediaPermissionsContext';
import PropTypes from 'prop-types';

export const MediaPermissionsStep = ({ onPermissionsGranted, onExit }) => {
  const {
    screenStream,
    audioStream,
    permissionStatus,
    errorMessage,
    requestPermissions,
    hasPermissions
  } = useMediaPermissions();

  const handleRequestPermissions = async () => {
    const result = await requestPermissions();
    if (result && onPermissionsGranted) {
      onPermissionsGranted();
    }
  };

  const handleOpenPermissionSettings = () => {
    // This will open a help page or show instructions
    // Browser permissions can't be directly opened via JS for security reasons
    window.open('https://support.google.com/chrome/answer/2693767', '_blank');
  };

  // Check individual permission states
  const hasScreenPermission = screenStream !== null;
  const hasAudioPermission = audioStream !== null;

  return (
    <Stack spacing="md">
      <Alert icon={<IconInfoCircle size={16} />} title="Recording Setup Required" color="blue">
        <Text size="sm">
          To participate in this analysis, we need to record your screen and microphone. 
          This helps us understand how you interact with the interface.
        </Text>
      </Alert>

      {/* Permission Status Cards */}
      <Group grow>
        <Card withBorder padding="sm">
          <Group justify="space-between">
            <Group gap="xs">
              <IconScreenShare size={20} />
              <Text fw={500}>Screen Sharing</Text>
            </Group>
            {hasScreenPermission ? (
              <Badge color="green" variant="light">
                <Group gap={4}>
                  <IconCheck size={14} />
                  Active
                </Group>
              </Badge>
            ) : (
              <Badge color="gray" variant="light">
                <Group gap={4}>
                  <IconX size={14} />
                  Not Active
                </Group>
              </Badge>
            )}
          </Group>
        </Card>

        <Card withBorder padding="sm">
          <Group justify="space-between">
            <Group gap="xs">
              <IconMicrophone size={20} />
              <Text fw={500}>Microphone</Text>
            </Group>
            {hasAudioPermission ? (
              <Badge color="green" variant="light">
                <Group gap={4}>
                  <IconCheck size={14} />
                  Active
                </Group>
              </Badge>
            ) : (
              <Badge color="gray" variant="light">
                <Group gap={4}>
                  <IconX size={14} />
                  Not Active
                </Group>
              </Badge>
            )}
          </Group>
        </Card>
      </Group>

      {/* Error Message */}
      {errorMessage && (
        <Alert icon={<IconAlertCircle size={16} />} title="Permission Required" color="red">
          <Stack spacing="xs">
            <Text size="sm">{errorMessage}</Text>
            <Text size="xs" c="dimmed">
              If you're having trouble, try the following:
            </Text>
            <List size="xs" spacing="xs">
              <List.Item>
                <Text size="xs">Make sure you're not in incognito/private mode</Text>
              </List.Item>
              <List.Item>
                <Text size="xs">Check that your browser has permission to access screen and microphone</Text>
              </List.Item>
              <List.Item>
                <Text size="xs">Try refreshing the page and starting again</Text>
              </List.Item>
            </List>
          </Stack>
        </Alert>
      )}

      {/* Action Buttons */}
      <Stack spacing="sm">
        {!hasPermissions() ? (
          <>
            <Button
              size="lg"
              leftSection={
                permissionStatus === 'requesting' ? (
                  <Loader size={16} color="white" />
                ) : (
                  <>
                    <IconScreenShare size={16} />
                    <IconMicrophone size={16} style={{ marginLeft: -8 }} />
                  </>
                )
              }
              onClick={handleRequestPermissions}
              loading={permissionStatus === 'requesting'}
              disabled={permissionStatus === 'requesting'}
            >
              {permissionStatus === 'requesting' 
                ? 'Requesting Permissions...' 
                : 'Share Screen & Microphone'}
            </Button>

            {permissionStatus === 'denied' && (
              <Group justify="center" gap="xs">
                <Button
                  variant="subtle"
                  size="sm"
                  leftSection={<IconRefresh size={14} />}
                  onClick={handleRequestPermissions}
                >
                  Try Again
                </Button>
                <Button
                  variant="subtle"
                  size="sm"
                  leftSection={<IconExternalLink size={14} />}
                  onClick={handleOpenPermissionSettings}
                >
                  Browser Settings Help
                </Button>
              </Group>
            )}
          </>
        ) : (
          <Alert color="green" icon={<IconCheck size={16} />}>
            <Text size="sm" fw={500}>
              All permissions granted! Click "Next" to continue with the analysis.
            </Text>
          </Alert>
        )}

        {/* Exit Button */}
        <Button
          variant="outline"
          color="red"
          onClick={onExit}
          disabled={permissionStatus === 'requesting'}
        >
          Exit Analysis
        </Button>
      </Stack>

      {/* Information Footer */}
      <Text size="xs" c="dimmed" ta="center">
        Recording will start automatically when you proceed to the next step.
        You can stop the recording at any time by closing this window.
      </Text>
    </Stack>
  );
};

MediaPermissionsStep.propTypes = {
  onPermissionsGranted: PropTypes.func,
  onExit: PropTypes.func.isRequired
};