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

function ExClientPropierty(props: { changeFunc: (value: string) => void, }): React.ReactNode {

    const t = useTranslations("homePage");
    const [options, setOptions] = useState<OptionType[] | null>(null);

    useEffect(() => {
        setOptions([
            { value: '1', label: t('srt_created_data') },
            { value: '2', label: t('srt_name') },
            { value: '3', label: t('srt_price_up') },
            { value: '4', label: t('srt_price_down') },
        ]);
    }, [t]);

    const tx = useTranslations("upgrades")
    return (
        <div className={style.exClientCnt}>
            <div className={style.exClientBlock}>
                <ExBlockTitle title={tx('your_skins')}></ExBlockTitle>
                {options ? <div className={style.exClSort}><SortMenuAct callBack={(value: string) => { props.changeFunc(value) }} options={options}></SortMenuAct></div> : null}
            </div>
        </div>
    )
}

export default ExClientPropierty
