import React, { useEffect, useState, useRef } from 'react';
import StatElem from './StatElem'

interface Message {
    contracts: number,
    battles: number,
    upgrades: number,
    cases: number
}

function DropStat(): React.ReactNode {
    const [messages, setMessages] = useState<Message | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    function createSPConection(url: string): void {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (e: MessageEvent) => {
            setMessages(() => JSON.parse(e.data) as Message);
        };

        eventSource.onerror = () => {
            eventSource.close();
            setTimeout(() => createSPConection(url), 5000);
        };
    }

    useEffect(() => {
        return;

        createSPConection('/api/sse');

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    return (

        <>
            <StatElem message={messages.} imgPath="" titleKey="" imgAltKey=""></StatElem>
            <StatElem></StatElem>
            <StatElem></StatElem>
            <StatElem></StatElem>
        </>
    )
}

export default DropStat
