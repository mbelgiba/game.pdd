// Справочник знаков ПДД
const hb=document.getElementById('hb');
hb.querySelector('#hbl').innerHTML=SIGNS.map(s=>'<div class="box" style="text-align:left"><b style="font-size:26px">'+s[0]+'</b> <b>'+s[1]+'</b><br><span style="color:var(--mut)">'+s[2]+'</span></div>').join('');
document.getElementById('book').onclick=()=>hb.classList.remove('hide');
document.getElementById('hbx').onclick=()=>hb.classList.add('hide');
