// Экономика: сохранение, автосалон, АЗС, автосервис
import {S,ST} from './state.js';
import {CARS,PAINTS,sprite} from './cars.js';
import {$,hud,toast} from './ui.js';
import {setModel} from './car.js';
import {screen} from './menu.js';
import {zoneAt} from './world.js';
import {car} from './state.js';
const KEY='pdd_save';
export const SV={owned:['granta'],car:'granta',paints:{}};
export function load(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d){Object.assign(SV,d.sv);S.money=d.money}}catch(e){}}
export function save(){try{localStorage.setItem(KEY,JSON.stringify({sv:SV,money:S.money}))}catch(e){}}
export const cur=()=>CARS.find(c=>c.id===SV.car);
export const color=()=>SV.paints[SV.car]||cur().c;
export const applyCar=()=>setModel(cur());
const spend=n=>{if(S.money<n){toast('Не хватает денег','bad');return false}S.money-=n;return true};
export function openShop(kind){ST.back='play';ST.mode='shop';ST.shop=kind;screen('shop');render()}
const stat=(n,v,mx)=>'<div class="st"><span>'+n+'</span><i><b style="width:'+Math.min(100,v/mx*100)+'%"></b></i></div>';
const draw=(c,m,col)=>c.getContext('2d').drawImage(sprite(m,col,1.4),0,0);
function render(){
 const k=ST.shop,b=$('shopbody'),pr=zoneAt(car.x).id==='hwy'?18:15;
 $('shoptitle').textContent={dealer:'Автосалон',gas:'АЗС',garage:'Автосервис «Гараж 24»'}[k]+' · 🪙 '+Math.round(S.money)+' ₸';
 if(k==='dealer'){
  b.innerHTML='<div class="grid">'+CARS.map(m=>{const own=SV.owned.includes(m.id),sel=SV.car===m.id;
   return '<div class="card"><canvas data-id="'+m.id+'" width="236" height="118"></canvas><h3>'+m.n+'</h3><p>'+m.d+'</p>'+stat('Скорость',m.vmax,160)+stat('Разгон',m.acc*100,160)+stat('Управл.',m.hand*100,130)+stat('Бак, л',m.tank,80)+'<button class="mc" data-b="'+m.id+'">'+(sel?'✔ Выбрана':own?'Выбрать':'Купить '+m.price+' ₸')+'</button></div>'}).join('')+'</div>';
  b.querySelectorAll('canvas').forEach(c=>{const m=CARS.find(a=>a.id===c.dataset.id);draw(c,m,SV.paints[m.id]||m.c)});
  b.querySelectorAll('[data-b]').forEach(btn=>btn.onclick=()=>{const m=CARS.find(a=>a.id===btn.dataset.b);
   if(!SV.owned.includes(m.id)){if(!spend(m.price))return;SV.owned.push(m.id);toast('🎉 Куплено: '+m.n,'ok')}
   SV.car=m.id;applyCar();S.fuel=m.tank;done()})}
 if(k==='gas'){
  const m=cur();b.innerHTML='<p>Бензин: '+pr+' ₸/л · бак '+S.fuel.toFixed(1)+' / '+m.tank+' л</p><div class="row">'+[10,25,'Полный бак'].map((l,i)=>'<button class="mc" data-l="'+l+'">'+(i<2?'+'+l+' л':l)+'</button>').join('')+'</div>';
  b.querySelectorAll('[data-l]').forEach(btn=>btn.onclick=()=>{const want=btn.dataset.l==='Полный бак'?m.tank:+btn.dataset.l,L=Math.min(want,m.tank-S.fuel);
   if(L<=.1){toast('Бак уже полный');return}if(!spend(Math.ceil(L*pr)))return;S.fuel+=L;toast('⛽ Заправлено '+L.toFixed(1)+' л','ok');done()})}
 if(k==='garage'){
  const rc=Math.ceil(S.dmg*8);
  b.innerHTML='<div class="card"><canvas id="gp" width="236" height="118"></canvas></div><p>Состояние кузова: '+Math.round(100-S.dmg)+'%</p><div class="row"><button class="mc" id="rep">Починить · '+rc+' ₸</button></div><p>Покраска · 100 ₸</p><div>'+PAINTS.map(p=>'<button class="sw" data-p="'+p+'" style="background:'+p+'"></button>').join('')+'</div>';
  draw($('gp'),cur(),color());
  $('rep').onclick=()=>{if(rc<=0){toast('Кузов в порядке');return}if(!spend(rc))return;S.dmg=0;toast('🔧 Машина как новая','ok');done()};
  b.querySelectorAll('[data-p]').forEach(btn=>btn.onclick=()=>{if(!spend(100))return;SV.paints[SV.car]=btn.dataset.p;toast('🎨 Перекрашено','ok');done()})}
}
function done(){save();hud();render()}
