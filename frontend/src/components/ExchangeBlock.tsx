import React from 'react'

import style from '@/styles/upgrades.module.scss';

import ClientExchanger from '@/components/ClientExchanger'
import ServerExchanger from '@/components/ServerExchanger'

function ExchangeBlock(): React.ReactNode {
    return (
        <div className={style.exchangerBlock}>
            <ClientExchanger></ClientExchanger>
            <ServerExchanger></ServerExchanger>
        </div>
    )
}

export default ExchangeBlock
