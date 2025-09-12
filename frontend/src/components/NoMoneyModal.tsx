'use client'

import React from 'react'
import { AnimatePresence } from "motion/react"

import ModalCnt from '@/components/ModalCnt'
import NoMoneyModalWrapped from '@/components/NoMoneyModalWrapped'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closeNoMoneyModal } from '@/redux/modalReducer'

function NoMoneyModal(): React.ReactNode {
    const dispatch = useAppDispatch()
    const isVisible = useAppSelector(state => state.modal.noMoneyModal.isVisible);

    function close(): void {
        dispatch(closeNoMoneyModal())
    }
    return (

        <AnimatePresence initial={false} mode="wait">
            {isVisible ? (

                <ModalCnt modalKey={"modalNoMoney"} onClose={close}>

                    <NoMoneyModalWrapped close={close} />
                </ModalCnt>

            ) : null}
        </AnimatePresence>
    )
}

export default NoMoneyModal
