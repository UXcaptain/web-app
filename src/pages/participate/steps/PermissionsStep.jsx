import { useCallback } from "react";
import { Card, Stack, Text, Button, Group } from "@mantine/core";
import { MediaPermissionsStep } from "../../../components/partials/MediaPermissionsStep";
import { useMediaPermissions } from "../../../contexts/MediaPermissionsContext";

export const PermissionsStep = ({ onPermissionsNext, onExit, onPermissionsGranted }) => {
  const { hasPermissions } = useMediaPermissions();

  return (
    <Card withBorder shadow="md" p="lg" mt="md" radius="md">
      <Stack spacing="md">
        <Text size="lg" fw={500}>Setup Recording Permissions</Text>
        <MediaPermissionsStep
          onPermissionsGranted={onPermissionsGranted}
          onExit={onExit}
        />
        <Group justify="flex-end">
          <Button
            onClick={onPermissionsNext}
            disabled={!hasPermissions()}
          >
            Next
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};