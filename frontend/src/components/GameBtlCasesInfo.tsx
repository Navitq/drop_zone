'use client'

import React from 'react'
import style from '@/styles/battles.module.scss'
import { useTranslations } from 'next-intl'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import Image from 'next/image'
import CbBattleCase from '@/components/CbBattleCase'
import { showBattleCreateModal } from '@/redux/modalReducer'
import api from "@/lib/api";
import { BACKEND_PATHS, FRONTEND_PATHS } from '@/utilites/urls';
import { AxiosError } from "axios";
import { showNoMoneyModal, showUnAuthModal } from '@/redux/modalReducer'

import CleanGameSettings from '@/components/CleanGameSettings'
import CaseBtnText from '@/components/CaseBtnText'

function GameBtlCasesInfo(): React.ReactNode {
    const t = useTranslations("battles")

    const { totalCaseAmount, totalPrice, createBtlData } = useAppSelector(
        (state) => state.battlesCreate
    )
    const isAuth = useAppSelector(state => state.user.isAuth)
    const playersAmount = useAppSelector(state => state.battlesCreate.playersAmount)
    const dispatch = useAppDispatch()

    async function createBattle() {
        if (!isAuth) {
            dispatch(showUnAuthModal())
        }
        if (createBtlData.length < 1 && createBtlData.length < 4) {
            return;
        }
        try {
            const payload = createBtlData.map(item => ({
                id: item.casesId,
                caseAmount: item.caseAmount
            }));
            const response = await api.post(BACKEND_PATHS.createBattle, { players_amount: playersAmount, data: payload });
            const battleId = response.data.battle_id;

            if (battleId) {
                window.location.href = `${FRONTEND_PATHS.battlesConnect(battleId)}`;
            }
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
    return (
        <div className={style.gbciCnt}>
            <div className={`${style.gbciAddCaseBlockCnt} ${style.gbciAddCaseBlockCnt_around}`}>
                {
                    createBtlData.map((value) => {
                        return (
                            <div key={value.casesId} className={style.gbciCaseBlockCnt}>
                                <CbBattleCase unitPrice={value.unitPrice} caseAmount={value.caseAmount} caseImgPath={value.caseImgPath} caseName={value.caseName} casesId={value.casesId}></CbBattleCase>
                            </div>)
                    })
                }

                {totalCaseAmount < 3 ?
                    <div onClick={() => { dispatch(showBattleCreateModal()) }} className={style.gbciAddCaseBlock}>
                        <svg preserveAspectRatio="none" className={style.gbciSvgBorder} viewBox="0 0 1036 331" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="1035" height="330" rx="9.5" fill="transparent" />

                            <rect x="0.5" y="0.5" width="1035" height="330" rx="9.5" stroke="url(#paint0_linear_0_3)" strokeWidth="1" />

                            <defs>
                                <linearGradient id="paint0_linear_0_3" x1="518" y1="0" x2="518" y2="331" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FF8F2D" />
                                    <stop offset="1" stopColor="#FF8F2D" stopOpacity="0.3" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className={style.gbciAddBtn}>
                            <div className={style.gbciAddBtnCrossCnt}>
                                <Image fill src={"/images/cr_battle_add_case.svg"} alt={t('add_case')}></Image>
                            </div>
                            <div>{t('add_case')}</div>
                        </div>
                    </div> : <></>
                }
            </div>
            <div className={style.gbcipCaseInfoBlock}>
                <div className={style.gbcipCaseAmountBlock}>
                    <div>{`${totalCaseAmount}/3`}</div>
                    <div>{`${totalPrice} Dc`}</div>
                </div>
                <div className={style.gbcipCaseDefenitionsBlock}>
                    <div>{t('rounds_amount')}</div>
                    <div>{t('battles_price')}</div>
                </div>
            </div>
            <div className={style.gbcipBtnMobileGroup}>
                <CleanGameSettings text={t('clean')}></CleanGameSettings>

                <CaseBtnText text={t('create')} onClick={() => { createBattle() }} />
            </div>
        </ div >
    )
}

export default GameBtlCasesInfo
