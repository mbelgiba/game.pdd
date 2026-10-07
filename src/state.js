// Общее состояние игры
export const S={law:60,fam:50,money:1000,fuel:45,tank:45,dmg:0,safe:0,fines:[],t:0,over:0,task:'wait',arrived:null,flags:{},pause:false,done:false};
export const ST={mode:'menu',back:'menu',cruise:0,cruiseV:0,s:0,bump:0,br:false,T:0,tod:.2,rain:0,rainAt:50,ix:-1,tow:0};
export const car={x:660,y:505,a:0,v:0};
export const keys={};
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=1;if(e.key.startsWith('Arrow')||e.key===' ')e.preventDefault()});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
