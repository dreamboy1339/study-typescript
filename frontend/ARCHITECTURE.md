# Frontend ARCHITECTURE

대상: 안드로이드 15년 차, 프론트/백엔드 초심자. 익숙한 용어(Activity, ViewModel, Room 등)로 풀어 씁니다.

## 전체 그림
- 스택: Vite(번들러) + React + TypeScript. 안드로이드의 Gradle 빌드 + Compose UI 조합과 유사.
- 산출물: `pnpm run build` 시 `frontend/build/`에 정적 파일이 생성되고, 백엔드 Nest 서버가 이 경로를 그대로 서빙합니다. 즉, Compose로 만든 화면을 APK에 패키징해 Activity에서 로드한다고 생각하면 됩니다.
- 라우팅: 별도 라우터 없이 단일 페이지(SPA)로 동작. 화면 전환은 상태값으로 분기(프래그먼트 전환과 비슷).
- 코드 실행: 사용자 코드 실행은 Web Worker로 분리되어 메인 UI 스레드를 보호합니다(WorkManager/코루틴 디스패처 느낌).

## 폴더 구조(핵심만)
```
frontend/
  index.html            # 싱글 HTML 셸(안드로이드 Activity XML 루트와 비슷)
  vite.config.ts        # 빌드/번들 설정, 출력 경로를 build로 지정
  src/
    main.tsx            # 진입점: root에 App 마운트(Activity onCreate에서 setContentView)
    App.tsx             # 최상위 UI/상태 조립(호스트 Activity 역할)
    index.css           # Tailwind 기반 전역 스타일
    data/lessons.ts     # 학습 컨텐츠 정적 데이터(Room의 프리로드 데이터처럼 사용)
    components/         # UI 조각(Fragments/Composable에 대응)
    workers/sandbox-worker.ts # 코드 실행용 Web Worker(백그라운드 스레드)
```

## 렌더링 흐름(안드로이드 비유)
1) `index.html`에서 `div#root`만 제공 → Activity 레이아웃 루트처럼 비워둠.
2) `src/main.tsx`: `createRoot(...).render(<App />)` 호출. Activity `onCreate`에서 `setContentView`하는 단계.
3) `src/App.tsx`: 화면 전체의 상태와 레이아웃을 관리. 상태는 `useState`로 관리해 LiveData/StateFlow처럼 UI를 갱신.
   - `currentPage`: 레슨/진도 화면 토글(Fragment 전환 느낌).
   - `currentLessonId`: 현재 레슨 선택 상태.
   - `completedLessons`: Set 기반 진행도(로컬 스토리지에 저장 → 영속성 보장, SharedPreferences 느낌).
4) 하위 컴포넌트가 props로 상태/이벤트를 받아 UI를 그림(Fragment가 ViewModel을 주입받는 느낌).

## 주요 컴포넌트 역할
- `Header` / `Footer`: 상단/하단 공용 바. 앱바·푸터 UI.
- `Sidebar`: 레슨 목록 네비게이션. Drawer에서 RecyclerView로 아이템 선택하듯 동작.
- `LessonContent`: 선택된 레슨의 본문 표시. Compose의 Column/Texts 조합과 유사.
- `CodeEditor`:
  - 화면 하단에서 토글되는 코드 실행 패널(Modal Bottom Sheet 느낌).
  - 실행 시 Web Worker(`workers/sandbox-worker.ts`)를 생성해 코드 실행을 백그라운드로 분리 → UI 스레드 프리즈 방지(WorkManager/코루틴 IO 디스패처).
  - 워커는 `postMessage`로 코드를 받고, 로그/에러/완료 이벤트를 메인으로 돌려보냄. 콘솔을 OkHttp Interceptor처럼 가로채 문자열 로그로 변환.
- `ProgressPage`: 완료된 레슨 목록을 보여주는 진도 화면.
- `components/ui/*`: Tailwind + Radix 기반 UI 유틸 세트(버튼, 다이얼로그 등). 안드로이드의 Material 컴포넌트 라이브러리처럼 재사용 가능 위젯 모음.

## 데이터 계층
- `src/data/lessons.ts`: 정적 배열이자 타입 정의(`Lesson` 인터페이스). Room에 프리로드된 Entity 리스트처럼 화면에서 바로 소비.
- 별도 API 호출 없이 클라이언트에 포함되므로 네트워크 의존성 없음.

## 상태·스토리지
- React `useState`로 화면 상태를 관리 → LiveData/StateFlow 역할.
- `completedLessons`는 `localStorage`에 직렬화해 앱 재시작 후에도 유지(SharedPreferences와 유사).

## 스타일/테마
- `index.css`에 Tailwind 빌드 결과가 포함되어 전역 유틸 클래스 사용. 안드로이드 테마 XML + 스타일 리소스와 비슷하게 공통 색상/폰트를 변수로 선언.
- 레이아웃은 flex/grid를 활용해 반응형 지원.

## 번들/빌드 파이프라인
- `vite.config.ts`:
  - `@vitejs/plugin-react-swc`로 JSX/TSX를 빠르게 빌드(SWC = 안드로이드 R8처럼 빠른 트랜스파일러 느낌).
  - alias로 라이브러리 버전 충돌을 방지.
  - `build.outDir = 'build'`로 산출물을 백엔드가 서빙할 위치에 고정.
- 대표 스크립트(`package.json`):
  - `pnpm run dev`: 로컬 개발 서버(기본 3000).
  - `pnpm run build`: 프로덕션 빌드 → `build/`.
  - `pnpm run preview`: 빌드 결과를 로컬에서 서빙하여 검증.
  - `pnpm run typecheck`: 타입 검증(TSC)으로 컴파일 전 오류 차단.

## 동작 요약(사용자 여정)
1) 앱 진입 시 기본 레슨(1번) 로드.
2) 사이드바에서 레슨 선택 → 본문 + 예제 코드 교체.
3) 코드 에디터 열기 → 실행 → 워커가 결과를 반환 → 출력 영역에 표시. 성공 시 해당 레슨을 완료 처리.
4) 완료 상태는 로컬 스토리지에 저장되어 새로고침 후에도 유지.
5) 진도 화면에서 완료 목록을 한눈에 확인.

## 백엔드와의 연결고리
- 빌드된 정적 파일(`build/`)은 Nest 서버의 ServeStaticModule이 `/`에 서빙.
- SPA 특성상 확장자 없는 GET 요청은 백엔드가 `index.html`을 반환해 클라이언트 라우팅으로 연결(안드로이드의 NavHost가 목적지 Fragment를 로딩하는 느낌).

## 문제 해결 포인트
- 새로고침 404: 백엔드 SPA fallback이 켜져 있는지 확인(현재 `main.ts`에서 처리).
- 코드 실행 오류: 워커 스레드 로그를 확인. 메인 스레드에선 UI만 담당하도록 유지.
- 스타일 깨짐: `index.css`가 번들에 포함됐는지, Tailwind 유틸 클래스가 제거되지 않았는지 확인.
