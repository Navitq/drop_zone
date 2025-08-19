import React from 'react'

import style from '@/styles/contracts.module.scss'
import { useTranslations } from 'next-intl'

function CtStaff(): React.ReactNode {
    const t = useTranslations("contracts")
    return (
        <div className={style.ctStaffCnt}>
            <div className={style.ctStaffTxtCnt}>
                <div className={style.ctStaffTitle}>{t('accessible_objects')}</div>
                <div></div>
            </div>

        </div>
    )
}

export default CtStaff
