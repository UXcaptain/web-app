const UserCard = ({user}) => {

    return (
        <div className="userCard" key={user._id}>
            <p>user id: {user.id}</p>
            <p>Name: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>created at: {user.created_at}</p>
            <p>last updated at: {user.last_updated_at.toLocaleString('en-GB')}</p>
            <p>last login at: {user.last_login_at || 'never logged in'}</p>

        </div>
    )
}

export default UserCard;