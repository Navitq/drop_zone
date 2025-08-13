'use client'

import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import style from '@/styles/upgrades.module.scss';
import ExchangerImage from '@/components/ExchangerImage'
import ExchangeTitle from '@/components/ExchangeTitle'
import ExchangeClientBalance from '@/components/ExchangeClientBalance'
import ExchangeTab from '@/components/ExchangeTab'


function ClientExchanger(): React.ReactNode {
    return (
        <Tabs className={style.clientExchanger}>


            <TabPanel className={style.exClientPropTab}>
                <div className={style.exClientProp}>
                    <ExchangerImage imgUrl={'/images/upgrade_client_ak47.svg'} imgAltKey={"client_ak"} width={239} height={130}></ExchangerImage>

                    <ExchangeTitle titleKey={"take_object"}></ExchangeTitle>
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
                    <ExchangeTab titleKey={ } altKey={ } imgPath={ }></ExchangeTab>

                </Tab>
                <Tab>Title 2</Tab>
            </TabList>
        </Tabs>
    )
}

export default ClientExchanger
