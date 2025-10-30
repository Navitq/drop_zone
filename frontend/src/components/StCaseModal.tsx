'use client'

import React from 'react'
import { AnimatePresence } from "motion/react"

import ModalCnt from '@/components/ModalCnt'
import StCaseModalWrapped from '@/components/StCaseModalWrapped'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closeStCaseModal } from '@/redux/modalReducer'

function StCaseModal(): React.ReactNode {
    const dispatch = useAppDispatch()
    const isVisible = useAppSelector(state => state.modal.stCaseModal.isVisible);

    function close(): void {
        dispatch(closeStCaseModal())
    }
    return (
        <AnimatePresence initial={false} mode="wait">
            {isVisible ? (

                <ModalCnt modalKey={"modalStCase"} onClose={close}>

                    <StCaseModalWrapped />
                </ModalCnt>

            ) : null}
        </AnimatePresence>
    )
}

export default StCaseModal
