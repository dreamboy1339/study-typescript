# Backend ARCHITECTURE

대상: 안드로이드 15년 차, 프론트/백엔드 초심자. 익숙한 개념(Activity, ViewModel, Room DAO 등)으로 풀어서 설명합니다.

## 전체 그림
- Monorepo: 루트 `study-typescript/` 안에 `frontend/`(React+Vite 빌드 산출물)와 `backend/`(NestJS) 공존.
- 서버 역할: NestJS가 Activity/Fragment처럼 진입점이 되고, ViewModel 같은 서비스 계층을 통해 API와 정적 자산을 동시에 제공.
- 정적 자산: `frontend/build/`에 있는 SPA 번들을 ServeStaticModule이 배포. 라우터 없는 경로는 Fragment 전환처럼 `index.html`로 포워딩하여 클라이언트 라우팅에 맡김.
- 문서화: Swagger로 `/api/docs`에서 API 명세 제공(안드로이드의 API 스펙 문서 페이지).
- 컨테이너: `backend/Dockerfile` 하나로 프론트 빌드 → 백엔드 빌드 → 런타임 이미지를 만들고 `node dist/main.js`로 실행.

## 폴더 구조 한눈에 보기
```
backend/
  Dockerfile             # 멀티스테이지 빌드로 프론트+백엔드 통합 이미지 생성
  README.md              # 실행 가이드
  package.json / pnpm-lock.yaml
  tsconfig.json
  src/
    main.ts              # Nest 부트스트랩 + Swagger + SPA fallback
    app.module.ts        # 모듈 등록(ServeStatic, Controller, Service)
    app.controller.ts    # API 진입점(Activity 느낌) - /api/health
    app.service.ts       # 비즈니스 로직(ViewModel/UseCase 느낌) - 상태 반환
```

## 실행 흐름 (안드로이드 비유)
1) **main.ts**: `bootstrap()`에서 Nest 애플리케이션을 띄움. Activity `onCreate`에서 `setContentView`와 DI 세팅을 마치는 느낌.
   - `ValidationPipe`: DTO를 Kotlin Data Class처럼 자동 검증/정제.
   - Swagger: `/api/docs`에 API 문서 생성. Retrofit 인터페이스 문서를 자동 생성한다고 생각하면 편함.
   - SPA Fallback: OkHttp Interceptor가 비-API GET 요청을 가로채 `index.html`로 전달. 클라이언트 라우터(Fragment 전환)에게 길을 열어줌.
   - `app.listen(port, host)`: 기본 `0.0.0.0:8080` 바인딩.
2) **app.module.ts**: Nest 모듈 정의. 안드로이드의 `Application`이 Hilt 모듈을 묶는 것과 유사.
   - `ServeStaticModule.forRoot(...)`: `frontend/build`를 정적 자원으로 노출. `exclude: ['/api*']`로 API 트래픽은 차단해 서버 라우터로만 보냄.
3) **app.controller.ts**: Activity/Fragment 진입점 역할.
   - `@Controller('api')` + `@Get('health')`: `/api/health` 헬스 체크 제공.
   - Swagger Decorator(`@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiProperty`)로 문서 예시 포함. Apidog 연동 준비 완료.
4) **app.service.ts**: ViewModel/UseCase처럼 상태 값을 돌려주는 심플 로직.

## 주요 파일 상세
- `src/main.ts`
  - Nest 앱 생성, 글로벌 ValidationPipe 등록, Swagger 문서 설정.
  - SPA fallback 미들웨어: `/api`가 아니고, 확장자 없는 GET이면 `frontend/build/index.html`을 반환.
  - 환경 변수: `PORT`(기본 8080), `HOST`(기본 `0.0.0.0`).
- `src/app.module.ts`
  - `ServeStaticModule`로 프론트 빌드 결과를 정적 서빙.
  - Controller/Service를 providers/controllers로 묶어 의존성 주입 경로 구성.
- `src/app.controller.ts`
  - `/api/health` 엔드포인트. 상태 문자열을 응답.
  - Swagger 데코레이터로 요청/응답 예시와 설명을 명시(안드로이드 Retrofit 문서화처럼).
- `src/app.service.ts`
  - 헬스 체크 상태를 돌려주는 단순 메서드. ViewModel이 LiveData를 내보내는 것과 유사.

## Docker 동작 방식 (한 줄씩 이해하기)
- **멀티스테이지 빌드**: 이미지 용량을 줄이고 빌드 의존성(프론트, Nest)을 런타임에서 분리.
  1) `frontend-builder` 스테이지: Node 20 Alpine에서 `frontend/`를 빌드 → `frontend/build` 산출.
  2) `backend-builder` 스테이지: Node 20 Alpine에서 `backend/`를 빌드 → `dist/` 산출, 프론트 빌드 결과를 함께 복사.
  3) `runner` 스테이지: Node 20 Alpine 최소 환경. `NODE_ENV=production`, `PORT=8080`, `HOST=0.0.0.0`. `CMD node dist/main.js`.
- 기본 포트: `8080`(컨테이너 외부 노출 시 `-p 8080:8080`).

## 요청 라우팅 요약
- `/api/**`: Nest Controller로 전달(서버 라우팅). 예: `/api/health`.
- `/api/docs`: Swagger UI.
- 정적 파일(`/*.js`, `/*.css` 등): ServeStatic이 바로 응답.
- 그 외 GET(확장자 없음): `index.html`로 응답 → 클라이언트 라우터가 페이지 분기.

## 확장 가이드
- 새 API 추가 시: `app.controller.ts`에 메서드 추가 → `AppService`에 로직 추가 → Swagger 데코레이터와 DTO(`@ApiProperty`)를 작성해 문서 정확도 확보.
- 미들웨어/가드 추가 시: OkHttp Interceptor를 추가하는 느낌으로 `main.ts` 혹은 모듈 레벨에 등록.
- 정적 자산 경로 변경 시: `app.module.ts`의 `ServeStaticModule` rootPath만 조정하면 됨.

## 환경 변수와 기본값
- `PORT`: 서비스 노출 포트(기본 8080).
- `HOST`: 바인딩 주소(기본 `0.0.0.0`, 컨테이너/VM에서도 접근 가능).

## 장애 대처 포인트
- 정적 파일 404: `frontend/build`가 복사되었는지 확인(빌드 누락 여부).
- `/api/docs` 미노출: Swagger 설정이 `main.ts`에 그대로 있는지, 빌드 후 dist에 반영됐는지 점검.
- 페이지 새로고침 404: SPA fallback 미들웨어(`main.ts`)가 index.html로 제대로 포워딩하는지 확인.
