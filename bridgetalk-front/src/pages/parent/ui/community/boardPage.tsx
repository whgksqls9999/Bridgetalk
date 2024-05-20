import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { ArticleList } from './components/articleList';
import * as S from '@/styles/parent/boardPage.style';
import { useBoardStore, useReportStore } from '../../store';
import { getBoardList } from '../../query';
import React from 'react';
import { handleSearchBoard } from '../../model';
import { SearchTypes } from './boardPage/searchTypes';
import { Input } from './boardPage/input';
import { BoardListItem } from './boardPage/boardListItem';
import { Pagenation } from './boardPage/pagenation';
import { useNavigate } from 'react-router-dom';
import { useErrorStore } from '@/shared/store';

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

// infant_and_toddler', 'school', 'puberty'
export function BoardPage() {
  const navigate = useNavigate();

  // Global state
  const language = useReportStore((state) => state.language);
  const boardStore = useBoardStore();
  const setErrorModalState = useErrorStore((state) => state.setErrorModalState);
  // State
  const [page, setPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(0);

  // Ref
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchData(
    _searchWord: string = inputRef.current!.value,
    _language: any = language,
    _page: number = page,
    _boardSearchType: string = boardStore.searchType,
    _sortType: string = boardStore.sortType,
  ) {
    try {
      const data: any = await handleSearchBoard(_searchWord, _language, _page, _boardSearchType, _sortType);

      boardStore.setBoardList(data.data.boardsList);
      setLastPage(data.data.pageInfo.totalPages);
    } catch (err) {
      if (err instanceof Error) {
        setErrorModalState('예기치 못한 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  }

  const latest = useMemo(
    () => ({
      kor: '최신순',
      viet: 'Pinakabago',
      ph: '',
    }),
    [],
  );
  const favor = useMemo(
    () => ({
      kor: '인기순',
      viet: 'Pinakasikat',
      ph: '',
    }),
    [],
  );

  useEffect(() => {
    fetchData('', language, page, boardStore.searchType, boardStore.sortType);
  }, [language, page]);

  useEffect(() => {
    fetchData(inputRef.current!.value, language, 0, boardStore.searchType, boardStore.sortType);
  }, [boardStore.sortType]);

  return (
    <S.Container>
      <div className="boardPage">
        <SearchTypes />
        <Input ref={inputRef} fetchData={fetchData} />
        <div className="boardPage__list">
          {boardStore.boardList && boardStore.boardList.map((board: Board) => <BoardListItem board={board} />)}
        </div>
        <Pagenation page={page} setPage={setPage} list={boardStore.boardList} lastPage={lastPage} />
        <div className="sort">
          <button
            className="sort__latest"
            style={{ color: boardStore.sortType === '최신순' ? 'black' : '' }}
            onClick={() => {
              boardStore.setSortType('최신순');
            }}
          >
            {latest[language]}
          </button>
          <button
            className="sort__popular"
            style={{ color: boardStore.sortType === '좋아요순' ? 'black' : '' }}
            onClick={() => {
              boardStore.setSortType('좋아요순');
            }}
          >
            {favor[language]}
          </button>
        </div>
      </div>
      <button
        className="write"
        onClick={() => {
          navigate('write');
        }}
      >
        <img src={'/assets/img/parent/community/write_solid.svg'} />
      </button>
    </S.Container>
  );
}
