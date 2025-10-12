'use client'

import React, { useEffect, useState } from 'react'


import style from '@/styles/raffles.module.scss';

import TitleHomePage from '@/components/TitleHomePage';
import RafflesCase from '@/components/RafflesCase';

import { BACKEND_PATHS } from '@/utilites/urls'

import api from "@/lib/api";


interface RafflesCaseInt {
    id: string
    gunModel: string,
    gunStyle: string,
    maxPlayerAmount: number,
    currentPlayerAmount: number,
    participationPrice: number,
    imgPath: string,
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
    endTime: string // ISO string или timestamp конца раффла
}

export default function RafflesPage(): React.ReactNode {

    const [rafflesItems, setRafflesItems] = useState<RafflesCaseInt[]>([])

    async function getRaffels() {
        try {
            const response = await api.get(BACKEND_PATHS.getRaffles);
            setRafflesItems(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getRaffels()
    }, [])


    return (
        <div className={style.raffles}>
            <div className={style.rafflesTitle}>
                <TitleHomePage textKey={"t_raffles"}></TitleHomePage>
            </div>
            <div className={style.rafflesCasesCnt}>
                {
                    rafflesItems.map((value, index) => {
                        return (
                            <RafflesCase id={value.id} key={index} endTime={value.endTime} participationPrice={value.participationPrice} type={value.type} gunModel={value.gunModel} gunStyle={value.gunStyle} currentPlayerAmount={value.currentPlayerAmount} maxPlayerAmount={value.maxPlayerAmount} imgPath={value.imgPath}></RafflesCase>
                        )
                    })
                }
                {/* <RafflesCase endTime={"2025-08-21T23:30:00Z"} participationPrice={150} type='usuall' gunModel="М4А1" gunStyle='Buldozer' currentPlayerAmount={134} maxPlayerAmount={200} imgPath={"/images/example_raffles_violet.png"}></RafflesCase> */}
            </div>

        </div >
    );
}
