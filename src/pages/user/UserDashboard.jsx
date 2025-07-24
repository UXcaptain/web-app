import UserFooter from "../../components/partials/UserFooter";
import { AnalysisTable } from "./AnalysisTable";
import { CreateNewAnalysisButton } from "./CreateNewAnalysisButton";

const UserDashboard = () => {



    return (
        <>
            <div>
                <h1>My Analysis</h1>
                <CreateNewAnalysisButton />

                <div className="table">
                    <AnalysisTable />
                </div>


                <div className="footer">
                    <UserFooter />
                </div>
            </div>
        </>
    );
}

export default UserDashboard;
