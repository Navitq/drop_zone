'use client'

import React from 'react'
import style from '@/styles/battles.module.scss'

import Image from 'next/image'
import { useTranslations } from 'next-intl';

interface CbBattleCaseInt {
    casesId: string;
    caseName: string;
    caseImgPath: string;
    caseAmount?: number;
    unitPrice: number;
}

function CbBattleCase(props: CbBattleCaseInt): React.ReactNode {
    const t = useTranslations("battles")
    return (
        <div data-case-id={props.casesId} className={style.CbBattleCase}>
            <div className={style.cbCaseImgCnt}>
                <Image className={style.cbCaseImg} fill src={props.caseImgPath} alt={`${t('case')}:${props.caseName}`} ></Image>
            </div>
            <div className={style.cbCaseName}>
                {props.caseName}
            </div>
            <div className={style.cbCasePrice}>
                {`${props.unitPrice} Dc`}
            </div>
            {props.caseAmount && props.caseAmount > 0 ?
                <div className={style.cbCaseAmountCalc}>
                    <div className={style.cbCaseAddition}>-</div>
                    <div className={style.cbCaseAmount}>{props.caseAmount}</div>
                    <div className={style.cbCaseSubtraction}>+</div>
                </div> : <div className={style.mnHeadBtnCaseCnt}>
                    <button className={`${style.mnHeadBtnRules} ${style.mnHeadBtnCase}`}>{t('add')}</button>
                </div>
            }
        </div>
    )
}

export default CbBattleCase
