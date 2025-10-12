import React from 'react'
import style from '@/styles/profile.module.scss'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import CaseBtnText from '@/components/CaseBtnText'
import { FRONTEND_PATHS } from '@/utilites/urls'
import Link from 'next/link'

interface PrBestCaseInt {
    caseName: string,
    imgPath: string
}

function PrBestCase(props: PrBestCaseInt): React.ReactNode {
    const t = useTranslations("profile");
    console.log(props.imgPath, 44444444444444444)
    return (
        <div className={style.prBestCase}>
            {props.imgPath ? (
                <>
                    <div className={style.prBestCaseTxtCnt}>
                        <div className={style.prBestCaseTxt}>{t('best_case')}</div>
                        <div className={style.prBestCaseName}>{props.caseName}</div>
                    </div>
                    <div className={style.prBestCaseImgCnt}>
                        <Image
                            fill
                            src={props.imgPath}
                            alt={`${t('case')}: ${props.caseName}`}
                        />
                    </div>
                </>
            ) : (
                <div className={style.noWonDataItem}>
                    <div className={style.noWonDataItemCnt}>
                        <div className={style.noWonDataItemType}>{t('best_case')}</div>
                        <div className={style.noWonDataItemAbsent}>{t('no_opened')}</div>
                        <Link href={FRONTEND_PATHS.home}>
                            <CaseBtnText text={t('open_case')}></CaseBtnText>
                        </Link>
                    </div>
                </div>
            )}
        </div>

    )
}

export default React.memo(PrBestCase)
