import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [uploadError, setUploadError] = useState('');
  
  // Refs for MediaRecorder
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

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

  // Start recording with MediaRecorder
  const startRecording = useCallback((screen, audio) => {
    // Accept streams as parameters or use state
    const screenToUse = screen || screenStream;
    const audioToUse = audio || audioStream;
    
    if (!screenToUse || !audioToUse) {
      console.error('Cannot start recording: streams not available');
      return false;
    }

    try {
      // Combine screen and audio streams
      const combinedStream = new MediaStream([
        ...screenToUse.getVideoTracks(),
        ...audioToUse.getAudioTracks()
      ]);

      // Create MediaRecorder with appropriate options
      const options = {
        mimeType: 'video/webm;codecs=vp8,opus',
        videoBitsPerSecond: 2500000, // 2.5 Mbps
        audioBitsPerSecond: 128000   // 128 kbps
      };

      // Check if the mimeType is supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        // Fallback to a more basic format
        options.mimeType = 'video/webm';
      }

      const mediaRecorder = new MediaRecorder(combinedStream, options);
      
      // Clear previous chunks
      recordedChunksRef.current = [];

      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        console.log('Recording stopped, chunks collected:', recordedChunksRef.current.length);
      };

      // Handle errors
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setErrorMessage('Recording error: ' + event.error);
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      
      console.log('Recording started');
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      setErrorMessage('Failed to start recording: ' + error.message);
      return false;
    }
  }, [screenStream, audioStream]);

  // Stop recording and return the blob
  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        console.log('No active recording to stop');
        resolve(null);
        return;
      }

      const mediaRecorder = mediaRecorderRef.current;
      
      // Set up the onstop handler to resolve with the blob
      mediaRecorder.onstop = () => {
        console.log('Creating blob from recorded chunks');
        const blob = new Blob(recordedChunksRef.current, {
          type: mediaRecorder.mimeType || 'video/webm'
        });
        recordedChunksRef.current = [];
        setIsRecording(false);
        resolve(blob);
      };

      // Stop the recording
      mediaRecorder.stop();
      mediaRecorderRef.current = null;
    });
  }, []);

  // Upload recording to AWS S3 using presigned URL
  const uploadRecording = useCallback(async (blob, presignedUrl) => {
    if (!blob || !presignedUrl) {
      console.error('Missing blob or presigned URL for upload');
      setUploadError('Missing recording data or upload URL');
      return false;
    }

    try {
      setUploadStatus('uploading');
      setUploadError('');
      
      console.log('Starting upload to S3:');
      console.log('- Presigned URL:', presignedUrl);
      console.log('- Blob size:', blob.size, 'bytes');
      console.log('- Blob type:', blob.type || 'video/webm');
      
      // Upload to S3 using the presigned URL
      // Note: S3 presigned URLs typically don't require additional headers for CORS
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': blob.type || 'video/webm',
        },
        // Add mode for CORS handling
        mode: 'cors',
      });

      console.log('Upload response status:', response.status);
      
      // S3 typically returns 200 for successful PUT
      if (!response.ok && response.status !== 200) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
      }

      console.log('Upload successful');
      setUploadStatus('success');
      return true;
    } catch (error) {
      console.error('Upload error details:');
      console.error('- Error type:', error.name);
      console.error('- Error message:', error.message);
      console.error('- Full error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to upload recording';
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Unable to connect to upload server. This may be a CORS issue.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setUploadError(errorMessage);
      setUploadStatus('error');
      return false;
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
        // Don't start recording here - let it be started after state updates
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

  // Stop all streams and recording
  const stopAllStreams = useCallback(async () => {
    // Stop recording first and get the blob
    const blob = await stopRecording();
    
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
    
    return blob; // Return the recording blob
  }, [screenStream, audioStream, stopRecording]);

  // Check if permissions are granted
  const hasPermissions = useCallback(() => {
    return screenStream !== null && audioStream !== null;
  }, [screenStream, audioStream]);

  // Start recording when both streams are available
  useEffect(() => {
    if (screenStream && audioStream && permissionStatus === 'granted' && !isRecording && !mediaRecorderRef.current) {
      console.log('Both streams available, starting recording');
      startRecording(screenStream, audioStream);
    }
  }, [screenStream, audioStream, permissionStatus, isRecording]); // Remove startRecording from deps to avoid infinite loop

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
    uploadStatus,
    uploadError,
    requestPermissions,
    requestScreenPermission,
    requestAudioPermission,
    startRecording,
    stopRecording,
    uploadRecording,
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