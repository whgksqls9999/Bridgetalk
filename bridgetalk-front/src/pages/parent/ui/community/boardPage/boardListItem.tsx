import { dateToString } from '@/shared';
import { useNavigate } from 'react-router-dom';

interface Props {
  board: Board;
}

interface Board {
  boardId: number;
  boardsTitle: string;
  boardsContent: string;
  likes: number;
  createdAt: string;
  reportsSummary: string;
  reportsKeywords: string[];
  parentsNickname: string;
}

export function BoardListItem({ board }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="boardPage__list-item"
      onClick={() => {
        navigate(`${board.boardId}`);
      }}
    >
      <div className="boardPage__list-item-header">
        <div className="boardPage__list-item-header-first">
          <div className="boardPage__list-item-header-first-title">{board.boardsTitle}</div>
          <div className="boardPage__list-item-header-first-sub">
            <div className="boardPage__list-item-header-first-sub-writer">{board.parentsNickname}</div>
            <div className="line">{`|`}</div>
            <div className="boardPage__list-item-header-first-sub-date">{dateToString(board.createdAt)}</div>
          </div>
        </div>
        <div className="boardPage__list-item-header-second"></div>
      </div>
      <div className="boardPage__list-item-body">
        <div className="boardPage__list-item-body-content">{board.boardsContent.split('</br>').join(' ')}</div>
        <div className="boardPage__list-item-body-keywords">
          {board.reportsKeywords.map((keyword) => (
            <div># {keyword}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
