'use client'

import React from 'react'
import Image from 'next/image'
import style from '@/styles/header.module.scss'

interface LogoCntProps {
    path: string;
    altKey: string;
    cntClass?: string;
    imgClass?: string;
    width: number;
    height: number;
    priority?: boolean;
}

function LogoCnt(props: LogoCntProps) {
    return (
        <div className={props.cntClass ? style[props.cntClass] : ''}>
            <Image priority={props.priority ? props.priority : true} width={props.width} height={props.height} src={props.path} alt={props.altKey} className={props.imgClass ? style[props.imgClass] : ''}></Image>
        </div >
    )
}

export default LogoCnt
