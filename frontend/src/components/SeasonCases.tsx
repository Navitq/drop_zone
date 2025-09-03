import React from 'react'
import style from '@/styles/homePage.module.scss'

import BigCase from '@/components/BigCase'

function SeasonCases(): React.ReactNode {
    return (
        <div className={style.bgCaseBlock}>
            <BigCase caseId={"23"} imgUrl='/images/example_bg_case.png' caseName='example'></BigCase>
            <BigCase caseId={"23"} imgUrl='/images/example_bg_case.png' caseName='example'></BigCase>
            <BigCase caseId={"23"} imgUrl='/images/example_bg_case.png' caseName='example'></BigCase>
            <BigCase caseId={"23"} imgUrl='/images/example_bg_case.png' caseName='example'></BigCase>
            <BigCase caseId={"23"} imgUrl='/images/example_bg_case.png' caseName='example'></BigCase>

        </div>
    )
}

export default SeasonCases
