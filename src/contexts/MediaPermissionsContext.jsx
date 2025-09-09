import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

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
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100
  
  // Refs for MediaRecorder
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  
  // Recording metadata state
  const [recordingMetadata, setRecordingMetadata] = useState({});
  const recordingStartTimeRef = useRef(null);

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
          handleStreamEnded('screen');
        });
      });

      setScreenStream(stream);
      return stream;
    } catch (error) {
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
          handleStreamEnded('audio');
        });
      });

      setAudioStream(stream);
      return stream;
    } catch (error) {
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
      return false;
    }

    try {
      // Combine screen and audio streams
      const combinedStream = new MediaStream([
        ...screenToUse.getVideoTracks(),
        ...audioToUse.getAudioTracks()
      ]);

      // Create MediaRecorder with WebM format options (preferred format)
      const webmOptions = [
        'video/webm;codecs=vp9,opus',    // VP9 + Opus (best quality)
        'video/webm;codecs=vp8,opus',    // VP8 + Opus (good compatibility)
        'video/webm;codecs=h264,opus',   // H.264 + Opus (fallback)
        'video/webm'                     // Basic WebM (final fallback)
      ];

      let selectedMimeType = 'video/webm'; // Default WebM format
      
      // Find the best supported WebM format
      for (const mimeType of webmOptions) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      const options = {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 1500000, // 1.5 Mbps (good for 1080p)
        audioBitsPerSecond: 96000    // 96 kbps (sufficient audio quality)
      };

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
        // Recording stopped
      };

      // Handle errors
      mediaRecorder.onerror = (event) => {
        setErrorMessage('Recording error: ' + event.error);
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      
      // Record start time and collect metadata
      const startTime = new Date().toISOString();
      recordingStartTimeRef.current = startTime;
      
      // Collect minimal recording metadata - only what's needed for duration calculation
      const metadata = {
        recordingStartTime: startTime
      };
      
      setRecordingMetadata(metadata);
      
      return true;
    } catch (error) {
      setErrorMessage('Failed to start recording: ' + error.message);
      return false;
    }
  }, [screenStream, audioStream]);

  // Stop recording and return the blob with metadata
  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve({ blob: null, metadata: null });
        return;
      }

      const mediaRecorder = mediaRecorderRef.current;
      
      // Set up the onstop handler to resolve with the blob and metadata
      mediaRecorder.onstop = () => {
        const endTime = new Date().toISOString();
        const startTime = recordingStartTimeRef.current;
        
        // Calculate recording duration
        const duration = startTime ?
          Math.round((new Date(endTime) - new Date(startTime)) / 1000) : 0;
        
        // Ensure WebM format is always used
        const mimeType = mediaRecorder.mimeType && mediaRecorder.mimeType.includes('webm')
          ? mediaRecorder.mimeType
          : 'video/webm';
          
        const blob = new Blob(recordedChunksRef.current, {
          type: mimeType
        });
        
        // Complete metadata with only recording duration
        const completeMetadata = {
          recordingDuration: duration
        };
        
        recordedChunksRef.current = [];
        setIsRecording(false);
        resolve({ blob, metadata: completeMetadata });
      };

      // Stop the recording
      mediaRecorder.stop();
      mediaRecorderRef.current = null;
    });
  }, [recordingMetadata]);

  // Upload recording to AWS S3 using presigned URL with progress tracking and metadata
  const uploadRecording = useCallback(async (blob, presignedUrl, metadata = {}) => {
    if (!blob || !presignedUrl) {
      setUploadError('Missing recording data or upload URL');
      return false;
    }

    try {
      setUploadStatus('uploading');
      setUploadError('');
      setUploadProgress(0);
      
      // Ensure WebM content type is used
      const contentType = blob.type && blob.type.includes('webm')
        ? blob.type
        : 'video/webm';

      // Prepare headers with metadata
      const headers = {
        'Content-Type': contentType,
      };

      // Add only recording duration as metadata header
      if (metadata && metadata.recordingDuration) {
        headers['x-amz-meta-recording-duration'] = metadata.recordingDuration.toString();
      }

      // Use axios for the upload with progress tracking
      const response = await axios.put(presignedUrl, blob, {
        headers,
        timeout: 0, // No timeout for large file uploads
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(percentComplete);
          }
        },
      });

      // Check if upload was successful
      if (response.status === 200 || response.status === 204) {
        setUploadStatus('success');
        setUploadProgress(100);
        return true;
      } else {
        const errorMessage = `We are very sorry - There has been an unexpected error with your upload - Our team has been notified and we will look into it - You can close the recording window now - ERRCODE: ${response.status}`;
        setUploadError(errorMessage);
        setUploadStatus('error');
        setUploadProgress(0);
        return false;
      }
    } catch (error) {
      // Provide more specific error messages
      let errorMessage = 'Failed to upload recording';
      
      if (axios.isCancel(error)) {
        errorMessage = 'Upload cancelled';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout: The upload took too long to complete';
      } else if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        errorMessage = `We are very sorry - There has been an unexpected error with your upload - Our team has been notified and we will look into it - You can close the recording window now - ERRCODE: ${status}`;
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error: Unable to connect to upload server';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setUploadError(errorMessage);
      setUploadStatus('error');
      setUploadProgress(0);
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
    // Stop recording first and get the blob with metadata
    const recordingData = await stopRecording();
    
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
    
    // Reset metadata
    setRecordingMetadata({});
    recordingStartTimeRef.current = null;
    
    return recordingData; // Return the recording data with metadata
  }, [screenStream, audioStream, stopRecording]);

  // Check if permissions are granted
  const hasPermissions = useCallback(() => {
    return screenStream !== null && audioStream !== null;
  }, [screenStream, audioStream]);

  // Start recording when both streams are available
  useEffect(() => {
    if (screenStream && audioStream && permissionStatus === 'granted' && !isRecording && !mediaRecorderRef.current) {
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
    uploadProgress,
    recordingMetadata,
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