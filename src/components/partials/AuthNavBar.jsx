import { NavLink } from 'react-router'
import ForgotPasswordLink from '../navBarElements/ForgotPasswordLink';
import RegisterLink from '../navBarElements/RegisterLink';
import LogInLink from '../navBarElements/LogInLink';

const AuthNavBar = () => {
    return (
        <div className="navBarWrapper">

            <div className="logoContainer">
                <NavLink to="/">
                    <img src="/images/logo.png" alt="logo" />
                </NavLink>
            </div>

        
            <nav className='navBar'>
                <ul className='navBarUl'>
                    <li>
                        <LogInLink />
                    </li>
                    <li>
                        <RegisterLink />
                    </li>
                    <li>
                        <ForgotPasswordLink />
                        </li>
                </ul>
            </nav>
        </div>
    );
};

export default AuthNavBar;