import { useNavigate } from "react-router";
import { Button } from '@mantine/core';


export const CreateNewAnalysisButton = () => {

    const navigate = useNavigate();
    return(
        <Button onClick={() => navigate('/analysis/create')}>Create New Analysis</Button>

    )

}