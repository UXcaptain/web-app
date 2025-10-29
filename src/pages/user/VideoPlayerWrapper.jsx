import { Outlet } from "react-router";
import { useState, useEffect } from "react";
import apiClient from "../../config/API/axiosConfig.mjs";
import { useNavigate } from "react-router";
import { usePostHog } from 'posthog-js/react'
import { Container, Stack, Loader, Text } from '@mantine/core';

const VideoPlayerWrapper = () => {
    const posthog = usePostHog()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await apiClient.get(`/api/v1/auth/session`);
                setUserId(response.data.user.id)
                setLoading(false);
            } catch (error) {
                navigate('/auth/login');
            }
        };

        checkSession();
    }, [navigate]);

    useEffect(() => {
        if (userId) {
            posthog?.identify(userId, {
            })
        }
    }, [userId])

    return (
        <>
            {loading ? (
                <Container>
                    <Stack align="center" mt="xl">
                        <Loader size="xl" />
                        <Text>Cargando...</Text>
                    </Stack>
                </Container>
            ) : (
                <>
                    <Outlet />
                </>
            )}
        </>
    );
}

export default VideoPlayerWrapper;