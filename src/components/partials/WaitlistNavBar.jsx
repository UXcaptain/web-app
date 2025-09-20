import { Image } from '@mantine/core';
import { NavLink as RouterNavLink } from 'react-router';
import styles from './WaitlistNavBar.module.css';

const WaitlistNavBar = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image src="/logo.svg" alt="logo" width={40} height={40} />
      </div>
      <nav className={styles.navLinks}>
        <RouterNavLink to="/" className={styles.link}>Home</RouterNavLink>
        <RouterNavLink
          to="#how-it-works"
          className={styles.link}
          onClick={(e) => {
            console.log('How it works link clicked');
            console.log('Event:', e);
            console.log('Default prevented:', e.defaultPrevented);
          }}
        >
          How does it work?
        </RouterNavLink>
        <RouterNavLink
          to="#features"
          className={styles.link}
          onClick={(e) => {
            console.log('Features link clicked');
            console.log('Event:', e);
            console.log('Default prevented:', e.defaultPrevented);
          }}
        >
          Features
        </RouterNavLink>
        <RouterNavLink
          to="#examples"
          className={styles.link}
          onClick={(e) => {
            console.log('Examples link clicked');
            console.log('Event:', e);
            console.log('Default prevented:', e.defaultPrevented);
          }}
        >
          Ejemplos
        </RouterNavLink>
        <RouterNavLink to="/preguntas-frecuentes" className={styles.link}>Preguntas frecuentes</RouterNavLink>
      </nav>
    </header>
  );
};

export default WaitlistNavBar;