import { Container, Title, Paper } from '@mantine/core';
import { AnalysisTable } from "./AnalysisTable";
import { CreateNewAnalysisButton } from "./CreateNewAnalysisButton";

const UserDashboard = () => {
    return (
        <Container size="xl" py="xl">
            <CreateNewAnalysisButton mb="xl" />

            <Paper shadow="xs" p="md" mb="xl">
                <AnalysisTable />
            </Paper>

        </Container>
    );
};

export default UserDashboard;
