package com.ssafy.bridgetalkback.parentingInfo.service;

import com.ssafy.bridgetalkback.parentingInfo.domain.Age;
import com.ssafy.bridgetalkback.parentingInfo.domain.ParentingInfo;
import com.ssafy.bridgetalkback.parentingInfo.repository.ParentingInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ParentingInfoService {

    private final ParentingInfoRepository parentingInfoRepository;

    @Transactional
    public Long createParentingInfo(String title_kor, String title_viet, String content_kor, String content_viet,
                           String createdAt, Age age) {
        log.info("{ ParentingInfoService } : 육아정보 등록 진입");
        ParentingInfo parentingInfo = ParentingInfo.createParentingInfo(title_kor, title_viet, content_kor,
                content_viet, createdAt, age);
        ParentingInfo savedParentingInfo = parentingInfoRepository.save(parentingInfo);
        log.info("{ ParentingInfoService } : 육아정보 등록 성공");
        return savedParentingInfo.getParentingInfoId();
    }
}