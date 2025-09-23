import { NavLink } from 'react-router'
import { Anchor, Image } from '@mantine/core';
import LogInButton from '../navBarElements/LogInButton.jsx';
import RegisterButton from '../navBarElements/RegisterButton.jsx';
import styles from './SiteNavBar.module.css';

const SiteNavBar = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <NavLink to="/">
                    <Image src="/logo.svg" alt="logo" width={40} height={40} />
                </NavLink>
            </div>

            <nav className={styles.navLinks}>
                <Anchor component={NavLink} to="/" className={styles.link}>
                    Home
                </Anchor>
                <Anchor component={NavLink} to="/terminos-condiciones" className={styles.link}>
                    Términos y condiciones
                </Anchor>
                <Anchor component={NavLink} to="/preguntas-frecuentes" className={styles.link}>
                    Preguntas frecuentes
                </Anchor>
            </nav>

            <div style={{ display: 'flex', gap: 'var(--mantine-spacing-sm)' }}>
                <LogInButton />
                <RegisterButton />
            </div>
        </header>
    );
};

export default SiteNavBar;