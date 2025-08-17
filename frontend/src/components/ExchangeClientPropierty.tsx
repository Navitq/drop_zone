import React from 'react'

import style from '@/styles/upgrades.module.scss'

import ExClientPropierty from '@/components/ExClientPropierty'

function ExchangeClientPropierty(): React.ReactNode {
    return (
        <div className={style.clientBlock}>
            <ExClientPropierty></ExClientPropierty>
        </div>
    )
}

export default ExchangeClientPropierty
