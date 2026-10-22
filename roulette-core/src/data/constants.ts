import type { ColorTheme } from '../types/ColorTheme';

export const initialZoom = 30;
export const canvasWidth = 1600;
export const canvasHeight = 900;
export const zoomThreshold = 5;
export const STUCK_DELAY = 5000;
export const winnerAreaHeight = 168;

export enum Skills {
  None,
  Impact,
}

export const DefaultEntityColor = {
  box: 'cyan',
  circle: 'yellow',
  polyline: 'white',
} as const;

export const DefaultBloomColor = {
  box: 'cyan',
  circle: 'yellow',
  polyline: 'cyan',
};

// 핑크 테마. 배경색은 assets/style.css 의 --canvas-bg 와 맞춰 두었다.
export const Themes: Record<string, ColorTheme> = {
  light: {
    background: '#fff0f5',
    marbleLightness: 55,
    marbleWinningBorder: '#7a2347',
    skillColor: '#e0457b',
    coolTimeIndicator: '#c9a3b4',
    entity: {
      box: {
        fill: '#ff8fb3',
        outline: '#7a2347',
        bloom: '#ff8fb3',
        bloomRadius: 0,
      },
      circle: {
        fill: '#ffd1e3',
        outline: '#e0457b',
        bloom: '#ffd1e3',
        bloomRadius: 0,
      },
      polyline: {
        fill: '#ffffff',
        outline: '#7a2347',
        bloom: '#ff8fb3',
        bloomRadius: 0,
      },
    },
    rankStroke: '#7a2347',
    minimapBackground: '#fff8fb',
    minimapViewport: '#e0457b',

    winnerBackground: 'rgba(255, 255, 255, 0.6)',
    winnerOutline: '#7a2347',
    winnerText: '#ffffff',
  },
  dark: {
    background: '#0d0810',
    marbleLightness: 75,
    marbleWinningBorder: '#ffd6e6',
    skillColor: '#ffd6e6',
    coolTimeIndicator: '#ff6c87',
    entity: {
      box: {
        fill: '#ff8fb3',
        outline: '#ff8fb3',
        bloom: '#ff4f93',
        bloomRadius: 15,
      },
      circle: {
        fill: '#ffd6e6',
        outline: '#ffd6e6',
        bloom: '#ff9abd',
        bloomRadius: 15,
      },
      polyline: {
        fill: '#fff5f8',
        outline: '#fff5f8',
        bloom: '#ff4f93',
        bloomRadius: 15,
      },
    },
    rankStroke: '',
    minimapBackground: '#1d1322',
    minimapViewport: '#ff9abd',
    winnerBackground: 'rgba(13, 8, 16, 0.6)',
    winnerOutline: '#2a0f1a',
    winnerText: '#fff5f8',
  },
};
