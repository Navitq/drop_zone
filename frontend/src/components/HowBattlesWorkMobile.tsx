import React from 'react'
import style from '@/styles/contracts.module.scss'
import style_battles from '@/styles/battles.module.scss'
import { useTranslations } from 'next-intl'

function HowBattlesWorkMobile(): React.ReactNode {
    const t = useTranslations("battles")
    return (
        <div className={style_battles.hbwm}>
            <div className={style.ctRulesCnt}>
                <div className={style.ctRulesTitle}>{t('how_its_work')}</div>
                <ul className={style.RulesList}>
                    <li>{t('rule_point_one')}</li>
                    <li>{t('rule_point_two')}</li>
                    <li>{t('rule_point_tree')}</li>
                    <li>{t('rule_point_four')}</li>
                </ul>
            </div>
        </div>
    )
}

export default HowBattlesWorkMobile
