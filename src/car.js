// Физика (с учётом модели, повреждений, топлива), круиз и отрисовка машин
import {S,car,keys,ST} from './state.js';
import {W,H,onRoad,solid} from './world.js';
import {CARS,sprite} from './cars.js';
export const K=.25;let MAX=440;export let M=CARS[0];
export function setModel(m){M=m;MAX=m.vmax/K;S.tank=m.tank;S.fuel=Math.min(S.fuel,m.tank)}
const cl=(a,lo,hi)=>Math.max(lo,Math.min(hi,a));
export function stepCar(dt){
 let th=keys.w||keys.arrowup;const br=keys.s||keys.arrowdown,hb=keys[' '],lf=keys.a||keys.arrowleft,rt=keys.d||keys.arrowright;
 if(S.fuel<=0){th=false;ST.cruise=0}
 const road=onRoad(car.x,car.y),eff=MAX*(1-S.dmg*.003),max=road?eff:140*M.off;
 if(br)ST.cruise=0;
 if(ST.cruise)car.v+=cl((Math.min(ST.cruiseV,max)-car.v)*1.6,-150,110*M.acc)*dt;
 else{
  if(th)car.v+=(car.v<0?320:210*M.acc*Math.max(0,1-car.v/max))*dt;
  if(br)car.v-=(car.v>0?340:110*Math.max(0,1+car.v/110))*dt;
  if(!th&&!br)car.v-=Math.sign(car.v)*Math.min(Math.abs(car.v),(50+Math.abs(car.v)*.25)*dt);
 }
 if(hb){car.v*=1-2.2*dt;ST.cruise=0}
 if(!road)car.v*=1-.8*dt;
 if(car.v>max)car.v-=160*dt;
 car.v=Math.max(-110,car.v);
 ST.s+=(((rt?1:0)-(lf?1:0))-ST.s)*Math.min(1,dt*7);
 const lock=.62*M.hand*(ST.rain?.85:1)/(1+Math.abs(car.v)/110);
 car.a+=car.v/26*Math.tan(ST.s*lock)*dt*(hb?1.5:1);
 const ox=car.x,oy=car.y;
 car.x=cl(car.x+Math.cos(car.a)*car.v*dt,0,W);car.y=cl(car.y+Math.sin(car.a)*car.v*dt,0,H);
 if(solid(car.x,car.y)){car.x=ox;car.y=oy;ST.bump=Math.abs(car.v);car.v*=-.25}
 return{road,kmh:Math.round(Math.abs(car.v)*K),braking:!!(br||hb)};
}
export function cruiseToggle(){if(ST.cruise)ST.cruise=0;else if(car.v>40){ST.cruise=1;ST.cruiseV=car.v}}
export function cruiseAdj(d){if(!ST.cruise){if(car.v>40){ST.cruise=1;ST.cruiseV=car.v}else return}ST.cruiseV=cl(ST.cruiseV+d/K,40,MAX)}
export function cruiseLimit(l){ST.cruise=1;ST.cruiseV=l/K}
export function drawCarAt(g,x,y,a,m,col,brake){
 g.save();g.translate(x,y);g.rotate(a);g.imageSmoothingEnabled=true;g.drawImage(sprite(m,col),-28,-14,56,28);
 if(brake){g.fillStyle='#ff4a3d';const rx=-m.L/6,wy=m.Wd/6-1;g.fillRect(rx-1,-wy-1,3,4);g.fillRect(rx-1,wy-3,3,4)}
 g.restore();g.imageSmoothingEnabled=false;
}
