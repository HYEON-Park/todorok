# 변경 이력 (Changelog)

이 프로젝트의 모든 주요 변경 사항을 이 파일에 기록합니다.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를 따르며,
버전 관리는 [유의적 버전(SemVer)](https://semver.org/lang/ko/)을 준수합니다.

## [Unreleased]

- (다음 릴리스에 포함할 변경 사항을 여기에 기록)

## [1.0.0] - 2026-07-15

첫 정식 출시 버전이자 Google Play 출시 준비 완료 버전. (versionCode 1 / versionName 1.0)

### 추가됨 (Added)
- **일기**: 날짜별 일기 작성·수정·삭제, 이모지 지정
- **할 일(ToDo)**: 날짜별 할 일 추가·완료 체크·수정·삭제
- **D-day**: 중요한 날까지 남은 날짜 자동 계산 및 목록 관리
- **달력**: 월간 달력에서 일기·할 일을 한눈에 확인, 날짜별 이모지 표시
- **다크 모드**: 밝은 테마 / 어두운 테마 전환
- **일기 작성 알림**: 매일 지정한 시간에 로컬 알림 제공
- **백업 / 복원**: 전체 데이터를 JSON 파일로 내보내기·가져오기
- **스플래시 화면**: 앱 아이콘을 중앙에 표시하는 인트로 화면 (2초)
- 신규 **앱 아이콘**: 흑백(차콜 배경 + 흰 체크리스트 카드 + 검정 체크 배지) 디자인, 적응형 + 레거시, 전 밀도(mdpi~xxxhdpi)

### 변경됨 (Changed)
- 앱 패키지명(applicationId)을 **`com.todorok.app`으로 통일**
  - 기존에 혼재하던 `com.todoroc.app`(capacitor 설정)과 `com.pocketdiary.app`(안드로이드 빌드) 정리
  - `MainActivity` 패키지 경로 및 `strings.xml`, `capacitor.config.json` 일괄 정리
- **아이콘·스플래시·스토어 아이콘을 통일된 흑백 디자인으로 교체** (기존 안드로이드 기본 아이콘 제거)
- 스플래시 화면을 아이콘만 표시하도록 단순화 (문구 제거)
- 스토어 피처 그래픽: 문구 정리("로컬 저장" 제거) 및 서체를 **Cafe24Ssurround**로 변경
- **favicon**을 앱 아이콘과 통일된 체크리스트 디자인(밝은 배경)으로 교체 (기존 보라 로고 대체)

### 수정됨 (Fixed)
- 릴리스 빌드가 Java 버전 문제로 실패하던 것 해결
  - AGP가 요구하는 Java 17을 Gradle 전용으로 지정(`org.gradle.java.home`), 시스템 Java 11은 유지
  - Capacitor 8 모듈이 Java 21로 설정된 문제를 `subprojects`에서 Java 17로 강제 override
- 릴리스 서명 시 keystore 경로를 찾지 못하던 문제 해결 (`storeFile`을 `android/` 기준으로 해석)

### 빌드 / 배포 (Build & Release)
- **릴리스 서명 설정** 추가: `keystore.properties`(gitignore) 기반, 템플릿 `keystore.properties.example` 제공
- **AAB 빌드 파이프라인** 구성: `npm run build` → `npx cap sync android` → `gradlew bundleRelease`
- **Google Play 스토어 등록 자료** 준비 (`content/store-assets/`)
  - 앱 아이콘 512×512, 피처 그래픽 1024×500
  - 스크린샷 4종(달력·일기·D-day·설정), 비율 1.95:1 (Play 2:1 규정 준수)
  - 스토어 문구(`content/store-listing.md`), 개인정보처리방침 페이지
- 변경 이력 문서(`CHANGELOG.md`) 도입
- **빌드 이식성 개선**: 로컬 JDK 17 절대경로를 커밋 파일에서 분리하여 머신 전용 `~/.gradle/gradle.properties`로 이동 (커밋 파일에는 설정 안내 주석만 유지)
- `.gitignore` 정리: 빌드 산출물(`_apk_compare/`)과 IDE가 생성한 잡폴더 커밋 제외

### 특징 (Notes)
- 모든 데이터는 기기 로컬에만 저장되며 외부 서버로 전송되지 않습니다.
- 회원가입·로그인이 없고, 광고·추적·분석 도구를 포함하지 않습니다.

[Unreleased]: https://example.com/todorok/compare/v1.0.0...HEAD
[1.0.0]: https://example.com/todorok/releases/tag/v1.0.0
