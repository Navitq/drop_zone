import React from 'react'

import style from '@/styles/battles.module.scss'

import { useAppDispatch } from '@/lib/hooks'
import { showRulesModal } from '@/redux/modalReducer'
import { useTranslations } from 'next-intl'

function MnHeadRules(): React.ReactNode {
    const t = useTranslations("battles")

    const dispatch = useAppDispatch()

    function showModal(): void {
        dispatch(showRulesModal())
    }
    return (
        <div className={style.mnHeadBtnRulesCnt}>
            <button onClick={showModal()} className={style.mnHeadBtnRules}>{t('rules')}</button>
        </div>
    )
}

export default MnHeadRules
