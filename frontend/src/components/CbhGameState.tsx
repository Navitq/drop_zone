import React from 'react'
import style from '@/styles/battles.module.scss'

function CbhGameState({ firstLine, secondLine }: { firstLine: string, secondLine: string }): React.ReactNode {
    return (
        <div className={style.cbhGameState}>
            <div>{firstLine}</div>
            <div>{secondLine}</div>
        </div>
    )
}

export default CbhGameState
