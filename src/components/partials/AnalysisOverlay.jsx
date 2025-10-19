import { Modal, Button } from '@mantine/core';
import { useDidUpdate } from '@mantine/hooks';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';

export const AnalysisOverlay = ({ analysisData, onClose }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const mediaChunks = useRef([]);

  const startRecording = async () => {
    if (!navigator.mediaDevices.getDisplayMedia) {
      console.error('Screen recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      
      // Try to use MP4 format first, fallback to WebM if not supported
      let options = { mimeType: 'video/mp4;codecs=avc1' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/mp4;codecs=h264' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/webm;codecs=vp9' };
        }
      }
      
      const recorder = new MediaRecorder(stream, options);
      recorder.ondataavailable = (event) => {
        mediaChunks.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(mediaChunks.current, { type: recorder.mimeType || 'video/mp4' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = recorder.mimeType?.includes('webm') ? 'recording.webm' : 'recording.mp4';
        a.click();
        URL.revokeObjectURL(url);
        mediaChunks.current = [];
      };
      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  };

  useDidUpdate(() => {
    if (analysisData) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [analysisData]);

  return (
    <Modal opened={!!analysisData} onClose={onClose} title="Analysis Details">
      <pre>{JSON.stringify(analysisData, null, 2)}</pre>
      <Button onClick={onClose} mt="md">
        Close
      </Button>
    </Modal>
  );
};

AnalysisOverlay.propTypes = {
  analysisData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};