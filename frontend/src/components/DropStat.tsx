// eslint-disable

'use client';

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
            <StatElem message={messages ? messages.contracts : null} imgPath="/images/luggage.svg" titleKey="contracts_st" imgAltKey="luggage_st"></StatElem>
            <StatElem message={messages ? messages.battles : null} imgPath="/images/shooting.svg" titleKey="battles_st" imgAltKey="shooting_st"></StatElem>
            <StatElem message={messages ? messages.upgrades : null} imgPath="/images/key.svg" titleKey="upgrades_st" imgAltKey="key_st"></StatElem>
            <StatElem message={messages ? messages.cases : null} imgPath="/images/arrow.svg" titleKey="cases_st" imgAltKey="arrow_st"></StatElem>
        </>
    )
}

export default DropStat
