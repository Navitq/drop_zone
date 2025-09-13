'use client'

import React from 'react'
import style from '@/styles/cases.module.scss'
import Image from 'next/image'
import { AxiosError } from "axios";

import CaseInfoBlock from '@/components/CaseInfoBlock'
import { useAppDispatch } from '@/lib/hooks'

import { showStCaseModal, showRulletCaseModal, showNoMoneyModal, showUnAuthModal } from '@/redux/modalReducer'

import api from "@/lib/api";
import { BACKEND_PATHS } from '@/utilites/urls';

interface caseInt {
    caseName: string,
    imgUrl: string,
    caseId: string,
    price: number
}

function StandartCase(props: caseInt): React.ReactNode {

    const dispatch = useAppDispatch()

    async function openRulletCase() {
        try {
            const response = await api.get(BACKEND_PATHS.playCaseGame(props.caseId));
            console.log(response.data)
            dispatch(showRulletCaseModal({ caseId: props.caseId, caseName: props.caseName, items: response.data.case_items, prize_item:  response.data.prize_item }))
        } catch (err) {
            const error = err as AxiosError;
            console.log(error.status)
            if (error.response?.status === 401) {
                dispatch(showUnAuthModal())
            } else if (error.response?.status === 402) {
                dispatch(showNoMoneyModal())
            } else {
                console.error("Неизвестная ошибка", error);
            }
        }
    }

    async function openCaseData() {
        try {
            const response = await api.get(BACKEND_PATHS.getCaseItems(props.caseId));
            console.log(response.data)
            dispatch(showStCaseModal({ caseId: props.caseId, caseName: props.caseName, items: response.data.items }))
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={style.stCaseCnt}>
            <div className={style.stCaseImgCnt} onClick={() => { openCaseData() }}>
                <Image src={props.imgUrl} width={330} height={375} alt={props.caseName}></Image>
            </div>
            <CaseInfoBlock buyCaseModal={() => { openRulletCase() }} price={props.price} caseNameKey={"example"}></CaseInfoBlock>
        </div>
    )
}

export default StandartCase
