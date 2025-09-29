'use client'
import React from 'react';


import BattleGroupHeadCnt from '@/components/BattleGroupHeadCnt'
import MnHeadBlock from '@/components/MnHeadBlock'
import MdHeaderRulesModalCnt from '@/components/MdHeaderRulesModalCnt'
import BattleActiveGamesCnt from '@/components/BattleActiveGamesCnt'
import HowBattlesWorkMobile from '@/components/HowBattlesWorkMobile'
import { useAppSelector } from '@/lib/hooks'
import Link from 'next/link'
import style from '@/styles/battles.module.scss'
import CaseBtnText from '@/components/CaseBtnText'
import { FRONTEND_PATHS } from '@/utilites/urls'
import { useTranslations } from 'next-intl'


export default function BattlesPage(): React.ReactNode {
  const t = useTranslations("battles")
  const isAuth = useAppSelector(state => state.user.isAuth);
  return (
    <>
      <div className={`${style.bpMobileRules} bpMobileRulesBattles`}>
        <BattleGroupHeadCnt>
          <HowBattlesWorkMobile></HowBattlesWorkMobile>
        </BattleGroupHeadCnt>
      </div>
      <BattleGroupHeadCnt>
        <MnHeadBlock></MnHeadBlock>
      </BattleGroupHeadCnt>
      <div className={style.mnHeadBtnGroupMobile}>
        {isAuth ? (
          <>
            <div className={style.prSaveBtCnt}>
              <Link href={FRONTEND_PATHS.battlesCreate}>
                <CaseBtnText text={t('create')} />
              </Link>
            </div>
          </>
        ) : (
          <div className={style.prSaveBtCnt}>
            <CaseBtnText text={t('login')} />
          </div>
        )}

      </div>
      <BattleActiveGamesCnt></BattleActiveGamesCnt>
      <MdHeaderRulesModalCnt></MdHeaderRulesModalCnt>
    </>
  );
}
