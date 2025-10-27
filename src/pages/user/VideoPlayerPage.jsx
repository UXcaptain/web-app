import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import apiClient from '../../config/API/axiosConfig.mjs';
import { Container, Text, Loader, Alert, Stack, Button, Group, Box } from '@mantine/core';
import VideoPlayer from '../../components/partials/VideoPlayer';
import TranscriptSidebar from '../../components/partials/TranscriptSidebar';

export const VideoPlayerPage = () => {
  const { analysisId, entryId } = useParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTranscriptId, setActiveTranscriptId] = useState(null);
  
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        // Fetch video URL
        const videoResponse = await apiClient.get(`/api/v1/analysisEntry/${entryId}`);
        setVideoUrl(videoResponse.data.analysisEntryPresignedUrl);
        
        // Fetch transcript data (this would be a real API call in implementation)
        // For now, we'll use mock data
        const mockTranscript = [
          { id: 1, start: 0, end: 5, text: "Hello, welcome to this analysis recording." },
          { id: 2, start: 5, end: 10, text: "Today we'll be reviewing the user experience of our new application." },
          { id: 3, start: 10, end: 15, text: "As you can see on the screen, we have several key features that users interact with." },
          { id: 4, start: 20, end: 28, text: "The navigation menu is located at the top of the page for easy access." },
          { id: 5, start: 28, end: 35, text: "Users can quickly find what they're looking for with our search functionality." },
          { id: 6, start: 35, end: 42, text: "Let's take a look at how the checkout process works in this application." },
          { id: 7, start: 42, end: 50, text: "The payment form is designed to be simple and secure for all users." },
          { id: 8, start: 50, end: 58, text: "We've implemented several security measures to protect user information." },
          { id: 9, start: 58, end: 65, text: "That concludes our overview of the main features in this application." },
          { id: 10, start: 65, end: 70, text: "Thank you for watching this analysis recording." }
        ];
        
        setTranscript(mockTranscript);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching video data:', err);
        setError('Failed to load video');
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [entryId]);
  const handleTranscriptClick = (startTime) => {
    // Update currentTime to trigger seek in VideoPlayer component
    setCurrentTime(startTime);
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
    
    // Find active transcript segment
    const currentSegment = transcript.find(segment =>
      time >= segment.start && time <= segment.end
    );
    
    if (currentSegment) {
      setActiveTranscriptId(currentSegment.id);
    }
  };
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
          seekToTime={currentTime}
        />
        <TranscriptSidebar
          transcript={transcript}
          activeTranscriptId={activeTranscriptId}
          onTranscriptClick={handleTranscriptClick}
          formatTime={formatTime}
        />
      </Box>
    </Box>
  );
};