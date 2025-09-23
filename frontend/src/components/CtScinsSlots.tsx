'use client'
import React, { useMemo } from 'react'

import style from '@/styles/contracts.module.scss'

import CtSlot from '@/components/CtSlot'
import { useAppSelector } from '@/lib/hooks'



// Главный компонент
function CtScinsSlots() {
    // Берём массив из Redux
    // const items = useSelector(function (state: any) {
    //     return state.slotsArray;
    // });
    const itemClientData = useAppSelector(state => state.contracts.itemClientData)
    const slots = Array.from({ length: 10 }, (_, i) => itemClientData[i] || null);

    // Массив длиной 10, создаём только при изменении items


    return (
        <div className={style.ctObjectCnt}>
            {slots.map(function (item, index) {
                if (item) {
                    return <CtSlot key={item?.id || index} data={{ imgPath: item.imgPath, gunModel: item.gunModel, type: item.type, gunStyle: item.gunStyle, gunPrice: item.gunPrice, state: item.state }} index={index} />;
                } else {
                    return <CtSlot key={item?.id || index} index={index} />;
                }

            })}
        </div>
    );
}


export default CtScinsSlots;
