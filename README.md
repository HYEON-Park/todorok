# todorok

> 하루 일기·할 일·디데이를 달력 한 화면에서 심플하게 관리하는 모바일 앱

---

## 해결하려는 문제와 접근 방식

**문제**  
일기 앱, 투두 앱, 디데이 앱을 따로 쓰면 맥락이 분산되고 결국 안 쓰게 된다.

**접근**  
달력을 허브로 두고 일기·할 일·디데이를 한 화면에 응집시켰다. 기능은 일부러 최소화했고, 서버를 두지 않아 개인 데이터가 외부로 전송되지 않는다.

---

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 웹 개발 서버 (http://localhost:5173)
npm run dev

# Android 빌드 (웹 자산 빌드 후 네이티브 프로젝트에 동기화)
npm run build
npx cap sync android
npx cap open android   # Android Studio에서 빌드
```

**요구사항**: Node.js 18+, Android Studio · JDK 17 (Android 빌드 시)

> AGP가 JDK 17을 요구하는데 시스템 기본이 그보다 낮으면 빌드가 실패한다.
> JDK 경로는 머신마다 다르므로 저장소에 커밋하지 않고, 각자 `~/.gradle/gradle.properties`에
> `org.gradle.java.home=<JDK 17 경로>`를 넣거나 `JAVA_HOME`을 17로 설정한다.

---

## 서비스 전체 흐름

```
앱 실행
└── 스플래시 (2초) + 스토리지 로드
    └── 달력 탭 (기본 화면)
        ├── 날짜 클릭 → 해당 날 할 일 패널 열림
        ├── 달력 일기 제목 클릭 → 일기 상세 / 수정
        ├── + 버튼 → 일기 작성 폼
        └── 하단 탭 전환
            ├── 일기 탭 → 월별 일기 리스트
            ├── 디데이·할 일 탭 → D-Day 카운터 + 전체 할 일
            └── 설정 탭 → 다크모드 · 백업 · 알림
```

---

## 주요 컴포넌트 역할

| 파일 | 역할 |
|---|---|
| `App.jsx` | 전역 상태(탭·폼 모드·다크모드) 관리, Capacitor 백 버튼 처리 |
| `CalendarPage` | 월별 달력 렌더링, 날짜별 일기 이모지·제목 인라인 표시 |
| `Calendar` | 그리드 계산 및 셀 렌더링, 공휴일 강조 |
| `DiaryForm` | 일기 작성·수정 폼, `Intl.Segmenter`로 이모지 단일 문자 보장 |
| `DdayTodoPage` | 디데이 카운터(D-N / D-Day / D+N) + 날짜별 할 일 통합 |
| `DiaryListPage` | 월별 일기 목록, 탭 내 서브 네비게이션 |
| `SettingsPage` | 다크모드, JSON 백업·복원, Capacitor 로컬 알림 설정 |
| `useDiaries / useTodos / useDdays` | 도메인별 CRUD + Capacitor Preferences 영속화 |
| `storage.js` | Capacitor Preferences 우선, LocalStorage 폴백(구버전 마이그레이션) |
| `holidays.js` | 한국 공휴일 하드코딩 (2024~2027), 달력 색상 구분용 |

---

## AI 기능

현재 앱에 AI 기능은 포함되어 있지 않다.  
모든 연산은 클라이언트에서 처리되며 외부 API를 호출하지 않는다.

---

## 구조적으로 고민했던 지점

**스토리지 이중화**  
웹뷰(`localStorage`) 기반에서 네이티브(`Capacitor Preferences`)로 전환할 때 기존 데이터 유실을 막아야 했다. `storage.js`에서 Preferences 우선 조회 후 값이 없으면 localStorage를 읽고 Preferences로 마이그레이션한다. 이후 요청은 Preferences만 사용한다.

**안드로이드 백 버튼**  
화면 스택 없이 탭 기반 SPA로 동작하므로 뒤로가기를 직접 관리해야 했다. `backPressRef`로 렌더마다 최신 상태를 참조하게 하고, 서브 네비게이션 핸들러 → 폼 모드 → 탭 전환 → 앱 종료 순으로 계층적으로 처리했다.

**이모지 단일 문자 보장**  
이모지는 여러 유니코드 코드포인트로 구성되므로 `value[0]`으로 자르면 깨진다. `Intl.Segmenter`로 grapheme cluster 단위의 마지막 이모지만 추출하고, 미지원 환경에서는 스프레드 연산자로 폴백했다.

---

## 샘플 입출력

**달력에서 할 일 관리**
```
날짜 클릭 → 할 일 패널 펼침
항목 입력 후 추가 → 목록에 표시
체크박스 클릭 → 완료 처리 (취소선)
```

**일기 작성**
```
제목 : 오늘 날씨가 좋았다  (최대 50자)
내용 : 한강 산책을 했다...
이모지: 🌿
→ 저장 시 달력 셀에 🌿 · 제목 인라인 표시
```

**디데이**
```
여름 휴가  2026-08-01
→ D-36  (미래, 파란색)
→ D-Day (당일, 강조)
→ D+5   (지남, 회색)
```

**백업 / 복원**
```
설정 > 내보내기 → pocketdiary-backup-2026-06-26.json 다운로드
설정 > 가져오기 → JSON 파일 선택 → 앱 자동 새로고침으로 복원
```

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| UI | React 19, Vite 8 |
| 스타일 | CSS Variables 기반 테마, Cafe24Ssurround 폰트 |
| 네이티브 | Capacitor 8 (App · Preferences · LocalNotifications) |
| 플랫폼 | 웹 브라우저, Android |

---

## License

GPL
