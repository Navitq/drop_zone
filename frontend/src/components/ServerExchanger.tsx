"use client";

import React, { useState } from "react";

import style from "@/styles/upgrades.module.scss";
import ExchangerImage from "@/components/ExchangerImage";
import ExchangeTitle from "@/components/ExchangeTitle";
import ExchangeTabServer from "@/components/ExchangeTabServer";

import UpgradeItemCardServet from '@/components/UpgradeItemCardServet'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { clearServerItemToUpgrade, setPriceСoefficient } from '@/redux/upgradeReducer'

const ServerExchanger: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0); // 1 — скины, 2 — баланс

  const { id } = useAppSelector(state => state.upgrade.itemServerData)
  const dispatch = useAppDispatch()

  function closeItem() {
    dispatch(clearServerItemToUpgrade())
  }

  const addActiveClass = (tabNumber: number) => {
    setActiveTab(tabNumber);
    dispatch(setPriceСoefficient(tabNumber))
  };

  return (
    <div className={`${style.clientExchanger} ${style.serverExchangerTop}`}>
      <div className={`${style.exTabs} ${style.serverExchanger}`}>
        <div
          className={`${style.exTabCnt} ${activeTab === -1 ? "react-tabs__tab--selected" : ""
            }`}
          onClick={() => addActiveClass(-1)}
        >
          <ExchangeTabServer multiply={"..."} />
        </div>
        <div
          className={`${style.exTabCnt} ${activeTab === 1.2 ? "react-tabs__tab--selected" : ""
            }`}
          onClick={() => addActiveClass(1.2)}
        >
          <ExchangeTabServer multiply={1.2} />
        </div>
        <div
          className={`${style.exTabCnt} ${activeTab === 2 ? "react-tabs__tab--selected" : ""
            }`}
          onClick={() => addActiveClass(2)}
        >
          <ExchangeTabServer multiply={2} />
        </div>
        <div
          className={`${style.exTabCnt} ${activeTab === 3 ? "react-tabs__tab--selected" : ""
            }`}
          onClick={() => addActiveClass(3)}
        >
          <ExchangeTabServer multiply={3} />
        </div>
        <div
          className={`${style.exTabCnt} ${activeTab === 4 ? "react-tabs__tab--selected" : ""
            }`}
          onClick={() => addActiveClass(4)}
        >
          <ExchangeTabServer multiply={4} />
        </div>
        <div
          className={`${style.exTabCnt} ${activeTab === 5 ? "react-tabs__tab--selected" : ""
            }`}
          onClick={() => addActiveClass(5)}
        >
          <ExchangeTabServer multiply={5} />
        </div>
        <div
          className={`${style.exTabCnt} ${activeTab === 10 ? "react-tabs__tab--selected" : ""
            }`}
          onClick={() => addActiveClass(10)}
        >
          <ExchangeTabServer multiply={10} />
        </div>
      </div>

      <div className={style.exClientPropTab}>
        <div className={style.exClientProp}>


          {
            id != "" ? <UpgradeItemCardServet close={() => { closeItem() }}></UpgradeItemCardServet> : (
              <div className={style.exStartBlockPadding}>
                <div className={style.pcImgBlock}>
                  <ExchangerImage
                    imgUrl="/images/server_ak_47.svg"
                    imgAltKey="server_ak"
                    width={205}
                    height={115}
                  />
                </div>
                <div className={style.mobileImgBlock}>
                  <ExchangerImage
                    imgUrl="/images/server_ak_47.svg"
                    imgAltKey="server_ak"
                    width={140}
                    height={78}
                  />
                </div>
                <ExchangeTitle titleKey="get_object" />
              </div>
            )
          }

        </div>
      </div>
    </div>
  );
};

export default ServerExchanger;
