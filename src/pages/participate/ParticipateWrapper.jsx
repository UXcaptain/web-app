import { useState, useCallback } from "react";
import { Container, Title, Paper, Alert, Card, Stack, Group, Text, rem } from "@mantine/core";
import { IconAlertCircle, IconVideo } from "@tabler/icons-react";
import { ParticipateForm } from "./ParticipateForm";
import { SecurityModal } from "./SecurityModal";
import Timer from "../../components/partials/Timer.jsx";
import { AnalysisStepNavigator } from "../../components/partials/AnalysisStepNavigator.jsx";
import { MediaPermissionsStep } from "../../components/partials/MediaPermissionsStep.jsx";
import { MediaPermissionsProvider, useMediaPermissions } from "../../contexts/MediaPermissionsContext";
import apiClient from "../../config/API/axiosConfig.mjs";

// Inner component that uses the media permissions context
const ParticipateContent = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const { isRecording, stopAllStreams } = useMediaPermissions();

  const handleSubmitId = async (submittedAnalysisId) => {
    if (!submittedAnalysisId || !submittedAnalysisId.trim()) {
      setError("Please enter an analysis ID");
      return;
    }

    // Store the analysis ID and show security modal without making API call yet
    setAnalysisId(submittedAnalysisId);
    setShowSecurityModal(true);
    setError(null);
  };

  const fetchAnalysisData = async () => {
    if (!analysisId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post("/api/v1/guestParticipant", { analysisId });

      if (response?.data?.success) {
        setAnalysisData(response.data.analysisData);
      } else {
        setError(response?.data?.message || "Failed to retrieve analysis data");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSecurity = () => {
    setShowSecurityModal(false);
    fetchAnalysisData();
  };

  const handleDeclineSecurity = () => {
    setShowSecurityModal(false);
    setAnalysisId(null);
    setAnalysisData(null);
  };

  const handleExitAnalysis = useCallback(() => {
    // Stop all media streams
    stopAllStreams();
    
    // Reset state
    setAnalysisData(null);
    setAnalysisId(null);
    setError(null);
    
    // Could also navigate away if needed
    // navigate('/');
  }, [stopAllStreams]);

  const handlePermissionsGranted = useCallback(() => {
    // Permissions have been granted, the Next button in the navigator will be enabled
    console.log('Permissions granted, user can proceed to next step');
  }, []);

  // Build the steps array with the permissions step first
  const buildAnalysisSteps = useCallback(() => {
    if (!analysisData) return [];

    const steps = [];

    // Step 1: Permissions Setup (mandatory first step)
    steps.push({
      title: "Setup Recording",
      content: (
        <MediaPermissionsStep 
          onPermissionsGranted={handlePermissionsGranted}
          onExit={handleExitAnalysis}
        />
      )
    });

    // Step 2: Scenario
    steps.push({
      title: "Scenario",
      content: <Text>{analysisData.scenario}</Text>
    });

    // Step 3: URL
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

    // Step 4+: Tasks
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
  }, [analysisData, handlePermissionsGranted, handleExitAnalysis]);

  return (
    <Container size="sm" my={40}>
      <Title ta="center" mb="xl">Participate in Analysis</Title>

      {!analysisId && (
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <ParticipateForm onSubmitId={handleSubmitId} loading={loading} />
        </Paper>
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
          {/* Timer Card - only show when recording is active */}
          {isRecording && (
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
          )}

          {/* Analysis content Card with permissions step */}
          <Card withBorder shadow="md" p="lg" mt="md" radius="md">
            <AnalysisStepNavigator
              steps={buildAnalysisSteps()}
              onExit={handleExitAnalysis}
              analysisData={analysisData}
            />
          </Card>
        </>
      )}
    </Container>
  );
};

// Main wrapper component that provides the context
export const ParticipateWrapper = () => {
  return (
    <MediaPermissionsProvider>
      <ParticipateContent />
    </MediaPermissionsProvider>
  );
};