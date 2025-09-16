'use client'

import React from 'react'
import { AnimatePresence } from "motion/react"

import ModalCnt from '@/components/ModalCnt'
import RafflesModalWrapped from '@/components/RafflesModalWrapped'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closeRafflesStateModal } from '@/redux/modalReducer'

function RafflesModal(): React.ReactNode {
    const dispatch = useAppDispatch()
    const isVisible = useAppSelector(state => state.modal.rafflesModal.isVisible);

    function close(): void {
        dispatch(closeRafflesStateModal())
    }
    return (

        <AnimatePresence initial={false} mode="wait">
            {isVisible ? (

                <ModalCnt modalKey={"modalRaffles"} onClose={close}>

                    <RafflesModalWrapped close={close} />
                </ModalCnt>

            ) : null}
        </AnimatePresence>
    )
}

export default RafflesModal
