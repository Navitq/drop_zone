import React from 'react'
import style from '@/styles/profile.module.scss'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface PrBestCaseInt {
    caseName: string,
    imgPath: string
}

function PrBestCase(props: PrBestCaseInt): React.ReactNode {
    const t = useTranslations("profile");
    return (
        <div className={style.prBestCase}>
            <div className={style.prBestCaseTxtCnt}>
                <div className={style.prBestCaseTxt}>{t('best_case')}</div>
                <div className={style.prBestCaseName}>{props.caseName}</div>
            </div>
            <div className={style.prBestCaseImgCnt}>
                <Image fill src={props.imgPath} alt={`${t('case')}: ${props.caseName}`}></Image>
            </div>
        </div>
    )
}

export default PrBestCase
