import { useState, useCallback, useEffect } from "react";
import { Container, Title, Paper, Alert, Card, Stack, Group, Text, Button, Modal, rem, Loader } from "@mantine/core";
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
  // Core state
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [analysisEntryId, setAnalysisEntryId] = useState(null);
  const [error, setError] = useState(null);
  
  // Loading states for different steps
  const [validationLoading, setValidationLoading] = useState(false);
  const [dataFetchLoading, setDataFetchLoading] = useState(false);
  
  // Workflow step states
  const [currentStep, setCurrentStep] = useState('input'); // input, permissions, security, analysis
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showStoppedRecordingModal, setShowStoppedRecordingModal] = useState(false);
  
  const { isRecording, stopAllStreams, hasPermissions, permissionStatus } = useMediaPermissions();

  // Step 1: Validate analysis ID
  const handleSubmitId = async (submittedAnalysisId) => {
    if (!submittedAnalysisId || !submittedAnalysisId.trim()) {
      setError("Please enter an analysis ID");
      return;
    }

    try {
      setValidationLoading(true);
      setError(null);
      setAnalysisId(submittedAnalysisId);

      // Step 1: Only validate if analysis exists and has spots available
      const response = await apiClient.post("/api/v1/analysis/validate-participation", {
        analysisId: submittedAnalysisId
      });

      if (response?.data?.success) {
        // Move to permissions step
        setCurrentStep('permissions');
      } else {
        setError("Analysis not found or no spots available. Please check your analysis ID and try again.");
        setAnalysisId(null);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setError("Analysis not found. Please check your analysis ID and try again.");
      } else if (err?.response?.status === 400) {
        setError("No spots available for this analysis.");
      } else {
        setError(err?.response?.data?.message || "An error occurred while validating the analysis");
      }
      setAnalysisId(null);
    } finally {
      setValidationLoading(false);
    }
  };

  // Step 3: Handle security modal acceptance
  const handleAcceptSecurity = async () => {
    setShowSecurityModal(false);
    
    try {
      setDataFetchLoading(true);
      setError(null);

      // Step 4: Fetch analysis data and get analysisEntryId
      const response = await apiClient.post("/api/v1/analysis/participate", {
        analysisId
      });

      if (response?.data?.success) {
        setAnalysisData(response.data.analysisData);
        setAnalysisEntryId(response.data.analysisEntryId);
        setCurrentStep('analysis');
      } else {
        setError("Failed to fetch analysis data. Please try again.");
        setCurrentStep('permissions');
      }
    } catch (err) {
      setError(err?.response?.data?.message || "An error occurred while fetching the analysis data");
      setCurrentStep('permissions');
    } finally {
      setDataFetchLoading(false);
    }
  };

  const handleDeclineSecurity = () => {
    setShowSecurityModal(false);
    setCurrentStep('permissions');
  };

  const handleExitAnalysis = useCallback(() => {
    // Stop all media streams
    stopAllStreams();
    
    // Reset ALL state to initial values
    setAnalysisData(null);
    setAnalysisId(null);
    setAnalysisEntryId(null);
    setError(null);
    setCurrentStep('input');
    setShowSecurityModal(false);
    setShowStoppedRecordingModal(false);
    setValidationLoading(false);
    setDataFetchLoading(false);
  }, [stopAllStreams]);

  const handlePermissionsGranted = useCallback(() => {
    // Permissions have been granted, user can proceed
  }, []);

  // Step 2: Handle permissions granted and next button
  const handlePermissionsNext = useCallback(() => {
    // When user clicks next after granting permissions, show security modal
    setShowSecurityModal(true);
  }, []);

  // Monitor permission status changes during analysis
  useEffect(() => {
    // If we're in the middle of an analysis and permissions are lost
    if (currentStep === 'analysis' && permissionStatus === 'denied' && analysisData) {
      setShowStoppedRecordingModal(true);
    }
  }, [permissionStatus, currentStep, analysisData]);

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

      {/* Step 1: Input Analysis ID */}
      {currentStep === 'input' && (
        <>
          <Instructions phase="setup" />
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <ParticipateForm onSubmitId={handleSubmitId} loading={validationLoading} />
          </Paper>
        </>
      )}

      {/* Step 2: Permissions Setup */}
      {currentStep === 'permissions' && (
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
            <Text>Loading analysis data...</Text>
          </Stack>
        </Card>
      )}

      {/* Step 4-6: Analysis Recording and Upload */}
      {currentStep === 'analysis' && analysisData && (
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
              analysisId={analysisId}
            />
          </Card>
        </>
      )}

      {/* Error Display */}
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