import React from 'react'
import { useTranslations } from 'next-intl'

import style from '@/styles/battles.module.scss'

import CbhPriceInfo from '@/components/CbhPriceInfo'
import CbhGameState from '@/components/CbhGameState'
import CbhGameCases from '@/components/CbhGameCases'
import CbhMobileGameState from '@/components/CbhMobileGameState'


function CurrentBattleHead(): React.ReactNode {

    return (
        <div className={style.cbhCnt}>
            <CbhPriceInfo></CbhPriceInfo>
            <div className={style.cbtPcState}>
                <CbhGameState></CbhGameState>
            </div>
            <div className={style.cbtmMobileState}>
                <CbhMobileGameState></CbhMobileGameState>
            </div>

            <CbhGameCases></CbhGameCases>
        </div>
    )
}



export default CurrentBattleHead
