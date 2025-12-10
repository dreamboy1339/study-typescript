
# TypeScript Learning Platform (frontend)

React + Vite 기반의 프런트엔드입니다. 루트 `study-typescript` 모노레포 아래 `frontend` 디렉터리에 있으며, `backend`와 함께 배포됩니다.

## 요구 사항
- Node.js 18+
- 패키지 매니저: `pnpm`(권장) 또는 `npm`

## 설치 및 실행
```bash
cd frontend
pnpm install          # 또는 npm install
pnpm run dev          # 로컬 개발 서버
pnpm run typecheck    # 타입 검사 (noEmit)
```

## 프로덕션 빌드
```bash
pnpm run build        # 산출물: frontend/build
pnpm run preview      # 로컬에서 빌드 결과 확인
```

## 서버 배포 가이드
- `pnpm run build` 결과물인 `frontend/build` 폴더(정적 HTML/CSS/JS)를 서버의 정적 호스팅 위치로 배치합니다.
- 백엔드가 정적 파일을 서빙한다면, `frontend/build`를 백엔드의 `public`(또는 static) 디렉터리에 복사하고, SPA 라우팅을 위해 알맞은 index fallback 설정을 추가해주세요.
- Nginx 등 별도 정적 서버를 쓴다면 루트로 `frontend/build`를 지정하고, 존재하지 않는 경로 요청 시 `index.html`로 포워딩하도록 설정하면 됩니다.
  
