import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Group, Text, Box, Progress, Stack, Alert, Loader, Modal, Center } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconUpload, IconCircleCheck } from '@tabler/icons-react';
import { useMediaPermissions } from '../../contexts/MediaPermissionsContext';
import apiClient from '../../config/API/axiosConfig.mjs';

export const AnalysisStepNavigator = ({ steps = [], onExit, analysisData, analysisEntryId, analysisId }) => {
  const {
    hasPermissions,
    permissionStatus,
    stopRecording,
    uploadRecording,
    uploadStatus,
    uploadError,
    uploadProgress
  } = useMediaPermissions();
  const [currentStep, setCurrentStep] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishError, setFinishError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Check if we can proceed based on the current step
  useEffect(() => {
    if (currentStep === 0) {
      // First step is permissions - can only proceed if permissions are granted
      setCanProceed(hasPermissions());
    } else {
      // Other steps can always proceed
      setCanProceed(true);
    }
  }, [currentStep, hasPermissions, permissionStatus]);

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceed) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      setIsFinishing(true);
      setFinishError('');
      
      // Stop recording and get the blob with metadata
      const recordingData = await stopRecording();
      
      if (!recordingData || !recordingData.blob) {
        setFinishError('No recording found. Please ensure permissions were granted and try again.');
        setIsFinishing(false);
        return;
      }
      
      if (recordingData.blob.size === 0) {
        setFinishError('Recording is empty. Please try recording again.');
        setIsFinishing(false);
        return;
      }
      
      // Prepare minimal metadata for upload - only recording duration
      const uploadMetadata = {
        recordingDuration: recordingData.metadata?.recordingDuration
      };
      
      // Step 5: Upload recording using presigned URL
      const uploadSuccess = await uploadRecording(
        recordingData.blob,
        uploadMetadata,
        analysisId,
        analysisEntryId
      );
      
      if (!uploadSuccess) {
        setFinishError('Failed to upload recording. Please try again.');
        setIsFinishing(false);
        return;
      }

      // Step 6: PATCH analysis entry to mark as submitted
      if (!analysisEntryId) {
        setFinishError('Missing analysis entry ID for updating entry.');
        setIsFinishing(false);
        return;
      }

      try {
        await apiClient.patch('/api/v1/analysisEntry', {
          analysisEntryId,
          analysisEntryStatus: 'submitted'
        });
      } catch (patchErr) {
        setFinishError('Failed to update analysis entry after upload.');
        setIsFinishing(false);
        return;
      }
      
      // Show success modal
      setShowSuccessModal(true);
      setIsFinishing(false);
      
      // Auto-close after 3 seconds and exit
      setTimeout(() => {
        setShowSuccessModal(false);
        if (onExit) {
          onExit();
        }
      }, 3000);
    } catch (error) {
      setFinishError('An error occurred while finishing the analysis. Please try again.');
      setIsFinishing(false);
    }
  };

  // Calculate progress
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Stack spacing="md">
      {/* Progress Bar */}
      <Box>
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed">
            Step {currentStep + 1} of {steps.length}
          </Text>
          <Text size="sm" c="dimmed">
            {Math.round(progress)}% Complete
          </Text>
        </Group>
        <Progress value={progress} size="sm" radius="xl" />
      </Box>

      {/* Step Content */}
      <Box>
        <Text size="lg" fw={500} mb="md" style={{ color: 'inherit' }}>
          {steps[currentStep]?.title || ''}
        </Text>
        <Box>{steps[currentStep]?.content || ''}</Box>
      </Box>

      {/* Upload Progress */}
      {uploadStatus === 'uploading' && (
        <Box>
          <Alert icon={<IconUpload size={16} />} color="blue" mb="xs">
            <Group justify="space-between">
              <Text size="sm">Uploading recording to server...</Text>
              <Text size="sm" fw={600}>{uploadProgress}%</Text>
            </Group>
          </Alert>
          <Progress
            value={uploadProgress}
            size="lg"
            radius="xl"
            color="blue"
            animated
          />
        </Box>
      )}
      
      {(uploadError || finishError) && (
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          {uploadError || finishError}
        </Alert>
      )}

      {/* Navigation Buttons */}
      <Group justify="space-between" mt="xl">
        <Button
          variant="default"
          onClick={handlePrevious}
          disabled={currentStep === 0 || isFinishing}
        >
          Previous
        </Button>
        
        <Group>
          {currentStep === 0 && !canProceed && (
            <Text size="sm" c="dimmed">
              Grant permissions to continue
            </Text>
          )}
          
          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleFinish}
              color="green"
              loading={isFinishing}
              disabled={isFinishing}
              leftSection={isFinishing ? <Loader size={14} color="white" /> : null}
            >
              {isFinishing ? 'Finishing...' : 'Finish Analysis'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed || isFinishing}
            >
              Next
            </Button>
          )}
        </Group>
      </Group>
      
      {/* Success Modal */}
      <Modal
        opened={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        centered
        size="sm"
        withCloseButton={false}
      >
        <Center>
          <Stack align="center" spacing="md">
            <IconCircleCheck size={64} color="green" />
            <Text size="xl" fw={600}>Success!</Text>
            <Text size="sm" c="dimmed" ta="center">
              Your recording has been uploaded successfully.
              Thank you for participating in this analysis.
            </Text>
            <Text size="xs" c="dimmed">
              Redirecting...
            </Text>
          </Stack>
        </Center>
      </Modal>
    </Stack>
  );
};

AnalysisStepNavigator.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ),
  onExit: PropTypes.func,
  analysisData: PropTypes.object,
  analysisEntryId: PropTypes.string,
  analysisId: PropTypes.string
};