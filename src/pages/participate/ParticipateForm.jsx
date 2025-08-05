import { useState } from "react";
import {
  Button,
  Container,
  Paper,
  Text,
  TextInput,
  Title,
  Alert,
  List,
  ThemeIcon
} from '@mantine/core';
import { IconAlertCircle, IconClipboardText, IconPlayerPlay } from '@tabler/icons-react';
import apiClient from "../../config/API/axiosConfig.mjs";

export const ParticipateForm = () => {
    const [analysisId, setAnalysisId] = useState("");
    const [analysisData, setAnalysisData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleParticipation = async (e) => {
        e.preventDefault();
        
        if (!analysisId.trim()) {
            setError("Please enter an analysis ID");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const data = {
                analysisId: analysisId
            };
            
            const response = await apiClient.post('/api/v1/guestParticipant', data);
            
            // Store everything except success and message attributes
            if (response.data.success) {
                setAnalysisData(response.data.analysisData);
            } else {
                setError(response.data.message || "Failed to retrieve analysis data");
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container size="sm" my={40}>
            <Title ta="center" mb="xl">Participate in Analysis</Title>
            
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={handleParticipation}>
                    <TextInput
                        label="Analysis ID"
                        placeholder="Enter your analysis ID"
                        value={analysisId}
                        onChange={(e) => setAnalysisId(e.target.value)}
                        disabled={loading}
                        required
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        mt="xl"
                        leftSection={<IconPlayerPlay size={14} />}
                        loading={loading}
                    >
                        {loading ? "Processing..." : "Participate"}
                    </Button>
                </form>
            </Paper>
            
            {error && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Error"
                    color="red"
                    mt="md"
                >
                    {error}
                </Alert>
            )}
            
            {analysisData && (
                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <Title order={3} mb="md">Analysis Data Retrieved</Title>
                    
                    <Text mt="md">
                        <strong>Scenario:</strong> {analysisData.scenario}
                    </Text>
                    
                    <Text mt="md">
                        <strong>Analysis URL:</strong> {analysisData.analysisUrl}
                    </Text>
                    
                    <Text mt="md">
                        <strong>Presigned Upload URL:</strong> {analysisData.presignedUploadUrl}
                    </Text>
                    
                    <Text mt="md" mb="sm">
                        <strong>Tasks:</strong>
                    </Text>
                    
                    <List
                        spacing="sm"
                        size="sm"
                        icon={
                            <ThemeIcon color="blue" size={20} radius="xl">
                                <IconClipboardText size={12} />
                            </ThemeIcon>
                        }
                    >
                        {analysisData.tasks.map((task, index) => (
                            <List.Item key={index}>
                                <Text>
                                    <strong>Type:</strong> {task.taskType},
                                    <strong> Content:</strong> {task.taskContent}
                                </Text>
                            </List.Item>
                        ))}
                    </List>
                </Paper>
            )}
        </Container>
    );
};