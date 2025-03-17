import { Outlet } from 'react-router'
import AdminNavBar from '../../components/partials/AdminNavBar.jsx'
export const AdminDashboardWrapper = () => {
    return (
        <div>
            <AdminNavBar />
            <h1>This is the admin dashboard and is followed by outlets</h1>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminDashboardWrapper;