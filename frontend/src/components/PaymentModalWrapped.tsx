import React from 'react'
import style from "@/styles/modal.module.scss"
import { useTranslations } from 'next-intl'

import SortByCountries from "@/components/SortByCountries"
import PmwMenuItem from "@/components/PmwMenuItem"
import PaymentSystemCard from '@/components/PaymentSystemCard'
import PmwPriceBlock from '@/components/PmwPriceBlock'
import CaseBtnText from '@/components/CaseBtnText'


function PaymentModalWrapped(): React.ReactNode {
    const t = useTranslations('header')

    function setCurrentPrice() {
        return;
    }

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
                <div className={style.pmwPromoCodeBlock}>
                    <div className={style.pmwPromoCode}>
                        <input placeholder={`${t('enter_promo')}`} type="text" className={style.pmwPromoCodeInput} />
                    </div>
                </div>
                <div className={style.pmwPriceBlockChanger}>
                    <div className={style.pmwSumAmount}>
                        <input placeholder={`${t('sum_promo')}, Dc`} type="text" className={style.pmwPromoCodeInput} />
                    </div>
                    <PmwPriceBlock sum={10} setSum={() => { setCurrentPrice() }}></PmwPriceBlock>
                    <PmwPriceBlock sum={100} setSum={() => { setCurrentPrice() }}></PmwPriceBlock>
                    <PmwPriceBlock sum={300} setSum={() => { setCurrentPrice() }}></PmwPriceBlock>
                    <PmwPriceBlock sum={500} setSum={() => { setCurrentPrice() }}></PmwPriceBlock>
                    <PmwPriceBlock sum={1000} setSum={() => { setCurrentPrice() }}></PmwPriceBlock>
                </div>
                <div className={style.pmwPriceBlockChangerBttn}>
                    <div className={style.pmwTopUpAmountBlock}>
                        <div className={style.pmwTopUpTitle}>{`${t('receive_on_balance')}:`}</div>
                        <div className={style.pmwTopUpAmount}>{`${760} Dc`}</div>
                    </div>
                    <CaseBtnText text={t('top_up')}></CaseBtnText>
                </div>
            </div>
        </div>
    )
}

export default PaymentModalWrapped
