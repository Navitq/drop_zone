'use client'

import React, { useEffect, useState } from 'react'
import style from '@/styles/homePage.module.scss'
// import axios from "axios";
import StandartCase from '@/components/StandartCase';
import { useLocale } from 'next-intl';
import api from "@/lib/api";
import { BACKEND_PATHS } from '@/utilites/urls';

type caseType = "bloger_case" | "season_case" | "standart_case"

interface Case {
    id: string;
    caseName: string;
    description?: string;
    imgUrl: string
}

interface caseBlogerIncome {
    id: string,
    name: { en: string, ru: string },
    icon_url: string,
}

function CaseShelf(props: { caseUrl: caseType }): React.ReactNode {
    const [caseList, setCaseList] = useState<Case[]>([]);
    const locale = useLocale(); // например 'en' или 'ru'

    useEffect(() => {
        getData()
    }, [locale]);


    async function getData(): Promise<void> {
        try {
            // const response = await api.get(BACKEND_PATHS.getCase(props.caseUrl));
            const response = { data: [{ id: '123', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '214', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '55', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '41235', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '4', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '44445', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '23123', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '55532', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '1245', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '55124', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }] }
            setCaseList(response.data)
            return
            // setCaseList(() => {
            //     return response.data.map((value: caseBlogerIncome) => {
            //         return {
            //             caseName: value.name[locale as 'en' | 'ru'],
            //             imgUrl: value.icon_url,
            //             id: value.id,
            //         }
            //     })
            // })
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    }

    return (
        <div className={style.caseShelfCnt}>
            {caseList?.map(item => (
                <StandartCase imgUrl={item.imgUrl} caseId={item.id} caseName={item.caseName} key={item.id} ></StandartCase>
            ))}
        </div>
    );
}

export default CaseShelf;
