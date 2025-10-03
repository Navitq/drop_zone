'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import style from '@/styles/battles.module.scss'
import BattlePersonalBox from "@/components/BattlePersonalBox"
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { showNoMoneyModal, showUnAuthModal } from '@/redux/modalReducer'
import { setBattleData } from '@/redux/activeBattleReducer'
import { AxiosError } from "axios";
import { useParams, useSearchParams } from 'next/navigation'
import useWebSocket from 'react-use-websocket';
import { setPlayers } from '@/redux/activeBattleReducer'
import api from "@/lib/api";
import { BACKEND_PATHS } from '@/utilites/urls';

interface PlayersInfo {
    id: string;           // UUID
    imgpath: string;      // Ссылка на изображение
    username: string;
    money_amount: number;
}


function BattleGameField(): React.ReactNode {
    const isAuth = useAppSelector(state => state.user.isAuth)
    const { players_amount, players } = useAppSelector(state => state.activeBattle)
    const router = useRouter();
    const [socketOpened, setSocketOpened] = useState<boolean>(false);

    const params = useParams();
    const searchParams = useSearchParams();

    const gameId = Array.isArray(params.battleid) ? params.battleid[0] : params.battleid; // динамический сегмент
    const guest = searchParams.get('guest') === 'true'; //
    const dispatch = useAppDispatch();

    type BattleEventMap = {

        players_update: { players: PlayersInfo[] };
        game_finished: {data: any}; // можешь типизировать точнее, если знаешь структуру
    };

    function setPlayersLocal(players: PlayersInfo[]) {
        dispatch(setPlayers(players))
    }


    const eventHandlers: Record<keyof BattleEventMap, (payload: any) => void> = {
        players_update: (payload) => setPlayersLocal(payload.players),
    };


    const { sendMessage, lastJsonMessage, readyState } = useWebSocket(
        // URL создаём только если socketOpened === true
        socketOpened && gameId ? `${BACKEND_PATHS.battleGameWSS(gameId, !guest)}` : null,
        {
            shouldReconnect: () => true,  // авто-переподключение
            onOpen: () => console.log("WS connected"),
            onClose: () => console.log("WS closed"),
            onError: (event: WebSocketEventMap['error']) => console.log(event),
            onMessage: (event) => {
                const data = JSON.parse(event.data) as { event: keyof BattleEventMap; payload: any };
                const handler = eventHandlers[data.event];
                if (handler) {
                    handler(data);
                    console.log(data)
                } else {
                    console.warn("No handler for event:", data.event, data.payload);
                }
            },
            retryOnError: true,
            reconnectAttempts: 10,
            reconnectInterval: 3000,
        }
    );

    async function getServerGameData() {
        try {
            if (!gameId) {
                console.log(gameId)
            }
            console.log(gameId)
            const response = await api.post(BACKEND_PATHS.getGameData(gameId), { gameId: gameId });

            response.data.cases = JSON.parse(response.data.cases || "[]");
            response.data.players = JSON.parse(response.data.players || "[]");
            response.data.winner = JSON.parse(response.data.winner || "[]");
            dispatch(setBattleData(response.data))
            setSocketOpened(true);
        } catch (err) {
            const error = err as AxiosError;
            console.log(error.status)
            if (error.response?.status === 401) {
                dispatch(showUnAuthModal())
            } else if (error.response?.status === 402) {
                dispatch(showNoMoneyModal())
            } else {
                console.error("Неизвестная ошибка", error);
            }
        }
    }

    useEffect(() => {
        if (!isAuth) {
            router.push('/')  // редирект на главную
        }
    }, [isAuth, router])

    useEffect(() => {
        if (isAuth) {
            getServerGameData()
        }
    }, [])

    if (!isAuth) {
        return null // пока редирект не сработал — ничего не рендерим
    }

    if (players_amount <= 0 || players_amount > 4) {
        return null
    }

    return (
        <div className={`${style.bgfCnt} ${players_amount === 3 ? style.threePlayerCnt : players_amount === 4 ? style.fourPlayerCnt : ""}`}>
            {players.map((value, index) => {
                console.log(value)
                return (
                    <BattlePersonalBox
                        key={index}
                        id={value.id}
                        userName={value.username}
                        imgPath={value.imgpath}
                        money_amount={value.money_amount}
                    />
                )
            })}

        </div>
    )
}

export default BattleGameField
