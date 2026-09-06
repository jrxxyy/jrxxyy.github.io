console.log("OUTCOME.JS LOADED");

const FIELD={width:400,height:300,limitY:250,curveTop:28,padX:28};
const curveSquareState={t:0.42,raf:null};

const SECTORS={
 Q1:{fill:"#60a5fa88",solid:"#60a5fa",div:"sector-q1",x:1,y:1,word:"amplitude",prompt:'Would you like to replace one line of code with "amplitude"?'},
 Q2:{fill:"#34d39988",solid:"#34d399",div:"sector-q2",x:-1,y:1,word:"angular momentum",prompt:'Would you like to replace one line of code with "angular momentum"?'},
 Q3:{fill:"#f472b688",solid:"#f472b6",div:"sector-q3",x:-1,y:-1,word:"atom",prompt:'Would you like to replace one line of code with "atom"?'},
 Q4:{fill:"#fbbf2488",solid:"#fbbf24",div:"sector-q4",x:1,y:-1,word:"acceleration",prompt:'Would you like to replace one line of code with "acceleration"?'}
};
const sectorState={active:null,counts:{Q1:0,Q2:0,Q3:0,Q4:0}};

const TYPE_SETS={
 "1":{id:"type-set-1",label:"TYPE SET 1",href:"https://jrxxyy.github.io/index.html"},
 "2":{id:"type-set-2",label:"TYPE SET 2",href:"https://jrxxyy.github.io/beta.html"},
 "3":{id:"type-set-3",label:"TYPE SET 3",href:"https://jrxxyy.github.io/visa.html"}
};

const ServerTypes={
 circle:{
  dataType:"options",typeSet:"options",side:"server",
  items:["toExponential-time"],onClick:"toExponential-time",
  negotiator:{op:"N/C",meaning:"not a circle",side:"server",apply:i=>i%2===0}
 },
 triangle:{dataType:"commands",typeSet:"commands",side:"server",items:[],onClick:"pending"}
};
window.__SERVER_TYPES__=ServerTypes;

const SquareLiterals=[];
window.__SQUARE_LITERALS__=SquareLiterals;

/* SHAPE LINK SYSTEM */
const __OUTCOME_SHAPES__=[];
export function addOutcomeShape(type,x,y){__OUTCOME_SHAPES__.push({id:__OUTCOME_SHAPES__.length,type,x,y});}
function lastIndexOfType(a,t){return a.map(s=>s.type).lastIndexOf(t);}
function closestCircleTo(i,a){
 const o=a[i];let best=null,dist=1e9;
 a.forEach((s,j)=>{if(j===i||s.type!=="circle")return;
  const dx=s.x-o.x,dy=s.y-o.y,d=Math.sqrt(dx*dx+dy*dy);
  if(d<dist){dist=d;best={index:j,dist:d};}
 });
 return best;
}
function minimalLineBetween(p1,p2){
 return{ x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y,length:Math.sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2)};
}
export function computeCircleLink(){
 const s=__OUTCOME_SHAPES__,i=lastIndexOfType(s,"circle");
 if(i===-1)return null;
 const n=closestCircleTo(i,s);
 return n?minimalLineBetween(s[i],s[n.index]):null;
}
export function outcomeSvgLine(){
 const L=computeCircleLink();if(!L)return "";
 return `<line x1="${L.x1}" y1="${L.y1}" x2="${L.x2}" y2="${L.y2}" stroke="white" stroke-width="2"/>`;
}

/* HOST NODES */
function ensureHostNodes(){
 ["svg-area","radian-circle","eight-area","sector-chart","code-out","call-box","output"]
 .forEach(id=>{if(!document.getElementById(id))console.warn("Missing:",id);});
}
/* CURVE SYSTEM */
function gSvgX(y){
 const t=(FIELD.limitY-y)/(FIELD.limitY-FIELD.curveTop);
 const c=Math.max(0,Math.min(1,t));
 return FIELD.padX+30+c*c*(3-2*c)*240+Math.sin(c*Math.PI)*16;
}
function curvePathD(){
 let d="";for(let i=0;i<=20;i++){
  const y=FIELD.limitY-(i/20)*(FIELD.limitY-FIELD.curveTop);
  d+=(i===0?`M ${gSvgX(y)} ${y}`:` L ${gSvgX(y)} ${y}`);
 }
 return d;
}
function constrainedY(t,s){return t==="circle"?12+Math.random()*220:12+Math.random()*Math.max(8,FIELD.limitY-s-16);}
function curvePointAtT(t){
 const c=Math.max(0.06,Math.min(0.94,t));
 const y=FIELD.limitY-c*(FIELD.limitY-FIELD.curveTop);
 return{x:gSvgX(y)-16,y:y-16,t:c};
}
function targetTFromPlacements(p){
 if(!p.length)return 0.42;
 const span=FIELD.limitY-FIELD.curveTop;
 let h=0,crowd=0;
 p.forEach(pt=>{
  const mid=pt.y+16;
  h+=Math.max(0,Math.min(1,(FIELD.limitY-mid)/span));
  const gx=gSvgX(Math.max(FIELD.curveTop,Math.min(FIELD.limitY,mid)));
  const dx=(pt.x+16)-gx;
  if(Math.abs(dx)<70)crowd+=dx>=0?-0.04:0.04;
 });
 return Math.max(0.08,Math.min(0.92,h/p.length*0.75+0.12+crowd));
}
function slideSquareAlongCurve(el,a,b){
 if(curveSquareState.raf)cancelAnimationFrame(curveSquareState.raf);
 const start=performance.now(),dur=520;
 function frame(now){
  const u=Math.min(1,(now-start)/dur),e=u*u*(3-2*u),t=a+(b-a)*e,p=curvePointAtT(t);
  el.setAttribute("transform",`translate(${p.x},${p.y})`);
  curveSquareState.t=t;
  if(u<1)curveSquareState.raf=requestAnimationFrame(frame);
 }
 curveSquareState.raf=requestAnimationFrame(frame);
}

/* CLICK HANDLERS */
document.addEventListener("click",e=>{
 const t=e.target.closest("[data-action='select-type']");
 if(t){const n=t.getAttribute("data-type");const o=document.getElementById("output");
  if(o)o.textContent=`TYPE SET ${n} selected. Initializing protocol...`;
  initializeTypeProtocol(n);return;
 }
 const cloud=e.target.closest("[data-action='go-search']");
 if(cloud){window.open("https://www.mozilla.org/en-US/firefox/new/","_blank","noopener");return;}
 const pane=e.target.closest("[data-type-set]");
 if(pane&&pane.id.startsWith("type-set-")){
  const key=pane.getAttribute("data-type-set"),meta=TYPE_SETS[key],url=meta?.href||pane.getAttribute("data-href");
  if(url)window.location.href=url;
 }
});

function writeTrLine(t){
 const o=document.getElementById("output");if(!o)return;
 const lines=o.textContent.split("\n");let placed=false;
 for(let i=0;i<lines.length;i++){
  if(lines[i].startsWith("AI MODE:")){
   if(lines[i+1]?.startsWith("tr:"))lines[i+1]="tr: "+t;
   else lines.splice(i+1,0,"tr: "+t);
   placed=true;break;
  }
 }
 if(!placed)lines.push("tr: "+t);
 o.textContent=lines.join("\n");
}
function circleTimeExponential(){
 const h=new Date().getHours(),n=Number(h);n.toExponential();
 return n.toFixed(1)+"^1";
}
function handleSquareLiteralClick(slot){
 if(!window.confirm('Enter undefined/null instance for "" ?'))return;
 slot.value=null;slot.literal="";slot.undefinedNull=true;
 slot.el.setAttribute("data-literal","");slot.el.setAttribute("data-instance","undefined-null");
}
function handleServerTypeClick(kind){
 if(kind==="circle")writeTrLine(circleTimeExponential());
}

/* SHAPE GENERATION */
function analyzeSVGShapes(a){
 const sq=a.filter(s=>s.type==="square").length;
 return sq>5?{avoid:true,reason:"Page contains more than 5 squares."}:{avoid:false,reason:"Page is safe."};
}
function generateRandomShapes(n=5){
 const t=["square","circle","triangle","hexagon"];
 return Array.from({length:n},()=>({type:t[Math.floor(Math.random()*t.length)]}));
}
function generateTypeShapes(n){
 const map={"1":Math.PI/6,"2":Math.PI,"3":3*Math.PI/2},theta=map[n]||Math.PI/6,cos=Math.cos(theta);
 let s=cos>0.5?[{type:"circle"},{type:"circle"},{type:"square"}]:
        cos<-0.5?[{type:"square"},{type:"square"},{type:"triangle"}]:
                 [{type:"triangle"},{type:"triangle"},{type:"circle"}];
 return s.map(x=>({...x,theta,cosTheta:cos}));
}
function generateTriangleDifferentialShapes(){
 const r=["square","circle","triangle"];
 return Array.from({length:8},()=>({type:r[Math.floor(Math.random()*r.length)]}));
}
/* SVG RENDERER */
function drawSVGShapes(list){
 const svg=document.getElementById("svg-area");if(!svg)return;
 __OUTCOME_SHAPES__.length=0;
 svg.innerHTML="";
 const NS="http://www.w3.org/2000/svg";

 const limit=document.createElementNS(NS,"line");
 limit.setAttribute("x1","16");limit.setAttribute("x2","384");
 limit.setAttribute("y1",FIELD.limitY);limit.setAttribute("y2",FIELD.limitY);
 limit.setAttribute("stroke","#c9a227");limit.setAttribute("stroke-dasharray","6 4");
 svg.appendChild(limit);

 const curve=document.createElementNS(NS,"path");
 curve.setAttribute("d",curvePathD());curve.setAttribute("fill","none");
 curve.setAttribute("stroke","#2563eb");curve.setAttribute("stroke-width","2");
 svg.appendChild(curve);

 const placements=[],circleRecords=[];let firstSquare=null,firstSeen=false,cIndex=0;

 list.forEach(shape=>{
  let el=null,isLead=shape.type==="square"&&!firstSeen;

  if(shape.type==="square"){
   el=document.createElementNS(NS,"rect");
   el.setAttribute("width","32");el.setAttribute("height","32");
   el.setAttribute("fill",isLead?"#fb7185":"red");
   if(isLead){el.setAttribute("stroke","#111");el.setAttribute("stroke-width","2");}
   el.setAttribute("data-literal","");el.setAttribute("data-literal-kind","empty-string");
   el.style.cursor="pointer";
   const slot={el,literal:"",value:"",forSectors:["Q1","Q2","Q3","Q4"]};
   SquareLiterals.push(slot);
   el.addEventListener("click",ev=>{ev.stopPropagation();handleSquareLiteralClick(slot);});
  }

  else if(shape.type==="circle"){
   el=document.createElementNS(NS,"circle");
   const r=16;el.setAttribute("r",r);
   cIndex++;shape._circleIndex=cIndex;
   const nc=ServerTypes.circle.negotiator.apply(cIndex);
   shape._negotiated=!!nc;
   if(nc){
    el.setAttribute("fill","none");el.setAttribute("stroke","#000");
    el.setAttribute("stroke-width","2");el.setAttribute("data-negotiator","N/C");
   }else el.setAttribute("fill","blue");
   el.setAttribute("data-type","options");el.setAttribute("data-side","server");
   el.style.cursor="pointer";
   el.addEventListener("click",ev=>{ev.stopPropagation();handleServerTypeClick("circle");});

   const area=Math.PI*r*r;shape._area=area;
   shape._log2e=Math.log(area)*Math.LOG2E;
   shape._aboveLog10e=shape._log2e>Math.LOG10E;
   shape._primes=shape._aboveLog10e?[2,3,5,7,11]:[];
   shape._primesCorrect=shape._aboveLog10e;
   el.setAttribute("data-primes",shape._primes.join(","));
  }

  else if(shape.type==="triangle"){
   el=document.createElementNS(NS,"polygon");
   el.setAttribute("points","0,32 16,0 32,32");
   el.setAttribute("fill","green");
   el.style.cursor="pointer";
   el.addEventListener("click",ev=>{ev.stopPropagation();handleServerTypeClick("triangle");});
  }

  else if(shape.type==="hexagon"){
   el=document.createElementNS(NS,"polygon");
   el.setAttribute("points","16,0 32,8 32,24 16,32 0,24 0,8");
   el.setAttribute("fill","purple");
  }

  if(!el)return;

  if(isLead){
   firstSeen=true;firstSquare=el;
   const p=curvePointAtT(curveSquareState.t);
   el.setAttribute("transform",`translate(${p.x},${p.y})`);
  }else{
   const x=20+Math.random()*340,y=constrainedY(shape.type,32);
   el.setAttribute("transform",`translate(${x},${y})`);
   placements.push({x,y});
   addOutcomeShape(shape.type,x,y);
  }

  svg.appendChild(el);

  if(shape.type==="circle"){
   const tr=el.getAttribute("transform"),m=/translate\(([^,]+),([^)]+)\)/.exec(tr);
   const cx=parseFloat(m[1]),cy=parseFloat(m[2]);
   circleRecords.push({el,x:cx,y:cy,above:shape._aboveLog10e,index:shape._circleIndex});
   addOutcomeShape("circle",cx,cy);
  }
 });

 /* render link */
 const link=outcomeSvgLine();
 if(link){
  const temp=document.createElementNS(NS,"svg");
  temp.innerHTML=link;
  const L=temp.querySelector("line");
  if(L)svg.appendChild(L);
 }

 if(firstSquare)slideSquareAlongCurve(firstSquare,curveSquareState.t,targetTFromPlacements(placements));
}

/* AI ENGINE */
const AIState={mode:"PRIMI",energy:1,tension:0,lastTypeSet:null};
function countType(a,t){return a.filter(s=>s.type===t).length;}
function computeDifferential(a){
 return countType(a,"square")*0.4+countType(a,"triangle")*0.2-countType(a,"circle")*0.3;
}
function updateAIMode(t,n){
 AIState.lastTypeSet=n;AIState.tension=t;
 AIState.mode=t>1.5?"ANTI":t<-0.5?"ANTI-ANTI":"PRIMI";
 return AIState.mode;
}
function generateAIResponse(){
 return AIState.mode==="ANTI"?"AI MODE: ANTI — High tension detected. Defensive pattern activated.":
        AIState.mode==="ANTI-ANTI"?"AI MODE: ANTI-ANTI — Inversion mode. Reversal logic engaged.":
        "AI MODE: PRIMI — Stable, constructive, low-tension processing.";
}

/* TYPE PROTOCOL */
function updateRadianCircle(theta){
 const rc=document.getElementById("radian-circle");
 if(rc)rc.textContent=`θ = ${theta.toFixed(2)} (${Math.cos(theta).toFixed(2)}, ${Math.sin(theta).toFixed(2)})`;
}
function updateCallBox(n){
 const meta=TYPE_SETS[n]||TYPE_SETS["1"];
 const line=document.getElementById("call-box-line");
 const id=document.getElementById("call-box-id");
 if(line)line.textContent="calling "+meta.label;
 if(id)id.textContent=`div id = ${meta.id} → ${meta.href}`;
 for(let i=1;i<=3;i++){
  const slot=document.getElementById("type-set-"+i);
  if(!slot)continue;
  const on=String(i)===String(n);
  slot.setAttribute("data-call",on?"active":"idle");
  slot.style.borderStyle=on?"solid":"dashed";
  slot.style.background=on?"#e8f0ff":"#fff";
  slot.style.fontWeight=on?"700":"400";
 }
}
function initializeTypeProtocol(n){
 updateCallBox(n);
 const all=[...generateRandomShapes(5),...generateTypeShapes(n),...generateTriangleDifferentialShapes()];
 const result=analyzeSVGShapes(all);
 drawSVGShapes(all);
 const tension=computeDifferential(all);
 updateAIMode(tension,n);
 updateRadianCircle(all.find(s=>s.theta)?.theta||Math.PI/6);
 const o=document.getElementById("output");
 if(o)o.textContent=`${result.avoid?"AVOID PAGE: ":"PAGE OK: "}${result.reason}

TENSION: ${tension.toFixed(2)}
${generateAIResponse()}${sectorState.active?`\nACTIVE SECTOR: ${sectorState.active}`:""}`;
}

/* FIGURE-EIGHT + SECTORS */
function eightY(x){const v=x*x*(1-x*x);return v>0?Math.sqrt(v):0;}
function sectorPath(sx,sy,ox,oy,scale){
 let d=`M ${ox} ${oy}`,n=40;
 if(sy>0){
  for(let i=0;i<=n;i++){
   const x=sx*(i/n),y=sy*eightY(x);
   d+=` L ${ox+x*scale} ${oy-y*scale}`;
  }
  d+=` L ${ox+sx*scale} ${oy} Z`;
 }else{
  d+=` L ${ox+
