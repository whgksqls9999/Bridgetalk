package com.ssafy.bridgetalkback.reports.controller;

import com.ssafy.bridgetalkback.global.annotation.ExtractPayload;
import com.ssafy.bridgetalkback.letters.service.ClovaSpeechService;
import com.ssafy.bridgetalkback.reports.service.ReportsService;
import com.ssafy.bridgetalkback.reports.service.ReportsUpdateService;
import com.ssafy.bridgetalkback.reports.service.TalkFastApiService;
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
import java.util.concurrent.ExecutionException;

@Slf4j
@Tag(name = "talk", description = "TalkController")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class TalkController {
    private final TalkService talkService;
    private final ReportsService reportsService;
    private final ReportsUpdateService reportsUpdateService;
    private final TalkFastApiService talkFastApiService;
    private final ClovaSpeechService clovaSpeechService;

    @GetMapping("/talk-stop")
    public ResponseEntity<Resource> stopTalk(@ExtractPayload String userId) throws ExecutionException, InterruptedException {
        log.info("{ TalkController } : 대화 종료 진입");
        // reports 생성
//        reportsService.createReports(UUID.fromString(userId));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .body(talkService.stopTalk(UUID.fromString(userId)));
    }

    @GetMapping("/talk-start")
    public ResponseEntity<Resource> startTalk(@ExtractPayload String userId) {
        log.info("{ TalkController } : 대화 시작 진입");
        talkService.createTalk(UUID.fromString(userId));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .body(talkService.startTalk(UUID.fromString(userId)));
    }


    @PatchMapping("/talk-send")
    public ResponseEntity<Resource> sendTalk(@ExtractPayload String userId,
                                             @RequestPart(value = "reportsFile") MultipartFile multipartFile) {
        log.info("{ TalkController } : 대화 하기 진입");

        // 아이 음성 파일 업로드 및 stt
        String fileUrl = reportsService.saveReportsFiles(multipartFile);
//        String talkText = reportsService.createText(fileUrl);
        String talkText = clovaSpeechService.stt(fileUrl);
//        String talkText = talkFastApiService.callFastApi(fileUrl);

        // 변환 텍스트 포함 하도록 DB 원본 레포트 업데이트
//        String reportsText = reportsService.updateOriginContent(UUID.fromString(userId), reportsId, talkText);

        // 변환 텍스트에 대한 답장 생성 및 tts로 변환
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .body(talkService.sendTalk(UUID.fromString(userId), talkText));
    }
}
