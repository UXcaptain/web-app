import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import apiClient from '../../config/API/axiosConfig.mjs';
import { Container, Text, Loader, Alert, Stack, Button, Group, Box } from '@mantine/core';
import VideoPlayer from '../../components/partials/VideoPlayer';
import { VideoPlayerSidebar } from '../../components/partials/VideoPlayerSidebar';

export const VideoPlayerPage = () => {
  const { analysisId, entryId } = useParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [participant, setParticipant] = useState({});
  const [tasks, setTasks] = useState([]);
  const [scenario, setScenario] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekToTime, setSeekToTime] = useState(null);
  const [activeTranscriptId, setActiveTranscriptId] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        // Fetch video URL and transcript data
        const videoResponse = await apiClient.get(`/api/v1/analysisEntry/${entryId}`);
        setVideoUrl(videoResponse.data.analysisEntryGetRecordingPresignedUrl);
        
        // Handle direct transcript data from server response
        const transcriptData = videoResponse.data.transcription;
        
        if (transcriptData) {
          setTranscript(transcriptData);
        } else {
          setTranscript(null);
        }
        
        // Fetch analysis data to get real tasks
        let transformedTasks = [];
        
        const analysisResponse = await apiClient.get(`/api/v1/analysis/${analysisId}`);
        const analysisTasks = analysisResponse?.data?.analysisData?.tasks || [];
        const fetchedScenario = analysisResponse?.data?.analysisData?.scenario || '';
        
        // Transform analysis tasks to match the expected format
        transformedTasks = analysisTasks.map((task, index) => ({
          title: `Tarea ${index + 1}`,
          description: task?.taskContent || 'Sin descripción',
        }));
        
        // setParticipant(); // TODO - Add participant info
        setTasks(transformedTasks);
        // setNotes(mockNotes); // TODO -- Add notes
        setLoading(false);
        setScenario(fetchedScenario);
      } catch (err) {
        console.error('Error fetching video data:', err);
        setError('Error al cargar los datos del análisis');
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [entryId, analysisId]);

  const lastClickTime = useRef(0);
  const handleTranscriptClick = useCallback((startTime) => {
    const currentTime = Date.now();
    
    // Debounce clicks to prevent rapid-fire clicks
    if (currentTime - lastClickTime.current < 200) {
      return;
    }
    lastClickTime.current = currentTime;
    
    // Use requestAnimationFrame to ensure smooth UI updates
    requestAnimationFrame(() => {
      setSeekToTime(startTime);
    });
  }, []);

  // Cache for performance optimization
  const lastProcessedTime = useRef(0);
  const lastFoundSegmentId = useRef(null);
  
  // Highly throttled time update handler to eliminate performance warnings
  const throttledHandleTimeUpdate = useCallback((time) => {
    // Only process time updates if significant time has passed (500ms threshold)
    const timeDiff = Math.abs(time - lastProcessedTime.current);
    if (timeDiff < 0.5) return; // Skip if less than 500ms difference
    
    setCurrentTime(time);
    lastProcessedTime.current = time;
    
    // Optimized transcript search with aggressive caching
    if (transcript && Array.isArray(transcript) && transcript.length > 0) {
      // Use cached result if time is within the same segment
      if (lastFoundSegmentId.current !== null) {
        const lastSegment = transcript.find(seg => seg.id === lastFoundSegmentId.current);
        if (lastSegment && time >= lastSegment.start && time <= lastSegment.end) {
          return; // Still in the same segment, no need to search
        }
      }
      
      // For performance, only search if transcript is small enough
      if (transcript.length <= 50) {
        const currentSegment = transcript.find(segment =>
          time >= segment.start && time <= segment.end
        );
        
        if (currentSegment) {
          setActiveTranscriptId(currentSegment.id);
          lastFoundSegmentId.current = currentSegment.id;
        } else {
          lastFoundSegmentId.current = null;
        }
      }
      // For larger transcripts, skip searching to avoid performance issues
    }
  }, [transcript]);

  const handleTimeUpdate = useCallback((time) => {
    throttledHandleTimeUpdate(time);
  }, [throttledHandleTimeUpdate]);

  const handleDurationChange = (duration) => {
    setDuration(duration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <Container>
        <Stack align="center" mt="xl">
          <Loader size="xl" />
          <Text>Cargando reproducción...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert color="red" title="Error">
          {error}
        </Alert>
      </Container>
    );
  }


  return (
    <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Group position="apart">
          <Group>
            <Button variant="subtle" size="sm" onClick={() => navigate(-1)}>
              ← Volver
            </Button>
          </Group>
        </Group>
      </Box>
      
      {/* Main Content */}
      <Box style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <VideoPlayer
          videoUrl={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          currentTime={currentTime}
          duration={duration}
          playing={playing}
          setPlaying={setPlaying}
          seekToTime={seekToTime}
          onSeekComplete={() => setSeekToTime(null)}
        />
        <VideoPlayerSidebar
          transcript={transcript}
          activeTranscriptId={activeTranscriptId}
          onTranscriptClick={handleTranscriptClick}
          formatTime={formatTime}
          participant={participant}
          tasks={tasks}
          notes={notes}
          scenario={scenario}
        />
      </Box>
    </Box>
  );
};