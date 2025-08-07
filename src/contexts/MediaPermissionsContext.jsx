import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const MediaPermissionsContext = createContext(null);

export const useMediaPermissions = () => {
  const context = useContext(MediaPermissionsContext);
  if (!context) {
    throw new Error('useMediaPermissions must be used within MediaPermissionsProvider');
  }
  return context;
};

export const MediaPermissionsProvider = ({ children }) => {
  const [screenStream, setScreenStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('idle'); // idle, requesting, granted, denied, error
  const [errorMessage, setErrorMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Request screen sharing permission
  const requestScreenPermission = useCallback(async () => {
    try {
      setPermissionStatus('requesting');
      setErrorMessage('');
      
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
          logicalSurface: true,
          cursor: 'always'
        },
        audio: false // We'll get audio separately for better control
      });

      // Listen for stream end (user stops sharing)
      stream.getVideoTracks().forEach(track => {
        track.addEventListener('ended', () => {
          console.log('Screen sharing stopped by user');
          handleStreamEnded('screen');
        });
      });

      setScreenStream(stream);
      return stream;
    } catch (error) {
      console.error('Screen permission error:', error);
      if (error.name === 'NotAllowedError') {
        setErrorMessage('Screen sharing permission was denied. Please allow screen sharing to continue.');
      } else if (error.name === 'NotFoundError') {
        setErrorMessage('No screen sources available for sharing.');
      } else {
        setErrorMessage(`Failed to access screen: ${error.message}`);
      }
      setPermissionStatus('denied');
      throw error;
    }
  }, []);

  // Request microphone permission
  const requestAudioPermission = useCallback(async () => {
    try {
      setErrorMessage('');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        },
        video: false
      });

      // Listen for stream end
      stream.getAudioTracks().forEach(track => {
        track.addEventListener('ended', () => {
          console.log('Microphone access stopped');
          handleStreamEnded('audio');
        });
      });

      setAudioStream(stream);
      return stream;
    } catch (error) {
      console.error('Audio permission error:', error);
      if (error.name === 'NotAllowedError') {
        setErrorMessage('Microphone permission was denied. Please allow microphone access to continue.');
      } else if (error.name === 'NotFoundError') {
        setErrorMessage('No microphone found. Please connect a microphone and try again.');
      } else {
        setErrorMessage(`Failed to access microphone: ${error.message}`);
      }
      setPermissionStatus('denied');
      throw error;
    }
  }, []);

  // Request both permissions
  const requestPermissions = useCallback(async () => {
    try {
      setPermissionStatus('requesting');
      setErrorMessage('');

      // Request both permissions
      const [screen, audio] = await Promise.all([
        requestScreenPermission(),
        requestAudioPermission()
      ]);

      if (screen && audio) {
        setPermissionStatus('granted');
        setIsRecording(true);
        return { screen, audio };
      }
    } catch (error) {
      setPermissionStatus('denied');
      setIsRecording(false);
      // Error message already set by individual functions
      return null;
    }
  }, [requestScreenPermission, requestAudioPermission]);

  // Handle stream ended
  const handleStreamEnded = useCallback((type) => {
    if (type === 'screen') {
      setScreenStream(null);
    } else if (type === 'audio') {
      setAudioStream(null);
    }
    
    // If any stream ends, we need to re-request permissions
    setPermissionStatus('denied');
    setIsRecording(false);
    setErrorMessage('Recording stopped. Please share your screen and microphone again to continue.');
  }, []);

  // Stop all streams
  const stopAllStreams = useCallback(() => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    setPermissionStatus('idle');
    setIsRecording(false);
    setErrorMessage('');
  }, [screenStream, audioStream]);

  // Check if permissions are granted
  const hasPermissions = useCallback(() => {
    return screenStream !== null && audioStream !== null;
  }, [screenStream, audioStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllStreams();
    };
  }, []);

  const value = {
    screenStream,
    audioStream,
    permissionStatus,
    errorMessage,
    isRecording,
    requestPermissions,
    requestScreenPermission,
    requestAudioPermission,
    stopAllStreams,
    hasPermissions
  };

  return (
    <MediaPermissionsContext.Provider value={value}>
      {children}
    </MediaPermissionsContext.Provider>
  );
};

MediaPermissionsProvider.propTypes = {
  children: PropTypes.node.isRequired
};