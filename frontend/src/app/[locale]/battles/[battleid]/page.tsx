'use client'
import React from 'react';
import CurrentBattleHead from '@/components/CurrentBattleHead'
import BattleGameField from '@/components/BattleGameField'
import MobileLiveBattleBtn from '@/components/MobileLiveBattleBtn'

export default function BattlesIdPage(): React.ReactNode {

  return (
    <>
      <CurrentBattleHead></CurrentBattleHead>
      <MobileLiveBattleBtn></MobileLiveBattleBtn>
      <BattleGameField></BattleGameField>
    </>
  );
}
