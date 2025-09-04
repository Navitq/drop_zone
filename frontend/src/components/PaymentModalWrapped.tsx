import React from 'react'
import style from "@/styles/modal.module.scss"
import { useTranslations } from 'next-intl'

import SortByCountries from "@/components/SortByCountries"
import PmwMenuItem from "@/components/PmwMenuItem"
import PaymentSystemCard from '@/components/PaymentSystemCard'

import Image from 'next/image'


function PaymentModalWrapped(): React.ReactNode {
    const t = useTranslations('header')
    return (
        <div className={style.pmwCnt} onClick={(e) => { e.stopPropagation() }}>
            <div className={style.pmwHeaderBlock}>
                <div className={style.pmwTitleBlock}>
                    <div className={style.pmwTitle}>{t('balance_replenishment')}</div>
                    <div className={style.pmwExchangeRate}>
                        {`${"1"} Dc ≈ ${"1"}`}
                    </div>
                </div>
                <div className={style.pmwSeparatorCnt}>
                    <Image alt={t('divider_alt')} src={"/images/payment_divider.svg"} width={377} height={1}></Image>
                </div>
                <div className={style.pmwNavigation}>
                    <SortByCountries></SortByCountries>
                    <PmwMenuItem text={t('all_menu')}></PmwMenuItem>
                    <PmwMenuItem text={t('card_menu')} alt={t('alt_card_menu')} imgPath={"/images/cards_payment.svg"}></PmwMenuItem>
                    <PmwMenuItem text={t('wallet_menu')} alt={t('alt_wallet_menu')} imgPath={"/images/wallet_payment.svg"}></PmwMenuItem>
                    <PmwMenuItem text={t('cryptocurrency_menu')} alt={t('alt_cryptocurrency_menu')} imgPath={"/images/cryptocurrency_payment.svg"}></PmwMenuItem>
                    <PmwMenuItem text={t('sell_skin_menu')} alt={t('alt_sell_skin')} imgPath={"/images/gun_payment.svg"}></PmwMenuItem>
                </div>
            </div>
            <div className={style.pmwPaymentsSystem}>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard><PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
                <PaymentSystemCard paymentSystemName="1123123123" imgPath="/images/example_payment_system.png" paymentSystemId="231"></PaymentSystemCard>
            </div>
            <div className={style.pmwPaymentData}>

            </div>
        </div>
    )
}

export default PaymentModalWrapped
