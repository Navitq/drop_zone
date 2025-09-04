import React from 'react';
import CurrentBattleHead from '@/components/CurrentBattleHead'
import BattleGameField from '@/components/BattleGameField'

export default function BattlesIdPage(): React.ReactNode {

  return (
    <>
      <CurrentBattleHead></CurrentBattleHead>
      <BattleGameField></BattleGameField>
    </>
  );
}
