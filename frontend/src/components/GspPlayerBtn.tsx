'use client'

import React from 'react'

import style from '@/styles/battles.module.scss'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setPlayersAmount } from '@/redux/battlesCreateReducer'

type playersAmountRange = 2 | 3 | 4;

function GspPlayerBtn(props: { text: playersAmountRange }): React.ReactNode {
    const dispatch = useAppDispatch();
    const playersAmount = useAppSelector(state => state.battlesCreate.playersAmount)
    return (
        <div onClick={() => { dispatch(setPlayersAmount(props.text)) }} className={`${style.gspPlayerBtn} ${playersAmount === props.text ? style.setActiveBtn: ""}`}>
            {props.text}
        </div>
    )
}

export default GspPlayerBtn
