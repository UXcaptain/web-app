import { Table } from '@mantine/core';
import { useNavigate } from "react-router";

export const AnalysisEntriesTable = (props) => {

    const navigate = useNavigate();

    const participantsArray = props.participants ? props.participants : [];

    const rows = Array.isArray(participantsArray) && participantsArray.length > 0 ? participantsArray.map((item) => (
        <Table.Tr key={item.id}>
            <Table.Td>{item.ParticipantsProfile.name}</Table.Td>
            <Table.Td>{item.ParticipantsProfile.last_name}</Table.Td>
            <Table.Td>{item.ParticipantsProfile.gender}</Table.Td>
            <Table.Td>{item.ParticipantsProfile.country}</Table.Td>

            
            <Table.Td><button onClick={() => navigate(`/entry/${item.id}`)}>Play recording</button> </Table.Td>
        
        </Table.Tr>
    )) : [];

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="xs">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>first name</Table.Th>
                        <Table.Th>last name</Table.Th>
                        <Table.Th>Gender</Table.Th>
                        <Table.Th>Country</Table.Th>


                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}