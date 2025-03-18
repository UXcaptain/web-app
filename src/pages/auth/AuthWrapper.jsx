import { Outlet } from "react-router";
import AuthNavBar from "../../components/partials/AuthNavBar";

const AuthWrapper = () => {
    return (
        <>
        <AuthNavBar />

        <Outlet />

        </>
    );
    };

    export default AuthWrapper;