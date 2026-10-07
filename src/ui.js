// Интерфейс: шкалы, уведомления, диалоги, телефон, штрафы
import {S,ST,car} from './state.js';
import {targets} from './world.js';
export const $=id=>document.getElementById(id);
const bar=(id,p,w)=>{const e=$(id);e.style.width=Math.max(0,Math.min(100,p))+'%';e.className=w?'warn':''};
export function hud(){bar('bL',S.law,S.law<30);bar('bF',S.fam,S.fam<25);bar('bG',S.fuel/S.tank*100,S.fuel/S.tank<.15);bar('bD',100-S.dmg,S.dmg>60);$('mo').textContent=Math.round(S.money)}
export function clampHud(){S.law=Math.max(0,Math.min(100,S.law));S.fam=Math.max(0,Math.min(100,S.fam));S.dmg=Math.max(0,Math.min(100,S.dmg));S.money=Math.max(0,S.money);hud()}
export function toast(m,k=''){const t=document.createElement('div');t.className='toast '+k;t.textContent=m;$('toasts').appendChild(t);setTimeout(()=>t.remove(),3400)}
export function fine(label,sum,law){S.money-=sum;S.law-=law;S.safe=0;S.fines.push(label+' −'+sum+' ₸');toast('🧾 '+label+': −'+sum+' ₸','bad');clampHud()}
export function dialog(title,text,opts){
 S.pause=true;const d=$('dlg');d.innerHTML='<h2>'+title+'</h2><p>'+text+'</p>';
 opts.forEach(([label,fn])=>{const b=document.createElement('button');b.textContent=label;
  b.onclick=()=>{d.classList.add('hide');S.pause=false;fn();clampHud()};d.appendChild(b)});
 d.classList.remove('hide');d.querySelector('button').focus();
}
export function togglePhone(){const p=$('phone');if(p.classList.contains('hide')){tab('map');p.classList.remove('hide')}else p.classList.add('hide')}
function tab(n){
 const tg=targets[S.task],dist=tg?Math.round(Math.hypot(tg.x-car.x,tg.y-car.y)/10)*10:0;
 const T={
  map:'<b>2ГИС</b><br>'+(tg?'Маршрут: '+tg.n+'<br>Осталось ~'+dist+' м':'Маршрута нет')+'<br><small>Большая карта: M</small>',
  weather:'<b>Погода</b><br>'+(ST.rain?'🌧 Дождь, +11°C<br>Сцепление: пониженное':'☀️ Ясно, +18°C<br>Сцепление: хорошее'),
  contacts:'<b>Контакты</b><br>Анна (жена)<br>Громов (ДПС)<br>Бабушка Зина<br>Мишаня (сервис)<br>Дима (эвакуатор)',
  docs:'<b>Документы</b><br>Права: до 2031 <span class="ok">✓</span><br>СТС: в порядке <span class="ok">✓</span><br>ОСАГО: <span class="bad">просрочено!</span>',
  bank:'<b>Банк</b><br>Баланс: '+Math.round(S.money)+' ₸<br><small>Последние штрафы:</small><br>'+(S.fines.slice(-4).join('<br>')||'нет')};
 const p=$('phone');
 p.innerHTML='<div class="tabs">'+[['map','Карта'],['weather','Погода'],['contacts','Контакты'],['docs','Доки'],['bank','Банк']].map(a=>'<button data-t="'+a[0]+'">'+a[1]+'</button>').join('')+'</div><p style="margin-top:10px">'+T[n]+'</p>';
 p.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>tab(b.dataset.t));
}
