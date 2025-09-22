'use client'
import React, { useState, useEffect } from 'react'

import ExBlockTitle from '@/components/ExBlockTitle'
import { useTranslations } from 'next-intl'

import SortMenuAct from '@/components/SortMenuAct'

import style from '@/styles/upgrades.module.scss'

interface OptionType {
    value: string,
    label: string,
};

function ExClientPropierty(): React.ReactNode {

    const t = useTranslations("homePage");
    const [options, setOptions] = useState<OptionType[] | null>(null);

    useEffect(() => {
        setOptions([
            { value: 'srt_popularity', label: t('srt_popularity') },
            { value: 'srt_price_up', label: t('srt_price_up') },
            { value: 'srt_price_down', label: t('srt_price_down') },
            { value: 'srt_name', label: t('srt_name') }
        ]);
    }, [t]);
    const tx = useTranslations("upgrades")
    return (
        <div className={style.exClientCnt}>
            <div className={style.exClientBlock}>
                <ExBlockTitle title={tx('your_skins')}></ExBlockTitle>
                {options ? <div className={style.exClSort}><SortMenuAct options={options}></SortMenuAct></div> : null}
            </div>
        </div>
    )
}

export default ExClientPropierty
