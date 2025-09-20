import { Modal, Button, Text, Stack } from "@mantine/core";
import PropTypes from "prop-types";

export const SecurityModal = ({ opened, onAccept, onDecline }) => {
  return (
    <Modal opened={opened} onClose={onDecline} title="Security Confirmation" size="md">
      <Stack spacing="md">
        <Text>
          You are about to participate in a recorded analysis session. Please note:
        </Text>
        <Text size="sm">
          • Your screen and audio will be recorded during this session
        </Text>
        <Text size="sm">
          • The recording will be used for research purposes only
        </Text>
        <Text size="sm">
          • Your personal information will be kept confidential
        </Text>
        <Text size="sm">
          • You can stop the recording at any time by closing this window
        </Text>
        
        <Text mt="md" weight={500}>
          Do you accept these terms and wish to proceed?
        </Text>
        
        <Stack direction="row" spacing="sm" mt="md">
          <Button onClick={onAccept} color="green">
            Accept & Proceed
          </Button>
          <Button onClick={onDecline} variant="outline" color="red">
            Decline
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

SecurityModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};