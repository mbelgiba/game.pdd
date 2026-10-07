// Движок сюжета: читает data/story.json, запускает события и финалы
import {S,car} from './state.js';
import {dialog,clampHud} from './ui.js';
let story;const fired=new Set();
export async function loadStory(){story=await (await fetch('data/story.json')).json()}
const find=id=>story.events.find(e=>e.id===id);
function apply(fx={}){
 for(const k in fx){
  if(k==='task')S.task=fx[k];else if(k==='flag')S.flags[fx[k]]=1;
  else if(k==='end')finish();else S[k]+=fx[k];
 }clampHud();
}
function run(id){
 const e=find(id);
 dialog(e.title,e.text,e.choices.map(c=>[c.label,()=>{
  apply(c.fx);
  if(c.random)run(Math.random()<c.random.p?c.random.ok:c.random.fail);
  else if(c.next)run(c.next);
 }]));
}
export function checkEvents(){
 for(const e of story.events){
  const t=e.trigger;if(!t||fired.has(e.id))continue;
  if((t.time!=null&&S.t>t.time)||(t.over!=null&&S.over>t.over)||(t.arrive&&S.arrived===t.arrive)){
   fired.add(e.id);if(t.stop)car.v=0;S.arrived=null;run(e.id);return;
  }
 }
 S.arrived=null;
}
const ok=(c={})=>(!c.flag||S.flags[c.flag])&&(c.lawMin==null||S.law>=c.lawMin)&&(c.lawMax==null||S.law<c.lawMax)&&(c.famMin==null||S.fam>=c.famMin);
export function finish(){
 S.done=true;const en=story.endings.find(e=>ok(e.if));
 dialog('Финал: '+en.title,en.text+'<br><small>Закон '+S.law+' · Семья '+S.fam+' · Деньги '+S.money+' ₸</small>',[['Сыграть заново',()=>location.reload()]]);
}
export const getStory=()=>story;
