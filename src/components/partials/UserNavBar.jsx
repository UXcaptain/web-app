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
import { CreateNewAnalysisButton } from '../../pages/user/CreateNewAnalysisButton';
import { usePostHog } from 'posthog-js/react';


const UserNavBar = () => {

  const navigate = useNavigate();
  const posthog = usePostHog();

    const handleLogout = async () => {
    try {
        
     await apiClient.post(`/api/v1/auth/logout`)
        
        // Reset PostHog to clear user session and prevent tracking continuity
        posthog.reset();
        
        navigate('/')

    } catch (error) {
        console.error('Logout failed:', error);
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
        <div style={{ padding: '0 16px 16px 16px' }}>
          <CreateNewAnalysisButton fullWidth />
        </div>
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
