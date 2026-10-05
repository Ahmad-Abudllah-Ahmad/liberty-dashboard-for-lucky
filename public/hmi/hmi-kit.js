/* Shared SCADA HMI drawing kit (same visual language as scada-main-screen.html). */
const NS='http://www.w3.org/2000/svg',S=document.getElementById('s'),tipEl=document.getElementById('tip');
const W=2900,H=1484,TOP=128;
const RED='#b0301c',TEAL='#1f7c8a',YEL='#ffe94a',GRN='#2e8b2e',LG='#5cf03c',NV='#1c2a8a',CR='#ff3b4a',BG='#8e90dc';
const PIPE='#2f5bd8',WATER='#3fa9f5',STEAM='#f2f2f7',GAS='#f0a020',GREY='#c9c9d6',INK='#0f1330',PANEL='#a3a5e6';
let P=S;
const upd=[];
const live=f=>upd.push(f);
const rnd=(a,b)=>Math.round(a+Math.random()*(b-a));
const jit=(v,a)=>v+(Math.random()-.5)*a;
const fx=(v,d=1)=>Number(v).toFixed(d);
const E=(t,a,p=P)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e};
const TX=(x,y,s,t,f='#fff',an='middle',w='bold',p=P)=>{const e=E('text',{x,y,'font-size':s,fill:f,'text-anchor':an,'font-weight':w},p);e.textContent=t;return e};
const LB=(x,y,t,s=24,f='#fff',an='middle')=>TX(x,y,s,t,f,an,'normal');
const G=(t='',p=P)=>E('g',t?{transform:t}:{},p);
const rc=(x,y,w,h,f=NV,a={},p=P)=>E('rect',{x,y,width:w,height:h,fill:f,...a},p);
function tip(e,fn){e.tip=fn;return e}

function box(x,y,w,h,fill,txt,col=YEL,fs=34){const g=E('g',{});E('rect',{x:x-w/2,y:y-h/2,width:w,height:h,fill,stroke:'#fff','stroke-opacity':.7,'stroke-width':2},g);const t=TX(x,y+fs*.35,fs,txt,col,'middle','bold',g);g.set=(v,f,c)=>{t.textContent=v;if(f)g.firstChild.setAttribute('fill',f);if(c)t.setAttribute('fill',c)};return g}
function sel(x,y,opts,i=0,w=90,name='Mode Selector'){const g=box(x,y,w,40,'#fff',opts[i]+' ▾','#333',22);g.classList.add('c');g.addEventListener('click',()=>{i=(i+1)%opts.length;g.set(opts[i]+' ▾')});g.val=()=>opts[i];g.tip=()=>({t:name,r:[['Selected',opts[i]],['Options',opts.join(' / ')],['Action','Click to change']]});return g}
function toggle(x,y,name,on0=false,s=62,onTxt='1',offTxt='0'){const g=box(x,y,s,s,on0?GRN:RED,on0?onTxt:offTxt,'#fff',s*.55);g.classList.add('c');let on=on0;g.addEventListener('click',()=>{on=!on;g.set(on?onTxt:offTxt,on?GRN:RED)});g.on=()=>on;g.tip=()=>({t:name,r:[['State',on?'ON':'OFF'],['Action','Click to toggle']]});return g}
function sw(x,y,name,on0=true,w=62,h=42){const g=box(x,y,w,h,on0?LG:'#e8e8ee',on0?'1':'0',on0?'#0a4a0a':'#333',h*.6);g.classList.add('c');let on=on0;g.addEventListener('click',()=>{on=!on;g.set(on?'1':'0',on?LG:'#e8e8ee',on?'#0a4a0a':'#333')});g.on=()=>on;g.tip=()=>({t:name,r:[['State',on?'ENABLED':'DISABLED'],['Action','Click to toggle']]});return g}
function btn(x,y,w,h,label,fn,fill='#e8e8ee',col=NV,fs=22){const g=box(x,y,w,h,fill,label,col,fs);g.classList.add('c');g.addEventListener('click',()=>{g.firstChild.setAttribute('fill','#ffe94a');setTimeout(()=>g.firstChild.setAttribute('fill',fill),180);fn&&fn()});return g}
function pvsv(x,y,name,sv,pv,unit='°C',o={}){const w=o.w||104,h=o.h||46,fs=o.fs||28,gap=o.gap||6,d=o.d??0;const s=box(x,y,w,h,TEAL,fx(sv,d),'#fff',fs),p=box(x,y+h+gap,w,h,RED,fx(pv,d),YEL,fs);let v=pv;const a=o.drift??Math.max(.4,Math.abs(sv)*.008);
 const f=()=>({t:name,r:[['Set Value',fx(sv,d)+' '+unit],['Actual',fx(v,d)+' '+unit],['Deviation',(v-sv>=0?'+':'')+fx(v-sv,d)+' '+unit],['Status',Math.abs(v-sv)<=Math.max(2,Math.abs(sv)*.05)?'IN TOLERANCE':'OUT OF TOLERANCE']]});s.tip=f;p.tip=f;
 live(()=>{v=v+(sv-v)*(o.pull??.08)+(Math.random()-.5)*a;p.set(fx(v,d))});return{sv:s,pv:p,get:()=>v}}
function val(x,y,name,v0,unit='',o={}){const w=o.w||110,h=o.h||46,fs=o.fs||28,d=o.d??1;const g=box(x,y,w,h,o.fill||RED,fx(v0,d),o.col||YEL,fs);let v=v0;g.tip=()=>({t:name,r:[['Value',fx(v,d)+' '+unit],...(o.extra?o.extra(v):[])]});if(o.drift)live(()=>{v=o.min!=null?Math.max(o.min,jit(v,o.drift)):jit(v,o.drift);if(o.max!=null)v=Math.min(o.max,v);v=v+(v0-v)*.1;g.set(fx(v,d))});g.get=()=>v;return g}
function adj(x,y,name,v0,step=.1,unit='%',o={}){const d=o.d??1,g=G();let v=v0;P=g;const vb=box(x,y,120,46,RED,(v>0&&o.sign!==false?'+':'')+fx(v,d),YEL,26);P=g.parentNode;
 const put=()=>vb.set((v>0&&o.sign!==false?'+':'')+fx(v,d));
 [[-150,'++',step*10],[-94,'+',step],[94,'-',-step],[150,'--',-step*10]].forEach(([dx,l,s])=>{const b=box(x+dx,y,48,40,'#eeeef2',l,'#333',22);g.appendChild(b);b.classList.add('c');b.addEventListener('click',()=>{v=+(v+s).toFixed(3);put()});b.tip=()=>({t:name,r:[['Set Value',fx(v,d)+' '+unit],['Step',(s>0?'+':'')+fx(s,d)+' '+unit],['Action','Click to adjust']]})});
 vb.tip=()=>({t:name,r:[['Set Value',fx(v,d)+' '+unit],['Range',(o.range||'±10')+' '+unit]]});return g}
function lamp(x,y,name,on=true,r=16,col=LG){const c=E('circle',{cx:x,cy:y,r,fill:on?col:'#7a1c12',stroke:'#fff','stroke-width':2,class:'c'});let o=on;c.addEventListener('click',()=>{o=!o;c.setAttribute('fill',o?col:'#7a1c12')});tip(c,()=>({t:name,r:[['State',o?'ON':'OFF']]}));return c}
function panel(x,y,w,h,title,fill='#a8aaee'){E('rect',{x,y,width:w,height:h,rx:10,fill,stroke:'#fff','stroke-opacity':.55,'stroke-width':2});if(title){E('rect',{x,y,width:w,height:46,rx:10,fill:NV});rc(x,y+30,w,16,NV);TX(x+w/2,y+32,24,title)}}

function motor(x,y,n,on=true){const g=E('g',{class:'c'});const a=E('rect',{x:x-31,y:y-18,width:62,height:34,fill:LG,stroke:'#fff'},g);TX(x,y+9,20,n,'#0a4a0a','middle','bold',g);const b=E('rect',{x:x-31,y:y+20,width:62,height:34,fill:GRN,stroke:'#fff'},g);const t=TX(x,y+46,26,'1','#fff','middle','bold',g);
 const spd=rnd(900,1450),cur=rnd(8,22);let I=cur;const draw=()=>{b.setAttribute('fill',on?GRN:RED);a.setAttribute('fill',on?LG:GREY);t.textContent=on?'1':'0'};
 g.addEventListener('click',()=>{on=!on;draw()});g.tip=()=>({t:'Motor '+n,r:[['Status',on?'RUNNING':'STOPPED'],['Speed',on?spd+' rpm':'0 rpm'],['Current',on?fx(I)+' A':'0.0 A'],['Voltage',on?'415 V':'0 V'],['Power',on?fx(I*.72)+' kW':'0.0 kW'],['Run Hours',(1500+spd*3)+' h'],['Action','Click to start/stop']]});live(()=>{I=cur+Math.random()*1.2-.6});draw();return g}
function fan(x,y,name,on=true,s=60){const g=box(x,y,s,s,on?'#1f6b2a':RED,'','#fff');g.classList.add('c');E('circle',{cx:x,cy:y,r:s*.3,fill:'none',stroke:'#fff','stroke-width':4},g);const r=E('path',{d:`M${x-s*.33} ${y}H${x+s*.33}M${x} ${y-s*.33}V${y+s*.33}`,stroke:'#fff','stroke-width':4,class:on?'rot':''},g);let o=on,rpm=rnd(1350,1480);
 g.addEventListener('click',()=>{o=!o;g.firstChild.setAttribute('fill',o?'#1f6b2a':RED);r.classList.toggle('rot',o)});g.tip=()=>({t:name,r:[['State',o?'RUNNING':'STOPPED'],['Speed',o?rpm+' rpm':'0 rpm'],['Action','Click to toggle']]});return g}
function impeller(x,y,r,name,on=true,info){const g=E('g',{class:'c'});E('circle',{cx:x,cy:y,r,fill:'#e9edf7',stroke:'#4a5a8a','stroke-width':3},g);const b=E('g',{class:on?'rot':''},g);for(let i=0;i<8;i++){const a=i*Math.PI/4;E('path',{d:`M${x} ${y}L${x+Math.cos(a)*r*.82} ${y+Math.sin(a)*r*.82}`,stroke:'#2a8a3a','stroke-width':r*.16,'stroke-linecap':'round'},b)}E('circle',{cx:x,cy:y,r:r*.22,fill:'#d4b000'},g);let o=on;g.addEventListener('click',()=>{o=!o;b.classList.toggle('rot',o)});g.tip=()=>({t:name,r:[['State',o?'RUNNING':'STOPPED'],...(info?info(o):[])]});return g}
function rl(x,y,r,n,f='#3a0f2a',c=CR){const g=E('g',{class:'rot'});E('circle',{cx:x,cy:y,r,fill:f,stroke:c,'stroke-width':r*.45},g);E('circle',{cx:x+r*.5,cy:y,r:r*.22,fill:c},g);
 tip(g,()=>{const h=Math.abs([...n].reduce((a,ch)=>a*31+ch.charCodeAt(0)|0,7)),w=Math.sin(Date.now()/1500+h),cyl=/Cylinder|Drum/.test(n);return{t:n,r:[['Type',cyl?'Drying Cylinder':/Squeeze|Nip|Padder|Mangle/.test(n)?'Squeeze Roll':'Guide Roller'],['Status','ROTATING'],['Speed',fx((cyl?14:22)+h%6+w*.3)+' rpm'],...(cyl?[['Surface Temp',fx(100+h%25+w*1.5,0)+' °C']]:[]),['Drive Load',fx(38+h%30+w*2,0)+' %'],['Bearing Temp',fx(41+h%12+w*.5)+' °C'],['Vibration',fx(1.1+(h%9)/10+w*.05,2)+' mm/s']]}});return g}
function cloth(d,info,col=CR,w=3){E('path',{d,fill:'none',stroke:col,'stroke-width':w,'stroke-linejoin':'round'});const c=E('path',{d,fill:'none',stroke:'#fff','stroke-width':1.6,'stroke-dasharray':'6 6','stroke-linejoin':'round',class:'cloth'});tip(c,()=>({t:'Fabric Path',r:info?info():[['Flow','Inlet to Exit'],['Status','RUNNING']]}));return c}
function pipe(d,name,col=PIPE,w=10,flow=true,info){const g=E('g',{});E('path',{d,fill:'none',stroke:'#1a2050',"stroke-width":w+4,'stroke-linejoin':'round','stroke-linecap':'round'},g);E('path',{d,fill:'none',stroke:col,'stroke-width':w,'stroke-linejoin':'round','stroke-linecap':'round'},g);if(flow)E('path',{d,fill:'none',stroke:'#fff','stroke-opacity':.75,'stroke-width':w*.3,'stroke-dasharray':'8 16',class:'flow'},g);if(name)tip(g,()=>({t:name,r:info?info():[['Medium',col===STEAM?'Steam':col===GAS?'Gas':'Water / Liquor'],['Flow',flow?'ACTIVE':'IDLE']]}));return g}
function valve(x,y,name,open=true,vert=false,s=18){const g=E('g',{class:'c',transform:`translate(${x} ${y})${vert?' rotate(90)':''}`});const p=E('path',{d:`M${-s} ${-s*.7}L${s} ${s*.7}V${-s*.7}L${-s} ${s*.7}Z`,stroke:'#222','stroke-width':2.5},g);E('path',{d:`M0 0V${-s*1.1}M${-s*.55} ${-s*1.1}H${s*.55}`,stroke:'#222','stroke-width':3},g);let o=open;const draw=()=>p.setAttribute('fill',o?LG:'#f4f4f4');draw();g.addEventListener('click',()=>{o=!o;draw()});g.tip=()=>({t:name,r:[['Position',o?'OPEN':'CLOSED'],['Feedback',o?'100 %':'0 %'],['Action','Click to operate']]});return g}
function pump(x,y,name,on=true,r=26,info){const g=E('g',{class:'c'});rc(x-r*1.4,y+r*.75,r*2.8,r*.35,'#3a3f5a',{},g);E('circle',{cx:x,cy:y,r,fill:'#dfe4f2',stroke:'#3a4a7a','stroke-width':3},g);const b=E('path',{d:`M${x-r*.6} ${y}H${x+r*.6}M${x} ${y-r*.6}V${y+r*.6}`,stroke:on?GRN:RED,'stroke-width':r*.22,'stroke-linecap':'round',class:on?'rot':''},g);E('rect',{x:x+r*.9,y:y-r*.55,width:r*1.5,height:r*1.1,rx:4,fill:on?'#39b54a':'#a33',stroke:'#fff'},g);let o=on;const fl=rnd(40,140),pr=jit(3.2,1);
 g.addEventListener('click',()=>{o=!o;b.classList.toggle('rot',o);b.setAttribute('stroke',o?GRN:RED);g.children[3].setAttribute('fill',o?'#39b54a':'#a33')});g.on=()=>o;g.tip=()=>({t:name,r:[['Status',o?'RUNNING':'STOPPED'],...(info?info(o):[['Flow',o?fl+' L/min':'0 L/min'],['Pressure',o?fx(pr)+' bar':'0.0 bar']]),['Action','Click to start/stop']]});return g}
function tank(x,y,w,h,name,lvl,o={}){const g=E('g',{});const col=o.col||WATER;E('rect',{x,y,width:w,height:h,rx:o.rx??8,fill:'#e7e9f5',stroke:'#3a4a7a','stroke-width':3},g);const f=E('rect',{x:x+3,y:y+h-3,width:w-6,height:0,fill:col,opacity:.9},g);let v=lvl;const cap=o.cap||1000;
 const draw=()=>{const hh=(h-6)*v/100;f.setAttribute('y',y+h-3-hh);f.setAttribute('height',hh)};draw();if(o.drift!==0)live(()=>{v=Math.max(0,Math.min(100,v+(lvl-v)*.15+(Math.random()-.5)*(o.drift||1.2)));draw();o.on&&o.on(v)});tip(g,()=>({t:name,r:[['Level',fx(v)+' %'],['Volume',fx(cap*v/100,0)+' L'],['Capacity',cap+' L'],...(o.extra?o.extra(v):[])]}));g.get=()=>v;return g}
function bar(x,y,w,h,name,pct,o={}){const g=E('g',{});E('rect',{x,y,width:w,height:h,fill:o.bg||'#eef0f8',stroke:'#4a5a8a','stroke-width':2},g);const f=E('rect',{x:x+2,y,width:w-4,height:0,fill:o.col||PIPE},g);let v=pct;const hz=o.horizontal;
 const draw=()=>{if(hz){f.setAttribute('x',x+2);f.setAttribute('y',y+2);f.setAttribute('height',h-4);f.setAttribute('width',(w-4)*Math.max(0,Math.min(100,v))/100)}else{const hh=(h-4)*Math.max(0,Math.min(100,v))/100;f.setAttribute('y',y+h-2-hh);f.setAttribute('height',hh)}};draw();if(o.drift)live(()=>{v=Math.max(0,Math.min(100,jit(v,o.drift)+(pct-v)*.12));draw();o.on&&o.on(v)});tip(g,()=>({t:name,r:[['Value',fx(v)+' '+(o.unit||'%')],...(o.extra?o.extra(v):[])]}));g.get=()=>v;return g}
function flame(x,y,name,on=true,s=1){const g=E('g',{class:'c'});const f=E('path',{d:`M${x} ${y}c${-22*s} 0 ${-30*s} ${-16*s} ${-26*s} ${-30*s}c${6*s} ${8*s} ${12*s} ${8*s} ${14*s} ${2*s}c${-4*s} ${-14*s} ${4*s} ${-26*s} ${16*s} ${-32*s}c${-2*s} ${12*s} ${10*s} ${18*s} ${16*s} ${30*s}c${6*s} ${-4*s} ${6*s} ${-10*s} ${6*s} ${-14*s}c${10*s} ${14*s} ${6*s} ${44*s} ${-26*s} ${44*s}z`,fill:'#ff7a1a',stroke:'#ffd23a','stroke-width':3,class:on?'flame':''},g);let o=on;g.addEventListener('click',()=>{o=!o;f.classList.toggle('flame',o);f.setAttribute('fill',o?'#ff7a1a':'#9a9aa8')});g.on=()=>o;g.tip=()=>({t:name,r:[['Flame',o?'DETECTED':'OFF'],['Ignition',o?'OK':'STANDBY'],['Action','Click to toggle']]});return g}
function arrow(x1,y1,x2,y2,col=PIPE,w=6){const a=Math.atan2(y2-y1,x2-x1),l=18;E('path',{d:`M${x1} ${y1}L${x2} ${y2}`,stroke:col,'stroke-width':w});E('path',{d:`M${x2} ${y2}L${x2-l*Math.cos(a-.45)} ${y2-l*Math.sin(a-.45)}L${x2-l*Math.cos(a+.45)} ${y2-l*Math.sin(a+.45)}Z`,fill:col})}
function seg(x,y,w,h,label,fill='#e3e5f7',stroke=NV){E('rect',{x,y,width:w,height:h,rx:6,fill,stroke,'stroke-width':3});if(label)LB(x+w/2,y-12,label,22,'#fff')}
function hood(x,y,w,h,col=NV){E('path',{d:`M${x} ${y+h}V${y+18}L${x+w/2} ${y}L${x+w} ${y+18}V${y+h}`,fill:'none',stroke:col,'stroke-width':6})}
function alarmBar(x,y,w,h,txt,fill=RED,col='#fff'){const g=box(x+w/2,y+h/2,w,h,fill,txt,col,h*.48);g.classList.add('blink');return g}

/* screen framework: header with tabs, clock and status boxes; one layer per screen */
function HMI(cfg){
 E('rect',{width:W,height:H,fill:cfg.bg||BG},S);
 E('rect',{width:W,height:TOP-8,fill:NV},S);E('rect',{width:W,height:6,y:TOP-14,fill:'#3b4bff'},S);
 let rx=W-24;const stats=(cfg.stats||[]).slice().reverse();
 stats.forEach(s=>{P=S;const w=s.w||130;rx-=w/2;const b=box(rx,58,w,58,s.fill||RED,s.v,s.col||YEL,s.fs||34);if(s.tip)b.tip=s.tip;if(s.live)live(()=>s.live(b));rx-=w/2+10;if(s.l){TX(rx,68,24,s.l,'#fff','end','normal');rx-=s.l.length*13+14}});
 const clkW=520;rx-=clkW/2;E('rect',{x:rx-clkW/2,y:28,width:clkW,height:60,fill:NV,stroke:'#fff','stroke-width':3},S);const clk=TX(rx,68,28,'','#fff','middle','bold',S);const tabMax=rx-clkW/2-24;
 const tick=()=>{clk.textContent=new Date().toLocaleString('en-US',{weekday:'short',year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',second:'2-digit'}).replace(' at ',' ')};tick();setInterval(tick,1000);
 const layers=[],tabs=[];let tx=24;const n=cfg.screens.length;const tw=n>1?Math.min(240,(tabMax-24-(n-1)*10)/n):0;
 cfg.screens.forEach((sc,i)=>{const L=E('g',{style:'display:none'},S);layers.push(L);P=L;sc.draw();P=S;
  if(n>1){const t=E('g',{class:'tab'},S);E('rect',{x:tx,y:28,width:tw,height:60,rx:6,fill:'#2a3aa8',stroke:'#fff','stroke-opacity':.6,'stroke-width':2},t);TX(tx+tw/2,68,Math.min(26,tw/(sc.name.length*.62)),sc.name,'#fff','middle','bold',t);t.addEventListener('click',()=>show(i));tabs.push(t);tx+=tw+10}});
 if(typeof fabricWrap==='function')fabricWrap(S);
 function show(i){layers.forEach((l,j)=>l.style.display=j===i?'':'none');tabs.forEach((t,j)=>{t.firstChild.setAttribute('fill',j===i?YEL:'#2a3aa8');t.lastChild.setAttribute('fill',j===i?NV:'#fff')})}
 const q=new URLSearchParams(location.search).get('screen');show(Math.max(0,Math.min(n-1,Number(q)||0)));
 document.addEventListener('mousemove',e=>{let el=e.target,f=null;while(el&&el!==document){if(el.tip){f=el.tip;break}el=el.parentNode}
  if(!f){tipEl.style.display='none';return}const d=f();tipEl.innerHTML=`<b>${d.t}</b>`+d.r.map(r=>`<div><span>${r[0]}</span>${r[1]}</div>`).join('');tipEl.style.display='block';
  tipEl.style.left=Math.min(e.clientX+16,innerWidth-tipEl.offsetWidth-8)+'px';tipEl.style.top=Math.min(e.clientY+16,innerHeight-tipEl.offsetHeight-8)+'px'});
 setInterval(()=>upd.forEach(f=>f()),1500);
 return{show}
}
