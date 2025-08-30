'use client'
import React from 'react'
import style from '@/styles/battles.module.scss'
import { useAppDispatch } from '@/lib/hooks'

import { cleanCreateField } from '@/redux/battlesCreateReducer'

function CleanGameSettings(props: { text: string }): React.ReactNode {
    const dispatch = useAppDispatch()
    return (
        <div className={style.mnHeadBtnRulesCnt} onClick={() => { dispatch(cleanCreateField()) }}>
            <button className={style.mnHeadBtnRules}>{props.text}</button>
        </div>
    )
}

export default CleanGameSettings
