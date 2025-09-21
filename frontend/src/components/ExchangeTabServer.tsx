import React from 'react'

import style from '@/styles/upgrades.module.scss'

interface ExchangeTabInt {
    multiply: number | "...",
}

function ExchangeTabServer(props: ExchangeTabInt): React.ReactNode {
    return (
        <div className={`${style.exchangeTab} ${style.serverExchangeTab}`}>
            <div className={style.exchangeTabCnt}>
                <div className={`${style.exchangeTabServerText}`}>{props.multiply != "..." ? "x" + props.multiply : props.multiply}</div>
            </div>
        </div>
    )
}

export default ExchangeTabServer
