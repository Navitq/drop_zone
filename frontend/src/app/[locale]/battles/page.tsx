import React from 'react';
import style from '@/styles/battles.module.scss'


import BattleGroupHeadCnt from '@/components/BattleGroupHeadCnt'
import MnHeadBlock from '@/components/MnHeadBlock'
import ModalCnt from '@/components/ModalCnt'
import MdHeaderRulesModal from '@/components/MdHeaderRulesModal'


export default function BattlesPage(): React.ReactNode {
  return (
    <>
      <BattleGroupHeadCnt>
        <MnHeadBlock></MnHeadBlock>
      </BattleGroupHeadCnt>
      <ModalCnt>
        <MdHeaderRulesModal></MdHeaderRulesModal>
      </ModalCnt>
    </>
  );
}
