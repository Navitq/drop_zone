'use client'
import React from 'react'
import style from '@/styles/battles.module.scss'

import CbhGameActiveCases from '@/components/CbhGameActiveCases'
import CaseBtnText from '@/components/CaseBtnText'

import { useLocale, useTranslations } from 'next-intl'
import { useAppSelector } from '@/lib/hooks'

function CbhGameCases(): React.ReactNode {
    const t = useTranslations("battles")
    const cases = useAppSelector(state => state.activeBattle.cases)
    const locale = useLocale()

    return (
        <div className={`${style.cbhGameCases} ${style.cbhHeadSideblock}`}>
            <div className={style.cbhGameCasesCnt}>
                {
                    cases.map((value, index) => {
                        return (
                            <CbhGameActiveCases activeId={(index > -1 && index < 3 ? (index + 1) as 0 | 1 | 2 | 3 : 0)} key={index} caseImgPath={value.imgpath} caseName={value.name[locale as 'en' | 'ru']} casesId={value.id}></CbhGameActiveCases>
                        )
                    })
                }

            </div>
            <div>
                <CaseBtnText text={t('leave_battle')} />
            </div>
        </div>
    )
}

export default CbhGameCases
