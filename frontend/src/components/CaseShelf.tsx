'use client'

import React, { useEffect, useState } from 'react'
import style from '@/styles/homePage.module.scss'
// import axios from "axios";
import StandartCase from '@/components/StandartCase';

interface Case {
    id: string;
    caseName: string;
    description?: string;
    urlImg: string
}

function CaseShelf(props: { caseUrl: string }): React.ReactNode {
    const [caseList, setCaseList] = useState<Case[]>([]);

    async function getData(): Promise<void> {
        try {
            // const response = await axios.get<Case[]>(props.caseUrl);
            // console.log("API ответ:", response.data);
            const response = { data: [{ id: '123', caseName: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: '214', caseName: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: '55', caseName: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: '41235', caseName: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: '4', caseName: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: '44445', caseName: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: '23123', caseName: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: '55532', caseName: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: '1245', caseName: "example", description: "example", urlImg: '/images/case_mock.png' }, { id: '55124', caseName: "example", description: "example", urlImg: '/images/case_mock.png' }] }
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
                <StandartCase imgUrl={item.urlImg} caseId={item.id} caseName={item.caseName} key={item.id} ></StandartCase>
            ))}
        </div>
    );
}

export default CaseShelf;
