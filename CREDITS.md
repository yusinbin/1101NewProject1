# 출처와 라이선스

이 사이트에 쓴 자료를 **외부 자료**, **직접 제작**, **AI와 함께 제작**으로 나눠 기록합니다.
확인일: 2026-11-03

## 1. 테마와 빌드 도구 (외부 자료)

| 자료 | 사용 위치 | 출처 | 이용 조건 |
|---|---|---|---|
| LoveIt 테마 (master, 2026-11-01 ZIP) | `site/themes/template/` 전체, 루트의 원본 파일 | https://github.com/dillonzq/LoveIt (Dillon) | MIT. 고지는 `LICENSE`, `site/themes/template/LICENSE`에 그대로 유지. 사이트 하단에 테마 이름 표시 |
| Hugo extended 0.167.0 | 빌드 도구 (저장소에 포함 안 함) | https://gohugo.io | Apache-2.0 |
| Dart Sass 1.105.0 | 빌드 도구 (저장소에 포함 안 함) | https://sass-lang.com | MIT |
| 배포 준비 스크립트 | `prepare_github_pages.py`가 만든 `.github/workflows/hugo-pages.yml`, `.github/pages_build.py`, `site/pages.json`, `.gitignore` 추가 규칙 | 수업 제공 자료 | 수업 과제용 |

## 2. 테마가 불러오는 외부 라이브러리 (CDN)

배포된 페이지가 jsDelivr에서 불러옵니다. 버전과 라이선스는 npm 등록 정보로 확인했습니다.

| 라이브러리 | 버전 | 용도 | 라이선스 |
|---|---|---|---|
| Font Awesome Free | 7.2.0 | 메뉴·버튼 아이콘 | 아이콘 CC BY 4.0, 글꼴 SIL OFL 1.1, 코드 MIT |
| Simple Icons | 16.9.0 | 공유 아이콘 | CC0 1.0 |
| animate.css | 4.1.1 | 화면 전환 효과 | MIT |
| autocomplete.js | 0.38.1 | 검색창 자동 완성 | MIT |
| Fuse.js | 7.0.0 | 사이트 검색 | Apache-2.0 |
| lazysizes | 5.3.2 | 이미지 지연 로딩 | MIT |
| clipboard.js | 2.0.11 | 코드 복사 버튼 | MIT |
| sharer.js | 0.5.2 | 공유 버튼 | MIT |
| TypeIt | 8.6.0 | 홈 소개 문구 타자 효과 | GPL-3.0 (개인·비상업 사용) |

테마에 함께 들어 있는 그 밖의 라이브러리 목록은 `site/themes/template/README.md`의 Special Thanks에 있습니다.

## 3. 직접 제작한 자료

| 자료 | 위치 | 설명 |
|---|---|---|
| InstaClone 실행 화면 캡처 3장 | `site/content/posts/instaclone/feed.png`, `new-post.png`, `profile.png` | 직접 만든 앱을 휴대폰에서 실행해 캡처. 겹친 다른 앱 창과 오류 문구 부분은 AI 도구로 잘라냄 |
| 소개·활동 글의 내용 | `site/content/about/index.md`, `site/content/posts/*/index.md` | 경험·관심 분야·계획은 본인 정보. 문장 초안은 AI가 쓰고, 본인이 사실과 다른 부분을 고치거나 수정을 요청함 |

## 4. AI와 함께 제작한 자료

도구: Claude (Anthropic). AI가 만든 결과는 커밋 전에 검토했고, 배포 후 동작 확인은 AI와 함께 브라우저에서 했습니다.

| 자료 | 위치 | AI가 한 일 / 본인이 한 일 |
|---|---|---|
| 프로필 아이콘 | `site/static/images/avatar.svg` | AI가 SVG 작성 / 사용 여부 결정 |
| 포트폴리오 활동 표지 | `site/content/posts/portfolio-site/featured-image.svg` | AI가 배포 흐름도를 SVG로 작성 / 내용 검토 |
| InstaClone 활동 표지 | `site/content/posts/instaclone/featured-image.png` | 직접 찍은 캡처를 AI가 배경과 함께 합성 / 원본 캡처 제공, 결과 검토 |
| 덮어쓴 템플릿 | `site/layouts/` 아래 파일 (`home.html`, `404.html`, `baseof.html`, `summary.html`, `posts/single.html`, `_partials/`, `_markup/render-image.html`) | LoveIt 원본 파일을 바탕으로 AI가 수정안 작성 / 기능 아이디어 제시, 결과 검토. 원본 테마의 MIT 조건을 따름 |
| 사용자 스타일 | `site/assets/css/_custom.scss` | AI가 작성 / 홈 카드 배치 구상(직접 그린 스케치), 결과 검토 |
| 사이트 설정 변경 | `site/hugo.toml` | AI와 함께 데모 설정 정리, 본인 정보로 교체 |
| README, 이 문서 | `README.md`, `CREDITS.md` | AI가 초안 작성과 명령 동작 확인 / 내용 검토 |
| 기능 검증표와 검증 캡처 | `VERIFICATION.md`, `verification/` (`shoot.js`, 캡처 12장) | AI가 확인 스크립트 작성·실행, 캡처와 표 작성 / 확인할 기능 선정, 결과 검토 |
