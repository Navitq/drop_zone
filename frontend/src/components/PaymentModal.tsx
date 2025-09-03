'use client'

import React from 'react'
import { AnimatePresence } from "motion/react"

import ModalCnt from '@/components/ModalCnt'
import PaymentModalWrapped from '@/components/PaymentModalWrapped'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closePaymentModal } from '@/redux/modalReducer'

function PaymentModal(): React.ReactNode {
    const dispatch = useAppDispatch()
    const isVisible = useAppSelector(state => state.modal.paymentModal.isVisible);

    function close(): void {
        dispatch(closePaymentModal())
    }
    return (

        <AnimatePresence initial={false} mode="wait">
            {isVisible ? (

                <ModalCnt modalKey={"modalStCase"} onClose={close}>

                    <PaymentModalWrapped close={close} />
                </ModalCnt>

            ) : null}
        </AnimatePresence>
    )
}

export default PaymentModal
