package com.ssafy.bridgetalkback.boards.controller;

import com.ssafy.bridgetalkback.boards.dto.response.BoardsListResponseDto;
import com.ssafy.bridgetalkback.boards.service.BoardsLikeService;
import com.ssafy.bridgetalkback.global.Language;
import com.ssafy.bridgetalkback.boards.dto.request.BoardsRequestDto;
import com.ssafy.bridgetalkback.boards.dto.request.BoardsUpdateRequestDto;
import com.ssafy.bridgetalkback.boards.dto.response.BoardsResponseDto;
import com.ssafy.bridgetalkback.boards.service.BoardsService;
import com.ssafy.bridgetalkback.boards.dto.response.CustomBoardsListResponseDto;
import com.ssafy.bridgetalkback.boards.query.dto.BoardsListDto;
import com.ssafy.bridgetalkback.boards.service.BoardsListService;
import com.ssafy.bridgetalkback.global.annotation.ExtractPayload;
import com.ssafy.bridgetalkback.notification.domain.NotificationType;
import com.ssafy.bridgetalkback.notification.dto.request.NotificationRequestDto;
import com.ssafy.bridgetalkback.notification.service.SseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@Tag(name = "Boards", description = "BoardsController")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boards")
public class BoardsController {

    private final BoardsService boardsService;
    private final BoardsListService boardsListService;
    private final BoardsLikeService boardLikeService;
    private final SseService sseService;

    @PostMapping
    public ResponseEntity<BoardsResponseDto> createBoards(
            @ExtractPayload String userId,
            @RequestBody BoardsRequestDto boardsRequestDto
    ) {
        log.info("{ BoardsController } : Boards 생성 진입");
        BoardsResponseDto boardsResponseDto = boardsService.createBoards(UUID.fromString(userId), boardsRequestDto);
        log.info("{ BoardsController } : Boards 생성 성공");
        return ResponseEntity.status(HttpStatus.CREATED).body(boardsResponseDto);
    }

    @PatchMapping("/{boardsId}")
    public ResponseEntity<BoardsResponseDto> updateBoards(
            @ExtractPayload String userId,
            @PathVariable Long boardsId,
            @RequestBody BoardsUpdateRequestDto boardsUpdateRequestDto
    ) {
        log.info("{ BoardsController } : Boards 수정 진입");
        BoardsResponseDto boardsResponseDto = boardsService.updateBoards(UUID.fromString(userId), boardsId, boardsUpdateRequestDto);
        log.info("{ BoardsController } : Boards 수정 성공");
        return ResponseEntity.ok(boardsResponseDto);
    }

    @DeleteMapping("/{boardsId}")
    public ResponseEntity<?> deleteBoards(@ExtractPayload String userId, @PathVariable Long boardsId) {
        log.info("{ BoardsController } : Boards 삭제 진입");
        boardsService.deleteBoards(UUID.fromString(userId), boardsId);
        log.info("{ BoardsController } : Boards 삭제 성공");
        return ResponseEntity.ok().build();
    }


    @GetMapping("read/{boardId}/{language}")
    public ResponseEntity<BoardsResponseDto> getParentingInfoDetail(@PathVariable Long boardId, @PathVariable Language language) {
        log.info("{ BoardsController } : 게시글 상세조회 진입");
        return ResponseEntity.ok(boardsService.getBoardsDetail(boardId, language));
    }

    @GetMapping("read/{language}")
    public ResponseEntity<CustomBoardsListResponseDto<BoardsListDto>> getCustomBoardsList(@PathVariable Language language,
                                                                                          @RequestParam(value = "page", defaultValue = "0", required = false) int page,
                                                                                          @RequestParam(value = "searchType", required = false, defaultValue = "title_and_content_and_reports") String searchType,
                                                                                          @RequestParam(value = "searchWord", required = false, defaultValue = "") String searchWord,
                                                                                          @RequestParam(value = "sort", required = false, defaultValue = "최신순") String sort) {
        log.info("{ BoardsController } : 게시글 리스트조회 진입 (검색조건, 검색키워드, 정렬 유형) - " + searchType + "," + searchWord + "," + sort);
        return ResponseEntity.ok(boardsListService.getCustomBoardsList(page, searchType, searchWord, sort, language));
    }

    @PostMapping("/likes/{boardsId}")
    public ResponseEntity<Void> register(@ExtractPayload String parentsId, @PathVariable Long boardsId) {
        log.info("{ BoardController } : 좋아요 등록 진입");
        boardLikeService.register(UUID.fromString(parentsId), boardsId);

        log.info(">>>> (부모에게) SSE 알림 전송 시작");
        NotificationRequestDto notificationRequestDto = NotificationRequestDto.builder()
                .receiverUuid(parentsId)
                .url("https://bridgetalk.co.kr/parent/board/" + boardsId)
                .content(NotificationType.POST_LIKE_REGISTER.getWord())
                .notificationType(NotificationType.POST_LIKE_REGISTER)
                .build();
        sseService.send(notificationRequestDto);
        log.info(">>>> (부모에게) SSE 알림 전송 완료");
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/likes/{boardsId}")
    public ResponseEntity<Void> cancel(@ExtractPayload String parentsId, @PathVariable Long boardsId) {
        boardLikeService.cancel(UUID.fromString(parentsId), boardsId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/likes/{boardsId}")
    public ResponseEntity<Boolean> checkLike(@ExtractPayload String parentsId, @PathVariable Long boardsId) {
        boolean result = boardLikeService.checkLike(UUID.fromString(parentsId), boardsId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("my/{language}")
    public ResponseEntity<BoardsListResponseDto> getMyBoardsList(@ExtractPayload String parentsId,
                                                                 @PathVariable Language language,
                                                                 @RequestParam(value = "sort", required = false, defaultValue = "최신순") String sort) {
        log.info("{ BoardsController } : 내가 쓴 글 리스트조회 진입");
        return ResponseEntity.ok(boardsListService.getMyBoardsList(UUID.fromString(parentsId), sort, language));
    }
}
