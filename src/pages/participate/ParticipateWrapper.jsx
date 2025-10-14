import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Container, Title, Alert, Modal, Text, Button } from "@mantine/core";
import { IconAlertCircle, IconAlertTriangle } from "@tabler/icons-react";
import { MediaPermissionsProvider, useMediaPermissions } from "../../contexts/MediaPermissionsContext";
import { SiteFooter } from "../../components/partials/SiteFooter";
import { ParticipateStepRouter } from "./ParticipateStepRouter";
import apiClient from "../../config/API/axiosConfig.mjs";

// Inner component that uses the media permissions context
const ParticipateContent = () => {
  // Get analysis ID from URL query parameters
  const [searchParams] = useSearchParams();
  const urlAnalysisId = searchParams.get('analysisId');

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
      setError("Por favor, introduce un ID de análisis");
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
        setError("Análisis no encontrado o no hay plazas disponibles. Por favor, verifica tu ID de análisis e inténtalo de nuevo.");
        setAnalysisId(null);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setError("Análisis no encontrado. Por favor, verifica tu ID de análisis e inténtalo de nuevo.");
      } else if (err?.response?.status === 400) {
        setError("No hay plazas disponibles para este análisis.");
      } else {
        setError(err?.response?.data?.message || "Ocurrió un error al validar el análisis");
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
        setError("Error al obtener los datos del análisis. Por favor, inténtalo de nuevo.");
        setCurrentStep('permissions');
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Ocurrió un error al obtener los datos del análisis");
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
      title: "Escenario",
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
      <ParticipateStepRouter
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        analysisData={analysisData}
        analysisId={analysisId}
        analysisEntryId={analysisEntryId}
        error={error}
        setError={setError}
        validationLoading={validationLoading}
        dataFetchLoading={dataFetchLoading}
        showSecurityModal={showSecurityModal}
        setShowSecurityModal={setShowSecurityModal}
        showStoppedRecordingModal={showStoppedRecordingModal}
        setShowStoppedRecordingModal={setShowStoppedRecordingModal}
        handleSubmitId={handleSubmitId}
        handleAcceptSecurity={handleAcceptSecurity}
        handleDeclineSecurity={handleDeclineSecurity}
        handleExitAnalysis={handleExitAnalysis}
        handlePermissionsNext={handlePermissionsNext}
        handlePermissionsGranted={handlePermissionsGranted}
        handleRecordingStoppedConfirm={handleRecordingStoppedConfirm}
        buildAnalysisSteps={buildAnalysisSteps}
        urlAnalysisId={urlAnalysisId}
        isRecording={isRecording}
        hasPermissions={hasPermissions}
        permissionStatus={permissionStatus}
      />
      
      {/* Error Display for input step */}
      {error && currentStep === 'input' && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          mt="md"
        >
          {error}
        </Alert>
      )}
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