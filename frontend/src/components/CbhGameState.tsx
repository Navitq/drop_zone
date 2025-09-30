'use client'

import React from 'react'
import style from '@/styles/battles.module.scss'
import { useAppSelector } from '@/lib/hooks'
import { useTranslations } from 'next-intl'

function CbhGameState(): React.ReactNode {
    const t = useTranslations("battles")
    const players_amount = useAppSelector(state => state.activeBattle.players_amount)
    const real_players = useAppSelector(state =>
        state.activeBattle.players.filter(player => player.id !== "").length
    );
    const isGameFinished = useAppSelector(state => state.activeBattle.isGameFinished)
    if (!isGameFinished && players_amount === real_players && players_amount != 0) {
        return null
    }
    return (
        <div className={style.cbhGameState}>
            <div>{isGameFinished ? t('battle') : t('expectation')}</div>
            <div>{isGameFinished ? t('finished') : t('participants')}</div>
        </div>
    )
}

export default CbhGameState
