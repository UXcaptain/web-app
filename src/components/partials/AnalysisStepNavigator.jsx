import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Group, Text, Box, Progress, Stack, Alert, Loader } from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useMediaPermissions } from '../../contexts/MediaPermissionsContext';

export const AnalysisStepNavigator = ({ steps = [], onExit, analysisData }) => {
  const {
    hasPermissions,
    permissionStatus,
    stopRecording,
    uploadRecording,
    uploadStatus,
    uploadError
  } = useMediaPermissions();
  const [currentStep, setCurrentStep] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishError, setFinishError] = useState('');

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
      
      // Check for presigned URL first - system should not work without it
      const presignedUrl = analysisData?.presignedUploadUrl;
      
      if (!presignedUrl) {
        console.error('No presigned URL available - cannot complete analysis');
        setFinishError('Upload configuration missing. Please contact support.');
        setIsFinishing(false);
        return;
      }
      
      // Stop recording and get the blob
      console.log('Stopping recording...');
      const recordingBlob = await stopRecording();
      
      if (!recordingBlob) {
        console.error('No recording available');
        setFinishError('No recording found. Please ensure permissions were granted and try again.');
        setIsFinishing(false);
        return;
      }
      
      // Upload to AWS S3
      console.log('Uploading recording to S3...');
      const uploadSuccess = await uploadRecording(recordingBlob, presignedUrl);
      
      if (!uploadSuccess) {
        setFinishError('Failed to upload recording. Please try again.');
        setIsFinishing(false);
        return;
      }
      
      console.log('Recording uploaded successfully');
      
      // Call the original onExit handler only after successful upload
      if (onExit) {
        onExit();
      }
    } catch (error) {
      console.error('Error finishing analysis:', error);
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

      {/* Upload Status Alert */}
      {uploadStatus === 'uploading' && (
        <Alert icon={<Loader size={16} />} color="blue">
          Uploading recording to server...
        </Alert>
      )}
      
      {uploadStatus === 'success' && (
        <Alert icon={<IconCheck size={16} />} color="green">
          Recording uploaded successfully!
        </Alert>
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
  analysisData: PropTypes.object
};