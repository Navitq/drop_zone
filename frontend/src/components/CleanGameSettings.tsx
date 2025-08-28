import React from 'react'
import style from '@/styles/battles.module.scss'

function CleanGameSettings(props: { text: string }): React.ReactNode {
    return (
        <div className={style.mnHeadBtnRulesCnt}>
            <button className={style.mnHeadBtnRules}>{props.text}</button>
        </div>
    )
}

export default CleanGameSettings
