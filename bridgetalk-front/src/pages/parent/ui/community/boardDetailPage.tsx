import { ReplyList } from './components/replyList';
import * as S from '@/styles/parent/boardDetailPage.style';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBoardStore, useReportStore } from '../../store';
import { deleteBoardLike, getBoardDetail, getBoardLikeCheck, postBoardLike } from '../../query';
import { dateToString } from '@/shared';
import { ReplyRegist } from './boardPage/replyRegist';

interface BoardContent {
  boardsContent: string;
  boardsId: number;
  boardsTitle: string;
  createdAt: string;
  likes: number;
  reportsKeywords: string[];
  reportsSummary: string;
  parentsNickname: string;
}

export function BoardDetailPage() {
  const navigate = useNavigate();

  const params = useParams();

  const boardStore = useBoardStore();
  const language = useReportStore((state) => state.language);
  const [like, setLike] = useState(false);
  const [likeCnt, setLikeCnt] = useState(0);
  const [board, setBoard] = useState<BoardContent>();

  useEffect(() => {
    async function boardLikeCheck() {
      try {
        const res: any = await getBoardLikeCheck(Number(params.boardId));

        setLike(res.data);
      } catch (err) {}
    }
    boardLikeCheck();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBoardDetail(Number(params.boardId), language);

        if (data.status === 200) {
          setBoard(data.data);
          setLikeCnt(data.data.likes);
        }
      } catch (err) {}
    }
    fetchData();
  }, [language]);

  return (
    <S.Container>
      <div className="boardDetailPage">
        <div className="boardDetailPage__header">
          <button
            className="boardDetailPage__header-btn"
            onClick={() => {
              navigate('/parent/board');
            }}
          >
            <img src={'/assets/img/parent/community/back.svg'} />
          </button>
          <div className="boardDetailPage__header-icons">
            <button className="boiardDetailPage__header-icons-share">
              <img src={'/assets/img/parent/community/share.svg'} />
            </button>
            <button
              className="boiardDetailPage__header-icons-like"
              onClick={() => {
                if (like) {
                  deleteBoardLike(Number(params.boardId))
                    .then(() => {
                      setLike(false);
                      setLikeCnt((cnt) => cnt - 1);
                    })
                    .catch((err) => {
                      setLike(true);
                    });
                } else {
                  postBoardLike(Number(params.boardId))
                    .then(() => {
                      setLike(true);
                      setLikeCnt((cnt) => cnt + 1);
                    })
                    .catch((err) => {
                      setLike(false);
                    });
                }
              }}
            >
              <img src={`/assets/img/parent/community/${like ? 'like_solid.png' : 'like_empty.svg'}`} />
            </button>
            <div className="boiardDetailPage__header-icons-like-cnt">{likeCnt}</div>
          </div>
        </div>
        <div className="scroll">
          <div className="boardDetailPage__container">
            <div className="boardDetailPage__container-article">
              <div className="boardDetailPage__container-article-header-title">{board?.boardsTitle}</div>
              <div className="boardDetailPage__container-article-header-sub">
                <p>{board?.parentsNickname}</p>
                <p>{`|`}</p>
                <p>{board && dateToString(board?.createdAt)}</p>
              </div>
              <hr />
              <div className="boardDetailPage__container-article-report">
                {board?.reportsSummary ?? '요약된 리포트 정보가 없습니다.'}
              </div>
              <div className="boardDetailPage__container-article-content">
                {board?.boardsContent.split('</br>').join('\n')}
              </div>
              <div className="boardDetailPage__container-article-keywords">
                {board?.reportsKeywords.map((keyword: string) => (
                  <div className="boardDetailPage__container-article-keywords-keyword"># {keyword}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="boardDetailPage__container-reply">
            <div className="boardDetailPage__container-reply-wrapper">
              <ReplyRegist boardsId={board?.boardsId} />
            </div>
            <ReplyList boardId={board?.boardsId} />
          </div>
        </div>
      </div>
    </S.Container>
  );
}
