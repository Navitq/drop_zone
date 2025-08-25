import React from 'react'
import style from '@/styles/profile.module.scss'
import { useTranslations } from 'next-intl'

interface PrBestCaseInt {
    caseName: string,

}

function PrBestCase(props: PrBestCaseInt): React.ReactNode {
    const t = useTranslations("profile");
    return (
        <div className={style.prBestCase}>
            <div className={style.prBestCaseTxtCnt}>
                <div className={style.prBestCaseTxt}>{t('best_case')}</div>
                <div className={style.prBestCaseName}>{props.caseName}</div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default PrBestCase
