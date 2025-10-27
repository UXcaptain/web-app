import { useState, useEffect, useRef } from 'react';
import { 
  Button, 
  Slider, 
  Text, 
  Box 
} from '@mantine/core';

const VideoPlayer = ({ videoUrl, onTimeUpdate, onDurationChange, currentTime, duration, playing, setPlaying, seekToTime }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      onTimeUpdate(video.currentTime);
    };

    const updateDuration = () => {
      onDurationChange(video.duration);
    };

    // If seekToTime is provided and different from current time, seek to that time
    if (seekToTime !== undefined && seekToTime !== currentTime && videoRef.current) {
      videoRef.current.currentTime = seekToTime;
    }

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [onTimeUpdate, onDurationChange, seekToTime, currentTime]);
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
    video.muted = !video.muted;
  };

  const handleVolumeChange = (value) => {
    const video = videoRef.current;
    video.volume = value / 100;
  };

  const handleProgressChange = (value) => {
    const video = videoRef.current;
    const time = (value / 100) * duration;
    video.currentTime = time;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Box style={{ flex: 1, position: 'relative', backgroundColor: '#000', minWidth: 0 }}>
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
  );
};

export default VideoPlayer;