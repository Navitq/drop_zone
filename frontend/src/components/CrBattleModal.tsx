'use client'

import React from 'react'
import style from '@/styles/battles.module.scss'
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/lib/hooks';
import Image from 'next/image';

import CtStaffSort from '@/components/CtStaffSort'
import SearchCaseBtl from '@/components/SearchCaseBtl'
import CaseBtnText from '@/components/CaseBtnText'
import CbBattleCase from '@/components/CbBattleCase'


interface CrBattleModalInt {
    onClose: () => void;
}

function CrBattleModal(props: CrBattleModalInt): React.ReactNode {
    const t = useTranslations('battles')
    const { totalPrice, totalCaseAmount } = useAppSelector(state => state.battlesCreate)
    return (
        <div className={style.crModalCnt} onClick={(e) => e.stopPropagation()}>
            <div className={style.crModalHeadCnt}>
                <div className={style.crModalHead}>
                    <div className={style.crModalTitle}>{t('add_case')}</div>
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
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={214 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={4114 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={1244 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={1554 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={1654 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={45614 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={1754 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={33214 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={1415 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={15554 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={13334 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={12224 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={11114 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={15224 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={1222224 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={13456764 + ""}></CbBattleCase>
                </div>
                <div className={style.crModalCard}>
                    <CbBattleCase unitPrice={578} caseAmount={0} caseImgPath={"/images/case_mock.png"} caseName={"Весенняя кура"} casesId={1675314 + ""}></CbBattleCase>
                </div>

            </div>
            <div className={style.crModalAdditionalData}>
                <div className={style.crModalTotalPrice}>
                    <div className={style.crModalPriceTxtDescr}>{t('price')}</div>
                    <div className={style.crModalPriceAmount}>{`${totalPrice} Dc`}</div>
                </div>
                <div className={style.crModalConfirmCnt}>
                    <CaseBtnText text={t('confirm')} />
                </div>
                <div className={style.crModalTotalPrice}>
                    <div className={style.crModalPriceTxtDescr}>{t('rounds_amount')}</div>
                    <div className={style.crModalPriceAmount}>{`${totalCaseAmount}/3`}</div>
                </div>
            </div>
        </div >
    )
}

export default CrBattleModal
