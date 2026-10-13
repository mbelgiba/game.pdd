// Облачное сохранение и рейтинг. Без backend игра работает офлайн.
const API = window.PDD_API || '/api';
let cid = localStorage.getItem('pdd_id');
if (!cid) { cid = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2); localStorage.setItem('pdd_id', cid); }
let ct;
window.cloudPush = () => { clearTimeout(ct); ct = setTimeout(() => fetch(API + '/progress/' + cid, { method: 'PUT', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: SV.name || 'Водитель', money: Math.round(SV.money), earned: SV.st.earned, rides: SV.st.rides, clean: SV.st.clean, fines: SV.st.fines, data: JSON.stringify(SV) }) }).catch(() => {}), 800); };
(async () => { try { const r = await fetch(API + '/progress/' + cid); if (!r.ok) return; const sv = JSON.parse((await r.json()).data);
  if (sv.st && sv.st.earned > SV.st.earned) { Object.assign(SV, sv); save(); menuUI(); toast('Прогресс загружен из облака'); } } catch (_) {} })();
document.getElementById('lbb').onclick = async () => {
  const box = document.getElementById('lbl'); box.textContent = 'Загрузка…'; document.getElementById('lb').classList.remove('hide');
  try { const rows = await (await fetch(API + '/leaderboard')).json(); box.textContent = '';
    rows.forEach((r, i) => { const d = document.createElement('div'); d.className = 'box'; d.textContent = (i + 1) + '. ' + r.name + ' — ' + r.earned + ' ₸ · поездок: ' + r.rides; box.appendChild(d); });
    if (!rows.length) box.textContent = 'Пока никого. Проедьте первую поездку!';
  } catch (_) { box.textContent = 'Рейтинг недоступен: запустите backend (см. README).'; } };
document.getElementById('lbx').onclick = () => document.getElementById('lb').classList.add('hide');
