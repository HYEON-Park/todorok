# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


투두록 (Todorok) 프로젝트 상세 분석

1. 프로젝트 개요

┌───────────┬───────────────────────────────────────┐
│   항목    │                 내용                  │
├───────────┼───────────────────────────────────────┤
│ 앱명      │ 투두록 (Todorok)                      │
├───────────┼───────────────────────────────────────┤
│ 앱 ID     │ com.todoroc.app                       │
├───────────┼───────────────────────────────────────┤
│ 버전      │ 0.0.0                                 │
├───────────┼───────────────────────────────────────┤
│ 타입      │ React + Capacitor 하이브리드 앱       │
├───────────┼───────────────────────────────────────┤
│ 배포 대상 │ 웹 브라우저 + Android 네이티브        │
├───────────┼───────────────────────────────────────┤
│ GitHub    │ https://github.com/HYEON-Park/todorok │
└───────────┴───────────────────────────────────────┘

▎ 일기, 투두, D-day를 하나의 앱에서 관리하는 서버리스 로컬 앱. 모든 데이터는 기기의 localStorage에 저장됩니다.

---
2. 기술 스택 (Skill Inventory)

프론트엔드

┌─────────────────┬────────┬──────────────────────┐
│      기술       │  버전  │         용도         │
├─────────────────┼────────┼──────────────────────┤
│ React           │ 19.2.6 │ UI 렌더링, 상태 관리 │
├─────────────────┼────────┼──────────────────────┤
│ Vite            │ 8.0.12 │ 번들러, 개발 서버    │
├─────────────────┼────────┼──────────────────────┤
│ CSS Variables   │ -      │ 다크모드 테마 시스템 │
├─────────────────┼────────┼──────────────────────┤
│ Cafe24Ssurround │ v2.0   │ 한글 폰트            │
└─────────────────┴────────┴──────────────────────┘

모바일 (Capacitor)

┌────────────────────────────────┬───────┬───────────────────────────┐
│             패키지             │ 버전  │           용도            │
├────────────────────────────────┼───────┼───────────────────────────┤
│ @capacitor/core                │ 8.3.4 │ JS-네이티브 브릿지        │
├────────────────────────────────┼───────┼───────────────────────────┤
│ @capacitor/android             │ 8.3.4 │ Android 통합              │
├────────────────────────────────┼───────┼───────────────────────────┤
│ @capacitor/app                 │ 8.1.0 │ 앱 생명주기 (뒤로가기 등) │
├────────────────────────────────┼───────┼───────────────────────────┤
│ @capacitor/local-notifications │ 8.2.0 │ 일일 알림 스케줄          │
└────────────────────────────────┴───────┴───────────────────────────┘

개발 도구

┌──────────────────────┬──────────────┐
│         도구         │     용도     │
├──────────────────────┼──────────────┤
│ ESLint 10            │ 코드 품질    │
├──────────────────────┼──────────────┤
│ @vitejs/plugin-react │ Fast Refresh │
└──────────────────────┴──────────────┘

---
3. 프로젝트 구조

C:\D\todorok\
├── src/
│   ├── main.jsx              # React 마운트 진입점
│   ├── App.jsx               # 루트 컴포넌트 (전역 상태 + 라우팅)
│   ├── index.css             # 전역 스타일 + 테마 CSS 변수
│   │
│   ├── components/
│   │   ├── Splash.jsx        # 앱 시작 스플래시 (2초)
│   │   ├── BottomNav.jsx     # 하단 탭 네비게이션
│   │   ├── CalendarPage.jsx  # 달력 탭 메인 페이지
│   │   ├── Calendar.jsx      # 달력 그리드 렌더링
│   │   ├── TodoSection.jsx   # 투두 리스트 + 입력
│   │   ├── DiaryForm.jsx     # 일기 작성/수정 폼
│   │   ├── DiaryModal.jsx    # 일기 조회 모달
│   │   ├── DiaryListPage.jsx # 일기 탭 (목록/상세/수정)
│   │   ├── DdayTodoPage.jsx  # D-day + Todo 통합 탭
│   │   └── MonthYearPicker.jsx # 년/월 선택 팝업
│   │
│   ├── hooks/
│   │   ├── useDiaries.js     # 일기 CRUD + localStorage
│   │   ├── useTodos.js       # 투두 CRUD + localStorage
│   │   └── useDdays.js       # D-day CRUD + localStorage
│   │
│   └── utils/
│       └── holidays.js       # 한국 공휴일 데이터 (2024~2027)
│
├── android/                  # Capacitor Android 프로젝트
│   └── app/src/main/java/com/pocketdiary/app/
│       └── MainActivity.java # Capacitor BridgeActivity
│
├── public/                   # 정적 자산 (아이콘, 폰트, 이미지)
├── font/                     # Cafe24Ssurround 폰트 파일
├── capacitor.config.json     # Capacitor 앱 설정
├── vite.config.js            # Vite 빌드 설정
└── package.json

---
4. 4가지 핵심 기능 (탭별)

탭 1: 달력 (CalendarPage)

- 월별 달력 그리드 + 날짜 선택
- 선택한 날의 투두 관리 (추가/완료/삭제)
- 선택한 날의 일기 버튼 (있으면 클릭 시 모달, 없으면 작성 이동)
- 년/월 직접 선택 팝업
- 공휴일 빨간색 표시, 오늘 날짜 강조

탭 2: 일기 (DiaryListPage)

- 작성한 일기 전체 역순 목록
- 목록 → 상세보기 → 수정 순서로 화면 전환
- 이모지 + 제목 + 본문 구성
- 삭제 시 확인 다이얼로그

탭 3: D-day / Todo (DdayTodoPage)

- D-day 서브탭: 목표일까지 남은 날 계산, 추가/수정/삭제
- Todo 서브탭: 전체 미완료 투두를 날짜별로 모아 표시, 완료 토글/수정/삭제
- D-day 색상: 오늘=빨강, 미래=검정, 지난=회색

탭 4: 설정 (SettingsPage)

- 다크모드 토글
- 데이터 백업: JSON 파일 내보내기 / 가져오기
- 알림 설정: 매일 특정 시간에 일기 작성 알림 (Capacitor)

---
5. 데이터 구조 (localStorage)

┌──────────────────────┬─────────────────────────────────────────────┬───────────┐
│          키          │                    형태                     │   예시    │
├──────────────────────┼─────────────────────────────────────────────┼───────────┤
│ todorok-entries      │ { "YYYY-MM-DD": { title, content, emoji } } │ 일기      │
├──────────────────────┼─────────────────────────────────────────────┼───────────┤
│ todorok-todos        │ { "YYYY-MM-DD": [{ id, text, done }] }      │ 투두      │
├──────────────────────┼─────────────────────────────────────────────┼───────────┤
│ todorok-ddays        │ [{ id, title, date }]                       │ D-day     │
├──────────────────────┼─────────────────────────────────────────────┼───────────┤
│ todorok-darkmode     │ "true" / "false"                            │ 테마      │
├──────────────────────┼─────────────────────────────────────────────┼───────────┤
│ todorok-notification │ { enabled, hour, minute }                   │ 알림 설정 │
└──────────────────────┴─────────────────────────────────────────────┴───────────┘

---
6. 상태 흐름 요약

App.jsx
 ├── useDiaries()  → diaries ──→ CalendarPage, DiaryListPage, DiaryForm
 ├── useTodos()    → todos   ──→ CalendarPage > TodoSection, DdayTodoPage
 ├── useDdays()    → ddays   ──→ DdayTodoPage
 ├── darkMode state          ──→ SettingsPage, CSS :root.dark 클래스
 ├── activeTab state         ──→ BottomNav, 페이지 조건부 렌더링
 └── formMode state          ──→ DiaryForm 표시 여부

---
7. Android 뒤로가기 처리 로직

물리 뒤로가기 버튼 누름
  1순위 → 서브페이지 탈출 (DiaryList 상세/수정, DdayTodo 폼)
  2순위 → DiaryForm 닫기
  3순위 → calendar 탭으로 이동
  4순위 → 앱 종료 (App.exitApp())

---
8. 빌드 및 배포 명령어

# 웹 개발 서버
npm run dev        # localhost:5173

# Android 앱 빌드
npm run build      # dist/ 생성
npx cap sync       # Android 에 웹 빌드 동기화
npx cap open android  # Android Studio 열기
