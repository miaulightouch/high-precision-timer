import{m as e}from"./vendor.57134fed.js";!function(e=".",t="__import__"){try{self[t]=new Function("u","return import(u)")}catch(n){const o=new URL(e,location),r=e=>{URL.revokeObjectURL(e.src),e.remove()};self[t]=e=>new Promise(((n,s)=>{const i=new URL(e,o);if(self[t].moduleMap[i])return n(self[t].moduleMap[i]);const c=new Blob([`import * as m from '${i}';`,`${t}.moduleMap['${i}']=m;`],{type:"text/javascript"}),l=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(c),onerror(){s(new Error(`Failed to import: ${e}`)),r(l)},onload(){n(self[t].moduleMap[i]),r(l)}});document.head.appendChild(l)})),self[t].moduleMap={}}}("assets/");const t=e=>{try{return e.toString().split(".")[1].length}catch(t){return 0}},n=(e,n)=>{const o=t(e),r=t(n),s=Math.pow(10,Math.max(o,r));return(e*s+n*s)/s},o=(e,n)=>{const o=t(e),r=t(n),s=Math.pow(10,Math.max(o,r));return Number(((e*s-n*s)/s).toFixed(o>=r?o:r))},r=(e,n)=>{const o=t(e),r=t(n)-o;return Number(e.toString().replace(".",""))/Number(n.toString().replace(".",""))*Math.pow(10,r)};const s=new e(navigator.userAgent).mobile(),i=document.querySelector("#timer"),c=document.querySelector("#fps"),l=document.querySelector("#dots"),d=[];let a=0;for(let f=0;f<360;f++){const e=document.createElement("div");e.classList.add("dot"),e.innerText=`${f+1}`.padStart(2,"0"),l.appendChild(e)}const m=e=>{const t=(e=>{if(d.push(e),a=n(a,e),d.length>360){const e=d.splice(0,d.length-360);a-=e.reduce(n,0)}return r(a,d.length)})(Math.log(e));return Math.exp(t)};let u=performance.now(),p=0;const h=()=>{var e,t;requestAnimationFrame(h),new Promise((()=>{360!==d.length?c.classList.contains("text-yellow")||c.classList.add("text-yellow"):c.classList.contains("text-green")||c.classList.add("text-green")}));const n=performance.now(),s=m(o(n,u));u=n;const a=r(1e3,s);c.innerHTML=`${a.toFixed(3)} fps`;const w=Math.round(a),g=document.querySelectorAll(".dot.enabled");if(g.length!==w)if(g.length>w)for(let o=w;o<=g.length;o++)g[o]&&g[o].classList.remove("enabled");else for(let o=g.length;o<=w;o++)l.children[o].classList.add("enabled");null==(e=document.querySelector(".active"))||e.classList.remove("active"),p+=1,p>w&&(p=0),null==(t=l.children[p])||t.classList.add("active");const f=new Date,y=f.getHours().toString().padStart(2,"0"),x=f.getMinutes().toString().padStart(2,"0"),L=f.getSeconds().toString().padStart(2,"0"),S=f.getMilliseconds().toString().padStart(3,"0");i.innerHTML=`${y}:${x}:${L}.${S}`},w=()=>{requestAnimationFrame(d.length<=120?w:h);const e=performance.now();m(o(e,u)),u=e};requestAnimationFrame(w);const g=s?10:15;window.addEventListener("resize",(()=>{const e=window.innerHeight>window.innerWidth?window.innerWidth:window.innerHeight,t=e/g/5;document.documentElement.style.setProperty("--timer-font-size",e/7+"px"),document.documentElement.style.setProperty("--counter-font-size",e/8+"px"),document.documentElement.style.setProperty("--dots-width",`${e}px`),document.documentElement.style.setProperty("--dots-margin-left",(window.innerWidth-e+t)/2+"px"),document.documentElement.style.setProperty("--dot-width",4*t+"px"),document.documentElement.style.setProperty("--dot-font-size",2*t+"px"),document.documentElement.style.setProperty("--dot-margin",`${t}px`)})),window.dispatchEvent(new Event("resize"));
