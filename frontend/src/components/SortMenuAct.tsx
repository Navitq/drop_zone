'use client'

import dynamic from 'next/dynamic';
import { components, DropdownIndicatorProps, SingleValue } from 'react-select';
import '@/styles/sortStyles.scss';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import Image from 'next/image';
import type { Props as ReactSelectProps } from 'react-select';

// Динамический импорт, отключаем SSR
const Select = dynamic(() => import('react-select'), { ssr: false }) as React.ComponentType<
    ReactSelectProps<Options, false>
>;
interface Options {
    value: string;
    label: string;
}

const DropdownIndicator = (props: DropdownIndicatorProps<Options, false>) => {
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

export default function SortMenuAct(props: { options: Options[], callBack: (value: string) => void }) {
    const t = useTranslations("homePage");
    const { callBack } = props;
    useEffect(() => {
        callBack('1');
    }, [callBack]);

    const handleChange = (newValue: SingleValue<Options>) => {
        props.callBack(newValue?.value || '1');
    };

    return (
        <Select
            className="sort-select-cnt"
            classNamePrefix="sort-select"
            placeholder={t('sort')}
            components={{ DropdownIndicator }}
            options={props.options}
            onChange={handleChange}
            isClearable={false}
        />
    );
}
