import React from 'react'
import styles from '@/public/styles/basement.module.scss'
import FooterContText from '@/components/FooterContText'
import SocNetFoot from '@/components/SocNetFoot'
import SupportFooterEmail from './SupportFooterEmail'
import LawPageLink from '@/components/LawPageLink'
import { FRONTEND_PATHS } from '@/utilites/urls'

function OurContacts(): React.ReactNode {
    return (
        <>
            <div>
                <div className={styles.socialNetworksCnt}>
                    <FooterContText textKey='we_in_soc_nets' styleClass={styles.footerContText}></FooterContText>
                    <div className={styles.socialNetworks}>
                        <SocNetFoot linkTo={"https://vk.com/"} altKey="soc_net_vk_alt" imgPath="/images/vk_icon.svg"></SocNetFoot>
                        <SocNetFoot linkTo={"https://telegram.org/"} altKey="soc_net_telegram_alt" imgPath="/images/telegram_icon.svg"></SocNetFoot>
                    </div>
                </div>
                <div className={styles.questionsCnt}>
                    <FooterContText textKey='all_queries' styleClass={styles.footerContText}></FooterContText>
                    <SupportFooterEmail text="support@dropzone.org" textKey={"support_email"}></SupportFooterEmail>
                </div >
            </div>
            <div className={styles.lawPageCnt}>
                <LawPageLink textKey='privacy_policy' path={FRONTEND_PATHS.privacyPolicy} styleClass={'sixteen_sz'}></LawPageLink>
                <LawPageLink textKey='privacy_policy' path={FRONTEND_PATHS.termsOfService} styleClass={'sixteen_sz'}></LawPageLink>
            </div>
        </>
    )
}

export default OurContacts
