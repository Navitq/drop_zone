'use client'
import React from 'react'

import style from '@/styles/battles.module.scss'

import MnHeadCard from '@/components/MnHeadCard'
import CaseBtnText from '@/components/CaseBtnText'
import MnHeadRules from '@/components/MnHeadRules'
import { FRONTEND_PATHS } from '@/utilites/urls'
import Link from 'next/link'

import { useTranslations } from 'next-intl'


function MnHeadBlock(): React.ReactNode {
    const t = useTranslations("battles")
    const Auth = true;



    return (
        <div className={style.mnHeadBlock}>
            <div className={style.mnHeadInfo}>
                <div className={style.mnHeadInfoCnt}>
                    <MnHeadCard title={t('all_battles')} amount={1234} altImg={t('swords_alt')} imgPath={'/images/mn_battles_sword.svg'}></MnHeadCard>
                </div>
                <div className={style.mnHeadInfoCnt}>
                    <MnHeadCard title={t('active_battles')} amount={1234} altImg={t('versus_alt')} imgPath={'/images/mn_battles_vs.svg'}></MnHeadCard>
                </div>
                <div className={style.mnHeadInfoCnt}>
                    <MnHeadCard title={t('your_victories')} amount={1234} altImg={t('prize_alt')} imgPath={'/images/mn_battles_cup.svg'}></MnHeadCard>
                </div>
                <div className={style.mnHeadInfoCnt}>
                    <MnHeadCard title={t('your_defeats')} amount={1234} altImg={t('cross_in_rect_alt')} imgPath={'/images/mn_battles_defeat.svg'}></MnHeadCard>
                </div>
            </div>
            <div className={style.mnHeadBtnGroup}>
                {Auth ? (
                    <>
                        <MnHeadRules></MnHeadRules>
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
