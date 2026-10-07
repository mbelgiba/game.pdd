// Заставка, пауза, справочник и карта мира
import {S,ST,car} from './state.js';
import {$,hud} from './ui.js';
import {W,H,zones,roads,places,targets} from './world.js';
const SPL=['Пристегнись!','Знаешь ПДД?','Анна ждёт!','Не гони!','Помни про ОСАГО!','Дипломный проект!','Только трезвым!'];
const TIPS=['Совет: круиз-контроль включается клавишей C.','Совет: смотри на знак лимита справа внизу.','Совет: просроченные документы — штраф.'];
let hb,story,mi;
export const screen=id=>document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('hide',s.id!==id));
const enter=(m,id)=>{if(ST.mode!=='book'&&ST.mode!=='map')ST.back=ST.mode;ST.mode=m;screen(id)};
export function closeOverlay(){clearInterval(mi);const b=ST.back;screen(b==='menu'?'menu':b==='pause'?'pause':null);ST.mode=b}
export function pauseGame(){ST.back='play';ST.mode='pause';screen('pause')}
export async function initMenu(st,start){
 story=st;hb=await (await fetch('data/handbook.json')).json();
 $('splash').textContent=SPL[Math.random()*SPL.length|0];
 $('bPlay').onclick=()=>{$('tip').textContent=TIPS[Math.random()*TIPS.length|0];screen('load');
  setTimeout(()=>{screen(null);$('hud').classList.remove('hide');ST.mode='play';hud();start()},1400)};
 $('bBook').onclick=$('pBook').onclick=()=>openBook('rules');
 $('bMap').onclick=$('pMap').onclick=openMap;
 $('pResume').onclick=()=>{ST.back='play';closeOverlay()};
 $('pMenu').onclick=()=>location.reload();
 document.querySelectorAll('.closeB').forEach(b=>b.onclick=closeOverlay);
}
export function openBook(tab){enter('book','book');book(tab)}
function book(tab){
 const T={rules:'Правила',signs:'Знаки',npc:'Персонажи',places:'Места',keys:'Управление'};
 $('tabs').innerHTML=Object.entries(T).map(([k,v])=>'<button class="mc'+(k===tab?' sel':'')+'" data-k="'+k+'">'+v+'</button>').join('');
 let h='';
 if(tab==='rules')h=hb.rules.map(r=>'<h3>'+r.t+'</h3><p>'+r.d+'</p>').join('');
 if(tab==='signs')h='<div class="grid">'+hb.signs.map(s=>'<div class="card"><b>'+s.i+'</b><h3>'+s.n+'</h3><p>'+s.d+'</p></div>').join('')+'</div>';
 if(tab==='npc')h='<div class="grid">'+story.npcs.map(n=>'<div class="card"><b>'+(n.e||'🙂')+'</b><h3>'+n.name+'</h3><small>'+n.role+'</small><p>'+(n.bio||'')+'</p></div>').join('')+'</div>';
 if(tab==='places')h=zones.map(z=>'<h3>'+z.n+' · лимит '+z.lim+' км/ч</h3><p>'+places.filter(p=>p.z===z.id).map(p=>p.n).join(' · ')+'</p>').join('');
 if(tab==='keys')h='<div class="grid">'+hb.keys.map(k=>'<div class="card"><b>'+k[0]+'</b><p>'+k[1]+'</p></div>').join('')+'</div>';
 $('bookbody').innerHTML=h;$('bookbody').scrollTop=0;
 document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>book(b.dataset.k));
}
export function openMap(){enter('map','map');drawMap();clearInterval(mi);mi=setInterval(()=>drawMap(),500)}
export function drawMap(c=$('mapc')){
 const x=c.getContext('2d'),s=c.width/W;
 zones.forEach(z=>{x.fillStyle=z.g;x.fillRect(z.x0*s,0,(z.x1-z.x0)*s,H*s);x.fillStyle='#000b';x.font='bold 12px monospace';x.fillText(z.n+' · '+z.lim+' км/ч',z.x0*s+8,16)});
 roads.forEach(r=>{x.fillStyle=r[4];x.fillRect(r[0]*s,r[1]*s,Math.max(2,r[2]*s),Math.max(2,r[3]*s))});
 places.forEach(p=>{x.fillStyle=p.c;x.fillRect(p.x*s,p.y*s,Math.max(5,p.w*s),Math.max(5,p.h*s));x.fillStyle='#000';x.font='9px monospace';x.fillText(p.n,p.x*s,p.y*s-3)});
 const t=targets[S.task];if(t){x.strokeStyle='#ffd23f';x.lineWidth=3;x.beginPath();x.arc(t.x*s,t.y*s,9,0,7);x.stroke()}
 if(ST.mode!=='menu'&&Math.floor(Date.now()/500)%2){x.fillStyle='#e0301e';x.beginPath();x.arc(car.x*s,car.y*s,6,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=2;x.stroke()}
}
