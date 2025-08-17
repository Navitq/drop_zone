import React from 'react'

import ExchangeClientPropierty from '@/components/ExchangeClientPropierty'
import ExchangeServerPropierty from '@/components/ExchangeServerPropierty'

import style from '@/styles/upgrades.module.scss'

function ExchangePropierty(): React.ReactNode {
    return (
        <div className={style.propiety}>
            <ExchangeClientPropierty></ExchangeClientPropierty>
            <ExchangeServerPropierty></ExchangeServerPropierty>
        </div>
    )
}

export default ExchangePropierty
