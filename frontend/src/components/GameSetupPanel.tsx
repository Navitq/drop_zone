'use client'
import React from 'react'

import style from '@/styles/battles.module.scss'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import GspPlayerBtn from '@/components/GspPlayerBtn'
import CaseBtnText from '@/components/CaseBtnText'
import CleanGameSettings from '@/components/CleanGameSettings'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import api from "@/lib/api";
import { BACKEND_PATHS, FRONTEND_PATHS } from '@/utilites/urls';
import { AxiosError } from "axios";
import { showNoMoneyModal, showUnAuthModal } from '@/redux/modalReducer'

function GameSetupPanel(): React.ReactNode {
    const t = useTranslations("battles")
    const createBtlData = useAppSelector((state) => state.battlesCreate.createBtlData)
    const isAuth = useAppSelector(state => state.user.isAuth)
    const playersAmount = useAppSelector(state => state.battlesCreate.playersAmount)
    const dispatch = useAppDispatch()
    const { totalCaseAmount, totalPrice } = useAppSelector(
        (state) => state.battlesCreate
    )
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
        <div className={style.gameSetupPanel}>
            <div className={style.gspPlayerInfoBlock}>
                <div className={style.gspPlayerImgCnt}>
                    <Image fill src={"/images/cr_battle_people.svg"} alt={t('gsp_people')}></Image>
                </div>
                <div className={style.gspPlayerAmountCnt}>
                    <div className={style.gspPlayerImgBlockMobile}>
                        <div className={style.gspPlayerImgCntMobile}>
                            <Image fill src={"/images/cr_battle_people.svg"} alt={t('gsp_people')}></Image>
                        </div>
                        <div className={style.gspPlayerAmountTxt}>{t('player_amoun')}</div>
                    </div>
                    <div className={style.gspPlayerCnt}>
                        <GspPlayerBtn text={2}></GspPlayerBtn>
                        <GspPlayerBtn text={3}></GspPlayerBtn>
                        <GspPlayerBtn text={4}></GspPlayerBtn>
                    </div>
                </div>
            </div>
            <div className={style.gspPlayerBtnGroup}>
                <CleanGameSettings text={t('clean')}></CleanGameSettings>

                <CaseBtnText text={t('create')} onClick={() => { createBattle() }} />
            </div>
            <div className={style.gspPlayerPriceBlockMobile}>
                <div className={style.gbcipCaseDefenitionsBlock}>
                    <div>{t('rounds_amount')}</div>
                    <div>{t('battles_price')}</div>
                </div>
                <div className={style.gbcipCaseAmountBlock}>
                    <div>{`${totalCaseAmount}/3`}</div>
                    <div>{`${totalPrice} Dc`}</div>
                </div>
            </div>
        </div>
    )
}

export default GameSetupPanel
