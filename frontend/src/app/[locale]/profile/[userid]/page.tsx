import React from 'react';

import style from '@/styles/profile.module.scss'

import PrOwnerInfo from '@/components/PrOwnerInfo'
import PrUserInfo from '@/components/PrUserInfo'



export default function ProfilePage(): React.ReactNode {

  const isAuth = true
  return (
    <div className={style.profile}>
      <div className={style.mainUserInfoCnt}>
        {isAuth ?
          <PrOwnerInfo link={'https://steamcommunity.com/id/pinoygamestore'} imgPath='/images/example_user_image.png' nickName={"Marco Polo"} balance={758.18} accountType={"Steam"}></PrOwnerInfo> :
          <PrUserInfo link={'https://steamcommunity.com/id/pinoygamestore'} imgPath='/images/example_user_image.png' nickName={"Marco Polo"} accountType={"Steam"}></PrUserInfo>}
      </div>
    </div >
  );
}
