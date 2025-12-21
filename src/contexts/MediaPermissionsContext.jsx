import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import apiClient from '../config/API/axiosConfig.mjs';

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
  const [permissionStatus, setPermissionStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
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
        audio: false
      });

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
          autoGainControl: true
        },
        video: false
      });

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

  // Start recording - completely rewritten with basic settings
  const startRecording = useCallback((screen, audio) => {
    const screenToUse = screen || screenStream;
    const audioToUse = audio || audioStream;
    
    if (!screenToUse || !audioToUse) {
      console.error('[Recording] Missing streams');
      return false;
    }

    try {
      // Combine streams
      const combinedStream = new MediaStream([
        ...screenToUse.getVideoTracks(),
        ...audioToUse.getAudioTracks()
      ]);

      // Try to use MP4 format first, fallback to WebM if not supported
      let options = {
        mimeType: 'video/mp4;codecs=avc1,opus',  // MP4 with H.264 video codec and Opus audio codec
        videoBitsPerSecond: 2500000,  // 2.5 Mbps for 720p quality
        audioBitsPerSecond: 128000    // 128 kbps for good audio quality
      };
      
      // Check if MP4 is supported, fallback to WebM if not
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/mp4;codecs=h264';
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'video/webm;codecs=vp9,opus';
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options.mimeType = 'video/webm;codecs=vp8,opus';
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              setErrorMessage('Your browser does not support MP4 or WebM video recording. Please use a modern browser.');
              return false;
            }
          }
        }
      }


      const mediaRecorder = new MediaRecorder(combinedStream, options);
      
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Recording stopped
      };

      mediaRecorder.onerror = (event) => {
        setErrorMessage(`Recording error: ${event.error}. Please try again.`);
        setIsRecording(false);
      };

      // Start recording
      mediaRecorder.start(1000);
      
      mediaRecorderRef.current = mediaRecorder;
      recordingStartTimeRef.current = new Date().toISOString();
      setIsRecording(true);
      
      return true;
    } catch (error) {
      console.error('[Recording] Failed to start:', error);
      setErrorMessage(`Failed to start recording: ${error.message}`);
      return false;
    }
  }, [screenStream, audioStream]);

  // Stop recording
  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve({ blob: null, metadata: null });
        return;
      }

      const mediaRecorder = mediaRecorderRef.current;
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: mediaRecorder.mimeType || 'video/mp4'
        });
        
        recordedChunksRef.current = [];
        setIsRecording(false);
        resolve({ blob, metadata: null });
      };

      mediaRecorder.stop();
      mediaRecorderRef.current = null;
    });
  }, []);

  // Upload recording
  const uploadRecording = useCallback(async (blob, analysisEntryId, presignedUrl) => {
    if (!blob) {
      setUploadError('Missing recording data');
      return false;
    }

    if (!presignedUrl) {
      setUploadError('Missing presigned upload URL');
      return false;
    }
    
    try {
      setUploadStatus('uploading');
      setUploadError('');
      setUploadProgress(0);
      
      console.log('[Upload] Uploading to S3 with provided presigned URL');
      setUploadProgress(25);

      const uploadResponse = await axios.put(presignedUrl, blob, {
        headers: {
          'Content-Type': blob.type || 'video/mp4',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 75) / progressEvent.total) + 25;
            setUploadProgress(Math.min(progress, 100));
          }
        },
      });

      if (uploadResponse.status !== 200) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      setUploadProgress(100);
      setUploadStatus('success');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      setUploadError('Upload failed: ' + errorMessage);
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

      const [screen, audio] = await Promise.all([
        requestScreenPermission(),
        requestAudioPermission()
      ]);

      if (screen && audio) {
        setPermissionStatus('granted');
        return { screen, audio };
      }
    } catch (error) {
      setPermissionStatus('denied');
      setIsRecording(false);
      return null;
    }
  }, [requestScreenPermission, requestAudioPermission]);

  // Handle stream ended
  const handleStreamEnded = useCallback((type) => {
    console.log('[Streams] Stream ended:', type);
    if (type === 'screen') {
      setScreenStream(null);
    } else if (type === 'audio') {
      setAudioStream(null);
    }
    
    setPermissionStatus('denied');
    setIsRecording(false);
    setErrorMessage('Recording stopped. Please share your screen and microphone again to continue.');
  }, []);

  // Stop all streams
  const stopAllStreams = useCallback(async () => {
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
    recordingStartTimeRef.current = null;
    
    return recordingData;
  }, [screenStream, audioStream, stopRecording]);

  // Check permissions
  const hasPermissions = useCallback(() => {
    return screenStream !== null && audioStream !== null;
  }, [screenStream, audioStream]);

  // Auto-start recording when streams are ready
  useEffect(() => {
    if (screenStream && audioStream && permissionStatus === 'granted' && !isRecording && !mediaRecorderRef.current) {
      startRecording(screenStream, audioStream);
    }
  }, [screenStream, audioStream, permissionStatus, isRecording, startRecording]);

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