import { add, sub, div } from './calc';
import './style.css'

const timer = document.querySelector<HTMLDivElement>('#timer')!
const fps = document.querySelector<HTMLSpanElement>('#fps')!
const dots = document.querySelector<HTMLDivElement>('#dots')!

const INIT_SAMPLES = 120;
const SAMPLES = 360;

const times: number[] = [];
let sum = 0;

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
  if (times.length !== SAMPLES) {
    if (!fps.classList.contains('text-yellow')) fps.classList.add('text-yellow');
  } else {
    if (!fps.classList.contains('text-green')) fps.classList.add('text-green');
  }
  const pTime = performance.now();
  const average = mean(sub(pTime, preTime));
  preTime = pTime;
  const framerate = div(1000, average);
  fps.innerHTML = `${framerate.toFixed(3)} fps`;

  const totalDots = Math.round(framerate);
  if (dots.children.length !== totalDots) {
    if (dots.children.length > totalDots) {
      for (let index = totalDots; index <= dots.children.length; index++) {
        if (dots.children[index]) dots.removeChild(dots.children[index]);
      }
    } else {
      for (let index = dots.children.length; index <= totalDots; index++) {
        const dot = document.createElement('div');
        dot.classList.add('dot', `dot-${index}`);
        dot.innerText = `${index + 1}`.padStart(2, '0');
        dots.appendChild(dot);
      }
    }
  }

  const time = new Date();
  const hour = time.getHours().toString().padStart(2, '0');
  const minute = time.getMinutes().toString().padStart(2, '0');
  const second = time.getSeconds().toString().padStart(2, '0');
  const ms = time.getMilliseconds().toString().padStart(3, '0');
  timer.innerHTML = `${hour}:${minute}:${second}.${ms}`;

  document.querySelector('.active')?.classList.remove('active');
  dotCount += 1;
  if (dotCount > totalDots) dotCount = 0;
  document.querySelector(`.dot-${dotCount}`)?.classList.add('active');
};
const prepareHandler = () => {
  requestAnimationFrame(times.length <= INIT_SAMPLES ? prepareHandler : mainHandler);
  const time = performance.now();
  mean(sub(time, preTime));
  preTime = time;
};

requestAnimationFrame(prepareHandler);
