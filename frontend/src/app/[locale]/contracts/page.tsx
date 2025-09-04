import React from 'react';


import style from '@/styles/contracts.module.scss'

import TitleHomePage from '@/components/TitleHomePage';
import CtScinsData from '@/components/CtScinsData';
import CtScinsSlots from '@/components/CtScinsSlots';
import CtStaff from '@/components/CtStaff'

export default function ContractPage(): React.ReactNode {
  return (
    <div className={style.contracts}>
      <div className={style.contractsTitle}>
        <TitleHomePage textKey={"t_contracts"}></TitleHomePage>
      </div>
      <div className={style.gameFieldCnt}>
        <CtScinsData scinPrice={190.97}></CtScinsData>
        <CtScinsSlots></CtScinsSlots>
      </div>

      <CtStaff></CtStaff>

    </div>
  );
}
