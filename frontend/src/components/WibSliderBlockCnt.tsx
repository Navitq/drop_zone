'use client'
import React, { useEffect, useRef } from 'react'
import WibSliderBlock from '@/components/WibSliderBlock'
import style from '@/styles/winInventoryBlock.module.scss'
import useWebSocket from 'react-use-websocket';
import { BACKEND_PATHS } from '@/utilites/urls';
import { useAppSelector } from '@/lib/hooks';


type DropSliderMap = {
    start_data: { data: any },
    update_slider_data: { data: any },
};

function WibSliderBlockCnt(): React.ReactNode {
    const timerRef = useRef<boolean>(false);
    const wsOpened = useRef<boolean>(false)
    const isTopActive = useAppSelector(state => state.dropSlider.isTopActive)

    useEffect(() => {
        if (isTopActive === false && !timerRef.current || !wsOpened.current) {
            return
        }
        timerRef.current = true;
        const timer = setTimeout(() => {
            console.log(12312321)

            sendMessage(JSON.stringify(
                {
                    event: "change_slider_type",
                    data: isTopActive ? "top" : "live"
                }
            ))
        }, 500)
        return () => {
            clearTimeout(timer)
        }
    }, [isTopActive])

    const startGameData = (payload: any) => {
        console.log(payload)
    }

    const updateGameData = (payload: any) => {
        console.log(payload)
    }


    const eventHandlers: Record<keyof DropSliderMap, (payload: any) => void> = {
        start_data: (payload) => startGameData(payload),
        update_slider_data: (payload) => updateGameData(payload),
    };


    const { sendMessage, lastJsonMessage, readyState } = useWebSocket(
        `${BACKEND_PATHS.dropSliderWSS()}`,
        {
            shouldReconnect: (closeEvent) => {
                // closeEvent.code — код закрытия WS
                if (closeEvent) {
                    const code = closeEvent.code;
                    // Если код 1000–2000, не переподключаемся
                    if (code >= 1000 && code < 2000) return false;
                }
                return true; // иначе переподключаемся
            },  // авто-переподключение
            onOpen: () => { console.log("WS connected"); wsOpened.current = true },
            onClose: () => { },
            onError: (event: WebSocketEventMap['error']) => console.log(event),
            onMessage: (event) => {
                const data = JSON.parse(event.data) as { event: keyof DropSliderMap; payload: any };
                const handler = eventHandlers[data.event];
                if (handler) {
                    handler(data);
                } else {
                    console.warn("No handler for event:", data.event, data.payload);
                }
            },
            retryOnError: true,
            reconnectAttempts: 5,
            reconnectInterval: 3000,
        }
    );

    return (
        <>
            <WibSliderBlock></WibSliderBlock>
        </>
    )
}

export default React.memo(WibSliderBlockCnt)
