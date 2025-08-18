
import React from 'react'


import style from '@/styles/raffles.module.scss';

import TitleHomePage from '@/components/TitleHomePage';
import RafflesCase from '@/components/RafflesCase';


export default function RafflesPage(): React.ReactNode {

    return (
        <div className={style.raffles}>
            <div className={style.rafflesTitle}>
                <TitleHomePage textKey={"t_raffles"}></TitleHomePage>
            </div>
            <div className={style.rafflesCasesCnt}>
                <RafflesCase participationPrice={150} type='usuall' gunModel="М4А1" gunStyle='Buldozer' currentPlayerAmount={200} maxPlayerAmount={200} imgPath={"/images/example_raffles_violet.png"}></RafflesCase>
            </div>
        </div >
    );
}
