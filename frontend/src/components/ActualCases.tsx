'use client';
import React, { useState, useEffect } from 'react'
import CaseShelf from '@/components/CaseShelf'
import TitleHomePage from '@/components/TitleHomePage'
import style from '@/styles/homePage.module.scss'
import { BACKEND_PATHS } from '@/utilites/urls'
import SortMenuAct from '@/components/SortMenuAct'
import { useTranslations } from 'next-intl';


interface OptionType {
    value: string,
    label: string,
};

function ActualCases(): React.ReactNode {
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

    if (options === null) return null;

    return (
        <div className={style.actBlock}>
            <div className={style.actTitleCnt}>
                <TitleHomePage textKey="actual_case_title"></TitleHomePage>
                {/* <SortMenuAct typeKey={'sort'} pointsKey={['popularity', 'price_up', 'price_down', 'name']}></SortMenuAct> */}
                <SortMenuAct options={options}></SortMenuAct>
            </div>
            <CaseShelf caseUrl={BACKEND_PATHS.getActualCases}></CaseShelf>
        </div>
    )
}

export default ActualCases
