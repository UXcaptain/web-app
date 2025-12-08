import { Card, Stack, Group, Text, rem } from "@mantine/core";
import { IconVideo } from "@tabler/icons-react";
import { AnalysisStepNavigator } from "../../../components/partials/AnalysisStepNavigator";
import { Instructions } from "../../../components/partials/Instructions";
import Timer from "../../../components/partials/Timer";
import { useMediaPermissions } from "../../../contexts/MediaPermissionsContext";

export const RecordingStep = ({
  analysisData,
  analysisEntryId,
  analysisId,
  analysisPresignedUploadUrl,
  onExit,
  buildAnalysisSteps
}) => {
  const { isRecording } = useMediaPermissions();

  return (
    <>
      {/* Timer Card - only show when recording is active */}
      {isRecording && (
        <>
          <Instructions phase="analysis" />
          <Card withBorder shadow="md" p="lg" mt="xl" radius="md">
            <Stack align="center" spacing="xs">
              <Group gap="xs" align="center">
                <IconVideo size={20} color="red" />
                <Text c="red" fw={600}>Grabación en progreso</Text>
              </Group>
              <div style={{ fontSize: rem(40), fontWeight: 700, textAlign: "center" }}>
                <Timer analysisData={analysisData} />
              </div>
            </Stack>
          </Card>
        </>
      )}

      {/* Analysis content Card */}
      <Card withBorder shadow="md" p="lg" mt="md" radius="md">
        <AnalysisStepNavigator
          steps={buildAnalysisSteps()}
          onExit={onExit}
          analysisData={analysisData}
          analysisEntryId={analysisEntryId}
          analysisId={analysisId}
          analysisPresignedUploadUrl={analysisPresignedUploadUrl}
        />
      </Card>
    </>
  );
};