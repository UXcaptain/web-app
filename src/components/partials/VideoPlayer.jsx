import { useEffect, useRef } from 'react';
import { Box } from '@mantine/core';

const VideoPlayer = ({ videoUrl, onTimeUpdate, onDurationChange, currentTime, duration, playing, setPlaying, seekToTime, onSeekComplete }) => {
  const videoRef = useRef(null);

  // Handle seeking when seekToTime changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || seekToTime === null || seekToTime === undefined) return;

    // Seek to the specified time
    video.currentTime = seekToTime;
    
    // Notify that seeking is complete
    if (onSeekComplete) {
      onSeekComplete();
    }
  }, [seekToTime, onSeekComplete]);

  // Handle time updates and duration changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      onTimeUpdate(video.currentTime);
    };

    const updateDuration = () => {
      onDurationChange(video.duration);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [onTimeUpdate, onDurationChange]);

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