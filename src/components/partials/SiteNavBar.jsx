import { NavLink } from 'react-router'
import LogInLink from '../navBarElements/LogInLink.jsx';
import RegisterLink from '../navBarElements/RegisterLink.jsx';

const SiteNavBar = () => {
    return (
        <div className="navBarWrapper">

            <div className="logoContainer">
                <NavLink to="/">
                    <img src="/logo.svg" alt="logo" />
                </NavLink>
            </div>

        
            <nav className='navBar'>
                <ul className='navBarUl'>
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/terminos-condiciones">Términos y condiciones</NavLink>
                    </li>
                    <li>
                        <NavLink to="/preguntas-frecuentes">Preguntas frecuentes</NavLink>
                        </li>
                </ul>
            </nav>


            <div className='buttonWrapper'>
            <LogInLink />
            <RegisterLink /> {/* Added RegisterLink component here */}
            </div>
        </div>
    );
};

export default SiteNavBar;