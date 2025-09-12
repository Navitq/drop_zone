'use client'
import React from 'react'
import style from '@/styles/cases.module.scss'

import { useTranslations } from 'next-intl'
import Image from 'next/image'

import CaseInfoBlock from '@/components/CaseInfoBlock'
import { useAppDispatch } from '@/lib/hooks'
import { showStCaseModal, showRulletCaseModal } from '@/redux/modalReducer'
import api from "@/lib/api";
import { BACKEND_PATHS } from '@/utilites/urls';

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

    async function getItemsData() {
        try {
            const response = await api.get(BACKEND_PATHS.getCaseItems(props.caseId));
            console.log(response.data)
            dispatch(showStCaseModal({ caseId: props.caseId, caseName: props.caseName, items: response.data.items }))
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={style.bgCaseCnt}>
            <div className={style.bgCaseImgCnt} onClick={() => { getItemsData() }}>
                <Image src={props.imgUrl} width={350} height={310} alt={props.caseName}></Image>
            </div>
            <CaseInfoBlock buyCaseModal={() => { openRulletCase() }} price={49} caseNameKey={"example"}></CaseInfoBlock>
        </div>
    )
}

export default BigCase
