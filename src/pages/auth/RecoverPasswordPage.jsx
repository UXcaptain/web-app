import axios from "axios";

const RecoverPasswordPage = () => {
    
    const recoverPasswordRequest = async (e) => {
        
        e.preventDefault();

        const formData = {
            email: e.target.email.value
        }

        try {
            const response = await axios.post('http://localhost:3000/api/v1/auth/recoverPassword', formData);

            console.log(response)

        } catch (error) {

            console.error("Error recovering password:", error);
        }
    }

    
    return (

        <div>
            <h2>Recover Password</h2>
            <form onSubmit={recoverPasswordRequest}>
                <input type="email" name="email" placeholder="Enter your email" required defaultValue="username@gmail.com" />
                <button type="submit">Recover Password</button>
            </form>
        </div>
    )

};

export default RecoverPasswordPage;