# DAKER Platform

해커톤 탐색부터 팀 빌딩, 제출, 랭킹까지 한 곳에서 관리하는 원스톱 해커톤 플랫폼입니다.

> **배포 URL**: [https://daker-platform.vercel.app](https://daker-platform.vercel.app)

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| UI 컴포넌트 | shadcn/ui v4 (Base UI 기반) |
| 스타일링 | Tailwind CSS v4 |
| 상태 관리 | Zustand (localStorage persist) |
| 검색 | cmdk (Command Palette) |
| 다크모드 | next-themes |
| 아이콘 | Lucide React |
| 알림 | Sonner (Toast) |
| 배포 | Vercel |

---

## 주요 페이지 및 기능

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 메인 | `/` | Hero 섹션, 통계, 빠른 탐색, 진행중/예정 해커톤 |
| 해커톤 목록 | `/hackathons` | 전체 해커톤 목록, 상태/태그 필터, 북마크 |
| 해커톤 상세 | `/hackathons/[slug]` | 8개 탭(개요, 일정, 규칙, 상금, 리더보드, 팀, 제출, FAQ) |
| 캠프 (팀 빌딩) | `/camp` | 팀 모집 게시판, 팀 생성, 해커톤별 필터 |
| 랭킹 | `/rankings` | 전체 해커톤 통합 순위, 기간/해커톤 필터 |

### 핵심 기능
- **글로벌 검색** (Ctrl+K / Cmd+K): 해커톤, 팀, 페이지를 빠르게 검색
- **다크모드**: 상단 네비게이션에서 라이트/다크 모드 전환
- **북마크**: 관심 해커톤을 저장하여 빠르게 접근
- **실시간 카운트다운**: 마감까지 남은 시간 표시 (색상 변화: 초록 -> 노랑 -> 빨강)
- **팀 생성/참가**: 캠프에서 팀 생성, 해커톤 상세에서 팀 참가 신청/탈퇴
- **파일 업로드**: 제출 탭에서 파일 드롭존 UI (ZIP, PDF, CSV 등)
- **미제출 팀 표시**: 리더보드에서 미제출 팀을 빨간 배지로 표시
- **동적 상태 계산**: 마감일 기준으로 해커톤 상태(진행중/종료) 자동 업데이트
- **에러 처리**: ErrorBoundary + 데이터 로딩 실패 UI

### AHA - AI Hackathon Advisor (확장 기능)
해커톤 상세 페이지 우하단의 플로팅 챗봇 버튼을 통해 접근하는 AI 어드바이저입니다.

- **적합도 분석**: 사용자의 기술 스택과 해커톤 요구 스킬을 비교하여 적합도(%)를 게이지로 표시
- **스킬 갭 분석**: 부족한 기술 목록과 학습 리소스 추천
- **팀 매칭**: 기술 기반으로 적합한 모집 중인 팀 추천
- **프로필 설정**: 보유 기술, 경험 수준, 관심 분야를 선택하여 개인화된 분석 제공
- **빠른 액션 버튼**: "적합도 분석", "부족한 기술", "팀 찾기" 원클릭 실행

---

## 폴더 구조

```
daker-platform/
├── public/
│   └── data/                    # 시드 데이터 (JSON)
│       ├── hackathons.json      # 해커톤 목록
│       ├── hackathon_detail.json # 해커톤 상세 정보
│       ├── leaderboard.json     # 리더보드 데이터
│       └── teams.json           # 팀 데이터
├── src/
│   ├── app/                     # Next.js App Router 페이지
│   │   ├── page.tsx             # 메인 페이지
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   ├── globals.css          # 전역 스타일 (색상 변수)
│   │   ├── hackathons/          # 해커톤 목록 & 상세
│   │   ├── camp/                # 팀 빌딩
│   │   ├── rankings/            # 랭킹
│   │   └── not-found.tsx        # 404 페이지
│   ├── components/
│   │   ├── ui/                  # shadcn/ui 공통 컴포넌트
│   │   ├── layout/              # Navbar, ThemeToggle, DataInitializer
│   │   ├── shared/              # GlobalSearch, CountdownTimer, EmptyState
│   │   └── hackathon/           # 해커톤 관련 컴포넌트 (카드, 탭 등)
│   ├── stores/                  # Zustand 상태 관리
│   │   ├── hackathonStore.ts
│   │   ├── teamStore.ts
│   │   ├── leaderboardStore.ts
│   │   └── submissionStore.ts
│   └── lib/
│       ├── types.ts             # TypeScript 타입 정의
│       ├── constants.ts         # 상수 (라우트, 상태 라벨, 색상)
│       ├── data-init.ts         # JSON -> localStorage 초기화
│       └── utils.ts             # 유틸리티 함수
└── package.json
```

---

## 데이터 흐름

```
JSON 시드 파일 (public/data/)
    ↓ fetch (최초 방문 시)
data-init.ts (평탄화 + 상태 계산)
    ↓ localStorage에 저장
Zustand stores (persist 미들웨어)
    ↓
React 컴포넌트에서 사용
```

- `CURRENT_DATA_VERSION`이 변경되면 다음 방문 시 데이터가 자동 갱신됩니다.
- 북마크와 제출물은 사용자 데이터이므로 버전 업데이트 시에도 유지됩니다.

---

## 로컬 실행 방법

```bash
# 1. 저장소 클론
git clone https://github.com/<your-username>/daker-platform.git
cd daker-platform

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 접속
# http://localhost:3000
```

### 빌드

```bash
npm run build
npm start
```

---

## 팀

긴급 인수인계 해커톤 참가 프로젝트
