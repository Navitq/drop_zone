import React from 'react';


import BattleGroupHeadCnt from '@/components/BattleGroupHeadCnt'
import MnHeadBlock from '@/components/MnHeadBlock'
import MdHeaderRulesModalCnt from '@/components/MdHeaderRulesModalCnt'
import BattleActiveGamesCnt from '@/components/BattleActiveGamesCnt'


export default function BattlesPage(): React.ReactNode {
  return (
    <>
      <BattleGroupHeadCnt>
        <MnHeadBlock></MnHeadBlock>
      </BattleGroupHeadCnt>
      <BattleActiveGamesCnt></BattleActiveGamesCnt>
      <MdHeaderRulesModalCnt></MdHeaderRulesModalCnt>
    </>
  );
}
