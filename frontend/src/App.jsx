import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const API = "http://127.0.0.1:5000/api";

const navItems = [
  ["today", "Today"],
  ["appointments", "Appointments"],
  ["medications", "Medications"],
  ["timeline", "Timeline"],
  ["reminders", "Reminders"],
  ["notes", "Notes"],
];

const styles = `
*{
  box-sizing:border-box;
}

html{
  scroll-behavior:smooth;
}

body{
  margin:0;
  min-width:320px;
  background:#07110f;
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  color:#effbf5;
  overflow-x:hidden;
}

button,
input,
select,
textarea{
  font:inherit;
}

button{
  color:inherit;
}

button,
a{
  -webkit-tap-highlight-color:transparent;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible{
  outline:2px solid #77efbb;
  outline-offset:3px;
}

:root{
  --bg:#07110f;
  --bg2:#0b1714;
  --panel:rgba(17,32,28,.68);
  --panel-strong:rgba(16,31,27,.88);
  --stroke:rgba(209,255,231,.12);
  --stroke-strong:rgba(161,255,210,.24);
  --text:#effbf5;
  --muted:#9bb1a7;
  --soft:#c9ddd4;
  --mint:#7af1bd;
  --mint2:#49d89e;
  --lime:#b9f46c;
  --danger:#ff7f88;
  --shadow:0 30px 80px rgba(0,0,0,.35);
}

::selection{
  background:rgba(122,241,189,.25);
  color:#fff;
}

::-webkit-scrollbar{
  width:8px;
  height:8px;
}

::-webkit-scrollbar-track{
  background:#07110f;
}

::-webkit-scrollbar-thumb{
  background:rgba(122,241,189,.25);
  border-radius:999px;
}

a{
  color:inherit;
  text-decoration:none;
}

.cf-app,
.cf-landing{
  min-height:100vh;
  position:relative;
  isolation:isolate;
  overflow:hidden;
  background:
    radial-gradient(circle at 14% 10%,rgba(62,204,145,.12),transparent 25%),
    radial-gradient(circle at 90% 18%,rgba(185,244,108,.08),transparent 22%),
    linear-gradient(180deg,#07110f,#091613 65%,#07110f);
}

.ambient{
  position:fixed;
  inset:0;
  z-index:-5;
  pointer-events:none;
  overflow:hidden;
}

.ambient::before{
  content:"";
  position:absolute;
  inset:0;
  opacity:.14;
  background-image:
    linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size:52px 52px;
  mask-image:linear-gradient(to bottom,black,transparent 85%);
}

.orb{
  position:absolute;
  border-radius:50%;
  filter:blur(2px);
  opacity:.55;
}

.orb-one{
  width:560px;
  height:560px;
  top:-180px;
  left:-180px;
  background:radial-gradient(circle,rgba(71,223,158,.24),rgba(71,223,158,0) 70%);
  animation:orbFloatA 14s ease-in-out infinite alternate;
}

.orb-two{
  width:620px;
  height:620px;
  right:-250px;
  top:20%;
  background:radial-gradient(circle,rgba(185,244,108,.15),rgba(185,244,108,0) 70%);
  animation:orbFloatB 18s ease-in-out infinite alternate;
}

.orb-three{
  width:420px;
  height:420px;
  left:45%;
  bottom:-220px;
  background:radial-gradient(circle,rgba(80,160,255,.11),rgba(80,160,255,0) 70%);
  animation:orbFloatC 16s ease-in-out infinite alternate;
}

@keyframes orbFloatA{
  from{transform:translate3d(0,0,0) scale(1);}
  to{transform:translate3d(120px,110px,0) scale(1.08);}
}

@keyframes orbFloatB{
  from{transform:translate3d(0,0,0) scale(1);}
  to{transform:translate3d(-110px,80px,0) scale(.9);}
}

@keyframes orbFloatC{
  from{transform:translate3d(-40px,0,0);}
  to{transform:translate3d(80px,-80px,0);}
}

.glass{
  background:linear-gradient(
    145deg,
    rgba(28,46,40,.75),
    rgba(12,25,22,.56)
  );
  border:1px solid var(--stroke);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.04),
    0 24px 65px rgba(0,0,0,.2);
  backdrop-filter:blur(22px);
  -webkit-backdrop-filter:blur(22px);
}

.brand{
  display:flex;
  align-items:center;
  gap:11px;
  font-weight:800;
  letter-spacing:-.03em;
}

.brand-mark{
  width:42px;
  height:42px;
  border-radius:14px;
  display:grid;
  place-items:center;
  color:#07110f;
  background:
    linear-gradient(135deg,var(--mint),var(--lime));
  box-shadow:
    0 0 0 6px rgba(122,241,189,.05),
    0 15px 30px rgba(75,220,155,.18);
}

.brand-text{
  display:flex;
  flex-direction:column;
  line-height:1.05;
}

.brand-text strong{
  font-size:17px;
}

.brand-text small{
  margin-top:5px;
  color:var(--muted);
  font-size:10px;
  letter-spacing:.08em;
  font-weight:600;
  text-transform:uppercase;
}

.button{
  border:0;
  cursor:pointer;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:9px;
  min-height:46px;
  padding:0 18px;
  border-radius:15px;
  font-weight:800;
  font-size:13px;
  transition:
    transform .3s ease,
    box-shadow .3s ease,
    border-color .3s ease,
    background .3s ease;
}

.button:hover{
  transform:translateY(-3px);
}

.button-primary{
  color:#07110f;
  background:linear-gradient(135deg,var(--mint),var(--lime));
  box-shadow:
    0 16px 35px rgba(70,220,156,.18),
    inset 0 1px 0 rgba(255,255,255,.55);
}

.button-primary:hover{
  box-shadow:
    0 24px 48px rgba(70,220,156,.28),
    inset 0 1px 0 rgba(255,255,255,.55);
}

.button-secondary{
  color:var(--text);
  border:1px solid var(--stroke);
  background:rgba(255,255,255,.03);
}

.button-secondary:hover{
  border-color:rgba(122,241,189,.4);
  background:rgba(122,241,189,.06);
}

.button-large{
  min-height:56px;
  padding:0 25px;
  border-radius:18px;
}

.eyebrow{
  color:var(--mint);
  font-size:10px;
  font-weight:900;
  letter-spacing:.18em;
  text-transform:uppercase;
  margin:0 0 13px;
}

.cf-landing{
  padding:24px;
}

.landing-nav{
  max-width:1320px;
  margin:0 auto;
  min-height:78px;
  border-radius:24px;
  padding:13px 16px 13px 18px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  position:sticky;
  top:18px;
  z-index:40;
}

.landing-links{
  display:flex;
  align-items:center;
  gap:34px;
  color:#adbbb5;
  font-weight:700;
  font-size:12px;
}

.landing-links a{
  transition:.25s ease;
}

.landing-links a:hover{
  color:var(--mint);
}

.hero{
  min-height:calc(100vh - 120px);
  max-width:1320px;
  margin:0 auto;
  padding:80px 20px 70px;
  display:grid;
  grid-template-columns:minmax(0,.95fr) minmax(520px,1.05fr);
  align-items:center;
  gap:65px;
}

.hero-copy{
  position:relative;
  z-index:3;
}

.hero-badge{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 12px;
  margin-bottom:23px;
  border:1px solid rgba(122,241,189,.16);
  border-radius:999px;
  background:rgba(122,241,189,.05);
  color:#baf7d8;
  font-size:10px;
  letter-spacing:.12em;
  font-weight:800;
  text-transform:uppercase;
}

.hero h1{
  margin:0;
  max-width:690px;
  font-size:clamp(58px,6.9vw,105px);
  line-height:.84;
  letter-spacing:-.075em;
  font-weight:820;
}

.hero h1 em{
  display:inline-block;
  color:var(--mint);
  font-family:Georgia,"Times New Roman",serif;
  font-weight:400;
  letter-spacing:-.055em;
  text-shadow:0 0 35px rgba(122,241,189,.14);
}

.hero-lede{
  max-width:590px;
  margin:30px 0 0;
  color:#aabbb3;
  font-size:17px;
  line-height:1.8;
}

.hero-actions{
  display:flex;
  align-items:center;
  gap:18px;
  margin-top:34px;
}

.text-link{
  color:#cfddd7;
  font-size:12px;
  font-weight:800;
}

.text-link span{
  color:var(--mint);
  display:inline-block;
  margin-left:5px;
  animation:bob 1.8s ease-in-out infinite;
}

@keyframes bob{
  50%{transform:translateY(4px);}
}

.hero-trust{
  display:flex;
  flex-wrap:wrap;
  gap:18px;
  margin-top:35px;
  color:#849b91;
  font-size:11px;
}

.hero-trust span{
  display:flex;
  align-items:center;
  gap:7px;
}

.hero-visual{
  min-height:650px;
  position:relative;
  display:grid;
  place-items:center;
  perspective:1400px;
}

.floating-dashboard{
  position:relative;
  width:min(100%,650px);
  min-height:570px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.dashboard-card{
  width:540px;
  padding:18px;
  border-radius:30px;
  transform:rotateY(-7deg) rotateX(4deg) rotateZ(1deg);
  animation:dashboardFloat 6s ease-in-out infinite;
  box-shadow:
    0 60px 100px rgba(0,0,0,.38),
    0 0 80px rgba(89,230,163,.05);
}

@keyframes dashboardFloat{
  0%,100%{
    transform:translateY(0) rotateY(-7deg) rotateX(4deg) rotateZ(1deg);
  }
  50%{
    transform:translateY(-16px) rotateY(-4deg) rotateX(2deg) rotateZ(0);
  }
}

.dashboard-toolbar{
  height:54px;
  border-bottom:1px solid var(--stroke);
  display:flex;
  align-items:center;
  justify-content:space-between;
  color:#789087;
  font-size:10px;
  font-weight:800;
  letter-spacing:.08em;
}

.toolbar-dots{
  display:flex;
  gap:6px;
}

.toolbar-dots i{
  width:7px;
  height:7px;
  border-radius:50%;
  background:#53665e;
}

.dashboard-inside{
  padding:30px 12px 12px;
}

.dash-eyebrow{
  color:var(--mint);
  font-size:9px;
  font-weight:900;
  letter-spacing:.18em;
}

.dashboard-inside h3{
  font-size:30px;
  line-height:1;
  letter-spacing:-.045em;
  margin:9px 0 25px;
}

.demo-flow-card{
  min-height:94px;
  border:1px solid rgba(255,255,255,.06);
  border-radius:21px;
  padding:15px;
  margin-bottom:12px;
  display:grid;
  grid-template-columns:65px 1fr auto;
  gap:15px;
  align-items:center;
  background:rgba(255,255,255,.025);
  transition:.3s ease;
}

.demo-flow-card:hover{
  border-color:rgba(122,241,189,.24);
  transform:translateX(7px);
}

.demo-flow-card.featured{
  background:
    linear-gradient(120deg,rgba(122,241,189,.1),rgba(255,255,255,.02));
  border-color:rgba(122,241,189,.17);
}

.demo-time{
  font-size:12px;
  font-weight:900;
  color:var(--mint);
}

.demo-flow-card div{
  display:flex;
  flex-direction:column;
}

.demo-flow-card small{
  font-size:8px;
  color:#6f867c;
  letter-spacing:.14em;
  font-weight:900;
}

.demo-flow-card strong{
  font-size:13px;
  margin:5px 0;
}

.demo-flow-card span{
  font-size:10px;
  color:#80948b;
}

.demo-state{
  width:9px;
  height:9px;
  border-radius:50%;
  background:var(--mint);
  box-shadow:0 0 0 7px rgba(122,241,189,.08);
}

.floating-card{
  position:absolute;
  z-index:5;
  border:1px solid var(--stroke);
  background:rgba(13,27,23,.88);
  backdrop-filter:blur(20px);
  box-shadow:var(--shadow);
}

.floating-stat{
  top:70px;
  right:-5px;
  width:170px;
  padding:18px;
  border-radius:22px;
  animation:floatMini 5s ease-in-out infinite;
}

.floating-stat span,
.floating-note span{
  color:#80958b;
  display:block;
  font-size:8px;
  font-weight:900;
  letter-spacing:.15em;
}

.floating-stat strong{
  display:block;
  margin-top:7px;
  font-size:37px;
  letter-spacing:-.06em;
}

.floating-stat small{
  color:#9cafaa;
}

.floating-note{
  left:-5px;
  bottom:55px;
  width:185px;
  border-radius:22px;
  padding:18px;
  animation:floatMini 6.5s ease-in-out infinite reverse;
}

.floating-note strong{
  display:block;
  margin:8px 0 5px;
  font-size:13px;
}

.floating-note p{
  margin:0;
  color:#8ca097;
  font-size:10px;
  line-height:1.5;
}

@keyframes floatMini{
  0%,100%{transform:translateY(0) rotate(-1deg);}
  50%{transform:translateY(-13px) rotate(1.5deg);}
}

.flow-ring{
  position:absolute;
  border-radius:50%;
  border:1px solid rgba(122,241,189,.11);
  pointer-events:none;
}

.ring-1{
  width:620px;
  height:620px;
  animation:spinSlow 24s linear infinite;
}

.ring-1::before{
  content:"";
  position:absolute;
  width:10px;
  height:10px;
  background:var(--mint);
  border-radius:50%;
  top:92px;
  left:103px;
  box-shadow:0 0 24px rgba(122,241,189,.8);
}

.ring-2{
  width:485px;
  height:485px;
  border-style:dashed;
  animation:spinSlow 32s linear infinite reverse;
}

@keyframes spinSlow{
  to{transform:rotate(360deg);}
}

.section{
  max-width:1320px;
  margin:0 auto;
  padding:120px 20px;
}

.problem-section{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:100px;
  border-top:1px solid rgba(255,255,255,.06);
}

.section h2{
  margin:0;
  font-size:clamp(43px,4.6vw,72px);
  letter-spacing:-.06em;
  line-height:.94;
}

.section h2 em{
  color:var(--mint);
  font-family:Georgia,serif;
  font-weight:400;
}

.problem-copy{
  align-self:end;
}

.problem-copy p{
  margin:0 0 22px;
  max-width:520px;
  color:#9db0a7;
  line-height:1.8;
  font-size:15px;
}

.feature-section{
  padding-top:70px;
}

.feature-heading{
  max-width:850px;
  margin-bottom:55px;
}

.feature-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:16px;
}

.feature-card{
  min-height:360px;
  padding:30px;
  border-radius:28px;
  position:relative;
  overflow:hidden;
  transition:.4s cubic-bezier(.2,.8,.2,1);
}

.feature-card::before{
  content:"";
  position:absolute;
  width:180px;
  height:180px;
  border-radius:50%;
  right:-70px;
  top:-70px;
  background:rgba(122,241,189,.07);
  transition:.4s ease;
}

.feature-card:hover{
  transform:translateY(-10px);
  border-color:rgba(122,241,189,.22);
}

.feature-card:hover::before{
  transform:scale(1.5);
}

.feature-number{
  color:#70877c;
  font-size:11px;
  font-weight:900;
}

.feature-icon{
  width:50px;
  height:50px;
  border-radius:16px;
  display:grid;
  place-items:center;
  margin-top:75px;
  color:var(--mint);
  background:rgba(122,241,189,.07);
  border:1px solid rgba(122,241,189,.12);
}

.feature-card h3{
  font-size:27px;
  margin:20px 0 12px;
  letter-spacing:-.04em;
}

.feature-card p{
  color:#8fa39a;
  line-height:1.7;
  font-size:13px;
  max-width:300px;
}

.feature-arrow{
  position:absolute;
  right:28px;
  bottom:24px;
  font-size:20px;
  color:#6f8b7f;
  transition:.3s ease;
}

.feature-card:hover .feature-arrow{
  color:var(--mint);
  transform:translate(4px,-4px);
}

.preview-stage{
  min-height:610px;
  border-radius:36px;
  padding:35px;
  position:relative;
  display:grid;
  grid-template-columns:1.4fr .6fr;
  gap:20px;
  overflow:hidden;
}

.preview-stage::before{
  content:"";
  position:absolute;
  width:450px;
  height:450px;
  border-radius:50%;
  background:rgba(122,241,189,.08);
  filter:blur(80px);
  right:-80px;
  top:-150px;
}

.preview-panel{
  position:relative;
  z-index:1;
  border:1px solid rgba(255,255,255,.06);
  border-radius:25px;
  background:rgba(5,14,12,.44);
  padding:28px;
}

.preview-main{
  display:flex;
  flex-direction:column;
  justify-content:center;
}

.preview-main h3{
  font-size:38px;
  letter-spacing:-.05em;
  margin:10px 0 35px;
}

.preview-side{
  align-self:center;
  min-height:350px;
}

.preview-side hr{
  border:0;
  border-top:1px solid rgba(255,255,255,.07);
  margin:28px 0;
}

.preview-side strong{
  display:block;
  font-size:18px;
  margin:10px 0 7px;
}

.preview-side span{
  color:#879c92;
  font-size:11px;
}

.trust-section{
  display:grid;
  grid-template-columns:120px 1fr;
  align-items:start;
  gap:35px;
  border-radius:35px;
  padding:55px;
}

.trust-mark{
  width:90px;
  height:90px;
  border-radius:26px;
  display:grid;
  place-items:center;
  color:var(--mint);
  border:1px solid rgba(122,241,189,.17);
  background:rgba(122,241,189,.06);
}

.trust-section h2{
  font-size:clamp(35px,4vw,60px);
}

.trust-section p:last-child{
  color:#98aca2;
  line-height:1.75;
  max-width:750px;
}

.cta{
  text-align:center;
  padding-bottom:145px;
}

.cta h2{
  font-size:clamp(60px,8vw,110px);
  line-height:.87;
}

.cta .button{
  margin-top:35px;
}

.landing-footer{
  max-width:1320px;
  min-height:105px;
  margin:0 auto;
  border-top:1px solid rgba(255,255,255,.07);
  display:flex;
  align-items:center;
  justify-content:space-between;
  color:#70877d;
  font-size:11px;
}

/* APP */

.cf-app{
  display:grid;
  grid-template-columns:270px minmax(0,1fr);
  gap:0;
}

.sidebar{
  height:calc(100vh - 28px);
  position:sticky;
  top:14px;
  margin:14px 0 14px 14px;
  padding:20px 14px;
  border-radius:28px;
  z-index:35;
  display:flex;
  flex-direction:column;
}

.sidebar .brand{
  padding:8px 9px 24px;
}

.brand-button{
  border:0;
  background:none;
  color:inherit;
  cursor:pointer;
  text-align:left;
}

.sidebar-label{
  margin:8px 13px 10px;
  color:#5e776c;
  font-size:8px;
  font-weight:900;
  letter-spacing:.2em;
}

.nav-list{
  display:flex;
  flex-direction:column;
  gap:5px;
}

.nav-item{
  position:relative;
  min-height:52px;
  display:flex;
  align-items:center;
  gap:12px;
  padding:0 13px;
  border:1px solid transparent;
  border-radius:16px;
  color:#82988e;
  background:transparent;
  cursor:pointer;
  font-size:12px;
  font-weight:750;
  text-align:left;
  transition:.3s ease;
  overflow:hidden;
}

.nav-item:hover{
  color:#d6e8df;
  background:rgba(255,255,255,.025);
}

.nav-item.active{
  color:#ecfff6;
  border-color:rgba(122,241,189,.14);
  background:
    linear-gradient(100deg,rgba(122,241,189,.11),rgba(122,241,189,.025));
}

.nav-item.active::after{
  content:"";
  position:absolute;
  width:3px;
  height:22px;
  left:0;
  border-radius:0 4px 4px 0;
  background:var(--mint);
  box-shadow:0 0 14px rgba(122,241,189,.7);
}

.nav-icon{
  width:31px;
  height:31px;
  border-radius:10px;
  display:grid;
  place-items:center;
  transition:.3s ease;
}

.nav-item.active .nav-icon{
  color:var(--mint);
  background:rgba(122,241,189,.08);
}

.sidebar-bottom{
  margin-top:auto;
}

.privacy-mini{
  display:flex;
  gap:10px;
  padding:15px;
  border:1px solid rgba(122,241,189,.08);
  border-radius:18px;
  background:rgba(122,241,189,.025);
}

.privacy-mini svg{
  flex:0 0 auto;
  color:var(--mint);
}

.privacy-mini div{
  display:flex;
  flex-direction:column;
}

.privacy-mini strong{
  font-size:10px;
}

.privacy-mini span{
  margin-top:4px;
  color:#688077;
  font-size:8px;
  line-height:1.4;
}

.back-link{
  border:0;
  background:none;
  color:#647b71;
  font-size:9px;
  font-weight:700;
  cursor:pointer;
  padding:18px 10px 4px;
}

.back-link:hover{
  color:var(--mint);
}

.main-area{
  min-width:0;
  padding:14px 14px 40px 18px;
}

.app-header{
  min-height:76px;
  border-radius:25px;
  padding:12px 17px;
  position:sticky;
  top:14px;
  z-index:25;
  display:flex;
  align-items:center;
  justify-content:space-between;
}

.header-left{
  display:flex;
  align-items:center;
  gap:13px;
}

.header-kicker{
  display:block;
  margin-bottom:5px;
  color:#5f776d;
  font-size:7px;
  letter-spacing:.18em;
  font-weight:900;
}

.breadcrumb{
  color:#c7d8d0;
  font-size:11px;
  font-weight:800;
}

.breadcrumb span{
  color:#527065;
  margin:0 5px;
}

.profile-chip{
  display:flex;
  align-items:center;
  gap:10px;
  padding:6px 11px 6px 7px;
  min-width:145px;
  border:1px solid rgba(255,255,255,.06);
  border-radius:15px;
  background:rgba(255,255,255,.025);
}

.avatar{
  width:34px;
  height:34px;
  border-radius:11px;
  display:grid;
  place-items:center;
  color:#07110f;
  background:linear-gradient(135deg,var(--mint),var(--lime));
  font-weight:900;
}

.profile-copy{
  display:flex;
  flex-direction:column;
}

.profile-copy strong{
  font-size:10px;
}

.profile-copy small{
  margin-top:2px;
  color:#60776d;
  font-size:7px;
}

.mobile-menu{
  display:none;
  width:42px;
  height:42px;
  border:1px solid var(--stroke);
  border-radius:13px;
  background:rgba(255,255,255,.025);
  cursor:pointer;
}

.page-content{
  max-width:1450px;
  margin:0 auto;
  padding:55px 28px 60px;
}

.page-header{
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  gap:25px;
  margin-bottom:35px;
}

.page-header h1{
  margin:0;
  font-size:clamp(42px,5vw,72px);
  line-height:.9;
  letter-spacing:-.065em;
}

.page-subtitle{
  color:#8ba096;
  font-size:11px;
  padding-bottom:6px;
}

.today-grid{
  display:grid;
  grid-template-columns:minmax(0,1.35fr) minmax(285px,.65fr);
  gap:18px;
}

.today-main,
.today-aside{
  min-width:0;
}

.section-label{
  margin:0 0 12px 5px;
  color:#5e786d;
  font-size:8px;
  letter-spacing:.16em;
  font-weight:900;
}

.flow-card{
  min-height:113px;
  padding:18px 20px;
  margin-bottom:11px;
  border-radius:23px;
  display:grid;
  grid-template-columns:80px minmax(0,1fr) auto;
  gap:17px;
  align-items:center;
  border:1px solid rgba(255,255,255,.055);
  background:
    linear-gradient(115deg,rgba(255,255,255,.035),rgba(255,255,255,.012));
  transition:
    transform .35s cubic-bezier(.2,.8,.2,1),
    border-color .35s ease,
    background .35s ease;
}

.flow-card:hover{
  transform:translateY(-5px) translateX(4px);
  border-color:rgba(122,241,189,.2);
  background:
    linear-gradient(115deg,rgba(122,241,189,.07),rgba(255,255,255,.015));
}

.flow-time{
  color:var(--mint);
  font-size:15px;
  font-weight:900;
}

.flow-icon{
  width:46px;
  height:46px;
  display:grid;
  place-items:center;
  border-radius:15px;
  color:var(--mint);
  background:rgba(122,241,189,.07);
}

.flow-card-content h3{
  margin:4px 0 6px;
  font-size:17px;
  letter-spacing:-.025em;
}

.flow-card-content p{
  margin:0;
  color:#789087;
  font-size:10px;
}

.card-kicker{
  color:#6d867b;
  font-size:7px;
  letter-spacing:.16em;
  font-weight:900;
  text-transform:uppercase;
}

.flow-state,
.badge{
  border-radius:999px;
  padding:7px 9px;
  color:#9eb3aa;
  font-size:7px;
  font-weight:900;
  text-transform:uppercase;
  letter-spacing:.07em;
  background:rgba(255,255,255,.04);
}

.flow-state.upcoming,
.badge.upcoming,
.badge.active{
  color:var(--mint);
  background:rgba(122,241,189,.07);
}

.flow-state.pending{
  color:#e5c87b;
  background:rgba(229,200,123,.07);
}

.aside-block,
.aside-stats,
.notice,
.timeline-intro{
  padding:24px;
  border:1px solid rgba(255,255,255,.055);
  border-radius:23px;
  background:rgba(255,255,255,.022);
}

.aside-block{
  margin-bottom:11px;
  transition:.3s ease;
}

.aside-block:hover{
  transform:translateY(-4px);
  border-color:rgba(122,241,189,.16);
}

.aside-block h3{
  margin:11px 0 7px;
  font-size:18px;
}

.aside-block p,
.aside-block span:not(.card-kicker){
  color:#758c82;
  font-size:9px;
  line-height:1.6;
}

.next-time{
  color:var(--mint)!important;
  font-size:30px!important;
  font-weight:900;
  letter-spacing:-.05em;
  margin-top:14px;
}

.aside-stats{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
}

.aside-stats div{
  min-width:0;
}

.aside-stats strong{
  display:block;
  font-size:23px;
  color:var(--text);
}

.aside-stats span{
  display:block;
  color:#657d72;
  margin-top:5px;
  font-size:7px;
  line-height:1.3;
}

.quick-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:12px;
  margin-top:18px;
}

.quick-card{
  min-height:88px;
  border:1px solid rgba(255,255,255,.055);
  border-radius:21px;
  padding:0 20px;
  background:rgba(255,255,255,.02);
  cursor:pointer;
  color:#97aba2;
  display:flex;
  align-items:center;
  gap:12px;
  transition:.35s ease;
}

.quick-card span{
  flex:1;
  text-align:left;
  color:#cadbd3;
  font-size:11px;
  font-weight:800;
}

.quick-card:hover{
  color:var(--mint);
  transform:translateY(-5px);
  border-color:rgba(122,241,189,.19);
  background:rgba(122,241,189,.04);
}

.soft-empty{
  padding:30px;
  border:1px dashed rgba(122,241,189,.11);
  border-radius:22px;
  color:#6d867b;
  font-size:11px;
  margin-bottom:12px;
}

.list-section{
  margin-top:15px;
}

.list-intro{
  display:flex;
  gap:18px;
  color:#678075;
  font-size:9px;
  margin:0 0 14px 5px;
  text-transform:uppercase;
  font-weight:900;
  letter-spacing:.1em;
}

.appointment-list,
.reminder-list{
  display:flex;
  flex-direction:column;
  gap:10px;
}

.record-row,
.reminder-row{
  min-height:112px;
  display:grid;
  grid-template-columns:75px minmax(0,1fr) auto;
  align-items:center;
  gap:18px;
  border:1px solid rgba(255,255,255,.055);
  border-radius:23px;
  padding:17px 18px;
  background:rgba(255,255,255,.022);
  transition:.3s ease;
}

.record-row:hover,
.reminder-row:hover{
  transform:translateY(-4px);
  border-color:rgba(122,241,189,.18);
  background:rgba(122,241,189,.035);
}

.record-date{
  width:57px;
  height:67px;
  border-radius:17px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  background:rgba(122,241,189,.06);
  border:1px solid rgba(122,241,189,.09);
}

.record-date strong{
  font-size:21px;
  line-height:1;
}

.record-date span{
  color:var(--mint);
  font-size:8px;
  margin-top:5px;
  text-transform:uppercase;
  font-weight:900;
}

.record-body h3{
  margin:6px 0;
  font-size:16px;
}

.record-body p{
  margin:0;
  color:#71877d;
  font-size:10px;
}

.row-actions{
  display:flex;
  gap:6px;
}

.icon-button{
  width:39px;
  height:39px;
  border:1px solid rgba(255,255,255,.06);
  border-radius:12px;
  background:rgba(255,255,255,.025);
  color:#83998f;
  display:grid;
  place-items:center;
  cursor:pointer;
  transition:.25s ease;
}

.icon-button:hover{
  border-color:rgba(122,241,189,.2);
  color:var(--mint);
  transform:translateY(-2px);
}

.icon-button.danger:hover,
.danger-text:hover{
  color:var(--danger);
  border-color:rgba(255,127,136,.17);
}

.med-grid,
.notes-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:14px;
}

.med-card,
.note-card{
  min-height:300px;
  position:relative;
  padding:24px;
  border:1px solid rgba(255,255,255,.055);
  border-radius:25px;
  background:
    linear-gradient(145deg,rgba(255,255,255,.036),rgba(255,255,255,.012));
  transition:.38s cubic-bezier(.2,.8,.2,1);
  overflow:hidden;
}

.med-card::before,
.note-card::before{
  content:"";
  width:170px;
  height:170px;
  position:absolute;
  border-radius:50%;
  right:-90px;
  top:-90px;
  background:rgba(122,241,189,.045);
}

.med-card:hover,
.note-card:hover{
  transform:translateY(-8px);
  border-color:rgba(122,241,189,.19);
}

.med-top,
.note-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  position:relative;
  z-index:1;
}

.med-icon{
  width:49px;
  height:49px;
  border-radius:15px;
  display:grid;
  place-items:center;
  color:var(--mint);
  background:rgba(122,241,189,.07);
}

.med-card h3,
.note-card h3{
  font-size:23px;
  letter-spacing:-.04em;
  margin:32px 0 7px;
  position:relative;
}

.med-label{
  color:#738a80;
  font-size:10px;
  margin-bottom:25px;
}

.med-detail{
  display:flex;
  justify-content:space-between;
  padding:10px 0;
  border-top:1px solid rgba(255,255,255,.05);
  font-size:9px;
}

.med-detail span{
  color:#657d72;
}

.med-detail strong{
  color:#b7cac1;
}

.card-actions{
  display:flex;
  gap:16px;
  margin-top:20px;
}

.card-actions button{
  display:flex;
  align-items:center;
  gap:6px;
  background:none;
  border:0;
  padding:0;
  cursor:pointer;
  color:#788f84;
  font-size:9px;
  font-weight:800;
}

.notice{
  display:flex;
  align-items:center;
  gap:10px;
  color:#81978d;
  margin-bottom:20px;
  font-size:10px;
}

.notice svg{
  color:var(--mint);
}

.reminder-row{
  grid-template-columns:45px minmax(0,1fr) auto 45px;
}

.check-button{
  width:35px;
  height:35px;
  border-radius:12px;
  display:grid;
  place-items:center;
  border:1px solid rgba(122,241,189,.12);
  background:rgba(122,241,189,.035);
  color:#5d776b;
  cursor:pointer;
}

.reminder-row.done{
  opacity:.55;
}

.reminder-row.done .check-button{
  color:#07110f;
  background:var(--mint);
}

.reminder-row h3{
  font-size:15px;
  margin:6px 0 0;
}

.timeline-intro{
  margin-bottom:28px;
}

.timeline-intro p{
  color:#71877d;
  margin:0;
  max-width:720px;
  line-height:1.6;
  font-size:10px;
}

.timeline{
  display:flex;
  flex-direction:column;
  gap:40px;
}

.timeline-year{
  display:grid;
  grid-template-columns:110px 1fr;
  gap:35px;
}

.timeline-year>h2{
  font-size:25px;
  margin:0;
  color:#81978c;
  position:sticky;
  top:115px;
  align-self:start;
}

.timeline-items{
  display:flex;
  flex-direction:column;
}

.timeline-item{
  min-height:130px;
  position:relative;
  display:grid;
  grid-template-columns:70px 18px 1fr;
  gap:18px;
}

.timeline-date{
  padding-top:5px;
  display:flex;
  flex-direction:column;
  align-items:flex-end;
}

.timeline-date strong{
  font-size:19px;
}

.timeline-date span{
  color:#627a70;
  font-size:8px;
  text-transform:uppercase;
}

.timeline-marker{
  width:10px;
  height:10px;
  border-radius:50%;
  background:var(--mint);
  margin-top:12px;
  box-shadow:0 0 0 7px rgba(122,241,189,.06);
  position:relative;
}

.timeline-marker::after{
  content:"";
  position:absolute;
  width:1px;
  height:105px;
  top:15px;
  left:4px;
  background:linear-gradient(var(--stroke-strong),transparent);
}

.timeline-copy{
  border:1px solid rgba(255,255,255,.05);
  border-radius:22px;
  padding:20px;
  margin-bottom:12px;
  background:rgba(255,255,255,.018);
  transition:.3s ease;
}

.timeline-copy:hover{
  transform:translateX(5px);
  border-color:rgba(122,241,189,.17);
}

.timeline-copy h3{
  margin:6px 0;
  font-size:16px;
}

.timeline-copy p{
  margin:0;
  color:#71877d;
  font-size:10px;
  line-height:1.6;
}

.note-card{
  min-height:260px;
}

.note-card .note-head>div{
  display:flex;
  gap:5px;
}

.note-card h3{
  margin-top:48px;
}

.note-card p{
  color:#789087;
  font-size:11px;
  line-height:1.7;
  white-space:pre-wrap;
}

.empty-state,
.state{
  min-height:300px;
  border-radius:28px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  padding:40px;
}

.empty-mark{
  width:56px;
  height:56px;
  border-radius:18px;
  display:grid;
  place-items:center;
  color:var(--mint);
  background:rgba(122,241,189,.06);
  margin-bottom:18px;
}

.empty-state h3{
  font-size:21px;
  margin:0;
}

.empty-state p{
  color:#738a80;
  max-width:420px;
  font-size:10px;
  line-height:1.6;
  margin:10px 0 20px;
}

.state{
  color:#72897e;
  gap:15px;
  font-size:11px;
}

.spinner,
.button-spinner{
  border-radius:50%;
  border:2px solid rgba(122,241,189,.14);
  border-top-color:var(--mint);
  animation:spin .8s linear infinite;
}

.spinner{
  width:27px;
  height:27px;
}

.button-spinner{
  width:14px;
  height:14px;
}

@keyframes spin{
  to{transform:rotate(360deg);}
}

.modal-backdrop{
  position:fixed;
  inset:0;
  z-index:100;
  display:grid;
  place-items:center;
  padding:20px;
  background:rgba(2,8,7,.72);
  backdrop-filter:blur(13px);
  animation:fadeIn .25s ease;
}

@keyframes fadeIn{
  from{opacity:0;}
  to{opacity:1;}
}

.modal{
  width:min(720px,100%);
  max-height:90vh;
  overflow:auto;
  border-radius:30px;
  padding:28px;
  animation:modalIn .4s cubic-bezier(.2,.9,.25,1.1);
}

@keyframes modalIn{
  from{
    opacity:0;
    transform:translateY(25px) scale(.96);
  }
  to{
    opacity:1;
    transform:translateY(0) scale(1);
  }
}

.modal-head{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:25px;
}

.modal-kicker{
  color:var(--mint);
  font-size:7px;
  font-weight:900;
  letter-spacing:.18em;
}

.modal-head h2{
  margin:4px 0 0;
  font-size:28px;
  letter-spacing:-.04em;
}

.form-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:15px;
}

.field{
  display:flex;
  flex-direction:column;
  gap:8px;
}

.field.full{
  grid-column:1/-1;
}

.field>span{
  color:#899e94;
  font-size:9px;
  font-weight:800;
}

.field b{
  color:var(--mint);
}

.field input,
.field select,
.field textarea{
  width:100%;
  border:1px solid rgba(255,255,255,.07);
  border-radius:14px;
  padding:0 14px;
  color:var(--text);
  background:rgba(255,255,255,.027);
  transition:.25s ease;
}

.field input,
.field select{
  height:49px;
}

.field textarea{
  padding-top:14px;
  resize:vertical;
}

.field input:focus,
.field select:focus,
.field textarea:focus{
  border-color:rgba(122,241,189,.35);
  background:rgba(122,241,189,.025);
}

.field select option{
  background:#10201c;
}

.form-error{
  grid-column:1/-1;
  color:#ff9ba1;
  border:1px solid rgba(255,127,136,.15);
  background:rgba(255,127,136,.05);
  border-radius:13px;
  padding:12px;
  font-size:9px;
}

.form-actions{
  grid-column:1/-1;
  display:flex;
  justify-content:flex-end;
  gap:10px;
  margin-top:8px;
}

.emergency-call{
  position:fixed;
  right:24px;
  bottom:24px;
  z-index:160;
  min-height:52px;
  padding:0 17px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:9px;
  border:1px solid rgba(255,127,136,.34);
  border-radius:999px;
  color:#fff;
  background:linear-gradient(135deg,#c9434d,#a92f39);
  box-shadow:
    0 18px 45px rgba(0,0,0,.34),
    0 0 0 5px rgba(255,127,136,.06);
  font-size:11px;
  font-weight:900;
  letter-spacing:.01em;
  transition:
    transform .25s ease,
    box-shadow .25s ease,
    background .25s ease;
}

.emergency-call:hover{
  transform:translateY(-3px);
  background:linear-gradient(135deg,#dc4e58,#b93640);
  box-shadow:
    0 24px 55px rgba(0,0,0,.4),
    0 0 0 6px rgba(255,127,136,.08);
}

.emergency-call:active{
  transform:translateY(-1px) scale(.98);
}

.emergency-call svg{
  flex:0 0 auto;
}

.emergency-dot{
  width:8px;
  height:8px;
  flex:0 0 auto;
  border-radius:50%;
  background:#fff;
  box-shadow:0 0 0 5px rgba(255,255,255,.09);
  animation:emergencyPulse 1.8s ease-in-out infinite;
}

@keyframes emergencyPulse{
  0%,100%{opacity:1;transform:scale(1);}
  50%{opacity:.55;transform:scale(.78);}
}

.toast{
  position:fixed;
  z-index:120;
  right:25px;
  bottom:25px;
  min-height:54px;
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 18px 10px 10px;
  border-radius:17px;
  color:#d9f1e6;
  background:rgba(14,29,25,.92);
  border:1px solid rgba(122,241,189,.16);
  box-shadow:0 25px 60px rgba(0,0,0,.32);
  backdrop-filter:blur(18px);
  font-size:10px;
  font-weight:800;
  animation:toastIn .35s cubic-bezier(.2,.9,.25,1.15);
}

.toast-icon{
  width:32px;
  height:32px;
  border-radius:10px;
  display:grid;
  place-items:center;
  background:rgba(122,241,189,.08);
  color:var(--mint);
}

@keyframes toastIn{
  from{
    opacity:0;
    transform:translateY(15px) scale(.96);
  }
  to{
    opacity:1;
    transform:translateY(0) scale(1);
  }
}

.scrim{
  display:none;
}

@media(max-width:820px){
  .emergency-call{
    right:14px;
    bottom:20px;
    min-height:48px;
    padding:0 14px;
  }
}

@media(max-width:520px){
  .emergency-call{
    right:12px;
    bottom:76px;
    min-height:46px;
    padding:0 13px;
    gap:8px;
    font-size:10px;
  }

  .emergency-dot{
    width:7px;
    height:7px;
  }
}

@media(prefers-reduced-motion:reduce){
  .emergency-call{
    transition:none;
  }

  .emergency-dot{
    animation:none;
  }
}

@media(max-width:1100px){
  .hero{
    grid-template-columns:1fr;
    padding-top:90px;
  }

  .hero-copy{
    max-width:800px;
  }

  .hero-visual{
    min-height:620px;
  }

  .feature-grid,
  .med-grid,
  .notes-grid{
    grid-template-columns:repeat(2,1fr);
  }

  .cf-app{
    grid-template-columns:230px minmax(0,1fr);
  }

  .today-grid{
    grid-template-columns:1fr;
  }

  .today-aside{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:11px;
  }

  .aside-stats{
    grid-column:1/-1;
  }
}

@media(max-width:820px){
  .cf-landing{
    padding:13px;
  }

  .landing-nav{
    top:10px;
  }

  .landing-links{
    display:none;
  }

  .landing-nav>.button{
    min-height:42px;
    padding:0 13px;
  }

  .landing-nav>.button svg{
    display:none;
  }

  .hero{
    padding:70px 6px 30px;
  }

  .hero h1{
    font-size:clamp(55px,14vw,90px);
  }

  .hero-visual{
    min-height:520px;
  }

  .dashboard-card{
    width:88%;
  }

  .floating-stat{
    right:0;
  }

  .floating-note{
    left:0;
  }

  .section{
    padding:90px 7px;
  }

  .problem-section{
    grid-template-columns:1fr;
    gap:40px;
  }

  .feature-grid{
    grid-template-columns:1fr;
  }

  .feature-card{
    min-height:280px;
  }

  .feature-icon{
    margin-top:40px;
  }

  .preview-stage{
    grid-template-columns:1fr;
    min-height:auto;
  }

  .trust-section{
    grid-template-columns:1fr;
    padding:35px 25px;
  }

  .landing-footer{
    flex-direction:column;
    justify-content:center;
    gap:15px;
    text-align:center;
  }

  .cf-app{
    display:block;
  }

  .sidebar{
    position:fixed;
    z-index:80;
    left:10px;
    top:10px;
    bottom:10px;
    width:255px;
    height:auto;
    margin:0;
    transform:translateX(-120%);
    transition:.35s cubic-bezier(.2,.8,.2,1);
  }

  .sidebar.open{
    transform:translateX(0);
  }

  .scrim{
    display:block;
    position:fixed;
    inset:0;
    z-index:70;
    background:rgba(0,0,0,.58);
    border:0;
    backdrop-filter:blur(5px);
  }

  .main-area{
    padding:10px;
  }

  .app-header{
    top:10px;
  }

  .mobile-menu{
    display:grid;
    place-items:center;
  }

  .header-kicker{
    display:none;
  }

  .page-content{
    padding:45px 8px;
  }

  .page-header{
    align-items:flex-start;
    flex-direction:column;
  }

  .page-header h1{
    font-size:52px;
  }

  .med-grid,
  .notes-grid{
    grid-template-columns:1fr;
  }

  .quick-grid{
    grid-template-columns:1fr;
  }

  .timeline-year{
    grid-template-columns:1fr;
    gap:12px;
  }

  .timeline-year>h2{
    position:static;
  }
}

@media(max-width:570px){
  .brand-text small{
    display:none;
  }

  .landing-nav .brand-mark{
    width:38px;
    height:38px;
  }

  .landing-nav>.button{
    font-size:10px;
  }

  .hero{
    min-height:auto;
  }

  .hero h1{
    font-size:55px;
  }

  .hero-lede{
    font-size:14px;
  }

  .hero-actions{
    align-items:flex-start;
    flex-direction:column;
  }

  .hero-trust{
    flex-direction:column;
  }

  .hero-visual{
    min-height:430px;
  }

  .dashboard-card{
    width:96%;
    transform:none;
    animation:mobileFloat 5s ease-in-out infinite;
  }

  @keyframes mobileFloat{
    50%{transform:translateY(-10px);}
  }

  .floating-stat{
    width:130px;
    top:22px;
    right:-5px;
    padding:13px;
  }

  .floating-stat strong{
    font-size:27px;
  }

  .floating-note{
    width:145px;
    bottom:5px;
    padding:13px;
  }

  .flow-ring{
    display:none;
  }

  .demo-flow-card{
    grid-template-columns:55px 1fr auto;
  }

  .section h2{
    font-size:43px;
  }

  .preview-stage{
    padding:15px;
  }

  .profile-copy{
    display:none;
  }

  .profile-chip{
    min-width:unset;
    padding:5px;
  }

  .page-header h1{
    font-size:44px;
  }

  .page-header>.button{
    width:100%;
  }

  .flow-card{
    grid-template-columns:52px 1fr;
  }

  .flow-state{
    grid-column:2;
    justify-self:start;
  }

  .record-row{
    grid-template-columns:55px 1fr;
  }

  .row-actions{
    grid-column:2;
  }

  .reminder-row{
    grid-template-columns:38px 1fr auto;
  }

  .reminder-row>.icon-button{
    grid-column:3;
  }

  .form-grid{
    grid-template-columns:1fr;
  }

  .field.full,
  .form-actions,
  .form-error{
    grid-column:1;
  }

  .modal{
    padding:20px;
  }

  .toast{
    left:14px;
    right:14px;
    bottom:14px;
  }

  .today-aside{
    grid-template-columns:1fr;
  }

  .aside-stats{
    grid-column:auto;
  }
}

@media(prefers-reduced-motion:reduce){
  *,
  *::before,
  *::after{
    scroll-behavior:auto!important;
    animation-duration:.01ms!important;
    animation-iteration-count:1!important;
    transition-duration:.01ms!important;
  }
}
`;

function Icon({ name, size = 20 }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 9h18" />
      </>
    ),
    pill: (
      <>
        <path d="m8 8 8 8M9.5 4.5l10 10a3.5 3.5 0 0 1-5 5l-10-10a3.5 3.5 0 0 1 5-5Z" />
        <path d="m6 11 5-5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    note: (
      <>
        <path d="M5 4h14v16H5z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    activity: <path d="M3 12h4l2-6 4 12 2-6h6" />,
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    trash: (
      <>
        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
      </>
    ),
    edit: (
      <>
        <path d="m4 16-.7 4.7L8 20l11-11-4-4L4 16Z" />
        <path d="m13.5 6.5 4 4" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />
        <path d="m8.5 12 2.3 2.3 4.7-5" />
      </>
    ),
    close: <path d="M6 6l12 12M18 6 6 18" />,
    sparkle: (
      <>
        <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
        <path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6c-1.7-1.7-4.5-1.7-6.2 0L12 7.2 9.4 4.6a4.4 4.4 0 0 0-6.2 6.2L12 19.6l8.8-8.8a4.4 4.4 0 0 0 0-6.2Z" />
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      <span className="orb orb-one" />
      <span className="orb orb-two" />
      <span className="orb orb-three" />
    </div>
  );
}

function useData(endpoint, initial = []) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}${endpoint}`);

      if (!response.ok) {
        throw new Error();
      }

      setData(await response.json());
    } catch {
      setError("Unable to load this information.");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    setData,
    loading,
    error,
    reload: load,
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload.error || "Something went wrong."
    );
  }

  return payload;
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <Icon name="heart" size={18} />
      </span>

      <span className="brand-text">
        <strong>CareFlow</strong>
        <small>Personal health space</small>
      </span>
    </div>
  );
}

function App() {
  const [page, setPage] = useState("landing");
  const [mobileOpen, setMobileOpen] =
    useState(false);
  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2800);
  };

  return (
    <>
      <style>{styles}</style>

      {page === "landing" ? (
        <Landing onOpen={() => setPage("today")} />
      ) : (
        <div className="cf-app">
          <Ambient />

          <aside
            className={`sidebar glass ${
              mobileOpen ? "open" : ""
            }`}
          >
            <button
              className="brand-button"
              onClick={() => setPage("today")}
            >
              <Brand />
            </button>

            <div className="sidebar-label">
              YOUR CARE SPACE
            </div>

            <nav
              className="nav-list"
              aria-label="Main navigation"
            >
              {navItems.map(([id, label]) => (
                <button
                  key={id}
                  className={`nav-item ${
                    page === id ? "active" : ""
                  }`}
                  onClick={() => {
                    setPage(id);
                    setMobileOpen(false);
                  }}
                >
                  <span className="nav-icon">
                    <Icon
                      name={
                        id === "today"
                          ? "activity"
                          : id === "appointments"
                            ? "calendar"
                            : id === "medications"
                              ? "pill"
                              : id === "timeline"
                                ? "activity"
                                : id === "reminders"
                                  ? "clock"
                                  : "note"
                      }
                    />
                  </span>

                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className="sidebar-bottom">
              <div className="privacy-mini">
                <Icon
                  name="shield"
                  size={17}
                />

                <div>
                  <strong>Private by design</strong>
                  <span>
                    Information you choose to
                    organize.
                  </span>
                </div>
              </div>

              <button
                className="back-link"
                onClick={() =>
                  setPage("landing")
                }
              >
                ← Product overview
              </button>
            </div>
          </aside>

          {mobileOpen && (
            <button
              className="scrim"
              aria-label="Close navigation"
              onClick={() =>
                setMobileOpen(false)
              }
            />
          )}

          <main className="main-area">
            <header className="app-header glass">
              <div className="header-left">
                <button
                  className="mobile-menu"
                  aria-label="Open navigation"
                  onClick={() =>
                    setMobileOpen(true)
                  }
                >
                  <Icon name="menu" />
                </button>

                <div>
                  <span className="header-kicker">
                    CAREFLOW WORKSPACE
                  </span>

                  <div className="breadcrumb">
                    CareFlow <span>/</span>{" "}
                    {navItems.find(
                      (item) =>
                        item[0] === page
                    )?.[1] || "Today"}
                  </div>
                </div>
              </div>

              <div className="profile-chip">
                <span className="avatar">A</span>

                <span className="profile-copy">
                  <strong>Aarav</strong>
                  <small>
                    Personal workspace
                  </small>
                </span>
              </div>
            </header>

            <div className="page-content">
              {page === "today" ? (
                <Today
                  notify={notify}
                  onNavigate={setPage}
                />
              ) : page === "appointments" ? (
                <Appointments
                  notify={notify}
                />
              ) : page === "medications" ? (
                <Medications notify={notify} />
              ) : page === "timeline" ? (
                <Timeline notify={notify} />
              ) : page === "reminders" ? (
                <Reminders notify={notify} />
              ) : (
                <Notes notify={notify} />
              )}
            </div>
          </main>

          <a
            className="emergency-call"
            href="tel:108"
            aria-label="Call emergency services on 108"
          >
            <span className="emergency-dot" aria-hidden="true" />
            <Icon name="phone" size={17} />
            <span>Emergency · 108</span>
          </a>

          {toast && (
            <div
              className="toast"
              role="status"
            >
              <span className="toast-icon">
                <Icon
                  name="check"
                  size={17}
                />
              </span>

              {toast}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function Landing({ onOpen }) {
  return (
    <div className="cf-landing">
      <Ambient />

      <header className="landing-nav glass">
        <Brand />

        <nav className="landing-links">
          <a href="#why">Why CareFlow</a>
          <a href="#flow">The flow</a>
          <a href="#privacy">Privacy</a>
        </nav>

        <button
          className="button button-primary"
          onClick={onOpen}
        >
          Open workspace
          <Icon name="arrow" size={16} />
        </button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="hero-badge">
            <Icon
              name="sparkle"
              size={14}
            />
            Personal health management
          </span>

          <h1>
            Your health,
            <br />
            <em>in motion.</em>
          </h1>

          <p className="hero-lede">
            Appointments, medication schedules,
            reminders, health events and notes —
            organized into one calm, living
            workspace that moves with your day.
          </p>

          <div className="hero-actions">
            <button
              className="button button-primary button-large"
              onClick={onOpen}
            >
              Enter CareFlow
              <Icon
                name="arrow"
                size={18}
              />
            </button>

            <a
              href="#flow"
              className="text-link"
            >
              Explore the flow
              <span>↓</span>
            </a>
          </div>

          <div className="hero-trust">
            <span>
              <Icon
                name="shield"
                size={15}
              />
              Organization, not diagnosis
            </span>

            <span>
              <Icon
                name="check"
                size={15}
              />
              Your information, your control
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-dashboard">
            <div className="flow-ring ring-1" />
            <div className="flow-ring ring-2" />

            <div className="dashboard-card glass">
              <div className="dashboard-toolbar">
                <div className="toolbar-dots">
                  <i />
                  <i />
                  <i />
                </div>

                <span>TODAY · CAREFLOW</span>
              </div>

              <div className="dashboard-inside">
                <span className="dash-eyebrow">
                  GOOD MORNING
                </span>

                <h3>
                  Here’s what matters today.
                </h3>

                <div className="demo-flow-card featured">
                  <span className="demo-time">
                    10:30
                  </span>

                  <div>
                    <small>
                      APPOINTMENT
                    </small>
                    <strong>
                      General consultation
                    </strong>
                    <span>
                      Dr. Arun · City Health
                      Clinic
                    </span>
                  </div>

                  <span className="demo-state" />
                </div>

                <div className="demo-flow-card">
                  <span className="demo-time">
                    08:00
                  </span>

                  <div>
                    <small>
                      MEDICATION
                    </small>
                    <strong>Vitamin D</strong>
                    <span>
                      User-managed schedule
                    </span>
                  </div>

                  <span className="demo-state" />
                </div>

                <div className="demo-flow-card">
                  <span className="demo-time">
                    09:00
                  </span>

                  <div>
                    <small>REMINDER</small>
                    <strong>
                      Prepare visit questions
                    </strong>
                    <span>Tomorrow</span>
                  </div>

                  <span className="demo-state" />
                </div>
              </div>
            </div>

            <div className="floating-card floating-stat">
              <span>UPCOMING</span>
              <strong>03</strong>
              <small>appointments</small>
            </div>

            <div className="floating-card floating-note">
              <span>YOUR TIMELINE</span>
              <strong>
                Everything in context.
              </strong>
              <p>
                Notes, events and visits in one
                chronological flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="why"
        className="section problem-section"
      >
        <div>
          <p className="eyebrow">
            WHY CAREFLOW
          </p>

          <h2>
            Less searching.
            <br />
            <em>More clarity.</em>
          </h2>
        </div>

        <div className="problem-copy">
          <p>
            Health details are often scattered
            across calendars, messages, notes and
            memory.
          </p>

          <p>
            CareFlow brings the information you
            choose into one structured personal
            workspace without pretending to be a
            doctor.
          </p>
        </div>
      </section>

      <section
        id="flow"
        className="section feature-section"
      >
        <div className="feature-heading">
          <p className="eyebrow">
            THE CAREFLOW METHOD
          </p>

          <h2>
            See today.
            <br />
            <em>Understand the flow.</em>
          </h2>
        </div>

        <div className="feature-grid">
          <Feature
            number="01"
            icon="activity"
            title="Today"
            text="Appointments, medication schedules and reminders in one focused daily view."
          />

          <Feature
            number="02"
            icon="clock"
            title="Timeline"
            text="A chronological record of the healthcare information you choose to keep."
          />

          <Feature
            number="03"
            icon="note"
            title="Notes"
            text="Keep questions, observations and information ready whenever you need them."
          />
        </div>
      </section>

      <section className="section">
        <div className="feature-heading">
          <p className="eyebrow">
            LIVE WORKSPACE
          </p>

          <h2>
            Designed to feel
            <br />
            <em>alive.</em>
          </h2>
        </div>

        <div className="preview-stage glass">
          <div className="preview-panel preview-main">
            <span className="card-kicker">
              TODAY
            </span>

            <h3>
              Your day in one flowing view.
            </h3>

            <div className="demo-flow-card featured">
              <span className="demo-time">
                10:30
              </span>

              <div>
                <small>APPOINTMENT</small>
                <strong>
                  General consultation
                </strong>
                <span>
                  Dr. Arun · City Health Clinic
                </span>
              </div>

              <span className="demo-state" />
            </div>

            <div className="demo-flow-card">
              <span className="demo-time">
                08:00
              </span>

              <div>
                <small>MEDICATION</small>
                <strong>Vitamin D</strong>
                <span>
                  User-entered schedule
                </span>
              </div>

              <span className="demo-state" />
            </div>
          </div>

          <div className="preview-panel preview-side">
            <span className="card-kicker">
              NEXT
            </span>

            <strong>
              Follow-up appointment
            </strong>
            <span>Tomorrow · 09:00</span>

            <hr />

            <span className="card-kicker">
              RECENT
            </span>

            <strong>
              Blood test added
            </strong>
            <span>
              Yesterday · Timeline
            </span>
          </div>
        </div>
      </section>

      <section
        id="privacy"
        className="section"
      >
        <div className="trust-section glass">
          <div className="trust-mark">
            <Icon
              name="shield"
              size={30}
            />
          </div>

          <div>
            <p className="eyebrow">
              TRUST & CONTROL
            </p>

            <h2>
              Information that stays{" "}
              <em>under your control.</em>
            </h2>

            <p>
              CareFlow stores and displays
              information you choose to enter. It
              does not diagnose conditions, make
              treatment decisions or replace
              professional medical care.
            </p>
          </div>
        </div>
      </section>

      <section className="section cta">
        <p className="eyebrow">
          READY WHEN YOU ARE
        </p>

        <h2>
          Bring your health
          <br />
          <em>into focus.</em>
        </h2>

        <button
          className="button button-primary button-large"
          onClick={onOpen}
        >
          Open CareFlow
          <Icon name="arrow" size={18} />
        </button>
      </section>

      <footer className="landing-footer">
        <Brand />
        <span>
          Your health, organized around your life.
        </span>
        <span>© 2026 CareFlow</span>
      </footer>
    </div>
  );
}

function Feature({
  number,
  icon,
  title,
  text,
}) {
  return (
    <article className="feature-card glass">
      <span className="feature-number">
        {number}
      </span>

      <div className="feature-icon">
        <Icon name={icon} />
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <span className="feature-arrow">
        ↗
      </span>
    </article>
  );
}

function PageHeader({
  eyebrow,
  title,
  children,
}) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">
          {eyebrow}
        </p>

        <h1>{title}</h1>
      </div>

      {children}
    </div>
  );
}

function Loading({
  label = "Loading…",
}) {
  return (
    <div className="state glass">
      <span className="spinner" />
      {label}
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="state glass">
      <strong>
        Unable to load this information.
      </strong>

      <button
        className="button button-secondary"
        onClick={onRetry}
      >
        Try again
      </button>
    </div>
  );
}

function Empty({
  title,
  text,
  button,
  onClick,
}) {
  return (
    <div className="empty-state glass">
      <div className="empty-mark">
        <Icon name="plus" />
      </div>

      <h3>{title}</h3>
      <p>{text}</p>

      {button && (
        <button
          className="button button-primary"
          onClick={onClick}
        >
          <Icon
            name="plus"
            size={16}
          />
          {button}
        </button>
      )}
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="modal glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-head">
          <div>
            <span className="modal-kicker">
              CAREFLOW
            </span>

            <h2 id="modal-title">
              {title}
            </h2>
          </div>

          <button
            className="icon-button"
            aria-label="Close"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function Today({ notify, onNavigate }) {
  const [data, setData] =
    useState(null);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API}/dashboard`
      );

      if (!response.ok) {
        throw new Error();
      }

      setData(await response.json());
    } catch {
      setError(
        "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <>
        <PageHeader
          eyebrow="TODAY"
          title="Good morning, Aarav."
        />
        <Loading />
      </>
    );
  }

  if (error) {
    return (
      <ErrorState onRetry={load} />
    );
  }

  const today = data.today;

  const todays =
    data.appointments.filter(
      (appointment) =>
        appointment.date === today &&
        appointment.status === "upcoming"
    );

  const next =
    data.appointments.find(
      (appointment) =>
        appointment.status ===
          "upcoming" &&
        appointment.date >= today
    );

  const pending =
    data.reminders.filter(
      (reminder) =>
        !reminder.completed
    );

  return (
    <div>
      <PageHeader
        eyebrow={new Date(
          today + "T12:00"
        )
          .toLocaleDateString(
            "en-IN",
            {
              weekday: "long",
              day: "numeric",
              month: "long",
            }
          )
          .toUpperCase()}
        title="Good morning, Aarav."
      >
        <span className="page-subtitle">
          Here’s what matters today.
        </span>
      </PageHeader>

      <div className="today-grid">
        <section className="today-main">
          <div className="section-label">
            TODAY'S FLOW
          </div>

          {todays.length === 0 && (
            <div className="soft-empty">
              Nothing scheduled today. Your
              day is clear.
            </div>
          )}

          {todays.map(
            (appointment) => (
              <AppointmentHighlight
                key={appointment.id}
                item={appointment}
              />
            )
          )}

          {data.medications
            .slice(0, 2)
            .map((medication) => (
              <div
                className="flow-card"
                key={medication.id}
              >
                <div className="flow-icon">
                  <Icon name="pill" />
                </div>

                <div className="flow-card-content">
                  <span className="card-kicker">
                    MEDICATION
                  </span>

                  <h3>
                    {medication.name}
                  </h3>

                  <p>
                    {medication.schedule} ·{" "}
                    {
                      medication.dosage_label
                    }
                  </p>
                </div>

                <span className="flow-state">
                  User-managed
                </span>
              </div>
            ))}

          {pending
            .slice(0, 1)
            .map((reminder) => (
              <div
                className="flow-card"
                key={reminder.id}
              >
                <div className="flow-icon">
                  <Icon name="clock" />
                </div>

                <div className="flow-card-content">
                  <span className="card-kicker">
                    REMINDER
                  </span>

                  <h3>
                    {reminder.title}
                  </h3>

                  <p>
                    {formatDate(
                      reminder.date
                    )}{" "}
                    ·{" "}
                    {formatTime(
                      reminder.time
                    )}
                  </p>
                </div>

                <span className="flow-state pending">
                  Pending
                </span>
              </div>
            ))}
        </section>

        <aside className="today-aside">
          <div className="aside-block">
            <span className="card-kicker">
              NEXT UP
            </span>

            {next ? (
              <>
                <div className="next-time">
                  {formatTime(
                    next.time
                  )}
                </div>

                <h3>{next.title}</h3>

                <p>
                  {next.doctor_name}
                </p>

                <span>
                  {formatDate(
                    next.date
                  )}{" "}
                  ·{" "}
                  {next.location ||
                    "Location not added"}
                </span>
              </>
            ) : (
              <p>
                No upcoming
                appointments.
              </p>
            )}
          </div>

          <div className="aside-block">
            <span className="card-kicker">
              RECENT
            </span>

            {data.events[0] ? (
              <>
                <h3>
                  {data.events[0].title}
                </h3>

                <p>
                  {
                    data.events[0]
                      .description
                  }
                </p>

                <span>
                  {formatDate(
                    data.events[0].date
                  )}{" "}
                  · Timeline
                </span>
              </>
            ) : (
              <p>
                No recent events yet.
              </p>
            )}
          </div>

          <div className="aside-stats">
            <Stat
              value={
                data.stats
                  .upcoming_appointments
              }
              label="Upcoming visits"
            />

            <Stat
              value={
                data.stats
                  .pending_reminders
              }
              label="Pending reminders"
            />

            <Stat
              value={
                data.stats
                  .active_medications
              }
              label="Active schedules"
            />
          </div>
        </aside>
      </div>

      <div className="quick-grid">
        <Quick
          title="Add appointment"
          icon="calendar"
          onClick={() => onNavigate("appointments")}
        />

        <Quick
          title="Add reminder"
          icon="clock"
          onClick={() => onNavigate("reminders")}
        />

        <Quick
          title="Write a note"
          icon="note"
          onClick={() => onNavigate("notes")}
        />
      </div>
    </div>
  );
}

function AppointmentHighlight({
  item,
}) {
  return (
    <div className="flow-card">
      <div className="flow-time">
        {formatTime(item.time)}
      </div>

      <div className="flow-card-content">
        <span className="card-kicker">
          APPOINTMENT
        </span>

        <h3>{item.title}</h3>

        <p>
          {item.doctor_name} ·{" "}
          {item.location ||
            "Location not added"}
        </p>
      </div>

      <span className="flow-state upcoming">
        Upcoming
      </span>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Quick({
  title,
  icon,
  onClick,
}) {
  return (
    <button
      className="quick-card"
      onClick={onClick}
    >
      <Icon name={icon} />

      <span>{title}</span>

      <Icon
        name="arrow"
        size={16}
      />
    </button>
  );
}

function Appointments({ notify }) {
  const data =
    useData("/appointments");

  const [modal, setModal] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const remove = async (id) => {
    if (
      !window.confirm(
        "Delete this appointment?"
      )
    ) {
      return;
    }

    try {
      await request(
        `/appointments/${id}`,
        {
          method: "DELETE",
        }
      );

      notify(
        "Appointment deleted."
      );

      data.reload();
    } catch (error) {
      notify(error.message);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="YOUR CARE"
        title="Appointments"
      >
        <button
          className="button button-primary"
          onClick={() => {
            setEditing(null);
            setModal(true);
          }}
        >
          <Icon
            name="plus"
            size={17}
          />
          Add appointment
        </button>
      </PageHeader>

      {data.loading ? (
        <Loading />
      ) : data.error ? (
        <ErrorState
          onRetry={data.reload}
        />
      ) : (
        <div className="list-section">
          <div className="list-intro">
            <span>
              {
                data.data.filter(
                  (item) =>
                    item.status ===
                    "upcoming"
                ).length
              }{" "}
              upcoming
            </span>

            <span>
              {
                data.data.filter(
                  (item) =>
                    item.status ===
                    "completed"
                ).length
              }{" "}
              completed
            </span>
          </div>

          {data.data.length === 0 ? (
            <Empty
              title="No appointments yet"
              text="Keep your next visit in one clear place."
              button="Add appointment"
              onClick={() => {
                setEditing(null);
                setModal(true);
              }}
            />
          ) : (
            <div className="appointment-list">
              {data.data.map(
                (appointment) => (
                  <div
                    className="record-row"
                    key={
                      appointment.id
                    }
                  >
                    <div className="record-date">
                      <strong>
                        {new Date(
                          appointment.date +
                            "T12:00"
                        ).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                          }
                        )}
                      </strong>

                      <span>
                        {new Date(
                          appointment.date +
                            "T12:00"
                        ).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                          }
                        )}
                      </span>
                    </div>

                    <div className="record-body">
                      <span className="card-kicker">
                        {formatTime(
                          appointment.time
                        )}{" "}
                        ·{" "}
                        {
                          appointment.status
                        }
                      </span>

                      <h3>
                        {appointment.title}
                      </h3>

                      <p>
                        {
                          appointment.doctor_name
                        }{" "}
                        ·{" "}
                        {appointment.location ||
                          "Location not added"}
                      </p>
                    </div>

                    <div className="row-actions">
                      <button
                        className="icon-button"
                        aria-label={`Edit ${appointment.title}`}
                        onClick={() => {
                          setEditing(
                            appointment
                          );
                          setModal(true);
                        }}
                      >
                        <Icon name="edit" />
                      </button>

                      <button
                        className="icon-button danger"
                        aria-label={`Delete ${appointment.title}`}
                        onClick={() =>
                          remove(
                            appointment.id
                          )
                        }
                      >
                        <Icon name="trash" />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {modal && (
        <AppointmentForm
          initial={editing}
          onClose={() =>
            setModal(false)
          }
          onSaved={() => {
            setModal(false);
            data.reload();

            notify(
              editing
                ? "Appointment updated."
                : "Appointment added."
            );
          }}
        />
      )}
    </div>
  );
}

function AppointmentForm({
  initial,
  onClose,
  onSaved,
}) {
  const [form, setForm] =
    useState(
      initial || {
        title: "",
        doctor_name: "",
        date: "",
        time: "",
        location: "",
      }
    );

  const [busy, setBusy] =
    useState(false);

  const [err, setErr] =
    useState("");

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErr("");

    try {
      await request(
        initial
          ? `/appointments/${initial.id}`
          : "/appointments",
        {
          method: initial
            ? "PATCH"
            : "POST",
          body: JSON.stringify(form),
        }
      );

      onSaved();
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={
        initial
          ? "Edit appointment"
          : "Add appointment"
      }
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="form-grid"
      >
        <Field
          label="Appointment title"
          value={form.title}
          onChange={(value) =>
            setForm({
              ...form,
              title: value,
            })
          }
          required
        />

        <Field
          label="Doctor / provider"
          value={form.doctor_name}
          onChange={(value) =>
            setForm({
              ...form,
              doctor_name: value,
            })
          }
          required
        />

        <Field
          label="Date"
          type="date"
          value={form.date}
          onChange={(value) =>
            setForm({
              ...form,
              date: value,
            })
          }
          required
        />

        <Field
          label="Time"
          type="time"
          value={form.time}
          onChange={(value) =>
            setForm({
              ...form,
              time: value,
            })
          }
          required
        />

        <Field
          label="Location"
          value={form.location}
          onChange={(value) =>
            setForm({
              ...form,
              location: value,
            })
          }
        />

        {err && (
          <div className="form-error">
            {err}
          </div>
        )}

        <FormActions
          busy={busy}
          onClose={onClose}
        />
      </form>
    </Modal>
  );
}

function Medications({ notify }) {
  const data =
    useData("/medications");

  const [modal, setModal] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const remove = async (id) => {
    if (
      !window.confirm(
        "Delete this medication record?"
      )
    ) {
      return;
    }

    try {
      await request(
        `/medications/${id}`,
        {
          method: "DELETE",
        }
      );

      notify("Medication removed.");
      data.reload();
    } catch (error) {
      notify(error.message);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="USER-MANAGED"
        title="Medications"
      >
        <button
          className="button button-primary"
          onClick={() => {
            setEditing(null);
            setModal(true);
          }}
        >
          <Icon
            name="plus"
            size={17}
          />
          Add medication
        </button>
      </PageHeader>

      <div className="notice">
        <Icon
          name="shield"
          size={18}
        />

        <span>
          CareFlow shows only information
          you enter. It does not recommend
          doses or make treatment
          decisions.
        </span>
      </div>

      {data.loading ? (
        <Loading />
      ) : data.error ? (
        <ErrorState
          onRetry={data.reload}
        />
      ) : data.data.length === 0 ? (
        <Empty
          title="No medication records"
          text="Add the schedule information you want to keep organized."
          button="Add medication"
          onClick={() => {
            setEditing(null);
            setModal(true);
          }}
        />
      ) : (
        <div className="med-grid">
          {data.data.map(
            (medication) => (
              <article
                className="med-card"
                key={medication.id}
              >
                <div className="med-top">
                  <div className="med-icon">
                    <Icon name="pill" />
                  </div>

                  <span
                    className={`badge ${medication.status}`}
                  >
                    {medication.status}
                  </span>
                </div>

                <h3>
                  {medication.name}
                </h3>

                <p className="med-label">
                  {
                    medication.dosage_label
                  }
                </p>

                <div className="med-detail">
                  <span>Schedule</span>
                  <strong>
                    {
                      medication.schedule
                    }
                  </strong>
                </div>

                <div className="med-detail">
                  <span>Started</span>
                  <strong>
                    {formatDate(
                      medication.start_date
                    )}
                  </strong>
                </div>

                <div className="card-actions">
                  <button
                    onClick={() => {
                      setEditing(
                        medication
                      );
                      setModal(true);
                    }}
                  >
                    <Icon
                      name="edit"
                      size={15}
                    />
                    Edit
                  </button>

                  <button
                    className="danger-text"
                    onClick={() =>
                      remove(
                        medication.id
                      )
                    }
                  >
                    <Icon
                      name="trash"
                      size={15}
                    />
                    Remove
                  </button>
                </div>
              </article>
            )
          )}
        </div>
      )}

      {modal && (
        <MedicationForm
          initial={editing}
          onClose={() =>
            setModal(false)
          }
          onSaved={() => {
            setModal(false);
            data.reload();

            notify(
              editing
                ? "Medication updated."
                : "Medication added."
            );
          }}
        />
      )}
    </div>
  );
}

function MedicationForm({
  initial,
  onClose,
  onSaved,
}) {
  const [form, setForm] =
    useState(
      initial || {
        name: "",
        dosage_label: "",
        schedule: "",
        start_date: "",
        end_date: "",
        status: "active",
      }
    );

  const [busy, setBusy] =
    useState(false);

  const [err, setErr] =
    useState("");

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErr("");

    try {
      await request(
        initial
          ? `/medications/${initial.id}`
          : "/medications",
        {
          method: initial
            ? "PATCH"
            : "POST",
          body: JSON.stringify(form),
        }
      );

      onSaved();
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={
        initial
          ? "Edit medication"
          : "Add medication"
      }
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="form-grid"
      >
        <Field
          label="Medication name"
          value={form.name}
          onChange={(value) =>
            setForm({
              ...form,
              name: value,
            })
          }
          required
        />

        <Field
          label="Dosage label (as recorded)"
          value={
            form.dosage_label
          }
          onChange={(value) =>
            setForm({
              ...form,
              dosage_label: value,
            })
          }
          required
        />

        <Field
          label="Schedule"
          value={form.schedule}
          onChange={(value) =>
            setForm({
              ...form,
              schedule: value,
            })
          }
          placeholder="e.g. 08:00 AM"
          required
        />

        <Field
          label="Start date"
          type="date"
          value={
            form.start_date
          }
          onChange={(value) =>
            setForm({
              ...form,
              start_date: value,
            })
          }
          required
        />

        <Field
          label="End date (optional)"
          type="date"
          value={
            form.end_date || ""
          }
          onChange={(value) =>
            setForm({
              ...form,
              end_date: value,
            })
          }
        />

        <label className="field">
          <span>Status</span>

          <select
            value={form.status}
            onChange={(event) =>
              setForm({
                ...form,
                status:
                  event.target.value,
              })
            }
          >
            <option value="active">
              Active
            </option>
            <option value="paused">
              Paused
            </option>
            <option value="completed">
              Completed
            </option>
          </select>
        </label>

        {err && (
          <div className="form-error">
            {err}
          </div>
        )}

        <FormActions
          busy={busy}
          onClose={onClose}
        />
      </form>
    </Modal>
  );
}

function Reminders({ notify }) {
  const data =
    useData("/reminders");

  const [modal, setModal] =
    useState(false);

  const toggle = async (
    reminder
  ) => {
    try {
      await request(
        `/reminders/${reminder.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            completed:
              !reminder.completed,
          }),
        }
      );

      notify(
        reminder.completed
          ? "Reminder reopened."
          : "Reminder completed."
      );

      data.reload();
    } catch (error) {
      notify(error.message);
    }
  };

  const remove = async (id) => {
    try {
      await request(
        `/reminders/${id}`,
        {
          method: "DELETE",
        }
      );

      notify("Reminder deleted.");
      data.reload();
    } catch (error) {
      notify(error.message);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="KEEP IN STEP"
        title="Reminders"
      >
        <button
          className="button button-primary"
          onClick={() =>
            setModal(true)
          }
        >
          <Icon
            name="plus"
            size={17}
          />
          Add reminder
        </button>
      </PageHeader>

      {data.loading ? (
        <Loading />
      ) : data.error ? (
        <ErrorState
          onRetry={data.reload}
        />
      ) : data.data.length === 0 ? (
        <Empty
          title="No reminders"
          text="Add a small task so it doesn't get lost in the day."
          button="Add reminder"
          onClick={() =>
            setModal(true)
          }
        />
      ) : (
        <div className="reminder-list">
          {data.data.map(
            (reminder) => (
              <div
                className={`reminder-row ${
                  reminder.completed
                    ? "done"
                    : ""
                }`}
                key={reminder.id}
              >
                <button
                  className="check-button"
                  aria-label={
                    reminder.completed
                      ? "Mark as pending"
                      : "Mark as completed"
                  }
                  onClick={() =>
                    toggle(reminder)
                  }
                >
                  <Icon
                    name="check"
                    size={16}
                  />
                </button>

                <div>
                  <span className="card-kicker">
                    {formatDate(
                      reminder.date
                    )}{" "}
                    ·{" "}
                    {formatTime(
                      reminder.time
                    )}
                  </span>

                  <h3>
                    {reminder.title}
                  </h3>
                </div>

                <span
                  className={`badge ${
                    reminder.completed
                      ? "completed"
                      : "upcoming"
                  }`}
                >
                  {reminder.completed
                    ? "Completed"
                    : "Pending"}
                </span>

                <button
                  className="icon-button danger"
                  aria-label={`Delete ${reminder.title}`}
                  onClick={() =>
                    remove(
                      reminder.id
                    )
                  }
                >
                  <Icon
                    name="trash"
                    size={18}
                  />
                </button>
              </div>
            )
          )}
        </div>
      )}

      {modal && (
        <ReminderForm
          onClose={() =>
            setModal(false)
          }
          onSaved={() => {
            setModal(false);
            data.reload();
            notify(
              "Reminder added."
            );
          }}
        />
      )}
    </div>
  );
}

function ReminderForm({
  onClose,
  onSaved,
}) {
  const [form, setForm] =
    useState({
      title: "",
      date: "",
      time: "",
    });

  const [busy, setBusy] =
    useState(false);

  const [err, setErr] =
    useState("");

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErr("");

    try {
      await request(
        "/reminders",
        {
          method: "POST",
          body: JSON.stringify(form),
        }
      );

      onSaved();
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title="Add reminder"
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="form-grid"
      >
        <Field
          label="Reminder"
          value={form.title}
          onChange={(value) =>
            setForm({
              ...form,
              title: value,
            })
          }
          required
        />

        <Field
          label="Date"
          type="date"
          value={form.date}
          onChange={(value) =>
            setForm({
              ...form,
              date: value,
            })
          }
          required
        />

        <Field
          label="Time"
          type="time"
          value={form.time}
          onChange={(value) =>
            setForm({
              ...form,
              time: value,
            })
          }
          required
        />

        {err && (
          <div className="form-error">
            {err}
          </div>
        )}

        <FormActions
          busy={busy}
          onClose={onClose}
        />
      </form>
    </Modal>
  );
}

function Timeline({ notify }) {
  const events =
    useData("/health-events");

  const notes =
    useData("/health-notes");

  const [modal, setModal] =
    useState(false);

  const items = useMemo(
    () =>
      [
        ...events.data.map(
          (item) => ({
            ...item,
            type: "event",
          })
        ),

        ...notes.data.map(
          (item) => ({
            ...item,
            date:
              item.created_at?.slice(
                0,
                10
              ),
            category: "Note",
            description:
              item.content,
            type: "note",
          })
        ),
      ].sort(
        (a, b) =>
          (b.date || "").localeCompare(
            a.date || ""
          ) ||
          b.id - a.id
      ),
    [events.data, notes.data]
  );

  return (
    <div>
      <PageHeader
        eyebrow="YOUR RECORD"
        title="Timeline"
      >
        <button
          className="button button-primary"
          onClick={() =>
            setModal(true)
          }
        >
          <Icon
            name="plus"
            size={17}
          />
          Add health event
        </button>
      </PageHeader>

      <div className="timeline-intro">
        <p>
          A chronological view of the
          information you choose to keep.
          CareFlow does not interpret these
          records.
        </p>
      </div>

      {events.loading ||
      notes.loading ? (
        <Loading />
      ) : events.error ||
        notes.error ? (
        <ErrorState
          onRetry={() => {
            events.reload();
            notes.reload();
          }}
        />
      ) : items.length === 0 ? (
        <Empty
          title="Your timeline is empty"
          text="Add an event or note to start your personal record."
          button="Add health event"
          onClick={() =>
            setModal(true)
          }
        />
      ) : (
        <div className="timeline">
          {groupByYear(items).map(
            ([year, yearItems]) => (
              <section
                className="timeline-year"
                key={year}
              >
                <h2>{year}</h2>

                <div className="timeline-items">
                  {yearItems.map(
                    (item) => (
                      <TimelineItem
                        item={item}
                        key={`${item.type}-${item.id}`}
                      />
                    )
                  )}
                </div>
              </section>
            )
          )}
        </div>
      )}

      {modal && (
        <EventForm
          onClose={() =>
            setModal(false)
          }
          onSaved={() => {
            setModal(false);
            events.reload();
            notify(
              "Health event added."
            );
          }}
        />
      )}
    </div>
  );
}

function TimelineItem({ item }) {
  return (
    <article className="timeline-item">
      <div className="timeline-date">
        <strong>
          {new Date(
            item.date + "T12:00"
          ).toLocaleDateString(
            "en-US",
            {
              day: "2-digit",
            }
          )}
        </strong>

        <span>
          {new Date(
            item.date + "T12:00"
          ).toLocaleDateString(
            "en-US",
            {
              month: "short",
            }
          )}
        </span>
      </div>

      <div className="timeline-marker" />

      <div className="timeline-copy">
        <span className="card-kicker">
          {item.category}
        </span>

        <h3>{item.title}</h3>

        <p>
          {item.description ||
            "No additional detail recorded."}
        </p>
      </div>
    </article>
  );
}

function groupByYear(items) {
  return Object.entries(
    items.reduce(
      (accumulator, item) => {
        const year =
          item.date?.slice(0, 4) ||
          "Unknown";

        (
          accumulator[year] ??= []
        ).push(item);

        return accumulator;
      },
      {}
    )
  );
}

function EventForm({
  onClose,
  onSaved,
}) {
  const [form, setForm] =
    useState({
      title: "",
      date: "",
      category: "Health event",
      description: "",
    });

  const [busy, setBusy] =
    useState(false);

  const [err, setErr] =
    useState("");

  const submit = async (event) => {
    event.preventDefault();

    setBusy(true);
    setErr("");

    try {
      await request(
        "/health-events",
        {
          method: "POST",
          body: JSON.stringify(form),
        }
      );

      onSaved();
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title="Add health event"
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="form-grid"
      >
        <Field
          label="Event title"
          value={form.title}
          onChange={(value) =>
            setForm({
              ...form,
              title: value,
            })
          }
          required
        />

        <Field
          label="Date"
          type="date"
          value={form.date}
          onChange={(value) =>
            setForm({
              ...form,
              date: value,
            })
          }
          required
        />

        <Field
          label="Category"
          value={form.category}
          onChange={(value) =>
            setForm({
              ...form,
              category: value,
            })
          }
          required
        />

        <label className="field full">
          <span>Description</span>

          <textarea
            rows="4"
            value={
              form.description
            }
            onChange={(event) =>
              setForm({
                ...form,
                description:
                  event.target.value,
              })
            }
          />
        </label>

        {err && (
          <div className="form-error">
            {err}
          </div>
        )}

        <FormActions
          busy={busy}
          onClose={onClose}
        />
      </form>
    </Modal>
  );
}

function Notes({ notify }) {
  const data =
    useData("/health-notes");

  const [modal, setModal] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const remove = async (id) => {
    if (
      !window.confirm(
        "Delete this note?"
      )
    ) {
      return;
    }

    try {
      await request(
        `/health-notes/${id}`,
        {
          method: "DELETE",
        }
      );

      notify("Note deleted.");
      data.reload();
    } catch (error) {
      notify(error.message);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="PRIVATE NOTES"
        title="Health notes"
      >
        <button
          className="button button-primary"
          onClick={() => {
            setEditing(null);
            setModal(true);
          }}
        >
          <Icon
            name="plus"
            size={17}
          />
          New note
        </button>
      </PageHeader>

      <div className="notice">
        <Icon
          name="note"
          size={18}
        />

        <span>
          Write what you want to remember
          or discuss. CareFlow stores your
          words without interpreting them.
        </span>
      </div>

      {data.loading ? (
        <Loading />
      ) : data.error ? (
        <ErrorState
          onRetry={data.reload}
        />
      ) : data.data.length === 0 ? (
        <Empty
          title="No notes yet"
          text="Keep questions, observations or follow-up information here."
          button="New note"
          onClick={() => {
            setEditing(null);
            setModal(true);
          }}
        />
      ) : (
        <div className="notes-grid">
          {data.data.map(
            (note) => (
              <article
                className="note-card"
                key={note.id}
              >
                <div className="note-head">
                  <span className="card-kicker">
                    {formatDate(
                      note.created_at?.slice(
                        0,
                        10
                      )
                    )}
                  </span>

                  <div>
                    <button
                      className="icon-button"
                      aria-label={`Edit ${note.title}`}
                      onClick={() => {
                        setEditing(note);
                        setModal(true);
                      }}
                    >
                      <Icon
                        name="edit"
                        size={17}
                      />
                    </button>

                    <button
                      className="icon-button danger"
                      aria-label={`Delete ${note.title}`}
                      onClick={() =>
                        remove(note.id)
                      }
                    >
                      <Icon
                        name="trash"
                        size={17}
                      />
                    </button>
                  </div>
                </div>

                <h3>{note.title}</h3>

                <p>{note.content}</p>
              </article>
            )
          )}
        </div>
      )}

      {modal && (
        <NoteForm
          initial={editing}
          onClose={() =>
            setModal(false)
          }
          onSaved={() => {
            setModal(false);
            data.reload();

            notify(
              editing
                ? "Note updated."
                : "Note created."
            );
          }}
        />
      )}
    </div>
  );
}

function NoteForm({
  initial,
  onClose,
  onSaved,
}) {
  const [form, setForm] =
    useState(
      initial || {
        title: "",
        content: "",
      }
    );

  const [busy, setBusy] =
    useState(false);

  const [err, setErr] =
    useState("");

  const submit = async (event) => {
    event.preventDefault();

    setBusy(true);
    setErr("");

    try {
      await request(
        initial
          ? `/health-notes/${initial.id}`
          : "/health-notes",
        {
          method: initial
            ? "PATCH"
            : "POST",
          body: JSON.stringify(form),
        }
      );

      onSaved();
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={
        initial
          ? "Edit note"
          : "New health note"
      }
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="form-grid"
      >
        <Field
          label="Title"
          value={form.title}
          onChange={(value) =>
            setForm({
              ...form,
              title: value,
            })
          }
          required
        />

        <label className="field full">
          <span>Note</span>

          <textarea
            rows="8"
            value={form.content}
            onChange={(event) =>
              setForm({
                ...form,
                content:
                  event.target.value,
              })
            }
            required
          />
        </label>

        {err && (
          <div className="form-error">
            {err}
          </div>
        )}

        <FormActions
          busy={busy}
          onClose={onClose}
        />
      </form>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && (
          <b aria-hidden="true">
            {" "}
            *
          </b>
        )}
      </span>

      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        required={required}
      />
    </label>
  );
}

function FormActions({
  busy,
  onClose,
}) {
  return (
    <div className="form-actions">
      <button
        type="button"
        className="button button-secondary"
        onClick={onClose}
      >
        Cancel
      </button>

      <button
        type="submit"
        className="button button-primary"
        disabled={busy}
      >
        {busy ? (
          <>
            <span className="button-spinner" />
            Saving…
          </>
        ) : (
          "Save"
        )}
      </button>
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return "Date not set";
  }

  const date = new Date(
    value + "T12:00"
  );

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function formatTime(value) {
  if (!value) {
    return "";
  }

  const [hours, minutes] =
    value
      .split(":")
      .map(Number);

  const date = new Date();

  date.setHours(
    hours,
    minutes,
    0,
    0
  );

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

export default App;