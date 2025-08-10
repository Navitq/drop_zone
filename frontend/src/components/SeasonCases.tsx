import React from 'react'
import style from '@/styles/homePage.module.scss'

function SeasonCases(): React.ReactNode {
    return (
        <div className={style.bgCaseBlock}>
            <BigCase></BigCase>
        </div>
    )
}

export default SeasonCases
