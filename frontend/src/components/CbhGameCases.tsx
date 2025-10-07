'use client'
import React from 'react'
import style from '@/styles/battles.module.scss'

import CbhGameActiveCases from '@/components/CbhGameActiveCases'
import CaseBtnText from '@/components/CaseBtnText'

import { useLocale, useTranslations } from 'next-intl'
import { useAppSelector } from '@/lib/hooks'
import { useRouter } from 'next/navigation' // ✅ импортируем useRouter
import { FRONTEND_PATHS } from '@/utilites/urls'
function CbhGameCases(): React.ReactNode {
    const t = useTranslations("battles")
    const cases = useAppSelector(state => state.activeBattle.cases)
    const isGameFinished = useAppSelector(state => state.activeBattle.isGameFinished)
    const locale = useLocale()
    const router = useRouter()


    return (
        <>
            <div className={`${style.cbhGameCases} ${style.cbhHeadSideblock} ${style.cbhMobileNone}`}>
                {!isGameFinished ? (
                    <div className={style.cbhGameCasesCnt}>
                        {cases.flatMap((value, index) => {
                            return Array.from({ length: value.case_amount }, (_, i) => {
                                const globalIndex = index + i // если нужно общее смещение, можно адаптировать формулу

                                return (
                                    <CbhGameActiveCases
                                        key={`${value.id}-${i}`}
                                        activeId={
                                            globalIndex > -1 && globalIndex < 3
                                                ? ((globalIndex + 1) as 0 | 1 | 2 | 3)
                                                : 0
                                        }
                                        caseImgPath={value.imgpath}
                                        caseName={value.name[locale as 'en' | 'ru']}
                                        casesId={value.id}
                                    />
                                )
                            })
                        })}
                    </div>
                ) : null}

                <div className={style.cgsLeaveBtnPosition}>
                    <CaseBtnText onClick={() => { router.push(FRONTEND_PATHS.battles) }} text={t('leave_battle')} />
                </div>
            </div>
        </>
    )
}

export default CbhGameCases
