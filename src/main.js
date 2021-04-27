import MobileDetect from 'mobile-detect';

import Worker from './worker?worker';
import './assets/style.css';

const md = new MobileDetect(navigator.userAgent);
const isMobile = md.mobile();

const timer = document.querySelector('#timer');
const fps = document.querySelector('#fps');
const dots = document.querySelector('#dots');
let dotCount = 0;

const SAMPLES = 360;
const MAX_FPS = 360;

for (let index = 0; index < MAX_FPS; index++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  dot.innerText = `${index + 1}`.padStart(2, '0');
  dots.appendChild(dot);
}

let count = 0

const handler = (m) => {
  count += 1;
  const { framerate, timestamp } = m;
  timer.innerText = timestamp;
  fps.innerText = `${framerate.toFixed(3)} fps`;
  if (count === SAMPLES) fps.classList.add('text-green');

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
}

(async () => {
  // iOS didn't support module worker
  if ('Worker' in window && md.os() !== 'iOS') {
    const worker = new Worker();
    worker.onmessage = (e) => {
      if (e.data !== 'finish') {
        const callback = (ms) => {
          requestAnimationFrame(callback);
          worker.postMessage(ms);
        }
        requestAnimationFrame(callback);
      }
      worker.onmessage = (ev) => handler(ev.data);
    }
  } else {
    const worker = await import('./worker');
    worker.default.setSender(
      (framerate, timestamp) => handler({ framerate, timestamp }),
    )
  }
})();

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
