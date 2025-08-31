import React from 'react'
import { useTranslations } from 'next-intl'

import style from '@/styles/battles.module.scss'

import CbhPriceInfo from '@/components/CbhPriceInfo'
import CbhGameState from '@/components/CbhGameState'
import CbhGameCases from '@/components/CbhGameCases'


function CurrentBattleHead(): React.ReactNode {
    const t = useTranslations("battles")
    return (
        <div className={style.cbhCnt}>
            <CbhPriceInfo></CbhPriceInfo>
            <CbhGameState firstLine={t('expectation')} secondLine={t('participants')}></CbhGameState>
            <CbhGameCases></CbhGameCases>
        </div>
    )
}



export default CurrentBattleHead
