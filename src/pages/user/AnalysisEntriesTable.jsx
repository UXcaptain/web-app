import { Table, Button, Text, Center } from '@mantine/core';
import apiClient from '../../config/API/axiosConfig.mjs';
import { useState } from 'react';

export const AnalysisEntriesTable = ({ participants = [] }) => {
    const [loadingEntries, setLoadingEntries] = useState({});

    const handleViewAnalysisEntry = async (analysisEntryId) => {
        // Set loading state for this specific entry
        setLoadingEntries(prev => ({ ...prev, [analysisEntryId]: true }));

        try {
            const analysisEntryUrl = await apiClient.get(`/api/v1/analysisEntry/${analysisEntryId}`);
            const followableUrl = analysisEntryUrl.data.analysisEntryPresignedUrl;
            window.open(followableUrl, '_blank');
        } catch (error) {
            console.error('Error fetching analysis entry:', error);
        } finally {
            // Reset loading state for this specific entry
            setLoadingEntries(prev => ({ ...prev, [analysisEntryId]: false }));
        }
    };

    // Handle empty state
    if (!Array.isArray(participants) || participants.length === 0) {
        return (
            <Center py="xl">
                <Text>No analysis entries found</Text>
            </Center>
        );
    }

    const rows = participants.map((item) => (
        <Table.Tr key={item.id}>
            <Table.Td>
                <Text fw={500}>{item.ParticipantsProfile?.name || 'N/A'}</Text>
            </Table.Td>
            <Table.Td>{item.ParticipantsProfile?.last_name || 'N/A'}</Table.Td>
            <Table.Td>{item.ParticipantsProfile?.gender || 'N/A'}</Table.Td>
            <Table.Td>{item.ParticipantsProfile?.country || 'N/A'}</Table.Td>
            <Table.Td>
                <Button
                    variant="subtle"
                    size="sm"
                    loading={loadingEntries[item.id]}
                    onClick={() => handleViewAnalysisEntry(item.id)}
                >
                    View Analysis Entry
                </Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm" striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>First Name</Table.Th>
                        <Table.Th>Last Name</Table.Th>
                        <Table.Th>Gender</Table.Th>
                        <Table.Th>Country</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
};