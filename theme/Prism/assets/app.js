/* Prism — Xboard user theme (vanilla JS, no build step) */
(function () {
'use strict';
var S = window.settings || {};
var $app = document.getElementById('app');
var LS = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }, del: function (k) { try { localStorage.removeItem(k); } catch (e) {} } };

/* ---------- helpers ---------- */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function money(c) { return '¥' + (Number(c || 0) / 100).toFixed(2).replace(/\.00$/, ''); }
function bytes(n) { n = Number(n || 0); var u = ['B', 'KB', 'MB', 'GB', 'TB'], i = 0; while (n >= 1024 && i < 4) { n /= 1024; i++; } return (i > 1 ? n.toFixed(2).replace(/\.?0+$/, '') : Math.round(n)) + ' ' + u[i]; }
function gb(n) { var v = Number(n || 0) / 1073741824; return v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, ''); }
function date(ts, t) { if (!ts) return '-'; var d = new Date(ts * 1000), p = function (x) { return String(x).padStart(2, '0'); }; var s = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); return t ? s + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) : s; }
function daysLeft(ts) { return ts ? Math.ceil((ts * 1000 - Date.now()) / 864e5) : null; }
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function toast(m) { var e = document.createElement('div'); e.className = 'toast'; e.textContent = m; document.body.appendChild(e); setTimeout(function () { e.remove(); }, 2000); }
function copy(t) { var done = function () { toast('已复制'); }; if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(t).then(done, fb); } else fb(); function fb() { var a = document.createElement('textarea'); a.value = t; a.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('请长按手动复制'); } a.remove(); } }
function md(src) { var h = esc(src || ''); h = h.replace(/```([\s\S]*?)```/g, '<pre class="urlbox mono">$1</pre>').replace(/^### (.*)$/gm, '<h3>$1</h3>').replace(/^## (.*)$/gm, '<h3>$1</h3>').replace(/^# (.*)$/gm, '<h3>$1</h3>').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code class="mono">$1</code>').replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/\n/g, '<br>'); return h; }
var IC = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  bag: '<path d="M6 7h12l1 13H5zM9 7a3 3 0 0 1 6 0"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  gift: '<path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9c-3 0-5-4-2-4s2 4 2 4zm0 0c3 0 5-4 2-4s-2 4-2 4z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  wallet: '<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z"/><circle cx="16.5" cy="14.5" r="1"/>',
  device: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  reload: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>',
  pct: '<path d="M19 5L5 19M7 8a1.5 1.5 0 1 0 0-.01M17 17a1.5 1.5 0 1 0 0-.01"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3M21 14v.01M14 21h3M21 17v4"/>',
  dl: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  book: '<path d="M4 4h10a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4zM4 16a4 4 0 0 1 4-4h10"/>'
};
function ico(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + IC[n] + '</svg>'; }

function subShow(u) {
  var m = String(u).match(/^https?:\/\/([^\/]+)(\/.*)?$/); if (!m) return u;
  var p = m[2] || ''; if (p.length > 16) p = p.slice(0, 7) + '…' + p.slice(-4);
  return m[1] + p;
}
function subCard(url) {
  return '<div class="card subc"><div class="subh"><div><b>订阅链接</b><small>导入到客户端即可使用,请勿分享给他人</small></div><span class="subtag">通用订阅</span></div>' +
    '<button class="btn pri blk subgo" data-imp>一键导入</button>' +
    '<div class="subact"><button class="btn" data-copy>复制链接</button><button class="btn" data-qr>二维码</button>' +
    (S.download_url ? '<a class="btn" href="' + esc(S.download_url) + '" target="_blank" rel="noopener">下载客户端</a>' : '') + '</div></div>';
}

function statCard(ic, c, k, v, u) { return '<div class="card stat"><div class="sh"><span class="chip" style="--c:var(--c' + c + ')">' + ico(ic) + '</span><span class="k">' + k + '</span></div><div class="v">' + v + '</div>' + (u ? '<div class="u">' + u + '</div>' : '') + '</div>'; }

/* ---------- api ---------- */
var auth = LS.get('prism_auth');
function api(method, path, data) {
  var o = { method: method, headers: { 'Accept': 'application/json' } };
  if (auth) o.headers.Authorization = auth;
  var url = '/api/v1/' + path;
  if (data) {
    if (method === 'GET') url += (url.indexOf('?') > -1 ? '&' : '?') + new URLSearchParams(data).toString();
    else { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(data); }
  }
  return fetch(url, o).then(function (r) {
    return r.json().catch(function () { return {}; }).then(function (j) {
      if (r.status === 401 || r.status === 403 && /token|登录|Unauthenticated/i.test(j.message || '')) { logout(true); throw new Error('登录已过期'); }
      if (!r.ok || j.status === 'fail') { var m = j.message || '请求失败'; if (j.errors) { var f = Object.keys(j.errors)[0]; if (f) m = j.errors[f][0]; } throw new Error(m); }
      if (j.status === undefined && 'type' in j) return j;
      return j.data;
    });
  });
}
var cache = {};
function once(k, fn) { return cache[k] || (cache[k] = fn().catch(function (e) { delete cache[k]; throw e; })); }
function getConf() { return once('conf', function () { return api('GET', 'guest/comm/config').catch(function () { return {}; }); }); }
function getInfo(force) { if (force) delete cache.info; return once('info', function () { return api('GET', 'user/info'); }); }
function getSub(force) { if (force) delete cache.sub; return once('sub', function () { return api('GET', 'user/getSubscribe'); }); }
function logout(silent) { auth = null; LS.del('prism_auth'); cache = {}; location.hash = '#/login'; if (!silent) toast('已退出'); }

/* ---------- modal ---------- */
function sheet(html) {
  var m = document.createElement('div'); m.className = 'mask';
  m.innerHTML = '<div class="sheet">' + html + '</div>';
  m.addEventListener('click', function (e) { if (e.target === m) m.remove(); });
  document.body.appendChild(m); return m;
}
function busy(btn, fn) { btn.disabled = true; var t = btn.textContent; return Promise.resolve().then(fn).catch(function (e) { toast(e.message); }).then(function () { btn.disabled = false; btn.textContent = t; }); }

/* ---------- shell ---------- */
var NAV = [['#/', '首页', 'home'], ['#/plans', '套餐', 'bag'], ['#/orders', '订单', 'list'], ['#/tickets', '工单', 'chat'], ['#/me', '我的', 'user']];
var SIDE = NAV.concat([['#/invite', '邀请返利', 'gift'], ['#/nodes', '节点状态', 'globe'], ['#/docs', '使用文档', 'book']]);
function brand() { return (S.logo ? '<img src="' + esc(S.logo) + '" alt="">' : '<span class="logo-dot"></span>') + '<span>' + esc(S.title || 'Prism') + '</span>'; }
function shell(route, inner) {
  var cur = '#/' + (route.split('/')[1] || '');
  var on = function (h) { return (h === cur || (h === '#/' && cur === '#/')) ? ' on' : ''; };
  var side = SIDE.map(function (n) { return '<a class="' + on(n[0]).trim() + '" href="' + n[0] + '">' + ico(n[2]) + n[1] + '</a>'; }).join('');
  var tabs = NAV.map(function (n) { return '<a class="' + on(n[0]).trim() + '" href="' + n[0] + '">' + ico(n[2]) + n[1] + '</a>'; }).join('');
  return '<div class="shell"><aside class="side"><div class="brand">' + brand() + '</div>' + side + '<div class="sp"></div><a href="#" data-act="logout">退出登录</a></aside><main class="main pg">' + inner + '</main></div><nav class="tabbar">' + tabs + '</nav>';
}
function top(title, right) { var cur = document.documentElement.dataset.skin; return '<div class="top"><div class="brand">' + (title ? '<h2>' + esc(title) + '</h2>' : brand()) + '</div><div class="r">' + (right || '') + (S.skin_switch ? '<button class="ibtn" data-tg title="切换深色/浅色">' + ico(cur === 'light' ? 'moon' : 'sun') + '</button>' : '') + '</div></div>'; }
var spin = '<div class="spin"></div>';

/* ---------- router ---------- */
var routes = [];
function route(re, fn, pub) { routes.push({ re: re, fn: fn, pub: pub }); }
var token = 0;
try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
function render() {
  var h = location.hash.replace(/^#/, '') || '/'; var q = h.split('?'); h = q[0]; var my = ++token;
  if (!auth && !/^\/(login|register|forgot)$/.test(h)) { location.hash = '#/login'; return; }
  if (auth && /^\/(login|register|forgot)$/.test(h)) { location.hash = '#/'; return; }
  for (var i = 0; i < routes.length; i++) {
    var m = h.match(routes[i].re);
    if (m) {
      var r = routes[i];
      if (!r.pub) $app.innerHTML = shell(h, spin);
      Promise.resolve(r.fn(m, new URLSearchParams(q[1] || ''))).then(function (res) {
        if (my !== token || res == null) return;
        $app.innerHTML = r.pub ? res.html : shell(h, res.html);
        window.scrollTo(0, 0); setTimeout(function () { window.scrollTo(0, 0); }, 60);
        if (res.after) res.after();
      }).catch(function (e) { if (my === token) { $app.innerHTML = shell(h, '<div class="empty">加载失败:' + esc(e.message) + '<br><br><button class="btn" onclick="location.reload()">重试</button></div>'); } });
      return;
    }
  }
  location.hash = '#/';
}
window.addEventListener('hashchange', render);
document.addEventListener('click', function (e) {
  var a = e.target.closest('[data-act]'); if (!a) return;
  var act = a.dataset.act;
  if (act === 'logout') { e.preventDefault(); logout(); }
});
document.addEventListener('click', function (e) {
  var t = e.target.closest('[data-tg]'); if (!t) return;
  var n = document.documentElement.dataset.skin === 'light' ? 'dark' : 'light'; setSkin(n);
  $$('[data-tg]').forEach(function (b) { b.innerHTML = ico(n === 'light' ? 'moon' : 'sun'); });
});

/* ---------- auth pages ---------- */
function authPage(kind) {
  return getConf().then(function (c) {
    var reg = kind === 'register', fg = kind === 'forgot', lg = kind === 'login';
    var verify = (reg || fg) && Number(c.is_email_verify || 0) === 1;
    var whitelist = c.email_whitelist_suffix || null;
    var html = '<div class="auth"><div class="box pg"><div class="hd"><span class="logo-dot"></span><h1>' + (lg ? esc(S.title || '登录') : reg ? '创建账号' : '找回密码') + '</h1><p>' + (lg ? esc(c.app_description || S.description || '欢迎回来') : reg ? '注册后即可使用' : '通过邮箱验证码重设密码') + '</p></div><div class="card"><form id="f"><div id="err"></div>' +
      '<div class="fld"><label>邮箱</label><input name="email" type="email" autocomplete="username" placeholder="name@example.com" required></div>' +
      (verify ? '<div class="fld"><label>邮箱验证码</label><div class="code"><input name="email_code" inputmode="numeric" placeholder="6 位验证码" required><button type="button" class="btn" id="sc">发送验证码</button></div></div>' : '') +
      '<div class="fld"><label>' + (fg ? '新密码' : '密码') + '</label><input name="password" type="password" autocomplete="' + (lg ? 'current-password' : 'new-password') + '" placeholder="至少 8 位" required></div>' +
      (reg ? '<div class="fld"><label>确认密码</label><input name="password2" type="password" autocomplete="new-password" placeholder="再次输入密码" required></div>' : '') +
      (reg ? '<div class="fld"><label>邀请码' + (Number(c.is_invite_force) ? '' : '(选填)') + '</label><input name="invite_code" value="' + esc(new URLSearchParams(location.hash.split('?')[1] || '').get('code') || '') + '" ' + (Number(c.is_invite_force) ? 'required' : '') + '></div>' : '') +
      '<button class="btn pri blk" type="submit">' + (lg ? '登录' : reg ? '注册' : '重置密码') + '</button></form>' +
      '<div class="lnk">' + (lg ? '<a href="#/forgot">忘记密码?</a><a href="#/register">注册账号</a>' : '<a href="#/login">← 返回登录</a>' + (fg ? '' : '<span></span>')) + '</div></div>' +
      '</div>' + (S.skin_switch ? '<button class="ibtn auth-tg" data-tg title="切换深色/浅色">' + ico(document.documentElement.dataset.skin === 'light' ? 'moon' : 'sun') + '</button>' : '') + '</div>';
    return {
      html: html, after: function () {
        bindSkin();
        var f = $('#f'), err = $('#err');
        var sc = $('#sc');
        if (sc) sc.onclick = function () {
          var em = f.email.value.trim(); if (!em) { toast('请先填写邮箱'); return; }
          var n = 60; sc.disabled = true;
          api('POST', 'passport/comm/sendEmailVerify', { email: em }).then(function () { toast('验证码已发送'); var t = setInterval(function () { sc.textContent = --n + 's'; if (n <= 0) { clearInterval(t); sc.disabled = false; sc.textContent = '重新发送'; } }, 1000); }).catch(function (e) { toast(e.message); sc.disabled = false; });
        };
        f.onsubmit = function (ev) {
          ev.preventDefault(); err.innerHTML = '';
          var d = {}; new FormData(f).forEach(function (v, k) { d[k] = v; });
          if (reg && d.password !== d.password2) { err.innerHTML = '<div class="msg bad">两次输入的密码不一致</div>'; return; }
          delete d.password2;
          var btn = f.querySelector('[type=submit]');
          busy(btn, function () {
            return api('POST', 'passport/auth/' + (lg ? 'login' : reg ? 'register' : 'forget'), d).then(function (r) {
              if (fg) { toast('密码已重置,请登录'); location.hash = '#/login'; return; }
              auth = r.auth_data; LS.set('prism_auth', auth); cache = {}; location.hash = '#/';
            }).catch(function (e) { err.innerHTML = '<div class="msg bad">' + esc(e.message) + '</div>'; });
          });
        };
      }
    };
  });
}
route(/^\/login$/, function () { return authPage('login'); }, 1);
route(/^\/register$/, function () { return authPage('register'); }, 1);
route(/^\/forgot$/, function () { return authPage('forgot'); }, 1);

/* ---------- skin ---------- */
function setSkin(s) { document.documentElement.dataset.skin = s; LS.set('prism_skin', s); var m = document.querySelector('meta[name=theme-color]'); if (m) m.content = s === 'light' ? '#f6f6f4' : '#070b14'; $$('[data-skin]').forEach(function (x) { x.classList.toggle('on', x.dataset.skin === s); }); }
function skinBtns() {
  var cur = document.documentElement.dataset.skin;
  return '<div class="seg-t">' + [['dark', '深色'], ['light', '浅色']].map(function (s) { return '<button data-skin="' + s[0] + '"' + (cur === s[0] ? ' class="on"' : '') + '>' + s[1] + '</button>'; }).join('') + '</div>';
}
function bindSkin() { $$('[data-skin]').forEach(function (b) { b.onclick = function () { setSkin(b.dataset.skin); }; }); }

/* ---------- subscription helpers ---------- */
var T = function () { return encodeURIComponent(S.title || 'Prism'); };
var CLIENTS = [
  ['Shadowrocket', 'ios', function (u) { return 'shadowrocket://add/sub://' + btoa(u) + '?remark=' + T(); }],
  ['Stash', 'ios', function (u) { return 'stash://install-config?url=' + encodeURIComponent(u); }],
  ['Surge', 'ios', function (u) { return 'surge:///install-config?url=' + encodeURIComponent(u); }],
  ['sing-box', 'ios,android', function (u) { return 'sing-box://import-remote-profile?url=' + encodeURIComponent(u) + '#' + T(); }],
  ['Quantumult X', 'ios', null],
  ['Clash Meta', 'android', function (u) { return 'clash://install-config?url=' + encodeURIComponent(u) + '&name=' + T(); }],
  ['v2rayNG', 'android', function (u) { return 'v2rayng://install-sub/?url=' + encodeURIComponent(u) + '#' + T(); }],
  ['Clash Verge / Mihomo', 'desktop', function (u) { return 'clash://install-config?url=' + encodeURIComponent(u) + '&name=' + T(); }],
  ['其他客户端(v2rayN 等)', 'desktop,android,ios', null]
];
function platform() { var ua = navigator.userAgent || ''; if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'ios'; if (/Android/i.test(ua)) return 'android'; return 'desktop'; }
function importSheet(url) {
  var pf = platform(), list = CLIENTS.filter(function (c) { return c[1].split(',').indexOf(pf) > -1; });
  var m = sheet('<h3>一键导入订阅</h3><div class="mut sm" style="margin:-8px 0 12px">已根据你的设备显示可用客户端</div>' + list.map(function (c, i) { return c[2] ? '<div class="opt" data-i="' + i + '"><span>' + esc(c[0]) + '</span><span class="mut">导入 ›</span></div>' : '<div class="opt" data-cp="1"><span>' + esc(c[0]) + '</span><span class="mut">复制链接手动添加</span></div>'; }).join('') + (S.download_url ? '<a class="btn blk" style="margin-top:6px" href="' + esc(S.download_url) + '" target="_blank" rel="noopener">还没有客户端?去下载</a>' : ''));
  $$('[data-i]', m).forEach(function (e) { e.onclick = function () { var c = list[Number(e.dataset.i)]; location.href = c[2](url); setTimeout(function () { if (!document.hidden) toast('没反应?请先安装 ' + c[0]); }, 1500); }; });
  $$('[data-cp]', m).forEach(function (e) { e.onclick = function () { copy(url); }; });
}
function qrSheet(url) {
  var q = window.PrismQR(url), n = q.getModuleCount(), s = 220, cell = s / n, r = '';
  for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (q.isDark(y, x)) r += '<rect x="' + (x * cell).toFixed(2) + '" y="' + (y * cell).toFixed(2) + '" width="' + (cell + .4).toFixed(2) + '" height="' + (cell + .4).toFixed(2) + '"/>';
  sheet('<h3>订阅二维码</h3><svg class="qr" viewBox="0 0 ' + s + ' ' + s + '" fill="#000">' + r + '</svg><div class="mut sm" style="text-align:center">用客户端扫码即可导入</div>');
}

/* ---------- dashboard ---------- */
route(/^\/$/, function () {
  return Promise.all([getInfo(true), getSub(true), api('GET', 'user/notice/fetch').catch(function () { return []; }), api('GET', 'user/getStat').catch(function () { return [0, 0, 0]; })]).then(function (a) {
    var info = a[0], sub = a[1], notes = a[2], stat = a[3];
    var hasPlan = !!(sub && sub.plan_id), used = (sub.u || 0) + (sub.d || 0), total = sub.transfer_enable || 0, pct = total ? Math.min(100, used / total * 100) : 0;
    var left = daysLeft(sub.expired_at), exp = !sub.expired_at ? '长期有效' : date(sub.expired_at);
    var lt = left == null ? '' : left < 0 ? '已过期' : '剩余 ' + left + ' 天';
    var n0 = (notes && notes.data ? notes.data : notes || [])[0];
    var html = top('', '') +
      (n0 ? '<div class="card notice"><h3>' + esc(n0.title) + '</h3><div class="sm mut">' + md(n0.content) + '</div></div>' : '') +
      '<div class="card hero"><div class="k">' + (hasPlan ? esc(sub.plan ? sub.plan.name : '当前套餐') : '尚未订阅套餐') + ' · ' + esc(lt || exp) + '</div><div class="v">' + (hasPlan ? gb(Math.max(0, total - used)) + ' <small style="font-size:15px;font-weight:600">GB 剩余</small>' : '—') + '</div><div class="bar"><i style="width:' + pct.toFixed(1) + '%"></i></div><div class="row sm" style="margin-top:8px;opacity:.85"><span>已用 ' + bytes(used) + '</span><span>总量 ' + bytes(total) + '</span></div></div>' +
      '<div class="grid2">' + statCard('cal', 1, '到期时间', esc(exp), esc(lt)) +
      statCard('wallet', 2, '账户余额', money(info.balance), '佣金 ' + money(info.commission_balance)) +
      statCard('device', 3, '设备限制', (sub.device_limit || info.device_limit || '不限'), '同时在线') +
      statCard('reload', 4, '下次重置', (sub.reset_day != null ? sub.reset_day + ' 天后' : '—'), '流量周期') + '</div>' +
      (hasPlan ? subCard(sub.subscribe_url)
        : '<div class="card"><h3>开始使用</h3><p class="mut">你还没有可用的套餐,选购后即可获得订阅链接。</p><a class="btn pri blk" href="#/plans">选购套餐</a></div>') +
      ((stat && (stat[0] || stat[1])) ? '<div class="card"><a class="row" href="#/orders"><span>待支付订单 <b>' + (stat[0] || 0) + '</b> · 未处理工单 <b>' + (stat[1] || 0) + '</b></span><span class="mut">›</span></a></div>' : '');
    return {
      html: html, after: function () {
        var url = sub.subscribe_url;
        $('[data-copy]') && ($('[data-copy]').onclick = function () { copy(url); });
        $('[data-imp]') && ($('[data-imp]').onclick = function () { importSheet(url); });
        $('[data-qr]') && ($('[data-qr]').onclick = function () { qrSheet(url); });
      }
    };
  });
});

/* ---------- plans ---------- */
var PERIODS = [['month_price', '月付', '/月'], ['quarter_price', '季付', '/季'], ['half_year_price', '半年付', '/半年'], ['year_price', '年付', '/年'], ['two_year_price', '两年付', '/两年'], ['three_year_price', '三年付', '/三年'], ['onetime_price', '一次性', ''], ['reset_price', '重置流量包', '']];
function plist(p) { return (p.content || '').split(/\n|<br\s*\/?>/).map(function (s) { return s.replace(/<[^>]+>/g, '').trim(); }).filter(Boolean); }
function minPeriod(p) { for (var i = 0; i < PERIODS.length - 1; i++) if (p[PERIODS[i][0]] != null) return PERIODS[i]; return null; }
route(/^\/plans$/, function () {
  return Promise.all([api('GET', 'user/plan/fetch'), getSub()]).then(function (a) {
    var plans = a[0] || [], cur = a[1] && a[1].plan_id;
    var mid = Math.floor(plans.length / 2);
    var html = top('选购套餐') + (plans.length ? '<div class="grid3">' + plans.map(function (p, i) {
      var mp = minPeriod(p), lst = plist(p);
      return '<div class="card plan' + (i === mid && plans.length > 2 ? ' hot' : '') + '">' + (i === mid && plans.length > 2 ? '<span class="badge">推荐</span>' : '') + (p.id === cur ? '<span class="tag ok" style="float:right">当前</span>' : '') +
        '<div class="nm">' + esc(p.name) + '</div><div class="pr">' + (mp ? money(p[mp[0]]) + ' <small>' + mp[2] + '起</small>' : (p.onetime_price != null ? money(p.onetime_price) : '—')) + '</div><div class="mut sm">' + gb(p.transfer_enable * 1073741824) + ' GB 流量</div>' +
        '<ul>' + lst.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul><a class="btn pri blk" href="#/plan/' + p.id + '">' + (p.id === cur ? '续费 / 变更' : '立即订购') + '</a></div>';
    }).join('') + '</div>' : '<div class="empty">暂无可购买的套餐</div>');
    return { html: html };
  });
});

route(/^\/plan\/(\d+)$/, function (m) {
  var id = Number(m[1]);
  return Promise.all([api('GET', 'user/plan/fetch'), getInfo(true)]).then(function (a) {
    var p = a[0].filter(function (x) { return x.id === id; })[0], info = a[1];
    if (!p) return { html: top('套餐') + '<div class="empty">套餐不存在或已下架</div>' };
    var opts = PERIODS.filter(function (x) { return p[x[0]] != null; });
    var sel = opts[0] && opts[0][0], coupon = null, lst = plist(p);
    var html = top(p.name, '<a class="btn sm" href="#/plans">返回</a>') +
      '<div class="card"><div class="mut sm">' + gb(p.transfer_enable * 1073741824) + ' GB 流量</div><ul style="padding-left:18px;color:var(--mut)">' + lst.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="card"><h3>选择周期</h3><div id="opts"></div></div>' +
      '<div class="card"><h3>优惠码</h3><div class="code"><input id="cp" placeholder="有优惠码?在此输入"><button class="btn" id="cpb">使用</button></div></div>' +
      '<div class="card" id="sum"></div><button class="btn pri blk" id="go">下单</button>';
    return {
      html: html, after: function () {
        function paint() {
          $('#opts').innerHTML = opts.map(function (o) { return '<div class="opt' + (o[0] === sel ? ' on' : '') + '" data-p="' + o[0] + '"><b>' + o[1] + '</b><span>' + money(p[o[0]]) + '</span></div>'; }).join('');
          $$('[data-p]').forEach(function (e) { e.onclick = function () { sel = e.dataset.p; paint(); }; });
          var base = p[sel], disc = 0;
          if (coupon) disc = coupon.type === 1 ? Math.min(base, coupon.value) : Math.floor(base * coupon.value / 100);
          $('#sum').innerHTML = '<div class="sumline"><span>' + esc(p.name) + ' · ' + (PERIODS.filter(function (x) { return x[0] === sel; })[0] || [0, ''])[1] + '</span><span>' + money(base) + '</span></div>' + (disc ? '<div class="sumline"><span>优惠</span><span class="ok">-' + money(disc) + '</span></div>' : '') + '<div class="sumline t"><span>合计</span><span>' + money(base - disc) + '</span></div>';
        }
        paint();
        $('#cpb').onclick = function () { var c = $('#cp').value.trim(); if (!c) return; busy(this, function () { return api('POST', 'user/coupon/check', { code: c, plan_id: id }).then(function (r) { coupon = r; toast('优惠码已生效'); paint(); }).catch(function (e) { coupon = null; paint(); toast(e.message); }); }); };
        $('#go').onclick = function () {
          busy(this, function () { return api('POST', 'user/order/save', { plan_id: id, period: sel, coupon_code: coupon ? $('#cp').value.trim() : undefined }).then(function (no) { location.hash = '#/order/' + no; }); });
        };
      }
    };
  });
});

/* ---------- orders ---------- */
var OST = { 0: ['待支付', 'warn'], 1: ['开通中', 'warn'], 2: ['已取消', ''], 3: ['已完成', 'ok'], 4: ['已折抵', 'ok'] };
function pname(k) { var f = PERIODS.filter(function (x) { return x[0] === k; })[0]; return f ? f[1] : (k || ''); }
route(/^\/orders$/, function () {
  return api('GET', 'user/order/fetch').then(function (list) {
    list = list || [];
    return {
      html: top('我的订单') + '<div class="card">' + (list.length ? list.map(function (o) {
        var st = OST[o.status] || ['未知', ''];
        return '<a class="ord" href="#/order/' + esc(o.trade_no) + '"><div class="a"><b>' + esc(o.plan ? o.plan.name : '订单') + ' · ' + esc(pname(o.period)) + '</b><div class="d">' + date(o.created_at, 1) + '</div><div class="n">' + esc(o.trade_no) + '</div></div><div class="z"><b>' + money(o.total_amount) + '</b><span class="tag ' + st[1] + '">' + st[0] + '</span></div></a>';
      }).join('') : '<div class="empty">暂无订单</div>') + '</div>'
    };
  });
});

route(/^\/order\/([\w-]+)$/, function (m) {
  var no = m[1];
  return Promise.all([api('GET', 'user/order/detail', { trade_no: no }), api('GET', 'user/order/getPaymentMethod').catch(function () { return []; }), getInfo(true)]).then(function (a) {
    var o = a[0], pays = a[1] || [], info = a[2], st = OST[o.status] || ['未知', ''], pend = o.status === 0, method = pays[0] && pays[0].id;
    var html = top('订单详情', '<a class="btn sm" href="#/orders">返回</a>') +
      '<div class="card"><div class="row"><b>' + esc(o.plan ? o.plan.name : '订单') + '</b><span class="tag ' + st[1] + '">' + st[0] + '</span></div>' +
      '<div class="sumline"><span>订单号</span><span class="mono sm">' + esc(o.trade_no) + '</span></div><div class="sumline"><span>周期</span><span>' + esc(pname(o.period)) + '</span></div><div class="sumline"><span>创建时间</span><span>' + date(o.created_at, 1) + '</span></div>' +
      (o.discount_amount ? '<div class="sumline"><span>优惠</span><span class="ok">-' + money(o.discount_amount) + '</span></div>' : '') +
      (o.balance_amount ? '<div class="sumline"><span>余额抵扣</span><span>-' + money(o.balance_amount) + '</span></div>' : '') +
      '<div class="sumline t"><span>应付</span><span>' + money(o.total_amount) + '</span></div></div>' +
      (pend ? '<div class="card"><h3>支付方式</h3>' + pays.map(function (p, i) { return '<div class="opt" data-m="' + p.id + '"><b>' + esc(p.name) + '</b><span class="mut sm">' + (p.handling_fee_percent ? '手续费 ' + p.handling_fee_percent + '%' : '') + '</span></div>'; }).join('') + ((pays.length || o.total_amount <= 0) ? '' : '<div class="empty">管理员尚未配置支付方式</div>') + '</div>' +
        '<div class="btns"><button class="btn bad" id="cc">取消订单</button><button class="btn pri" id="pay" style="flex:2">立即支付</button></div>' : '');
    return {
      html: html, after: function () {
        if (!pend) return;
        var sel = null; $$('[data-m]').forEach(function (e, i) { if (i === 0) { e.classList.add('on'); sel = e.dataset.m; } e.onclick = function () { $$('[data-m]').forEach(function (x) { x.classList.remove('on'); }); e.classList.add('on'); sel = e.dataset.m; }; });
        $('#cc').onclick = function () { if (confirm('确定取消该订单?')) busy(this, function () { return api('POST', 'user/order/cancel', { trade_no: no }).then(function () { toast('已取消'); render(); }); }); };
        $('#pay').onclick = function () {
          if (sel == null && o.total_amount > 0) { toast('请选择支付方式'); return; }
          busy(this, function () {
            var body = { trade_no: no }; if (sel != null) body.method = Number(sel);
            return api('POST', 'user/order/checkout', body).then(function (r) {
              if (r.type === -1) { toast('支付成功'); cache = {}; render(); }
              else if (r.type === 1) { location.href = r.data; }
              else { var m2 = sheet('<h3>扫码支付</h3><div id="qrbox"></div><div class="mut sm" style="text-align:center">支付完成后页面将自动刷新</div>'); try { var q = window.PrismQR(r.data), n = q.getModuleCount(), s2 = 220, c = s2 / n, rr = ''; for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (q.isDark(y, x)) rr += '<rect x="' + (x * c).toFixed(2) + '" y="' + (y * c).toFixed(2) + '" width="' + (c + .4).toFixed(2) + '" height="' + (c + .4).toFixed(2) + '"/>'; $('#qrbox', m2).innerHTML = '<svg class="qr" viewBox="0 0 ' + s2 + ' ' + s2 + '" fill="#000">' + rr + '</svg>'; } catch (e) { $('#qrbox', m2).innerHTML = '<div class="urlbox">' + esc(r.data) + '</div>'; }
                var t = setInterval(function () { if (!document.body.contains(m2)) { clearInterval(t); return; } api('GET', 'user/order/check', { trade_no: no }).then(function (st) { if (st === 3 || st === 4) { clearInterval(t); m2.remove(); toast('支付成功'); cache = {}; render(); } }).catch(function () {}); }, 3000); }
            });
          });
        };
      }
    };
  });
});

/* ---------- tickets ---------- */
route(/^\/tickets$/, function () {
  return api('GET', 'user/ticket/fetch').then(function (list) {
    list = list || [];
    var lv = ['低', '中', '高'];
    return {
      html: top('我的工单', '<button class="btn pri sm" id="nt">新建工单</button>') + '<div class="card">' + (list.length ? list.map(function (t) {
        return '<a class="li" href="#/ticket/' + t.id + '" style="color:inherit"><div class="a"><b>' + esc(t.subject) + '</b><span class="mut sm">优先级 ' + lv[t.level] + ' · ' + date(t.updated_at, 1) + '</span></div><span class="tag ' + (t.status === 1 ? '' : t.reply_status === 1 ? 'ok' : 'warn') + '">' + (t.status === 1 ? '已关闭' : t.reply_status === 1 ? '已回复' : '待回复') + '</span></a>';
      }).join('') : '<div class="empty">暂无工单</div>') + '</div>',
      after: function () {
        $('#nt').onclick = function () {
          var m = sheet('<h3>新建工单</h3><div class="fld"><label>主题</label><input id="ts"></div><div class="fld"><label>优先级</label><select id="tl"><option value="0">低</option><option value="1" selected>中</option><option value="2">高</option></select></div><div class="fld"><label>问题描述</label><textarea id="tm"></textarea></div><button class="btn pri blk" id="tg">提交</button>');
          $('#tg', m).onclick = function () { var b = this; busy(b, function () { return api('POST', 'user/ticket/save', { subject: $('#ts', m).value, level: Number($('#tl', m).value), message: $('#tm', m).value }).then(function () { m.remove(); toast('已提交'); render(); }); }); };
        };
      }
    };
  });
});
route(/^\/ticket\/(\d+)$/, function (m) {
  return api('GET', 'user/ticket/fetch', { id: m[1] }).then(function (t) {
    var msgs = t.message || [];
    return {
      html: top(t.subject, '<a class="btn sm" href="#/tickets">返回</a>') + '<div class="card">' + msgs.map(function (x) { return '<div style="margin:0 0 14px;text-align:' + (x.is_me ? 'right' : 'left') + '"><div class="sm mut">' + (x.is_me ? '我' : '客服') + ' · ' + date(x.created_at, 1) + '</div><div class="msg" style="display:inline-block;max-width:88%;text-align:left;margin:4px 0 0' + (x.is_me ? ';border-color:var(--ac)' : '') + '">' + md(x.message) + '</div></div>'; }).join('') + '</div>' +
        (t.status === 1 ? '<div class="empty">该工单已关闭</div>' : '<div class="card"><textarea id="rp" placeholder="输入回复内容"></textarea><div class="btns" style="margin-top:10px"><button class="btn bad" id="cl">关闭工单</button><button class="btn pri" id="sd" style="flex:2">发送</button></div></div>'),
      after: function () {
        if (t.status === 1) return;
        $('#sd').onclick = function () { busy(this, function () { return api('POST', 'user/ticket/reply', { id: t.id, message: $('#rp').value }).then(function () { render(); }); }); };
        $('#cl').onclick = function () { if (confirm('关闭该工单?')) busy(this, function () { return api('POST', 'user/ticket/close', { id: t.id }).then(function () { location.hash = '#/tickets'; }); }); };
      }
    };
  });
});

/* ---------- invite ---------- */
route(/^\/invite$/, function () {
  return api('GET', 'user/invite/fetch').then(function (d) {
    var st = d.stat || [0, 0, 0, 0, 0], codes = d.codes || [];
    var link = function (c) { return location.origin + '/#/register?code=' + c; };
    return {
      html: top('邀请返利') + '<div class="grid2">' + statCard('users', 1, '已邀请', st[0], '位用户') + statCard('pct', 3, '返利比例', st[3] + '%', '每笔订单') + statCard('wallet', 2, '可用佣金', money(st[4]), '累计 ' + money(st[1])) + statCard('reload', 4, '确认中', money(st[2]), '审核后可用') + '</div>' +
        '<div class="card"><h3>我的邀请码<button class="btn sm" id="gen">生成</button></h3>' + (codes.length ? codes.map(function (c) { return '<div class="li" data-l="' + esc(link(c.code)) + '"><div class="a"><b class="mono">' + esc(c.code) + '</b><span class="mut sm">点击复制邀请链接</span></div><span class="mut">⧉</span></div>'; }).join('') : '<div class="empty">还没有邀请码,点击右上角生成</div>') + '</div>',
      after: function () {
        $$('[data-l]').forEach(function (e) { e.onclick = function () { copy(e.dataset.l); }; });
        $('#gen').onclick = function () { busy(this, function () { return api('GET', 'user/invite/save').then(function () { toast('已生成'); render(); }); }); };
      }
    };
  });
});

/* ---------- nodes ---------- */
route(/^\/nodes$/, function () {
  return api('GET', 'user/server/fetch').then(function (list) {
    list = list || [];
    return {
      html: top('节点状态') + (list.length ? '<div class="nodes">' + list.map(function (s) { var on = !!s.is_online; return '<div class="node"><span class="led' + (on ? '' : ' off') + '"></span><div class="a"><b>' + esc(s.name) + '</b><div class="sub"><span class="pt">' + esc(s.type || '') + '</span><span class="pt">倍率 ' + esc(s.rate) + 'x</span>' + (s.tags && s.tags.length ? s.tags.map(function (t) { return '<span class="pt">' + esc(t) + '</span>'; }).join('') : '') + '</div></div><span class="tag ' + (on ? 'ok' : 'bad') + '">' + (on ? '在线' : '离线') + '</span></div>'; }).join('') + '</div>' : '<div class="card"><div class="empty">当前套餐暂无可用节点<br>请先订购或续费套餐</div></div>')
    };
  });
});

/* ---------- docs ---------- */
route(/^\/docs$/, function () {
  return api('GET', 'user/knowledge/fetch', { language: 'zh-CN' }).then(function (g) {
    var cats = Object.keys(g || {});
    return {
      html: top('使用文档') + (cats.length ? cats.map(function (c) { return '<div class="card"><h3>' + esc(c) + '</h3>' + g[c].map(function (a) { return '<a class="li" href="#/doc/' + a.id + '" style="color:inherit"><div class="a"><b>' + esc(a.title) + '</b><span class="mut sm">' + date(a.updated_at) + '</span></div><span class="mut">›</span></a>'; }).join('') + '</div>'; }).join('') : '<div class="card"><div class="empty">暂无文档</div></div>')
    };
  });
});
route(/^\/doc\/(\d+)$/, function (m) {
  return api('GET', 'user/knowledge/fetch', { id: m[1], language: 'zh-CN' }).then(function (a) {
    return { html: top(a.title, '<a class="btn sm" href="#/docs">返回</a>') + '<div class="card" style="line-height:1.8">' + md((a.body || '').replace(/\{\{subscribe_url\}\}/g, '')) + '</div>' };
  });
});

/* ---------- me ---------- */
route(/^\/me$/, function () {
  return Promise.all([getInfo(true), getSub()]).then(function (a) {
    var i = a[0];
    return {
      html: top('我的') + '<div class="card"><div class="row"><div><b>' + esc(i.email) + '</b><div class="mut sm">注册于 ' + date(i.created_at) + '</div></div>' + (i.id ? '<span class="tag">UID ' + esc(i.id) + '</span>' : '') + '</div></div>' +
        '<div class="grid2">' + statCard('wallet', 2, '账户余额', money(i.balance), '') + statCard('users', 1, '佣金余额', money(i.commission_balance), '') + '</div>' +
        '<div class="card"><a class="li" href="#/invite" style="color:inherit"><b>邀请返利</b><span class="mut">›</span></a><a class="li" href="#/nodes" style="color:inherit"><b>节点状态</b><span class="mut">›</span></a><a class="li" href="#/docs" style="color:inherit"><b>使用文档</b><span class="mut">›</span></a></div>' +
        '<div class="card"><h3>账号安全</h3><div class="li" id="pw"><b>修改密码</b><span class="mut">›</span></div><div class="li" id="rs"><div class="a"><b>重置订阅链接</b><span class="mut sm">旧链接将立即失效</span></div><span class="mut">›</span></div></div>' +
        '<button class="btn bad blk" data-act="logout">退出登录</button>',
      after: function () {
        bindSkin();
        $('#pw').onclick = function () {
          var m = sheet('<h3>修改密码</h3><div class="fld"><label>旧密码</label><input id="o" type="password"></div><div class="fld"><label>新密码</label><input id="n" type="password"></div><button class="btn pri blk" id="ok">确认修改</button>');
          $('#ok', m).onclick = function () { busy(this, function () { return api('POST', 'user/changePassword', { old_password: $('#o', m).value, new_password: $('#n', m).value }).then(function () { m.remove(); toast('已修改,请重新登录'); logout(true); }); }); };
        };
        $('#rs').onclick = function () { if (confirm('重置后旧订阅链接将失效,需在客户端更新。确定?')) api('GET', 'user/resetSecurity').then(function () { cache = {}; toast('已重置'); }).catch(function (e) { toast(e.message); }); };
      }
    };
  });
});

/* ---------- boot ---------- */
if (document.documentElement.dataset.skin !== 'light') document.documentElement.dataset.skin = 'dark';
if (S.background_url) { document.body.style.background = 'url(' + S.background_url + ') center/cover fixed'; }
if (!location.hash) location.hash = auth ? '#/' : '#/login';
render();
})();
