import React from 'react';
import style from '@/styles/error.module.scss'
import { useTranslations } from 'next-intl';

interface Error404Props {
    errorNum?: number;
    errorTextKey?: string;
    errorSomeTextKey?: string;
}

const Error404: React.FC<Error404Props> = ({
    errorNum = 404,
    errorTextKey = "page_was_not_found",
    errorSomeTextKey = "smth_go_wrong"
}) => {
    const t = useTranslations("shared")
    return (
        <div className={style.errorPageCnt}>
            <div className={style.errorPage}>
                <h1 className={style.errorPageNumber}>{errorNum}</h1>
                <p className={style.errorPageAddText}>{t(errorTextKey)}</p>
                <small className={style.errorPageErrText}>{t(errorSomeTextKey)}</small>
            </div>
        </div>
    );
};

export default Error404;
