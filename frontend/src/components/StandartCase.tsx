'use client'

import React from 'react'
import style from '@/styles/cases.module.scss'
import Image from 'next/image'

import CaseInfoBlock from '@/components/CaseInfoBlock'
import { useTranslations } from 'next-intl'
import { useAppDispatch } from '@/lib/hooks'

import { showStCaseModal } from '@/redux/modalReducer'

interface caseInt {
    caseName: string,
    imgUrl: string,
    caseId: string,
}

function StandartCase(props: caseInt): React.ReactNode {
    const t = useTranslations("cases")
    const dispatch = useAppDispatch()

    function openCaseData(data: { caseId: string, caseName: string }) {
        dispatch(showStCaseModal(data))
    }

    return (
        <div className={style.stCaseCnt}>
            <div className={style.stCaseImgCnt} onClick={() => { openCaseData({ caseId: props.caseId, caseName: props.caseName }) }}>
                <Image src={props.imgUrl} width={330} height={375} alt={t(props.caseName)}></Image>
            </div>
            <CaseInfoBlock price={49} caseNameKey={"example"}></CaseInfoBlock>
        </div>
    )
}

export default StandartCase
