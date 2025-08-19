import React, { useMemo } from 'react'

import style from '@/styles/contracts.module.scss'

import CtSlot from '@/components/CtSlot'


// Главный компонент
function CtScinsSlots() {
    // Берём массив из Redux
    // const items = useSelector(function (state: any) {
    //     return state.slotsArray;
    // });
    const items: (object | undefined)[] = [];

    // Массив длиной 10, создаём только при изменении items
    const slots = useMemo(function () {
        return Array.from({ length: 10 }, function (_, i) {
            return items[i];
        });
    }, [items]);

    return (
        <div className={style.ctObjectCnt}>
            {slots.map(function (item, index) {
                return <CtSlot key={index} data={{ imgPath: '/images/example_gun_blue.png', gunModel: "AK-47", type: "usuall", gunStyle: 'LIZARD PIZARD', gunPrice: 58.48 }} index={index} />;
            })}
        </div>
    );
}


export default CtScinsSlots;
