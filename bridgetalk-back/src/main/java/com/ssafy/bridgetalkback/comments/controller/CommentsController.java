package com.ssafy.bridgetalkback.comments.controller;

import com.ssafy.bridgetalkback.comments.dto.request.CommentsRequestDto;
import com.ssafy.bridgetalkback.comments.dto.request.CommentsUpdateRequestDto;
import com.ssafy.bridgetalkback.comments.dto.response.CommentsListResponseDto;
import com.ssafy.bridgetalkback.comments.dto.response.CommentsResponseDto;
import com.ssafy.bridgetalkback.comments.dto.response.CustomCommentsListResponseDto;
import com.ssafy.bridgetalkback.comments.query.dto.CommentsListDto;
import com.ssafy.bridgetalkback.comments.service.CommentsLikeService;
import com.ssafy.bridgetalkback.comments.service.CommentsListService;
import com.ssafy.bridgetalkback.comments.service.CommentsService;
import com.ssafy.bridgetalkback.global.Language;
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
@Tag(name = "Comments", description = "CommentsController")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentsController {

    private final CommentsService commentsService;
    private final SseService sseService;
    private final CommentsListService commentsListService;
    private final CommentsLikeService commentsLikeService;

    @PostMapping
    public ResponseEntity<CommentsResponseDto> createComments(
            @ExtractPayload String userId,
            @RequestBody CommentsRequestDto commentsRequestDto
    ) {
        log.info("{ CommentsController } : Comments 생성 진입");
        CommentsResponseDto commentsResponseDto = commentsService.createComments(UUID.fromString(userId), commentsRequestDto);
        log.info("{ CommentsController } : Comments 생성 성공");

        log.info(">>>> (부모에게) SSE 알림 전송 시작");
        NotificationRequestDto notificationRequestDto = NotificationRequestDto.builder()
                .receiverUuid(commentsResponseDto.parentsUuid())
                .url("https://bridgetalk.co.kr/api/boards/"
                        + commentsRequestDto.boardsId()
                        + "/"
                        + "kor"
                )
                .content(NotificationType.POST_COMMENTS_REGISTER.getWord())
                .notificationType(NotificationType.POST_COMMENTS_REGISTER)
                .build();
        sseService.send(notificationRequestDto);
        log.info(">>>> (부모에게) SSE 알림 전송 완료");
        return ResponseEntity.status(HttpStatus.CREATED).body(commentsResponseDto);
    }

    @PatchMapping("/{commentsId}")
    public ResponseEntity<CommentsResponseDto> updateComments(
            @ExtractPayload String userId,
            @PathVariable Long commentsId,
            @RequestBody CommentsUpdateRequestDto commentsUpdateRequestDto
    ) {
        log.info("{ CommentsController } : Comments 수정 진입");
        CommentsResponseDto commentsResponseDto = commentsService.updateComments(UUID.fromString(userId), commentsId, commentsUpdateRequestDto);
        log.info("{ CommentsController } : Comments 수정 성공");
        return ResponseEntity.ok(commentsResponseDto);
    }

    @DeleteMapping("/{commentsId}")
    public ResponseEntity<?> deleteComments(@ExtractPayload String userId, @PathVariable Long commentsId){
        log.info("{ CommentsController } : Comments 삭제 진입");
        commentsService.deleteComments(UUID.fromString(userId), commentsId);
        log.info("{ CommentsController } : Comments 삭제 성공");
        return ResponseEntity.ok().build();
    }

    @GetMapping("read/{boardId}/{language}")
    public ResponseEntity<CustomCommentsListResponseDto<CommentsListDto>> getCustomCommentsList(@PathVariable Long boardId,
                                                                                                @PathVariable Language language,
                                                                                                @RequestParam(value = "page", defaultValue = "0", required = false) int page,
                                                                                                @RequestParam(value = "sort", required = false, defaultValue = "최신순") String sort) {
        log.info("{ CommentController } : Comments 리스트조회 진입 (정렬 유형) - " + sort);
        return ResponseEntity.ok(commentsListService.getCustomCommentsList(boardId, page, sort, language));
    }

    @PostMapping("/likes/{commentsId}")
    public ResponseEntity<Void> register(@ExtractPayload String parentsId, @PathVariable Long commentsId) {
        log.info("{ CommentController } : 좋아요 등록 진입");
        commentsLikeService.register(UUID.fromString(parentsId), commentsId);

        log.info(">>>> (부모에게) SSE 알림 전송 시작");
        NotificationRequestDto notificationRequestDto = NotificationRequestDto.builder()
                .receiverUuid(parentsId)
                .url("https://bridgetalk.co.kr/parent/board/" + commentsId)
                .content(NotificationType.POST_COMMENTS_REGISTER.getWord())
                .notificationType(NotificationType.POST_COMMENTS_REGISTER)
                .build();
        sseService.send(notificationRequestDto);
        log.info(">>>> (부모에게) SSE 알림 전송 완료");
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/likes/{commentsId}")
    public ResponseEntity<Void> cancel(@ExtractPayload String parentsId, @PathVariable Long commentsId) {
        commentsLikeService.cancel(UUID.fromString(parentsId), commentsId);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/likes/{commentsId}")
    public ResponseEntity<Boolean> checkLike(@ExtractPayload String parentsId, @PathVariable Long commentsId) {
        boolean result = commentsLikeService.checkLike(UUID.fromString(parentsId), commentsId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("read/reports/{reportsId}/{language}")
    public ResponseEntity<CommentsListResponseDto> getReportsCommentsList(@PathVariable Long reportsId,
                                                                          @PathVariable Language language) {
        log.info("{ CommentController } : Reports Comments 리스트조회 진입");
        return ResponseEntity.ok(commentsListService.getReportsCommentsList(reportsId, language));
    }
}
