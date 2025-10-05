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
                    cases.flatMap((value, index) => {
                        // index тут — индекс исходного кейса, но нам нужен общий индекс с учётом case_amount
                        return Array.from({ length: value.case_amount }, (_, i) => {
                            const globalIndex = index + i; // или можно считать отдельно, если нужно общее смещение
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
                            );
                        });
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
