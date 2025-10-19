import { Container, Title, Paper } from '@mantine/core';
import { AnalysisTable } from "./AnalysisTable";
import { CreateNewAnalysisButton } from "./CreateNewAnalysisButton";
import NoActiveSubscriptionBanner from "../../components/partials/NoActiveSubscriptionBanner.jsx";

const UserDashboard = () => {
    return (
        <Container size="xl" py="xl">
            <NoActiveSubscriptionBanner />
            <CreateNewAnalysisButton mb="xl" mt="md" />
            
                        <Paper shadow="xs" p="md" mb="xl" mt="xl">
                <AnalysisTable />
            </Paper>

        </Container>
    );
};

export default UserDashboard;
