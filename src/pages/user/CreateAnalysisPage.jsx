import apiClient from "../../config/API/axiosConfig.mjs";
import { useState } from 'react';
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
  Alert
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export const CreateAnalysisPage = () => {

    const [name, setName] = useState(null);
    const [url, setUrl] = useState(null);
    
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
    const [tasks, setTasks] = useState([{ value: '' }]);
    const [scenario, setScenario] = useState(null);
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
            setErrors(prev => ({ ...prev, tasks: 'At least one task is required' }));
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
            newErrors.name = 'Analysis name is required';
        }
        
        // Validate URL
        if (!url || url.trim() === '') {
            newErrors.url = 'URL is required';
        } else if (!/^https?:\/\/(www\.)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}.*$/.test(url) &&
                   !/^(www\.)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}.*$/.test(url)) {
            newErrors.url = 'Please enter a valid URL with a proper domain structure';
        }
        
        // Validate maxNumberOfParticipants
        if (!maxNumberOfParticipants || maxNumberOfParticipants < 1) {
            newErrors.maxNumberOfParticipants = 'Number of participants must be at least 1';
        }
        
        // Validate tasks
        const nonEmptyTasks = tasks.filter(task => task.value.trim() !== '');
        if (nonEmptyTasks.length === 0) {
            newErrors.tasks = 'At least one task with content is required';
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
            return response.data;
        } catch (error) {
            console.error("Error creating analysis:", error);
            throw error;
        }
    };

    return (
        <Box sx={{ maxWidth: 600 }} mx="auto" mt="xl">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={2} mb="lg">Create Analysis</Title>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Analysis Name"
                        placeholder="Enter analysis name"
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
                        label="Analysis URL"
                        placeholder="Enter URL for analysis"
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
                        label="Scenario - please indicate the mindset the user should have when completing this test (Optional)"
                        placeholder="Enter scenario description"
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        mb="md"
                        minRows={3}
                    />

                    <NumberInput
                        label="Number of Participants - Recommended: 5-10"
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
                        mb="md"
                    />

                    <Box mb="md">
                        <Group position="apart" mb="xs">
                            <Text weight={500}>Tasks</Text>
                            <Button onClick={addTask} variant="outline" size="sm">
                                Add Task
                            </Button>
                        </Group>
                        
                        {errors.tasks && (
                            <Alert icon={<IconAlertCircle size="1rem" />} title="Task Error" color="red" mb="sm">
                                {errors.tasks}
                            </Alert>
                        )}

                        {tasks.map((task, index) => (
                            <Card key={index} shadow="none" padding="sm" radius="md" withBorder mb="sm">
                                <Group position="apart" mb="xs">
                                    <Text size="sm" weight={500}>Task {index + 1}</Text>
                                    {tasks.length > 1 && (
                                        <Button
                                            onClick={() => removeTask(index)}
                                            variant="subtle"
                                            color="red"
                                            size="xs"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </Group>
                                <Textarea
                                    placeholder="Enter task description"
                                    value={task.value}
                                    onChange={(e) => handleTaskChange(index, e.target.value)}
                                    minRows={2}
                                />
                            </Card>
                        ))}
                    </Box>

                    <Group position="right" mt="md">
                        <Button type="submit">
                            Create Analysis
                        </Button>
                    </Group>
                </form>
            </Card>
        </Box>
    );
};

export default CreateAnalysisPage;