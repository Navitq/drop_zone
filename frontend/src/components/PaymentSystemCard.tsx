import React from 'react'
import style from '@/styles/modal.module.scss'
import Image from 'next/image'

// Дописать alt !!!!!!!!!

interface PaymentSystemCardInt {
    imgPath: string;
    paymentSystemName: string;
    paymentSystemId: string
}

function PaymentSystemCard({ imgPath, paymentSystemName }: PaymentSystemCardInt): React.ReactNode {
    return (
        <div className={style.pscCnt}>
            <div  className={style.pscImgCnt}>
                <Image fill src={imgPath} alt={`${paymentSystemName}`}></Image>
            </div>
        </div>
    )
}

export default PaymentSystemCard
