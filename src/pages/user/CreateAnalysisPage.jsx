import apiClient from "../../config/API/axiosConfig.mjs";
import { useState } from 'react';

export const CreateAnalysisPage = () => {

    const [name, setName] = useState('analysis name');
    const [url, setUrl] = useState('https://www.youtube.com');
    const [maxNumberOfParticipants, setmaxNumberOfParticipants] = useState(10);
    const [tasks, setTasks] = useState([{ value: '' }]);
    const [scenario, setScenario] = useState('imagine you want to buy a house and your cash pile is 200k')

    const handleSubmit = async (event) => {
        event.preventDefault();

        const analysisData = {
            name,
            url,
            maxNumberOfParticipants,
            scenario,
            tasks: [{taskType: "text", value: 'do this and that'}], // TODO - FIX task creation logic here
            device: 'computer',
            
            // tasks: tasks.reduce((acc, task, index) => {
            //     acc[`task${index + 1}`] = task.value;
            //     return acc;
            // }, {})
        }
        
        try {
            const response = await apiClient.post('/api/v1/analysis/', analysisData);
            return response.data;
        } catch (error) {
            console.error("Error creating analysis:", error);
            throw error;
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', 'gap': '8px' }}>
                <h2>Create Analysis</h2>
                <label htmlFor="name">Analysis Name:</label>
                <input
                    type="text"
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                    required
                    value={name}
                />

                <label htmlFor="url">Analysis URL:</label>
                <textarea
                    id="url"
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    value={url}
                />

                <label htmlFor="scenario">Scenario - please indicate the mindset the user should have when completing this test (Optional)</label>
                <textarea 
                name="scenario"
                id="scenario"
                onChange={(e) => setScenario(e.target.value)}
                value={scenario}
                >

                </textarea>

                <label htmlFor="maxNumberOfParticipants">Number of Participants: - Recommended: 5-10</label>
                <input
                    type="number"
                    id="maxNumberOfParticipants"
                    onChange={(e) => setmaxNumberOfParticipants(e.target.value)}
                    required
                    value={maxNumberOfParticipants}
                />

                <div className="analysisTasks flex flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', 'gap': '8px' }}>
                    <label htmlFor="task1">question 1</label>
                    <textarea className="task1"></textarea>

                    <label htmlFor="task2">question 2</label>
                    <textarea className="task2"></textarea>
                    
                    <label htmlFor="task3">question 3</label>
                    <textarea className="task3"></textarea>
                </div>
                

                <button type="submit">Create Analysis</button>
            </form>
        </>
    );
};

export default CreateAnalysisPage;