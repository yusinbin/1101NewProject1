# 빈유신 포트폴리오

Hugo와 LoveIt 테마로 만든 개인 포트폴리오 사이트입니다. `main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드해서 GitHub Pages에 배포합니다.

- 사이트: https://yusinbin.github.io/1101NewProject1/
- 저장소: https://github.com/yusinbin/1101NewProject1
- 배포 기록: https://github.com/yusinbin/1101NewProject1/actions
- 테마: [LoveIt](https://github.com/dillonzq/LoveIt) (MIT 라이선스)
- 출처와 라이선스: [CREDITS.md](CREDITS.md)

## 폴더 구조

```
.
├── .github/
│   ├── workflows/hugo-pages.yml   배포 워크플로 (Hugo 0.167.0 고정)
│   └── pages_build.py             빌드와 하위 경로 보정 스크립트
├── site/                          실제 사이트 (여기만 수정)
│   ├── hugo.toml                  사이트 설정 (제목, 메뉴, 프로필 등)
│   ├── pages.json                 배포 주소(baseURL) 설정
│   ├── content/                   글 (소개, 활동)
│   ├── layouts/                   테마 파일을 덮어쓴 템플릿
│   ├── assets/css/_custom.scss    직접 추가한 스타일
│   ├── static/images/             프로필 아이콘 등 이미지
│   └── themes/template/           LoveIt 테마 원본 (수정하지 않음)
└── (그 밖의 루트 파일)              테마 ZIP 원본 그대로 보관
```

## 필요한 도구

| 도구 | 버전 | 용도 |
|---|---|---|
| Git | 2.x | 커밋과 push |
| Python | 3.9 이상 | 빌드 스크립트 실행 |
| Hugo **extended** | 0.167.0 | 사이트 생성 (워크플로와 같은 버전) |
| Dart Sass | 1.105.0 | 테마 SCSS 변환 (없으면 빌드 실패) |

작성자 환경: Windows 11, Python 3.14.3, Git 2.55.0

## 설치 (Windows)

1. Hugo extended 0.167.0을 받아 `C:\tools\hugo`에 압축을 풉니다.
   https://github.com/gohugoio/hugo/releases/download/v0.167.0/hugo_extended_0.167.0_windows-amd64.zip
2. Dart Sass 1.105.0을 받아 `C:\tools`에 압축을 풉니다. (`C:\tools\dart-sass` 폴더가 생깁니다)
   https://github.com/sass/dart-sass/releases/download/1.105.0/dart-sass-1.105.0-windows-x64.zip
3. PowerShell에서 경로를 추가하고 버전을 확인합니다.

```powershell
$env:Path = "C:\tools\hugo;C:\tools\dart-sass;" + $env:Path
hugo version      # v0.167.0 ... +extended 가 보여야 합니다
sass --version    # 1.105.0
```

## 로컬에서 확인하기

미리보기 서버 (저장하면 자동으로 새로고침됩니다)

```powershell
cd site
hugo server --config hugo.toml,pages.json --theme template --themesDir themes
```

브라우저에서 http://localhost:1313/1101NewProject1/ 을 엽니다.

배포와 같은 방식으로 빌드하기 (저장소 루트에서 실행, 결과는 `public/`)

```powershell
python .github/pages_build.py --build
```

`빌드 완료. 프로젝트 주소 경로 보정: N 개 파일`이 나오면 성공입니다. `public/`은 `.gitignore`에 들어 있어 커밋되지 않습니다.

## 내용 수정 위치

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 사이트 제목, 메뉴, 홈 프로필 문구, GitHub 링크 | `site/hugo.toml` |
| 홈 왼쪽 바의 연락처, 관심 분야·기술 칩, 지금 하고 있는 것 | `site/hugo.toml`의 `[languages.ko.params.home.profile]` 아래 `email`, `phone`, `interests`, `skills`, `now` |
| 소개 페이지 | `site/content/about/index.md` |
| 활동 글 | `site/content/posts/<활동이름>/index.md` |
| 활동 카드의 상태·기술 배지 | 활동 글 맨 위의 `status`, `tech` |
| 활동 분야(홈 필터 버튼) | 활동 글 맨 위의 `category` (예: `category: ["보안"]`). 새 분야를 적으면 홈에 필터 버튼이 자동으로 생깁니다 |
| 홈 화면 구조 (활동 카드 그리드) | `site/layouts/home.html`, `site/layouts/_partials/activity-card.html` |
| 404 페이지 | `site/layouts/404.html` |
| 직접 추가한 스타일 | `site/assets/css/_custom.scss` |
| 프로필 아이콘 | `site/static/images/avatar.svg` |

### 새 활동 추가하기

- 관리자 버튼은 평소에는 숨겨져 있습니다. 사이트 주소 끝에 `?admin`을 붙여 한 번 접속하면(예: `https://yusinbin.github.io/1101NewProject1/?admin`) 그 브라우저에서만 보이고, 왼쪽 아래 **관리자 모드 켜짐 · 끄기**를 누르거나 `?admin=off`로 접속하면 다시 숨겨집니다. 버튼을 보이게 할 뿐이고, 실제 저장은 GitHub 저장소 주인만 할 수 있습니다.
- 사이트 홈의 **⊕ 활동 추가** 카드를 누르면 입력 창이 뜹니다. 제목·날짜·상태·분야·기술·요약을 넣고 **GitHub에서 이어서 쓰기**를 누르면 양식이 채워진 GitHub 새 파일 화면이 열립니다. 본문을 쓰고 저장(Commit changes)하면 자동 배포됩니다.
- 카드 오른쪽 위 **완료로 / 진행 중으로** 버튼: 바꿀 `status` 줄을 복사하고 그 글의 GitHub 편집 화면을 엽니다. 맨 위 `status:` 줄에 붙여 넣고 저장합니다.
- 활동 글 화면의 **이 글 수정하기** 버튼: 원문을 불러와 사이트 안에서 고친 뒤, 복사해서 GitHub 편집 칸에 전체 붙여넣기(Ctrl+A → Ctrl+V)하고 저장합니다.
- 또는 `site/content/posts/<활동이름>/index.md`를 만들고 대표 이미지를 같은 폴더에 넣습니다. 형식은 `site/content/posts/instaclone/index.md`를 참고합니다.

### 관리자 버튼과 수정 권한

관리자 모드는 **버튼을 보이게 할 뿐**이고, 사이트 내용을 바꾸는 권한은 GitHub 계정에 있습니다. 다른 사람이 `?admin`으로 버튼을 켜도 사이트를 바꿀 수 없습니다.

| 단계 | 저장소 주인(yusinbin) | 다른 사람 |
|---|---|---|
| 사이트에서 입력 창 열기 | 가능 | 가능 (브라우저 안에서만 일어나는 일이라 사이트에 영향 없음) |
| GitHub 편집 화면에서 저장 | 바로 저장(Commit) → 자동 배포 | 로그인을 요구받거나, 자기 계정으로 저장소를 복사해 **변경 제안(Pull Request)** 만 보낼 수 있음 |
| 사이트에 반영 | 저장하면 반영 | 저장소 주인이 제안을 **직접 승인(Merge)해야만** 반영. 승인하지 않으면 반영되지 않음 |

- 사이트 코드에는 비밀번호·토큰이 들어 있지 않습니다. 사이트 안에서 바로 저장하는 방식은 토큰을 공개해야 해서 쓰지 않았습니다.
- 모르는 사람이 보낸 Pull Request는 내용을 확인하기 전에는 승인하지 않습니다.

## 수정 후 배포하고 확인하기

> 주요 기능을 실제로 확인한 기록(자동 검사 12건과 배포 주소 재확인, 1440px·768px·390px 캡처 포함)은 [VERIFICATION.md](VERIFICATION.md)에 있습니다.

1. 변경 내용 확인 후 커밋하고 push합니다.

```powershell
git status
git add <바꾼 파일>
git commit -m "무엇을 왜 바꿨는지"
git push
```

2. 저장소의 **Actions** 탭에서 맨 위 실행(방금 커밋 메시지)이 `build` → `deploy` 모두 초록 체크가 될 때까지 기다립니다. (보통 1분 안팎)
3. 사이트를 열어 바뀐 내용을 확인합니다. 예전 화면이 보이면 **Ctrl+F5**로 새로고침합니다.
4. 실패(빨간 X)하면 실행을 눌러 `build` 단계의 로그에서 `ERROR` 줄을 확인하고, 위의 "배포와 같은 방식으로 빌드하기"로 로컬에서 같은 오류가 나는지 봅니다.

## 처음 설정 기록

1. LoveIt 저장소 첫 화면의 Download ZIP(master)을 받아 압축을 풀었습니다.
2. 수업에서 제공한 `prepare_github_pages.py`를 실행해 `site/`, 워크플로, `.gitignore`를 준비했습니다.
3. `git init -b main` 후 원격 저장소를 연결하고 push했습니다.
4. GitHub Settings → Pages → Source를 **GitHub Actions**로 설정했습니다.
