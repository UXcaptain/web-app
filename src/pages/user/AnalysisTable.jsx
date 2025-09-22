import apiClient from "../../config/API/axiosConfig.mjs";
import { Table, Button, Text, Center, Loader, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

export const AnalysisTable = () => {
    const [analysesArray, setAnalysesArray] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const response = await apiClient.get(`/api/v1/analysis`);
                setAnalysesArray(response.data.analyses);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, []);

    if (loading) {
        return (
            <Center py="xl">
                <Loader />
                <Text ml="sm">Loading analysis entries...</Text>
            </Center>
        );
    }

    if (error) {
        return (
            <Alert
                icon={<IconAlertCircle size={16} />}
                title="Error"
                color="red"
                variant="light"
            >
                {error}
            </Alert>
        );
    }

    // Handle empty state
    if (!Array.isArray(analysesArray) || analysesArray.length === 0) {
        return (
            <Center py="xl">
                <Text>No analysis entries found</Text>
            </Center>
        );
    }


    const copyInviteLink = async (analysisId) => {
        const inviteLink = `${import.meta.env.VITE_SITE_BASE_URL}/participate/${analysisId}`;
        try {
            await navigator.clipboard.writeText(inviteLink);
            // You might want to add a toast notification here
        } catch (err) {
            console.error('Failed to copy invite link:', err);
        }
    };

    const rows = analysesArray.map((item) => (
        <Table.Tr key={item.id}>
            <Table.Td>
                <Text fw={500}>{item.name}</Text>
            </Table.Td>
            <Table.Td>
                <Text c="dimmed" size="sm">{item.url}</Text>
            </Table.Td>
            <Table.Td>{item.device}</Table.Td>
            <Table.Td>
                {item._count.AnalysisEntries} / {item.max_number_of_participants}
            </Table.Td>
            <Table.Td>
                <Text c={item.status === 'active' ? 'green' : 'dimmed'}>
                    {item.status}
                </Text>
            </Table.Td>
            <Table.Td>
                {new Date(item.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}
            </Table.Td>
            <Table.Td>
                <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => item?.id && navigate(`/analysis/${item.id}`)}
                >
                    View Details
                </Button>
                <Button
                    variant="light"
                    size="sm"
                    ml="xs"
                    onClick={() => copyInviteLink(item.id)}
                >
                    Copy Invite Link
                </Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm" striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Analysis Name</Table.Th>
                        <Table.Th>URL</Table.Th>
                        <Table.Th>Device</Table.Th>
                        <Table.Th>Participants</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}