!function(e){function t(t){for(var o,l,i=t[0],s=t[1],d=t[2],h=0,u=[];h<i.length;h++)l=i[h],Object.prototype.hasOwnProperty.call(r,l)&&r[l]&&u.push(r[l][0]),r[l]=0;for(o in s)Object.prototype.hasOwnProperty.call(s,o)&&(e[o]=s[o]);for(c&&c(t);u.length;)u.shift()();return a.push.apply(a,d||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],o=!0,i=1;i<n.length;i++){var s=n[i];0!==r[s]&&(o=!1)}o&&(a.splice(t--,1),e=l(l.s=n[0]))}return e}var o={},r={0:0},a=[];function l(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,l),n.l=!0,n.exports}l.m=e,l.c=o,l.d=function(e,t,n){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},l.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(l.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)l.d(n,o,function(t){return e[t]}.bind(null,o));return n},l.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="";var i=window.webpackJsonp=window.webpackJsonp||[],s=i.push.bind(i);i.push=t,i=i.slice();for(var d=0;d<i.length;d++)t(i[d]);var c=s;a.push([5,1]),n()}([,function(e,t,n){var o=n(2),r=n(3);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var a={insert:"head",singleton:!1};o(r,a);e.exports=r.locals||{}},,function(e,t,n){(t=n(4)(!1)).push([e.i,":root {\n  /** Colors */\n  --color-black: #000000;\n  --color-white: #ffffff;\n\n  --color-highlight: #FED8B1;\n\n  /** Font sizes */\n  --font-size-s: 16px;\n  --font-size-m: 20px;\n  --font-size-l: 24px;\n\n  /** Sizes */\n  --size-s: 8px;\n  --size-m: 16px;\n  --size-l: 32px;\n}\n\nbody {\n  font-family: 'Open Sans';\n  margin: 0;\n  padding: 0;\n}\n\nheader {\n  background-color: var(--color-white);\n  padding: var(--size-s) var(--size-m);\n}\n\nheader > h1 {\n  font-size: var(--font-size-l);\n  margin: 0;\n}\n\nmain {\n  padding: var(--size-s) var(--size-m);\n}\n\n#loading-indicator {\n  display: none;\n}\n\n.loading #loading-indicator {\n  display: block;\n}",""]),e.exports=t},,function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o);const a=[[5,5,5]],l=[{color:[104,254,47],thresholdMax:27,thresholdMin:17},{color:[182,167,114],thresholdMax:3,thresholdMin:19},{color:[196,189,125],thresholdMax:18,thresholdMin:10},{color:[115,115,115],thresholdMax:4,thresholdMin:0},{color:[249,255,114],thresholdMax:9,thresholdMin:10},{color:[124,109,250],thresholdMax:13,thresholdMin:8},{color:[253,253,253],thresholdMax:16,thresholdMin:0},{color:[253,253,253],thresholdMax:10,thresholdMin:10},{color:[253,253,253],thresholdMax:10,thresholdMin:10},{color:[253,253,253],thresholdMax:10,thresholdMin:10}];n(1);r.a.overrideDefaults({layout:"center",theme:"metroui",timeout:3e3});const i=e=>{e?document.querySelector("body").classList.add("loading"):!1===e?document.querySelector("body").classList.remove("loading"):document.querySelector("body").classList.toggle("loading")},s=function(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;return e[0]-n<=t[0]&&e[0]+o>=t[0]&&e[1]-n<=t[1]&&e[1]+o>=t[1]&&e[2]-n<=t[2]&&e[2]+o>=t[2]};document.addEventListener("paste",e=>{if(e.preventDefault(),!document.querySelector("body").classList.contains("loading"))try{var t;const n=document.querySelector("canvas"),o=n.getContext("2d"),r=document.createElement("canvas"),d=r.getContext("2d");i(!0);const{items:c}=e.clipboardData,h=null===(t=Array.from(c).find(e=>e.type.includes("image")))||void 0===t?void 0:t.getAsFile(),u=new FileReader,f=new Image;u.onload=e=>{f.src=e.target.result},f.onload=e=>{r.height=f.height,r.width=f.width,d.drawImage(f,0,0);const t=function e(t,n){let o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;const r=l[o];let i;for(let e=0;e<n.height;e++){for(let o=0;o<n.width;o++){for(let n=0;n<4;n++){const a=t.getImageData(o+n,e+n,1,1);if(!s(a.data,r.color,r.thresholdMin,r.thresholdMax)){i=null;break}i||(i=[o,e])}if(i){const e=i[0]-50;let n=!0;for(let o=0;o<3;o++){const r=i[1]+20*o;for(let o=0;o<15;o++){const l=t.getImageData(e+o,r,1,1);if(!s(l.data,a[0],17,16)){n=!1;break}}}if(n)break;i=null}}if(i)break}return i?[i[0]-5,i[1]-5]:++o<l.length?e(t,n,o):null}(d,f),{imageData:c}=((e,t,n)=>{let o,r,l,i;const d=n[0]-250>=0?n[0]-250:0,c=n[1]-30>=0?n[1]-30:0;for(let t=n[0];t>=d;t--){const o=e.getImageData(t,n[1],1,1);if(!s(o.data,a[0],17,16))break;l=t}if(void 0===l)return null;for(let t=n[1];t>=c;t--){const n=e.getImageData(l,t,1,1);if(!s(n.data,a[0],17,16))break;o=t}if(void 0===o)return null;for(let o=n[1];o<=t.height;o++){const t=e.getImageData(l,o,1,1);if(!s(t.data,a[0],17,16))break;r=o}if(void 0===r)return null;for(let r=n[0];r<t.width;r++){const t=e.getImageData(r,o,1,1);if(!s(t.data,a[0],17,16))break;i=r}return void 0===i?null:{imageData:e.getImageData(l,o+25,i-l,r-o-25),initLine:o,endLine:r,initColumn:l,endColumn:i}})(d,f,t);n.height=c.height,n.width=c.width,o.putImageData(c,0,0),i(!1)},u.readAsDataURL(h)}catch(e){i(!1),console.error(e)}})}]);
//# sourceMappingURL=main.daaf4e70.js.map