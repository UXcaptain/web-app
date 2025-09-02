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
        <RouterNavLink to="#how-it-works" className={styles.link}>How does it work?</RouterNavLink>
        <RouterNavLink to="#features" className={styles.link}>Features</RouterNavLink>
        <RouterNavLink to="#examples" className={styles.link}>Ejemplos</RouterNavLink>
        <RouterNavLink to="/preguntas-frecuentes" className={styles.link}>Preguntas frecuentes</RouterNavLink>
      </nav>
    </header>
  );
};

export default WaitlistNavBar;