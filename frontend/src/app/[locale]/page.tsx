import style from '@/styles/homePage.module.scss';

// import SeasonCasesBlock from '@/components/SeasonCasesBlock';
import StandartCase from '@/components/StandartCase';
import ActualCases from '@/components/ActualCases'
import BlogerCases from '@/components/BlogerCases'
export default function HomePage() {
  return (
    <div className={style.homePage}>
      {/* <SeasonCasesBlock></SeasonCasesBlock> */}
      <StandartCase imgUrl={'/images/case_mock.png'} caseNameKey={"example"}></StandartCase>


      <ActualCases></ActualCases>
      <BlogerCases></BlogerCases>
    </div >
  );
}
