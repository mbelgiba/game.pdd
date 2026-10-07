import {CARS} from './cars.js';
// Мир: 3 зоны (город, трасса, деревня), дороги, места, деревья, трафик
export const W=4800,H=1600;
export const zones=[
 {id:'city',n:'Город «Новогорск»',x0:0,x1:2400,g:'#79a85a',lim:60},
 {id:'hwy',n:'Трасса М-7',x0:2400,x1:3800,g:'#8fa563',lim:90},
 {id:'vil',n:'Деревня «Липовка»',x0:3800,x1:4800,g:'#a3b862',lim:40}];
export const zoneAt=x=>zones.find(z=>x<z.x1)||zones[2];
export const limitAt=x=>zoneAt(x).lim;
const A='#4a4f5c',HW='#3b3f4a',D='#a98b5e';
export const roads=[[0,400,2400,140,A],[0,1000,2400,140,A],[600,0,140,H,A],[1500,0,140,H,A],[2400,1000,1400,140,HW],[3800,1000,1000,140,D],[4250,640,140,500,D]];
const KD={gas:'gas',hgas:'gas',garage:'garage',dealer:'dealer'};
const P=(id,n,x,y,w,h,c,z)=>({id,n,x,y,w,h,c,z,k:KD[id]});
export const places=[
 P('home','Дом',760,1150,100,70,'#d98f78','city'),P('store','Магазин Тамары',1660,330,120,70,'#e0b64f','city'),
 P('school','Школа',770,230,150,100,'#c9c27a','city'),P('gas','АЗС',1180,300,100,70,'#6fa8dc','city'),
 P('garage','Автосервис «Гараж 24»',470,620,110,80,'#8a8f9c','city'),P('dealer','Автосалон',1950,300,150,90,'#c44a5a','city'),P('police','Полиция',1100,620,110,70,'#4a6fb5','city'),
 P('market','Рынок',850,780,200,100,'#c97b4a','city'),P('hospital','Больница',1700,1180,160,110,'#e8e8f0','city'),
 P('cafe','Кафе',1750,640,110,70,'#b5835a','city'),
 P('hgas','АЗС «Трасса»',2900,900,110,70,'#6fa8dc','hwy'),P('truck','Кафе дальнобойщиков',3200,1160,130,80,'#a86f4a','hwy'),
 P('dps','Пост ДПС',3500,900,70,60,'#4a6fb5','hwy'),
 P('zina','Дом бабушки Зины',4400,850,90,70,'#c98f6a','vil'),P('farm','Ферма Бориса',4500,1180,200,120,'#9c6b3f','vil'),
 P('vshop','Магазин «Липовка»',4050,880,100,70,'#d3a85a','vil')];
export const targets={store:{x:1720,y:445,n:'Магазин Тамары'},home:{x:810,y:1125,n:'Дом'}};
export function onRoad(x,y,m=0){return roads.some(r=>x>r[0]-m&&x<r[0]+r[2]+m&&y>r[1]-m&&y<r[1]+r[3]+m)}
export function solid(x,y){return places.some(p=>x>p.x-8&&x<p.x+p.w+8&&y>p.y-8&&y<p.y+p.h+8)}
let seed=11;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
const trees=[];for(let i=0;i<420;i++){const x=rnd()*W,y=rnd()*H;if(!onRoad(x,y,36)&&!solid(x,y))trees.push([x,y,7+rnd()*7])}
export const lamps=[];for(let x=100;x<2400;x+=200)lamps.push([x,392],[x,548],[x,992],[x,1148]);
// Трафик: правостороннее движение
const L=(ax,fix,dir,a0,a1,sp)=>({ax,fix,dir,a0,a1,sp});
const lanes=[L('x',435,-1,0,2400,70),L('x',505,1,0,2400,80),L('x',1035,-1,0,2400,75),L('x',1105,1,0,2400,85),
 L('y',635,1,0,H,70),L('y',705,-1,0,H,75),L('y',1535,1,0,H,70),L('y',1605,-1,0,H,80),
 L('x',1035,-1,2400,3800,150),L('x',1105,1,2400,3800,160)];
const cols=['#3b82c4','#e0b64f','#e8e8e8','#5aa05a','#8e5ac4','#d9822b','#2b2b33'];
export const traffic=[];
lanes.forEach((l,i)=>{for(let k=0;k<2;k++){const p=l.a0+rnd()*(l.a1-l.a0);
 traffic.push({l,x:l.ax==='x'?p:l.fix,y:l.ax==='x'?l.fix:p,ang:l.ax==='x'?(l.dir>0?0:Math.PI):(l.dir>0?Math.PI/2:-Math.PI/2),col:cols[(i+k*3)%cols.length],m:CARS[(i+k)%4],stun:0})}});
export const ints=[[600,400],[1500,400],[600,1000],[1500,1000]];
export function light(i,ax,t){const p=(t+i*3)%14;if(ax==='x')return p<5?'green':p<6.5?'yellow':'red';return p>=7&&p<12?'green':p>=12&&p<13.5?'yellow':'red'}
export const inInt=(x,y)=>ints.findIndex(([vx,hy])=>x>vx&&x<vx+140&&y>hy&&y<hy+140);
function mustStop(c,t){const l=c.l;if(l.sp>100)return false;
 for(let i=0;i<4;i++){const[vx,hy]=ints[i];
  if(l.ax==='x'){if(l.fix<hy||l.fix>hy+140)continue;const d=l.dir>0?vx-77-c.x:c.x-(vx+186);if(d>0&&d<46&&light(i,'x',t)!=='green')return true}
  else{if(l.fix<vx||l.fix>vx+140)continue;const d=l.dir>0?hy-45-c.y:c.y-(hy+186);if(d>0&&d<46&&light(i,'y',t)!=='green')return true}}
 return false}
export function stepTraffic(dt,t){for(const c of traffic){if(c.stun>0){c.stun-=dt;continue}const l=c.l;if(mustStop(c,t))continue;
 const k=l.ax;c[k]+=l.dir*l.sp*dt;if(c[k]>l.a1)c[k]=l.a0;if(c[k]<l.a0)c[k]=l.a1}}
const LC={red:'#ff4338',yellow:'#ffc933',green:'#3ddc6a'};
function head(g,x,y,s){g.fillStyle='#15171c';g.fillRect(x-6,y-14,12,28);['red','yellow','green'].forEach((n,k)=>{g.fillStyle=n===s?LC[n]:'#2c2f37';g.beginPath();g.arc(x,y-8+k*8,3.3,0,7);g.fill();if(n===s){g.fillStyle=LC[n]+'44';g.beginPath();g.arc(x,y-8+k*8,9,0,7);g.fill()}})}
function drawLights(g,v,t){ints.forEach(([vx,hy],i)=>{if(!v(vx-60,hy-60,260,260))return;const a=light(i,'x',t),b=light(i,'y',t);
 g.fillStyle='#f4f4f0';g.fillRect(vx-52,hy+72,5,66);g.fillRect(vx+156,hy+2,5,66);g.fillRect(vx+2,hy-20,66,5);g.fillRect(vx+72,hy+156,66,5);
 head(g,vx-36,hy-20,a);head(g,vx+176,hy+160,a);head(g,vx+176,hy-20,b);head(g,vx-36,hy+160,b)})}
export function drawWorld(g,cx,cy,vw,vh,task,t){
 const v=(x,y,w,h)=>x<cx+vw&&x+w>cx&&y<cy+vh&&y+h>cy;
 zones.forEach(z=>{g.fillStyle=z.g;g.fillRect(z.x0,cy,z.x1-z.x0,vh)});
 g.fillStyle='#b9b5a6';roads.forEach(r=>{if(r[4]===A&&v(r[0]-14,r[1]-14,r[2]+28,r[3]+28))g.fillRect(r[0]-14,r[1]-14,r[2]+28,r[3]+28)});
 roads.forEach(r=>{const[x,y,w,h,c]=r;if(!v(x,y,w,h))return;g.fillStyle=c;g.fillRect(x,y,w,h);
  g.fillStyle=c===D?'#8f7448':c===A?'#e8d36a':'#f2f2f2';
  if(w>h){for(let a=Math.max(x,Math.floor(cx/60)*60);a<Math.min(x+w,cx+vw);a+=60)g.fillRect(a,y+h/2-2,30,4);
   if(c===HW){g.fillRect(x,y+5,w,3);g.fillRect(x,y+h-8,w,3)}}
  else for(let a=Math.max(y,Math.floor(cy/60)*60);a<Math.min(y+h,cy+vh);a+=60)g.fillRect(x+w/2-2,a,4,30)});
 g.fillStyle='#f2f2f2cc';for(const hy of[400,1000])for(const vx of[600,1500])if(v(vx-44,hy,26,140))for(let k=0;k<9;k++){g.fillRect(vx-44,hy+6+k*15,24,8);g.fillRect(vx+160-120+100,hy+6+k*15,0,0)}
 trees.forEach(([x,y,s])=>{if(!v(x-s,y-s,s*2,s*2))return;g.fillStyle='#0003';g.beginPath();g.arc(x+3,y+4,s,0,7);g.fill();
  g.fillStyle='#2f6b3a';g.beginPath();g.arc(x,y,s,0,7);g.fill();g.fillStyle='#43904f';g.beginPath();g.arc(x-2,y-2,s*.55,0,7);g.fill()});
 lamps.forEach(([x,y])=>{if(v(x-4,y-4,8,8)){g.fillStyle='#333';g.fillRect(x-2,y-2,4,4);g.fillStyle='#ffe9a0';g.fillRect(x-1,y-1,2,2)}});
 g.textAlign='center';g.font='bold 9px monospace';
 places.forEach(p=>{if(!v(p.x-40,p.y-20,p.w+80,p.h+30))return;
  g.fillStyle='#0004';g.fillRect(p.x+6,p.y+6,p.w,p.h);g.fillStyle=p.c;g.fillRect(p.x,p.y,p.w,p.h);
  g.fillStyle='#00000033';g.fillRect(p.x,p.y,p.w,14);g.fillStyle='#ffffff55';g.fillRect(p.x,p.y+14,p.w,2);
  g.fillStyle='#e8f1f7bb';for(let i=0;i<Math.floor(p.w/24);i++)for(let j=0;j<Math.floor((p.h-24)/22)+1;j++)g.fillRect(p.x+8+i*24,p.y+24+j*22,12,9);
  g.fillStyle='#5b3a24';g.fillRect(p.x+p.w/2-6,p.y+p.h-10,12,10);
  g.lineWidth=3;g.strokeStyle='#000a';g.strokeText(p.n,p.x+p.w/2,p.y-5);g.fillStyle='#fff';g.fillText(p.n,p.x+p.w/2,p.y-5)});
 drawLights(g,v,t);const tg=targets[task];if(tg){g.strokeStyle='#ffd23f';g.lineWidth=3;g.beginPath();g.arc(tg.x,tg.y,24+Math.sin(t*5)*4,0,7);g.stroke()}
}
