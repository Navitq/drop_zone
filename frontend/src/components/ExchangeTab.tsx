import React from 'react'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import style from '@/styles/upgrades.module.scss'

interface ExchangeTabInt {
    imageUrl: string,
    altKey: string,
    width: number,
    height: number,
    textKey: string,
    radiusClass?: string
}

function ExchangeTab(props: ExchangeTabInt): React.ReactNode {
    const t = useTranslations('upgrades')
    return (
        <div className={`${style.exchangeTab} ${props.radiusClass ? style[props.radiusClass] : ""}`}>
            <div className={style.exchangeTabCnt}>
                <div className={style.exchangeTabText}>{t(props.textKey)}</div>

                <div className={style.exchangeTabImgCnt}>
                    <Image className={style.exchangeTabImg} width={props.width} height={props.height} src={props.imageUrl} alt={t(props.altKey)}></Image>
                </div>
            </div>
        </div>
    )
}

export default ExchangeTab
