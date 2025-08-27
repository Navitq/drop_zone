import React from 'react'
import style from '@/styles/battles.module.scss'


function BattleGroupHeadCnt({ children }: {
    children: React.ReactNode
}): React.ReactNode {
    return (
        <div className={style.mnBattlesPage}>
            {children}
        </div>
    )
}

export default BattleGroupHeadCnt
