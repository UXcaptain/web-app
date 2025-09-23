import { NavLink } from 'react-router'
import { useState } from 'react';
import {
  IconLogout,
  IconHomeFilled,
  IconUserCircle,
  IconCreditCardFilled
} from '@tabler/icons-react';
import classes from './NavbarSimple.module.css';
import { useNavigate } from "react-router";
import apiClient from "../../config/API/axiosConfig.mjs";
import { logError } from "../../config/logging/loggerFunctions.mjs";


const UserNavBar = () => {

  const navigate = useNavigate();

    const handleLogout = async () => {
    try {
        
     await apiClient.post(`/api/v1/auth/logout`)
        navigate('/')

    } catch (error) {
        logError('Error in logout functionality', error, 'N/A');
        }
    
    }


  const [active, setActive] = useState('User Home');

  const data = [
  { link: '/dashboard', label: 'Dashboard', icon: IconHomeFilled },
  { link: '/user/profile', label: 'Cambiar contraseña', icon: IconUserCircle },
  { link: '/user/billing', label: 'Planes', icon: IconCreditCardFilled },
];

  const links = data.map((item) => (
    <NavLink to={item.link} key={item.label} className={classes.link} data-active={item.label === active || undefined} onClick={() => setActive(item.label)}>
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </NavLink>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        {links}
      </div>

      <div className={classes.footer}>

        <a className={classes.link} onClick={handleLogout}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Cerrar sesión</span>
        </a>
      </div>
    </nav>
  );  
  
};

export default UserNavBar;
