'use client'

import React, { useEffect, useState } from 'react'
import style from '@/styles/homePage.module.scss'
import axios from "axios";
import StandartCase from '@/components/StandartCase';
import { title } from 'process';

interface Case {
    id: number;
    caseNameKey: string;
    description: string;
    urlImg: string
}

function CaseShelf(props: { caseUrl: string }): React.ReactNode {
    const [caseList, setCaseList] = useState<Case[]>([]);

    async function getData(): Promise<void> {
        try {
            // const response = await axios.get<Case[]>(props.caseUrl);
            // console.log("API ответ:", response.data);
            const response = { data: [{ id: 123, caseNameKey: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: 214, caseNameKey: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: 55, caseNameKey: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: 41235, caseNameKey: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: 4, caseNameKey: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: 44445, caseNameKey: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: 23123, caseNameKey: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: 55532, caseNameKey: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: 1245, caseNameKey: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: 55124, caseNameKey: "example", description: "example", urlImg: '/images/case_mock.png' }] }
            setCaseList(response.data);
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    }

    useEffect(() => {
        getData();
    }, [props.caseUrl]);

    return (
        <div className={style.caseShelfCnt}>
            {caseList?.map(item => (
                <StandartCase imgUrl={item.urlImg} caseNameKey={item.caseNameKey} key={item.id} ></StandartCase>
            ))}
        </div>
    );
}

export default CaseShelf;
