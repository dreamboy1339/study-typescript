# Backend (Nest)

프런트엔드 빌드 결과(`frontend/build`)를 정적으로 서빙하고, 간단한 API 및 Swagger 문서를 제공합니다.

## 요구 사항
- Node.js 18+
- 패키지 매니저: `pnpm`(권장) 또는 `npm`

## 실행 방법
```bash
cd backend
pnpm install
pnpm run dev          # 개발 모드(ts-node-dev)
# 또는 프로덕션
pnpm run build && pnpm start

# 기본 포트는 8080(루프백 127.0.0.1 바인딩). 필요 시 PORT로 변경.
```

## Docker 실행
루트에서 빌드/실행하면, 컨테이너 안에서 프런트 빌드까지 포함해 정적 서빙합니다.
```bash
# 루트(study-typescript) 기준
docker build -t study-typescript-backend -f backend/Dockerfile .
docker run -p 8080:8080 -e PORT=8080 study-typescript-backend
```
- `frontend/build`는 컨테이너 내부에서 자동으로 빌드되어 `/` 경로로 서빙됩니다.
- `/api/health`, `/api/docs`는 동일하게 동작합니다.

## 엔드포인트
- `GET /api/health` : 서버 헬스 체크 (Swagger `health` 태그)
- `GET /api/docs` : Swagger UI
- 정적 파일: `frontend/build`의 결과물을 `/` 루트에서 서빙, SPA 라우팅은 모든 비-API 경로를 `index.html`로 포워딩합니다.

## 배포 시나리오
1) 루트에서 `cd frontend && pnpm install && pnpm run build`.
2) `cd ../backend && pnpm install && pnpm run build && pnpm start`.
3) 리버스 프록시가 있다면 `/api`는 백엔드로, 나머지는 백엔드의 정적 서빙으로 라우팅하면 됩니다.
