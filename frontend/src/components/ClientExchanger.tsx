'use client'

import React, { useEffect, useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import style from '@/styles/upgrades.module.scss';
import ExchangerImage from '@/components/ExchangerImage'
import ExchangeTitle from '@/components/ExchangeTitle'
import ExchangeClientBalance from '@/components/ExchangeClientBalance'
import ExchangeTab from '@/components/ExchangeTab'
import UpgradeItemCard from '@/components/UpgradeItemCard'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { clearItemToUpgrade } from '@/redux/upgradeReducer'

function ClientExchanger(): React.ReactNode {
    const { id } = useAppSelector(state => state.upgrade.itemData)
    const dispatch = useAppDispatch()
    const [tabIndex, setTabIndex] = useState<number>(0);

    function closeItem() {
        dispatch(clearItemToUpgrade())
    }

    useEffect(() => {
        if (id !== undefined && id != "") {
            setTabIndex(0);
        }
    }, [id])

    return (
        <Tabs className={`${style.clientExchanger} ${style.clientExchangerStyled}`} selectedIndex={tabIndex} onSelect={(index) => {
            closeItem()
            setTabIndex(index); // обновляем вкладку
            return Boolean(index); // !!!!!!!!!!
        }}>
            <TabPanel className={style.exClientPropTab}>
                <div className={style.exClientProp}>
                    {
                        id != "" ? <UpgradeItemCard close={() => { closeItem() }}></UpgradeItemCard> : (
                            <div className={style.exStartBlockPadding}>
                                <div className={style.pcImgBlock}>
                                    <ExchangerImage imgUrl={'/images/upgrade_client_ak47.svg'} imgAltKey={"client_ak"} width={239} height={130}></ExchangerImage>
                                </div>
                                <div className={style.mobileImgBlock}>
                                    <ExchangerImage imgUrl={'/images/upgrade_client_ak47.svg'} imgAltKey={"client_ak"} width={150} height={81}></ExchangerImage>
                                </div>
                                <ExchangeTitle titleKey={"take_object"}></ExchangeTitle>
                            </div>
                        )
                    }

                </div>
            </TabPanel>
            <TabPanel>
                <div className={`${style.exClientProp} ${style.exClientMoney}`}>
                    <div className={style.exClientSenceBlck}>
                        <div className={style.pcImgBlock}>
                            <ExchangerImage imgUrl={'/images/upgrade_client_money.svg'} imgAltKey={"client_money"} width={150} height={150}></ExchangerImage>
                        </div>
                        <div className={style.mobileImgBlock}>
                            <ExchangerImage imgUrl={'/images/upgrade_client_money.svg'} imgAltKey={"client_money"} width={60} height={60}></ExchangerImage>
                        </div>
                        <ExchangeTitle titleKey={"take_balance"}></ExchangeTitle>
                    </div>
                    <ExchangeClientBalance></ExchangeClientBalance>
                </div>
            </TabPanel>

            <TabList className={`${style.exTabs} ${style.exTabsClient}`}>
                <Tab className={style.exTabCnt}>
                    <div className={style.pcImgBlock}>
                        <ExchangeTab textKey={"skins_client_tab"} altKey={"pistol_client_tab"} width={20} height={20} imageUrl={'/images/upgrade_gun.svg'}></ExchangeTab>
                    </div>
                    <div className={style.mobileImgBlock}>
                        <ExchangeTab textKey={"skins_client_tab"} altKey={"pistol_client_tab"} width={10} height={10} imageUrl={'/images/upgrade_gun.svg'}></ExchangeTab>
                    </div>
                </Tab>
                <Tab>
                    <div className={style.pcImgBlock}>
                        <ExchangeTab radiusClass={"radiusClassTab"} textKey={"balance_client_tab"} altKey={"money_client_tab"} width={20} height={20} imageUrl={'/images/upgrade_money.svg'}></ExchangeTab>
                    </div>
                    <div className={style.mobileImgBlock}>
                        <ExchangeTab radiusClass={"radiusClassTab"} textKey={"balance_client_tab"} altKey={"money_client_tab"} width={10} height={10} imageUrl={'/images/upgrade_money.svg'}></ExchangeTab>
                    </div>
                </Tab>
            </TabList>
        </Tabs>
    )
}

export default ClientExchanger
