// eslint-disable

'use client';

import React, { useEffect, useState } from 'react';
import StatElem from './StatElem'
import { usePathname } from "next/navigation";
import { BACKEND_PATHS } from '@/utilites/urls'

import api from "@/lib/api";

interface Message {
    contracts: number,
    battles: number,
    upgrades: number,
    cases: number
}


function DropStat(): React.ReactNode {
    const [messages, setMessages] = useState<Message | null>(null);
    const pathname = usePathname();

    async function getTotalAmounData() {
        try {
            const response = await api.get(BACKEND_PATHS.totalActivities);
            console.log(response.data)
            setMessages(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getTotalAmounData();
    }, [pathname]);

    return (

        <>
            <StatElem message={messages || messages === 0 ? messages.contracts : null} imgPath="/images/luggage_stat_gd.svg" titleKey="contracts_st" imgAltKey="luggage_st"></StatElem>
            <StatElem message={messages || messages === 0 ? messages.battles : null} imgPath="/images/shooting_stat_gd.svg" titleKey="battles_st" imgAltKey="shooting_st"></StatElem>
            <StatElem message={messages || messages === 0 ? messages.upgrades : null} imgPath="/images/key_stat_gd.svg" titleKey="upgrades_st" imgAltKey="key_st"></StatElem>
            <StatElem message={messages || messages === 0 ? messages.cases : null} imgPath="/images/arrow_stat_gd.svg" titleKey="cases_st" imgAltKey="arrow_st"></StatElem>
        </>
    )
}

export default DropStat
