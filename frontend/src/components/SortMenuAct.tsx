'use client'

import dynamic from 'next/dynamic';
import { components, DropdownIndicatorProps } from 'react-select';

import '@/styles/sortStyles.scss';
import { useTranslations } from 'next-intl';
import React from 'react';
import Image from 'next/image';

// Динамический импорт, чтобы отключить SSR
const Select = dynamic(() => import('react-select'), { ssr: false });


interface Options {
    value: string,
    label: string
}

const DropdownIndicator = (props: DropdownIndicatorProps) => {
    const { menuIsOpen } = props.selectProps;

    return (
        <components.DropdownIndicator {...props}>
            {menuIsOpen ? (
                <div className={'sortArrowCnt'}>
                    <Image src="/images/arrow_down.svg" fill alt="arrow icon" />
                </div>
            ) : (
                <div className={'sortArrowCnt'}>
                    <Image src="/images/arrow_up.svg" fill alt="arrow icon" />
                </div>
            )}
        </components.DropdownIndicator>
    );
};

export default function SortMenuAct(props: { options: Options[] }) {
    const t = useTranslations("homePage");
    return (
        <Select
            className="sort-select-cnt"
            classNamePrefix="sort-select"
            placeholder={t('sort')}
            components={{ DropdownIndicator }}
            options={props.options}
        />
    );
}
