import React from 'react'

import style from '@/styles/upgrades.module.scss';

import ClientExchanger from '@/components/ClientExchanger'
import ServerExchanger from '@/components/ServerExchanger'
import ChanceSpinerExchanger from '@/components/ChanceSpinerExchanger'

function ExchangeBlock(): React.ReactNode {
    return (
        <div className={style.exchangerBlock}>
            <ClientExchanger></ClientExchanger>
            <ChanceSpinerExchanger></ChanceSpinerExchanger>
            <ServerExchanger></ServerExchanger>
        </div>
    )
}

export default ExchangeBlock
