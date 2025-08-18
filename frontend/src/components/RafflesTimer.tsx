'use client'
import React, { useState, useEffect } from 'react';

function RafflesTimer(props: { endTime: string }): React.ReactNode {
    const [timeLeft, setTimeLeft] = useState('');
    console.log(props.endTime)
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const end = new Date(props.endTime).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft('00:00:00');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            );
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, [props.endTime]);
    return (
        <>{timeLeft}</>
    )
}

export default RafflesTimer
