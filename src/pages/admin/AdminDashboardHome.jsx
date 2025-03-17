import axios from "axios"
import { useState, useEffect } from "react"
import UserCard from "../../components/UserCard"

const AdminDashboard = () => {
    const [users, setUsers] = useState([])
    const [userCount, setUserCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/user/', {
                    withCredentials: true,
                })
                setUsers(response.data.users)
                setUserCount(response.data.users.length)
                setLoading(false)
            } catch (err) {
                console.log(err);
                setError(err.message)
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div className="userContainer">
                <p>user count: {userCount}</p>
                {Array.isArray(users) && users.length > 0 ? (
                    users.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))
                ) : (
                    <p>No users found</p>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard;