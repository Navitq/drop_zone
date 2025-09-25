
import React from 'react'
import style from '@/styles/battles.module.scss'


function BattleModalBtn(props: { text: string, click?: () => void }): React.ReactNode {
    return (
        <div className={style.mnHeadBtnRulesCnt} onClick={props.click ? () => props.click!() : undefined}>
            <button className={style.mnHeadBtnRules}>{props.text}</button>
        </div>
    )
}

export default React.memo(BattleModalBtn)
