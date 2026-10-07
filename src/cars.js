// Каталог машин и детальная отрисовка спрайтов (вид сверху, нос вправо)
export const CARS=[
 {id:'granta',n:'Лада «Гранта»',kind:'sedan',price:0,vmax:110,acc:1,hand:1,off:1,tank:45,cons:1,L:148,Wd:56,c:'#d8432e',d:'Надёжный седан для начинающего водителя.'},
 {id:'kroha',n:'«Кроха»',kind:'hatch',price:1800,vmax:105,acc:1.15,hand:1.2,off:1,tank:35,cons:.7,L:128,Wd:54,c:'#3b82c4',d:'Компактный хэтчбек: юркий и экономичный.'},
 {id:'brodyaga',n:'«Бродяга»',kind:'suv',price:3500,vmax:120,acc:.95,hand:.9,off:1.9,tank:70,cons:1.5,L:156,Wd:64,c:'#4f7f52',d:'Внедорожник: уверенно едет по грунтовке.'},
 {id:'molniya',n:'«Молния»',kind:'sport',price:7000,vmax:150,acc:1.5,hand:.85,off:.8,tank:50,cons:1.8,L:152,Wd:58,c:'#f2c230',d:'Спорткар: быстрый, но жадный и капризный.'}];
export const PAINTS=['#d8432e','#3b82c4','#f2f2f2','#2b2d36','#4f7f52','#f2c230','#8e5ac4','#e8742b'];
const KIND={sedan:{rs:.30,re:.56,gl:.12,rg:.10},hatch:{rs:.26,re:.62,gl:.12,rg:.14},suv:{rs:.24,re:.62,gl:.11,rg:.09},sport:{rs:.38,re:.56,gl:.14,rg:.08}};
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,v+a));return 'rgb('+f(n>>16)+','+f(n>>8&255)+','+f(n&255)+')'};
const cache={};
export function sprite(m,c,sc=2/3){
 const key=m.id+c+sc;if(cache[key])return cache[key];
 const k=document.createElement('canvas');k.width=Math.ceil(168*sc);k.height=Math.ceil(84*sc);const x=k.getContext('2d');x.scale(sc,sc);
 const K=KIND[m.kind],sp=m.kind==='sport',suv=m.kind==='suv',L=m.L,Wd=m.Wd,x0=(168-L)/2,y0=(84-Wd)/2,xf=x0+L,yb=y0+Wd,cy=42;
 const rs=x0+L*K.rs,re=x0+L*K.re,ws=re+L*K.gl,rg=rs-L*K.rg;
 const rr=(a,b,w,h,r)=>{x.beginPath();x.roundRect?x.roundRect(a,b,w,h,r):x.rect(a,b,w,h)};
 const lin=(y1,y2,st)=>{const g=x.createLinearGradient(0,y1,0,y2);st.forEach((s,i)=>g.addColorStop(i/(st.length-1),s));return g};
 // тень
 x.save();x.shadowColor='#000a';x.shadowBlur=9;x.shadowOffsetY=3;x.fillStyle='#000';rr(x0+3,y0+4,L-6,Wd-8,16);x.fill();x.restore();
 // колёса: протектор, диск, болты
 const wx=[x0+L*.21,x0+L*.77];
 wx.forEach(px=>[y0-5,yb-8].forEach(py=>{x.fillStyle='#0d0e11';rr(px-14,py,28,13,5);x.fill();x.fillStyle='#24262c';rr(px-12,py+2,24,9,3);x.fill();
  x.fillStyle=suv?'#7a7f89':'#c9ccd4';rr(px-6,py+4,12,5,2);x.fill();x.fillStyle='#555a64';for(let i=-4;i<=4;i+=4)x.fillRect(px+i,py+5,1.5,3)}));
 // кузов с объёмным градиентом
 x.fillStyle=lin(y0,yb,[sh(c,-70),sh(c,-10),sh(c,45),sh(c,-5),sh(c,-75)]);rr(x0,y0,L,Wd,sp?22:18);x.fill();
 x.strokeStyle=sh(c,-95);x.lineWidth=1.3;x.stroke();
 // арки и крылья
 x.fillStyle='#0004';wx.forEach(px=>{[y0+1,yb-1].forEach(py=>{x.beginPath();x.ellipse(px,py,16,5,0,0,7);x.fill()})});
 // линии капота и багажника, центральный шов
 x.strokeStyle='#0005';x.lineWidth=1;x.beginPath();
 x.moveTo(ws,y0+9);x.quadraticCurveTo((ws+xf)/2,y0+6,xf-16,y0+14);x.moveTo(ws,yb-9);x.quadraticCurveTo((ws+xf)/2,yb-6,xf-16,yb-14);
 x.moveTo(ws+6,cy);x.lineTo(xf-14,cy);x.moveTo(rg-4,y0+9);x.lineTo(x0+10,y0+13);x.moveTo(rg-4,yb-9);x.lineTo(x0+10,yb-13);x.stroke();
 x.fillStyle='#ffffff30';x.beginPath();x.moveTo(ws+4,y0+11);x.quadraticCurveTo((ws+xf)/2,y0+9,xf-20,y0+16);x.lineTo(xf-20,y0+20);x.quadraticCurveTo((ws+xf)/2,y0+14,ws+4,y0+15);x.fill();
 // полосы спорткара (капот и багажник)
 if(sp){x.fillStyle='#f4f4f4dd';x.fillRect(ws+3,cy-7,xf-ws-20,4);x.fillRect(ws+3,cy+3,xf-ws-20,4);x.fillRect(x0+16,cy-7,rg-x0-18,4);x.fillRect(x0+16,cy+3,rg-x0-18,4)}
 // стёкла
 const gl=lin(y0,yb,['#13263b','#5d9ec9','#9fd2ee','#5d9ec9','#13263b']);x.fillStyle=gl;
 x.beginPath();x.moveTo(re,y0+5);x.lineTo(ws,y0+10);x.lineTo(ws,yb-10);x.lineTo(re,yb-5);x.closePath();x.fill();
 x.beginPath();x.moveTo(rs,y0+5);x.lineTo(rg,y0+10);x.lineTo(rg,yb-10);x.lineTo(rs,yb-5);x.closePath();x.fill();
 x.fillStyle='#ffffff55';x.beginPath();x.moveTo(re+2,y0+8);x.lineTo(re+9,y0+8);x.lineTo(re+4,yb-9);x.lineTo(re+2,yb-9);x.fill();
 x.strokeStyle='#0a1420';x.lineWidth=1.2;x.beginPath();x.moveTo(re,y0+5);x.lineTo(ws,y0+10);x.lineTo(ws,yb-10);x.lineTo(re,yb-5);x.stroke();
 // крыша
 x.fillStyle=lin(y0,yb,[sh(c,-20),sh(c,28),sh(c,50),sh(c,28),sh(c,-25)]);rr(rs,y0+4,re-rs,Wd-8,sp?9:6);x.fill();x.strokeStyle=sh(c,-90);x.lineWidth=1;x.stroke();
 x.fillStyle='#142437';x.fillRect(rs+3,y0+3,re-rs-6,3);x.fillRect(rs+3,yb-6,re-rs-6,3);
 if(m.kind==='sedan'){x.fillStyle='#1a2c42';rr(rs+8,cy-9,re-rs-20,18,3);x.fill();x.fillStyle='#ffffff30';x.fillRect(rs+10,cy-7,re-rs-26,2)}
 if(suv){x.strokeStyle='#202226';x.lineWidth=2;x.beginPath();x.moveTo(rs+3,y0+9);x.lineTo(re-3,y0+9);x.moveTo(rs+3,yb-9);x.lineTo(re-3,yb-9);x.stroke();x.lineWidth=1.5;for(let i=0;i<3;i++){const px=rs+8+i*((re-rs-16)/2);x.beginPath();x.moveTo(px,y0+9);x.lineTo(px,yb-9);x.stroke()}}
 if(sp){x.fillStyle='#0f1117';rr(rs+4,cy-6,re-rs-8,12,4);x.fill()}
 x.fillStyle='#111';x.beginPath();x.arc(rs+6,cy+(sp?-10:0),2.4,0,7);x.fill();
 // ручки дверей, зеркала
 x.fillStyle=sh(c,-80);[y0+3,yb-5].forEach(py=>{x.fillRect(rs+10,py,6,2);x.fillRect(re-14,py,6,2)});
 [y0-5,yb-1].forEach(py=>{x.fillStyle=lin(py,py+6,[sh(c,30),sh(c,-60)]);rr(re-1,py,11,6,3);x.fill();x.strokeStyle=sh(c,-90);x.stroke()});
 // фары: хромовая оправа, ДХО, линза
 [y0+4,yb-4-(sp?7:10)].forEach(py=>{const h=sp?7:10;x.fillStyle='#e9eef2';rr(xf-19,py,18,h,sp?3:5);x.fill();x.strokeStyle='#7d838c';x.lineWidth=1;x.stroke();
  x.fillStyle='#fff7b8';rr(xf-16,py+1.5,11,h-3,2);x.fill();x.fillStyle='#fff';x.fillRect(xf-15,py+2,7,1.5);x.fillStyle='#8cc8ff';x.fillRect(xf-6,py+1,3,h-2)});
 // решётка радиатора и эмблема
 x.fillStyle='#0b0c10';rr(xf-11,cy-12,9,24,3);x.fill();x.strokeStyle='#8a8f99';x.lineWidth=.8;for(let i=-9;i<=9;i+=3){x.beginPath();x.moveTo(xf-10,cy+i);x.lineTo(xf-3,cy+i);x.stroke()}
 x.fillStyle='#d8dbe0';x.beginPath();x.arc(xf-6,cy,2.4,0,7);x.fill();
 if(suv){x.fillStyle='#14151a';rr(xf-3,cy-18,5,36,2);x.fill();x.fillStyle='#ffb347';x.fillRect(xf-14,y0+15,3,3);x.fillRect(xf-14,yb-18,3,3)}
 // задние фонари, номер, выхлоп
 if(sp){x.fillStyle='#8f1218';rr(x0+1,y0+9,5,Wd-18,2);x.fill();x.fillStyle='#ff4d57';x.fillRect(x0+2,y0+11,2,Wd-22)}
 else[y0+4,yb-13].forEach(py=>{x.fillStyle='#8f1218';rr(x0+1,py,7,9,2);x.fill();x.fillStyle='#ff5a5a';x.fillRect(x0+2.5,py+2,3,5);x.fillStyle='#ffd0d0';x.fillRect(x0+2.5,py+7,3,1)});
 x.fillStyle='#f6f6f0';rr(x0+1,cy-8,5,16,1);x.fill();x.strokeStyle='#222';x.lineWidth=.7;x.stroke();x.fillStyle='#223';for(let i=-5;i<=5;i+=3)x.fillRect(x0+2.4,cy+i,2,1.4);
 x.fillStyle='#9ea3ad';[sp?[cy-12,cy+12]:[yb-9]].flat().forEach(py=>{x.beginPath();x.arc(x0-.5,py,3,0,7);x.fill();x.fillStyle='#111';x.beginPath();x.arc(x0-.5,py,1.7,0,7);x.fill();x.fillStyle='#9ea3ad'});
 if(sp){x.fillStyle='#15161c';rr(x0+5,y0+3,10,Wd-6,2);x.fill();x.fillStyle='#2c2e38';x.fillRect(x0+7,y0+5,5,Wd-10);x.fillStyle='#15161c';x.fillRect(x0+4,y0,12,3);x.fillRect(x0+4,yb-3,12,3)}
 // лючок бака
 x.fillStyle='#0004';x.beginPath();x.arc(x0+L*.17,y0+8,3,0,7);x.fill();x.strokeStyle=sh(c,-90);x.lineWidth=.8;x.stroke();
 return cache[key]=k;
}
