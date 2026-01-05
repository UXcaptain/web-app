import apiClient from "../../config/API/axiosConfig.mjs";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Group,
  Box,
  Title,
  Card,
  Text,
  Alert,
  Modal
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useSubscription } from '../../contexts/SubscriptionContext.jsx';
 
export const CreateAnalysisPage = () => {

    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();

    const { hasActiveSubscription, loading } = useSubscription();

    useEffect(() => {
        if (!loading && !hasActiveSubscription) {
            navigate('/dashboard', { replace: true });
        }
    }, [loading, hasActiveSubscription, navigate]);

    // Function to normalize URL by adding https:// if missing
    const normalizeUrl = (inputUrl) => {
        if (!inputUrl) return '';

        // Trim whitespace
        const trimmedUrl = inputUrl.trim();

        // Check if it already has a protocol
        if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
            return trimmedUrl;
        }

        // Add https:// if no protocol is present
        return `https://${trimmedUrl}`;
    };
    const [maxNumberOfParticipants, setmaxNumberOfParticipants] = useState(5);
    const [tasks, setTasks] = useState([{ value: '' }, { value: '' }, { value: '' }]);
    const [scenario, setScenario] = useState('');
    const [errors, setErrors] = useState({});

    const addTask = () => {
        setTasks([...tasks, { value: '' }]);
        // Clear task error if it was set
        if (errors.tasks) {
            setErrors(prev => ({ ...prev, tasks: '' }));
        }
    };

    const removeTask = (index) => {
        // Prevent removing all tasks - ensure at least one task exists
        if (tasks.length <= 1) {
            setErrors(prev => ({ ...prev, tasks: 'Incluye al menos una tarea' }));
            return;
        }
        
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
        
        // Clear task error if it was set
        if (errors.tasks) {
            setErrors(prev => ({ ...prev, tasks: '' }));
        }
    };

    const handleTaskChange = (index, value) => {
        const newTasks = [...tasks];
        newTasks[index].value = value;
        setTasks(newTasks);
        
        // Clear task error if it was set
        if (errors.tasks) {
            setErrors(prev => ({ ...prev, tasks: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Validate name
        if (!name || name.trim() === '') {
            newErrors.name = 'El nombre del análisis es obligatorio';
        }
        
        // Validate URL
        if (!url || url.trim() === '') {
            newErrors.url = 'La URL es obligatoria';
        } else if (!/^https?:\/\/(www\.)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}.*$/.test(url) &&
                   !/^(www\.)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}.*$/.test(url)) {
            newErrors.url = 'Por favor, introduzca una URL válida con una estructura de dominio adecuada';
        }
        
        // Validate maxNumberOfParticipants
        if (!maxNumberOfParticipants || maxNumberOfParticipants < 1) {
            newErrors.maxNumberOfParticipants = 'El número de participantes debe ser al menos 1';
        }
        
        // Validate tasks
        const nonEmptyTasks = tasks.filter(task => task.value.trim() !== '');
        if (nonEmptyTasks.length === 0) {
            newErrors.tasks = 'Se requiere al menos una tarea con contenido';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Filter out empty tasks
        const nonEmptyTasks = tasks.filter(task => task.value.trim() !== '');
        
        // Format tasks for API
        const formattedTasks = nonEmptyTasks.map(task => ({
            taskType: "text",
            taskContent: task.value
        }));

        const analysisData = {
            name,
            url: normalizeUrl(url),
            maxNumberOfParticipants,
            scenario,
            tasks: formattedTasks,
            device: 'computer'
        }

        try {
            const response = await apiClient.post('/api/v1/analysis', analysisData);
            setSuccessMessage('¡Análisis creado con éxito!');
            setShowModal(true);
            setCountdown(5);
            const timer = setInterval(() => {
                setCountdown(prevCountdown => {
                    if (prevCountdown <= 1) {
                        clearInterval(timer);
                        setShowModal(false);
                        navigate('/dashboard');
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
            return response.data;
        } catch (error) {
            console.error("Error creando análisis:", error);
            throw error;
        }
    };

    // Restrict access when there is no active subscription
    if (loading) {
        return null;
    }
    if (!hasActiveSubscription) {
        return null;
    }
    return (
        <Box sx={{ maxWidth: 600 }} mx="auto" mt="xl">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={2} mb="lg">Crear Análisis</Title>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Nombre del Análisis"
                        placeholder="Happy Path - Purchase"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) {
                                setErrors(prev => ({ ...prev, name: '' }));
                            }
                        }}
                        error={errors.name}
                        required
                        mb="md"
                    />

                    <Textarea
                        label="Introduce la URL que deben analizar los participantes"
                        placeholder="https://youtube.com"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (errors.url) {
                                setErrors(prev => ({ ...prev, url: '' }));
                            }
                        }}
                        error={errors.url}
                        required
                        mb="md"
                    />

                    <Textarea
                        label="(Opcional) Escenario - Indica el escenario que debe simular el participante"
                        placeholder="Imagina que es el cumpleaños de tu hermano y tienes 250€ para comprar un reloj"
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        mb="md"
                        minRows={3}
                    />

                    <Box mb="md">
                        <NumberInput
                            label="Número de Participantes"
                            value={maxNumberOfParticipants}
                            onChange={(value) => {
                                setmaxNumberOfParticipants(value);
                                if (errors.maxNumberOfParticipants) {
                                    setErrors(prev => ({ ...prev, maxNumberOfParticipants: '' }));
                                }
                            }}
                            error={errors.maxNumberOfParticipants}
                            required
                            min={1}
                            max={20}
                        />
                        <Text size="sm" color="dimmed" mt="xs">
                            Para obtener mejores resultados, utiliza entre 5-7 participantes
                        </Text>
                    </Box>

                    <Box mb="md">
                        <Group position="apart" mb="xs">
                            <Text weight={500}>Tareas</Text>
                            <Button onClick={addTask} variant="outline" size="sm">
                                Añadir Tarea
                            </Button>
                        </Group>
                        <Text size="sm" color="dimmed" mb="sm">
                            Recuerda que para obtener mejores resultados, la duración debe ser de 15-20 minutos - Aproximadamente 3 minutos por tarea
                        </Text>
                        
                        {errors.tasks && (
                            <Alert icon={<IconAlertCircle size="1rem" />} title="Error de Tarea" color="red" mb="sm">
                                {errors.tasks}
                            </Alert>
                        )}

                        {tasks.map((task, index) => (
                            <Card key={index} shadow="none" padding="sm" radius="md" withBorder mb="sm">
                                <Group position="apart" mb="xs">
                                    <Text size="sm" weight={500}>Tarea {index + 1}</Text>
                                    {tasks.length > 1 && (
                                        <Button
                                            onClick={() => removeTask(index)}
                                            variant="subtle"
                                            color="red"
                                            size="xs"
                                        >
                                            Eliminar
                                        </Button>
                                    )}
                                </Group>
                                <Textarea
                                    placeholder="Introduzca la descripción de la tarea"
                                    value={task.value}
                                    onChange={(e) => handleTaskChange(index, e.target.value)}
                                    minRows={2}
                                />
                            </Card>
                        ))}
                    </Box>

                    <Group position="right" mt="md">
                        <Button type="submit">
                            Crear Análisis
                        </Button>
                    </Group>
                </form>
                <Modal
                    opened={showModal}
                    onClose={() => setShowModal(false)}
                    title="Éxito"
                    centered
                    size="md"
                    styles={{
                        modal: {
                            backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
                            borderRadius: 'var(--mantine-radius-md)',
                            padding: 'var(--mantine-spacing-md)',
                        },
                        title: {
                            fontSize: 'var(--mantine-font-size-lg)',
                            fontWeight: 700,
                            fontFamily: 'Greycliff CF, var(--mantine-font-family)',
                            color: 'light-dark(var(--mantine-color-black), var(--mantine-color-white))',
                        },
                        body: {
                            padding: 'var(--mantine-spacing-md)',
                        },
                    }}
                >
                    <Text size="md" style={{ color: 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-1))' }}>{successMessage}</Text>
                    <Text size="sm" mt="sm" style={{ color: 'light-dark(var(--mantine-color-gray-6), var(--mantine-color-dark-2))' }}>Redirigiendo en {countdown} segundos...</Text>
                </Modal>
            </Card>
        </Box>
    );
};

export default CreateAnalysisPage;