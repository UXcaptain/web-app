import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Text } from "@mantine/core";

const Timer = ({ analysisData }) => {
    const [timer, setTimer] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);

    useEffect(() => {
        let interval;
    
        if (analysisData) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer + 1);
            }, 1000);
            setTimerInterval(interval);
        } else {
            console.log("Analysis data cleared, stopping timer");
            clearInterval(timerInterval);
        }
    
        return () => {
            clearInterval(interval);
        };
    }, [analysisData]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Text>Time Elapsed: {formatTime(timer)}</Text>
    );
};

Timer.propTypes = {
    analysisData: PropTypes.object
};

export default Timer;