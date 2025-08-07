import { useState } from "react";
import { Container, Title, Paper, Alert, Card, Stack, Group, Text, rem } from "@mantine/core";
import { IconAlertCircle, IconVideo } from "@tabler/icons-react";
import { ParticipateForm } from "./ParticipateForm";
import { SecurityModal } from "./SecurityModal";
import Timer from "../../components/partials/Timer.jsx";
import { AnalysisStepNavigator } from "../../components/partials/AnalysisStepNavigator.jsx";
import apiClient from "../../config/API/axiosConfig.mjs";

export const ParticipateWrapper = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const handleSubmitId = async (analysisId) => {
    if (!analysisId || !analysisId.trim()) {
      setError("Please enter an analysis ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post("/api/v1/guestParticipant", { analysisId });

      if (response?.data?.success) {
        setAnalysisData(response.data.analysisData);
        setShowSecurityModal(true);
      } else {
        setError(response?.data?.message || "Failed to retrieve analysis data");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSecurity = () => {
    setShowSecurityModal(false);
  };

  const handleDeclineSecurity = () => {
    setShowSecurityModal(false);
    setAnalysisData(null);
  };

  return (
    <Container size="sm" my={40}>
      <Title ta="center" mb="xl">Participate in Analysis</Title>

      {!analysisData && (
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <ParticipateForm onSubmitId={handleSubmitId} loading={loading} />
        </Paper>
      )}

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

      <SecurityModal
        opened={showSecurityModal}
        onAccept={handleAcceptSecurity}
        onDecline={handleDeclineSecurity}
      />

      {analysisData && !showSecurityModal && (
        <>
          {/* Timer Card */}
          <Card withBorder shadow="md" p="lg" mt="xl" radius="md">
            <Stack align="center" spacing="xs">
              <Group gap="xs" align="center">
                <IconVideo size={20} color="red" />
                <Text c="red" fw={600}>Recording in progress</Text>
              </Group>
              <div style={{ fontSize: rem(40), fontWeight: 700, textAlign: "center" }}>
                <Timer analysisData={analysisData} />
              </div>
            </Stack>
          </Card>

          {/* Analysis content Card */}
          <Card withBorder shadow="md" p="lg" mt="md" radius="md">
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
                ...(analysisData.tasks || []).map((task, index) => ({
                  title: `Task ${index + 1}`,
                  content: (() => {
                    const content = String(task.taskContent ?? "");
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
          </Card>
        </>
      )}
    </Container>
  );
};