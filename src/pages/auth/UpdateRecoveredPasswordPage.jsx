import axios from 'axios';
import { useSearchParams } from 'react-router';


const UpdateRecoveredPasswordPage = () => {
    const [searchParams] = useSearchParams();

  // Get a specific query parameter
  const token = searchParams.get('token');


    const updateRecoveredPassword = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                token: token,
                newPassword: e.target.newPassword.value,
                confirmNewPassword: e.target.confirmNewPassword.value,
            };

            const response = await axios.patch('http://localhost:3000/api/v1/auth/createNewPassword', formData);      
            console.log('Password updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating recovered password:',
                error);
        }
    };
    
    return (

        <div className="">
            <h2>Update Recovered Password</h2>
            <form onSubmit={updateRecoveredPassword}>
                <input type="password" name="newPassword" placeholder="Enter your new password" required />
                <input type="password" name="confirmNewPassword" placeholder="Confirm your new password" required />
                <button type="submit">Update Password</button>
            </form>
        </div>
    );
};

export default UpdateRecoveredPasswordPage;