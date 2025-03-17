import { Link } from 'react-router'

const pageNotFound = () => {
    return (
        <div>
            <h1>404</h1>
            <p>Page not found</p>
            <Link to="/">Go to home</Link>
        </div>
    )
}

export default pageNotFound;