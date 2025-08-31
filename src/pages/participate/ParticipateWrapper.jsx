import { useState, useCallback, useEffect } from "react";
import { Container, Title, Paper, Alert, Card, Stack, Group, Text, Button, Modal, rem } from "@mantine/core";
import { IconAlertCircle, IconVideo, IconAlertTriangle } from "@tabler/icons-react";
import { ParticipateForm } from "./ParticipateForm";
import { SecurityModal } from "./SecurityModal";
import Timer from "../../components/partials/Timer.jsx";
import { AnalysisStepNavigator } from "../../components/partials/AnalysisStepNavigator.jsx";
import { MediaPermissionsStep } from "../../components/partials/MediaPermissionsStep.jsx";
import { Instructions } from "../../components/partials/Instructions.jsx";
import { MediaPermissionsProvider, useMediaPermissions } from "../../contexts/MediaPermissionsContext";
import apiClient from "../../config/API/axiosConfig.mjs";
import { SiteFooter } from "../../components/partials/SiteFooter";

// Inner component that uses the media permissions context
const ParticipateContent = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityAccepted, setSecurityAccepted] = useState(false);
  const [showPermissionsOnly, setShowPermissionsOnly] = useState(false);
  const [showStoppedRecordingModal, setShowStoppedRecordingModal] = useState(false);
  const [analysisEntryId, setAnalysisEntryId] = useState(null);
  const { isRecording, stopAllStreams, hasPermissions, permissionStatus } = useMediaPermissions();

  const handleSubmitId = async (submittedAnalysisId) => {
    if (!submittedAnalysisId || !submittedAnalysisId.trim()) {
      setError("Please enter an analysis ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAnalysisId(submittedAnalysisId);

      // First, check if analysis exists
      const response = await apiClient.post("/api/v1/guestParticipant", { analysisId: submittedAnalysisId });

      if (response?.data?.success) {
        setAnalysisData(response.data.analysisData);
        setAnalysisEntryId(response.data.analysisEntryId);
        // Show permissions screen first
        setShowPermissionsOnly(true);
      } else {
        setError("Analysis not found. Please check your analysis ID and try again.");
        setAnalysisId(null);
        setAnalysisEntryId(null);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setError("Analysis not found. Please check your analysis ID and try again.");
      } else {
        setError(err?.response?.data?.message || "An error occurred while fetching the analysis");
      }
      setAnalysisId(null);
      setAnalysisEntryId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSecurity = () => {
    setShowSecurityModal(false);
    setSecurityAccepted(true);
    setShowPermissionsOnly(false);
  };

  const handleDeclineSecurity = () => {
    setShowSecurityModal(false);
    setSecurityAccepted(false);
    setShowPermissionsOnly(true);
    // Don't clear analysis data, let user try again
  };

  const handleExitAnalysis = useCallback(() => {
    // Stop all media streams
    stopAllStreams();
    
    // Reset ALL state to initial values
    setAnalysisData(null);
    setAnalysisId(null);
    setAnalysisEntryId(null);
    setError(null);
    setShowSecurityModal(false);
    setSecurityAccepted(false);
    setShowPermissionsOnly(false);
    setShowStoppedRecordingModal(false);
    setLoading(false);
    
    // Could also navigate away if needed
    // navigate('/');
  }, [stopAllStreams]);

  const handlePermissionsGranted = useCallback(() => {
    // Permissions have been granted, user can proceed
  }, []);

  const handlePermissionsNext = useCallback(() => {
    // When user clicks next after granting permissions, show security modal
    if (!securityAccepted) {
      setShowSecurityModal(true);
    }
  }, [securityAccepted]);

  // Monitor permission status changes during analysis
  useEffect(() => {
    // If we're in the middle of an analysis and permissions are lost
    if (securityAccepted && permissionStatus === 'denied' && analysisData) {
      setShowStoppedRecordingModal(true);
    }
  }, [permissionStatus, securityAccepted, analysisData]);

  const handleRecordingStoppedConfirm = useCallback(() => {
    // User acknowledged the recording stopped - exit analysis
    setShowStoppedRecordingModal(false);
    handleExitAnalysis();
  }, [handleExitAnalysis]);

  // Build the steps array WITHOUT permissions (since it's handled separately now)
  const buildAnalysisSteps = useCallback(() => {
    if (!analysisData) return [];

    const steps = [];

    // Step 1: Scenario (permissions already handled before this)
    steps.push({
      title: "Scenario",
      content: <Text>{analysisData.scenario}</Text>
    });

    // Step 2: URL
    steps.push({
      title: "URL",
      content: (() => {
        const raw = analysisData.analysisUrl || "";
        const hasProtocol = /^https?:\/\//i.test(raw);
        const href = hasProtocol ? raw : `https://${raw}`;
        return (
          <Text>
            <a href={href} target="_blank" rel="noopener noreferrer">{raw}</a>
          </Text>
        );
      })()
    });

    // Step 3+: Tasks
    (analysisData.tasks || []).forEach((task, index) => {
      steps.push({
        title: `Task ${index + 1}`,
        content: (() => {
          const content = String(task.taskContent ?? "");
          // URL regex: matches http(s) and bare domains like example.com or sub.example.co.uk
          const urlRegex = /(https?:\/\/[^\s]+|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;

          const parts = [];
          let lastIndex = 0;
          let match;

          while ((match = urlRegex.exec(content)) !== null) {
            const urlText = match[0];
            const start = match.index;
            const end = start + urlText.length;

            if (start > lastIndex) {
              parts.push(content.slice(lastIndex, start));
            }

            const hasProtocol = /^https?:\/\//i.test(urlText);
            const href = hasProtocol ? urlText : `https://${urlText}`;

            parts.push(
              <a key={`${index}-link-${start}`} href={href} target="_blank" rel="noopener noreferrer">{urlText}</a>
            );

            lastIndex = end;
          }

          if (lastIndex < content.length) {
            parts.push(content.slice(lastIndex));
          }

          return <Text>{parts.length ? parts : content}</Text>;
        })()
      });
    });

    return steps;
  }, [analysisData]);

  return (
    <Container size="sm" my={40}>
      <Title ta="center" mb="xl">Participate in Analysis</Title>

      {!analysisId && (
        <>
          <Instructions phase="setup" />
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <ParticipateForm onSubmitId={handleSubmitId} loading={loading} />
          </Paper>
        </>
      )}

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          mt="md"
        >
          {error}
        </Alert>
      )}

      <SecurityModal
        opened={showSecurityModal}
        onAccept={handleAcceptSecurity}
        onDecline={handleDeclineSecurity}
      />

      {analysisData && !showSecurityModal && (
        <>
          {/* Show only permissions step initially */}
          {showPermissionsOnly && !securityAccepted && (
            <Card withBorder shadow="md" p="lg" mt="md" radius="md">
              <Stack spacing="md">
                <Text size="lg" fw={500}>Setup Recording Permissions</Text>
                <MediaPermissionsStep
                  onPermissionsGranted={handlePermissionsGranted}
                  onExit={handleExitAnalysis}
                />
                <Group justify="flex-end">
                  <Button
                    onClick={handlePermissionsNext}
                    disabled={!hasPermissions()}
                  >
                    Next
                  </Button>
                </Group>
              </Stack>
            </Card>
          )}

          {/* Show full analysis steps after security is accepted */}
          {securityAccepted && (
            <>
              {/* Timer Card - only show when recording is active */}
              {isRecording && (
                <>
                  <Instructions phase="analysis" />
                  <Card withBorder shadow="md" p="lg" mt="xl" radius="md">
                    <Stack align="center" spacing="xs">
                      <Group gap="xs" align="center">
                        <IconVideo size={20} color="red" />
                        <Text c="red" fw={600}>Recording in progress</Text>
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
                  onExit={handleExitAnalysis}
                  analysisData={analysisData}
                  analysisEntryId={analysisEntryId}
                />
              </Card>
            </>
          )}
        </>
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
          <Text size="xl" fw={600}>Recording Stopped</Text>
          <Text size="sm" c="dimmed" ta="center">
            Screen sharing or microphone access has been stopped.
            The analysis cannot continue without recording.
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            Your analysis will be cancelled and any recorded data will be discarded.
          </Text>
          <Button
            color="red"
            onClick={handleRecordingStoppedConfirm}
            fullWidth
          >
            Exit Analysis
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
};

// Main wrapper component that provides the context
export const ParticipateWrapper = () => {
  return (
    <MediaPermissionsProvider>
      <ParticipateContent />
      <SiteFooter />
    </MediaPermissionsProvider>
  );
};