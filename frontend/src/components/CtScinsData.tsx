import React from 'react'
import style from '@/styles/contracts.module.scss'
import { useTranslations } from 'next-intl'

import CtSkinPriceBlock from '@/components/CtSkinPriceBlock'

function CtScinsData(props: { scinPrice?: number }): React.ReactNode {
    const t = useTranslations("contracts")

    function roundToPowerOfTen(num: number, powerOfTen: number): number {
        return Math.round(num * 10 ** powerOfTen) / 10 ** powerOfTen;
    }

    return (
        <div className={style.ctScinsData}>
            <div className={style.userInfo}>
                <CtSkinPriceBlock text={t('your_skin_price')} price={`${props.scinPrice ? props.scinPrice.toFixed(2) : '0.00'}`}></CtSkinPriceBlock>

                <CtSkinPriceBlock text={t('our_skins_assessment')} price={`${props.scinPrice ? `${(roundToPowerOfTen(props.scinPrice / 4, 2)).toFixed(2)} - ${(roundToPowerOfTen(props.scinPrice * 4, 2)).toFixed(2)}` : "0.00 - 0.00"}`}></CtSkinPriceBlock>

                <div className={style.objectAmountCnt}>
                    <div className={style.objectAmount}>{t('objects_amount')}</div>
                </div>
            </div>
            <div className={style.ctRulesCnt}>
                <div className={style.ctRulesTitle}>{t('how_its_work')}</div>
                <ul className={style.RulesList}>
                    <li>{t('rule_point_one')}</li>
                    <li>{t('rule_point_two')}</li>
                    <li>{t('rule_point_tree')}</li>
                </ul>
            </div>
        </div>
    )
}

export default CtScinsData
