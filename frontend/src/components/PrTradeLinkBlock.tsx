import React from 'react'

import style from '@/styles/profile.module.scss'
import CaseBtnText from '@/components/CaseBtnText'
import { useTranslations } from 'next-intl'

function PrTradeLinkBlock(): React.ReactNode {
    const t = useTranslations('profile')
    return (
        <div className={style.prTradeLinkBlock}>
            <div className={style.prTradeInputCnt}>
                <input className={style.prTradeInput} type="text" placeholder={t('type_trade_link')}/>
            </div>
            <div className={style.prSaveBtCnt}>
                <CaseBtnText text={t('save_trade')}></CaseBtnText>
            </div>
        </div >
    )
}

export default PrTradeLinkBlock
