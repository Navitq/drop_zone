import React from 'react'
import style from '@/styles/battles.module.scss'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface CaseInfo {
    casesId: string;
    caseName: string;
    caseImgPath: string;
    caseAmount: number;
    unitPrice: number;
}


function CbhGameActiveCases(props: CaseInfo): React.ReactNode {
    const t = useTranslations("battles")
    return (
        <div className={`${style.cbhGameActiveCases} ${style.cbhCurrentRound}`}>
            <Image fill src={props.caseImgPath} alt={`${t("case")}: ${props.caseName}`}></Image>
        </div>
    )
}

export default CbhGameActiveCases
