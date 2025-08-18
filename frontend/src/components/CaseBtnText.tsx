import React from 'react';
import style from '@/styles/cases.module.scss';

interface CaseBtnTextProps {
    text: string;
    onClick?: () => void; // функция без аргументов, ничего не возвращает
}

function CaseBtnText({ text, onClick }: CaseBtnTextProps): React.ReactElement {
    return (
        <div className={style.stCaseBtnCnt}>
            <button className={style.stCaseBtn} onClick={onClick}>
                {text}
            </button>
        </div>
    );
}

export default CaseBtnText;
