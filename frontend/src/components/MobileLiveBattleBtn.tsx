import React from 'react'
import { useTranslations } from 'next-intl'
import CaseBtnText from '@/components/CaseBtnText'

import { useRouter } from 'next/navigation' // ✅ импортируем useRouter
import { FRONTEND_PATHS } from '@/utilites/urls'
import style from '@/styles/battles.module.scss'

function MobileLiveBattleBtn() {
    const t = useTranslations("battles")
    const router = useRouter()
    return (
        <div className={style.mlbbLeaveBtnPosition}>
            <CaseBtnText onClick={() => { router.push(FRONTEND_PATHS.battles) }} text={t('leave_battle')} />
        </div>
    )
}

export default MobileLiveBattleBtn
