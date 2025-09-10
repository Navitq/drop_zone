'use client'

import React, { useEffect, useState } from 'react'
import style from '@/styles/homePage.module.scss'
import api from "@/lib/api";
import { BACKEND_PATHS } from '@/utilites/urls';
import BigCase from '@/components/BigCase'
import { useLocale } from 'next-intl';


interface caseInt {
    caseName: string,
    imgUrl: string,
    caseId: string,
}

interface caseBlogerIncome {
    id: string,
    name: { en: string, ru: string },
    icon_url: string,
}

function SeasonCases(): React.ReactNode {
    const locale = useLocale(); // например 'en' или 'ru'

    const [seasonCases, setSeasonCases] = useState<caseInt[]>([])

    useEffect(() => {
        fetchBlogerCases()
    }, [locale]);


    // Функция для получения блогерских кейсов
    async function fetchBlogerCases() {
        try {
            const response = await api.get(BACKEND_PATHS.getCase("season_case"));
            setSeasonCases(() => {
                return response.data.map((value: caseBlogerIncome) => {
                    return {
                        caseName: value.name[locale as 'en' | 'ru'],
                        imgUrl: value.icon_url,
                        caseId: value.id,
                    }
                })
            })
        } catch (error) {
            console.error("Ошибка при запросе блогерских кейсов:", error);
        }
    }

    return (
        <div className={style.bgCaseBlock}>
            {seasonCases.map((c) => (
                <BigCase key={c.caseId} caseId={c.caseId} imgUrl={c.imgUrl} caseName={c.caseName} />
            ))}
        </div>
    )
}

export default SeasonCases
