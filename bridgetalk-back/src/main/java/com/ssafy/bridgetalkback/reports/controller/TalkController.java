package com.ssafy.bridgetalkback.reports.controller;

import com.ssafy.bridgetalkback.global.annotation.ExtractPayload;
import com.ssafy.bridgetalkback.reports.service.ReportsService;
import com.ssafy.bridgetalkback.reports.service.TalkService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Slf4j
@Tag(name = "talk", description = "TalkController")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class TalkController {
    private final TalkService talkService;
    private final ReportsService reportsService;

    @GetMapping("/talk-stop")
    public ResponseEntity<Resource> stopTalk(@ExtractPayload String userId) {
        log.info("{ TalkController } : 대화 종료 진입");
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .body(talkService.stopTalk(UUID.fromString(userId)));
    }

    @GetMapping("/talk-start")
    public ResponseEntity<Resource> startTalk(@ExtractPayload String userId) {
        log.info("{ TalkController } : 대화 시작 진입");
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .body(talkService.startTalk(UUID.fromString(userId)));
    }


    @PatchMapping("/talk-send/{reportsId}")
    public ResponseEntity<Resource> sendTalk(@ExtractPayload String userId, @PathVariable Long reportsId,
                                             @RequestPart(value = "reportsFile") MultipartFile multipartFile) {
        log.info("{ TalkController } : 대화 하기 진입");

        // 아이 음성 파일 업로드 및 stt
        String talkText = reportsService.createText(multipartFile);

        // 변환 텍스트 포함 하도록 DB 원본 레포트 업데이트
        String reportsText = reportsService.updateOriginContent(UUID.fromString(userId), reportsId, talkText);

        // 변환 텍스트에 대한 답장 생성 및 tts로 변환
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .body(talkService.sendTalk(UUID.fromString(userId), reportsText));
    }
}