package com.ssafy.bridgetalkback.letters.repository;

import com.ssafy.bridgetalkback.letters.domain.Letters;
import com.ssafy.bridgetalkback.parents.domain.Parents;
import com.ssafy.bridgetalkback.reports.domain.Reports;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LettersRepository extends JpaRepository<Letters, Long> {
    // 부모 편지 리스트 출력 by parents
    List<Letters> findAllByParents(Parents parents);

    // 특정 편지 출력 by lettersId
    Optional<Letters> findById(Long lettersId);

    // 특정 편지 출력 by reports
    Optional<Letters> findByReports(Reports reports);

    // 부모 편지 읽은 편지 or 읽지 않은 편지 리스트
    List<Letters> findAllByIsChecked(int isChecked);


}