import React from 'react'
import style from '@/styles/cases.module.scss'

import { useTranslations } from 'next-intl'
import Image from 'next/image'

import CaseInfoBlock from '@/components/CaseInfoBlock'

interface caseInt {
    caseNameKey: string,
    imgUrl: string,
}

function BigCase(props: caseInt): React.ReactNode {
    const t = useTranslations("cases")
    return (
        <div className={style.bgCaseCnt}>
            <div className={style.bgCaseImgCnt}>
                <Image src={props.imgUrl} width={350} height={310} alt={t(props.caseNameKey)}></Image>
            </div>
            <CaseInfoBlock price={49} caseNameKey={"example"}></CaseInfoBlock>
        </div>
    )
}

export default BigCase
