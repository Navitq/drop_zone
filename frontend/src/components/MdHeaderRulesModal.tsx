'use client'
import React from 'react'

import style from '@/styles/modal.module.scss'
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import CaseBtnText from '@/components/CaseBtnText'
import { FRONTEND_PATHS } from '@/utilites/urls'
import Link from 'next/link'

interface MdHeaderRulesModalInt {
    onClose: () => void;
}


function MdHeaderRulesModal(props: MdHeaderRulesModalInt): React.ReactNode {
    const t = useTranslations("battles")

    return (
        <div onClick={(e) => e.stopPropagation()} className={style.rmCnt}>
            <div className={style.rmHeaderBlck}>
                <div className={style.rmHeaderTitle}>{t('how_battles_work')}</div>
                <div className={style.rmHeaderDivider}>
                    <Image fill src={"/images/rm_divider.svg"} alt={`${t('rm_divider_alt')}`}></Image>
                </div>
            </div>

            <ol className={style.rmRulesList}>
                <li>{t('rm_rule_1')}</li>
                <li>{t('rm_rule_2')}</li>
                <li>{t('rm_rule_3')}</li>
                <li>{t('rm_rule_4')}</li>
            </ol>
            <div className={style.rmSaveBtCnt}>
                <Link onClick={() => { props.onClose() }} href={FRONTEND_PATHS.battlesCreate}>
                    <CaseBtnText text={t('create')} />
                </Link>
            </div>

        </div>
    )
}

export default MdHeaderRulesModal
