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
import { setPlayers, setStartGameData, setActiveCaseData, cleanBattleData } from '@/redux/activeBattleReducer'
import api from "@/lib/api";
import { BACKEND_PATHS } from '@/utilites/urls';

interface PlayersInfo {
    id: string;           // UUID
    imgpath: string;      // Ссылка на изображение
    username: string;
}



function BattleGameField(): React.ReactNode {
    const isAuth = useAppSelector(state => state.user.isAuth)
    const { players_amount, players } = useAppSelector(state => state.activeBattle)
    const router = useRouter();
    const [socketOpened, setSocketOpened] = useState<boolean>(false);

    const params = useParams();
    const searchParams = useSearchParams();
    const lastProcessedRoundRef = useRef<number | null>(null);
    const gameId = Array.isArray(params.battleid) ? params.battleid[0] : params.battleid; // динамический сегмент
    const guest = searchParams.get('guest') === 'true'; //
    const { active_round, players_items } = useAppSelector(state => state.activeBattle)

    const dispatch = useAppDispatch();

    useEffect(() => {
        // функция, которую вызываем при уходе со страницы
        const handleLeave = () => {
            dispatch(cleanBattleData()); // пример очистки состояния
        };

        // срабатывает при размонтировании компонента
        return () => {
            handleLeave();
        };
    }, [dispatch]);


    useEffect(() => {
        if (active_round <= 0) return;
        if (!players_items?.length) return;
        if (!players_items[0]?.items?.length) return;

        if (lastProcessedRoundRef.current === active_round) return; // уже обработали

        const roundIndex = active_round - 1;
        const item = players_items[0].items[roundIndex];
        if (!item) return;

        lastProcessedRoundRef.current = active_round; // помечаем как обработанный
        getCaseData(item.case_id);
    }, [active_round, players_items]);

    async function getCaseData(case_id: string) {
        try {
            const response = await api.get(BACKEND_PATHS.getCaseItems(case_id));
            dispatch(setActiveCaseData(response.data.items))
        } catch (err) {
            console.log(err)
        }
    }

    type BattleEventMap = {
        players_update: { players: PlayersInfo[] };
        game_finished: { data: any }; // можешь типизировать точнее, если знаешь структуру
    };

    function setPlayersLocal(players: PlayersInfo[]) {
        dispatch(setPlayers(players))
    }

    function startGameData(data: any) {
        data.game_data = JSON.parse(data.game_data, (key, value) => {
            if (key === "price" && typeof value === "string") {
                return parseFloat(value);
            }
            return value;
        });
        console.log(data.game_data)
        dispatch(setStartGameData(data.game_data))
    }


    const eventHandlers: Record<keyof BattleEventMap, (payload: any) => void> = {
        players_update: (payload) => setPlayersLocal(payload.players),
        game_finished: (payload) => startGameData(payload),
    };


    const { sendMessage, lastJsonMessage, readyState } = useWebSocket(
        // URL создаём только если socketOpened === true
        socketOpened && gameId ? `${BACKEND_PATHS.battleGameWSS(gameId, !guest)}` : null,
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
            onOpen: () => console.log("WS connected"),
            onClose: () => console.log("WS closed"),
            onError: (event: WebSocketEventMap['error']) => console.log(event),
            onMessage: (event) => {
                const data = JSON.parse(event.data) as { event: keyof BattleEventMap; payload: any };
                const handler = eventHandlers[data.event];
                if (handler) {
                    handler(data);
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
        <div className={`${style.bgfCnt} ${players_amount === 3 ? style.threePlayerCnt : players_amount === 4 ? style.fourPlayerCnt : ""} ${players_amount === 3 ? 'threePlayerCnt' : players_amount === 4 ? 'fourPlayerCnt' : ""}`}>
            {players.map((value, index) => {
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
