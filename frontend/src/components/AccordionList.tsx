import React from 'react'
import style from '@/styles/faq.module.scss'

import * as Accordion from '@radix-ui/react-accordion';
import { useTranslations } from 'next-intl';

function AccordionList() {
    const t = useTranslations("faq")
    return (
        <>
            <Accordion.Root className={style.faqRoot} type="single" collapsible defaultValue="item-1">
                <Accordion.Item value="item-1" className={style.itemBlock}>
                    <Accordion.Trigger className={style.headBlock}><div className={style.headCnt}>{t('t_item_1')}</div></Accordion.Trigger>
                    <Accordion.Content className={style.txtBlock}>{t('txt_item_1')}</Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-2" className={style.itemBlock}>
                    <Accordion.Trigger className={style.headBlock}><div className={style.headCnt}>{t('t_item_2')}</div></Accordion.Trigger>
                    <Accordion.Content className={style.txtBlock}>{t('txt_item_2')}</Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-3" className={style.itemBlock}>
                    <Accordion.Trigger className={style.headBlock}><div className={style.headCnt}>{t('t_item_3')}</div></Accordion.Trigger>
                    <Accordion.Content className={style.txtBlock}>{t('txt_item_3')}</Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-4" className={style.itemBlock}>
                    <Accordion.Trigger className={style.headBlock}><div className={style.headCnt}>{t('t_item_4')}</div></Accordion.Trigger>
                    <Accordion.Content className={style.txtBlock}>{t('txt_item_4')}</Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-5" className={style.itemBlock}>
                    <Accordion.Trigger className={style.headBlock}><div className={style.headCnt}>{t('t_item_5')}</div></Accordion.Trigger>
                    <Accordion.Content className={style.txtBlock}>{t('txt_item_5')}</Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-6" className={style.itemBlock}>
                    <Accordion.Trigger className={style.headBlock}><div className={style.headCnt}>{t('t_item_6')}</div></Accordion.Trigger>
                    <Accordion.Content className={style.txtBlock}>{t('txt_item_6')}</Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-7" className={style.itemBlock}>
                    <Accordion.Trigger className={style.headBlock}><div className={style.headCnt}>{t('t_item_7')}</div></Accordion.Trigger>
                    <Accordion.Content className={style.txtBlock}>{t('txt_item_7')}</Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        </>
    )
}

export default AccordionList
