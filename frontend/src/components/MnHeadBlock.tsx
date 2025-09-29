'use client'
import React, { useState, useEffect } from 'react'

import style from '@/styles/battles.module.scss'

import MnHeadCard from '@/components/MnHeadCard'
import CaseBtnText from '@/components/CaseBtnText'
import MnHeadRules from '@/components/MnHeadRules'
import { FRONTEND_PATHS } from '@/utilites/urls'
import Link from 'next/link'
import { BACKEND_PATHS } from '@/utilites/urls'

import { useTranslations } from 'next-intl'

import api from "@/lib/api";
import { useAppSelector } from '@/lib/hooks'



type BattlesInfo = {
    total_battles: number
    active_battles: number
    user_won: number
    user_lost: number
}


function MnHeadBlock(): React.ReactNode {
    const t = useTranslations("battles")
    const isAuth = useAppSelector(state => state.user.isAuth);

    const [battlesInfo, setBattlesInfo] = useState<BattlesInfo>({
        total_battles: 0,
        active_battles: 0,
        user_won: 0,
        user_lost: 0,
    })

    useEffect(() => {
        getGeneralBattlesData()
    }, [])

    async function getGeneralBattlesData() {
        try {
            const response = await api.get(BACKEND_PATHS.generalBattlesInfo);
            setBattlesInfo(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={style.mnHeadBlock}>
            <div className={style.mnHeadInfo}>
                <div className={style.mnHeadInfoCnt}>
                    <MnHeadCard title={t('all_battles')} amount={battlesInfo.total_battles} altImg={t('swords_alt')} imgPath={'/images/mn_battles_sword.svg'}></MnHeadCard>
                </div>
                <div className={style.mnHeadInfoCnt}>
                    <MnHeadCard title={t('active_battles')} amount={battlesInfo.active_battles} altImg={t('versus_alt')} imgPath={'/images/mn_battles_vs.svg'}></MnHeadCard>
                </div>
                <div className={style.mnHeadInfoCnt}>
                    <MnHeadCard title={t('your_victories')} amount={battlesInfo.user_won} altImg={t('prize_alt')} imgPath={'/images/mn_battles_cup.svg'}></MnHeadCard>
                </div>
                <div className={style.mnHeadInfoCnt}>
                    <MnHeadCard title={t('your_defeats')} amount={battlesInfo.user_lost} altImg={t('cross_in_rect_alt')} imgPath={'/images/mn_battles_defeat.svg'}></MnHeadCard>
                </div>
            </div>
            <div className={style.mnHeadBtnGroup}>
                {isAuth ? (
                    <>
                        <div className={style.mnHeadPcRulesModal}>
                            <MnHeadRules></MnHeadRules>
                        </div>
                        <div className={style.prSaveBtCnt}>
                            <Link href={FRONTEND_PATHS.battlesCreate}>
                                <CaseBtnText text={t('create')} />
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className={style.prSaveBtCnt}>
                        <CaseBtnText text={t('login')} />
                    </div>
                )}

            </div>
        </div >
    )
}

export default MnHeadBlock
