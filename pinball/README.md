# 시루냥 팬사이트 룰렛

[lazygyu/roulette](https://github.com/lazygyu/roulette) (구슬 룰렛, MIT)를 핑크 톤으로 꾸민 버전입니다.

## 원작에서 바꾼 것
- 방문 분석(Umami, Google Analytics), 광고, 맵 공유마당·키워드 그림 등 **외부 서버로 나가는 요청을 모두 제거**했습니다.
  (남은 외부 요청은 Google Fonts의 Jua 글꼴 하나뿐입니다)
- 다른 스트리머 이름용 그림, 앱 아이콘·매니페스트·서비스워커를 제거했습니다.
- 화면·캔버스 색을 핑크로 바꿨고, 맵이 직접 지정한 색도 핑크~보라 톤으로 옮깁니다 (`src/utils/themeColor.ts`).
- 한국어가 기본입니다.

## 색을 바꾸려면
- 패널(버튼, 입력창 등): `assets/style.css` 맨 위 `:root` 변수
- 캔버스(구슬, 벽, 배경): `src/data/constants.ts` 의 `Themes`
- 맵 색 변환 강도: `src/utils/themeColor.ts` 상단 상수

## 빌드
```bash
npm install        # 또는 yarn
npm run dev        # 로컬 확인 (http://localhost:1235)
npm run build      # dist/ 생성 (상대 경로라 어느 폴더에 올려도 동작)
```
`dist/` 안의 파일을 사이트의 원하는 폴더(예: `roulette/`)에 통째로 올리면 됩니다.
`dist/licenses/` 는 같이 올려 주세요 (원작 MIT 고지 포함).

## 라이선스
MIT, Copyright (c) 2022 LazyGyu (`LICENSE`). 사용한 라이브러리는 `THIRD_PARTY_NOTICES.md` 참고.
