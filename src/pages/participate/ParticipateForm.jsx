import { useState } from "react";
import {
  Button,
  Container,
  Paper,
  TextInput,
  Title,
  Alert,
  Text,
  Card,
  Stack,
} from '@mantine/core';
import { AnalysisStepNavigator } from "../../components/partials/AnalysisStepNavigator.jsx";
import { IconAlertCircle, IconClipboardText, IconPlayerPlay } from '@tabler/icons-react';
import apiClient from "../../config/API/axiosConfig.mjs";
import Timer from "../../components/partials/Timer.jsx";

// Timer logic moved to Timer component
export const ParticipateForm = () => {
    const [analysisId, setAnalysisId] = useState("d336acb7-2c48-476d-9ba5-2bf5c51b2b79");
    const [analysisData, setAnalysisData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // Timer logic moved to Timer component

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

    const handleUpdateAnalysisEntry = async () => {
        if (!analysisData || !analysisData.id) {
            setError("No analysis data available to update");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = {
                status: "completed",
                notes: "Updated notes"
            };

            const response = await apiClient.patch(`/v1/analysis-entry/${analysisData.id}`, data);

            if (response.data.success) {
                setAnalysisData(response.data.analysisData);
            } else {
                setError(response.data.message || "Failed to update analysis entry");
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
                    
                    {analysisData && (
                        <Button
                            type="button"
                            fullWidth
                            mt="xl"
                            leftSection={<IconClipboardText size={14} />}
                            loading={loading}
                            onClick={handleUpdateAnalysisEntry}
                        >
                            {loading ? "Updating..." : "Update Analysis Entry"}
                        </Button>
                    )}
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
                <Card withBorder shadow="md" p="lg" mt="xl" radius="md">
                    <Stack spacing="md">
                        <Timer analysisData={analysisData} />
                        <AnalysisStepNavigator
                            steps={[
                                { title: "Scenario", content: <Text>{analysisData.scenario}</Text> },
                                {
                                  title: "URL",
                                  content: (() => {
                                    const raw = analysisData.analysisUrl || "";
                                    const hasProtocol = /^https?:\/\//i.test(raw);
                                    const href = hasProtocol ? raw : `https://${raw}`;
                                    return (
                                      <Text>
                                        <a href={href} target="_blank" rel="noopener noreferrer">{raw}</a>
                                      </Text>
                                    );
                                  })()
                                },
                                ...analysisData.tasks.map((task, index) => ({
                                    title: `Task ${index + 1}`,
                                    content: (() => {
                                      const content = String(task.taskContent ?? '');
                                      // URL regex: matches http(s) and bare domains like example.com or sub.example.co.uk
                                      const urlRegex = /(https?:\/\/[^\s]+|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
                                      
                                      const parts = [];
                                      let lastIndex = 0;
                                      let match;
                                      
                                      while ((match = urlRegex.exec(content)) !== null) {
                                        const urlText = match[0];
                                        const start = match.index;
                                        const end = start + urlText.length;
                                        
                                        if (start > lastIndex) {
                                          parts.push(content.slice(lastIndex, start));
                                        }
                                        
                                        const hasProtocol = /^https?:\/\//i.test(urlText);
                                        const href = hasProtocol ? urlText : `https://${urlText}`;
                                        
                                        parts.push(
                                          <a key={`${index}-link-${start}`} href={href} target="_blank" rel="noopener noreferrer">{urlText}</a>
                                        );
                                        
                                        lastIndex = end;
                                      }
                                      
                                      if (lastIndex < content.length) {
                                        parts.push(content.slice(lastIndex));
                                      }
                                      
                                      return <Text>{parts.length ? parts : content}</Text>;
                                    })()
                                }))
                            ]}
                        />
                    </Stack>
                </Card>
            )}
        </Container>
    );
};