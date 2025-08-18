import React from 'react'

import style from '@/styles/upgrades.module.scss'

import ExClientPropierty from '@/components/ExClientPropierty'
import ExClientStuffs from '@/components/ExClientStuffs'

function ExchangeClientPropierty(): React.ReactNode {
    return (
        <div className={style.clientBlock}>
            <ExClientPropierty></ExClientPropierty>
            <ExClientStuffs ></ExClientStuffs>
        </div>
    )
}

export default ExchangeClientPropierty
