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
        <Tabs className={style.clientExchanger} selectedIndex={tabIndex} onSelect={(index) => {
            closeItem()
            setTabIndex(index); // обновляем вкладку
            return index; // react-tabs требует вернуть индекс
        }}>
            <TabPanel className={style.exClientPropTab}>
                <div className={style.exClientProp}>
                    {
                        id != "" ? <UpgradeItemCard close={() => { closeItem() }}></UpgradeItemCard> : (
                            <div className={style.exStartBlockPadding}>
                                <ExchangerImage imgUrl={'/images/upgrade_client_ak47.svg'} imgAltKey={"client_ak"} width={239} height={130}></ExchangerImage>
                                <ExchangeTitle titleKey={"take_object"}></ExchangeTitle>
                            </div>
                        )
                    }

                </div>
            </TabPanel>
            <TabPanel>
                <div className={`${style.exClientProp} ${style.exClientMoney}`}>
                    <div className={style.exClientSenceBlck}>
                        <ExchangerImage imgUrl={'/images/upgrade_client_money.svg'} imgAltKey={"client_money"} width={150} height={150}></ExchangerImage>
                        <ExchangeTitle titleKey={"take_balance"}></ExchangeTitle>
                    </div>
                    <ExchangeClientBalance></ExchangeClientBalance>
                </div>
            </TabPanel>

            <TabList className={style.exTabs}>
                <Tab className={style.exTabCnt}>
                    <ExchangeTab textKey={"skins_client_tab"} altKey={"pistol_client_tab"} width={20} height={20} imageUrl={'/images/upgrade_gun.svg'}></ExchangeTab>
                </Tab>
                <Tab>
                    <ExchangeTab radiusClass={"radiusClassTab"} textKey={"balance_client_tab"} altKey={"money_client_tab"} width={20} height={20} imageUrl={'/images/upgrade_money.svg'}></ExchangeTab>
                </Tab>
            </TabList>
        </Tabs>
    )
}

export default ClientExchanger
