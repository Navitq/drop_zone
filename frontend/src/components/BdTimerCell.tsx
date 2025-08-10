import React from 'react'
import style from '@/styles/homePage.module.scss'

function BdTimerCell(props: { data: number, type: string }) {
    return (
        <div className={style.bdTimerCell}>
            <div className={style.bdTimerData}>{props.data < 10 ? '0' + props.data : props.data}</div>
            <div className={style.bdTimerType}>{props.type}</div>
        </div>
    )
}

// Оборачиваем в React.memo при экспорте
export default React.memo(BdTimerCell)
