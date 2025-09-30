import React from 'react'
import { useTranslations } from 'next-intl'

import style from '@/styles/battles.module.scss'

import CbhPriceInfo from '@/components/CbhPriceInfo'
import CbhGameState from '@/components/CbhGameState'
import CbhGameCases from '@/components/CbhGameCases'


function CurrentBattleHead(): React.ReactNode {

    return (
        <div className={style.cbhCnt}>
            <CbhPriceInfo></CbhPriceInfo>
            <CbhGameState></CbhGameState>
            <CbhGameCases></CbhGameCases>
        </div>
    )
}



export default CurrentBattleHead
