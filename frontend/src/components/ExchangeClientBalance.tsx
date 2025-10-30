import React, { useState, useEffect, useRef, useCallback } from 'react'

import style from '@/styles/upgrades.module.scss'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setPriceBuyTipe, clearPrice } from '@/redux/upgradeReducer';


function ExchangeClientBalance(): React.ReactNode {

    const [value, setValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const money_amont = useAppSelector(state => state.user.userData.money_amount)
    const price = useAppSelector(state => state.upgrade.price)
    const dispatch = useAppDispatch()

    const resizeInput = useCallback((): void => {
        if (inputRef.current) {
            inputRef.current.style.width = `${value.length + 1}ch`;
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue = e.target.value.replace(',', '.'); // заменяем запятую на точку
        if (newValue === '') {
            setValue('');
            dispatch(clearPrice())
            return;
        }

        // Оставляем только цифры
        if (/^\d*\.?\d{0,2}$/.test(newValue) && Number(newValue) < 100000) {
            setValue(newValue);
            dispatch(setPriceBuyTipe(+newValue))
        }
    };

    useEffect(() => {
        resizeInput();
    }, [resizeInput]);

    useEffect(() => {
        if (price != Number(value)) {
            console.log(123)
            setValue(price.toString())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [price])



    return (
        <div className={style.exchangeClientBalance}>
            <div className={style.paymentSizeCnt}>
                <input
                    type="text"
                    className={style.paymentSize}
                    placeholder='0 Dc'
                    ref={inputRef}
                    value={value}
                    onChange={(e) => handleChange(e)}
                />
            </div>
            <div className={style.clientBalance}>
                {`/${money_amont} Dc`}
            </div>
        </div>
    )
}

export default ExchangeClientBalance
