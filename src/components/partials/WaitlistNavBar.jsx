import { Image } from '@mantine/core';
import { NavLink as RouterNavLink } from 'react-router';
import styles from './WaitlistNavBar.module.css';

const WaitlistNavBar = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image src="/images/logo.png" alt="logo" width={40} height={40} />
      </div>
      <nav className={styles.navLinks}>
        <RouterNavLink to="/" className={styles.link}>Home</RouterNavLink>
        <RouterNavLink to="/terminos-condiciones" className={styles.link}>Términos y condiciones</RouterNavLink>
        <RouterNavLink to="/preguntas-frecuentes" className={styles.link}>Preguntas frecuentes</RouterNavLink>
      </nav>
    </header>
  );
};

export default WaitlistNavBar;