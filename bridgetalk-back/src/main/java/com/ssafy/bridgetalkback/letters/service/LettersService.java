package com.ssafy.bridgetalkback.letters.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bridgetalkback.chatgpt.config.ChatGptRequestCode;
import com.ssafy.bridgetalkback.files.service.S3FileService;
import com.ssafy.bridgetalkback.global.exception.BaseException;
import com.ssafy.bridgetalkback.global.exception.GlobalErrorCode;
import com.ssafy.bridgetalkback.letters.dto.request.LettersRequestDTO;
import com.ssafy.bridgetalkback.letters.dto.response.TranscriptionDTO;
import com.ssafy.bridgetalkback.letters.dto.response.LettersResponseDTO;
import com.ssafy.bridgetalkback.letters.dto.response.TranslationResultsDTO;
import com.ssafy.bridgetalkback.letters.exception.LettersErrorCode;
import com.ssafy.bridgetalkback.letters.repository.LettersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.transcribe.model.BadRequestException;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class LettersService {

    private final S3FileService s3FileService;
    private final LettersTranscribeService lettersTranscribeService;
    private final AmazonS3 s3Client;
    private final ObjectMapper objectMapper;
    private final LettersRepository lettersRepository;

    @Value("${S3_BUCKET_NAME}")
    private String bucketName;

    @Value("${PAPAGO_CLIENTID}")
    private String clientId;

    @Value("${PAPAGO_CLIENT_SECRET}")
    private String clientSecret;


    /**
     * saveVoiceFile() : s3에 음성파일 저장 메서드
     * @param lettersRequestDTO : 입력된 음성 파일
     * @return String : 저장된 s3 url
     * */
    public String saveVoiceFile(LettersRequestDTO lettersRequestDTO){
        log.info("{ LetterService.saveVoiceFile() } : 부모 음성 편지 s3업로드 메서드");
        return s3FileService.uploadLettersFiles(lettersRequestDTO.lettersFile());
    }

    /**
     * createText() : 음성파일 텍스트화 메서드
     * @param voiceUrl : 입력된 음성 파일
     * @param parentsUserId : 사용자 userId(UUID)
     * @return LettersResponseDTO : 변환된 텍스트 responseDTO
     * */
    public LettersResponseDTO createText(String voiceUrl, String parentsUserId){
        log.info("{ LetterService.createText() } : 텍스트화 메서드");
        String[] vrr = voiceUrl.split("/");
        System.out.println(Arrays.toString(vrr));
        int len = vrr.length;
        String fileName = vrr[len-2]+"/"+vrr[len-1];
        log.info(">> fileName : {}", fileName);

        // stt api 호출
        String extractOriginText = stt(fileName);

        // 번역 api 호출
        // 1. 베트남어(vi) -> 영어(en)
        String extractTranslationTextIntoEn = translation(extractOriginText, "vi", "en");
        // 2. 영어(en) -> 한국어(ko)
        String extractTranslationTextIntoKo = translation(extractOriginText, "en", "ko");

        return LettersResponseDTO.builder().build();
    }

    /**
     * stt() : 음성파일 텍스트화 api 호출 메서드
     * @param fileName : 파일명
     * @return String : 변환된 텍스트
     * */
    public String stt(String fileName) {
        log.info("{ LetterService.stt() } : stt api 호출 메서드");
        String jobName = lettersTranscribeService.transcribe(bucketName, fileName);
        String transcriptFileName = jobName + ".json";
        log.info(">> trancriptionFileName : {}", transcriptFileName);
        String extractText = "";
        try {
            S3Object s3Object = s3Client.getObject(bucketName, transcriptFileName);
            log.info(">> s3Object : {}",s3Object);
            S3ObjectInputStream objectContent = s3Object.getObjectContent();
            // Transcript json -> DTO
            TranscriptionDTO jsonData = objectMapper.readValue(objectContent, TranscriptionDTO.class);
            log.info(">> jsonToObject : {}", jsonData);
            Map<String, Object> results = jsonData.results();
            List<Map<String, String>> transcriptList = (List<Map<String, String>>) results.get("transcripts");
            extractText = transcriptList.get(0).get("transcript");
            log.info(">> extractText : {}", extractText);

            // 스트림 및 객체 닫기
            objectContent.close();
            s3Object.close();
        } catch (NotFoundException ne) {
            log.error(ne.getMessage());
            throw BaseException.type(LettersErrorCode.LETTERS_NOT_FOUND);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw BaseException.type(GlobalErrorCode.INTERNAL_SERVER_ERROR);
        }

        return extractText;
    }

    /**
     * translation() : 번역 api 호출 메서드
     * @param orignal : 원본 텍스트
     * @return String : 번역본 텍스트
     * */
    public String translation(String orignal, String source, String target) {
        log.info("{ LetterService.translation() } : 번역 api 호출 메서드 ");

        String extractTranslationText = "";
        try {
            String text = URLEncoder.encode(orignal, "UTF-8");
            String apiURL = "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation";
            URL url = new URL(apiURL);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("X-NCP-APIGW-API-KEY-ID", clientId);
            con.setRequestProperty("X-NCP-APIGW-API-KEY", clientSecret);
            // post request
            if (source.isEmpty() || target.isEmpty()){
                throw BaseException.type(LettersErrorCode.TRANSLATION_EMPTY_CODE);
            }
            String postParams = "source="+source+"&target="+target+"&text=" + text;
            con.setDoOutput(true);
            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            wr.writeBytes(postParams);
            wr.flush();
            wr.close();
            int responseCode = con.getResponseCode();
            BufferedReader br;
            if (responseCode == 200) { // 정상 호출
                br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            } else {  // 오류 발생
                br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
            }

            String inputLine;
            while ((inputLine = br.readLine()) != null) {
                // JSON 객체 생성
                JSONTokener tokener = new JSONTokener(inputLine);
                JSONObject jsonObject = new JSONObject(tokener);
                log.info(">> jsonObject : {}", jsonObject);
                // extract translated text
                JSONObject message = (JSONObject) jsonObject.get("message");
                JSONObject result = (JSONObject) message.get("result");

                extractTranslationText = result.get("translatedText").toString();
                log.info(">>>> translatedText : {}", extractTranslationText);
            }

            br.close();
        }catch (BadRequestException be){
            log.error(be.getMessage());
            throw BaseException.type(LettersErrorCode.TRANSLATION_BAD_REQUEST);

        }catch (Exception e) {
            log.error(e.getMessage());
            throw BaseException.type(GlobalErrorCode.INTERNAL_SERVER_ERROR);
        }

        return extractTranslationText;
    }



}
