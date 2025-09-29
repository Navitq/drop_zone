import React, { useState, useEffect } from 'react'
import style from '@/styles/battles.module.scss'
import { useTranslations } from 'next-intl'

import ActiveBattleCard from '@/components/ActiveBattleCard'
import { BACKEND_PATHS } from '@/utilites/urls'

import api from "@/lib/api";
import { useAppSelector } from '@/lib/hooks'
import ShouldAuthStaff from '@/components/ShouldAuthStaff'

function BattleActiveGamesCnt(): React.ReactNode {
    const t = useTranslations("battles")
    const [battlesCollection, setBattlesCollection] = useState([])
    const isAuth = useAppSelector(state => state.user.isAuth)

    async function getActiveGames() {
        try {
            const response = await api.get(BACKEND_PATHS.getActiveBattles);

            // Каждое сражение распарсим
            const battles = response.data.active_battles.map(battle => ({
                ...battle,
                cases: JSON.parse(battle.cases || "[]"),
                players: JSON.parse(battle.players || "[]"),
                winner: JSON.parse(battle.winner || "[]"),
            }));
            console.log(battles)
            setBattlesCollection(battles);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (isAuth)
            getActiveGames()
    }, [])

    return (
        <div className={style.mnBattlesStuffCnt}>
            <div className={style.mnStuffTitle}>
                {t('battles')}
            </div>

            {
                !isAuth ? (
                    <div className={style.mnAuthMock}>
                        <ShouldAuthStaff btnText={t('auth_battle')} subTitleText={t('unauth_battle_sub_title')} titleText={t('unauth_battle')}></ShouldAuthStaff>
                    </div>
                ) : (
                    <div className={style.mnStuffCnt}>
                        {battlesCollection.map((value: any, index) => {
                            const totalCost = value.cases.reduce(
                                (acc: number, c: { price: number; case_amount: number }) => acc + c.price * (c.case_amount ?? 1),
                                0
                            );
                            let playersImgPath = value.players.map(player => player.imgpath || "");
                            while (playersImgPath.length < value.players_amount) {
                                playersImgPath.push("");
                            }
                            let battleCasesImg = value.cases.flatMap(caseItem =>
                                Array.from({ length: caseItem.case_amount }, () => caseItem.imgpath || "")
                            );
                            return <ActiveBattleCard key={value.id} battleId={value.id} playersImgPath={playersImgPath} totalCost={Number(totalCost.toFixed(2))} battleCases={battleCasesImg}></ActiveBattleCard>
                        })}
                    </div>
                )
            }
            {/*

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
                <ActiveBattleCard battleId={Math.floor(Math.random() * 10000) + ""} playersImgPath={["/images/example_avatar.png", "", "", ""]} totalCost={285431231} battleCases={["/images/case_mock.png", "/images/example_bg_case.png", "/images/case_mock.png"]}></ActiveBattleCard> */}

        </div>
    )
}

export default BattleActiveGamesCnt
