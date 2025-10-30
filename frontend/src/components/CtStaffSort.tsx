'use client'
import React, { useState, useEffect } from 'react'

import { useTranslations } from 'next-intl'

import SortMenuAct from '@/components/SortMenuAct'

import style from '@/styles/upgrades.module.scss'

interface OptionType {
    value: string,
    label: string,
};

function CtStaffSort(props: { changeFunc: (value: string) => void, }): React.ReactNode {

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
    return (
        <div className={style.exClientCnt}>
            {options ? <SortMenuAct callBack={(value: string)=>{props.changeFunc(value)}} options={options}></SortMenuAct> : null}
        </div>
    )
}

export default CtStaffSort
