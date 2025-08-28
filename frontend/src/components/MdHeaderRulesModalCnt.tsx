'use client'

import React from 'react'
import { AnimatePresence, motion } from "motion/react"

import ModalCnt from '@/components/ModalCnt'
import MdHeaderRulesModal from '@/components/MdHeaderRulesModal'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closeRulesModal } from '@/redux/modalReducer'

import style from '@/styles/battles.module.scss'

function MdHeaderRulesModalCnt(): React.ReactNode {
    const dispatch = useAppDispatch()
    const isVisible = useAppSelector(state => state.modal.rulesBattleModal.isVisible);

    function close(): void {
        dispatch(closeRulesModal())
    }
    return (
        <AnimatePresence initial={false} mode="wait">
            {isVisible ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    key="modalRules"
                    className={style.wrapper}>
                    <ModalCnt onClose={close}>
                        <MdHeaderRulesModal onClose={close} />
                    </ModalCnt>
                </motion.div>
            ) : null}
        </AnimatePresence>
    )
}
export default MdHeaderRulesModalCnt
