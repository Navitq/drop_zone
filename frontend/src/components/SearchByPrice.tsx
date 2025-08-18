'use client'
import React, { useState } from 'react';
import style from '@/styles/upgrades.module.scss';

function SearchByPrice(props: { placeHolderText: string }): React.ReactNode {
    const [value, setValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const onlyNumbers = e.target.value.replace(/\D/g, ''); // удаляет все, кроме цифр
        setValue(onlyNumbers);
    };

    return (
        <div className={`${style.exSearchBlock} ${style.exSearchPrice}`}>
            <input
                className={`${style.exSearchInput}`}
                type="text"
                placeholder={props.placeHolderText}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
}

export default SearchByPrice;
