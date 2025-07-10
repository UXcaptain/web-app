import { Outlet } from "react-router";
import  NavbarSimple  from "../../components/partials/UserNavBar";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import apiClient from "../../config/API/axiosConfig.mjs";
import { logError } from "../../config/logging/loggerFunctions.mjs";

const UserWrapper = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [opened, { toggle }] = useDisclosure();

    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await apiClient.get(`/api/v1/auth/session`);
                
                setLoading(false);


            } catch (error) {
                logError('Failed to check session', error);
                navigate('/auth/login');
            }
        };

        checkAuth();
    }, [navigate]);


  return (



    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {/* <UserNavBar />  */}
        <NavbarSimple />
      </AppShell.Navbar>

      <AppShell.Main>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Outlet />
      )}
      </AppShell.Main>

    </AppShell>
  );

}

export default UserWrapper;

import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

