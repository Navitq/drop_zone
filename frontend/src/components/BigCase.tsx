'use client'
import React from 'react'
import style from '@/styles/cases.module.scss'

import { useTranslations } from 'next-intl'
import Image from 'next/image'

import CaseInfoBlock from '@/components/CaseInfoBlock'
import { useAppDispatch } from '@/lib/hooks'
import { showStCaseModal, showRulletCaseModal } from '@/redux/modalReducer'

interface caseInt {
    caseName: string,
    imgUrl: string,
    caseId: string,
}

function BigCase(props: caseInt): React.ReactNode {
    const t = useTranslations("cases")
    const dispatch = useAppDispatch()

    function openRulletCase() {
        dispatch(showRulletCaseModal(props.caseId))
    }

    return (
        <div className={style.bgCaseCnt}>
            <div className={style.bgCaseImgCnt} onClick={() => { dispatch(showStCaseModal({ caseId: props.caseId, caseName: props.caseName })) }}>
                <Image src={props.imgUrl} width={350} height={310} alt={props.caseName}></Image>
            </div>
            <CaseInfoBlock buyCaseModal={() => { openRulletCase() }} price={49} caseNameKey={"example"}></CaseInfoBlock>
        </div>
    )
}

export default BigCase
