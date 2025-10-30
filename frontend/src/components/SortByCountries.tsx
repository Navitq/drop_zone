'use client'

import dynamic from 'next/dynamic';
import { components, DropdownIndicatorProps } from 'react-select';

import '@/styles/sortStyles.scss';
import { useTranslations } from 'next-intl';
import React from 'react';
import Image from 'next/image';

// Динамический импорт, чтобы отключить SSR
const Select = dynamic(() => import('react-select'), { ssr: false });


const DropdownIndicator = (props: DropdownIndicatorProps) => {
    const { menuIsOpen } = props.selectProps;

    return (
        <components.DropdownIndicator {...props}>
            {menuIsOpen ? (
                <Image src="/images/arrow_down.svg" width={16} height={16} alt="arrow icon" style={{ width: 16, height: 16 }} />
            ) : (
                <Image src="/images/arrow_up.svg" width={16} height={16} alt="arrow icon" style={{ width: 16, height: 16 }} />
            )}
        </components.DropdownIndicator>
    );
};

export default function SortByCountries() {
    const t = useTranslations("header");
    const options: { value: string, label: string }[] = [
        { value: 'ruassia', label: t('ruassia_st') },
        { value: 'china', label: t('china_st') },
        { value: 'usa', label: t('usa_st') }
    ]
    return (
        <div className="sort-select-countrie">
            <Select
                className="sort-select-cnt"
                classNamePrefix="sort-select"
                placeholder={t('countrie')}
                components={{ DropdownIndicator }}
                options={options}
            />
        </div>
    );
}
