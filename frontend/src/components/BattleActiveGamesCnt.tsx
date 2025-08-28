import React from 'react'
import style from '@/styles/battles.module.scss'
import { useTranslations } from 'next-intl'

import ActiveBattleCard from '@/components/ActiveBattleCard'

function BattleActiveGamesCnt(): React.ReactNode {
    const t = useTranslations("battles")
    return (
        <div className={style.mnBattlesStuffCnt}>
            <div className={style.mnStuffTitle}>
                {t('battles')}
            </div>
            <div className={style.mnStuffCnt}>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard>
            </div>
        </div>
    )
}

export default BattleActiveGamesCnt
