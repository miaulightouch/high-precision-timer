import './style.css'

const timer = document.querySelector<HTMLDivElement>('#timer')!
const fps = document.querySelector<HTMLSpanElement>('#fps')!
const dots = document.querySelector<HTMLDivElement>('#dots')!

const genDots = (id: number) => `<div class="dot dot-${id}">${id.toString().padStart(2, '0')}</div>`;

const times: number[] = [];
let preTime = performance.now() | 0;
let dotCount = 0;
const handler = () => {
  requestAnimationFrame(handler);
  const pTtime = performance.now() | 0;
  times.push(pTtime - preTime);
  preTime = pTtime;
  if (times.length < 100) return;
  times.splice(0, times.length - 100);
  const average = times.reduce((p, c) => p + c) / times.length; // Arithmetic mean
  // const average = Math.exp(times.reduce((p, c) => p + Math.log(c), 0) / times.length); // Geometric mean
  const framerate = 1000 / average;
  fps.innerHTML = `${framerate.toFixed(3)} fps`;
  const totalDots = Math.round(framerate);
  if (dots.children.length !== totalDots) {
    let html = '';
    for (let index = 0; index < totalDots; index++) html += genDots(index + 1);
    dots.innerHTML = html;
  }

  const time = new Date();
  const hour = time.getHours().toString().padStart(2, '0');
  const minute = time.getMinutes().toString().padStart(2, '0');
  const second = time.getSeconds().toString().padStart(2, '0');
  const ms = time.getMilliseconds().toString().padStart(3, '0');
  timer.innerHTML = `${hour}:${minute}:${second}:${ms}`;

  document.querySelector('.active')?.classList.remove('active');
  dotCount += 1;
  if (dotCount > totalDots) dotCount = 0;
  document.querySelector(`.dot-${dotCount}`)?.classList.add('active');
}
requestAnimationFrame(handler);
