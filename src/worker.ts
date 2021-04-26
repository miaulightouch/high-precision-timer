declare var self: DedicatedWorkerGlobalScope;

import { add, sub, div } from './calc';

const INIT_SAMPLES = 120;
const SAMPLES = 720;

export class Timer {
  constructor() {
    this.mean = this.gmean;
    self.requestAnimationFrame(() => this.prepare());
  }

  mean: (ms: number) => number;

  sum = 0;

  times: number[] = [];

  preTime = performance.now();

  /**
   * Arithmetic mean
   * @param ms
   * @returns
   */
  amean(ms: number) {
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
  gmean (ms: number) {
    const log = Math.log(ms);
    const result = this.amean(log);
    return Math.exp(result);
  };

  prepare() {
    self.requestAnimationFrame(() => {
      if (this.times.length <= INIT_SAMPLES) {
        this.prepare();
      } else {
        this.times.length = 0;
        this.sum = 0;
        this.handler();
      }
    },
    );
    const time = performance.now();
    this.mean(sub(time, this.preTime));
    this.preTime = time;
  }

  handler() {
    self.requestAnimationFrame(() => this.handler());
    const time = performance.now();
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

  send(framerate: number, timestamp: string) {
    self.postMessage({ framerate, timestamp })
  }

  setSender(callback: (framerate: number, timestamp: string) => void) {
    this.send = callback;
  }
}

export default new Timer();
