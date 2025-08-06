import style from '@/styles/homePage.module.scss';

// import SeasonCasesBlock from '@/components/SeasonCasesBlock';
import StandartCase from '@/components/StandartCase';

export default function HomePage() {
  return (
    <div className={style.homePage}>
      {/* <SeasonCasesBlock></SeasonCasesBlock> */}
      <StandartCase></StandartCase>
    </div >
  );
}
