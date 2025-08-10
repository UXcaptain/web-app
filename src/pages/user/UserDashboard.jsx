import { Container, Title, Paper } from '@mantine/core';
import { AnalysisTable } from "./AnalysisTable";
import { CreateNewAnalysisButton } from "./CreateNewAnalysisButton";

const UserDashboard = () => {
    return (
        <Container size="xl" py="xl">
            <Title order={1} align="center" mb="xl">My Analysis</Title>
            <CreateNewAnalysisButton mb="xl" />

            <Paper shadow="xs" p="md" mb="xl">
                <AnalysisTable />
            </Paper>

        </Container>
    );
};

export default UserDashboard;
