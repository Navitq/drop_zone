'use client'

import React from 'react'
import { AnimatePresence } from "motion/react"

import style from '@/styles/modal.module.scss'

import ModalCnt from '@/components/ModalCnt'
import BuyCaseModalWrapped from '@/components/BuyCaseModalWrapped'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closeRulletCaseModal } from '@/redux/modalReducer'

function BuyCaseModal(): React.ReactNode {
    const dispatch = useAppDispatch()
    const isVisible = useAppSelector(state => state.modal.rulletCaseModal.isVisible);

    function close(): void {
        dispatch(closeRulletCaseModal())
    }
    return (

        <AnimatePresence initial={false} mode="wait">
            {isVisible ? (
                <div className={style.bcmRulletCnt}>
                    <ModalCnt modalKey={"modalBuyCase"} onClose={close}>
                        <BuyCaseModalWrapped close={close} />
                    </ModalCnt>
                </div>
            ) : null}
        </AnimatePresence>
    )
}

export default BuyCaseModal
