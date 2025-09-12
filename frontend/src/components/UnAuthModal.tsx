'use client'

import React from 'react'
import { AnimatePresence } from "motion/react"

import ModalCnt from '@/components/ModalCnt'
import UnAuthModalWrapped from '@/components/UnAuthModalWrapped'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closeUnAuthModal } from '@/redux/modalReducer'

function UnAuthModal(): React.ReactNode {
    const dispatch = useAppDispatch()
    const isVisible = useAppSelector(state => state.modal.unAuthModal.isVisible);

    function close(): void {
        dispatch(closeUnAuthModal())
    }
    return (

        <AnimatePresence initial={false} mode="wait">
            {isVisible ? (
                <ModalCnt modalKey={"modalUnAuth"} onClose={close}>
                    <UnAuthModalWrapped close={close} />
                </ModalCnt>
            ) : null}
        </AnimatePresence>
    )
}

export default UnAuthModal
