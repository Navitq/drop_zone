import style from '@/styles/faq.module.scss';
import TitleHomePage from '@/components/TitleHomePage'
import AccordionList from '@/components/AccordionList'

export default function FaqPage() {
    return (
        <div className={style.faq}>
            <div className={style.faqTitleCnt}>
                <TitleHomePage textKey='faq_title'></TitleHomePage>
            </div>
            <div className={style.faqMainCnt}>
                <AccordionList></AccordionList>
            </div>
        </div >
    );
}
