import React from 'react';

import style from '@/styles/profile.module.scss'

import PrOwnerInfo from '@/components/PrOwnerInfo'
import PrUserInfo from '@/components/PrUserInfo'
import TitleHomePage from '@/components/TitleHomePage'
import PrTradeLinkBlock from '@/components/PrTradeLinkBlock'
import PrSiteActivities from '@/components/PrSiteActivities'
import PrBestObject from '@/components/PrBestObject'
import PrBestCase from '@/components/PrBestCase'





export default function ProfilePage(): React.ReactNode {

  const isAuth = true
  return (
    <div className={style.profile}>
      <div className={style.profileTitle}>
        <TitleHomePage textKey={isAuth ? 'profile_title' : 'user_title'}></TitleHomePage>
      </div>
      <div className={style.mainUserInfoCnt}>
        {isAuth ?
          <PrOwnerInfo link={'https://steamcommunity.com/id/pinoygamestore'} imgPath='/images/example_user_image.png' nickName={"Marco Polo"} balance={758.18} accountType={"Steam"}></PrOwnerInfo> :
          <PrUserInfo link={'https://steamcommunity.com/id/pinoygamestore'} imgPath='/images/example_user_image.png' nickName={"Marco Polo"} accountType={"Steam"}></PrUserInfo>}
        <div className={style.siteUserInfoCnt}>
          {isAuth ? <PrTradeLinkBlock></PrTradeLinkBlock> : null}
          <PrSiteActivities></PrSiteActivities>
        </div>
      </div>
      <div className={style.prCasesData}>
        <div className={style.prBestObjectCnt}>
          <PrBestObject>
            <PrBestCase caseName={"Весення кура"}></PrBestCase>
          </PrBestObject>
        </div>

        <div></div>
      </div>
    </div >
  );
}
