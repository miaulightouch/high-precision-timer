import MobileDetect from 'mobile-detect';

import { add, sub, div } from './calc';
import './style.css'

const md = new MobileDetect(navigator.userAgent);
const isMobile = md.mobile();

const timer = document.querySelector<HTMLDivElement>('#timer')!
const fps = document.querySelector<HTMLSpanElement>('#fps')!
const dots = document.querySelector<HTMLDivElement>('#dots')!

const INIT_SAMPLES = 120;
const SAMPLES = 360;
const MAX_FPS = 360;

const times: number[] = [];
let sum = 0;

for (let index = 0; index < MAX_FPS; index++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  dot.innerText = `${index + 1}`.padStart(2, '0');
  dots.appendChild(dot);
}

/**
 * Arithmetic mean
 * @param ms
 * @returns
 */
const amean = (ms: number) => {
  times.push(ms);
  sum = add(sum, ms);
  if (times.length > SAMPLES) {
    const removed = times.splice(0, times.length - SAMPLES);
    sum -= removed.reduce(add, 0);
  }

  return div(sum, times.length);
}

/**
 * Geometric mean
 * @param ms
 * @returns
 */
const gmean = (ms: number) => {
  const log = Math.log(ms);
  const result = amean(log);
  return Math.exp(result);
};

const mean = gmean;

let preTime = performance.now();
let dotCount = 0;
const mainHandler = () => {
  requestAnimationFrame(mainHandler);
  new Promise(() => {
    if (times.length !== SAMPLES) {
      if (!fps.classList.contains('text-yellow')) fps.classList.add('text-yellow');
    } else {
      if (!fps.classList.contains('text-green')) fps.classList.add('text-green');
    }
  });
  const pTime = performance.now();
  const average = mean(sub(pTime, preTime));
  preTime = pTime;
  const framerate = div(1000, average);
  fps.innerHTML = `${framerate.toFixed(3)} fps`;

  const totalDots = Math.round(framerate);
  const enabledDots = document.querySelectorAll(".dot.enabled");
  if (enabledDots.length !== totalDots) {
    if (enabledDots.length > totalDots) {
      for (let index = totalDots; index <= enabledDots.length; index++) {
        if (enabledDots[index]) enabledDots[index].classList.remove('enabled');
      }
    } else {
      for (let index = enabledDots.length; index <= totalDots; index++) {
        dots.children[index].classList.add('enabled');
      }
    }
  }

  document.querySelector('.active')?.classList.remove('active');
  dotCount += 1;
  if (dotCount > totalDots) dotCount = 0;
  dots.children[dotCount]?.classList.add('active');

  const time = new Date();
  const hour = time.getHours().toString().padStart(2, '0');
  const minute = time.getMinutes().toString().padStart(2, '0');
  const second = time.getSeconds().toString().padStart(2, '0');
  const ms = time.getMilliseconds().toString().padStart(3, '0');
  timer.innerHTML = `${hour}:${minute}:${second}.${ms}`;
};
const prepareHandler = () => {
  requestAnimationFrame(times.length <= INIT_SAMPLES ? prepareHandler : mainHandler);
  const time = performance.now();
  mean(sub(time, preTime));
  preTime = time;
};

requestAnimationFrame(prepareHandler);

const dotPerLine = isMobile ? 10 : 15;
window.addEventListener('resize', () => {
  const baseWidth = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
  const itemWidth = baseWidth / dotPerLine;
  const margin = itemWidth / 5;
  document.documentElement.style.setProperty('--timer-font-size', `${baseWidth / 8}px`);
  document.documentElement.style.setProperty('--counter-font-size', `${baseWidth / 14}px`);
  document.documentElement.style.setProperty('--dots-width', `${baseWidth}px`);
  document.documentElement.style.setProperty('--dots-margin-left', `${(window.innerWidth - baseWidth + margin) / 2}px`);
  document.documentElement.style.setProperty('--dot-width', `${margin * 4}px`);
  document.documentElement.style.setProperty('--dot-font-size', `${margin * 2}px`);
  document.documentElement.style.setProperty('--dot-margin', `${margin}px`);
});
window.dispatchEvent(new Event('resize'));
