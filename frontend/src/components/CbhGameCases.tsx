import React from 'react'
import style from '@/styles/battles.module.scss'

import CbhGameActiveCases from '@/components/CbhGameActiveCases'
import CaseBtnText from '@/components/CaseBtnText'

import { useTranslations } from 'next-intl'

function CbhGameCases(): React.ReactNode {
    const t = useTranslations("battles")
    return (
        <div className={`${style.cbhGameCases} ${style.cbhHeadSideblock}`}>
            <div className={style.cbhGameCasesCnt}>
                <CbhGameActiveCases unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={44211424 + ""}></CbhGameActiveCases>
                <CbhGameActiveCases unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={442141424 + ""}></CbhGameActiveCases>
                <CbhGameActiveCases unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={442114224 + ""}></CbhGameActiveCases>
            </div>
            <div>
                <CaseBtnText text={t('leave_battle')} />
            </div>
        </div>
    )
}

export default CbhGameCases
