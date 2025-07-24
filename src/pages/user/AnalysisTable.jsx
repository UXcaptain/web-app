import apiClient from "../../config/API/axiosConfig.mjs";
import { Anchor, Table } from '@mantine/core';
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

                        setAnalysesArray(response.data.analyses); // Access the analyses array directly
                        setLoading(false);

            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, []);

    if (loading) return <div>Loading Analysis entries...</div>;
    if (error) return <div>Error: {error}</div>;

    // Ensure analysesArray is an array before mapping
    const rows = Array.isArray(analysesArray) && analysesArray.length > 0 ? analysesArray.map((item) => (
        <Table.Tr key={item.id}>
            <Table.Td>
                <Anchor component="button" fz="sm">
                    {item.name}
                </Anchor>
            </Table.Td>
            <Table.Td>{item.url}</Table.Td>
            <Table.Td>{item._count.AnalysisEntries} / {item.max_number_of_participants}</Table.Td>
            <Table.Td>{new Date(item.created_at).toLocaleDateString()}</Table.Td>
            <Table.Td><button onClick={() => item?.id && navigate(`/analysis/${item.id}`)}>View Details</button></Table.Td>
        </Table.Tr>
    )) : [];

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="xs">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Analysis Name</Table.Th>
                        <Table.Th>URL</Table.Th>
                        <Table.Th>Participants</Table.Th>
                        <Table.Th>Date</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}