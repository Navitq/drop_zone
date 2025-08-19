import React from 'react'

import style from '@/styles/contracts.module.scss'
import { useTranslations } from 'next-intl'

import CtStaffSort from '@/components/CtStaffSort'
import ExClientStuffs from '@/components/ExClientStuffs'

function CtStaff(): React.ReactNode {
    const t = useTranslations("contracts")
    return (
        <div className={style.ctStaffCnt}>
            <div className={style.ctStaffTxtCnt}>
                <div className={style.ctStaffTitle}>{t('accessible_objects')}</div>
                <div className={style.ctStaffSortCnt}>
                    <CtStaffSort></CtStaffSort>
                </div>
            </div>
            <ExClientStuffs ></ExClientStuffs>
        </div>
    )
}

export default CtStaff
