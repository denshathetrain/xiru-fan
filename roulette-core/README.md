# 시루냥 룰렛 (핵심 코드)

[lazygyu/roulette](https://github.com/lazygyu/roulette) (MIT)에서 **광고, 방문 분석, 외부 서버 연결, 키워드 그림(과일 등), 다른 스트리머 그림, 맵 공유마당**을 걷어내고
**공 물리(box2d), 구슬 수·가중치 처리, 맵, 스킬, 녹화**만 남긴 버전입니다. 화면(HTML/CSS)은 사이트에 맞게 따로 만들면 됩니다.

## 구성
- `src/` — 실행 코드 (물리, 구슬, 카메라, 캔버스 그리기). 시작점은 `src/index.ts`
- `index.html` — 예제 화면. 안의 인라인 `<script>` 가 `window.roulette` 를 부르는 방법의 전부입니다
- `assets/style.css` — 예제 화면 스타일 (바꿔도 동작에 영향 없음)
- `assets/images/ff.svg` — 코드가 직접 불러오는 유일한 그림. 나머지 svg 는 예제 CSS 아이콘

## 화면에서 부르는 API (`window.roulette`)
| 하는 일 | 호출 |
|---|---|
| 구슬 만들기 (`이름*개수/가중치` 파싱은 index.html 의 `parseName` 참고) | `setMarbles(names: string[])` |
| 구슬 수 | `getCount()` |
| 시작 | `start()` |
| 당첨 순위 범위 | `setWinnerRange(start, end)` (0부터), `getWinnerRange()` |
| 맵 목록·선택 | `getMaps()`, `setMap(index)` |
| 캔버스 테마 | `setTheme('dark' \| 'light')` |
| 녹화 | `setAutoRecording(boolean)` |
| 스킬 | `window.options.useSkills = true/false` |
| 이벤트 | `addEventListener('goal' \| 'message', handler)` |

## 색
캔버스(구슬·벽·배경): `src/data/constants.ts` 의 `Themes`. 맵이 지정한 색을 핑크 톤으로 옮기는 변환: `src/utils/themeColor.ts` (끄려면 `rouletteRenderer.ts`, `minimap.ts`의 `toPinkTone(...)` 호출을 지우세요).

## 빌드
```bash
yarn            # 또는 npm install
yarn dev        # http://localhost:1235
yarn build      # dist/ (상대 경로)
yarn typecheck  # 타입 검사
```

## 라이선스
MIT, Copyright (c) 2022 LazyGyu (`LICENSE`). `THIRD_PARTY_NOTICES.md` 참고.
