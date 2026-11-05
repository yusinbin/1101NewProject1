// 기능 검증용 캡처 (AI(Claude) 작성): 빌드한 사이트를 Playwright(Chromium)로 열어 10가지 동작을 확인하고 화면을 저장
// 실행: npm i -D playwright && npx playwright install chromium && node verification/shoot.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// SITE: 빌드 결과 폴더 (기본: site/public). CDN: 외부 CDN에 못 나가는 환경에서 npm pack으로 받아 둔 라이브러리 폴더 (없으면 인터넷에서 받음)
const SITE = process.env.SITE || path.join(__dirname, '..', 'site', 'public');
const CDN = process.env.CDN || '';
const OUT = __dirname;
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'http://portfolio.test';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.xml': 'application/xml', '.ico': 'image/x-icon' };

async function route(context) {
  await context.route('**/*', async (r) => {
    const u = new URL(r.request().url());
    let file = null; let status = 200;
    if (u.host === 'portfolio.test') {
      file = path.join(SITE, decodeURIComponent(u.pathname));
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file)) { file = path.join(SITE, '404.html'); status = 404; }
    } else if (CDN && u.host === 'cdn.jsdelivr.net' && u.pathname.startsWith('/npm/')) {
      const m = u.pathname.slice(5).match(/^((?:@[^/]+\/)?[^@/]+)@([^/]+)\/(.*)$/);
      if (m) file = path.join(CDN, (m[1] + '@' + m[2]).replace(/[\/@]/g, '_'), 'package', m[3]);
    }
    if (file && fs.existsSync(file)) {
      return r.fulfill({ status, body: fs.readFileSync(file), contentType: types[path.extname(file)] || 'application/octet-stream' });
    }
    if (u.host !== 'portfolio.test' && !CDN) return r.continue();
    return r.fulfill({ status: 404, body: '' });
  });
}

async function newPage(browser, width, height, opts = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, locale: 'ko-KR', ...opts });
  await route(context);
  const page = await context.newPage();
  return { context, page };
}

const results = [];
function record(id, name, ok, detail, shot) { results.push({ id, name, ok, detail, shot }); console.log(id, ok ? 'PASS' : 'FAIL', name, '|', detail); }
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

(async () => {
  const browser = await chromium.launch();
  const version = browser.version();
  const started = new Date();

  // 1. 홈 1440 (라이트)
  { const { context, page } = await newPage(browser, 1440, 900, { colorScheme: 'light' });
    await page.goto(BASE + '/'); await page.waitForTimeout(2500);
    const cols = await page.evaluate(() => getComputedStyle(document.querySelector('.activity-grid')).gridTemplateColumns.split(' ').length);
    const sticky = await page.evaluate(() => getComputedStyle(document.querySelector('.home-profile')).position);
    const of = await overflow(page);
    await page.screenshot({ path: path.join(OUT, '01-home-1440.png') });
    record(1, '홈 화면 1440px', !of && sticky === 'sticky', `카드 ${cols}열, 프로필 position=${sticky}, 가로 넘침 ${of ? '있음' : '없음'}`, '01-home-1440.png');
    await context.close(); }

  // 2. 홈 390 (휴대폰)
  { const { context, page } = await newPage(browser, 390, 844, { colorScheme: 'light', isMobile: true, hasTouch: true });
    await page.goto(BASE + '/'); await page.waitForTimeout(2500);
    const cols = await page.evaluate(() => getComputedStyle(document.querySelector('.activity-grid')).gridTemplateColumns.split(' ').length);
    const of = await overflow(page);
    await page.screenshot({ path: path.join(OUT, '02-home-390.png'), fullPage: true });
    record(2, '홈 화면 390px', !of && cols === 1, `카드 ${cols}열, 가로 넘침 ${of ? '있음' : '없음'}`, '02-home-390.png');
    await context.close(); }

  // 3. 분야 필터
  { const { context, page } = await newPage(browser, 1440, 900, { colorScheme: 'light' });
    await page.goto(BASE + '/'); await page.waitForTimeout(1500);
    await page.getByRole('button', { name: /앱 개발/ }).click();
    const visible = await page.$$eval('.activity-grid > li[data-category]', (lis) => lis.filter((l) => !l.hidden).map((l) => l.querySelector('.activity-title').textContent.trim()));
    const pressed = await page.$eval('.filter-btn[aria-pressed=true]', (b) => b.textContent.trim());
    const status = await page.$eval('#activity-filter-status', (p) => p.textContent);
    await page.screenshot({ path: path.join(OUT, '03-filter-app.png') });
    await page.getByRole('button', { name: /전체/ }).click();
    const all = await page.$$eval('.activity-grid > li[data-category]:not([hidden])', (l) => l.length);
    const ok = visible.length === 1 && /InstaClone/.test(visible[0]) && all === 2;
    record(3, '분야 필터 (앱 개발 → 전체)', ok, `앱 개발: ${visible.join(', ')} / 눌린 버튼 "${pressed}" / 안내 "${status}" / 전체로 돌아가면 ${all}개`, '03-filter-app.png');
    await context.close(); }

  // 4. 다크 모드 한 번에 전환
  { const { context, page } = await newPage(browser, 1440, 900, { colorScheme: 'light' });
    await page.goto(BASE + '/'); await page.waitForTimeout(1500);
    const before = await page.getAttribute('body', 'theme');
    const label1 = await page.$eval('.theme-switch', (b) => b.getAttribute('aria-label') || b.title);
    await page.click('.menu .theme-switch, .theme-switch');
    await page.waitForTimeout(500);
    const after = await page.getAttribute('body', 'theme');
    const label2 = await page.$eval('.theme-switch', (b) => b.getAttribute('aria-label') || b.title);
    await page.screenshot({ path: path.join(OUT, '04-dark-1440.png') });
    record(4, '다크 모드 버튼 1번 클릭', before === 'light' && after === 'dark', `클릭 전 ${before}("${label1}") → 1번 클릭 후 ${after}("${label2}")`, '04-dark-1440.png');
    await context.close(); }

  // 5. 활동 목록 미리보기
  { const { context, page } = await newPage(browser, 1440, 900, { colorScheme: 'light' });
    await page.goto(BASE + '/posts/'); await page.waitForTimeout(1500);
    const link = page.locator('.archive-item a').first();
    await link.hover(); await page.waitForTimeout(600);
    const shown = await page.$$eval('.archive-preview', (ps) => ps.filter((p) => getComputedStyle(p).visibility === 'visible' && +getComputedStyle(p).opacity > 0.5).length);
    await page.screenshot({ path: path.join(OUT, '05-posts-preview.png') });
    record(5, '활동 목록 제목에 마우스 올리기', shown === 1, `보이는 미리보기 카드 ${shown}개`, '05-posts-preview.png');
    await context.close(); }

  // 6. 404 페이지
  { const { context, page } = await newPage(browser, 390, 844, { colorScheme: 'light', isMobile: true, hasTouch: true });
    const res = await page.goto(BASE + '/no-such-page/'); await page.waitForTimeout(1000);
    const links = await page.$$eval('main a', (as) => as.map((a) => a.textContent.trim()).filter(Boolean));
    await page.screenshot({ path: path.join(OUT, '06-404-390.png') });
    record(6, '없는 주소 열기 (390px)', res.status() === 404 && links.length >= 3, `응답 ${res.status()}, 버튼: ${links.join(' / ')}`, '06-404-390.png');
    await context.close(); }

  // 7. 키보드: 본문 바로가기
  { const { context, page } = await newPage(browser, 1440, 900, { colorScheme: 'light' });
    await page.goto(BASE + '/'); await page.waitForTimeout(1000);
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement.textContent.trim());
    await page.screenshot({ path: path.join(OUT, '07-skip-link.png') });
    await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    const target = await page.evaluate(() => document.activeElement.id);
    record(7, '키보드 Tab 1번 → Enter', focused === '본문으로 건너뛰기' && target === 'main-content', `처음 초점 "${focused}" → Enter 후 초점 #${target}`, '07-skip-link.png');
    await context.close(); }

  // 8. 관리자 모드와 활동 추가 창
  { const { context, page } = await newPage(browser, 1440, 900, { colorScheme: 'light' });
    await page.goto(BASE + '/'); await page.waitForTimeout(800);
    const hiddenBefore = await page.$eval('#activity-add-link', (a) => getComputedStyle(a.closest('li')).display === 'none');
    await page.goto(BASE + '/?admin'); await page.waitForTimeout(800);
    await page.click('#activity-add-link');
    const open = await page.$eval('#activity-dialog', (d) => d.open);
    const focus = await page.evaluate(() => document.activeElement.id);
    await page.screenshot({ path: path.join(OUT, '08-admin-add.png') });
    await page.keyboard.press('Escape');
    await page.goto(BASE + '/?admin=off'); await page.waitForTimeout(500);
    const hiddenAfter = await page.$eval('#activity-add-link', (a) => getComputedStyle(a.closest('li')).display === 'none');
    record(8, '관리자 모드(?admin)와 활동 추가 창', hiddenBefore && open && focus === 'af-title' && hiddenAfter,
      `평소 ⊕ ${hiddenBefore ? '숨김' : '보임'} → ?admin 후 창 열림 ${open}, 첫 초점 #${focus} → ?admin=off 후 ${hiddenAfter ? '숨김' : '보임'}`, '08-admin-add.png');
    await context.close(); }

  // 9. 움직임 줄이기 설정에서 소개 문장
  { const { context, page } = await newPage(browser, 390, 844, { colorScheme: 'light', reducedMotion: 'reduce', isMobile: true, hasTouch: true });
    await page.goto(BASE + '/'); await page.waitForTimeout(1500);
    const visible = await page.$eval('.subtitle-text', (s) => s.getBoundingClientRect().width > 10 ? s.textContent.trim() : '');
    await page.screenshot({ path: path.join(OUT, '09-reduced-motion-390.png') });
    record(9, '움직임 줄이기 설정 + 390px', visible.length > 0, `소개 문장 "${visible}" 바로 보임`, '09-reduced-motion-390.png');
    await context.close(); }

  // 10. 활동 글 390
  { const { context, page } = await newPage(browser, 390, 844, { colorScheme: 'light', isMobile: true, hasTouch: true });
    await page.goto(BASE + '/posts/portfolio-site/'); await page.waitForTimeout(1500);
    const of = await overflow(page);
    const imgs = await page.$$eval('img', (im) => im.filter((i) => !i.alt || /\.(png|svg|jpg)$/.test(i.alt)).length);
    await page.screenshot({ path: path.join(OUT, '10-post-390.png') });
    record(10, '활동 글 화면 390px', !of && imgs === 0, `가로 넘침 ${of ? '있음' : '없음'}, 설명 없는 이미지 ${imgs}개`, '10-post-390.png');
    await context.close(); }

  // 11. 휴대폰 메뉴를 키보드로 열기
  { const { context, page } = await newPage(browser, 390, 844, { colorScheme: 'light', isMobile: true, hasTouch: true });
    await page.goto(BASE + '/'); await page.waitForTimeout(1000);
    let tabs = 0; let id = '';
    while (tabs < 6 && id !== 'menu-toggle-mobile') { await page.keyboard.press('Tab'); tabs++; id = await page.evaluate(() => document.activeElement.id); }
    const name = await page.evaluate(() => document.activeElement.getAttribute('aria-label'));
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
    await page.keyboard.press('Enter'); await page.waitForTimeout(400);
    const open = await page.evaluate(() => [getComputedStyle(document.getElementById('menu-mobile')).display, document.getElementById('menu-toggle-mobile').getAttribute('aria-expanded')]);
    await page.screenshot({ path: path.join(OUT, '11-mobile-menu-390.png') });
    await page.locator('#menu-mobile a', { hasText: '소개' }).click(); await page.waitForTimeout(800);
    const arrived = new URL(page.url()).pathname;
    record(11, '390px 메뉴를 키보드로 열고 이동', id === 'menu-toggle-mobile' && open[0] !== 'none' && open[1] === 'true' && arrived === '/about/',
      `Tab ${tabs}번에 메뉴 버튼("${name}", 초점 테두리 ${outline}) → Enter 후 메뉴 표시(${open[0]}, aria-expanded=${open[1]}) → '소개' 선택 시 ${arrived}`, '11-mobile-menu-390.png');
    await context.close(); }

  // 12. 태블릿 768px 모든 페이지
  { const { context, page } = await newPage(browser, 768, 1024, { colorScheme: 'light' });
    const pages = ['/', '/about/', '/posts/', '/posts/portfolio-site/', '/posts/instaclone/'];
    const bad = [];
    for (const p of pages) { await page.goto(BASE + p); await page.waitForTimeout(700); if (await overflow(page)) bad.push(p); }
    await page.goto(BASE + '/about/'); await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, '12-about-768.png') });
    record(12, '768px에서 5개 페이지', bad.length === 0, `가로 넘침 있는 페이지 ${bad.length ? bad.join(', ') : '없음'} (${pages.length}개 확인)`, '12-about-768.png');
    await context.close(); }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ version, started: started.toISOString(), results }, null, 2));
  console.log('Chromium', version, started.toISOString());
})();
