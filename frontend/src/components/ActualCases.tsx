'use client';
import React, { useState, useEffect } from 'react'
import CaseShelf from '@/components/CaseShelf'
import TitleHomePage from '@/components/TitleHomePage'
import style from '@/styles/homePage.module.scss'
import SortMenuAct from '@/components/SortMenuAct'
import { useTranslations } from 'next-intl';


interface OptionType {
    value: string,
    label: string,
};

function ActualCases(): React.ReactNode {
    const t = useTranslations("homePage");
    const [options, setOptions] = useState<OptionType[] | null>(null);
    const [sortType, setSortType] = useState<number>(1)

    useEffect(() => {
        setOptions([
            { value: '1', label: t('srt_created_data') },
            { value: '2', label: t('srt_name') },
            { value: '3', label: t('srt_price_up') },
            { value: '4', label: t('srt_price_down') },
        ]);
    }, [t]);

    function changeFunc(value: string) {
        const data: number = Number(value);
        setSortType(data)
    }

    if (options === null) return null;

    return (
        <div className={style.actBlock}>
            <div className={style.actTitleCnt}>
                <TitleHomePage textKey="actual_case_title"></TitleHomePage>
                {/* <SortMenuAct typeKey={'sort'} pointsKey={['popularity', 'price_up', 'price_down', 'name']}></SortMenuAct> */}
                <SortMenuAct callBack={(value: string) => { changeFunc(value) }} options={options}></SortMenuAct>
            </div>
            <CaseShelf sortType={sortType} caseUrl={'standart_case'}></CaseShelf>
        </div>
    )
}

export default ActualCases
