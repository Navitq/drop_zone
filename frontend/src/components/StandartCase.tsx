import React from 'react'
import style from '@/styles/cases.module.scss'
import Image from 'next/image'

import CaseInfoBlock from '@/components/CaseInfoBlock'

function StandartCase(): React.ReactNode {
    return (
        <div className={style.stCaseCnt}>
            <div className={style.stCaseImgCnt}>
                <Image src='/images/case_mock.png' width={330} height={375}></Image>
            </div>
            <CaseInfoBlock></CaseInfoBlock>
        </div>
    )
}

export default StandartCase
