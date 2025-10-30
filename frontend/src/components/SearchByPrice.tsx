'use client'
import React from 'react';
import style from '@/styles/upgrades.module.scss';

function SearchByPrice(props: { placeHolderText: string, getDataByPrice: (value: string) => void, value: string }): React.ReactNode {


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const onlyNumbers = e.target.value.replace(/\D/g, ''); // удаляет все, кроме цифр
        props.getDataByPrice(onlyNumbers)
    };

    return (
        <div className={`${style.exSearchBlock} ${style.exSearchPrice}`}>
            <input
                className={`${style.exSearchInput}`}
                type="text"
                placeholder={props.placeHolderText}
                value={props.value}
                onChange={handleChange}
            />
        </div>
    );
}

export default SearchByPrice;
