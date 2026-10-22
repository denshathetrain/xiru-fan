import './localization';
import { initMapSelector } from './mapSelector';
import options from './options';
import { Roulette } from './roulette';

// 원작에 있던 광고, 방문 분석, 맵 공유마당(외부 서버) 연결은 이 사이트에서 쓰지 않는다.
// 맵은 프로그램에 들어 있는 기본 맵만 쓴다.
const roulette = new Roulette();

(window as any).roulette = roulette;
(window as any).options = options;

// index.html 이 초기화할 때 부른다
(window as any).initMapSelector = (onMapChange: () => void, toast: (key: string) => void) =>
  initMapSelector({ roulette, apiBase: '', onMapChange, toast, mapBrowser: false });
