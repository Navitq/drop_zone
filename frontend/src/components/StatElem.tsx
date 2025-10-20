"use client"

import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl';
import FooterText from '@/components/FooterText'
import styles from '@/styles/basement.module.scss'

interface StatElemProps {
    message: number | null,
    imgPath: string,
    titleKey: string,
    imgAltKey: string
}

function StatElem(props: StatElemProps): React.ReactNode {
    function addCommas(num: number): string {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const t = useTranslations('homePage');
    return (
        <div className={styles.statElem}>
            <div className={styles.statElemImgCnt}>
                <Image width={30} height={30} src={`${props.imgPath}`} alt={t(`${props.imgAltKey}`)} />
            </div>
            <div className={styles.statElemTextCnt}>
                <FooterText text={t(props.titleKey) + ":"} sizeClass={'fifteen_sz'}></FooterText>
                <div className={styles.statElemAmount}>{props.message ? addCommas(props.message) : addCommas(0)}</div>
            </div>
        </div>
    )
}

export default React.memo(StatElem)
