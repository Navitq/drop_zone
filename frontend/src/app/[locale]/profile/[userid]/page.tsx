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
import { useLocale } from 'next-intl';

interface CaseName {
  en: string;
  ru: string;
}


export default function ProfilePage(): React.ReactNode {

  const ownerId = useAppSelector(state => state.user.userData.id)
  const money_amount_owner = useAppSelector(state => state.user.userData.money_amount)
  const { money_amount, username, avatar_url, provider, best_case, best_skin } = useAppSelector(state => state.profile)
  const dispatch = useAppDispatch()
  const params = useParams()
  const router = useRouter()
  const locale = useLocale()
  const userId = params.userid

  function capitalizeFirstLetter(str: string) {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
  }

  function removeSteamPrefix(str: string) {
    if (str.startsWith("steam_")) {
      return str.slice(6); // длина "steam_" = 6
    }
    return str;
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
          <PrOwnerInfo link={capitalizeFirstLetter(provider) == 'Steam' ? `https://steamcommunity.com/profiles/${removeSteamPrefix(username)}` : capitalizeFirstLetter(provider) == 'Vk' ? `https://vk.com/id${username}` : `${FRONTEND_PATHS.profile}/${userId}`} imgPath={avatar_url} nickName={username} balance={Number(Number(money_amount_owner ?? 0).toFixed(2))} accountType={capitalizeFirstLetter(provider)}></PrOwnerInfo> :
          <PrUserInfo link={capitalizeFirstLetter(provider) == 'Steam' ? `https://steamcommunity.com/profiles/${removeSteamPrefix(username)}` : capitalizeFirstLetter(provider) == 'Vk' ? `https://vk.com/id${username}` : `${FRONTEND_PATHS.profile}/${userId}`} imgPath={avatar_url} nickName={username} accountType={capitalizeFirstLetter(provider)}></PrUserInfo>}
        <div className={style.siteUserInfoCnt}>
          {ownerId == userId ? <PrTradeLinkBlock></PrTradeLinkBlock> : null}
          <PrSiteActivities></PrSiteActivities>
        </div>
      </div>
      <div className={style.prCasesData}>

        <div className={style.prBestObjectCnt}>
          <PrBestObject>
            <PrBestCase imgPath={typeof best_case === "object" && best_case.imgPath ? best_case.imgPath : ''} caseName={typeof best_case === "object" && best_case.name ? best_case.name[locale as keyof CaseName] : ''}></PrBestCase>
          </PrBestObject>
          <PrBestObject>
            <PrBestSkin
              imgPath={typeof best_skin === "object" && best_skin.imgPath ? best_skin.imgPath : ''}
              type={typeof best_skin === "object" && best_skin.type ? best_skin.type : 'usuall'}
              gunModel={typeof best_skin === "object" && best_skin.gunModel ? best_skin.gunModel : ''}
              gunStyle={typeof best_skin === "object" && best_skin.gunStyle ? best_skin.gunStyle : ''}
              gunPrice={typeof best_skin === "object" && best_skin.gunPrice ? best_skin.gunPrice : 0}
            />
          </PrBestObject>
        </div>
        <PrStuffsCnt client_id={Array.isArray(userId) ? userId[0] : userId ?? ''} ownerId={ownerId}></PrStuffsCnt>

      </div>
    </div >
  );
}
