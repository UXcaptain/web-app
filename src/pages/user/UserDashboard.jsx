import { Container, Title, Paper } from '@mantine/core';
import UserFooter from "../../components/partials/UserFooter";
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

            <UserFooter />
        </Container>
    );
};

export default UserDashboard;
