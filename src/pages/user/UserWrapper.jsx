import { Outlet } from "react-router";
import UserNavBar from "../../components/partials/UserNavBar";
import UserFooter from "../../components/partials/UserFooter";

const UserWrapper = () => {

    return (
        <div>
            <UserNavBar /> {/* Add UserNavBar component here */}
            <h1>This is the user profile wrapper, which contains different outlets</h1>
            <Outlet />
            <UserFooter />
        </div>
    )
}

export default UserWrapper;