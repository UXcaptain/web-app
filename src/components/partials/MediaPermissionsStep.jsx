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
      <Alert icon={<IconInfoCircle size={16} />} title="Configuración de permisos" color="blue">
        <Text size="sm">
          Para participar en el análisis, es necesario que compartas tu pantalla y tu micrófono
        </Text>
      </Alert>

      {/* Permission Status Cards */}
      <Group grow>
        <Card withBorder padding="sm">
          <Group justify="space-between">
            <Group gap="xs">
              <IconScreenShare size={20} />
              <Text fw={500}>Pantalla</Text>
            </Group>
            {hasScreenPermission ? (
              <Badge color="green" variant="light">
                <Group gap={4}>
                  <IconCheck size={14} />
                  Concedido
                </Group>
              </Badge>
            ) : (
              <Badge color="gray" variant="light">
                <Group gap={4}>
                  <IconX size={14} />
                  Pendiente
                </Group>
              </Badge>
            )}
          </Group>
        </Card>

        <Card withBorder padding="sm">
          <Group justify="space-between">
            <Group gap="xs">
              <IconMicrophone size={20} />
              <Text fw={500}>Micrófono</Text>
            </Group>
            {hasAudioPermission ? (
              <Badge color="green" variant="light">
                <Group gap={4}>
                  <IconCheck size={14} />
                  Concedido
                </Group>
              </Badge>
            ) : (
              <Badge color="gray" variant="light">
                <Group gap={4}>
                  <IconX size={14} />
                  Pendiente
                </Group>
              </Badge>
            )}
          </Group>
        </Card>
      </Group>

      {/* Error Message */}
      {errorMessage && (
        <Alert icon={<IconAlertCircle size={16} />} title="Error en la inicialización" color="red">
          <Stack spacing="xs">
            <Text size="sm">{errorMessage}</Text>
            <Text size="xs" c="dimmed">
              ¿Estás teniendo problemas?, prueba estos pasos:
            </Text>
            <List size="xs" spacing="xs">
              <List.Item>
                <Text size="xs">Asegúrate que no estas en modo navegación privada/incógnito</Text>
              </List.Item>
              <List.Item>
                <Text size="xs">Comprueba que tu navegador tiene permiso para acceder a la pantalla y/o el micrófono</Text>
              </List.Item>
              <List.Item>
                <Text size="xs">Recarga la página y prueba de nuevo</Text>
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
                ? 'Solicitando permisos...' 
                : 'Compartir pantalla y micrófono'}
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
              ¡Permisos concedidos! Pulsa sobre "Siguiente" para iniciar el análisis.
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
          Salir del análisis
        </Button>
      </Stack>

      {/* Information Footer */}
      <Text size="xs" c="dimmed" ta="center">
        La grabación empezará al pulsar sobre "Siguiente"
        Puedes dejar de participar en el análisis y eliminar la grabación en cualquier momento pulsando sobre "Salir del análisis".
      </Text>
    </Stack>
  );
};

MediaPermissionsStep.propTypes = {
  onPermissionsGranted: PropTypes.func,
  onExit: PropTypes.func.isRequired
};