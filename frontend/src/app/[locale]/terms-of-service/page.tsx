import React from 'react';
import style from '@/styles/shared.module.scss';
import TitleHomePage from '@/components/TitleHomePage';
import { useTranslations } from 'next-intl';




export default function TermsPage(): React.ReactNode {
    const t = useTranslations('shared')
    return (
        <div className={style.termsBlock}>
            <div className={style.termsTitleBlock}>
                <TitleHomePage textKey={"t_user_agreement"}></TitleHomePage>
            </div>
            <div className={style.termsTextBlock}>

                <div className={style.termsUsllTextItem}>
                    {t('this_agreement_1')}
                </div>
                <div className={style.termsGroupTextItem}>
                    <div className={style.termsUsllTextItem}>
                        {t('this_agreement_2')}&nbsp;<span className={style.termsBoldTextItem}>{t('this_agreement_3')}</span>&nbsp;{t('this_agreement_4')}
                    </div>
                    <div className={style.termsUsllTextItem}>
                        {t('this_agreement_5')}
                    </div>
                    <div className={style.termsUsllTextItem}>
                        {t('this_agreement_6')}
                    </div>
                </div>
                <div className={style.termsHeadTextItem}>
                    {t('this_agreement_7')}
                </div>
                <div className={style.termsGroupTextItem}>
                    <div className={style.termsUsllTitleTextItem}>
                        {t('this_agreement_2')}&nbsp;<span className={style.termsBoldTextItem}>{t('this_agreement_3')}</span>&nbsp;{t('this_agreement_4')}
                    </div>
                </div>
            </div>
        </div>
    );
}
