import * as S from '@/styles/parent/parentReportListRight.style';
import { ParentReportListItem } from '@/pages/parent/ui/parentReportList/parentReportListItem/parentReportListItem';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { useReportStore } from '@/pages/parent/store';
import { useEffect, useMemo, useState } from 'react';

interface Report {
  createdAt: string;
  reportsId: number;
  reportsKeywords: any[];
  reportsSummary: string;
}

export function ParentReportListRight() {
  const { reportList, setReportList, language, childrenList } = useReportStore((state) => ({
    reportList: state.reportList,
    setReportList: state.setReportList,
    language: state.language,
    childrenList: state.childrenList,
  }));

  const reportStore = useReportStore();

  const title = useMemo(
    () => ({
      kor: '아이 속마음 리포트',
      viet: 'Báo cáo',
      ph: 'Ulat',
    }),
    [],
  );

  const [selected, setSelected] = useState(reportList);

  useEffect(() => {
    const tmp = reportList.map((report: any) => {
      const tmpData = report.value.data.filter((it: Report) => it.reportsSummary);
      report.value.data = tmpData;
      return report;
    });

    setSelected(tmp);
  }, [reportList]);

  return (
    <S.Container>
      <div className="title">
        <img src={'/assets/img/letter.svg'} />
        <div>{title[language]}</div>
      </div>
      <div className="content__container">
        <div className="children__wrapper">
          <div className="children">
            {childrenList.map((child: any) => {
              return (
                <button
                  className={`children__child ${
                    selected.some((report: any) => report.UUID === child.userId) ? 'active' : ''
                  }`}
                  onClick={(e: any) => {
                    if ([...e.target.classList].some((it) => it === 'active')) {
                      const tmp = selected.filter((report: any) => report.UUID !== child.userId);
                      setSelected(tmp);
                      return;
                    }

                    const tmp = reportList.filter((report: any) => report.UUID === child.userId).concat(selected);

                    setSelected(tmp);
                  }}
                >
                  {child.userName}
                </button>
              );
            })}
          </div>
        </div>
        <div className="content">
          <div className="list">
            {selected &&
            selected.length > 0 &&
            selected.reduce((prev: any, cur: any) => prev + cur.value.data.length, 0) > 0 ? (
              selected.map((report: any) => {
                if (!report.value) return;

                let reportData = report.value.data;
                reportData = reportData.filter((it: any) => it.reportsSummary);

                const arr = reportData.map((it: any) => {
                  return (
                    <ParentReportListItem
                      key={it.reportsId}
                      reportsId={it.reportsId}
                      reportsSummary={it.reportsSummary}
                      reportsKeywords={it.reportsKeywords}
                      createdAt={it.createdAt}
                      uuid={report.UUID}
                      name={report.name}
                      nickname={report.nickname}
                      dino={report.dino}
                    />
                  );
                });

                // 저장한 리포트 리스트를 최근 순으로 정렬하기
                arr.sort((a: any, b: any) => {
                  return b.props.createdAt - a.props.createdAt;
                });

                return arr;
              })
            ) : (
              <div className="list__noReport">
                <img src={'/assets/img/parent/noReports.svg'} />
              </div>
            )}
          </div>
          <div className="scrollbar"></div>
        </div>
      </div>
    </S.Container>
  );
}
