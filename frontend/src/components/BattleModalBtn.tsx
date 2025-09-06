
import React from 'react'
import style from '@/styles/battles.module.scss'


function BattleModalBtn(props: { text: string }): React.ReactNode {
    return (
        <div className={style.mnHeadBtnRulesCnt} >
            <button className={style.mnHeadBtnRules}>{props.text}</button>
        </div>
    )
}

export default BattleModalBtn
