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
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100
  
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
      
      return true;
    } catch (error) {
      setErrorMessage('Failed to start recording: ' + error.message);
      return false;
    }
  }, [screenStream, audioStream]);

  // Stop recording and return the blob
  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve(null);
        return;
      }

      const mediaRecorder = mediaRecorderRef.current;
      
      // Set up the onstop handler to resolve with the blob
      mediaRecorder.onstop = () => {
        // Ensure WebM format is always used
        const mimeType = mediaRecorder.mimeType && mediaRecorder.mimeType.includes('webm')
          ? mediaRecorder.mimeType
          : 'video/webm';
          
        const blob = new Blob(recordedChunksRef.current, {
          type: mimeType
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

  // Upload recording to AWS S3 using presigned URL with progress tracking
  const uploadRecording = useCallback(async (blob, presignedUrl) => {
    if (!blob || !presignedUrl) {
      setUploadError('Missing recording data or upload URL');
      return false;
    }

    try {
      setUploadStatus('uploading');
      setUploadError('');
      setUploadProgress(0);
      
      // Create XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        });
        
        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setUploadStatus('success');
            setUploadProgress(100);
            resolve(true);
          } else {
            const errorMessage = `Upload failed with status ${xhr.status}`;
            setUploadError(errorMessage);
            setUploadStatus('error');
            setUploadProgress(0);
            resolve(false);
          }
        });
        
        // Handle errors
        xhr.addEventListener('error', () => {
          setUploadError('Network error: Unable to upload recording');
          setUploadStatus('error');
          setUploadProgress(0);
          resolve(false);
        });
        
        // Handle abort
        xhr.addEventListener('abort', () => {
          setUploadError('Upload cancelled');
          setUploadStatus('error');
          setUploadProgress(0);
          resolve(false);
        });
        
        // Open and send request
        xhr.open('PUT', presignedUrl);
        // Ensure WebM content type is used
        const contentType = blob.type && blob.type.includes('webm')
          ? blob.type
          : 'video/webm';
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.send(blob);
      });
    } catch (error) {
      // Provide more specific error messages
      let errorMessage = 'Failed to upload recording';
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
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