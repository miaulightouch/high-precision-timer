import { add, sub, div } from './calc';

const INIT_SAMPLES = 120;
const SAMPLES = 720;

let { requestAnimationFrame } = self;
export class Timer {
  constructor() {
    this.mean = this.gmean;
    if (typeof requestAnimationFrame !== 'function') {
      let callback = () => {};
      onmessage = (e) => typeof e.data === 'number' && callback(e.data);

      requestAnimationFrame = (func) => { if (callback !== func) callback = func; }

      postMessage('raf polyfill');
    } else {
      postMessage('finish');
    }
    requestAnimationFrame((ms) => this.prepare(ms))
  }

  mean = (ms = 0) => ms;

  sum = 0;

  times = [];

  preTime = performance.now();

  /**
   * Arithmetic mean
   * @param ms
   * @returns
   */
  amean(ms = 0) {
    this.times.push(ms);
    this.sum = add(this.sum, ms);
    if (this.times.length > SAMPLES) {
      const removed = this.times.splice(0, this.times.length - SAMPLES);
      this.sum -= removed.reduce(add, 0);
    }

    return div(this.sum, this.times.length);
  }

  /**
   * Geometric mean
   * @param ms
   * @returns
   */
  gmean (ms = 0) {
    const log = Math.log(ms);
    const result = this.amean(log);
    return Math.exp(result);
  };

  prepare(time) {
    requestAnimationFrame((input) => {
      if (this.times.length <= INIT_SAMPLES) {
        this.prepare(input);
      } else {
        this.times.length = 0;
        this.sum = 0;
        this.handler(input);
      }
    });
    this.mean(sub(time, this.preTime));
    this.preTime = time;
  }

  handler(time) {
    requestAnimationFrame((input) => this.handler(input));
    const average = this.mean(sub(time, this.preTime));
    this.preTime = time;

    const framerate = div(1000, average);

    const timer = new Date();
    const hour = timer.getHours().toString().padStart(2, '0');
    const minute = timer.getMinutes().toString().padStart(2, '0');
    const second = timer.getSeconds().toString().padStart(2, '0');
    const ms = timer.getMilliseconds().toString().padStart(3, '0');

    this.send(framerate, `${hour}:${minute}:${second}.${ms}`);
  }

  send(framerate = 0, timestamp = '') {
    postMessage({ framerate, timestamp })
  }

  setSender(callback) {
    this.send = callback;
  }
}

export default new Timer();
