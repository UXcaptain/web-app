import { useState } from "react";
import { useNavigate } from "react-router";

const LoginForm = () => {

    const [errors, setErrors] = useState(null);

    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        

        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        try {

            const response = await fetch('http://localhost:3000/api/v1/auth/login/local', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            console.log(response)
            const jsonResponse = await response.json();


            if (jsonResponse.success === true) {
                console.log('Login successful:', response.data);

                navigate('/user');
            }

        } catch (error) {
            console.error('Login failed:', error);
            
            if (error.response.status === 401) {
                setErrors('The combination of user and password is incorrect');
            }
            else {
                setErrors(error.message);
            }

        }
    };

    
    return (
        <div>
            <h1>Login Page</h1>
            {errors && <div className="error">{errors}</div>}
            <form method="post" action="/login" onSubmit={handleLogin}>
                <input type="text" name="username" placeholder="Username" defaultValue="username@gmail.com" />
                <input type="password" name="password" placeholder="Password" defaultValue="password" />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginForm