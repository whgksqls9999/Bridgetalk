import { getMyBoardList } from '@/pages/parent/query';
import { useReportStore } from '@/pages/parent/store';
import { dateToString } from '@/shared';
import * as S from '@/styles/parent/parentReportListLeft.style';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Board {
  boardId: number;
  boardsTitle: string;
  boardsContent: string;
  likes: number;
  createdAt: string;
  reportsSummary: string;
  reportsKeywords: string[];
  writer: string;
}

export function ParentReportListLeft() {
  const [boardList, setBoardList] = useState<Board[]>([]);
  const language = useReportStore((state) => state.language);

  const title = useMemo(
    () => ({
      kor: '게시판',
      viet: 'một bảng thông báo',
      ph: 'Forum',
    }),
    [],
  );
  const none = useMemo(
    () => ({
      kor: '작성한 게시글이 없습니다.',
      viet: 'Không có bài viết nào',
      ph: 'Walang mga naisulat na post',
    }),
    [],
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const data: any = await getMyBoardList(language);
        // console.log(data);
        setBoardList(data.data.boardsList);
      } catch (err) {
        // console.log(err);
      }
    }
    fetchData();
  }, [language]);

  return (
    <S.Container>
      <div className="main">
        <div className="main__title" style={{ fontFamily: 'Pretendard-Black' }}>
          {title[language]}
        </div>
        <div className="main__content">
          <div className="main__content-list">
            {boardList && boardList.length > 0 ? (
              boardList.map((board: Board) => <BoardListItem key={board.boardId} board={board} />)
            ) : (
              <div className="main__content-list-none">{none[language]}</div>
            )}
          </div>
          {/* <div className="main__content-input"></div> */}
        </div>
      </div>
    </S.Container>
  );
}

interface BoardListItem {
  board: Board;
}

function BoardListItem({ board }: BoardListItem) {
  const navigate = useNavigate();

  return (
    <div
      className="main__content-list-item"
      onClick={() => {
        navigate(`/parent/board/${board.boardId}`);
      }}
    >
      <div className="flex">
        <div className="main__content-list-item-title">{board.boardsTitle}</div>
        <div className="main__content-list-item-like">
          <img src={'/assets/img/parent/heart.svg'} alt="like" /> {board.likes}
        </div>
      </div>
      <div className="main__content-list-item-body">{board.boardsContent.split('</br>').join(' ')}</div>
      <div className="main__content-list-item-date">{dateToString(board.createdAt)}</div>
    </div>
  );
}
