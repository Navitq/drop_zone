'use client'
import React, { useEffect } from 'react';

import style from '@/styles/profile.module.scss'

import PrOwnerInfo from '@/components/PrOwnerInfo'
import PrUserInfo from '@/components/PrUserInfo'
import TitleHomePage from '@/components/TitleHomePage'
import PrTradeLinkBlock from '@/components/PrTradeLinkBlock'
import PrSiteActivities from '@/components/PrSiteActivities'
import PrBestObject from '@/components/PrBestObject'
import PrBestCase from '@/components/PrBestCase'
import PrBestSkin from '@/components/PrBestSkin'
import PrStuffsCnt from '@/components/PrStuffsCnt'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { AxiosError } from "axios";
import { useParams } from 'next/navigation'
import { BACKEND_PATHS, FRONTEND_PATHS } from '@/utilites/urls'
import { useRouter } from 'next/navigation'
import { clearProfileData, setProfileData } from '@/redux/profileReducer'
import api from "@/lib/api";




export default function ProfilePage(): React.ReactNode {

  const ownerId = useAppSelector(state => state.user.userData.id)
  const money_amount = useAppSelector(state => state.user.userData.money_amount)
  const dispatch = useAppDispatch()
  const params = useParams()
  const router = useRouter()
  const userId = params.userid

  function capitalizeFirstLetter(str) {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
  }

  async function getUserPageData() {
    try {
      const response = await api.post(BACKEND_PATHS.profile, {
        id: userId
      });
      dispatch(setProfileData(response.data))
    } catch (err) {
      const error = err as AxiosError;
      console.log(error.status)
      if (error.response?.status === 401) {
        // router.push(FRONTEND_PATHS.home)
      } else if (error.response?.status === 404) {
        // router.push(FRONTEND_PATHS.home)
      } else {
        // router.push(FRONTEND_PATHS.home)
      }
    }

  }

  useEffect(() => {
    return () => {
      dispatch(clearProfileData());
    }
  }, []);

  useEffect(() => {
    getUserPageData()
  }, [userId])




  return (
    <div className={style.profile}>
      <div className={style.profileTitle}>
        <TitleHomePage textKey={ownerId == userId ? 'profile_title' : 'user_title'}></TitleHomePage>
      </div>
      <div className={style.mainUserInfoCnt}>
        {ownerId == userId ?
          <PrOwnerInfo link={'https://steamcommunity.com/id/pinoygamestore'} imgPath='/images/example_user_image.png' nickName={"Marco Polo"} balance={758.18} accountType={"Steam"}></PrOwnerInfo> :
          <PrUserInfo link={'https://steamcommunity.com/id/pinoygamestore'} imgPath='/images/example_user_image.png' nickName={"Marco Polo"} accountType={"Steam"}></PrUserInfo>}
        <div className={style.siteUserInfoCnt}>
          {ownerId == userId ? <PrTradeLinkBlock></PrTradeLinkBlock> : null}
          <PrSiteActivities></PrSiteActivities>
        </div>
      </div>
      <div className={style.prCasesData}>

        <div className={style.prBestObjectCnt}>
          <PrBestObject>
            <PrBestCase imgPath='/images/case_mock.png' caseName={"Весення кура"}></PrBestCase>
          </PrBestObject>
          <PrBestObject>
            <PrBestSkin imgPath='/images/example_profile_knife.png' type='elite' gunModel={"Knife"} gunStyle={"Zakalka"} gunPrice={32.42}></PrBestSkin>
          </PrBestObject>
        </div>
        {/* <PrStuffsCnt></PrStuffsCnt> */}

      </div>
    </div >
  );
}
