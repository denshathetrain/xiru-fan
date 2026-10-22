import './localization';
import options from './options';
import { Roulette } from './roulette';

// 광고, 방문 분석, 외부 서버 연결은 없다. 화면(HTML)은 window.roulette 만 부르면 된다.
const roulette = new Roulette();

(window as any).roulette = roulette;
(window as any).options = options;
