
import React from 'react'
import style from '@/styles/battles.module.scss'


function ContractsModalBtn(props: { text: string, click?: () => void }): React.ReactNode {
    return (
        <div className={`${style.mnHeadBtnRulesCnt} ${style.contractsHeadBtnRulesCnt}`} onClick={props.click ? () => { props.click!() } : undefined}>
            <button className={`${style.mnHeadBtnRules} ${style.contractsMnHeadBtnRules}`}>{props.text}</button>
        </div>
    )
}

export default React.memo(ContractsModalBtn)
