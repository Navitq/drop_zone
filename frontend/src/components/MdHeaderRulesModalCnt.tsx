'use client'

import React from 'react'
import { AnimatePresence, motion } from "motion/react"

import ModalCnt from '@/components/ModalCnt'
import MdHeaderRulesModal from '@/components/MdHeaderRulesModal'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closeRulesModal } from '@/redux/modalReducer'

function MdHeaderRulesModalCnt(): React.ReactNode {
    const dispatch = useAppDispatch()
    const isVisible = useAppSelector(state => state.modal.rulesBattleModal.isVisible);

    function close(): void {
        dispatch(closeRulesModal())
    }
    return (
        <AnimatePresence initial={false} mode="wait">
            {isVisible ? (
                <ModalCnt modalKey='modalRules' onClose={close}>
                    <MdHeaderRulesModal onClose={close} />
                </ModalCnt>
            ) : null}
        </AnimatePresence>
    )
}
export default MdHeaderRulesModalCnt
