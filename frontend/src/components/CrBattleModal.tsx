'use client'

import React, { useState, useEffect } from 'react'
import style from '@/styles/battles.module.scss'
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/lib/hooks';
import Image from 'next/image';

import CtStaffSort from '@/components/CtStaffSort'
import SearchCaseBtl from '@/components/SearchCaseBtl'
import CaseBtnText from '@/components/CaseBtnText'
import CbBattleCase from '@/components/CbBattleCase'
import api from "@/lib/api";
import { BACKEND_PATHS } from '@/utilites/urls';
import { useLocale } from 'next-intl';

interface CrBattleModalInt {
    onClose: () => void;
}


interface caseMainDataIncome {
    id: string,
    name: string,
    imgUrl: string,
    price: number
}

interface caseMainDataServer {
    id: string,
    name: { en: string, ru: string },
    icon_url: string,
    price: number
}


function CrBattleModal(props: CrBattleModalInt): React.ReactNode {
    const t = useTranslations('battles')
    const [cases, setCases] = useState<caseMainDataIncome[]>([])
    const locale = useLocale(); // например 'en' или 'ru'


    useEffect(() => {
        fetchAllCases();
    }, [])

    async function fetchAllCases() {
        try {
            const response = await api.get(BACKEND_PATHS.getCase("all"));
            setCases(() => {
                return response.data.map((value: caseMainDataServer) => {
                    return {
                        name: value.name[locale as 'en' | 'ru'],
                        imgUrl: value.icon_url,
                        id: value.id,
                        price: value.price
                    }
                })
            })
        } catch (error) {
            console.error("Ошибка при запросе блогерских кейсов:", error);
        }
    }


    const { totalPrice, totalCaseAmount, createBtlData } = useAppSelector(state => state.battlesCreate)
    return (
        <div className={style.crModalCnt} onClick={(e) => e.stopPropagation()}>
            <div className={style.crModalHeadCnt}>
                <div className={style.crModalHead}>
                    <div className={style.crModalTitleWrapperModal}>
                        <div className={style.crModalTitle}>{t('add_case')}</div>
                        <div className={style.crModalSeparatorMobile}>
                            <Image fill src={"/images/rm_divider.svg"} alt={t('rm_divider_alt')}></Image>
                        </div>
                    </div>
                    <div className={style.crModalFilter}>
                        <SearchCaseBtl placeHolderText={t('search')}></SearchCaseBtl>
                        <div className={style.crModalSort}>
                            <CtStaffSort></CtStaffSort>
                        </div>
                    </div>
                </div>
                <div className={style.crModalSeparator}>
                    <Image fill src={"/images/rm_divider.svg"} alt={t('rm_divider_alt')}></Image>
                </div>
            </div>
            <div className={style.crModalCaseStore}>
                {cases.map((value) => {
                    // ищем, есть ли этот кейс в createBtlData
                    const existingCase = createBtlData.find((c) => c.casesId === value.id);

                    return (
                        <div key={value.id} className={style.crModalCard}>
                            <CbBattleCase
                                unitPrice={value.price}
                                caseAmount={existingCase ? existingCase.caseAmount : 0} // если есть — берём его caseAmount
                                caseImgPath={value.imgUrl}
                                caseName={value.name}
                                casesId={value.id}
                            />
                        </div>
                    );
                })}


            </div>
            <div className={style.crModalAdditionalData}>
                <div className={style.crModalTotalPrice}>
                    <div className={style.crModalPriceTxtDescr}>{t('price')}</div>
                    <div className={style.crModalPriceAmount}>{`${totalPrice} Dc`}</div>
                </div>
                <div className={style.crModalConfirmCnt}>
                    <CaseBtnText text={t('confirm')} onClick={() => { props.onClose() }} />
                </div>
                <div className={style.crModalTotalPrice}>
                    <div className={style.crModalPriceTxtDescr}>{t('rounds_amount')}</div>
                    <div className={style.crModalPriceAmount}>{`${totalCaseAmount}/3`}</div>
                </div>
            </div>
            <div className={style.crModalAdditionalDataMobile}>
                <div className={style.gspPlayerPriceModalBlockMobile}>
                    <div className={style.gbcipCaseDefenitionsBlock}>
                        <div>{t('rounds_amount')}</div>
                        <div>{t('battles_price')}</div>
                    </div>
                    <div className={style.gbcipCaseAmountBlock}>
                        <div>{`${totalCaseAmount}/3`}</div>
                        <div>{`${totalPrice} Dc`}</div>
                    </div>
                </div>

                <div className={style.crModalConfirmCntMobile} onClick={() => { props.onClose() }}>
                    {t('confirm')}
                </div>

            </div>
        </div >
    )
}

export default CrBattleModal
