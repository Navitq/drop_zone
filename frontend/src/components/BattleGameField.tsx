'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import style from '@/styles/battles.module.scss'
import BattlePersonalBox from "@/components/BattlePersonalBox"
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { showNoMoneyModal, showUnAuthModal } from '@/redux/modalReducer'
import { setBattleData } from '@/redux/activeBattleReducer'
import { AxiosError } from "axios";
import { useParams } from 'next/navigation'

import api from "@/lib/api";
import { BACKEND_PATHS } from '@/utilites/urls';

function BattleGameField(): React.ReactNode {
    const isAuth = useAppSelector(state => state.user.isAuth)
    const { players_amount, players } = useAppSelector(state => state.activeBattle)
    const router = useRouter();
    const { battleid: gameId } = useParams<{ battleid: string }>()
    const dispatch = useAppDispatch();

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
            console.log(response.data)
            dispatch(setBattleData(response.data))
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
