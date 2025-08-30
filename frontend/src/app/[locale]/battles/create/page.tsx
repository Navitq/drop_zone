import React from 'react';

// import style from '@/styles/battles.module.scss'
import GameSetupPanel from '@/components/GameSetupPanel'
import GameBtlCasesInfo from '@/components/GameBtlCasesInfo'
import CrBtlCaseModalCnt from '@/components/CrBtlCaseModalCnt'

export default function BattlesCreatePage(): React.ReactNode {
  return (
    <>
      <GameSetupPanel />
      <GameBtlCasesInfo></GameBtlCasesInfo>
      <CrBtlCaseModalCnt></CrBtlCaseModalCnt>
    </>
  );
}
