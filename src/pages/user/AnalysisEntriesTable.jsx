import { Table, Button, Text, Center, Stack, Container, ThemeIcon, Title } from '@mantine/core';
import { IconTableOff, IconUsers } from '@tabler/icons-react';
import { CopyInviteLinkButton } from '../../components/partials/CopyInviteLinkButton';
import apiClient from '../../config/API/axiosConfig.mjs';
import { useState } from 'react';

export const AnalysisEntriesTable = ({ AnalysisEntries = [], analysisId }) => {
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
    if (!Array.isArray(AnalysisEntries) || AnalysisEntries.length === 0) {
        return (
            <Container py="xl" size="sm">
                <Center>
                    <Stack align="center" spacing="lg">
                        <ThemeIcon size={80} radius="xl" variant="light" color="blue">
                            <IconUsers size={40} />
                        </ThemeIcon>
                        <Title order={2} ta="center">Aún no hay participantes</Title>
                        <Text color="dimmed" ta="center" size="lg">
                            ¡Vaya! Aún nadie ha participado en tu análisis.
                        </Text>
                        <Text color="dimmed" ta="center" size="sm">
                            Comparte tu análisis para comenzar a recibir participaciones.
                        </Text>
                        <CopyInviteLinkButton
                            analysisId={analysisId}
                            size="md"
                            mt="md"
                        />
                    </Stack>
                </Center>
            </Container>
        );
    }

    const rows = AnalysisEntries.map((item) => (
        <Table.Tr key={item.id}>
            <Table.Td>
                <Text fw={500}>{item.id || 'N/A'}</Text>
            </Table.Td>
            <Table.Td>
                <Text fw={500}>{item.updated_at ? new Date(item.updated_at).toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</Text>
            </Table.Td>
            {/* <Table.Td>
                <Text fw={500}>{item.AnalysisEntriesProfile?.name || 'N/A'}</Text>
            </Table.Td> */}
            {/* <Table.Td>
            {item.AnalysisEntriesProfile?.last_name || 'N/A'}
            </Table.Td> */}
            {/* <Table.Td>
            {item.AnalysisEntriesProfile?.gender || 'N/A'}
            </Table.Td> */}
            {/* <Table.Td>
            {item.AnalysisEntriesProfile?.country || 'N/A'}
            </Table.Td> */}
            <Table.Td>
                <Button
                    variant="subtle"
                    size="sm"
                    loading={loadingEntries[item.id]}
                    onClick={() => handleViewAnalysisEntry(item.id)}
                >
                    Ver grabación
                </Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm" striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Fecha de subida</Table.Th>
                        <Table.Th>Acciones</Table.Th>



                        {/* <Table.Th>First Name</Table.Th>
                        <Table.Th>Last Name</Table.Th>
                        <Table.Th>Gender</Table.Th>
                        <Table.Th>Country</Table.Th>
                        <Table.Th>Actions</Table.Th> */}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
};