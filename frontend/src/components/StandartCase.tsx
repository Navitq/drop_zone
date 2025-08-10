'use client'

import React from 'react'
import style from '@/styles/cases.module.scss'
import Image from 'next/image'

import CaseInfoBlock from '@/components/CaseInfoBlock'
import { useTranslations } from 'next-intl'

interface caseInt {
    caseNameKey: string,
    imgUrl: string,
}

function StandartCase(props: caseInt): React.ReactNode {
    const t = useTranslations("cases")
    return (
        <div className={style.stCaseCnt}>
            <div className={style.stCaseImgCnt}>
                <Image src={props.imgUrl} width={330} height={375} alt={t(props.caseNameKey)}></Image>
            </div>
            <CaseInfoBlock price={49} caseNameKey={"example"}></CaseInfoBlock>
        </div>
    )
}

export default StandartCase
