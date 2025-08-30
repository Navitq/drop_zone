'use client'

import React from 'react'
import { motion } from "motion/react"

import style from '@/styles/modal.module.scss'

interface ModalCntInt {
    children: React.ReactNode;
    onClose: () => void;
    modalKey: string
}

function ModalCnt({ children, onClose, modalKey }: ModalCntInt): React.ReactNode {



    return (
        <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            key={modalKey}
            onClick={() => { onClose() }}
            className={style.modalBackground}
        >

            <div className={style.modalCnt}>
                <div onClick={() => { onClose() }} className={style.modalCntClose}></div>
                {children}
            </div>

        </motion.div>
    )
}

export default ModalCnt
