'use client'

import React, { useState, useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import ExchangeClientPropierty from '@/components/ExchangeClientPropierty'
import ExchangeServerPropierty from '@/components/ExchangeServerPropierty'

import style from '@/styles/upgrades.module.scss'
import { useTranslations } from 'next-intl'

function ExchangePropierty(): React.ReactNode {
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null) // null = неизвестно
    const [tabIndex, setTabIndex] = useState<number>(0)

    const t = useTranslations("upgrades")

    useEffect(() => {
        const checkScreen = () => setIsDesktop(window.innerWidth < 1439)

        checkScreen()
        window.addEventListener('resize', checkScreen)
        return () => window.removeEventListener('resize', checkScreen)
    }, [])

    // Пока не определили ширину экрана — ничего не рендерим
    if (isDesktop === null) {
        return null
    }

    if (isDesktop) {
        return (
            <Tabs
                forceRenderTabPanel
                selectedIndex={tabIndex}
                onSelect={index => setTabIndex(index)}
            >
                <TabList className={style.epTabList}>
                    <Tab className={style.epTab}>{t('client_items')}</Tab>
                    <Tab className={style.epTab}>{t('server_items')}</Tab>
                </TabList>

                <TabPanel className="epTab">
                    <ExchangeClientPropierty />
                </TabPanel>
                <TabPanel className="epTab">
                    <ExchangeServerPropierty />
                </TabPanel>
            </Tabs>
        )
    }

    return (
        <div className={style.propiety}>
            <ExchangeClientPropierty />
            <ExchangeServerPropierty />
        </div>
    )
}

export default ExchangePropierty
