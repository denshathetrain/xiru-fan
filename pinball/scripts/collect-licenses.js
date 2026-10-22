// 빌드 결과(dist)와 함께 배포되는 라이브러리의 라이선스 파일을 dist/licenses 로 모은다.
// 원작(마블 룰렛, MIT) 라이선스도 같이 넣는다. 배포물에는 저작권 고지가 따라가야 한다.

const { cpSync, existsSync, mkdirSync, readdirSync } = require('node:fs');
const { join } = require('node:path');

const out = join('dist', 'licenses');
mkdirSync(out, { recursive: true });

cpSync('LICENSE', join(out, 'marble-roulette-LICENSE.txt'));

for (const name of ['box2d-wasm']) {
  const dir = join('node_modules', name);
  if (!existsSync(dir)) {
    console.warn(`[licenses] ${name} 폴더가 없어 건너뜁니다`);
    continue;
  }
  for (const file of readdirSync(dir)) {
    if (/^(licen[sc]e|notice|copying)/i.test(file)) {
      cpSync(join(dir, file), join(out, `${name}-${file}`));
    }
  }
}

console.log('[licenses] dist/licenses 에 라이선스 파일을 모았습니다');
