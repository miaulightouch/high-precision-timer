var t=Object.defineProperty,e=(e,s,i)=>(((e,s,i)=>{s in e?t(e,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[s]=i})(e,"symbol"!=typeof s?s+"":s,i),i);const s=(t=0)=>{try{return t.toString().split(".")[1].length}catch(e){return 0}},i=(t=0,e=0)=>{const i=s(t),r=s(e),n=Math.pow(10,Math.max(i,r));return(t*n+e*n)/n},r=(t=0,e=0)=>{const i=s(t),r=s(e),n=Math.pow(10,Math.max(i,r));return Number(((t*n-e*n)/n).toFixed(i>=r?i:r))},n=(t=0,e=0)=>{const i=s(t),r=s(e)-i;return Number(t.toString().replace(".",""))/Number(e.toString().replace(".",""))*Math.pow(10,r)};let{requestAnimationFrame:a}=self;class h{constructor(){if(e(this,"mean",((t=0)=>t)),e(this,"sum",0),e(this,"times",[]),e(this,"preTime",performance.now()),this.mean=this.gmean,"function"!=typeof a){let t=()=>{};onmessage=e=>"number"==typeof e.data&&t(e.data),a=e=>{t!==e&&(t=e)},postMessage("raf polyfill")}else postMessage("finish");a((t=>this.prepare(t)))}amean(t=0){if(this.times.push(t),this.sum=i(this.sum,t),this.times.length>720){const t=this.times.splice(0,this.times.length-720);this.sum-=t.reduce(i,0)}return n(this.sum,this.times.length)}gmean(t=0){const e=Math.log(t),s=this.amean(e);return Math.exp(s)}prepare(t){a((t=>{this.times.length<=120?this.prepare(t):(this.times.length=0,this.sum=0,this.handler(t))})),this.mean(r(t,this.preTime)),this.preTime=t}handler(t){a((t=>this.handler(t)));const e=this.mean(r(t,this.preTime));this.preTime=t;const s=n(1e3,e),i=new Date,h=i.getHours().toString().padStart(2,"0"),m=i.getMinutes().toString().padStart(2,"0"),o=i.getSeconds().toString().padStart(2,"0"),p=i.getMilliseconds().toString().padStart(3,"0");this.send(s,`${h}:${m}:${o}.${p}`)}send(t=0,e=""){postMessage({framerate:t,timestamp:e})}setSender(t){this.send=t}}var m=new h;export default m;export{h as Timer};
