'use client'

import React from 'react'
import bsmnt from "@/styles/basement.module.scss"
interface TextFooter {
    activePage?: boolean,
    text: string,
    sizeClass: string
}

function FooterText(props: TextFooter) {
    return (
        <div className={`${bsmnt['passiveFooterNavStyle']} ${bsmnt[props.sizeClass]} ${props.activePage ? bsmnt['activeFooterNavStyle'] : ''}`}>
            {props.text}
        </div>
    )
}

export default React.memo(FooterText);
