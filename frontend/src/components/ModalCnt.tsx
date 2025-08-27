import React from 'react'

import style from '@/styles/modal.module.scss'

interface ModalCntInt {
    children: React.ReactNode;
    onClose: () => void;
}

function ModalCnt({ children, onClose }: ModalCntProps): React.ReactNode {

    return (
        <div onClick={() => { onClose() }} className={style.modalBackground}>
            <div className={style.modalCnt}>
                <div onClick={() => { onClose() }} className={style.modalCntClose}></div>
                {children}
            </div>
        </div>
    )
}

export default ModalCnt
