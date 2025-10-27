import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import apiClient from '../../config/API/axiosConfig.mjs';
import {
  Container,
  Title,
  Text,
  Loader,
  Alert,
  Stack,
  Card,
  AspectRatio,
  Button,
  Group,
  Slider,
  ScrollArea,
  Box,
  Highlight,
  Grid
} from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause, IconVolume, IconVolumeOff, IconArrowsMaximize } from '@tabler/icons-react';

export const VideoPlayerPage = () => {
  const { analysisId, entryId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTranscriptId, setActiveTranscriptId] = useState(null);
  
  // Mock transcript data - will be replaced with actual data fetching
  const [transcript] = useState([
    { id: 1, start: 0, end: 5, text: "Hello, welcome to this analysis recording." },
    { id: 2, start: 5, end: 12, text: "Today we'll be reviewing the user experience of our new application." },
    { id: 3, start: 12, end: 20, text: "As you can see on the screen, we have several key features that users interact with." },
    { id: 4, start: 20, end: 28, text: "The navigation menu is located at the top of the page for easy access." },
    { id: 5, start: 28, end: 35, text: "Users can quickly find what they're looking for with our search functionality." },
    { id: 6, start: 35, end: 42, text: "Let's take a look at how the checkout process works in this application." },
    { id: 7, start: 42, end: 50, text: "The payment form is designed to be simple and secure for all users." },
    { id: 8, start: 50, end: 58, text: "We've implemented several security measures to protect user information." },
    { id: 9, start: 58, end: 65, text: "That concludes our overview of the main features in this application." },
    { id: 10, start: 65, end: 70, text: "Thank you for watching this analysis recording." }
  ]);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await apiClient.get(`/api/v1/analysisEntry/${entryId}`);
        setVideoUrl(response.data.analysisEntryPresignedUrl);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching video URL:', err);
        setError('Failed to load video');
        setLoading(false);
      }
    };

    fetchVideoUrl();
  }, [entryId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        setProgress(progressPercent);
        setCurrentTime(video.currentTime);
        setDuration(video.duration);
        
        // Find active transcript segment
        const currentSegment = transcript.find(segment =>
          video.currentTime >= segment.start && video.currentTime <= segment.end
        );
        
        if (currentSegment) {
          setActiveTranscriptId(currentSegment.id);
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [transcript]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial duration when video source changes
    const checkDuration = () => {
      if (video.duration && video.duration > 0) {
        setDuration(video.duration);
      }
    };

    // Check immediately in case metadata is already loaded
    checkDuration();

    // Also listen for loadedmetadata event
    video.addEventListener('loadedmetadata', checkDuration);

    return () => {
      video.removeEventListener('loadedmetadata', checkDuration);
    };
  }, [videoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !muted;
    setMuted(!muted);
  };

  const handleVolumeChange = (value) => {
    const video = videoRef.current;
    video.volume = value;
    setVolume(value);
    setMuted(value === 0);
  };

  const handleProgressChange = (value) => {
    const video = videoRef.current;
    const time = (value / 100) * duration;
    video.currentTime = time;
    setProgress(value);
  };

  const handleTranscriptClick = (startTime) => {
    const video = videoRef.current;
    video.currentTime = startTime;
    if (video.paused) {
      video.play();
      setPlaying(true);
    }
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
          <Text>Loading video player...</Text>
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
              ← Go back
            </Button>
            <Title order={3}>Analysis Recording</Title>
          </Group>
          <Button variant="outline" size="sm">
            Share
          </Button>
        </Group>
      </Box>

      {/* Main Content */}
      <Box style={{ flex: 1, display: 'flex' }}>
        {/* Video Section */}
        <Box style={{ flex: 1, position: 'relative', backgroundColor: '#000' }}>
          <video
            ref={videoRef}
            controls={true}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: '#000'
            }}
          >
            {videoUrl && <source src={videoUrl} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>

        </Box>

        {/* Transcript Section */}
        <Box style={{
          width: '400px',
          backgroundColor: 'var(--mantine-color-gray-0)',
          borderLeft: '1px solid var(--mantine-color-gray-3)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
            <Title order={4}>Transcript</Title>
          </Box>
          
          <ScrollArea style={{ flex: 1 }} type="auto">
            <Stack spacing="xs" p="md">
              {transcript.map((segment) => (
                <Card
                  key={segment.id}
                  p="xs"
                  shadow="xs"
                  radius="sm"
                  withBorder
                  onClick={() => handleTranscriptClick(segment.start)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: activeTranscriptId === segment.id ? 'var(--mantine-color-blue-1)' : 'transparent',
                    border: activeTranscriptId === segment.id ? '1px solid var(--mantine-color-blue-5)' : '1px solid var(--mantine-color-gray-3)'
                  }}
                >
                  <Group position="apart" align="flex-start">
                    <Text size="xs" color="blue" fw={500} w={60} style={{ flexShrink: 0 }}>
                      {formatTime(segment.start)}
                    </Text>
                    <Text size="sm" style={{ flex: 1 }} component="div">
                      <Highlight highlight={activeTranscriptId === segment.id ? [] : []}>
                        {segment.text}
                      </Highlight>
                    </Text>
                  </Group>
                </Card>
              ))}
            </Stack>
          </ScrollArea>
        </Box>
      </Box>
    </Box>
  );
};