import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import { URL } from 'node:url';
import { spawn } from 'node:child_process';

// Startup-mode guard: only alert if weekday and past 5pm
const nowD = new Date();
const dow = nowD.getDay();
const hr = nowD.getHours();
const isWeekday = dow >= 1 && dow <= 5;
const pastFivePm = hr >= 17;
const runIfDue = process.argv.includes('--startup');
if (runIfDue && (!isWeekday || !pastFivePm)) { console.log('Skip startup check - not yet 5pm weekday'); process.exit(0); }

const cfg = JSON.parse(fs.readFileSync('C:/Users/buihuuthanhloi/.kiro/settings/mcp.json', 'utf8').replace(/^\uFEFF/, ''));
const e = cfg.mcpServers.jira.env;
const auth = Buffer.from(e.JIRA_USER_EMAIL + ':' + e.JIRA_API_KEY).toString('base64');
const today = new Date().toISOString().slice(0, 10);

function req(path) {
  return new Promise((resolve, reject) => {
    const proxy = new URL(e.HTTPS_PROXY);
    const target = new URL(e.JIRA_INSTANCE_URL + path);
    const co = { host: proxy.hostname, port: proxy.port, method: 'CONNECT', path: target.hostname + ':443', headers: { Host: target.hostname + ':443' } };
    if (proxy.username) {
      const pa = Buffer.from(decodeURIComponent(proxy.username) + ':' + decodeURIComponent(proxy.password)).toString('base64');
      co.headers['Proxy-Authorization'] = 'Basic ' + pa;
    }
    const r = http.request(co);
    r.on('connect', (res, socket) => {
      if (res.statusCode !== 200) { reject(new Error('proxy ' + res.statusCode)); return; }
      const ag = new https.Agent({ socket, rejectUnauthorized: false });
      const o = { hostname: target.hostname, port: 443, path: target.pathname + target.search, method: 'GET', headers: { 'Authorization': 'Basic ' + auth, 'Accept': 'application/json' }, agent: ag };
      const hr = https.request(o, (hres) => {
        const ch = [];
        hres.on('data', c => ch.push(c));
        hres.on('end', () => { try { resolve(JSON.parse(Buffer.concat(ch).toString())); } catch (err) { reject(err); } });
      });
      hr.on('error', reject);
      hr.end();
    });
    r.on('error', reject);
    r.end();
  });
}

try {
  const jql = encodeURIComponent(`worklogAuthor = currentUser() AND worklogDate = "${today}"`);
  const search = await req(`/rest/api/3/search/jql?jql=${jql}&fields=summary`);
  let total = 0;
  const bd = [];
  for (const issue of (search.issues || [])) {
    const wl = await req(`/rest/api/3/issue/${issue.key}/worklog`);
    for (const w of (wl.worklogs || [])) {
      if (w.author.emailAddress === e.JIRA_USER_EMAIL && w.started.startsWith(today) && w.timeSpentSeconds > 0) {
        total += w.timeSpentSeconds;
        bd.push(`${issue.key}: ${w.timeSpent}`);
      }
    }
  }
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const shf = Math.max(0, 8 * 3600 - total);
  const sh = Math.floor(shf / 3600);
  const sm = Math.floor((shf % 3600) / 60);
  const ok = total >= 8 * 3600;
  const head = ok ? `OK ${h}h ${m}m` : `WARNING ${h}h ${m}m / 8h - thieu ${sh}h ${sm}m`;
  const body = `Jira Worklog ${today}: ${head}`;
  const logLine = `[${new Date().toISOString()}] ${body}\n  ${bd.join('\n  ')}\n\n`;
  fs.writeFileSync('D:/Decree 53/.worklog-check.log', logLine, { flag: 'a' });
  console.log(body);
  console.log(bd.join('\n'));
  if (!ok) {
    const alertPath = 'D:/Decree 53/alert-latest.txt';
    const lines = [body, ''];
    if (bd.length) { lines.push(...bd); lines.push(''); }
    lines.push('Hay log them de du 8h!');
    fs.writeFileSync(alertPath, lines.join('\r\n'), 'utf8');
    try { spawn('cmd.exe', ['/c', 'start', '', 'notepad.exe', alertPath], { detached: true, stdio: 'ignore' }).unref(); } catch (err) { console.error('alert error:', err.message); }
  }
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}

