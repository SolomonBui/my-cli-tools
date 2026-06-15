import { spawn } from 'node:child_process';
const NODE = "D:/Decree 53/node-portable/node.exe";
const SCRIPT = "D:/Decree 53/check-worklog.mjs";

function msUntil(hour, minute) {
  const now = new Date();
  const t = new Date(now);
  t.setHours(hour, minute, 0, 0);
  if (t <= now) t.setDate(t.getDate() + 1);
  return t.getTime() - now.getTime();
}

function run() {
  const cp = spawn(NODE, [SCRIPT], { stdio: 'inherit', windowsHide: false });
  cp.on('exit', () => { setTimeout(run, msUntil(17, 0)); });
}

const wait = msUntil(17, 0);
console.log(`Daemon started. Next check: ${new Date(Date.now() + wait).toLocaleString()}`);
setTimeout(run, wait);
