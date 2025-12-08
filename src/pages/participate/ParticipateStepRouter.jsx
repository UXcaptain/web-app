import { useEffect } from "react";
import { Alert, Card, Stack, Loader, Modal, Text, Button, Group } from "@mantine/core";
import { IconAlertCircle, IconAlertTriangle } from "@tabler/icons-react";
import { FormStep } from "./steps/FormStep";
import { PermissionsStep } from "./steps/PermissionsStep";
import { RecordingStep } from "./steps/RecordingStep";
import { SecurityModal } from "./SecurityModal";
import { useMediaPermissions } from "../../contexts/MediaPermissionsContext";

export const ParticipateStepRouter = ({
  currentStep,
  setCurrentStep,
  analysisData,
  analysisId,
  analysisEntryId,
  analysisPresignedUploadUrl,
  error,
  setError,
  validationLoading,
  dataFetchLoading,
  showSecurityModal,
  setShowSecurityModal,
  showStoppedRecordingModal,
  setShowStoppedRecordingModal,
  handleSubmitId,
  handleAcceptSecurity,
  handleDeclineSecurity,
  handleExitAnalysis,
  handlePermissionsNext,
  handlePermissionsGranted,
  handleRecordingStoppedConfirm,
  buildAnalysisSteps,
  urlAnalysisId
}) => {
  const { permissionStatus } = useMediaPermissions();

  // Monitor permission status changes during analysis
  useEffect(() => {
    // If we're in the middle of an analysis and permissions are lost
    if (currentStep === 'analysis' && permissionStatus === 'denied' && analysisData) {
      setShowStoppedRecordingModal(true);
    }
  }, [permissionStatus, currentStep, analysisData]);

  return (
    <>
      {/* Step 1: Input Analysis ID */}
      {currentStep === 'input' && (
        <FormStep
          onSubmitId={handleSubmitId}
          defaultValue={urlAnalysisId || ""}
          loading={validationLoading}
        />
      )}

      {/* Step 2: Permissions Setup */}
      {currentStep === 'permissions' && (
        <PermissionsStep
          onPermissionsNext={handlePermissionsNext}
          onExit={handleExitAnalysis}
          onPermissionsGranted={handlePermissionsGranted}
        />
      )}

      {/* Step 3: Security Modal */}
      <SecurityModal
        opened={showSecurityModal}
        onAccept={handleAcceptSecurity}
        onDecline={handleDeclineSecurity}
      />

      {/* Loading state for data fetching */}
      {dataFetchLoading && (
        <Card withBorder shadow="md" p="lg" mt="md" radius="md">
          <Stack align="center" spacing="md">
            <Loader size="lg" />
            <Text>Cargando datos del análisis...</Text>
          </Stack>
        </Card>
      )}

      {/* Step 4: Analysis Recording and Upload */}
      {currentStep === 'analysis' && analysisData && (
        <RecordingStep
          analysisData={analysisData}
          analysisEntryId={analysisEntryId}
          analysisId={analysisId}
          analysisPresignedUploadUrl={analysisPresignedUploadUrl}
          onExit={handleExitAnalysis}
          buildAnalysisSteps={buildAnalysisSteps}
        />
      )}

      {/* Error Display */}
      {error && currentStep !== 'input' && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          mt="md"
        >
          {error}
        </Alert>
      )}

      {/* Recording Stopped Warning Modal */}
      <Modal
        opened={showStoppedRecordingModal}
        onClose={() => {}}
        centered
        size="md"
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <Stack align="center" spacing="md">
          <IconAlertTriangle size={64} color="orange" />
          <Text size="xl" fw={600}>La grabación se ha detenido</Text>
          <Text size="sm" c="dimmed" ta="center">
            Se ha detenido el uso compartido de pantalla o el acceso al micrófono.
            El análisis no puede continuar sin grabación.
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            Tu análisis y los datos asociados han sido eliminados.
          </Text>
          <Button
            color="red"
            onClick={handleRecordingStoppedConfirm}
            fullWidth
          >
            Salir del Análisis
          </Button>
        </Stack>
      </Modal>
    </>
  );
};