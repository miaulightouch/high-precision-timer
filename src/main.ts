import './style.css'

const timer = document.querySelector<HTMLDivElement>('#timer')!
const dots = document.querySelector<HTMLDivElement>('#dots')!
const fps = document.querySelector<HTMLSpanElement>('#fps')!
const internal = document.querySelector<HTMLSpanElement>('#internal')!

const genDots = (id: number) => `<div class="dot dot-${id}">${id.toString().padStart(2, '0')}</div>`;

const times: number[] = [];
let preTime = performance.now() | 0;
let dotCount = 0;
const handler = () => {
  requestAnimationFrame(handler);
  const pTtime = performance.now() | 0;
  times.push(pTtime - preTime);
  if (times.length > 100) times.shift();
  // const average = times.reduce((p, c) => p + c) / times.length;
  const average = Math.pow(times.reduce((p, c) => p * c), 1 / times.length);
  const framerate = 1000 / average;
  fps.innerHTML = `Display: ${framerate.toFixed(3)} fps`;
  const int = Math.floor(framerate);
  if (dots.children.length !== int) {
    let html = '';
    for (let index = 0; index < int; index++) html += genDots(index + 1);
    dots.innerHTML = html;
  }

  const time = new Date();
  const hour = time.getHours().toString().padStart(2, '0');
  const minute = time.getMinutes().toString().padStart(2, '0');
  const second = time.getSeconds().toString().padStart(2, '0');
  const ms = time.getMilliseconds().toString().padStart(3, '0');
  timer.innerHTML = `${hour}:${minute}:${second}:${ms}`;

  const activeElem = document.querySelector('.active')!;
  activeElem?.classList.remove('active');
  dotCount += 1;
  if (dotCount > int) dotCount = 0;
  const elem = document.querySelector(`.dot-${dotCount}`);
  elem?.classList.add('active');

  preTime = pTtime;
}
requestAnimationFrame(handler);

const internalTimes: number[] = [];
let internalPreTime = performance.now() | 0;
setInterval(() => {
  const pTime = performance.now() | 0;

  internalTimes.push(pTime - internalPreTime);
  if (internalTimes.length > 100) internalTimes.shift();
  // const average = internalTimes.reduce((p, c) => p + c) / internalTimes.length;
  const average = Math.pow(internalTimes.reduce((p, c) => p * c), 1 / internalTimes.length);
  internal.innerHTML = `Internal: ${(1000 / average).toFixed(3)} fps`
  internalPreTime = pTime;
});