import React from 'react'
import styles from '@/public/styles/basement.module.scss'
import Link from 'next/link'
import FooterContText from '@/components/FooterContText'

function SupportFooterEmail(props: { text: string, textKey: string }): React.ReactNode {
    return (
        <div className={styles.socNetEmailCnt}>
            <div className={styles.socNetCntImg}>
                <Link href={`mailto:${props.text}`} target="_blank" rel="noopener noreferrer">
                    <FooterContText textKey={props.textKey} styleClass={styles.footerContEmail}></FooterContText>
                </Link>
            </div>
        </div>
    )
}

export default SupportFooterEmail
