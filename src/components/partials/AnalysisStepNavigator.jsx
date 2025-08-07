import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Group, Text, Box, Progress, Stack } from '@mantine/core';
import { useMediaPermissions } from '../../contexts/MediaPermissionsContext';

export const AnalysisStepNavigator = ({ steps = [], onExit }) => {
  const { hasPermissions, permissionStatus } = useMediaPermissions();
  const [currentStep, setCurrentStep] = useState(0);
  const [canProceed, setCanProceed] = useState(false);

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

  const handleFinish = () => {
    // Handle analysis completion
    if (onExit) {
      onExit();
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

      {/* Navigation Buttons */}
      <Group justify="space-between" mt="xl">
        <Button 
          variant="default" 
          onClick={handlePrevious} 
          disabled={currentStep === 0}
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
            >
              Finish Analysis
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              disabled={!canProceed}
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
  onExit: PropTypes.func
};