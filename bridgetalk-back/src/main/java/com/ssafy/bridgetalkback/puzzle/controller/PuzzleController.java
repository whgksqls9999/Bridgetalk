package com.ssafy.bridgetalkback.puzzle.controller;

import com.ssafy.bridgetalkback.global.annotation.ExtractPayload;
import com.ssafy.bridgetalkback.puzzle.dto.request.PuzzleRequestDto;
import com.ssafy.bridgetalkback.puzzle.dto.response.PuzzleListResponseDto;
import com.ssafy.bridgetalkback.puzzle.dto.response.PuzzleResponseDto;
import com.ssafy.bridgetalkback.puzzle.service.PuzzleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Tag(name = "Puzzle", description = "PuzzleController")@RestController
@RequiredArgsConstructor
@RequestMapping("/api/puzzle")
public class PuzzleController {
    private final PuzzleService puzzleService;

    // 사용자 사용x, 관리자만 사용
    @PostMapping
    public ResponseEntity<Void> createPuzzle(@ExtractPayload String userId, @RequestPart(value = "request") PuzzleRequestDto requestDto,
                                             @RequestPart(value = "puzzleFile") MultipartFile multipartFile) {
        log.info("{ PuzzleController } : 퍼즐 등록 진입");
        String imageUrl = puzzleService.savePuzzleFiles(multipartFile);
        puzzleService.createPuzzle(requestDto, imageUrl);
        log.info("{ PuzzleController } : 퍼즐 등록 성공");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{puzzleId}")
    public ResponseEntity<PuzzleResponseDto> puzzleDetail(@ExtractPayload String userId, @PathVariable Long puzzleId) {
        log.info("{ PuzzleController } : 퍼즐 상세조회 진입");
        return ResponseEntity.ok(puzzleService.puzzleDetail(puzzleId));
    }

    @GetMapping("/list/{nation}")
    public ResponseEntity<PuzzleListResponseDto> puzzleList(@ExtractPayload String userId, @PathVariable String nation) {
        log.info("{ PuzzleController } : 퍼즐 리스트 조회 진입");
        return ResponseEntity.ok(puzzleService.puzzleList(nation));
    }
}
