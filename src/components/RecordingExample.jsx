import { Card, Title, Text, Container, AspectRatio } from '@mantine/core';

const RecordingExample = () => {
  return (
    <Container size="lg" py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="md" ta="center">
          Recording Example
        </Title>

        
        <AspectRatio ratio={16 / 9} mt="md">
          <video
            controls
            style={{ width: '100%', height: '100%', borderRadius: 'var(--mantine-radius-md)' }}
            poster="https://placehold.co/800x450?text=Video+Thumbnail"
          >
            <source 
              src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
        </AspectRatio>
        
      </Card>
    </Container>
  );
};

export default RecordingExample;