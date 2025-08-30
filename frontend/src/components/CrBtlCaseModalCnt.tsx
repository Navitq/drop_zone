'use client'

import React from 'react'
import { AnimatePresence, motion } from "motion/react"

import ModalCnt from '@/components/ModalCnt'
import CrBattleModal from '@/components/CrBattleModal'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closeBattleCreateModal } from '@/redux/modalReducer'


function CrBtlCaseModalCnt(): React.ReactNode {
    const dispatch = useAppDispatch()
    const isVisible = useAppSelector(state => state.modal.createBattleModal.isVisible);

    function close(): void {
        dispatch(closeBattleCreateModal())
    }

    return (
        <AnimatePresence initial={false} mode="wait">
            {isVisible ? (

                <ModalCnt modalKey={"modalCreateBattle"} onClose={close}>
                    <CrBattleModal onClose={close} />
                </ModalCnt>

            ) : null}
        </AnimatePresence>
    )
}

export default CrBtlCaseModalCnt
