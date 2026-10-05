/* Fabric routing: wraps every fabric path tangentially over the surface of the rollers / drums it passes. */
function fabricWrap(root){
 root=root||document.querySelector('svg');
 const mat=el=>{let m=root.createSVGMatrix();for(let e=el;e&&e!==root;e=e.parentNode){const t=e.transform&&e.transform.baseVal.consolidate();if(t)m=t.matrix.multiply(m)}return m};
 const app=(m,x,y)=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f});
 const layer=el=>{while(el.parentNode&&el.parentNode!==root)el=el.parentNode;return el};
 const rolls=[];
 root.querySelectorAll('g.rot>circle:first-child,g.rot-slow>circle:first-child,circle[data-roll]').forEach(c=>{const m=mat(c),k=Math.hypot(m.a,m.b),p=app(m,+c.getAttribute('cx'),+c.getAttribute('cy'));
  const st=c.getAttribute('stroke'),sw=st&&st!=='none'?+(c.getAttribute('stroke-width')||1):0;rolls.push({x:p.x,y:p.y,R:(+c.getAttribute('r')+sw/2)*k+1.5,L:layer(c)})});
 const cr=(a,b)=>a.x*b.y-a.y*b.x,sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y}),len=a=>Math.hypot(a.x,a.y);
 root.querySelectorAll('path.cloth').forEach(dash=>{
  const d=dash.getAttribute('d');if(/[^MLHVQZ\d\s.,\-e]/.test(d))return;
  const base=dash.previousElementSibling,m=mat(dash),inv=m.inverse(),k=Math.hypot(m.a,m.b),L=layer(dash),cand=rolls.filter(r=>r.L===L);
  const toks=d.match(/[MLHVQZ]|-?\d*\.?\d+(?:e-?\d+)?/g)||[],subs=[];let cmd='M',x=0,y=0,cur=null;
  for(let i=0;i<toks.length;){const t=toks[i];if(/[MLHVQZ]/.test(t)){cmd=t;i++;if(t==='Z'&&cur)cur.push(cur[0]);continue}
   let q=null;if(cmd==='H'){x=+t;i++}else if(cmd==='V'){y=+t;i++}else if(cmd==='Q'){q=app(m,+t,+toks[i+1]);x=+toks[i+2];y=+toks[i+3];i+=4}else{x=+t;y=+toks[i+1];i+=2}
   if(cmd==='M'){cur=[];subs.push(cur);cmd='L'}const pt=app(m,x,y);if(q)pt.q=q;cur.push(pt)}
  const lp=p=>{const q=app(inv,p.x,p.y);return q.x.toFixed(1)+' '+q.y.toFixed(1)};
  const out=subs.filter(p=>p.length>1).map(pts=>{
   const last=pts.length-1,N=[];pts.forEach((p,i)=>{let best=null,bd=1e9;const end=i===0||i===last;if(!p.q)cand.forEach(r=>{const dd=Math.hypot(p.x-r.x,p.y-r.y);if(dd<=(end?r.R-2:r.R+16)&&dd<bd){bd=dd;best=r}});
    const l=N[N.length-1];if(best&&l&&l.r===best){l.j=i;return}N.push(best?{r:best,i,j:i}:{p})});
   if(N.length<2)return'M'+lp(pts[0])+pts.slice(1).map(p=>'L'+lp(p)).join('');
   N.forEach(n=>{if(!n.r)return;if(n.i===0||n.j===last){const V=pts[n.i],O=n.i===0?pts[1]:pts[last-1],c=n.i===0?cr(sub(O,V),sub(n.r,V)):cr(sub(V,O),sub(n.r,O));n.s=c<0?1:-1;return}
    const A=pts[n.i-1],B=pts[n.j+1],u=sub(n.r,A),w=sub(B,n.r),z=cr(u,w)/((len(u)*len(w))||1);
    const V={x:(pts[n.i].x+pts[n.j].x)/2,y:(pts[n.i].y+pts[n.j].y)/2},o=sub(V,n.r);
    n.s=Math.abs(z)>.05?(z>0?-1:1):len(o)>n.r.R*.2?(cr(sub(B,A),o)>0?1:-1):(cr(sub(B,A),sub(n.r,A))<0?1:-1)});
   N.forEach(n=>{if(n.r)n.R=n.r.R});
   const fit=()=>{for(let i=0;i<N.length-1;i++){const a=N[i],b=N[i+1];if(!a.r||!b.r||a.s===b.s)continue;const l=Math.hypot(b.r.x-a.r.x,b.r.y-a.r.y)*.94;if(a.R+b.R>l){const f=l/(a.R+b.R);a.R*=f;b.R*=f}}};fit();
   const C=n=>n.r||n.p,rho=n=>n.r?n.s*n.R:0,ang=(c,p)=>Math.atan2(p.y-c.y,p.x-c.x);
   const tang=()=>{const T=[];for(let i=0;i<N.length-1;i++){const a=C(N[i]),b=C(N[i+1]),dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l;
    const q=Math.max(-1,Math.min(1,(rho(N[i])-rho(N[i+1]))/l)),h=Math.sqrt(1-q*q),nx=q*ux-h*uy,ny=q*uy+h*ux;
    T.push([{x:a.x+rho(N[i])*nx,y:a.y+rho(N[i])*ny},{x:b.x+rho(N[i+1])*nx,y:b.y+rho(N[i+1])*ny}])}return T};
   const wrap=(T,i)=>{const n=N[i+1],sw=n.s>0?0:1,a0=ang(n.r,T[i][1]),a1=ang(n.r,T[i+1][0]);let da=sw?a1-a0:a0-a1;return{sw,da:((da%(2*Math.PI))+2*Math.PI)%(2*Math.PI)}};
   let T=tang();
   for(let it=0;it<6;it++){let f=0;for(let i=0;i+1<T.length;i++)if(N[i+1].r&&wrap(T,i).da>Math.PI*1.12){N[i+1].s*=-1;f=1;N.forEach(n=>{if(n.r)n.R=n.r.R});fit();T=tang()}if(!f)break}
   let s='M'+lp(T[0][0]);
   for(let i=0;i<T.length;i++){const n=N[i+1];s+=n.p&&n.p.q?'Q'+lp(n.p.q)+' '+lp(T[i][1]):'L'+lp(T[i][1]);if(!n.r||i+1>=T.length)continue;
    const{sw,da}=wrap(T,i),R=(n.R/k).toFixed(1);s+=`A${R} ${R} 0 ${da>Math.PI?1:0} ${sw} `+lp(T[i+1][0])}
   return s});
  if(!out.length)return;const nd=out.join('');dash.setAttribute('d',nd);if(base&&base.tagName==='path'&&base.getAttribute('d')===d)base.setAttribute('d',nd)});
}
