# 투두록 (Todorok)

일기, 투두, D-day를 하나의 앱에서 심플하게 관리하는 데일리 루틴 앱입니다.  
React + Capacitor 기반으로 웹과 Android 네이티브 앱을 모두 지원합니다.

---

## 주요 기능

| 탭 | 기능 |
|----|------|
| 달력 | 월별 달력 + 날짜별 투두 관리 + 일기 작성 |
| 일기 | 일기 목록 조회 / 상세보기 / 수정 / 삭제 |
| D-day / Todo | D-day 카운트다운 + 전체 미완료 투두 모아보기 |
| 설정 | 다크모드 / 데이터 백업·복원 / 일일 알림 |

- 모든 데이터는 기기 로컬(localStorage)에 저장 — 서버 없음
- 다크모드 지원
- 한국 공휴일 자동 표시 (2024~2027)
- JSON 파일로 데이터 백업 및 복원
- 매일 지정 시간에 일기 작성 알림 (Android)

---

## 기술 스택

### Frontend
- **React** 19
- **Vite** 8
- **CSS Variables** 기반 테마 시스템
- **Cafe24Ssurround** 한글 폰트

### Mobile
- **Capacitor** 8 — JavaScript ↔ 네이티브 브릿지
- **@capacitor/android** — Android 통합
- **@capacitor/app** — 뒤로가기 등 앱 생명주기
- **@capacitor/local-notifications** — 로컬 알림

---

## 프로젝트 구조

```
src/
├── App.jsx                  # 루트 컴포넌트 (전역 상태 + 라우팅)
├── main.jsx                 # React 마운트 진입점
├── index.css                # 전역 스타일 + CSS 변수 테마
│
├── components/
│   ├── Splash.jsx           # 시작 스플래시 화면
│   ├── BottomNav.jsx        # 하단 탭 네비게이션
│   ├── CalendarPage.jsx     # 달력 탭
│   ├── Calendar.jsx         # 달력 그리드
│   ├── TodoSection.jsx      # 날짜별 투두 리스트
│   ├── DiaryForm.jsx        # 일기 작성 / 수정 폼
│   ├── DiaryModal.jsx       # 일기 조회 모달
│   ├── DiaryListPage.jsx    # 일기 탭
│   ├── DdayTodoPage.jsx     # D-day + Todo 탭
│   ├── SettingsPage.jsx     # 설정 탭
│   └── MonthYearPicker.jsx  # 년 / 월 선택 팝업
│
├── hooks/
│   ├── useDiaries.js        # 일기 상태 관리 (CRUD + localStorage)
│   ├── useTodos.js          # 투두 상태 관리 (CRUD + localStorage)
│   └── useDdays.js          # D-day 상태 관리 (CRUD + localStorage)
│
└── utils/
    └── holidays.js          # 한국 공휴일 데이터
```

---

## 데이터 구조 (localStorage)

| 키 | 형태 | 설명 |
|----|------|------|
| `todorok-entries` | `{ "YYYY-MM-DD": { title, content, emoji } }` | 일기 |
| `todorok-todos` | `{ "YYYY-MM-DD": [{ id, text, done }] }` | 투두 |
| `todorok-ddays` | `[{ id, title, date }]` | D-day |
| `todorok-darkmode` | `"true" / "false"` | 다크모드 설정 |
| `todorok-notification` | `{ enabled, hour, minute }` | 알림 시간 설정 |

---

## 시작하기

### 웹 개발 서버

```bash
npm install
npm run dev
# http://localhost:5173
```

### Android 앱 빌드

```bash
npm run build         # dist/ 생성
npx cap sync          # Android에 웹 빌드 동기화
npx cap open android  # Android Studio 열기
```

---

## 스크린샷

> 추후 추가 예정

---

## License

MIT
