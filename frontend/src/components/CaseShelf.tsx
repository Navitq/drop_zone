'use client'

import React, { useEffect, useState, useRef } from 'react'
import style from '@/styles/homePage.module.scss'
// import axios from "axios";
import StandartCase from '@/components/StandartCase';
import { useLocale } from 'next-intl';
import api from "@/lib/api";
import { BACKEND_PATHS } from '@/utilites/urls';

type caseType = "bloger_case" | "season_case" | "standart_case"

interface caseInt {
    caseName: string,
    imgUrl: string,
    caseId: string,
    price: number,
}

interface caseBlogerIncome {
    id: string,
    name: { en: string, ru: string },
    icon_url: string,
    price: number,
}

function CaseShelf(props: { caseUrl: caseType, sortType?: number }): React.ReactNode {
    const [caseList, setCaseList] = useState<caseInt[]>([]);
    const sortTypeRef = useRef<number>(0)
    const locale = useLocale(); // например 'en' или 'ru'
    const originalListRef = useRef<caseInt[]>([])

    useEffect(() => {
        getData()
    }, [locale]);

    useEffect(() => {
        if (!props.sortType || props.sortType === 1 && sortTypeRef.current === 0) return;

        sortTypeRef.current = props.sortType

        const sortedList = [...originalListRef.current]; // стартуем с оригинала

        switch (props.sortType) {
            case 1: // по новизне (исходный порядок)
                // ничего не делаем, оставляем как есть
                break;
            case 2: // по имени
                sortedList.sort((a, b) => (a.caseName || '').localeCompare(b.caseName || ''));
                break;
            case 3: // по цене вверх
                sortedList.sort((a, b) => a.price - b.price);
                break;
            case 4: // по цене вниз
                sortedList.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }
        setCaseList(sortedList);
    }, [props.sortType, locale]);


    async function getData(): Promise<void> {
        try {
            const response = await api.get(BACKEND_PATHS.getCase(props.caseUrl));
            // const response = { data: [{ id: '123', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '214', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '55', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '41235', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '4', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '44445', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '23123', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '55532', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '1245', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }, { id: '55124', caseName: "example", description: "example", imgUrl: '/images/case_mock.png' }] }
            // setCaseList(response.data)
            // return
            setCaseList(() => {
                return response.data.map((value: caseBlogerIncome) => {
                    return {
                        caseName: value.name[locale as 'en' | 'ru'],
                        imgUrl: value.icon_url,
                        caseId: value.id,
                        price: value.price,
                    }
                })
            })
            originalListRef.current = response.data.map((value: caseBlogerIncome) => {
                return {
                    caseName: value.name[locale as 'en' | 'ru'],
                    imgUrl: value.icon_url,
                    caseId: value.id,
                    price: value.price,
                }
            });
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    }

    return (
        <div className={style.caseShelfCnt}>
            {caseList?.map(item => (
                <StandartCase price={item.price} imgUrl={item.imgUrl} caseId={item.caseId} caseName={item.caseName} key={item.caseId} ></StandartCase>
            ))}
        </div>
    );
}

export default CaseShelf;
