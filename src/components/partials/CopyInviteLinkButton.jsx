import { Button } from '@mantine/core';
import { useState } from 'react';

export const CopyInviteLinkButton = ({ analysisId, size = "sm", variant = "light", ...props }) => {
    const [buttonText, setButtonText] = useState('Copiar enlace de invitación');

    const copyInviteLink = async () => {
        const inviteLink = `${import.meta.env.VITE_SITE_BASE_URL}/participate?analysisId=${analysisId}`;
        try {
            await navigator.clipboard.writeText(inviteLink);
            setButtonText('¡Enlace copiado!');
            // Reset button text after 2 seconds
            setTimeout(() => {
                setButtonText('Copiar enlace de invitación');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy invite link:', err);
            setButtonText('Error al copiar');
            // Reset button text after 2 seconds
            setTimeout(() => {
                setButtonText('Copiar enlace de invitación');
            }, 2000);
        }
    };

    return (
        <Button 
            variant={variant} 
            size={size} 
            onClick={copyInviteLink}
            {...props}
        >
            {buttonText}
        </Button>
    );
};