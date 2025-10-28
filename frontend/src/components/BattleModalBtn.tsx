
import React from 'react'
import style from '@/styles/battles.module.scss'


function BattleModalBtn(props: { text: string, clickBttn: () => void }): React.ReactNode {
    return (
        <div className={style.mnHeadBtnRulesCnt} onClick={() => props.clickBttn()}>
            <div className={style.mnHeadBtnRules}>{props.text}</div>
        </div>
    )
}

export default React.memo(BattleModalBtn)
