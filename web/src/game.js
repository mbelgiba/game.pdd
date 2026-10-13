
const $=i=>document.getElementById(i);
let SV={money:1500,owned:['granta'],car:'granta',paint:{},trial:null,st:{rides:0,clean:0,earned:0,fines:0},cam:'3d',hq:1,loc:'city',wx:'clear'};
try{Object.assign(SV,JSON.parse(localStorage.getItem('pdd3')||'{}'))}catch(_){}
const save=()=>{try{localStorage.setItem('pdd3',JSON.stringify(SV))}catch(_){}window.cloudPush&&cloudPush()};
const toast=m=>{const t=$('toast');t.textContent=m;clearTimeout(toast.h);toast.h=setTimeout(()=>t.textContent='',2400)};
/* ---------- 3D ---------- */
const R=new THREE.WebGLRenderer({canvas:$('c'),antialias:true,alpha:true}),cam=new THREE.PerspectiveCamera(55,1,.1,300);
const M=(c,e)=>new THREE.MeshLambertMaterial({color:c,emissive:e||0}),B=(w,h,d,c,e)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c,e));m.castShadow=m.receiveShadow=true;return m};
const lights=s=>{s.add(new THREE.HemisphereLight(0xffffff,0x667766,.85));const d=new THREE.DirectionalLight(0xffffff,.8);d.position.set(5,12,6);d.castShadow=true;d.shadow.mapSize.set(2048,2048);const c=d.shadow.camera;c.left=c.bottom=-35;c.right=c.top=35;c.far=90;s.add(d,d.target)};
function mkCar(s,col){const G=new THREE.Group(),bm=M(col||s.c);
 const b=new THREE.Mesh(new THREE.BoxGeometry(s.W,s.H,s.L),bm);b.position.y=.35+s.H/2;G.add(b);
 const c=B(s.W-.25,s.CH,s.CL,'#9fd0ee');c.position.set(0,.35+s.H+s.CH/2,s.L*.05);G.add(c);
 const r=s.big?.5:.36;[-1,1].forEach(x=>[-1,1].forEach(z=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.3,14),M('#111'));w.rotation.z=Math.PI/2;w.position.set(x*s.W/2,r,z*s.L*.3);G.add(w)}));
 [-1,1].forEach(x=>{let h=B(.4,.18,.05,'#fff6b0','#fff6b0');h.position.set(x*s.W*.3,.35+s.H*.6,-s.L/2);G.add(h);h=B(.4,.15,.05,'#c00','#330000');h.position.set(x*s.W*.3,.35+s.H*.6,s.L/2);G.add(h);(G.userData.br=G.userData.br||[]).push(h.material)});
 if(s.sp){const p=B(s.W*.9,.07,.4,'#222');p.position.set(0,.35+s.H+.25,s.L/2-.2);G.add(p)}
 if(s.bar){const a=B(.6,.14,.3,'#e22','#a00'),q=B(.6,.14,.3,'#25f','#13a');a.position.set(-.3,.35+s.H+s.CH+.1,0);q.position.set(.3,.35+s.H+s.CH+.1,0);G.add(a,q)}
 G.userData.body=bm;upCar(G,s,col);return G}
const paintOf=s=>SV.paint[s.id]||s.c;
/* модели, текстуры, погода */
const mix=[];let HB=.85;const GL=THREE.GLTFLoader?new THREE.GLTFLoader():null,gc={};
const loadM=f=>new Promise(r=>{let i=0;const t=()=>{if(!GL||i>=f.length)return r(null);GL.load(f[i++],r,undefined,t)};t()});
const getM=k=>gc[k]||(gc[k]=loadM(MODELS[k].files)),cln=o=>THREE.SkeletonUtils?THREE.SkeletonUtils.clone(o):o.clone();
function fit(sc,o){let b=new THREE.Box3().setFromObject(sc);const z=b.getSize(new THREE.Vector3());sc.scale.multiplyScalar(o.len?o.len/Math.max(z.x,z.z):o.h/z.y);b.setFromObject(sc);const c=b.getCenter(new THREE.Vector3());sc.position.set(-c.x,-b.min.y,-c.z);
 const w=new THREE.Group();w.rotation.y=o.rot||0;w.add(sc);sc.traverse(n=>{if(n.isMesh){n.castShadow=n.receiveShadow=true;if(n.material&&n.material.clone)n.material=n.material.clone()}});return w}
function upCar(G,s,col){const k='car_'+s.id;if(!MODELS[k])return;getM(k).then(m=>{if(!m)return;G.children.slice().forEach(c=>{if(!c.isLight&&!c.userData.keep)G.remove(c)});const w=fit(cln(m.scene),{len:s.L,rot:MODELS[k].rot});G.add(w);G.userData.br=null;const b=w.getObjectByName('body');G.userData.body=b&&b.material?b.material:null;if(G.userData.body)G.userData.body.color.set(col||s.c)})}
function upHuman(g,s,an){getM('human').then(m=>{if(!m)return;g.userData.old.forEach(o=>g.remove(o));const o=cln(m.scene);g.add(fit(o,{h:1.8*s}));const mx=new THREE.AnimationMixer(o),cl=THREE.AnimationClip.findByName(m.animations,an)||m.animations[0];if(cl)mx.clipAction(cl).play();mix.push(mx)})}
const fc={};function fac(c){return fc[c]||(fc[c]=cvT(x=>{x.fillStyle=c;x.fillRect(0,0,128,128);for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.fillStyle=(i*7+j*3)%5?'#2b3d52':'#ffe9a8';x.fillRect(10+j*30,8+i*30,18,20)}}))}
const FB=(w,h,d,c)=>{const m=B(w,h,d,'#fff');m.material.map=fac(c);return m};
/* меню */
const MS=new THREE.Scene();lights(MS);const plat=new THREE.Mesh(new THREE.CylinderGeometry(9,9,.2,40),M('#2a3346'));plat.position.y=-.1;MS.add(plat);
const mc=CARS.map(s=>{const g=mkCar(s,paintOf(s));g.visible=false;MS.add(g);return g});let sel=Math.max(0,CARS.findIndex(c=>c.id===SV.car));
const has=s=>SV.owned.includes(s.id)||(s.u&&s.u())||(SV.trial&&SV.trial.id===s.id&&SV.trial.until>Date.now());
function menuUI(){const s=CARS[sel],lv=1+Math.floor(SV.st.earned/1000);
 $('lv').textContent=lv;$('mo').textContent=Math.round(SV.money);$('s1').textContent=SV.st.rides;$('s2').textContent=SV.st.clean;$('s3').textContent=SV.st.fines;$('s4').textContent=SV.st.earned;
 $('cn').textContent=s.n+(SV.car===s.id?' ✔':'');const tr=SV.trial&&SV.trial.id===s.id&&SV.trial.until>Date.now();
 $('cd').textContent=s.d+(tr?' · тест до '+new Date(SV.trial.until).toLocaleTimeString().slice(0,5):'');
 const a=$('ca');a.innerHTML='';const bt=(t,f,dis)=>{const b=document.createElement('button');b.className='b';b.textContent=t;b.disabled=!!dis;b.onclick=f;a.appendChild(b)};
 if(s.u&&!s.u())bt('🔒 Откроется: '+s.ut,0,1);
 else if(has(s))bt(SV.car===s.id?'Выбрана':'Выбрать',()=>{SV.car=s.id;save();menuUI()},SV.car===s.id);
 else{bt('Купить '+s.p+' ₸',()=>{if(SV.money<s.p)return toast('Не хватает денег');SV.money-=s.p;SV.owned.push(s.id);SV.car=s.id;save();menuUI()});
  bt('Попробовать на день',()=>{SV.trial={id:s.id,until:Date.now()+864e5};SV.car=s.id;save();menuUI()})}
 const l=$('lc');l.innerHTML='';for(const k in LOC){const o=LOC[k],b=document.createElement('button'),ok=o.u();b.className='b'+(SV.loc===k?' on':'');b.textContent=(ok?'':'🔒 ')+o.n.split(' ')[0]+' '+o.n.split(' ').slice(1).join(' ');b.title=ok?'':'Откроется: '+o.ut;
  b.onclick=()=>{if(!ok)return toast('Откроется: '+o.ut);SV.loc=k;save();menuUI()};l.appendChild(b)}
 $('sw').innerHTML=['#d8432e','#3b82c4','#f4f4f4','#2b2d36','#4f7f52','#f2c230','#8e5ac4','#e8742b'].map(c=>'<button class="sw" data-p="'+c+'" style="background:'+c+'"></button>').join('')}
const sh=d=>{sel=(sel+d+CARS.length)%CARS.length;menuUI()};$('pv').onclick=()=>sh(-1);$('nx').onclick=()=>sh(1);
/* игра */
const GS=new THREE.Scene();lights(GS);const sun=GS.children[1];let head;const root=new THREE.Group();GS.add(root);const FOG=new THREE.Fog(0xbcd6ee,40,170);GS.fog=FOG;
const rg=new THREE.BufferGeometry(),rp=new Float32Array(2400*3);for(let i=0;i<2400;i++){rp[i*3]=(Math.random()-.5)*30;rp[i*3+1]=Math.random()*30;rp[i*3+2]=-25+Math.random()*30}rg.setAttribute('position',new THREE.BufferAttribute(rp,3));
const rainP=new THREE.Points(rg,new THREE.PointsMaterial({color:0xbfd0e6,size:.12}));rainP.visible=false;rainP.frustumCulled=false;GS.add(rainP);
function wx(){const w=SV.wx,bg=w==='night'?0x0b1226:w==='rain'?0x8d98a6:LOC[SV.loc].bg;GS.background.set(bg);FOG.color.set(bg);HB=w==='night'?.28:w==='rain'?.6:.85;GS.children[0].intensity=HB;sun.intensity=w==='night'?.08:w==='rain'?.35:.8;rainP.visible=w==='rain';head.visible=w==='night'}
let S,mode='menu',phase,ev,ei,car,cz,v,tm,props=[],an=[],traffic=[],vw,look=new THREE.Vector3(),cpos=new THREE.Vector3(0,3,9),tLook=new THREE.Vector3();
const cvT=(f,w=128)=>{const c=document.createElement('canvas');c.width=c.height=w;const x=c.getContext('2d');x.textAlign='center';x.textBaseline='middle';f(x);return new THREE.CanvasTexture(c)};
function sign(k,t){const tx=cvT(x=>{x.fillStyle='#fff';if(k==='lim'){x.beginPath();x.arc(64,64,60,0,7);x.fill();x.lineWidth=12;x.strokeStyle='#d11';x.stroke();x.fillStyle='#111';x.font='800 54px sans-serif';x.fillText(t,64,68)}
 else if(k==='stop'){x.fillStyle='#d11';x.beginPath();for(let i=0;i<8;i++)x.lineTo(64+60*Math.cos(i*Math.PI/4+Math.PI/8),64+60*Math.sin(i*Math.PI/4+Math.PI/8));x.fill();x.fillStyle='#fff';x.font='800 30px sans-serif';x.fillText('СТОП',64,66)}
 else if(k==='yield'){x.fillStyle='#d11';x.beginPath();x.moveTo(4,14);x.lineTo(124,14);x.lineTo(64,118);x.fill();x.fillStyle='#fff';x.beginPath();x.moveTo(24,26);x.lineTo(104,26);x.lineTo(64,92);x.fill()}
 else if(k==='kids'){x.fillStyle='#d11';x.fillRect(4,4,120,120);x.fillStyle='#fff';x.fillRect(14,14,100,100);x.font='56px serif';x.fillText('🚸',64,68)}
 else{x.fillStyle='#1f5fbf';x.fillRect(4,4,120,120);x.fillStyle='#fff';x.font='64px serif';x.fillText(k==='ped'?'🚶':t,64,68)}});
 const g=new THREE.Group(),p=B(.1,2.4,.1,'#888');p.position.y=1.2;const pl=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.1),new THREE.MeshBasicMaterial({map:tx,transparent:true,side:THREE.DoubleSide}));pl.position.y=2.6;g.add(p,pl);return g}
function tlight(st){const g=new THREE.Group(),p=B(.15,4,.15,'#555');p.position.y=2;const h=B(.5,1.3,.4,'#111');h.position.y=4.2;g.add(p,h);
 ['#f33','#fc3','#3d6'].forEach((c,i)=>{const s=new THREE.Mesh(new THREE.SphereGeometry(.17,10,8),M(st==='r'&&!i||st==='g'&&i==2?c:'#333',st==='r'&&!i||st==='g'&&i==2?c:0));s.position.set(0,4.55-i*.4,.22);g.add(s)});return g}
const fig=(c,s=1,an0='Idle')=>{const g=new THREE.Group(),b=B(.5*s,1*s,.3*s,c),h=new THREE.Mesh(new THREE.SphereGeometry(.22*s,10,8),M('#e8b98f'));b.position.y=.5*s+.2;h.position.y=1.25*s+.2;g.add(b,h);g.userData.old=[b,h];upHuman(g,s,an0);return g};
const cone=()=>{const c=new THREE.Mesh(new THREE.ConeGeometry(.25,.7,10),M('#f60','#a30'));c.position.y=.35;return c};
const add=(o,x,y,z)=>{o.position.set(x,y,z);root.add(o);return o};
const stripes=z=>{for(let i=-3;i<=3;i++)props.push(add(B(.7,.02,3,'#fff'),i*1.1,.02,z))};
function spawn(e,z){props.forEach(o=>root.remove(o));props=[];an=[];GS.children[0].intensity=HB;mix.length=0;
 const P=(o,x,y,zz)=>{props.push(add(o,x,y,zz));return o};
 if(e.k==='ped'){stripes(z);P(sign('ped'),3.6,0,z+3);const f=P(fig(e.kid?'#e44':'#c4a',e.kid?.7:1,'Walk'),-5,0,z);f.rotation.y=Math.PI/2;an.push((t)=>{f.position.x=Math.min(6,-5+((t-tm0)*1.6))})}
 if(e.k==='light'){P(tlight('r'),3.8,0,z-2);P(tlight('r'),-3.8,0,z-2);P(B(7,.02,.4,'#fff'),0,.03,z+3)}
 if(e.k==='dead'){P(tlight('off'),3.8,0,z-2);P(sign('yield'),-3.8,0,z+4);P(sign('stop'),3.8,0,z+4);GS.children[0].intensity=HB*.5}
 if(e.k==='cop'){const c=P(fig('#2b4a85',1.1),0,0,z),a=B(.1,.9,.1,'#fff','#ccc');a.position.set(.5,1.4,0);c.add(a);an.push(t=>{a.rotation.z=Math.sin(t*3)*.5+.4});P(tlight('off'),3.8,0,z-3);P(cone(),-1.5,0,z+6)}
 if(e.k==='fork'){P(sign('txt','⬅'),-3.8,0,z);P(sign('txt','⛽'),3.8,0,z)}
 if(e.k==='job'){const f=P(fig('#35a'),3.6,0,z),a=B(.1,.8,.1,'#e8b98f');a.position.set(.35,1.4,0);f.add(a);an.push(t=>a.rotation.z=Math.sin(t*6)*.6)}
 if(e.k==='cows')for(let i=0;i<3;i++){const c=B(1.2,.9,2.2,'#eee');const p=B(.9,.5,.9,'#222');p.position.set(.2,.2,0);c.add(p);const hd=B(.5,.5,.6,'#ddd');hd.position.set(0,.3,-1.3);c.add(hd);P(c,-4+i*1.6,.7,z-i*2.5)}
 if(e.k==='acc'){const a=mkCar(CARS[1]);a.rotation.y=.8;P(a,-1,0,z);const b=mkCar(CARS[0],'#444');b.rotation.y=-.5;P(b,1.5,0,z-4);[-2.5,0,2.5].forEach(x=>P(cone(),x,0,z+8));const f=B(.3,.3,.3,'#f80','#f80');P(f,-1,2,z);an.push(t=>f.visible=Math.sin(t*10)>0)}
 if(e.k==='taxi'){const a=mkCar(CARS[2],'#f2c230');a.scale.set(.9,.9,.9);P(a,-2,0,0);a.userData.follow=1}
 if(e.k==='gas'){P(B(7,.3,6,'#c33'),5,4,z);[-1,1].forEach(x=>P(B(.3,4,.3,'#ddd'),5+x*3,2,z));P(B(.6,1.3,.6,'#1f5fbf'),5,.65,z)}}
let tm0=0;
function build(k){const o=LOC[k];GS.background=new THREE.Color(o.bg);FOG.color.set(o.bg);while(root.children.length)root.remove(root.children[0]);const len=EV[k].length*170+260;
 const gr=new THREE.Mesh(new THREE.PlaneGeometry(400,len+300),M(o.gr));gr.rotation.x=-Math.PI/2;gr.position.set(0,-.02,-len/2+50);gr.receiveShadow=true;root.add(gr);
 const tx=cvT(x=>{x.fillStyle=k==='village'?'#8a7552':'#4a4f5c';x.fillRect(0,0,128,128);x.fillStyle='#e8d36a';x.fillRect(61,12,6,50)});tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(1,len/12);
 const rd=new THREE.Mesh(new THREE.PlaneGeometry(9,len+300),new THREE.MeshLambertMaterial({map:tx}));rd.rotation.x=-Math.PI/2;rd.position.set(0,0,-len/2+50);rd.receiveShadow=true;root.add(rd);
 let n=0;const rn=(a,b)=>a+((n=(n*9301+49297)%233280)/233280)*(b-a);n=7;
 for(let z=20;z>-len;z-=11)[-1,1].forEach(s=>{const x=s*(k==='city'?9+rn(0,2):7+rn(0,6));
  if(k==='city'){const h=rn(5,18);add(FB(rn(5,8),h,rn(6,9),['#c9a98a','#9fb3c8','#d8c8a0','#b5b5c0'][n%4]),x,h/2,z)}
  else if(k==='village'&&n%3){add(B(4,3,4,'#d9b98a'),x,1.5,z);add(new THREE.Mesh(new THREE.ConeGeometry(3.2,1.5,4),M('#a33')),x,3.7,z).rotation.y=.8}
  else{add(B(.4,2,.4,'#6b4a2b'),x*.7,1,z);add(new THREE.Mesh(new THREE.ConeGeometry(1.4,3.5,8),M('#2f7a3a')),x*.7,3.6,z)}
  if(k==='hwy')add(B(.2,.7,11,'#aab'),s*5.2,.5,z)});
 const sg=k==='city'?['lim','ped','stop','yield']:k==='village'?['lim','kids','yield']:['lim','yield'];
 for(let i=0,z=-15;z>-len;z-=48,i++){const t=sg[i%sg.length];add(sign(t,o.lim),5.2,0,z)}
 if(k==='city')for(let z=0;z>-len;z-=30)add(B(.15,5,.15,'#666'),-5.3,2.5,z)}
function pay(d){SV.money=Math.max(0,SV.money+d);if(d>0)S.gain+=d;hud()}
function hud(){$('hL').textContent=Math.round(S.law);$('hM').textContent=Math.round(SV.money);$('hF').textContent=Math.max(0,Math.round(S.fuel))+'%'}
function start(){const sp=CARS.find(c=>c.id===SV.car);car&&GS.remove(car);car=mkCar(sp,paintOf(sp));car.position.set(2,0,0);GS.add(car);head=new THREE.SpotLight(0xfff2cc,2,70,.6,.5);head.position.set(0,1.2,-1.5);head.target.position.set(0,.3,-25);head.target.userData.keep=1;car.add(head,head.target);
 S={law:60,fuel:60,gain:0,vio:0,log:[],start:SV.money};ev=EV[SV.loc].slice().sort(()=>Math.random()-.5);ei=-1;cz=0;v=0;vw=SV.cam;mode='game';build(SV.loc);wx();
 traffic.forEach(t=>GS.remove(t));traffic=[0,1,2,3,4].map(i=>{const t=mkCar(CARS[i%4],['#3b82c4','#e8e8e8','#2b2d36','#4f7f52'][i%4]);t.rotation.y=Math.PI;t.position.set(-2,0,-i*60);t.userData.v=14+i*2;GS.add(t);return t});
 $('menu').classList.add('hide');$('game').classList.remove('hide');$('hZ').textContent=LOC[SV.loc].n;$('lim').textContent=LOC[SV.loc].lim;hud();nextEv()}
function nextEv(){ei++;if(ei>=ev.length)return phase='fin',tm=0;phase='appr';tm0=performance.now()/1000}
function show(){const e=ev[ei];$('who').textContent=e.e;$('ttl').textContent=e.t;$('txt').textContent=e.x;const o=$('opts');o.innerHTML='';
 e.c.forEach(c=>{const b=document.createElement('button');b.className='opt';b.textContent=c[0];b.onclick=()=>pick(c);o.appendChild(b)});$('panel').classList.remove('hide');o.firstChild.focus({preventScroll:true})}
function pick(c){$('panel').classList.add('hide');const f=c[1],d=[];
 if(f.law){S.law+=f.law;d.push('Закон '+(f.law>0?'+':'')+f.law);if(f.law<0){S.vio++;S.log.push(ev[ei].r)}}if(f.money){pay(f.money);d.push((f.money>0?'+':'')+f.money+' ₸')}
 if(f.fuel)S.fuel=Math.min(100,S.fuel+f.fuel);if(f.f)S.f=f.f;if(d.length)toast(d.join('  '));
 let nx=c[2];if(typeof nx==='function')nx=nx();hud();
 if(typeof nx==='string'&&nx.startsWith('end:'))return finish(nx.slice(4));if(S.law<=0)return finish('license');
 phase='go';tm=0;v=Math.max(v,3)}
function finish(k){mode='end';phase='end';const st=SV.st;st.rides++;const clean=!S.vio&&k==='ok';if(clean)st.clean++;st.fines+=S.vio;
 if(k==='ok'){pay(300+(clean?300:0))}st.earned+=Math.round(S.gain);save();
 const T={ok:['🏁','Вы приехали',clean?'Чистая поездка! Бонус за безопасную езду +300 ₸.':'Поездка завершена, но были нарушения.'],crash:['💥','ДТП','Опасный манёвр закончился аварией.'],fled:['🚔','Погоня','Вы скрылись от ДПС, но далеко не уехали: задержание и суд.'],license:['💸','Лишён прав','Слишком много нарушений.'],empty:['⛽','Бензин кончился','Вас отбуксировали за счёт штрафа.']}[k];
 $('ed').textContent=T[0];$('et').textContent=T[1];$('ex2').textContent=T[2]+' Итого денег: '+Math.round(SV.money)+' ₸.';
 $('log').innerHTML=S.log.length?'<b>Разбор ПДД:</b><br>'+[...new Set(S.log)].map(r=>'• '+r).join('<br>'):'';
 $('game').classList.add('hide');setTimeout(()=>$('end').classList.remove('hide'),700);
 const un=Object.keys(LOC).filter(x=>LOC[x].u()).length;toast('Открыто локаций: '+un+'/3')}
function toMenu(){mode='menu';$('end').classList.add('hide');$('game').classList.add('hide');$('menu').classList.remove('hide');$('panel').classList.add('hide');menuUI()}
$('play').onclick=start;$('back').onclick=toMenu;$('ex').onclick=toMenu;
$('vw').onclick=()=>vw=vw==='3d'?'2d':'3d';addEventListener('keydown',e=>{if(e.key==='v'||e.key==='V')$('vw').onclick();if(e.key==='Escape'&&mode==='game')toMenu()});
$('gear').onclick=()=>{$('set').classList.remove('hide')};$('sx').onclick=()=>{$('set').classList.add('hide');save();menuUI()};
$('set').onclick=e=>{const d=e.target.dataset;if(d.c){SV.cam=d.c;toast('Вид: '+d.c)}if(d.q){SV.hq=+d.q;rs()}if(d.w){SV.wx=d.w;toast('Погода: '+d.w)}if(d.p){const s=CARS[sel];SV.paint[s.id]=d.p;mc[sel].userData.body&&mc[sel].userData.body.color.set(d.p)}save()};
$('rst').onclick=()=>{if(confirm('Стереть весь прогресс?')){localStorage.removeItem('pdd3');location.reload()}};
function rs(){R.shadowMap.enabled=!!SV.hq;R.setPixelRatio(SV.hq?Math.min(devicePixelRatio,2):1);R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',rs);rs();
/* цикл */
let last=performance.now();
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;
 if(mode==='menu'||(mode==='end'&&!car)){mc.forEach((g,i)=>{const r=i-sel,vis=Math.abs(r)<=1||(CARS.length-Math.abs(r))<=1&&CARS.length>2;let rl=r;if(r>1)rl=r-CARS.length;if(r<-1)rl=r+CARS.length;g.visible=Math.abs(rl)<=1;
  g.position.x+=(rl*5.2-g.position.x)*.12;g.position.z+=((rl?-3:0)-g.position.z)*.12;g.scale.setScalar(rl?.65:1.1);g.rotation.y=rl?rl*.6+Math.PI:now/2000});
  cam.position.set(0,2.8,9.5);cam.lookAt(0,.7,0);R.render(MS,cam)}
 else{
  if(phase==='appr'){const z=-(ei+1)*170;if(!props.length||props.ez!==z){spawn(ev[ei],z);props.ez=z}const d=cz-z-17;v=Math.max(0,Math.min(22,d*.9));if(d<.6){v=0;phase='ask';show()}}
  else if(phase==='go'){tm+=dt;v=Math.min(22,v+14*dt);if(tm>2.2)nextEv()}
  else if(phase==='fin'){tm+=dt;v=Math.min(22,v+14*dt);if(tm>3)finish('ok')}
  else if(phase==='end')v=Math.max(0,v-10*dt);
  if(phase!=='ask'&&mode==='game'){S.fuel-=v*dt*.012;if(S.fuel<=0){S.fuel=0;finish('empty')}hud()}
  cz-=v*dt;car.position.z=cz;const t=now/1000;an.forEach(f=>f(t));mix.forEach(m=>m.update(dt));const brk=phase==='ask'||phase==='appr'&&v<20;(car.userData.br||[]).forEach(m=>m.emissive.setHex(brk?0xff2200:0x330000));sun.position.set(car.position.x+10,25,cz+8);sun.target.position.set(car.position.x,0,cz);if(rainP.visible){rainP.position.set(car.position.x,0,cz);const a=rainP.geometry.attributes.position;for(let i=0;i<a.count;i++){let y=a.getY(i)-45*dt;if(y<0)y+=30;a.setY(i,y)}a.needsUpdate=true}
  traffic.forEach(c=>{if(c.userData.follow)return;c.position.z+=c.userData.v*dt-v*0;if(c.position.z>cz+25)c.position.z=cz-250-Math.random()*120});
  props.forEach(o=>{if(o.userData.follow)o.position.z=cz+(-2)});
  const ch=vw==='3d';tLook.set(car.position.x,ch?1:0,cz-(ch?12:3));cpos.lerp(new THREE.Vector3(car.position.x,ch?4.8:42,cz+(ch?10:4)),.07);look.lerp(tLook,.1);cam.position.copy(cpos);cam.lookAt(look);
  R.render(GS,cam)}
 requestAnimationFrame(loop)}
menuUI();requestAnimationFrame(loop);
