import React from 'react'
import style from '@/styles/homePage.module.scss'
import TitleHomePage from '@/components/TitleHomePage'
import SeasonCases from '@/components/SeasonCases'

function SeasonCasesBlock(): React.ReactNode {
    return (
        <div className={`${style.actTitleCnt} ${style.actTitleSeasonCnt}`}>
            <TitleHomePage textKey="season_case_title"></TitleHomePage>
            <SeasonCases></SeasonCases>
        </div>

    )
}

export default SeasonCasesBlock
