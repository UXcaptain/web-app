import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Group, Text, Box } from '@mantine/core';

export const AnalysisStepNavigator = ({ steps = [] }) => {
  AnalysisStepNavigator.propTypes = {
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.node.isRequired,
      })
    ),
  };

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Box>
      <Text size="lg" fw={500} style={{ color: 'inherit' }}>
        {steps[currentStep]?.title || ''}
      </Text>
      <div>{steps[currentStep]?.content || ''}</div>
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={handlePrevious} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Group>
    </Box>
  );
};