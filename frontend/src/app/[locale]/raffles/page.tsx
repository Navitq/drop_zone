
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
                <RafflesCase endTime={"2025-08-21T23:30:00Z"} participationPrice={150} type='usuall' gunModel="М4А1" gunStyle='Buldozer' currentPlayerAmount={134} maxPlayerAmount={200} imgPath={"/images/example_raffles_violet.png"}></RafflesCase>
                <RafflesCase endTime={"2025-08-18T23:30:00Z"} participationPrice={150} type='rare' gunModel="М4А1" gunStyle='Buldozer' currentPlayerAmount={52} maxPlayerAmount={200} imgPath={"/images/example_raffles_violet.png"}></RafflesCase>
                <RafflesCase endTime={"2025-08-19T23:30:00Z"} participationPrice={150} type='elite' gunModel="М4А1" gunStyle='Buldozer' currentPlayerAmount={143} maxPlayerAmount={200} imgPath={"/images/example_raffles_violet.png"}></RafflesCase>
                <RafflesCase endTime={"2025-08-18T22:30:00Z"} participationPrice={150} type='epic' gunModel="М4А1" gunStyle='Buldozer' currentPlayerAmount={198} maxPlayerAmount={200} imgPath={"/images/example_raffles_violet.png"}></RafflesCase>
                <RafflesCase endTime={"2025-08-18T22:30:00Z"} participationPrice={150} type='classified' gunModel="М4А1" gunStyle='Buldozer' currentPlayerAmount={198} maxPlayerAmount={200} imgPath={"/images/example_raffles_violet.png"}></RafflesCase>
            </div>
        </div >
    );
}
