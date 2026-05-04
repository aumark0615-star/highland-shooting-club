import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileDown,
  Flag,
  LogIn,
  Medal,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Timer,
  Trophy,
  UserPlus,
  Users,
} from 'lucide-react';
import './style.css';

const accounts = [
  { email: 'admin@highland.local', password: '123456', role: 'admin', name: '高原管理員' },
  { email: 'member@highland.local', password: '123456', role: 'member', name: '邱泓儒' },
];

const divisions = ['SSP', 'ESP', 'CDP', 'CCP', 'REV', 'PCC', 'CO', 'SPD'];

const divisionGuide = [
  { item: '彈匣 / 快速填彈器數量', SSP: '3', ESP: '3', CDP: '3', CCP: '3', REV: '4', PCC: '3', CO: '3', SPD: '3' },
  { item: '裝彈數', SSP: '30+1', ESP: '30+1', CDP: '24+1', CCP: '24+1', REV: '24', PCC: '30+1', CO: '30+1', SPD: '30+1' },
  { item: '滑套改裝', SSP: '否', ESP: '可', CDP: '可', CCP: '可', REV: '***', PCC: '***', CO: '可', SPD: '可' },
  { item: '扳機扣壓', SSP: '3磅', ESP: '無', CDP: '無', CCP: '無', REV: '無', PCC: '無', CO: '無', SPD: '無' },
  { item: '槍盒測試', SSP: '是', ESP: '是', CDP: '是', CCP: '是', REV: '槍管外管長度4.25吋以下', PCC: '槍管外管長度10吋以上', CO: '是', SPD: '否' },
  { item: '滑套 / 槍機後定', SSP: '是', ESP: '是', CDP: '是', CCP: '是', REV: '***', PCC: '是', CO: '是', SPD: '否' },
  { item: '握把雕刻', SSP: '限可拆除握把片', ESP: '可', CDP: '可', CCP: '可', REV: '***', PCC: '***', CO: '可', SPD: '可' },
  { item: '握把貼布', SSP: '可', ESP: '可', CDP: '可', CCP: '可', REV: '可', PCC: '可', CO: '可', SPD: '可' },
  { item: '彈匣插槽襯裙', SSP: '否', ESP: '可', CDP: '可', CCP: '可', REV: '***', PCC: '否', CO: '可', SPD: '可' },
  { item: '光學瞄具', SSP: '否', ESP: '否', CDP: '否', CCP: '否', REV: '否', PCC: '可', CO: '可', SPD: '否' },
  { item: '外型說明', SSP: '限定實槍外型，原則上不可改裝，9MM(含)以上口徑', ESP: '限定實槍外型，9MM(含)以上口徑', CDP: '限定實槍外型，.45口徑', CCP: '限定實槍外型，9MM以上口徑', REV: '限定實槍外型', PCC: '限定實槍長槍外型', CO: '限定實槍外型，用槍9MM以上口徑', SPD: '無' },
];

const illegalFeatureNotes = [
  '任一型態之槍口抑制器，包括混合式以及槍管末端車削開孔者。',
  '非標準構造之準星照門，如鬼環式、高低 / 風偏可調照門等（SPD 組除外）。',
  '安裝槍燈及雷射（PCC 組除外）。',
  '裝在軌道或護弓上的雷射不可使用（CO 組除外）。',
  '取消滑套卡榫功能。',
];

const scoringGuide = [
  ['原始時間 Raw Time', '從信號響起到最後一發射擊的時間', '秒 Seconds'],
  ['目標扣分 Points Down', '目標區分度（PD）總和', 'PD × 1.0s'],
  ['程序錯誤 PE', '違反比賽程序要求', '每發 +3.0s'],
  ['非法掩體 Cover', '未依規定使用掩體', '每發 +3.0s'],
  ['擊中非威脅靶 HNT', '誤擊平民 / 非威脅目標', '每發 +5.0s'],
  ['手指違規 / 不安全行為', '重大安全違規', '取消資格 DQ'],
  ['最終成績 Final Score', '所有加秒後的總和', '越低越好 Lowest Wins'],
];

const initialMembers = [
  { id: 'HSC-001', name: '邱泓儒', email: 'member@highland.local', primaryDivision: 'CO', level: 'Marksman', squad: 1, points: 128, attendance: 7, recentPercentiles: [0.42, 0.48, 0.38, 0.55, 0.36] },
  { id: 'HSC-002', name: '錢弘晏', email: '', primaryDivision: 'SSP', level: 'Novice', squad: 2, points: 72, attendance: 4, recentPercentiles: [0.62, 0.58, 0.51, 0.49] },
  { id: 'HSC-003', name: '莊祥浩', email: '', primaryDivision: 'CO', level: 'Sharpshooter', squad: 3, points: 214, attendance: 10, recentPercentiles: [0.18, 0.25, 0.31, 0.2, 0.28] },
  { id: 'HSC-004', name: '王小明', email: '', primaryDivision: 'ESP', level: 'Novice', squad: 1, points: 38, attendance: 2, recentPercentiles: [0.7, 0.64] },
];

const initialEvents = [
  { id: 'EVT-001', title: '高原隊內賽｜紙靶體驗賽', date: '2026/05/16', time: '20:00', stages: 2, quota: 24 },
  { id: 'EVT-002', title: '高原月例賽｜速度與準度', date: '2026/06/06', time: '20:00', stages: 3, quota: 30 },
];

const initialRegistrations = [
  { eventId: 'EVT-001', memberId: 'HSC-001', name: '邱泓儒', division: 'CO', squad: 1 },
  { eventId: 'EVT-001', memberId: 'HSC-002', name: '錢弘晏', division: 'SSP', squad: 2 },
  { eventId: 'EVT-001', memberId: 'HSC-003', name: '莊祥浩', division: 'CO', squad: 3 },
];

const initialScores = [
  { eventId: 'EVT-001', memberId: 'HSC-003', name: '莊祥浩', division: 'CO', stage: 1, rawTime: 38.42, pointsDown: 2, pe: 0, cover: 0, hnt: 0, dq: false, status: 'OK' },
  { eventId: 'EVT-001', memberId: 'HSC-003', name: '莊祥浩', division: 'CO', stage: 2, rawTime: 44.0, pointsDown: 1, pe: 0, cover: 0, hnt: 0, dq: false, status: 'OK' },
  { eventId: 'EVT-001', memberId: 'HSC-001', name: '邱泓儒', division: 'CO', stage: 1, rawTime: 41.77, pointsDown: 3, pe: 1, cover: 0, hnt: 0, dq: false, status: 'OK' },
  { eventId: 'EVT-001', memberId: 'HSC-001', name: '邱泓儒', division: 'CO', stage: 2, rawTime: 47.0, pointsDown: 2, pe: 0, cover: 0, hnt: 0, dq: false, status: 'OK' },
  { eventId: 'EVT-001', memberId: 'HSC-002', name: '錢弘晏', division: 'SSP', stage: 1, rawTime: 49.31, pointsDown: 4, pe: 0, cover: 0, hnt: 1, dq: false, status: 'OK' },
  { eventId: 'EVT-001', memberId: 'HSC-002', name: '錢弘晏', division: 'SSP', stage: 2, rawTime: 50.0, pointsDown: 2, pe: 1, cover: 0, hnt: 0, dq: false, status: 'OK' },
];

function cx(...items) { return items.filter(Boolean).join(' '); }

function stageScore(score) {
  if (score.dq || score.status === 'DQ') return 999999;
  const rawTime = Number(score.rawTime || 0);
  const pointsDown = Number(score.pointsDown || 0) * 1.0;
  const pe = Number(score.pe || 0) * 3.0;
  const cover = Number(score.cover || 0) * 3.0;
  const hnt = Number(score.hnt || 0) * 5.0;
  return rawTime + pointsDown + pe + cover + hnt;
}

function levelPoint(percentile, total) {
  if (total < 3) return 5;
  if (percentile <= 0.1) return 45;
  if (percentile <= 0.2) return 38;
  if (percentile <= 0.35) return 28;
  if (percentile <= 0.5) return 18;
  return 8;
}

function buildResults(scores, eventId, division = 'ALL') {
  const filtered = scores.filter(s => s.eventId === eventId && (division === 'ALL' || s.division === division));
  const grouped = {};
  filtered.forEach(s => {
    if (!grouped[s.memberId]) grouped[s.memberId] = { memberId: s.memberId, name: s.name, division: s.division, stages: [], status: 'OK' };
    const computed = { ...s, score: stageScore(s) };
    grouped[s.memberId].stages.push(computed);
    if (s.dq || s.status === 'DQ') grouped[s.memberId].status = 'DQ';
  });

  return Object.values(grouped)
    .map(r => ({ ...r, total: r.stages.reduce((sum, s) => sum + s.score, 0), stageCount: r.stages.length }))
    .sort((a, b) => a.total - b.total)
    .map((r, index, arr) => ({ ...r, rank: index + 1, percentile: arr.length ? (index + 1) / arr.length : 1, levelPoint: levelPoint(arr.length ? (index + 1) / arr.length : 1, arr.length) }));
}

function promotion(member) {
  const recent = member.recentPercentiles || [];
  const countUnder = p => recent.filter(x => x <= p).length;
  if (member.level === 'Novice') return member.attendance >= 3 && member.points >= 100 && countUnder(0.5) >= 2 ? { eligible: true, next: 'Marksman', reason: '達成升級條件' } : { eligible: false, next: 'Marksman', reason: '需 3 場有效賽、100 分、最近至少 2 場前 50%' };
  if (member.level === 'Marksman') return member.attendance >= 5 && member.points >= 200 && countUnder(0.35) >= 3 ? { eligible: true, next: 'Sharpshooter', reason: '達成升級條件' } : { eligible: false, next: 'Sharpshooter', reason: '需 200 分，最近5場至少3場前35%' };
  if (member.level === 'Sharpshooter') return member.attendance >= 7 && member.points >= 350 && countUnder(0.2) >= 2 ? { eligible: true, next: 'Expert', reason: '達成升級條件' } : { eligible: false, next: 'Expert', reason: '需 350 分，最近5場至少2場前20%' };
  if (member.level === 'Expert') return member.attendance >= 10 && member.points >= 550 && countUnder(0.1) >= 2 ? { eligible: true, next: 'Master', reason: '達成升級條件' } : { eligible: false, next: 'Master', reason: '需 550 分，最近5場至少2場前10%' };
  return { eligible: false, next: '最高級', reason: '已達 Master' };
}

function Card({ children, className = '', onClick }) { return <div onClick={onClick} className={cx('card', className)}>{children}</div>; }
function Button({ children, className = '', secondary = false, disabled, onClick }) { return <button className={cx('btn', secondary && 'secondary', className)} disabled={disabled} onClick={onClick}>{children}</button>; }
function Input(props) { return <input {...props} className={cx('input', props.className)} />; }
function Select({ children, ...props }) { return <select {...props} className="input">{children}</select>; }
function Badge({ children, className = '' }) { return <span className={cx('badge', className)}>{children}</span>; }
function Info({ label, value }) { return <div className="info"><small>{label}</small><b>{value}</b></div>; }

function Login({ setUser }) {
  const [email, setEmail] = useState('admin@highland.local');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  function submit() {
    const account = accounts.find(a => a.email === email && a.password === password);
    if (!account) return setError('帳號或密碼錯誤');
    setUser(account);
  }
  return <div className="login"><Card className="login-card"><div className="logo"><ShieldCheck /></div><h1>高原射擊俱樂部</h1><p>Competition System</p><label>Email</label><Input value={email} onChange={e => setEmail(e.target.value)} /><label>密碼</label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} />{error && <div className="error">{error}</div>}<Button onClick={submit}><LogIn size={16} />登入</Button><div className="hint">管理員：admin@highland.local / 123456<br />會員：member@highland.local / 123456</div></Card></div>;
}

function EventCard({ event, registrations, currentMember, onRegister }) {
  const joined = registrations.filter(r => r.eventId === event.id).length;
  const already = currentMember && registrations.some(r => r.eventId === event.id && r.memberId === currentMember.id);
  const canRegister = currentMember && !already && joined < event.quota;
  return <Card><div className="row top"><div><Badge>{event.stages} STAGE</Badge><h3>{event.title}</h3><p className="muted">{event.date}｜{event.time}</p></div><CalendarDays className="muted-icon" /></div><div className="progress-label"><span>報名人數</span><span>{joined}/{event.quota}</span></div><div className="bar"><div style={{ width: `${Math.min(100, joined / event.quota * 100)}%` }} /></div><Button disabled={!canRegister} onClick={() => onRegister(event)}>{already ? '已報名' : joined >= event.quota ? '名額已滿' : '我要報名'}</Button></Card>;
}

function ShooterProfile({ member, events, scores, onBack }) {
  const history = useMemo(() => events.map(event => {
    const all = buildResults(scores, event.id, 'ALL');
    const shooter = all.find(r => r.memberId === member.id);
    if (!shooter) return null;
    const div = buildResults(scores, event.id, shooter.division);
    return { event, overallRank: shooter.rank, totalShooters: all.length, percentile: shooter.percentile, total: shooter.total, division: shooter.division, divisionRank: div.find(r => r.memberId === member.id)?.rank || shooter.rank, divisionShooters: div.length, stages: [...shooter.stages].sort((a, b) => a.stage - b.stage) };
  }).filter(Boolean).sort((a, b) => b.event.id.localeCompare(a.event.id)), [member, events, scores]);

  const recent = history.slice(0, 5);
  const avg = recent.length ? recent.reduce((sum, item) => sum + item.percentile, 0) / recent.length : null;
  const top3 = history.filter(item => item.overallRank <= 3).length;
  const best = history.length ? [...history].sort((a, b) => a.total - b.total)[0] : null;
  const stability = avg === null ? '資料不足' : avg <= 0.2 ? '高穩定｜常態前段班' : avg <= 0.35 ? '穩定｜具升級潛力' : avg <= 0.5 ? '中等｜需提高一致性' : '波動較大｜需累積有效成績';
  const pro = promotion(member);

  return <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="stack"><Button secondary onClick={onBack}>← 返回選手列表</Button><Card className="dark"><div className="row top"><div><p className="muted">Shooter Profile</p><h2>{member.name}</h2><p className="muted">{member.id}｜SQ {member.squad}</p></div><Badge>{member.level}</Badge></div><div className="grid2"><Info label="主用 Division" value={member.primaryDivision || 'CO'} /><Info label="總積分" value={member.points} /><Info label="有效場次" value={member.attendance} /><Info label="Top 3 次數" value={top3} /></div></Card><Card><h3><Trophy size={18} />成就摘要</h3><div className="grid2"><Info label="最佳成績" value={best ? best.total.toFixed(2) : '-'} /><Info label="最佳名次" value={history.length ? `#${Math.min(...history.map(item => item.overallRank))}` : '-'} /></div></Card><Card><h3><Medal size={18} />最近5場趨勢 / 穩定度</h3><div className="box">平均排名百分比：<b>{avg === null ? '-' : `${Math.round(avg * 100)}%`}</b><br />穩定度：<b>{stability}</b><br />升級判斷：<b>{pro.eligible ? `可升級 ${pro.next}` : pro.reason}</b></div><div className="mini-grid">{recent.length ? recent.map((item, index) => <div className="mini" key={item.event.id}><small>#{index + 1}</small><b>{Math.round(item.percentile * 100)}%</b><small>R{item.overallRank}</small></div>) : <p className="muted">尚無歷史成績</p>}</div></Card><section className="stack"><h3>歷史戰績</h3>{history.map(record => <Card key={record.event.id}><div className="row top"><div><h3>{record.event.title}</h3><p className="muted">{record.event.date}｜{record.division}</p></div><div className="rank">#{record.overallRank}<small>/{record.totalShooters}</small></div></div><div className="grid3"><Info label="總分" value={record.total >= 999000 ? 'DQ' : record.total.toFixed(2)} /><Info label="Division" value={`#${record.divisionRank}`} /><Info label="百分比" value={`${Math.round(record.percentile * 100)}%`} /></div><h4>Stage Breakdown</h4>{record.stages.map(stage => <div className="stage-box" key={stage.stage}><div><b>Stage {stage.stage}</b></div><div className="right"><b>{stage.score >= 999000 ? 'DQ' : stage.score.toFixed(2)}</b></div><div>Raw：{stage.rawTime}s</div><div>PD：{stage.pointsDown}</div><div>PE：{stage.pe}</div><div>Cover：{stage.cover}</div><div>HNT：{stage.hnt}</div><div>Status：{stage.dq ? 'DQ' : 'OK'}</div></div>)}</Card>)}</section></motion.div>;
}

function Members({ members, events, scores }) {
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState(null);
  const member = members.find(m => m.id === selected);
  if (member) return <ShooterProfile member={member} events={events} scores={scores} onBack={() => setSelected(null)} />;
  const filtered = members.filter(m => m.name.includes(keyword) || m.id.toLowerCase().includes(keyword.toLowerCase()) || m.level.toLowerCase().includes(keyword.toLowerCase()));
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stack"><div className="search"><Search size={16} /><Input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="搜尋會員 / 編號 / 等級" /></div>{filtered.map(m => { const pro = promotion(m); return <Card key={m.id} className="click" onClick={() => setSelected(m.id)}><div className="row top"><div><h3>{m.name}</h3><p className="muted">{m.id}｜{m.primaryDivision}｜SQ {m.squad}</p></div><div className="right"><Badge>{m.level}</Badge><p><b>{m.points}</b> 分</p></div></div><div className={cx('box', pro.eligible && 'ok')}>{pro.eligible && <CheckCircle2 size={14} />} {pro.eligible ? `可升級至 ${pro.next}` : `下一級：${pro.next}`}<br /><small>{pro.reason}</small></div><p className="muted">點擊查看個人頁、歷史戰績與 Stage breakdown</p></Card>; })}</motion.div>;
}

function Results({ events, scores }) {
  const [eventId, setEventId] = useState(events[0]?.id || '');
  const [division, setDivision] = useState('ALL');
  const results = buildResults(scores, eventId, division);
  const event = events.find(e => e.id === eventId);
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stack"><Card className="dark"><h2>公開成績 / Match Results</h2><p className="muted">Division 分組排名，Final Score 越低排名越前。</p></Card><Select value={eventId} onChange={e => setEventId(e.target.value)}>{events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}</Select><Select value={division} onChange={e => setDivision(e.target.value)}><option value="ALL">全部 Division</option>{divisions.map(d => <option key={d}>{d}</option>)}</Select>{event && <div className="row"><Badge>{event.stages} STAGE</Badge><Button secondary><FileDown size={16} />匯出成績</Button></div>}<Card>{results.map(r => <div className="result" key={r.memberId}><div className="row top"><div><h3>#{r.rank} {r.name}</h3><p className="muted">{r.division}｜{r.stageCount} Stages｜{r.status}</p></div><div className="rank">{r.total >= 999000 ? 'DQ' : r.total.toFixed(2)}<small>+{r.levelPoint} pts</small></div></div><div className="grid2">{r.stages.sort((a, b) => a.stage - b.stage).map(s => <Info key={s.stage} label={`Stage ${s.stage}`} value={s.score >= 999000 ? 'DQ' : s.score.toFixed(2)} />)}</div></div>)}</Card></motion.div>;
}

function Admin({ user, members, setMembers, events, setEvents, scores, setScores }) {
  const [memberForm, setMemberForm] = useState({ name: '', email: '', squad: '1', primaryDivision: 'SSP' });
  const [eventForm, setEventForm] = useState({ title: '高原月例賽', date: '2026/06/20', time: '20:00', stages: '3', quota: '30' });
  const [scoreForm, setScoreForm] = useState({ eventId: events[0]?.id || '', memberId: members[0]?.id || '', division: 'SSP', stage: '1', rawTime: '', pointsDown: '0', pe: '0', cover: '0', hnt: '0', dq: false, status: 'OK' });
  if (user.role !== 'admin') return <Card><h3>沒有管理員權限</h3><p className="muted">一般會員只能報名與查看成績。</p></Card>;
  const selectedEvent = events.find(e => e.id === scoreForm.eventId);
  const selectedMember = members.find(m => m.id === scoreForm.memberId);

  function addMember() {
    if (!memberForm.name.trim()) return;
    const next = String(members.length + 1).padStart(3, '0');
    setMembers([...members, { id: `HSC-${next}`, name: memberForm.name.trim(), email: memberForm.email.trim(), primaryDivision: memberForm.primaryDivision, level: 'Novice', squad: Number(memberForm.squad || 1), points: 0, attendance: 0, recentPercentiles: [] }]);
    setMemberForm({ name: '', email: '', squad: '1', primaryDivision: 'SSP' });
  }
  function addEvent() {
    if (!eventForm.title.trim()) return;
    const next = String(events.length + 1).padStart(3, '0');
    setEvents([...events, { id: `EVT-${next}`, title: eventForm.title.trim(), date: eventForm.date, time: eventForm.time, stages: Number(eventForm.stages || 0), quota: Number(eventForm.quota || 0) }]);
    setEventForm({ title: '高原月例賽', date: '2026/06/20', time: '20:00', stages: '3', quota: '30' });
  }
  function addScore() {
    if (!selectedMember || !selectedEvent || !scoreForm.rawTime) return;
    const newScore = { eventId: scoreForm.eventId, memberId: scoreForm.memberId, name: selectedMember.name, division: scoreForm.division, stage: Number(scoreForm.stage), rawTime: Number(scoreForm.rawTime), pointsDown: Number(scoreForm.pointsDown || 0), pe: Number(scoreForm.pe || 0), cover: Number(scoreForm.cover || 0), hnt: Number(scoreForm.hnt || 0), dq: scoreForm.dq, status: scoreForm.dq ? 'DQ' : 'OK' };
    setScores([...scores, newScore]);
    setScoreForm({ ...scoreForm, rawTime: '', pointsDown: '0', pe: '0', cover: '0', hnt: '0', dq: false, status: 'OK' });
  }
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stack"><Card className="dark"><h2><ClipboardList size={18} />Competition Admin</h2><p className="muted">建立賽事、選手資料、IDPA 計分標準輸入。</p></Card><Card><h3><UserPlus size={18} />新增會員</h3><Input placeholder="姓名" value={memberForm.name} onChange={e => setMemberForm({ ...memberForm, name: e.target.value })} /><Input placeholder="Email" value={memberForm.email} onChange={e => setMemberForm({ ...memberForm, email: e.target.value })} /><div className="grid2"><Input placeholder="SQ" type="number" value={memberForm.squad} onChange={e => setMemberForm({ ...memberForm, squad: e.target.value })} /><Select value={memberForm.primaryDivision} onChange={e => setMemberForm({ ...memberForm, primaryDivision: e.target.value })}>{divisions.map(d => <option key={d}>{d}</option>)}</Select></div><Button onClick={addMember}><Plus size={16} />新增會員</Button></Card><Card><h3><Flag size={18} />建立賽事</h3><Input value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} /><div className="grid2"><Input value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} /><Input value={eventForm.time} onChange={e => setEventForm({ ...eventForm, time: e.target.value })} /></div><div className="grid2"><Input type="number" value={eventForm.stages} onChange={e => setEventForm({ ...eventForm, stages: e.target.value })} /><Input type="number" value={eventForm.quota} onChange={e => setEventForm({ ...eventForm, quota: e.target.value })} /></div><Button onClick={addEvent}>建立賽事</Button></Card><Card><h3><Timer size={18} />輸入 Stage 成績</h3><Select value={scoreForm.eventId} onChange={e => setScoreForm({ ...scoreForm, eventId: e.target.value })}>{events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}</Select><Select value={scoreForm.memberId} onChange={e => setScoreForm({ ...scoreForm, memberId: e.target.value })}>{members.map(m => <option key={m.id} value={m.id}>{m.name}｜{m.id}</option>)}</Select><Select value={scoreForm.division} onChange={e => setScoreForm({ ...scoreForm, division: e.target.value })}>{divisions.map(d => <option key={d}>{d}</option>)}</Select><div className="grid2"><Input type="number" placeholder="Stage" value={scoreForm.stage} onChange={e => setScoreForm({ ...scoreForm, stage: e.target.value })} /><Input type="number" step="0.01" placeholder="Raw Time" value={scoreForm.rawTime} onChange={e => setScoreForm({ ...scoreForm, rawTime: e.target.value })} /></div><div className="grid2"><Input type="number" placeholder="Points Down" value={scoreForm.pointsDown} onChange={e => setScoreForm({ ...scoreForm, pointsDown: e.target.value })} /><Input type="number" placeholder="PE 程序錯誤" value={scoreForm.pe} onChange={e => setScoreForm({ ...scoreForm, pe: e.target.value })} /></div><div className="grid2"><Input type="number" placeholder="非法掩體 Cover" value={scoreForm.cover} onChange={e => setScoreForm({ ...scoreForm, cover: e.target.value })} /><Input type="number" placeholder="HNT 非威脅靶" value={scoreForm.hnt} onChange={e => setScoreForm({ ...scoreForm, hnt: e.target.value })} /></div><label className="check"><input type="checkbox" checked={scoreForm.dq} onChange={e => setScoreForm({ ...scoreForm, dq: e.target.checked, status: e.target.checked ? 'DQ' : 'OK' })} />手指違規 / 不安全行為（DQ）</label><div className="score-preview"><div>Raw Time：<b>{Number(scoreForm.rawTime || 0).toFixed(2)}</b> 秒</div><div>Points Down：<b>{scoreForm.pointsDown || 0}</b> × 1.0 秒</div><div>PE：<b>{scoreForm.pe || 0}</b> × 3.0 秒</div><div>非法掩體：<b>{scoreForm.cover || 0}</b> × 3.0 秒</div><div>HNT：<b>{scoreForm.hnt || 0}</b> × 5.0 秒</div><div className="score-line">Final Score：<b>{scoreForm.dq ? 'DQ' : stageScore(scoreForm).toFixed(2)}</b></div><small>越低越好（Lowest Wins）</small></div><Button onClick={addScore}><Save size={16} />儲存 Stage 成績</Button></Card></motion.div>;
}

function Levels() {
  const rules = [['Novice → Marksman', '3 場有效賽、100 分、最近至少 2 場前 50%'], ['Marksman → Sharpshooter', '200 分、最近 5 場至少 3 場前 35%'], ['Sharpshooter → Expert', '350 分、最近 5 場至少 2 場前 20%'], ['Expert → Master', '550 分、最近 5 場至少 2 場前 10%']];
  return <div className="stack"><Card className="dark"><h2><Medal size={18} />分級制度</h2><p className="muted">不使用 Classifier，只採正式比賽成績。升級需同時滿足積分、有效場次與最近5場穩定性。</p></Card>{rules.map(rule => <Card key={rule[0]}><h3>{rule[0]}</h3><p className="muted">{rule[1]}</p></Card>)}</div>;
}

function DivisionGuide() {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stack"><Card className="dark"><h2><ClipboardList size={18} />氣槍分組對照表</h2><p className="muted">SSP / ESP / CDP / CCP / REV / PCC / CO / SPD</p></Card><div className="table-wrap"><table><thead><tr><th>項目</th>{divisions.map(d => <th key={d}>{d}</th>)}</tr></thead><tbody>{divisionGuide.map(row => <tr key={row.item}><td>{row.item}</td>{divisions.map(d => <td key={d}>{row[d]}</td>)}</tr>)}</tbody></table></div><Card><h3><AlertTriangle size={18} />不符合規範之槍械特徵與改裝</h3><ul>{illegalFeatureNotes.map(note => <li key={note}>{note}</li>)}</ul></Card></motion.div>;
}

function ScoringGuide() {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stack"><Card className="dark"><h2><Timer size={18} />IDPA 計分標準參考表</h2><p className="muted">後台 Stage 成績輸入已依此邏輯設計。</p></Card><div className="table-wrap"><table><thead><tr><th>項目 Item</th><th>細節 Details</th><th>計算方式 Calculation</th></tr></thead><tbody>{scoringGuide.map(row => <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>)}</tbody></table></div><Card><h3>計分公式</h3><div className="formula">Final Score = Raw Time + PD×1.0 + PE×3.0 + Cover×3.0 + HNT×5.0</div><p className="muted">若勾選 DQ，該 Stage 直接顯示 DQ，不列入正常名次競爭。</p></Card></motion.div>;
}

function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('home');
  const [members, setMembers] = useState(initialMembers);
  const [events, setEvents] = useState(initialEvents);
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [scores, setScores] = useState(initialScores);
  const currentMember = members.find(m => m.email && user?.email === m.email);
  const activeEvent = events[0];
  const topResults = buildResults(scores, activeEvent.id, 'ALL').slice(0, 3);

  function register(event) {
    if (!currentMember) return;
    if (registrations.some(r => r.eventId === event.id && r.memberId === currentMember.id)) return;
    setRegistrations([...registrations, { eventId: event.id, memberId: currentMember.id, name: currentMember.name, division: currentMember.primaryDivision, squad: currentMember.squad }]);
  }

  if (!user) return <Login setUser={setUser} />;

  const tabs = [['home', '首頁'], ['events', '報名'], ['results', '成績'], ['members', '選手'], ['levels', '分級'], ['division', '分組'], ['scoring', '計分'], ['admin', '後台']];

  return <div className="app"><div className="phone"><header><div><p>Highland Shooting Club</p><h1>高原賽事系統</h1><p>{user.name}｜{user.role === 'admin' ? '管理員' : '會員'}</p></div><button onClick={() => setUser(null)}><ShieldCheck /></button><div className="stats"><Info label="會員" value={members.length} /><Info label="賽事" value={events.length} /><Info label="Stage" value={scores.length} /></div></header><nav>{tabs.map(item => <button key={item[0]} onClick={() => setTab(item[0])} className={tab === item[0] ? 'on' : ''}>{item[1]}</button>)}</nav><main>{tab === 'home' && <div className="stack"><Card className="dark"><div className="row top"><div><h2>{activeEvent.title}</h2><p className="muted">{activeEvent.date}｜{activeEvent.time}｜{activeEvent.stages} Stages</p></div><Badge>比賽專業系統</Badge></div></Card><div className="grid2"><Card><Users /><Info label="報名" value={`${registrations.filter(r => r.eventId === activeEvent.id).length}/${activeEvent.quota}`} /></Card><Card><Trophy /><Info label="Top Score" value={topResults[0]?.total.toFixed(2) || '-'} /></Card></div><h3>Top 3</h3><Card>{topResults.map(r => <div className="row result" key={r.memberId}><div><b>#{r.rank} {r.name}</b><p className="muted">{r.division}</p></div><b>{r.total.toFixed(2)}</b></div>)}</Card></div>}{tab === 'events' && <div className="stack">{events.map(e => <EventCard key={e.id} event={e} registrations={registrations} currentMember={currentMember} onRegister={register} />)}</div>}{tab === 'results' && <Results events={events} scores={scores} />}{tab === 'members' && <Members members={members} events={events} scores={scores} />}{tab === 'levels' && <Levels />}{tab === 'division' && <DivisionGuide />}{tab === 'scoring' && <ScoringGuide />}{tab === 'admin' && <Admin user={user} members={members} setMembers={setMembers} events={events} setEvents={setEvents} scores={scores} setScores={setScores} />}</main><footer><Button onClick={() => setTab(user.role === 'admin' ? 'admin' : 'results')}>{user.role === 'admin' ? '進入賽事後台' : '查看公開成績'}</Button></footer></div></div>;
}

createRoot(document.getElementById('root')).render(<App />);
