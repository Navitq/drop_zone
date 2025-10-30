import style from '@/styles/battles.module.scss';
import TitleHomePage from '@/components/TitleHomePage'

export default function BattlesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={style.battles}>
            <div className={style.faqTitleCnt}>
                <TitleHomePage textKey='battles_title'></TitleHomePage>
            </div>
            {children}
        </div>
    );
}
