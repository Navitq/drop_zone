'use client'
import React from 'react'
import style from '@/styles/battles.module.scss'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useAppSelector } from '@/lib/hooks'

interface CaseInfo {
    casesId: string;
    caseName: string;
    caseImgPath: string;
    activeId: 0 | 1 | 2 | 3
}


function CbhGameActiveCases(props: CaseInfo): React.ReactNode {
    const t = useTranslations("battles")
    const active_round = useAppSelector(state => state.activeBattle.active_round)
    return (
        <div className={`${style.cbhGameActiveCases} ${active_round === props.activeId ? style.cbhCurrentRound : ""}`}>
            <Image fill src={props.caseImgPath} alt={`${t("case")}: ${props.caseName}`}></Image>
        </div>
    )
}

export default CbhGameActiveCases
