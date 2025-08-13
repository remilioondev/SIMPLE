/* Simple site config */
const CONFIG = {
  tokenName: "Simple Cool Automatic Money Snag",
  tokenSymbol: "$SCAMS",
  contract: "XXXXXXXXXXXXXXXXXXXXXXXXXXX",
  dexscreenerUrl: "https://dexscreener.com/base/XXXXXXXXXXXXXXXXXXXXXXXXXXX?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15",
  buyUrl: "https://dexscreener.com/base/XXXXXXXXXXXXXXXXXXXXXXXXXXX",
  twitterUrl: "https://x.com/CoolSnag",
  telegramUrl: "https://t.me/SimpleCoolAutomaticMoneySnag",
  websiteUrl: "http://simplecoolautomaticmoneysnag.xyz",
  supply: "1,000,000,000",
  taxes: "0/0"
};

// Utils
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

function bindConfig(){
  const elAddr = $("#contract-address");
  if (elAddr) elAddr.textContent = CONFIG.contract;

  $$("[data-bind='tokenName']").forEach(n => n.textContent = CONFIG.tokenName);
  $$("[data-bind='tokenSymbol']").forEach(n => n.textContent = CONFIG.tokenSymbol);
  $$("[data-bind='supply']").forEach(n => n.textContent = CONFIG.supply);
  $$("[data-bind='taxes']").forEach(n => n.textContent = CONFIG.taxes);

  $$("[data-bind='buyUrl']").forEach(a => a.href = CONFIG.buyUrl);
  $$("[data-bind='twitterUrl']").forEach(a => a.href = CONFIG.twitterUrl);
  $$("[data-bind='telegramUrl']").forEach(a => a.href = CONFIG.telegramUrl);
  $$("[data-bind='websiteUrl']").forEach(a => a.href = CONFIG.websiteUrl);

  const iframe = $("#dex-iframe");
  if (iframe) iframe.src = CONFIG.dexscreenerUrl;

  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
}

function setupCopy(){
  const btn = $("#copy-btn");
  const elAddr = $("#contract-address");
  if (!btn || !elAddr) return;

  btn.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(CONFIG.contract);
      btn.textContent = "Copied!";
      setTimeout(()=> btn.textContent = "Copy", 1200);
    }catch(err){
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(elAddr);
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand("copy");
      sel.removeAllRanges();
      btn.textContent = "Copied!";
      setTimeout(()=> btn.textContent = "Copy", 1200);
    }
  });
}

/* ===== Shake bar logic ===== */
let _shakeRAF = null;
let _shakeIntensity = 0;

function _applyShakeFrame(){
  const amp = 14 * _shakeIntensity;
  const dx = (Math.random()*2 - 1) * amp;
  const dy = (Math.random()*2 - 1) * amp;
  const rot = (Math.random()*2 - 1) * (1.2 * _shakeIntensity);
  document.body.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
  _shakeRAF = requestAnimationFrame(_applyShakeFrame);
}
function _startShake(){
  if (_shakeRAF) return;
  document.documentElement.classList.add("shake-active");
  _shakeRAF = requestAnimationFrame(_applyShakeFrame);
}
function _stopShake(){
  if (_shakeRAF){
    cancelAnimationFrame(_shakeRAF);
    _shakeRAF = null;
  }
  document.documentElement.classList.remove("shake-active");
  document.body.style.transform = "";
}
function setupShakeBar(){
  const slider = document.getElementById("shake-slider");
  const shakebar = document.querySelector(".shakebar");
  if (!slider || !shakebar) return;
  const update = () => {
    const val = Number(slider.value) || 0; 
    _shakeIntensity = Math.min(1, Math.max(0, val / 100));
    shakebar.style.setProperty("--shake-glow", String(_shakeIntensity));
    if (_shakeIntensity >= 0.9){ _startShake(); }
    else if (_shakeIntensity <= 0.05){ _stopShake(); }
    else { _startShake(); }
  };
  slider.addEventListener("input", update);
  slider.addEventListener("change", update);
  update();
}

/* ===== GIF Looper fallback ===== */
function setupGifLooper(){
  const imgs = Array.from(document.querySelectorAll('img[data-loop]'));
  imgs.forEach(img => {
    const secs = Number(img.getAttribute('data-loop')) || 0;
    if (secs <= 0) return;
    setInterval(() => {
      const base = img.src.split('?')[0];
      img.src = base + '?r=' + Date.now();
    }, Math.max(500, secs * 1000));
  });
}

/* ===== Money Rain logic ===== */
function setupMoneyRain(){
  const container = document.querySelector('.money-rain');
  if (!container) return;

  const MAX_BAGS = 45;
  const SPAWN_MS  = 180;
  const EMOJI = "💰";

  let active = 0;
  function spawn(){
    if (active >= MAX_BAGS) return;
    const bag = document.createElement('span');
    bag.className = 'money-bag';
    bag.textContent = EMOJI;

    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const left = Math.random() * vw;
    bag.style.left = left + 'px';

    const size = 18 + Math.random()*44;
    bag.style.fontSize = size + 'px';

    const dur = 6 + Math.random()*7;
    bag.style.animationDuration = dur + 's';

    const delay = Math.random()*1.2;
    bag.style.animationDelay = delay + 's';

    active++;
    container.appendChild(bag);

    function cleanup(){
      if (!bag.parentNode) return;
      bag.parentNode.removeChild(bag);
      active--;
    }
    bag.addEventListener('animationend', cleanup);
    setTimeout(cleanup, (dur + delay + 0.5) * 1000);
  }

  const timer = setInterval(spawn, SPAWN_MS);
  for (let i=0;i<12;i++) spawn();
  window.addEventListener('beforeunload', ()=> clearInterval(timer));
}

document.addEventListener("DOMContentLoaded", () => {
  bindConfig();
  setupCopy();
  setupShakeBar();
  setupGifLooper();
  setupMoneyRain();
});
