# study-typescript 모노레포

`backend`와 `frontend`가 공존하는 모노레포입니다. 프런트는 Vite 정적 빌드, 백엔드는 Nest 기반으로 정적 자산 서빙 + 간단 API/Swagger를 제공합니다.

## 디렉터리 구조
- `frontend/` : React + Vite UI. `pnpm run build` 시 `frontend/build` 생성.
- `backend/` : Nest 서버. `frontend/build`를 정적으로 서빙하며 `/api/health`, `/api/docs`(Swagger) 제공.

## 프런트엔드 빌드
```bash
cd frontend
pnpm install          # 또는 npm install
pnpm run build        # 산출물: frontend/build
pnpm run preview      # (선택) 빌드 결과 확인
```

## 백엔드 실행
```bash
cd backend
pnpm install          # 또는 npm install
pnpm run dev          # 개발 모드 (ts-node-dev)
# 또는
pnpm run build && pnpm start  # 프로덕션 빌드/실행
```

## 배포 흐름
1) `frontend/build`가 존재해야 합니다(없으면 `pnpm run build`).
2) `backend`를 `pnpm run build && pnpm start`로 실행하면 정적 자산을 `/`에서 서빙하고, 없는 경로는 SPA fallback으로 `index.html`을 반환합니다. `/api/*`는 API 전용으로 분리됩니다. 기본 포트는 `8080`(루프백 `127.0.0.1` 바인딩)이며 `PORT`로 변경 가능합니다.
3) Swagger 문서: `/api/docs`에서 확인 가능.
