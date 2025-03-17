import axios from 'axios'
import { useState } from 'react'

const RegisterPage = () => {

    const [response, setResponse] = useState({
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/register/local', {
                username: e.target.username.value,
                password: e.target.password.value
            })
            

            if (response.data.success === false) {
                
                setResponse({
                    success: false,
                    message: response.data.message // TODO - SHOW CORRECT ERROR MESSAGE
                })
            }

            if (response.data.success === true) {
                setResponse({
                    success: true,
                    message: response.data.message
                })
            }
        } catch (err) {
            setResponse({
                success: false,
                message: err.message
            })
        }
    }

    return (
        <>
            <div>
                {response && (
                    <div className="responseContainer">
                    {response.success === false && (
                        <div className="errorDiv">
                            <p>{response.message}</p>
                        </div>
                    )}

                    {response.success === true && (
                        <div className="successDiv">
                            <p>{response.message}</p>
                        </div>
                    )}
                </div>
                )}
                
                <h1>Register Page</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" defaultValue="username@gmail.com" placeholder="Username" />
                    <input type="password" name="password" defaultValue="password" placeholder="Password" />
                    <button type="submit">Register</button>
                </form>
            </div>
        </>
    )
}

export default RegisterPage