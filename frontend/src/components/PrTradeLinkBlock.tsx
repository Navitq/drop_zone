'use client'

import React, { useState, useRef } from 'react'

import style from '@/styles/profile.module.scss'
import CaseBtnText from '@/components/CaseBtnText'
import { useTranslations } from 'next-intl'

function PrTradeLinkBlock(): React.ReactNode {
    const t = useTranslations('profile')
    const [link, setLink] = useState<string>('')
    const textRef = useRef(null)

    function sanitizeLink(value: string) {
        return value.replace(/[^A-Za-z0-9/:.?=&_%\-]/g, '')
    }
    function textCahnge(e: React.ChangeEvent<HTMLInputElement>) {
        setLink(sanitizeLink(e.currentTarget.value))
    }
    function saveTradeLink() {
        
    }
    return (
        <div className={style.prTradeLinkBlock}>
            <div className={style.prTradeInputCnt}>
                <input ref={textRef} maxLength={200} className={style.prTradeInput} onChange={(e) => { textCahnge(e) }} value={link} type="text" placeholder={t('type_trade_link')} />
            </div>
            <div className={style.prSaveBtCnt}>
                <CaseBtnText text={t('save_trade')} onClick={() => { saveTradeLink() }}></CaseBtnText>
            </div>
        </div >
    )
}

export default PrTradeLinkBlock
