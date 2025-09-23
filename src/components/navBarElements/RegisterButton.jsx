import { NavLink } from "react-router";
import { Button } from '@mantine/core';

const RegisterButton = () => {
    return (
        <Button
            component={NavLink}
            to="/auth/register"
            variant="default"
            size="sm"
        >
            Probar gratis
        </Button>
    );
}

export default RegisterButton;