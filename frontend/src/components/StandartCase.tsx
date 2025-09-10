'use client'

import React from 'react'
import style from '@/styles/cases.module.scss'
import Image from 'next/image'

import CaseInfoBlock from '@/components/CaseInfoBlock'
import { useAppDispatch } from '@/lib/hooks'

import { showStCaseModal, showRulletCaseModal } from '@/redux/modalReducer'

interface caseInt {
    caseName: string,
    imgUrl: string,
    caseId: string,
}

function StandartCase(props: caseInt): React.ReactNode {

    const dispatch = useAppDispatch()

    function openRulletCase() {
        dispatch(showRulletCaseModal(props.caseId))
    }

    function openCaseData(data: { caseId: string, caseName: string }) {
        dispatch(showStCaseModal(data))
    }

    return (
        <div className={style.stCaseCnt}>
            <div className={style.stCaseImgCnt} onClick={() => { openCaseData({ caseId: props.caseId, caseName: props.caseName }) }}>
                <Image src={props.imgUrl} width={330} height={375} alt={props.caseName}></Image>
            </div>
            <CaseInfoBlock buyCaseModal={() => { openRulletCase() }} price={49} caseNameKey={"example"}></CaseInfoBlock>
        </div>
    )
}

export default StandartCase
