import { Outlet } from "react-router";
import AuthNavBar from "../../components/partials/AuthNavBar";

const AuthWrapper = () => {
    return (
        <div>
        
        <AuthNavBar />
        <h1>This is the AuthWrapper and is followed by outlets</h1>

        <div>
            <Outlet />
        </div>
        </div>
    );
    };

    export default AuthWrapper;