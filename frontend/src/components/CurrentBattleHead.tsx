'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import style from '@/styles/battles.module.scss'

import CbhPriceInfo from '@/components/CbhPriceInfo'
import CbhGameCases from '@/components/CbhGameCases'

const CbhGameState = dynamic(() => import('@/components/CbhGameState'), { ssr: false })
const CbhMobileGameState = dynamic(() => import('@/components/CbhMobileGameState'), { ssr: false })


function CurrentBattleHead(): React.ReactNode {

    return (
        <div className={`${style.cbhCnt} ${style.cbhCntMobile}`}>
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
