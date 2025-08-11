import React from 'react'
import style from '@/styles/homePage.module.scss'

import BigCase from '@/components/BigCase'

function SeasonCases(): React.ReactNode {
    return (
        <div className={style.bgCaseBlock}>
            <BigCase imgUrl='/images/example_bg_case.png' caseNameKey='example'></BigCase>
            <BigCase imgUrl='/images/example_bg_case.png' caseNameKey='example'></BigCase>
            <BigCase imgUrl='/images/example_bg_case.png' caseNameKey='example'></BigCase>
            <BigCase imgUrl='/images/example_bg_case.png' caseNameKey='example'></BigCase>
            <BigCase imgUrl='/images/example_bg_case.png' caseNameKey='example'></BigCase>

        </div>
    )
}

export default SeasonCases
