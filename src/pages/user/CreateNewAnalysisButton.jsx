import { useNavigate } from "react-router";


export const CreateNewAnalysisButton = () => {

    const navigate = useNavigate();
    return(
        <button onClick={() => navigate('/analysis/create')}>Create New Analysis</button>

    )

}