import {S,ST,car} from './state.js';
import {W,H,drawWorld,targets,limitAt,zoneAt,traffic,stepTraffic,light,inInt,places,lamps} from './world.js';
import {stepCar,drawCarAt,cruiseToggle,cruiseAdj,cruiseLimit,M} from './car.js';
import {$,hud,clampHud,togglePhone,toast,dialog,fine} from './ui.js';
import {loadStory,checkEvents,getStory} from './events.js';
import {initMenu,openBook,openMap,closeOverlay,pauseGame,drawMap} from './menu.js';
import {load,save,applyCar,openShop,color} from './economy.js';
const cv=$('c'),g=cv.getContext('2d');let Z=1.6,VW=0,VH=0,cd=0,near=null,mmT=0;
const drops=Array.from({length:150},()=>[Math.random(),Math.random(),.6+Math.random()*.8]);
function resize(){cv.width=innerWidth;cv.height=innerHeight;Z=Math.max(1.2,Math.min(2.4,innerWidth/820));VW=innerWidth/Z;VH=innerHeight/Z}
addEventListener('resize',resize);resize();
const nearPlace=()=>{for(const p of places){if(!p.k)continue;const dx=Math.max(p.x-car.x,0,car.x-p.x-p.w),dy=Math.max(p.y-car.y,0,car.y-p.y-p.h);if(Math.hypot(dx,dy)<46)return p}return null};
addEventListener('keydown',e=>{if(e.repeat)return;const k=e.key.toLowerCase();
 if(ST.mode==='play'&&!S.pause&&!S.done){
  if(k==='p')togglePhone();else if(k==='m')openMap();else if(k==='h')openBook('rules');
  else if(k==='c')cruiseToggle();else if(k==='e')cruiseAdj(5);else if(k==='q')cruiseAdj(-5);
  else if(k==='l')cruiseLimit(limitAt(car.x));else if(k==='escape')pauseGame();
  else if(k==='f'&&near&&Math.abs(car.v)*.25<15)openShop(near.k);
 }else if(k==='escape'&&['book','map','pause','shop'].includes(ST.mode))closeOverlay();
 else if(k==='m'&&ST.mode==='map')closeOverlay();});
const pad=n=>String(n).padStart(2,'0');
function hudFrame(kmh,lim,dk){
 $('spd').textContent=kmh;$('lim').textContent=lim;
 const r=$('ring');r.style.setProperty('--p',Math.min(100,kmh/M.vmax*100));r.className=kmh>lim+3?'over':'';
 $('gear').textContent=car.v<-5?'R':kmh<3?'N':'D';
 $('crz').textContent=ST.cruise?'КРУИЗ '+Math.round(ST.cruiseV*.25)+' км/ч':'круиз выкл (C)';$('crz').className='glass'+(ST.cruise?' on':'');
 const mins=Math.floor(((ST.tod*24+6)%24)*60);
 $('zone').textContent=(dk>.2?'🌙 ':ST.rain?'🌧 ':'☀️ ')+pad(Math.floor(mins/60))+':'+pad(mins%60)+' · '+zoneAt(car.x).n;
 const tg=targets[S.task];$('goal').textContent=tg?'Цель: '+tg.n+' · '+(Math.round(Math.hypot(tg.x-car.x,tg.y-car.y)/10)*10)+' м':'Свободная поездка';
 if(near&&kmh<15){$('prompt').textContent='F — войти: '+near.n;$('prompt').classList.remove('hide')}else $('prompt').classList.add('hide');
 hud();mmT-=1;if(mmT<=0){mmT=15;drawMap($('mini'))}
}
function step(dt){
 S.t+=dt;ST.T+=dt;cd-=dt;stepTraffic(dt,ST.T);ST.tod=(S.t/300)%1;
 const {road,kmh,braking}=stepCar(dt);ST.br=braking;const lim=limitAt(car.x);
 S.fuel=Math.max(0,S.fuel-M.cons*(.01+.05*Math.abs(car.v)/(M.vmax/.25))*dt);
 if(ST.bump){if(ST.bump>25){S.dmg+=ST.bump*.04;S.law-=1;S.safe=0;toast('💥 Удар о препятствие','bad')}ST.bump=0;clampHud()}
 for(const c of traffic)if(cd<=0&&Math.hypot(c.x-car.x,c.y-car.y)<32){cd=1.2;car.v*=.3;S.dmg+=6;S.law-=4;S.safe=0;c.stun=1.5;toast('💥 Столкновение!','bad');clampHud()}
 const ix=inInt(car.x,car.y);
 if(ix!==ST.ix){if(ix>=0){const ax=Math.abs(Math.cos(car.a))>Math.abs(Math.sin(car.a))?'x':'y';if(light(ix,ax,ST.T)==='red'&&kmh>6)fine('Проезд на красный',500,12)}ST.ix=ix}
 const speeding=road&&kmh>lim+3;
 if(speeding){S.over+=dt;S.law-=2*dt;S.safe=0;clampHud()}else S.over=Math.max(0,S.over-dt*.3);
 if(!speeding&&kmh>5)S.safe+=dt;
 if(S.safe>30){S.safe=0;S.money+=50;toast('✅ Аккуратная езда: +50 ₸','ok');hud()}
 if(S.t>ST.rainAt){ST.rain=Math.random()<.35?1:0;ST.rainAt=S.t+60+Math.random()*60;toast(ST.rain?'🌧 Начался дождь: дорога скользкая':'☀️ Дождь закончился')}
 if(S.fuel<=0&&Math.abs(car.v)<8&&S.t>ST.tow){ST.tow=S.t+15;
  dialog('🛻 Дима-эвакуаторщик','«Бензин кончился? Отбуксирую до АЗС за 300 ₸. Деньги потом вычту, если нет».',
   [['Согласиться',()=>{S.money=Math.max(0,S.money-300);car.x=1230;car.y=505;car.a=0;car.v=0;S.fuel=5;toast('🛻 Вас отбуксировали к АЗС')}],['Подожду',()=>{}]])}
 const tg=targets[S.task];
 if(tg&&Math.hypot(tg.x-car.x,tg.y-car.y)<60){S.arrived=S.task;S.task='none';car.v=0;ST.cruise=0}
 near=nearPlace();checkEvents();hudFrame(kmh,lim,dkOf());
}
const dkOf=()=>Math.max(0,Math.sin(2*Math.PI*(ST.tod-.5)))*.62;
function draw(){
 g.setTransform(Z,0,0,Z,0,0);g.imageSmoothingEnabled=false;
 let cx,cy;
 if(ST.mode==='menu'){cx=(ST.T*50)%(W-VW);cy=Math.max(0,Math.min(H-VH,1070-VH/2))}
 else{cx=Math.max(0,Math.min(W-VW,car.x-VW/2));cy=Math.max(0,Math.min(H-VH,car.y-VH/2))}
 cx=Math.floor(cx);cy=Math.floor(cy);g.save();g.translate(-cx,-cy);
 drawWorld(g,cx,cy,VW,VH,ST.mode==='menu'?'':S.task,ST.T);
 for(const c of traffic)drawCarAt(g,c.x,c.y,c.ang,c.m,c.col,c.stun>0);
 if(ST.mode!=='menu')drawCarAt(g,car.x,car.y,car.a,M,color(),ST.br);
 g.restore();
 const dk=dkOf();
 if(dk>.02||ST.rain){g.fillStyle='rgba(8,14,40,'+(dk+(ST.rain?.14:0))+')';g.fillRect(0,0,VW,VH)}
 if(dk>.12){g.globalCompositeOperation='lighter';
  g.save();g.translate(car.x-cx,car.y-cy);g.rotate(car.a);const gr=g.createLinearGradient(22,0,180,0);gr.addColorStop(0,'rgba(255,240,170,'+dk*.6+')');gr.addColorStop(1,'rgba(255,240,170,0)');
  g.fillStyle=gr;g.beginPath();g.moveTo(22,-7);g.lineTo(180,-60);g.lineTo(180,60);g.lineTo(22,7);g.fill();g.restore();
  g.fillStyle='rgba(255,210,120,'+dk*.3+')';lamps.forEach(([x,y])=>{if(x>cx-30&&x<cx+VW+30&&y>cy-30&&y<cy+VH+30){g.beginPath();g.arc(x-cx,y-cy,18,0,7);g.fill()}});
  g.globalCompositeOperation='source-over'}
 if(ST.rain){g.strokeStyle='rgba(190,210,255,.5)';g.lineWidth=1;g.beginPath();
  for(const d of drops){const x=(d[0]*VW+ST.T*60*d[2])%VW,y=(d[1]*VH+ST.T*500*d[2])%VH;g.moveTo(x,y);g.lineTo(x-3,y+9)}g.stroke()}
 if(S.over>0&&ST.mode==='play'){g.fillStyle='#c4492fdd';g.fillRect(0,VH-26,VW,18);g.fillStyle='#fff';g.font='bold 10px sans-serif';g.textAlign='center';g.fillText('Превышение скорости! Сбавьте ход',VW/2,VH-13)}
}
let last=performance.now();
function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;
 if(S.pause)ST.cruise=0;
 if(ST.mode==='play'&&!S.pause&&!S.done)step(dt);
 else if(ST.mode==='menu'){ST.T+=dt;stepTraffic(dt,ST.T)}
 if(S.done&&!ST.saved){ST.saved=1;save()}
 draw();requestAnimationFrame(loop)}
load();applyCar();
loadStory().then(()=>{hud();initMenu(getStory(),()=>{hud();drawMap($('mini'))})});
requestAnimationFrame(loop);
