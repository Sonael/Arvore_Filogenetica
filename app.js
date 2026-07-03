// taxonomia dos felinos (Reino..Família são iguais; variam Gênero e Espécie)
const felTax=(genero,especie)=>({Reino:"Animalia",Filo:"Chordata",Classe:"Mammalia",
  Ordem:"Carnivora","Família":"Felidae","Gênero":genero,"Espécie":especie});

const EXAMPLE = {
  name:"Ancestral Felidae", sci:"Felidae", age:11, trait:"Garras retráteis e dentição hipercarnívora", desc:"Ancestral comum de todos os felinos, que viveu há cerca de 11 milhões de anos. Deu origem a duas grandes linhagens: os grandes felinos (Pantherinae) e os felinos menores (Felinae).", children:[
    { name:"Ancestral Pantherinae", sci:"Pantherinae", age:6.4, trait:"Hióide flexível na laringe — permite rugir", desc:"Ancestral da subfamília dos grandes felinos, que inclui o gênero Panthera (leão, tigre, onça, leopardo) e o leopardo-das-neves.", children:[
        { name:"Ancestral tigre+leopardo-das-neves", age:3.9, desc:"Ponto de especiação que separou a linhagem do tigre e do leopardo-das-neves das demais.", children:[
            { name:"Tigre", sci:"Panthera tigris", ano:"1758 (Linnaeus)", tax:felTax("Panthera","Panthera tigris"), desc:"O maior felino vivo. Vive na Ásia e é facilmente reconhecido pelas listras. Está criticamente ameaçado.", img:"imagens/tigre.jpg" },
            { name:"Leopardo-das-neves", sci:"Panthera uncia", ano:"1775 (Schreber)", tax:felTax("Panthera","Panthera uncia"), desc:"Felino das montanhas da Ásia Central, com pelagem espessa e cauda longa para equilíbrio na neve.", img:"imagens/leopardo_neves.jpg" }
        ]},
        { name:"Ancestral dos grandes Panthera", age:4.6, desc:"Ancestral que originou onça-pintada, leão e leopardo.", children:[
            { name:"Onça-pintada", sci:"Panthera onca", ano:"1758 (Linnaeus)", tax:felTax("Panthera","Panthera onca"), desc:"O maior felino das Américas. Tem a mordida mais forte entre os felinos em relação ao tamanho.", img:"imagens/onca.jpg" },
            { name:"Ancestral leão+leopardo", age:3.0, desc:"Ponto de especiação que separou o leão do leopardo — espécies-irmãs geneticamente muito próximas.", children:[
                { name:"Leão", sci:"Panthera leo", ano:"1758 (Linnaeus)", tax:felTax("Panthera","Panthera leo"), desc:"Único felino social, vivendo em alcateias. Habita savanas africanas e uma pequena região da Índia.", img:"imagens/leao.jpg" },
                { name:"Leopardo", sci:"Panthera pardus", ano:"1758 (Linnaeus)", tax:felTax("Panthera","Panthera pardus"), desc:"Felino de ampla distribuição (África e Ásia), ótimo escalador que costuma levar presas para as árvores.", img:"imagens/leopardo.jpg" }
            ]}
        ]}
    ]},
    { name:"Ancestral Felinae", sci:"Felinae", age:8.5, trait:"Ronronam de forma contínua; não rugem", desc:"Ancestral da subfamília dos felinos de pequeno e médio porte, incluindo o puma, o guepardo e o gato doméstico.", children:[
        { name:"Ancestral puma+guepardo", age:6.7, desc:"Ancestral da linhagem do puma, que também deu origem ao guepardo.", children:[
            { name:"Puma (onça-parda)", sci:"Puma concolor", ano:"1771 (Linnaeus)", tax:felTax("Puma","Puma concolor"), desc:"Grande felino das Américas, mas geneticamente mais próximo dos felinos pequenos. Tem enorme distribuição, do Canadá à Patagônia.", img:"imagens/puma.jpg" },
            { name:"Guepardo", sci:"Acinonyx jubatus", ano:"1775 (Schreber)", tax:felTax("Acinonyx","Acinonyx jubatus"), trait:"Garras semirretráteis e corpo para corrida (>100 km/h)", desc:"O animal terrestre mais rápido, atingindo mais de 100 km/h. Corpo esguio adaptado à corrida.", img:"imagens/guepardo.jpg" }
        ]},
        { name:"Gato doméstico", sci:"Felis catus", ano:"1758 (Linnaeus)", tax:felTax("Felis","Felis catus"), desc:"Descende do gato-selvagem-africano, domesticado há cerca de 10 mil anos. Hoje é um dos animais de estimação mais comuns do mundo.", img:"imagens/gato.jpg" }
    ]}
  ]
};

function serialize(n){
  const o={ name:n.name||"" };
  if(n.sci) o.sci=n.sci;
  if(n.ano) o.ano=n.ano;
  if(typeof n.age==='number') o.age=n.age;
  if(n.tax && Object.keys(n.tax).length) o.tax={...n.tax};
  if(n.trait) o.trait=n.trait;
  if(n.desc) o.desc=n.desc;
  if(n.img) o.img=n.img;
  if(n.children && n.children.length) o.children=n.children.map(serialize);
  return o;
}
const clone = n => serialize(n);

// converte texto "Rank: valor" (uma linha cada) <-> objeto de classificação
function parseTax(text){
  const o={};
  (text||'').split('\n').forEach(line=>{
    const i=line.indexOf(':');
    if(i>0){ const k=line.slice(0,i).trim(), v=line.slice(i+1).trim(); if(k&&v) o[k]=v; }
  });
  return Object.keys(o).length?o:undefined;
}
function taxToText(tax){ return tax?Object.entries(tax).map(([k,v])=>k+': '+v).join('\n'):''; }

const NS='http://www.w3.org/2000/svg';
const LEFT=70, LEVEL=180, TOP=55, LEAFGAP=62;
const svg=document.getElementById('svg');
function el(t,a){ const e=document.createElementNS(NS,t); for(const k in a) e.setAttribute(k,a[k]); return e; }
function $(id){ return document.getElementById(id); }

const IC={
  play :'<svg class="ic ic-fill" viewBox="0 0 16 16"><path d="M4 3l9 5-9 5z"/></svg>',
  pause:'<svg class="ic ic-fill" viewBox="0 0 16 16"><rect x="4" y="3" width="3" height="10"/><rect x="9" y="3" width="3" height="10"/></svg>',
  check:'<svg class="ic" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 5"/></svg>'
};

// ---- persistência local (salva a árvore atual para não perder ao recarregar) ----
const LS_KEY='arvore_filogenetica_tree_v1';
let _saveTimer=null;
function saveLocal(){
  clearTimeout(_saveTimer);
  _saveTimer=setTimeout(()=>{
    try{ localStorage.setItem(LS_KEY, JSON.stringify(serialize(tree))); }catch(e){/* cota cheia/indisponível */}
  },300);
}
function loadLocal(){
  try{ const s=localStorage.getItem(LS_KEY); if(!s) return null; const o=JSON.parse(s); return validateTree(o)?null:o; }
  catch(e){ return null; }
}
function clearLocal(){ try{ localStorage.removeItem(LS_KEY); }catch(e){} }

let tree = loadLocal() || clone(EXAMPLE);
let allNodes=[], edges=[], nodeEls=new Map(), edgeEls=new Map(), robot=null;
let totalNodes=0, totalEdges=0, maxDepth=0, leaves=0, internals=0, W=960, H=600;
let editMode=false, selectedId=null;
let algo='dfs', waypoints=[], segIdx=0, t=0, playing=false, distance=0, order=[];
let panX=0, panY=0, zoom=1, viewport=null, VBW=960, VBH=600;
// recursos educacionais
let cladeHiId=null, mrcaMode=false, mrcaPicks=[], mrcaResultId=null;
let showTraits=false, timeScale=false, hasFullAges=false, useTimeLayout=false, maxAge=0;
let robotX=null, robotY=null;
let robotRot=null, robotAngle=180, dwellUntil=0;
let locatedId=null;
const TIMEW=700;

function kind(n){ if(!n.parent) return 'root'; return (n.children&&n.children.length)?'int':'leaf'; }

function layout(){
  // idades completas? (todo nó ancestral precisa de age numérico)
  hasFullAges = true;
  (function chk(n){ if(n.children && n.children.length){ if(typeof n.age!=='number') hasFullAges=false; n.children.forEach(chk); } })(tree);
  maxAge = (typeof tree.age==='number')?tree.age:0;
  useTimeLayout = timeScale && hasFullAges && maxAge>0;

  let idc=0, leafIdx=0; maxDepth=0; leaves=0; internals=0; allNodes=[]; edges=[];
  (function prep(n,depth,parent){
    n.id=idc++; n.depth=depth; n.parent=parent;
    maxDepth=Math.max(maxDepth,depth);
    if(useTimeLayout){
      const age = (n.children && n.children.length) ? n.age : 0; // folhas = presente (0)
      n.x = LEFT + (maxAge-age)/maxAge*TIMEW;
    } else {
      n.x = LEFT + depth*LEVEL;
    }
    allNodes.push(n);
    if(n.children && n.children.length){
      internals++;
      n.children.forEach(c=>{ prep(c,depth+1,n); edges.push([n,c]); });
      n.y = n.children.reduce((s,c)=>s+c.y,0)/n.children.length;
    } else { leaves++; n.y = TOP + (leafIdx++)*LEAFGAP; }
  })(tree,0,null);
  totalNodes=idc; totalEdges=Math.max(0,idc-1);
  W = (useTimeLayout ? LEFT+TIMEW : LEFT + maxDepth*LEVEL) + 290;
  H = TOP + Math.max(1,leaves)*LEAFGAP + (useTimeLayout?150:120);
  VBW = W; VBH = Math.max(H,360);
  svg.setAttribute('viewBox',`0 0 ${VBW} ${VBH}`);
  updateTimeBtn();
  updateSearchList();
}

function renderSVG(){
  svg.innerHTML=''; nodeEls=new Map(); edgeEls=new Map();
  viewport=el('g',{});

  // eixo de tempo (fundo)
  if(useTimeLayout && maxAge>0){
    const axisY = TOP + (Math.max(1,leaves)-1)*LEAFGAP + 45;
    const topY = TOP - 30;
    const step = maxAge<=6?1 : maxAge<=16?2 : maxAge<=45?5 : 10;
    const xOf = age => LEFT + (maxAge-age)/maxAge*TIMEW;
    // bandas alternadas por intervalo de tempo (facilitam a leitura)
    let bi=0;
    for(let age=0; age<maxAge-0.0001; age+=step){
      const x1=xOf(Math.min(age+step,maxAge)), x2=xOf(age);
      const band=el('rect',{x:x1,y:topY,width:Math.max(0,x2-x1),height:axisY-topY,class:'axis-band'});
      band.setAttribute('fill-opacity',(bi%2===0)?'0.05':'0.11'); viewport.appendChild(band); bi++;
    }
    for(let age=0; age<=maxAge+0.0001; age+=step){
      const x = xOf(age);
      viewport.appendChild(el('line',{x1:x,y1:topY,x2:x,y2:axisY,class:'axis-grid'}));
      const lb=el('text',{x:x,y:axisY+16,class:'axis-label','text-anchor':'middle'}); lb.textContent=(''+(Math.round(age*10)/10)); viewport.appendChild(lb);
    }
    viewport.appendChild(el('line',{x1:LEFT,y1:axisY,x2:LEFT+TIMEW,y2:axisY,class:'axis-line'}));
    const ti=el('text',{x:LEFT+TIMEW/2,y:axisY+34,class:'axis-title','text-anchor':'middle'});
    ti.textContent='← milhões de anos atrás (Mya)        presente →'; viewport.appendChild(ti);
  }

  // caixa do clado destacado (fundo)
  if(cladeHiId!=null && !editMode){
    const node=allNodes.find(n=>n.id===cladeHiId);
    if(node && node.children && node.children.length){
      const cl=collectClade(node);
      const xs=cl.map(d=>d.x), ys=cl.map(d=>d.y);
      const minx=Math.min(...xs)-30, maxx=Math.max(...xs)+210, miny=Math.min(...ys)-30, maxy=Math.max(...ys)+30;
      viewport.appendChild(el('rect',{x:minx,y:miny,width:maxx-minx,height:maxy-miny,rx:14,class:'clade-box'}));
      const nEsp=cl.filter(d=>!(d.children&&d.children.length)).length;
      const cap=el('text',{x:minx+10,y:miny-8,class:'clade-cap'});
      cap.textContent='Clado: '+(node.sci||node.name)+'  ('+nEsp+(nEsp===1?' espécie':' espécies')+')';
      viewport.appendChild(cap);
    }
  }

  edges.forEach(([p,c])=>{
    const ln=el('line',{x1:p.x,y1:p.y,x2:c.x,y2:c.y,class:'edge'});
    viewport.appendChild(ln); edgeEls.set(c.id,ln);
  });

  // caminho do MRCA (acima das arestas base)
  if(mrcaResultId!=null && mrcaPicks.length===2){
    const m=allNodes.find(n=>n.id===mrcaResultId);
    mrcaPicks.forEach(pid=>{
      const start=allNodes.find(n=>n.id===pid); if(!start||!m) return;
      const pth=pathUp(start,m);
      for(let i=0;i<pth.length-1;i++){ const a=pth[i], b=pth[i+1];
        viewport.appendChild(el('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:'mrca-path'})); }
    });
  }

  // novidades evolutivas nos ramos
  if(showTraits){
    edges.forEach(([p,c])=>{
      if(!c.trait) return;
      const mx=(p.x+c.x)/2, my=(p.y+c.y)/2;
      viewport.appendChild(el('rect',{x:mx-3,y:my-3,width:6,height:6,transform:`rotate(45 ${mx} ${my})`,class:'trait-mark'}));
      const tg=el('text',{x:mx,y:my-9,class:'trait-tag','text-anchor':'middle'}); tg.textContent=c.trait; viewport.appendChild(tg);
    });
  }

  allNodes.forEach(n=>{
    const k=kind(n);
    const color = k==='root'?'var(--root)':k==='int'?'var(--internal)':'var(--leaf)';
    const r = k==='leaf'?9 : k==='root'?12 : 8;
    const g=el('g',{});
    const circ=el('circle',{cx:n.x,cy:n.y,r:r,fill:color,stroke:'#3e2819','stroke-width':2});
    g.appendChild(circ); nodeEls.set(n.id,circ);

    if(n.img){
      const R=24, cx=n.x+34, cy=n.y, clipId='clip'+n.id;
      const cp=el('clipPath',{id:clipId}); cp.appendChild(el('circle',{cx:cx,cy:cy,r:R})); svg.appendChild(cp);
      const im=el('image',{x:cx-R,y:cy-R,width:R*2,height:R*2,'clip-path':`url(#${clipId})`,preserveAspectRatio:'xMidYMid slice'});
      im.setAttributeNS('http://www.w3.org/1999/xlink','href',n.img); im.setAttribute('href',n.img);
      g.appendChild(im);
      g.appendChild(el('circle',{cx:cx,cy:cy,r:R,fill:'none',stroke:'var(--ink)','stroke-width':1.5}));
      const t1=el('text',{x:cx+R+8,y:n.y-2,class:'node-label'}); t1.textContent=n.name; g.appendChild(t1);
      const t2=el('text',{x:cx+R+8,y:n.y+11,class:'node-sci'}); t2.textContent=n.sci||''; g.appendChild(t2);
    } else if(k==='leaf' || k==='root'){
      const t1=el('text',{x:n.x+16,y:n.y-2,class:'node-label'}); t1.textContent=n.name; g.appendChild(t1);
      if(n.sci){ const t2=el('text',{x:n.x+16,y:n.y+11,class:'node-sci'}); t2.textContent=n.sci; g.appendChild(t2); }
    } else {
      const t1=el('text',{x:n.x,y:n.y-13,class:'int-label','text-anchor':'middle'}); t1.textContent=(n.name||'especiação'); g.appendChild(t1);
    }
    // na escala de tempo, mostra a idade (Mya) de cada divergência junto ao nó
    if(useTimeLayout && (k==='int'||k==='root') && typeof n.age==='number'){
      const ag=el('text',{x:n.x,y:n.y+18,class:'age-tag','text-anchor':'middle'}); ag.textContent=n.age+' Mya'; g.appendChild(ag);
    }

    // área de clique/toque generosa (maior que o desenho, facilita no dedo)
    g.appendChild(el('circle',{cx:n.x,cy:n.y,r:26,fill:'transparent'}));
    g.style.cursor='pointer';
    // acessibilidade: foco por teclado, papel e rótulo para leitores de tela
    const kindLabel = k==='root'?'Ancestral raiz' : k==='int'?'Ancestral (especiação)' : 'Espécie';
    g.setAttribute('tabindex','0');
    g.setAttribute('role','button');
    g.setAttribute('aria-label', kindLabel+': '+(n.name||'sem nome')+(n.sci?', '+n.sci:''));
    g.addEventListener('click',()=>onNodeClick(n));
    g.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); _kbActivate=true; onNodeClick(n); _kbActivate=false; } });
    viewport.appendChild(g);
  });

  // marcadores do MRCA (acima dos nós): destaca cada espécie escolhida
  mrcaPicks.forEach(pid=>{ const p=allNodes.find(n=>n.id===pid); if(p) viewport.appendChild(el('circle',{cx:p.x,cy:p.y,r:15,class:'mrca-pick'})); });
  if(mrcaResultId!=null && mrcaPicks.length===2){
    const m=allNodes.find(n=>n.id===mrcaResultId);
    if(m){
      viewport.appendChild(el('circle',{cx:m.x,cy:m.y,r:17,class:'mrca-result'}));
      const cap=el('text',{x:m.x,y:m.y-22,class:'mrca-cap','text-anchor':'middle'}); cap.textContent='ACR'; viewport.appendChild(cap);
    }
  }

  // anel de localização (busca)
  if(locatedId!=null){ const n=allNodes.find(x=>x.id===locatedId); if(n) viewport.appendChild(el('circle',{cx:n.x,cy:n.y,r:22,class:'locate-ring'})); }

  if(editMode && selectedId!=null){
    const s=allNodes.find(x=>x.id===selectedId);
    if(s) viewport.appendChild(el('circle',{cx:s.x,cy:s.y,r:16,fill:'none',stroke:'var(--accent2)','stroke-width':2,'stroke-dasharray':'4 4'}));
  }

  robot=el('g',{});
  // sombra (não gira nem balança)
  robot.appendChild(el('ellipse',{cx:0,cy:15,rx:10,ry:3.2,fill:'rgba(0,0,0,0.22)'}));
  const bob=el('g',{class:'mag-bob'});
  const rot=el('g',{class:'mag-rot'});
  // haste (aponta para +x; a rotação a mantém atrás, com a lente na frente)
  rot.appendChild(el('rect',{x:8,y:-3,width:15,height:6,rx:3,fill:'var(--robot)',stroke:'var(--ink)','stroke-width':1.5}));
  rot.appendChild(el('circle',{cx:24,cy:0,r:3.4,fill:'var(--robot)',stroke:'var(--ink)','stroke-width':1.5}));
  // lente
  rot.appendChild(el('circle',{cx:0,cy:0,r:11,fill:'rgba(205,232,244,0.5)',stroke:'var(--robot)','stroke-width':3.5}));
  rot.appendChild(el('circle',{cx:0,cy:0,r:11,fill:'none',stroke:'var(--ink)','stroke-width':1}));
  // realce e brilho
  rot.appendChild(el('path',{d:'M -5.5 -6.5 A 8.5 8.5 0 0 1 4.5 -7.5',fill:'none',stroke:'#ffffff','stroke-width':2,'stroke-linecap':'round',opacity:0.85}));
  rot.appendChild(el('circle',{cx:-3.5,cy:-3.5,r:1.7,fill:'#fff',class:'mag-glint'}));
  bob.appendChild(rot); robot.appendChild(bob);
  viewport.appendChild(robot);
  robotRot=rot;
  if(editMode) robot.style.display='none';
  if(robotX!=null) robot.setAttribute('transform',`translate(${robotX},${robotY})`);
  robotRot.setAttribute('transform',`rotate(${robotAngle})`);

  svg.appendChild(viewport);
  applyTransform();
}

function applyTransform(){
  if(viewport) viewport.setAttribute('transform',`translate(${panX} ${panY}) scale(${zoom})`);
}
function clampZoom(z){ return Math.max(0.3, Math.min(4, z)); }
function zoomAt(sx, sy, newZoom){
  newZoom=clampZoom(newZoom);
  const cx=(sx-panX)/zoom, cy=(sy-panY)/zoom;
  zoom=newZoom;
  panX=sx-cx*zoom; panY=sy-cy*zoom;
  applyTransform();
}
function resetView(){ panX=0; panY=0; zoom=1; applyTransform(); }

function toViewBox(clientX, clientY){
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (ctm) {
    const svgP = pt.matrixTransform(ctm.inverse());
    return { x: svgP.x, y: svgP.y };
  }
  return { x: 0, y: 0 };
}

function buildDFS(){
  const wp=[]; const seen=new Set();
  (function go(n){
    wp.push({x:n.x,y:n.y,id:n.id,arrive:!seen.has(n.id)}); seen.add(n.id);
    if(n.children) n.children.forEach(c=>{ go(c); wp.push({x:n.x,y:n.y,id:n.id,arrive:false}); });
  })(tree);
  return wp;
}
function buildBFS(){
  const wp=[]; const q=[tree];
  while(q.length){ const n=q.shift(); wp.push({x:n.x,y:n.y,id:n.id,arrive:true});
    if(n.children) n.children.forEach(c=>q.push(c)); }
  return wp;
}

function resetState(){
  stopAnim(); segIdx=0; t=0; distance=0; order=[]; dwellUntil=0; robotAngle=180;
  waypoints = (algo==='dfs')?buildDFS():buildBFS();
  allNodes.forEach(n=>{ const c=nodeEls.get(n.id); if(c){c.setAttribute('stroke','#3e2819');c.setAttribute('stroke-width',2);} });
  edgeEls.forEach(e=>e.classList.remove('walked'));
  if(robot && waypoints.length){ const p=waypoints[0]; placeRobot(p.x,p.y); }
  $('playBtn').innerHTML=IC.play+'Iniciar'; delete $('playBtn').dataset.done;
  refreshPanel(); renderOrder();
}
function placeRobot(x,y){ robotX=x; robotY=y; if(robot) robot.setAttribute('transform',`translate(${x},${y})`); }

function markArrive(id){
  if(order.includes(id)) return;
  order.push(id);
  const c=nodeEls.get(id); if(c){c.setAttribute('stroke','var(--visited)');c.setAttribute('stroke-width',3);}
  renderOrder();
}
// orienta a lente para a direção do movimento (lente na frente, cabo atrás)
function faceToward(a,b){
  if(!robotRot || (a.x===b.x && a.y===b.y)) return;
  const target=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI + 180;
  let d=((target-robotAngle+540)%360)-180;
  robotAngle += d*0.3;
  robotRot.setAttribute('transform',`rotate(${robotAngle})`);
}
// efeitos ao chegar num nó
function ripple(x,y){
  const c=el('circle',{cx:x,cy:y,r:10,fill:'none',stroke:'var(--robot)','stroke-width':2.5,class:'ripple'});
  viewport.appendChild(c); setTimeout(()=>c.remove(),640);
}
function pulseNode(id){ const c=nodeEls.get(id); if(!c) return; c.classList.add('node-pop'); setTimeout(()=>c.classList.remove('node-pop'),440); }
function speechBubble(node){
  const leaf=!(node.children&&node.children.length);
  let txt=(leaf?'Catalogado: ':'')+(node.name||'');
  if(txt.length>34) txt=txt.slice(0,33)+'…';
  const fs=11, w=txt.length*6.1+16, h=21, bx=node.x+18, by=node.y-36;
  const g=el('g',{class:'speech'});
  g.appendChild(el('path',{d:`M ${bx+8} ${by+h-1} l -9 11 l 15 -10 z`,fill:'#fff',stroke:'var(--line)','stroke-width':1}));
  g.appendChild(el('rect',{x:bx,y:by,width:w,height:h,rx:6,fill:'#fff',stroke:'var(--line)','stroke-width':1.2}));
  const t=el('text',{x:bx+8,y:by+14.5,fill:'var(--ink)'}); t.setAttribute('font-size',fs); t.setAttribute('font-family','Georgia, serif'); t.textContent=txt;
  g.appendChild(t);
  viewport.appendChild(g); setTimeout(()=>g.remove(),1460);
}
function onArrive(wp){
  const n=allNodes.find(x=>x.id===wp.id); if(!n) return;
  ripple(n.x,n.y); pulseNode(n.id); speechBubble(n);
}
let silentStep=false; // true durante reconstrução (Voltar) ou pulo ao fim (Concluir): sem efeitos visuais
function stepSegment(){
  if(order.length===0 && waypoints[0] && waypoints[0].arrive){ markArrive(waypoints[0].id); if(!silentStep) onArrive(waypoints[0]); }
  if(segIdx>=waypoints.length-1) return;
  const a=waypoints[segIdx], b=waypoints[segIdx+1];
  distance += Math.hypot(b.x-a.x,b.y-a.y);
  if(algo==='dfs'){ edgeEls.get(b.id)?.classList.add('walked'); edgeEls.get(a.id)?.classList.add('walked'); }
  faceToward(a,b);
  placeRobot(b.x,b.y); if(b.arrive){ markArrive(b.id); if(!silentStep) onArrive(b); }
  segIdx++; t=0; refreshPanel();
}
// reconstrói o estado até ter dado exatamente `n` passos, sem efeitos
function replaySteps(n){
  stopAnim(); segIdx=0; t=0; distance=0; order=[]; dwellUntil=0; robotAngle=180;
  allNodes.forEach(nd=>{ const c=nodeEls.get(nd.id); if(c){c.setAttribute('stroke','#3e2819');c.setAttribute('stroke-width',2);} });
  edgeEls.forEach(e=>e.classList.remove('walked'));
  if(robot && waypoints.length){ const p=waypoints[0]; placeRobot(p.x,p.y); }
  silentStep=true;
  for(let i=0;i<n && segIdx<waypoints.length-1;i++) stepSegment();
  silentStep=false;
  delete $('playBtn').dataset.done; // não estamos mais no estado "Concluído"
  refreshPanel();
}
function stepBack(){
  stopAnim();
  if(segIdx<=0){ resetState(); return; }
  replaySteps(segIdx-1);
  $('playBtn').innerHTML = segIdx<=0 ? IC.play+'Iniciar' : 'Retomar Relato';
}
function finishWalk(){
  stopAnim();
  silentStep=true;
  while(segIdx<waypoints.length-1) stepSegment();
  silentStep=false;
  refreshPanel();
  $('playBtn').innerHTML=IC.check+'Concluído'; $('playBtn').dataset.done='1';
}
let raf=null,last=0;
function stopAnim(){ if(raf){ cancelAnimationFrame(raf); raf=null; } playing=false; }
function loop(ts){
  if(!playing) return;
  if(!last) last=ts;
  if(ts<dwellUntil){ last=ts; raf=requestAnimationFrame(loop); return; } // pausa de "inspeção"
  const dt=(ts-last)/1000; last=ts;
  const speed=+$('speed').value;
  if(order.length===0 && waypoints[0] && waypoints[0].arrive){ markArrive(waypoints[0].id); onArrive(waypoints[0]); }
  if(segIdx>=waypoints.length-1){ stopAnim(); $('playBtn').innerHTML=IC.check+'Concluído'; $('playBtn').dataset.done='1'; return; }
  const a=waypoints[segIdx], b=waypoints[segIdx+1];
  const segLen=Math.hypot(b.x-a.x,b.y-a.y)||1;
  faceToward(a,b);
  t += (speed*120*dt)/segLen;
  if(t>=1){
    distance+=segLen; placeRobot(b.x,b.y);
    if(algo==='dfs'){ edgeEls.get(b.id)?.classList.add('walked'); edgeEls.get(a.id)?.classList.add('walked'); }
    if(b.arrive){ markArrive(b.id); onArrive(b); dwellUntil=ts+300; }
    segIdx++; t=0;
  } else { const e=t*t*(3-2*t); placeRobot(a.x+(b.x-a.x)*e, a.y+(b.y-a.y)*e); }
  refreshPanel(); raf=requestAnimationFrame(loop);
}

function nodeName(id){ const n=allNodes.find(x=>x.id===id); return n?n.name:'—'; }
function refreshPanel(){
  const lastId = order.length?order[order.length-1]:null;
  $('curNode').textContent = lastId!==null?nodeName(lastId):'—';
  const box=$('photoBox'); const cur=lastId!==null?allNodes.find(n=>n.id===lastId):null;
  if(cur && cur.img){ $('curPhoto').src=cur.img; $('curPhotoCap').textContent=cur.sci||''; box.style.display='block'; }
  else box.style.display='none';
  $('visCount').textContent = `${order.length} / ${totalNodes}`;
  $('dist').textContent = Math.round(distance)+'';
  $('tNodes').textContent=totalNodes; $('tInt').textContent=internals;
  $('tLeaf').textContent=leaves; $('tEdges').textContent=totalEdges; $('tDepth').textContent=maxDepth;
}
function renderOrder(){
  const ol=$('orderList'); ol.innerHTML='';
  order.forEach((id,i)=>{
    const n=allNodes.find(x=>x.id===id); if(!n) return; const k=kind(n);
    const li=document.createElement('li');
    const badge = k==='root'?'<span class="badge b-root">raiz</span>'
                : k==='int'?'<span class="badge b-int">especiação</span>'
                : '<span class="badge b-leaf">espécie</span>';
    li.innerHTML=`<b>${n.name}</b>${badge}`;
    if(i===order.length-1) li.className='cur';
    ol.appendChild(li);
  });
}

function showInfo(n){
  const k=kind(n);
  const img=$('infoImg');
  if(n.img){ img.src=n.img; img.style.display='block'; } else img.style.display='none';
  $('infoName').textContent=n.name||'';
  const sci=$('infoSci'); sci.textContent=n.sci||''; sci.style.display=n.sci?'block':'none';
  const bd = k==='root'?['raiz','b-root'] : k==='int'?['especiação','b-int'] : ['espécie','b-leaf'];
  const badge=$('infoBadge'); badge.className='badge '+bd[1]; badge.textContent=bd[0];
  $('infoDesc').textContent = n.desc || 'Ausência de anotações.';
  // novidade evolutiva (sinapomorfia)
  const tr=$('infoTrait');
  if(n.trait){ tr.textContent='Novidade evolutiva neste ramo: '+n.trait; tr.style.display='block'; } else tr.style.display='none';
  // ano / autoria
  const ano=$('infoAno');
  if(n.ano){ ano.textContent='Descrita em: '+n.ano; ano.style.display='block'; } else ano.style.display='none';
  // idade / divergência
  const ag=$('infoAge');
  if(typeof n.age==='number' && n.age>0){ ag.textContent='Divergência estimada: ~'+n.age+' milhões de anos'; ag.style.display='block'; } else ag.style.display='none';
  // classificação taxonômica
  const tx=$('infoTax'); tx.innerHTML='';
  if(n.tax && Object.keys(n.tax).length){
    const t=document.createElement('div'); t.className='tax-title'; t.textContent='Classificação científica'; tx.appendChild(t);
    for(const [rank,val] of Object.entries(n.tax)){
      const row=document.createElement('div');
      const rk=document.createElement('span'); rk.className='tax-rank'; rk.textContent=rank+': ';
      const vl=document.createElement('span'); vl.className='tax-val'+(rank==='Espécie'?' sci':''); vl.textContent=val;
      row.appendChild(rk); row.appendChild(vl); tx.appendChild(row);
    }
    tx.style.display='block';
  } else tx.style.display='none';
  $('infoCard').style.display='block';
}
function closeInfo(){ const c=$('infoCard'); if(c) c.style.display='none'; }
function infoOpen(){ const c=$('infoCard'); return c && c.style.display!=='none'; }
// fecha o card e limpa destaques (usado pelo botão × e pela tecla Esc)
function closeInfoFull(returnFocus){
  const wasOpen=infoOpen();
  closeInfo(); locatedId=null; if(cladeHiId!=null){ cladeHiId=null; }
  if(!editMode && !playing) renderSVG();
  if(wasOpen && returnFocus){ const s=$('svg'); if(s) s.focus(); }
}
$('infoClose').addEventListener('click',()=>closeInfoFull(false));
// Esc fecha o card de informações (e devolve o foco à árvore)
window.addEventListener('keydown',e=>{
  if(e.key!=='Escape' || !infoOpen()) return;
  if(!$('tutorial').hidden) return;                 // o tutorial trata seu próprio Esc
  if(document.activeElement && document.activeElement.id==='searchInput') return; // na busca, Esc esconde sugestões
  e.preventDefault(); closeInfoFull(true);
});

// ---- recursos educacionais: clado, MRCA, tempo ----
function collectClade(node){ const out=[]; (function go(n){ out.push(n); if(n.children) n.children.forEach(go); })(node); return out; }
function ancestorsOf(node){ const a=[]; let c=node; while(c){ a.push(c); c=c.parent; } return a; }
function computeMRCA(a,b){ const setA=new Set(ancestorsOf(a).map(n=>n.id)); let c=b; while(c){ if(setA.has(c.id)) return c; c=c.parent; } return null; }
function pathUp(node,stop){ const p=[]; let c=node; while(c){ p.push(c); if(c===stop) break; c=c.parent; } return p; }

let _kbActivate=false; // nó acionado via teclado (Enter/Espaço)?
function onNodeClick(n){
  if(editMode){ selectNode(n.id); return; }
  if(mrcaMode){ pickMRCA(n); return; }
  locatedId=null;
  showInfo(n);
  cladeHiId = (n.children && n.children.length) ? n.id : null;
  if(!playing) renderSVG();
  // abriu via teclado: leva o foco para dentro do card (botão fechar), permitindo fechar com Enter/Espaço/Esc
  if(_kbActivate){ const b=$('infoClose'); if(b) b.focus(); }
}
function pickMRCA(n){
  stopAnim();
  if(mrcaPicks.includes(n.id)) mrcaPicks=mrcaPicks.filter(id=>id!==n.id);
  else { mrcaPicks.push(n.id); if(mrcaPicks.length>2) mrcaPicks.shift(); }
  mrcaResultId=null;
  if(mrcaPicks.length===2){
    const a=allNodes.find(x=>x.id===mrcaPicks[0]), b=allNodes.find(x=>x.id===mrcaPicks[1]);
    const m=(a&&b)?computeMRCA(a,b):null; mrcaResultId=m?m.id:null;
    if(m){ showInfo(m);
      $('infoName').textContent=m.name;
      $('infoDesc').textContent='Ancestral comum mais recente de “'+a.name+'” e “'+b.name+'”. '+(m.desc||'');
    }
  } else closeInfo();
  updateMrcaHint();
  renderSVG();
}
function updateMrcaHint(){
  const hb=$('hintBar'); if(!hb) return;
  if(!mrcaMode){ hb.style.display='none'; return; }
  hb.style.display='block';
  const names=mrcaPicks.map(id=>{ const n=allNodes.find(x=>x.id===id); return n?n.name:'?'; });
  if(mrcaPicks.length===0) hb.textContent='Modo Ancestral Comum: clique em duas espécies para ver o ancestral comum mais recente (ACR).';
  else if(mrcaPicks.length===1) hb.textContent='1ª seleção: '+names[0]+'. Agora clique na segunda espécie.';
  else hb.textContent='ACR de '+names[0]+' e '+names[1]+' destacado. Clique em outra espécie para recomeçar.';
}
function updateTimeBtn(){
  const btn=$('timeBtn'); if(!btn) return;
  btn.disabled=!hasFullAges;
  if(!hasFullAges && timeScale){ timeScale=false; btn.classList.remove('active'); }
}
function resetLearnState(){
  cladeHiId=null; mrcaMode=false; mrcaPicks=[]; mrcaResultId=null; locatedId=null;
  const mb=$('mrcaBtn'); if(mb) mb.classList.remove('active');
  const hb=$('hintBar'); if(hb) hb.style.display='none';
  const si=$('searchInput'); if(si) si.value='';
}

function sel(){ return allNodes.find(n=>n.id===selectedId); }
function selectNode(id){ selectedId=id; updateEditorForm(); renderSVG(); }

function updateEditorForm(){
  const n=sel();
  if(!n){ $('noSel').style.display='block'; $('editFields').style.display='none'; return; }
  $('noSel').style.display='none'; $('editFields').style.display='block';
  $('fName').value=n.name||'';
  $('fSci').value=n.sci||'';
  $('fAno').value=n.ano||'';
  $('fAge').value=(typeof n.age==='number')?n.age:'';
  $('fTrait').value=n.trait||'';
  $('fTax').value=taxToText(n.tax);
  $('fDesc').value=n.desc||'';
  $('fImg').value=(n.img && !n.img.startsWith('data:'))?n.img:'';
  const pv=$('editPreview');
  if(n.img){ pv.src=n.img; pv.style.display='block'; } else pv.style.display='none';
  $('delNode').disabled = !n.parent;
  $('addSibling').disabled = !n.parent;
}

function cosmetic(){ layout(); renderSVG(); saveLocal(); commitSoon(); }
function structural(){ layout(); renderSVG(); resetState(); saveLocal(); }

// ---- histórico: desfazer / refazer (modo Editar) ----
let undoStack=[], redoStack=[], lastState=JSON.stringify(serialize(tree)), _commitTimer=null;
function commit(){
  const cur=JSON.stringify(serialize(tree));
  if(cur===lastState) return;
  undoStack.push(lastState); if(undoStack.length>80) undoStack.shift();
  redoStack.length=0; lastState=cur; updateUndoButtons();
}
function commitSoon(){ clearTimeout(_commitTimer); _commitTimer=setTimeout(commit,700); }
function applyState(json){
  clearTimeout(_commitTimer);
  tree=JSON.parse(json);
  (function norm(n){ if(!n.children) n.children=[]; n.children.forEach(norm); })(tree);
  const keepSel=selectedId;
  layout(); renderSVG(); resetState();
  if(editMode){ selectNode(allNodes.find(x=>x.id===keepSel)?keepSel:tree.id); }
  saveLocal(); updateUndoButtons();
}
function undo(){ if(!undoStack.length) return; redoStack.push(lastState); lastState=undoStack.pop(); applyState(lastState); }
function redo(){ if(!redoStack.length) return; undoStack.push(lastState); lastState=redoStack.pop(); applyState(lastState); }
function updateUndoButtons(){
  const u=$('undoBtn'), r=$('redoBtn');
  if(u) u.disabled=!undoStack.length;
  if(r) r.disabled=!redoStack.length;
}

$('fName').addEventListener('input',()=>{ const n=sel(); if(n){ n.name=$('fName').value; cosmetic(); } });
$('fSci').addEventListener('input',()=>{ const n=sel(); if(n){ n.sci=$('fSci').value; cosmetic(); } });
$('fAno').addEventListener('input',()=>{ const n=sel(); if(n){ n.ano=$('fAno').value||undefined; saveLocal(); } });
$('fAge').addEventListener('input',()=>{ const n=sel(); if(n){ const v=parseFloat(($('fAge').value||'').replace(',','.')); n.age=isNaN(v)?undefined:v; cosmetic(); } });
$('fTrait').addEventListener('input',()=>{ const n=sel(); if(n){ n.trait=$('fTrait').value||undefined; cosmetic(); } });
$('fTax').addEventListener('input',()=>{ const n=sel(); if(n){ n.tax=parseTax($('fTax').value); saveLocal(); commitSoon(); } });
$('fDesc').addEventListener('input',()=>{ const n=sel(); if(n){ n.desc=$('fDesc').value||undefined; saveLocal(); commitSoon(); } });
$('fImg').addEventListener('input',()=>{ const n=sel(); if(n){ n.img=$('fImg').value||undefined; cosmetic();
  const pv=$('editPreview'); if(n.img){pv.src=n.img;pv.style.display='block';}else pv.style.display='none'; } });
$('fFile').addEventListener('change',e=>{
  const f=e.target.files[0]; if(!f) return;
  const reader=new FileReader();
  reader.onload=()=>{ const n=sel(); if(n){ n.img=reader.result; cosmetic();
    const pv=$('editPreview'); pv.src=reader.result; pv.style.display='block'; $('fImg').value=''; } };
  reader.readAsDataURL(f);
});
$('addChild').addEventListener('click',()=>{
  const n=sel(); if(!n) return;
  if(!n.children) n.children=[];
  const child={ name:'Novo', sci:'', children:[] };
  n.children.push(child);
  structural(); selectNode(child.id); commit();
});
$('addSibling').addEventListener('click',()=>{
  const n=sel(); if(!n || !n.parent) return;
  const p=n.parent;
  const sib={ name:'Novo', sci:'', children:[] };
  p.children.splice(p.children.indexOf(n)+1, 0, sib);
  structural(); selectNode(sib.id); commit();
});
$('delNode').addEventListener('click',()=>{
  const n=sel(); if(!n || !n.parent) return;
  const p=n.parent; p.children=p.children.filter(c=>c!==n);
  selectedId=null; structural(); selectNode(p.id); commit();
});
$('undoBtn').addEventListener('click',undo);
$('redoBtn').addEventListener('click',redo);
window.addEventListener('keydown',e=>{
  if(!editMode || !(e.ctrlKey||e.metaKey)) return;
  const tag=(document.activeElement&&document.activeElement.tagName)||'';
  if(tag==='INPUT'||tag==='TEXTAREA') return; // preserva o desfazer nativo dos campos de texto
  const k=e.key.toLowerCase();
  if(k==='z' && !e.shiftKey){ e.preventDefault(); undo(); }
  else if(k==='y' || (k==='z' && e.shiftKey)){ e.preventDefault(); redo(); }
});

$('newBtn').addEventListener('click',()=>{
  if(!confirm('Começar uma nova árvore?')) return;
  tree={ name:'Ancestral primordial', sci:'', children:[] }; selectedId=null; resetView(); structural();
  if(editMode && tree.id != null) selectNode(tree.id);
  commit();
});
$('exampleBtn').addEventListener('click',()=>{
  if(!confirm('Reescrever com Árvore Felidae?')) return;
  tree=clone(EXAMPLE); selectedId=null; resetView(); structural();
  if(editMode && tree.id != null) selectNode(tree.id);
  commit();
});
$('exportBtn').addEventListener('click',()=>{
  const data=JSON.stringify(serialize(tree),null,2);
  const blob=new Blob([data],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download='arvore_darwin.json';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
});
// valida a estrutura de uma árvore importada; retorna mensagem de erro amigável ou null
function validateTree(obj){
  if(obj===null || typeof obj!=='object' || Array.isArray(obj))
    return 'O arquivo não contém uma árvore válida (esperado um objeto com "name").';
  let count=0;
  function check(n, path){
    if(++count>20000) return 'Árvore grande demais (mais de 20000 nós).';
    if(n===null || typeof n!=='object' || Array.isArray(n))
      return 'Nó inválido em '+path+' (esperado um objeto).';
    if(typeof n.name!=='string' || !n.name.trim())
      return 'Há um nó sem nome ("name") em '+path+'.';
    if('age' in n && n.age!=null && typeof n.age!=='number')
      return 'O campo "age" deve ser um número (nó "'+n.name+'").';
    if('tax' in n && n.tax!=null && (typeof n.tax!=='object' || Array.isArray(n.tax)))
      return 'O campo "tax" deve ser um objeto (nó "'+n.name+'").';
    if('children' in n && n.children!=null){
      if(!Array.isArray(n.children)) return 'O campo "children" deve ser uma lista (nó "'+n.name+'").';
      for(let i=0;i<n.children.length;i++){
        const e=check(n.children[i], '"'+n.name+'" › filho '+(i+1));
        if(e) return e;
      }
    }
    return null;
  }
  return check(obj,'raiz');
}
function applyTree(obj){
  const err=validateTree(obj);
  if(err) throw new Error(err);
  (function norm(n){ if(!n.children) n.children=[]; n.children.forEach(norm); })(obj);
  tree=obj; selectedId=null; resetView(); resetLearnState(); structural();
  if(editMode && tree.id != null) selectNode(tree.id);
  saveLocal(); commit();
}
$('importBtn').addEventListener('click',()=>$('importFile').click());
$('importFile').addEventListener('change',e=>{
  const f=e.target.files[0]; if(!f) return;
  const reader=new FileReader();
  reader.onload=()=>{
    let obj;
    try{ obj=JSON.parse(reader.result); }
    catch(err){ alert('Não consegui ler o arquivo: ele não é um JSON válido.\n\nDetalhe técnico: '+err.message); e.target.value=''; return; }
    try{ applyTree(obj); }
    catch(err){ alert('O arquivo não é uma árvore válida.\n\n'+err.message); }
    e.target.value='';
  };
  reader.readAsText(f);
});
$('collectionSel').addEventListener('change',e=>{
  const v=e.target.value;
  if(v==='__felidae'){ applyTree(clone(EXAMPLE)); return; }
  fetch(encodeURI(v))
    .then(r=>{ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
    .then(obj=>applyTree(obj))
    .catch(err=>alert('Não foi possível carregar a coleção: '+err.message+
      '\n\nOs exemplos só funcionam com o site publicado (ex.: GitHub Pages) ou em um servidor local — não ao abrir o arquivo direto do disco (file://).'));
});

$('playBtn').addEventListener('click',()=>{
  if($('playBtn').dataset.done){ resetState(); return; } // limpa os caminhos vermelhos e volta para "Iniciar"
  if(playing){ stopAnim(); $('playBtn').innerHTML='Retomar'; return; }
  if(segIdx>=waypoints.length-1) resetState();
  playing=true; last=0; $('playBtn').innerHTML='Pausar';
  raf=requestAnimationFrame(loop);
});
$('stepBtn').addEventListener('click',()=>{ if($('playBtn').dataset.done) return; stopAnim(); $('playBtn').innerHTML='Retomar Relato'; stepSegment(); });
$('backBtn').addEventListener('click',stepBack);
$('finishBtn').addEventListener('click',finishWalk);
$('resetBtn').addEventListener('click',resetState);
document.querySelectorAll('#algoSeg button').forEach(b=>{
  b.addEventListener('click',()=>{ document.querySelectorAll('#algoSeg button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); algo=b.dataset.algo; resetState(); });
});

$('mrcaBtn').addEventListener('click',()=>{
  mrcaMode=!mrcaMode;
  $('mrcaBtn').classList.toggle('active',mrcaMode);
  mrcaPicks=[]; mrcaResultId=null; cladeHiId=null; closeInfo();
  updateMrcaHint();
  renderSVG();
});
$('traitBtn').addEventListener('click',()=>{
  showTraits=!showTraits; $('traitBtn').classList.toggle('active',showTraits); renderSVG();
});
$('timeBtn').addEventListener('click',()=>{
  if($('timeBtn').disabled) return;
  timeScale=!timeScale; $('timeBtn').classList.toggle('active',timeScale);
  cosmetic(); resetState();
});

// ---- busca de espécie com autocomplete ----
let searchEntries=[], suggestActive=-1;
function updateSearchList(){
  searchEntries=allNodes.map(n=>({id:n.id, name:n.name||'', sci:n.sci||'', leaf:!(n.children&&n.children.length)}));
}
function escHtml(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function centerOn(n, z){
  const r=svg.getBoundingClientRect();
  const s=Math.min(r.width/VBW, r.height/VBH) || 1;
  zoom=clampZoom(z || Math.max(zoom,1.3));
  panX = r.width/(2*s) - n.x*zoom;
  panY = r.height/(2*s) - n.y*zoom;
  applyTransform();
}
function locateById(id){
  const n=allNodes.find(x=>x.id===id); if(!n) return;
  locatedId=id; stopAnim(); centerOn(n); showInfo(n); renderSVG();
}
function clearLocate(){
  if(locatedId==null) return;
  locatedId=null; renderSVG();
}
function rankEntries(q){
  const test=(s,how)=>{ s=(s||'').toLowerCase(); return how==='start'?s.startsWith(q):s.includes(q); };
  const score=e=>{
    let sc=9;
    if(e.name.toLowerCase()===q||e.sci.toLowerCase()===q) sc=0;
    else if(test(e.name,'start')||test(e.sci,'start')) sc=1;
    else if(test(e.name)||test(e.sci)) sc=2;
    if(!e.leaf) sc+=0.5; // espécies aparecem antes de ancestrais
    return sc;
  };
  return searchEntries.map(e=>({e,sc:score(e)})).filter(o=>o.sc<3)
    .sort((a,b)=>a.sc-b.sc).slice(0,6).map(o=>o.e);
}
function renderSuggest(){
  const box=$('searchSuggest'); const q=($('searchInput').value||'').trim().toLowerCase();
  suggestActive=-1;
  if(!q){ box.classList.remove('show'); box.innerHTML=''; clearLocate(); return; }
  const list=rankEntries(q);
  if(!list.length){ box.classList.remove('show'); box.innerHTML=''; return; }
  box.innerHTML=list.map(e=>{
    const sci=(e.sci && e.sci!==e.name)?'<span class="sci">'+escHtml(e.sci)+'</span>':'';
    return '<div class="opt" data-id="'+e.id+'"><span class="nm">'+escHtml(e.name)+
      ' <span class="kind">· '+(e.leaf?'espécie':'ancestral')+'</span></span>'+sci+'</div>';
  }).join('');
  box.classList.add('show');
  box.querySelectorAll('.opt').forEach(o=>{
    o.addEventListener('mousedown',ev=>{ ev.preventDefault(); const id=+o.dataset.id;
      const nd=allNodes.find(x=>x.id===id); $('searchInput').value=nd?nd.name:''; hideSuggest(); locateById(id); });
  });
}
function hideSuggest(){ $('searchSuggest').classList.remove('show'); }
function doSearch(){
  const raw=($('searchInput').value||'').trim(); if(!raw) return;
  const list=rankEntries(raw.toLowerCase());
  if(list.length){ hideSuggest(); locateById(list[0].id); return; }
  const hb=$('hintBar'); hb.textContent='Não encontrei "'+raw+'" nesta árvore.'; hb.style.display='block';
  setTimeout(()=>{ if(!mrcaMode) hb.style.display='none'; },2500);
}
$('searchInput').addEventListener('input',renderSuggest);
$('searchInput').addEventListener('focus',renderSuggest);
$('searchInput').addEventListener('blur',()=>setTimeout(hideSuggest,150));
$('searchInput').addEventListener('keydown',e=>{
  const opts=[...$('searchSuggest').querySelectorAll('.opt')];
  if(e.key==='ArrowDown' && opts.length){ e.preventDefault(); suggestActive=(suggestActive+1)%opts.length; opts.forEach((o,i)=>o.classList.toggle('active',i===suggestActive)); opts[suggestActive].scrollIntoView({block:'nearest'}); }
  else if(e.key==='ArrowUp' && opts.length){ e.preventDefault(); suggestActive=(suggestActive-1+opts.length)%opts.length; opts.forEach((o,i)=>o.classList.toggle('active',i===suggestActive)); opts[suggestActive].scrollIntoView({block:'nearest'}); }
  else if(e.key==='Enter'){ e.preventDefault();
    if(suggestActive>=0 && opts[suggestActive]){ const id=+opts[suggestActive].dataset.id; const nd=allNodes.find(x=>x.id===id); $('searchInput').value=nd?nd.name:''; hideSuggest(); locateById(id); }
    else doSearch();
  }
  else if(e.key==='Escape'){ hideSuggest(); }
});

// ---- exportar a árvore como imagem ----
const EXPORT_CSS = "text{font-family:'Georgia','Times New Roman',serif;}"
 +".edge{stroke:var(--line);stroke-width:2;fill:none;stroke-linecap:round;}"
 +".edge.walked{stroke:var(--visited);stroke-width:4;}"
 +".node-label{font-size:14px;fill:var(--ink);font-weight:bold;}"
 +".node-sci{font-size:11px;font-style:italic;fill:var(--muted);}"
 +".int-label{font-size:10px;fill:var(--muted);}"
 +".clade-box{fill:var(--accent2);fill-opacity:0.07;stroke:var(--accent2);stroke-width:1.5;stroke-dasharray:6 4;}"
 +".clade-cap{font-size:12px;font-weight:bold;font-style:italic;fill:var(--accent2);}"
 +".trait-tag{font-size:10px;fill:#1c7293;font-style:italic;}"
 +".trait-mark{fill:#1c7293;stroke:#fff;stroke-width:1;}"
 +".mrca-path{stroke:var(--robot);stroke-width:5;fill:none;stroke-linecap:round;opacity:0.85;}"
 +".mrca-pick{fill:none;stroke:#1c7293;stroke-width:3;}"
 +".mrca-result{fill:none;stroke:var(--robot);stroke-width:3;}"
 +".mrca-cap{font-size:11px;font-weight:bold;fill:#8a5a00;}"
 +".axis-line{stroke:var(--line);stroke-width:1;}"
 +".axis-grid{stroke:var(--line);stroke-width:0.5;stroke-dasharray:3 5;opacity:0.5;}"
 +".axis-label{font-size:10px;fill:var(--muted);}"
 +".axis-title{font-size:11px;fill:var(--muted);font-style:italic;}"
 +".axis-band{fill:var(--line);}"
 +".age-tag{font-size:9px;fill:var(--accent2);font-style:italic;}"
 +".locate-ring{fill:none;stroke:var(--robot);stroke-width:3;stroke-dasharray:4 3;}";
const VARMAP={'var(--root)':'#8b0000','var(--internal)':'#556b2f','var(--leaf)':'#2f4f4f','var(--robot)':'#b8860b','var(--visited)':'#800000','var(--ink)':'#3e2819','var(--muted)':'#705335','var(--line)':'#8b6b4a','var(--accent2)':'#800000','var(--panel)':'#eaddcf'};
function triggerDownload(href,name){ const a=document.createElement('a'); a.href=href; a.download=name; document.body.appendChild(a); a.click(); a.remove(); }
function triggerDownloadBlob(blob,name){ const u=URL.createObjectURL(blob); triggerDownload(u,name); setTimeout(()=>URL.revokeObjectURL(u),1500); }
// tenta obter a foto como dataURL por vários caminhos (fetch, depois canvas)
function loadImgEl(src){ return new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src; }); }
async function imgToDataURL(href){
  if(!href) return null;
  if(href.startsWith('data:')) return href;
  const abs=new URL(href, location.href).href;
  // 1) fetch (funciona quando servido por http/https)
  try{
    const resp=await fetch(abs); const blob=await resp.blob();
    return await new Promise((res,rej)=>{ const fr=new FileReader(); fr.onload=()=>res(fr.result); fr.onerror=rej; fr.readAsDataURL(blob); });
  }catch(e){}
  // 2) desenha num canvas (funciona em mais cenários; falha se o canvas for "tainted")
  try{
    const el=await loadImgEl(abs);
    const c=document.createElement('canvas'); c.width=el.naturalWidth||el.width; c.height=el.naturalHeight||el.height;
    c.getContext('2d').drawImage(el,0,0);
    return c.toDataURL('image/png');
  }catch(e){}
  return null;
}
async function exportImage(){
  const clone=svg.cloneNode(true);
  clone.setAttribute('xmlns','http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
  clone.setAttribute('width',VBW); clone.setAttribute('height',VBH);
  clone.setAttribute('viewBox',`0 0 ${VBW} ${VBH}`);
  const vp=clone.querySelector('g'); if(vp) vp.setAttribute('transform','translate(0 0) scale(1)');
  const bg=document.createElementNS(NS,'rect'); bg.setAttribute('x',0);bg.setAttribute('y',0);bg.setAttribute('width',VBW);bg.setAttribute('height',VBH);bg.setAttribute('fill','var(--panel)');
  clone.insertBefore(bg, clone.firstChild);
  const st=document.createElementNS(NS,'style'); st.textContent=EXPORT_CSS; clone.insertBefore(st, clone.firstChild);
  // embute as imagens como dataURL para aparecerem no PNG
  const imgs=[...clone.querySelectorAll('image')];
  let allEmbedded=true, hadImages=imgs.length>0;
  await Promise.all(imgs.map(async im=>{
    const href=im.getAttribute('href')||im.getAttributeNS('http://www.w3.org/1999/xlink','href'); if(!href) return;
    const durl=await imgToDataURL(href);
    if(durl){ im.setAttribute('href',durl); im.setAttributeNS('http://www.w3.org/1999/xlink','href',durl); }
    else { // não deu para ler os bytes: usa caminho absoluto (vale para o fallback SVG)
      const abs=new URL(href, location.href).href;
      im.setAttribute('href',abs); im.setAttributeNS('http://www.w3.org/1999/xlink','href',abs);
      allEmbedded=false;
    }
  }));
  let xml=new XMLSerializer().serializeToString(clone);
  Object.entries(VARMAP).forEach(([k,v])=>{ xml=xml.split(k).join(v); });
  const svgBlob=new Blob([xml],{type:'image/svg+xml;charset=utf-8'});
  // se alguma foto não pôde ser embutida, o PNG sairia sem ela: exporta SVG (mostra as fotos ao abrir localmente)
  if(hadImages && !allEmbedded){
    triggerDownloadBlob(svgBlob,'arvore_filogenetica.svg');
    const local = (location.protocol==='file:');
    alert(local
      ? 'Você abriu o arquivo direto do computador (file://), e o navegador bloqueia a leitura das fotos para gerar o PNG.\n\nNo site publicado (GitHub Pages) o "Salvar imagem" gera o PNG com as fotos normalmente. Por enquanto exportei em SVG, que mostra as fotos ao abrir no navegador.'
      : 'Algumas fotos não puderam ser embutidas (possivelmente hospedadas em outro site). Exportei em SVG, que mostra as fotos ao abrir no navegador.');
    return;
  }
  const url=URL.createObjectURL(svgBlob);
  const img=new Image();
  img.onload=()=>{
    const scale=2, cv=document.createElement('canvas'); cv.width=VBW*scale; cv.height=VBH*scale;
    const ctx=cv.getContext('2d'); ctx.setTransform(scale,0,0,scale,0,0); ctx.drawImage(img,0,0);
    URL.revokeObjectURL(url);
    try{ triggerDownload(cv.toDataURL('image/png'),'arvore_filogenetica.png'); }
    catch(err){ triggerDownloadBlob(svgBlob,'arvore_filogenetica.svg');
      alert('Exportei em SVG (vetor), pois há fotos de outro site que impedem gerar o PNG. Em árvores com imagens locais o PNG funciona normalmente.'); }
  };
  img.onerror=()=>{ URL.revokeObjectURL(url); triggerDownloadBlob(svgBlob,'arvore_filogenetica.svg'); };
  img.src=url;
}
$('exportImgBtn').addEventListener('click',exportImage);

function setMode(m){
  editMode=(m==='edit'); stopAnim(); closeInfo(); resetLearnState();
  document.querySelectorAll('#modeSeg button').forEach(x=>x.classList.toggle('active',x.dataset.mode===m));
  $('exploreControls').style.display = editMode?'none':'flex';
  $('editControls').style.display    = editMode?'flex':'none';
  $('explorePanel').style.display    = editMode?'none':'block';
  $('editPanel').style.display       = editMode?'block':'none';
  layout(); renderSVG();
  if(editMode){ if(selectedId==null && allNodes[0]) selectedId=allNodes[0].id; selectNode(selectedId); }
  else resetState();
}
document.querySelectorAll('#modeSeg button').forEach(b=>{
  b.addEventListener('click',()=>setMode(b.dataset.mode));
});

const tip=$('tip');
function showTip(target){
  tip.textContent=target.dataset.tip; tip.classList.add('show');
  const r=target.getBoundingClientRect(), tr=tip.getBoundingClientRect();
  let left=r.left+r.width/2-tr.width/2;
  left=Math.max(8,Math.min(left,window.innerWidth-tr.width-8));
  const top=r.top-tr.height-12;
  tip.style.left=left+'px'; tip.style.top=(top<8?r.bottom+12:top)+'px';
}
document.querySelectorAll('[data-tip]').forEach(b=>{
  b.addEventListener('mouseenter',()=>showTip(b));
  b.addEventListener('mouseleave',()=>tip.classList.remove('show'));
});

$('zoomIn').addEventListener('click',()=>zoomAt(VBW/2,VBH/2, zoom*1.25));
$('zoomOut').addEventListener('click',()=>zoomAt(VBW/2,VBH/2, zoom*0.8));
$('zoomReset').addEventListener('click',resetView);
// tela cheia da área da árvore (útil no celular)
(function(){
  const st=document.querySelector('.stage'), btn=$('fullBtn');
  const canFull = st && (st.requestFullscreen||st.webkitRequestFullscreen);
  if(!canFull){ if(btn) btn.style.display='none'; return; }
  btn.addEventListener('click',()=>{
    const fs=document.fullscreenElement||document.webkitFullscreenElement;
    try{
      if(fs){ (document.exitFullscreen||document.webkitExitFullscreen).call(document); }
      else { (st.requestFullscreen||st.webkitRequestFullscreen).call(st); }
    }catch(e){}
  });
})();

svg.addEventListener('wheel',e=>{
  e.preventDefault();
  const p=toViewBox(e.clientX,e.clientY);
  zoomAt(p.x, p.y, zoom*(e.deltaY<0?1.12:0.89));
},{passive:false});

let dragging=false, dsx=0, dsy=0;
svg.addEventListener('mousedown',e=>{ 
  if(e.button !== 0) return;
  dragging=true; dsx=e.clientX; dsy=e.clientY; svg.classList.add('grabbing'); 
});
window.addEventListener('mousemove',e=>{
  if(!dragging) return;
  const dx=e.clientX-dsx, dy=e.clientY-dsy;
  // não fecha o card do Ancestral Comum nem o da espécie focada pela busca ao arrastar o canvas
  if(Math.abs(dx)+Math.abs(dy)>3 && !(mrcaMode && mrcaResultId!=null) && locatedId==null) closeInfo();
  
  const ctm = svg.getScreenCTM();
  if(ctm) {
    panX += dx / ctm.a;
    panY += dy / ctm.d;
  }
  
  dsx=e.clientX; dsy=e.clientY; applyTransform();
});
window.addEventListener('mouseup',()=>{ if(dragging){ dragging=false; svg.classList.remove('grabbing'); } });

// ---- suporte a toque (mobile): arrastar com 1 dedo, pinça (2 dedos) para zoom ----
let touchPan=false, tlx=0, tly=0, pinchDist=0;
const tDist=(a,b)=>Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY);
const tMid =(a,b)=>({x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2});
svg.addEventListener('touchstart',e=>{
  if(e.touches.length===1){ touchPan=true; tlx=e.touches[0].clientX; tly=e.touches[0].clientY; }
  else if(e.touches.length>=2){ touchPan=false; pinchDist=tDist(e.touches[0],e.touches[1]); }
},{passive:true});
svg.addEventListener('touchmove',e=>{
  if(e.touches.length===1 && touchPan){
    e.preventDefault();
    const x=e.touches[0].clientX, y=e.touches[0].clientY, dx=x-tlx, dy=y-tly;
    if(Math.abs(dx)+Math.abs(dy)>3 && !(mrcaMode && mrcaResultId!=null) && locatedId==null) closeInfo();
    const ctm=svg.getScreenCTM();
    if(ctm){ panX+=dx/ctm.a; panY+=dy/ctm.d; }
    tlx=x; tly=y; applyTransform();
  } else if(e.touches.length>=2){
    e.preventDefault();
    const d=tDist(e.touches[0],e.touches[1]);
    if(pinchDist>0){ const m=tMid(e.touches[0],e.touches[1]); const p=toViewBox(m.x,m.y); zoomAt(p.x,p.y, zoom*(d/pinchDist)); }
    pinchDist=d;
  }
},{passive:false});
svg.addEventListener('touchend',e=>{
  if(e.touches.length===0){ touchPan=false; pinchDist=0; }
  else if(e.touches.length===1){ touchPan=true; tlx=e.touches[0].clientX; tly=e.touches[0].clientY; pinchDist=0; }
},{passive:true});

// ---- menu "Mais" (mobile): mostra/esconde ferramentas extras ----
$('moreBtn').addEventListener('click',()=>{
  const m=$('moreTools'); const open=m.classList.toggle('show');
  $('moreBtn').setAttribute('aria-expanded', open?'true':'false');
});

// ---- tutorial de gestos (primeira visita) + botão de ajuda ----
const TUT_KEY='arvore_tutorial_visto_v1';
function showTutorial(){ $('tutorial').hidden=false; $('tutClose').focus(); }
function hideTutorial(){ $('tutorial').hidden=true; try{ localStorage.setItem(TUT_KEY,'1'); }catch(e){} }
$('tutClose').addEventListener('click',hideTutorial);
$('helpBtn').addEventListener('click',showTutorial);
$('tutorial').addEventListener('click',e=>{ if(e.target===$('tutorial')) hideTutorial(); });
window.addEventListener('keydown',e=>{ if(e.key==='Escape' && !$('tutorial').hidden) hideTutorial(); });
try{ if(!localStorage.getItem(TUT_KEY)) showTutorial(); }catch(e){/* localStorage indisponível */}

setMode('explore');
