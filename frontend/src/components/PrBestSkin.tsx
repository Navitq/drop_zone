import React from 'react'
import style from '@/styles/profile.module.scss'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import CaseBtnText from '@/components/CaseBtnText'
import { FRONTEND_PATHS } from '@/utilites/urls'
import Link from 'next/link'

interface PrBestSkinInt {
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
    imgPath: string,
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
}

function PrBestSkin(props: PrBestSkinInt): React.ReactNode {
    const t = useTranslations("profile");

    return (
        <div className={`${style.prBestCase} ${props.imgPath ? style[`${props.type}PrBestySkin`] : ""}`}>
            {props.imgPath ? (
                <>
                    <div className={`${style.prBestCaseTxtCnt} ${style.prBestSkinTxtCnt}`}>
                        <div className={style.prBestCaseTxt}>{t('best_skin')}</div>
                        <div className={style.makeInLiner}>
                            <span className={style.prBestSkinModel}>
                                {props.gunModel}&nbsp;&nbsp;|
                            </span>
                            <span className={style.prBestSkinStyle}>
                                &nbsp;{props.gunStyle}
                            </span>
                        </div>
                    </div>

                    <div className={style.prBestSkinImgCnt}>
                        <Image
                            className={style.prBestSkinImg}
                            fill
                            src={props.imgPath}
                            alt={`${props.gunModel}, ${props.gunStyle}`}
                        />
                    </div>

                    <div className={style.prBestSkinPrice}>{props.gunPrice} Dc</div>
                </>
            ) : (
                <div className={style.noWonDataItem}>
                    <div className={style.noWonDataItemCnt}>
                        <div className={style.noWonDataItemType}>{t('best_skin')}</div>
                        <div className={style.noWonDataItemAbsent}>{t('no_items')}</div>
                        <Link href={FRONTEND_PATHS.home}>
                            <CaseBtnText text={t('open_case')}></CaseBtnText>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PrBestSkin
