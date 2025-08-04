import React from 'react'
import Image from 'next/image'
import styles from '@/public/styles/basement.module.scss'
import Link from 'next/link'

interface SocialData {
    altKey: string,
    imgPath: string,
    linkTo: string,
}

function SocNetFoot(props: SocialData): React.ReactNode {
    return (
        <div className={styles.socNetCnt}>
            <div className={styles.socNetCntImg}>
                <Link href={props.linkTo} target="_blank" rel="noopener noreferrer">
                    <Image
                        src={props.imgPath}
                        alt={props.altKey}
                        width={16}
                        height={16}
                        className={styles.socNetImg}
                    />
                </Link>
            </div>
        </div>
    )
}

export default SocNetFoot
