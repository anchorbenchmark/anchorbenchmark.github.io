'use strict';
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
document.body.classList.add('motion-ready');
// Published percentages: ANCHOR Supplementary Material, Table 3.
// Arc allocation is deliberately schematic so rare categories remain explorable.
const taxonomy = [
 {name:'Information Query',short:'Information query',share:69.26,color:'#d0f79a',arc:142,description:'Identify what is happening, who or what is present, where an event occurs, or which sound is heard. These questions connect factual answers to specific perceptual evidence.',domains:[['Movies, TV & Animation',28.26],['Pets & Animals',19.04],['Science & Knowledge',10.64],['Life & Practical Skills',7.00],['Humanities & Society',2.48],['Sports & Adventure',.87],['Social Trends & Reactions',.41],['Technology & Gaming',.33],['Business & Commerce',.25]]},
 {name:'Sports',short:'Sports',share:28.80,color:'#78d8d0',arc:45,description:'Interpret athletics, workouts, sports actions, and outdoor adventure. Follow motion over time and attend to the evidence that distinguishes an action.',domains:[['Sports & Adventure',28.80]]},
 {name:'Gaming',short:'Gaming',share:1.05,color:'#90b9fb',arc:34,description:'Understand video games, game entities, esports, and gameplay through evidence in the audio-visual stream.',domains:[['Technology & Gaming',1.05]]},
 {name:'Shopping',short:'Shopping',share:.33,color:'#b9a0ee',arc:32,description:'Answer questions about purchasing, products, brands, prices, stores, and commerce intent using visible and audible context.',domains:[['Business & Commerce',.33]]},
 {name:'Sentiment',short:'Sentiment',share:.22,color:'#f1a5c0',arc:39,description:'Interpret emotion, opinion, preferences, tone, and affect. Ground these judgments in what can be seen and heard.',domains:[['Social Trends & Reactions',.15],['Movies, TV & Animation',.05],['Pets & Animals',.01]]},
 {name:'Egocentric Agent',short:'Egocentric agent',share:.19,color:'#ffa47e',arc:34,description:'Understand first-person task execution, embodied action planning, and hands-on behavior, including what to do next.',domains:[['Life & Practical Skills',.18],['Technology & Gaming',.01]]},
 {name:'Social Interaction',short:'Social interaction',share:.15,color:'#ecd27e',arc:34,description:'Interpret interpersonal exchanges, social situations, and reactions through audio-visual evidence.',domains:[['Social Trends & Reactions',.14],['Life & Practical Skills',.01]]}
];
const domainDescriptions = {
 'Movies, TV & Animation':'Scene understanding across film, television, and animation: connect events and context to the question.',
 'Pets & Animals':'Animal-centered content that asks models to attend to visible behavior and relevant acoustic evidence.',
 'Science & Knowledge':'Knowledge-oriented content in which perceptual evidence helps support a factual answer.',
 'Life & Practical Skills':'Everyday and instructional activity: track objects, actions, and their order over time.',
 'Humanities & Society':'Social and cultural subject matter where answers must remain connected to the presented evidence.',
 'Sports & Adventure':'Athletic and outdoor activity, including actions whose meaning depends on temporal detail.',
 'Social Trends & Reactions':'Reaction-oriented content involving social context, behavior, and expressed affect.',
 'Technology & Gaming':'Technology and gameplay content requiring attention to entities and events on screen.',
 'Business & Commerce':'Products, commercial settings, and purchasing-related content.'
};
const ns='http://www.w3.org/2000/svg';
function svgEl(tag,attrs,text){const e=document.createElementNS(ns,tag);Object.entries(attrs||{}).forEach(([k,v])=>e.setAttribute(k,v));if(text!==undefined)e.textContent=text;return e;}
function point(r,a){const t=(a-90)*Math.PI/180;return [270+r*Math.cos(t),270+r*Math.sin(t)];}
function arcPath(inner,outer,start,end){const a=point(outer,start),b=point(outer,end),c=point(inner,end),d=point(inner,start),large=end-start>180?1:0;return `M${a} A${outer},${outer} 0 ${large} 1 ${b} L${c} A${inner},${inner} 0 ${large} 0 ${d} Z`;}
const chart=document.querySelector('#taxonomy-chart');
const svg=svgEl('svg',{viewBox:'0 0 540 540',role:'group','aria-label':'ANCHOR taxonomy: seven reasoning categories and their content domains. Use the category buttons for keyboard navigation.'});
const center=svgEl('g',{'aria-hidden':'true'});
center.append(svgEl('circle',{cx:270,cy:270,r:88,fill:'#ffffff',stroke:'#d6dde1'}));
center.append(svgEl('text',{x:270,y:261,'text-anchor':'middle',fill:'#1d2933','font-size':25,'font-family':'Manrope, Arial','font-weight':700,'letter-spacing':-1},'ANCHOR'));
center.append(svgEl('text',{x:270,y:286,'text-anchor':'middle',fill:'#66727d','font-size':10,'font-family':'Arial','letter-spacing':1.5},'7 WAYS TO REASON'));
svg.append(center);
let angle=-71;
taxonomy.forEach((cat,i)=>{
 const start=angle,end=angle+cat.arc;
 const group=svgEl('g',{'data-category':i});
 const inner=svgEl('path',{d:arcPath(97,175,start,end),fill:cat.color,class:'tax-segment','data-cat':i,'data-domain':'-1',role:'button',tabindex:-1,'aria-label':`${cat.name}, ${cat.share.toFixed(2)} percent of all QA pairs`});
 inner.addEventListener('pointerenter',()=>selectCategory(i));inner.addEventListener('click',()=>selectCategory(i));group.append(inner);
 const mid=(start+end)/2,pos=point(136,mid);let rotation=mid;if(mid>90&&mid<270)rotation+=180;
 if(cat.arc>30){const label=svgEl('text',{x:pos[0],y:pos[1],'text-anchor':'middle','dominant-baseline':'middle',class:'tax-label',transform:`rotate(${rotation} ${pos[0]} ${pos[1]})`});const words=cat.short.split(' ');if(words.length>1){label.append(svgEl('tspan',{x:pos[0],dy:-6},words[0]));label.append(svgEl('tspan',{x:pos[0],dy:14},words.slice(1).join(' ')));}else label.textContent=cat.short;group.append(label);}
 cat.domains.forEach((domain,j)=>{
  const s=start+cat.arc*j/cat.domains.length,e=start+cat.arc*(j+1)/cat.domains.length;
  const outer=svgEl('path',{d:arcPath(181,239,s,e),fill:cat.color,'fill-opacity':.55,class:'tax-segment','data-cat':i,'data-domain':j,role:'button',tabindex:-1,'aria-label':`${cat.name}: ${domain[0]}, ${domain[1].toFixed(2)} percent of all QA pairs`});
  outer.append(svgEl('title',{},`${domain[0]} · ${domain[1].toFixed(2)}% of all QA pairs`));
  outer.addEventListener('pointerenter',()=>selectCategory(i,j));outer.addEventListener('click',()=>selectCategory(i,j));group.append(outer);
  const pt=point(211,(s+e)/2);group.append(svgEl('text',{x:pt[0],y:pt[1],'text-anchor':'middle','dominant-baseline':'middle',fill:'#10151b','font-size':11,'font-family':'Arial','pointer-events':'none'},String(j+1).padStart(2,'0')));
 });
 svg.append(group);angle=end;
});
chart.append(svg);
const categoryButtons=document.querySelector('#category-buttons');
taxonomy.forEach((cat,i)=>{const button=document.createElement('button');button.type='button';button.textContent=cat.name;button.style.setProperty('--selected',cat.color);button.setAttribute('aria-pressed','false');button.addEventListener('focus',()=>selectCategory(i));button.addEventListener('click',()=>selectCategory(i));categoryButtons.append(button)});
let activeCat=-1,activeDomain=-1;
function selectCategory(i,domain=-1){
 if(activeCat===i&&activeDomain===domain)return;activeCat=i;activeDomain=domain;
 const cat=taxonomy[i],sub=domain>=0?cat.domains[domain]:null,info=document.querySelector('#taxonomy-info');
 document.querySelector('.taxonomy-detail').style.setProperty('--selected',cat.color);
 [...categoryButtons.children].forEach((b,k)=>b.setAttribute('aria-pressed',String(k===i)));
 svg.querySelectorAll('.tax-segment').forEach(p=>{const sameCategory=Number(p.dataset.cat)===i,selectedLevel=domain<0?Number(p.dataset.domain)===-1:Number(p.dataset.domain)===domain;p.classList.toggle('dim',!sameCategory);p.classList.toggle('active',sameCategory&&selectedLevel)});
 info.innerHTML=`<span class="detail-kicker">${sub?cat.name.toUpperCase()+' / CONTENT DOMAIN':'REASONING CATEGORY '+String(i+1).padStart(2,'0')}</span><h3 class="detail-title">${sub?sub[0]:cat.name}</h3><div class="detail-stat"><strong>${(sub?sub[1]:cat.share).toFixed(2)}<span style="font-size:.5em;color:inherit">%</span></strong><span>of all QA pairs${sub?'<br>in this category–domain pairing':''}</span></div><p class="detail-description">${sub?domainDescriptions[sub[0]]:cat.description}</p><div class="domain-heading"><span>${sub?'EXPLORE THIS CATEGORY':'CONTENT DOMAINS'}</span><span>SHARE OF ALL QA</span></div><div class="domain-list"></div>${sub?'<button type="button" class="domain-back">Return to '+cat.name+'</button>':''}`;
 cat.domains.forEach((d,j)=>{const b=document.createElement('button');b.type='button';b.className='domain-row';b.style.setProperty('--bar',`${d[1]/cat.share*100}%`);b.setAttribute('aria-pressed',String(j===domain));b.innerHTML=`<span>${String(j+1).padStart(2,'0')} &nbsp; ${d[0]}</span><span>${d[1].toFixed(2)}%</span>`;b.addEventListener('click',()=>{selectCategory(i,j);document.querySelectorAll('.domain-row')[j]?.focus({preventScroll:true})});info.querySelector('.domain-list').append(b)});
 info.querySelector('.domain-back')?.addEventListener('click',()=>{selectCategory(i);categoryButtons.children[i].focus({preventScroll:true})});
 if(!reducedMotion.matches){info.classList.remove('is-updating');void info.offsetWidth;info.classList.add('is-updating')}
}
selectCategory(0);
const frames=[
 {time:'00:29',title:'Prepares ingredients.',description:'The scene establishes the ingredients and tools. Context alone does not determine how much lime juice is actually used.'},
 {time:'00:37',title:'Squeezes lime.',description:'The preparation action is visible. An explanation still needs the correct temporal interval and the relevant spoken measurement.'},
 {time:'00:42',title:'Continues squeezing.',description:'The action continues. In the paper’s failure case, GPT-5.2 relies on this earlier interval and misses the later audio evidence.'},
 {time:'00:49',title:'Explains measurement.',description:'The spoken explanation provides crucial context. A generic visual description can still be insufficient to ground the amount.'},
 {time:'00:52',title:'Measures juice.',description:'The measuring cup makes the final measurement visible. The scene must be interpreted together with the spoken explanation.'}
];
function pulseEvidenceExample(){if(reducedMotion.matches)return;const example=document.querySelector('.example');example.classList.remove('evidence-refresh');void example.offsetWidth;example.classList.add('evidence-refresh')}
frames.forEach((f,i)=>{const b=document.createElement('button');b.type='button';b.textContent=f.time;b.setAttribute('aria-label',`${f.time}: ${f.title}`);b.setAttribute('aria-pressed',String(i===4));b.addEventListener('click',()=>{document.querySelector('#active-frame').src=`assets/frame-${i+1}.webp`;document.querySelector('#active-frame').alt=f.title;document.querySelector('#active-time').textContent=f.time;document.querySelector('#frame-title').textContent=f.title;document.querySelector('#frame-description').textContent=f.description;document.querySelectorAll('#frame-controls button').forEach((el,j)=>el.setAttribute('aria-pressed',String(i===j)));pulseEvidenceExample()});document.querySelector('#frame-controls').append(b)});
const ablations={
 gemini:{name:'Gemini-3-Flash',rows:[['Full cues',57.7,null],['Without audio',52.9,4.8],['Without bounding boxes',50.0,7.7],['Without audio + boxes',48.1,9.6],['Audio only',16.1,41.6]]},
 gpt:{name:'GPT-5.6-Luna',rows:[['Full cues',52.5,null],['Without audio',48.3,4.2],['Without bounding boxes',48.9,3.6],['Without audio + boxes',45.0,7.5],['Audio only',10.7,41.8]]},
 claude:{name:'Claude-Sonnet-5',rows:[['Full cues',52.6,null],['Without audio',47.0,5.5],['Without bounding boxes',49.4,3.2],['Without audio + boxes',45.1,7.5],['Audio only',14.2,38.4]]}
};
function restartAblationBars(){const wrapper=document.querySelector('.ablation-panel');if(reducedMotion.matches||!wrapper?.classList.contains('bars-visible'))return;wrapper.classList.remove('bars-visible');requestAnimationFrame(()=>requestAnimationFrame(()=>wrapper.classList.add('bars-visible')))}
function showAblation(key){
 const model=ablations[key],panel=document.querySelector('#ablation-bars');
 document.querySelector('#ablation-model-name').textContent=model.name;
 panel.setAttribute('aria-labelledby',`ablation-tab-${key}`);
 panel.innerHTML=model.rows.map(([label,value,drop])=>`<div class="bar-row"><div class="bar-label"><span>${label}</span><span><b>${value.toFixed(1)}%</b><small>${drop?'−'+drop.toFixed(1)+' pts':'reference'}</small></span></div><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:${value/60*100}%"></div></div></div>`).join('');
 document.querySelectorAll('[data-ablation]').forEach(button=>{const selected=button.dataset.ablation===key;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1});
 restartAblationBars();
}
document.querySelectorAll('[data-ablation]').forEach(button=>{button.addEventListener('click',()=>showAblation(button.dataset.ablation));button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const keys=Object.keys(ablations),current=keys.indexOf(button.dataset.ablation);const next=event.key==='Home'?0:event.key==='End'?keys.length-1:event.key==='ArrowRight'?(current+1)%keys.length:(current-1+keys.length)%keys.length;showAblation(keys[next]);document.querySelector(`#ablation-tab-${keys[next]}`).focus()})});showAblation('gemini');
// Arrays: model, answer, hallucination, conciseness, tokens, divergence.
const results={main:[['Qwen3-VL-30B-A3B-Instruct',3.45,1.79,3.40,287,2.50],['Qwen3-omni',3.34,2.03,3.90,291,2.65],['InternVL3.5',2.14,1.53,3.48,283,1.85],['Llava-OneVision',1.85,1.53,4.25,202,1.58],['GLM-4.6-V-Flash',3.29,1.94,2.50,309,2.46],['Kimi-VL-A3B-Instruct',3.05,1.93,2.83,336,2.31],['Nemotron-3-Nano-Omni-30B',3.37,2.21,3.69,206,2.59],['Gemini-3-Flash',3.83,2.20,4.47,203,2.93],['GPT-5.2',3.77,2.05,2.72,342,2.83],['Grok-4.1-Fast-Reasoning',3.39,1.48,1.30,644,2.39],['Claude-Sonnet-4.6',3.37,1.66,1.50,571,2.55],['Amazon Nova Lite',3.30,1.63,2.01,545,2.42]],human:[['Gemini-3.1-Pro',3.49,2.49,4.80,149,2.97],['Gemini-3-Flash',3.59,2.08,4.09,200,2.86],['Grok-4',3.01,1.61,1.40,736,2.50],['Grok-4.1-Fast-Reasoning',2.85,1.35,1.59,653,2.28],['Nova-2-Pro',2.93,1.96,3.62,243,2.48],['Nova-2-Lite',3.03,1.63,2.50,435,2.43]]};
function showResults(key){const data=results[key],cols=[1,2,5,3,4];document.querySelector('#results-body').innerHTML=data.map(row=>`<tr><td>${row[0]}</td>${cols.map(c=>`<td><span class="score ${row[c]===(c===4?Math.min:Math.max)(...data.map(d=>d[c]))?'best':''}">${c===4?row[c]:row[c].toFixed(2)}</span></td>`).join('')}</tr>`).join('');document.querySelectorAll('[data-results]').forEach(b=>{const selected=b.dataset.results===key;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1});document.querySelector('#results-panel').setAttribute('aria-labelledby',`tab-${key}`);document.querySelector('#results-caption').textContent=key==='main'?'Table 2: Main evaluation results':'Table 3: Human-refined evaluation results';document.querySelector('#results-note').textContent=key==='main'?'Source: latest manuscript, Table 2. Twelve models evaluated under truncated-video input settings.':'Source: latest manuscript, Table 3. Six closed-source models on the human-refined subset: 224 videos, 975 QA pairs.';}
document.querySelectorAll('[data-results]').forEach(b=>{b.addEventListener('click',()=>showResults(b.dataset.results));b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const key=e.key==='Home'?'main':e.key==='End'?'human':b.dataset.results==='main'?'human':'main';showResults(key);document.querySelector(`#tab-${key}`).focus()}})});showResults('main');

document.querySelector('#copy-citation').addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText(document.querySelector('#bibtex').textContent);status.textContent='Copied.';}catch{status.textContent='Select the citation below to copy it.';const selection=window.getSelection(),range=document.createRange();range.selectNodeContents(document.querySelector('#bibtex'));selection.removeAllRanges();selection.addRange(range)}});

function initMotion(){
 const revealTargets=[...document.querySelectorAll('.taxonomy.section,.examples-showcase.section,.grounding.section,.findings.section,.method.section,.resources,footer')];
 revealTargets.forEach(target=>target.classList.add('reveal-section'));
 const bars=document.querySelector('.ablation-panel');
 if(reducedMotion.matches||!('IntersectionObserver' in window)){
  revealTargets.forEach(target=>target.classList.add('is-visible'));
  bars?.classList.add('bars-visible');
  document.body.classList.add('motion-live');
  return;
 }
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}),{threshold:.08,rootMargin:'0px 0px -8%'});
 revealTargets.forEach(target=>revealObserver.observe(target));
 if(bars){const barsObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;bars.classList.add('bars-visible');barsObserver.disconnect()}),{threshold:.35});barsObserver.observe(bars)}
 requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.add('motion-live')));
}
function initAcronymReplay(){
 const title=document.querySelector('.paper-title'),letters=[...document.querySelectorAll('.paper-title .acronym-letter')];
 if(!title||!letters.length||!Element.prototype.animate)return;
 title.addEventListener('pointerenter',()=>{
  if(reducedMotion.matches)return;
  letters.forEach((letter,index)=>{
   letter.getAnimations?.().forEach(animation=>animation.cancel());
   letter.animate([
    {transform:'translateY(0)',color:'#c41230',textShadow:'none'},
    {offset:.45,transform:'translateY(-4px)',color:'#e0536b',textShadow:'0 0 18px rgba(196,18,48,.22)'},
    {transform:'translateY(0)',color:'#c41230',textShadow:'none'}
   ],{duration:620,delay:index*90,easing:'cubic-bezier(.2,.8,.25,1)'});
  });
 });
}
initMotion();
initAcronymReplay();

function initExampleGallery(){
 const examples=window.ANCHOR_EXAMPLES||[],grid=document.querySelector('#dataset-grid');
 if(!examples.length||!grid)return;
 const inspector=document.querySelector('#dataset-inspector'),video=document.querySelector('#example-video'),boxLayer=document.querySelector('#inspector-box-layer'),qaTabs=document.querySelector('#example-qa-tabs'),qaPanel=document.querySelector('#example-qa-panel');
 const indexLabel=document.querySelector('#example-index'),metaLabel=document.querySelector('#example-meta'),questionLabel=document.querySelector('#example-question'),answerLabel=document.querySelector('#example-answer'),reasoningLabel=document.querySelector('#example-reasoning'),boxLabels=document.querySelector('#inspector-box-labels'),soundToggle=document.querySelector('#example-sound-toggle'),soundLabel=document.querySelector('#example-sound-label'),playbackTime=document.querySelector('#example-playback-time');
 const svgNS='http://www.w3.org/2000/svg';
 const prepared=examples.map(example=>({...example,frameKeys:Object.keys(example.boxes).map(Number).sort((a,b)=>a-b)}));
 let activeIndex=-1,activeQa=0,loadToken=0,soundEnabled=false,stopInspectorBoxes=()=>{},stopTileBoxes=()=>{};

 function nearestFrame(keys,target){
  if(!keys.length)return null;
  let lo=0,hi=keys.length-1;
  while(lo<hi){const mid=Math.floor((lo+hi)/2);if(keys[mid]<target)lo=mid+1;else hi=mid}
  if(lo===0)return keys[0];
  return Math.abs(keys[lo]-target)<Math.abs(keys[lo-1]-target)?keys[lo]:keys[lo-1];
 }
 function drawBoxes(svg,example,time,onLabels){
  svg.replaceChildren();svg.setAttribute('viewBox',`0 0 ${example.width} ${example.height}`);
  if(!example.frameKeys.length){onLabels?.([]);return}
  const annotationRate=Number(example.boxFps)||10,target=time*annotationRate,frame=nearestFrame(example.frameKeys,target),isNearby=frame!==null&&Math.abs(frame-target)<=1.5,items=isNearby?(example.boxes[String(frame)]||[]):[],labels=[];
  items.forEach(item=>{
   const rect=document.createElementNS(svgNS,'rect');
   rect.setAttribute('x',Math.max(0,Number(item.x)||0));rect.setAttribute('y',Math.max(0,Number(item.y)||0));rect.setAttribute('width',Math.max(0,Number(item.width)||0));rect.setAttribute('height',Math.max(0,Number(item.height)||0));rect.setAttribute('rx',Math.max(2,example.width/320));svg.append(rect);
   if(item.labelId&&!labels.includes(String(item.labelId)))labels.push(String(item.labelId));
  });
  onLabels?.(labels);
 }
 function followBoxes(targetVideo,svg,example,onLabels){
  let stopped=false,handle=0;
  const render=()=>drawBoxes(svg,example,targetVideo.currentTime||0,onLabels);
  const tick=()=>{if(stopped)return;render();handle='requestVideoFrameCallback' in targetVideo?targetVideo.requestVideoFrameCallback(tick):requestAnimationFrame(tick)};
  const sync=()=>render();
  targetVideo.addEventListener('loadedmetadata',sync);targetVideo.addEventListener('seeking',sync);tick();
  return ()=>{stopped=true;targetVideo.removeEventListener('loadedmetadata',sync);targetVideo.removeEventListener('seeking',sync);if('cancelVideoFrameCallback' in targetVideo)targetVideo.cancelVideoFrameCallback(handle);else cancelAnimationFrame(handle)};
 }
 function cleanReasoning(text){
  return String(text||'No reasoning trace is available for this example.').replace(/\*\*/g,'').replace(/^Here(?:’|')s[^\n]*\n+/i,'').replace(/^---$/gm,'').replace(/\n{3,}/g,'\n\n').trim();
 }
 function formatCount(n,singular,plural=`${singular}S`){return `${n} ${n===1?singular:plural}`}
 function formatTime(seconds){const safe=Math.max(0,Number(seconds)||0),minutes=Math.floor(safe/60),remainder=(safe%60).toFixed(1).padStart(4,'0');return `${String(minutes).padStart(2,'0')}:${remainder}`}
 function updatePlaybackTime(){const example=prepared[activeIndex];playbackTime.textContent=`${formatTime(video.currentTime)} / ${formatTime(example?.duration||video.duration)}`}
 function updateSoundControl(){video.muted=!soundEnabled;soundToggle.setAttribute('aria-pressed',String(soundEnabled));soundLabel.textContent=soundEnabled?'Mute video':'Unmute video';soundToggle.setAttribute('aria-label',soundEnabled?'Mute selected video':'Unmute selected video')}
 function setQa(qaIndex,seek=true){
  const example=prepared[activeIndex],qa=example.qas[qaIndex]||example.qas[0];if(!qa)return;
  activeQa=qaIndex;
  [...qaTabs.children].forEach((button,i)=>{const selected=i===qaIndex;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1});
  questionLabel.textContent=qa.question;answerLabel.textContent=qa.answer;reasoningLabel.textContent=cleanReasoning(qa.reasoning);
  qaPanel.setAttribute('aria-labelledby',`example-qa-${activeIndex}-${qaIndex}`);
  if(seek&&video.readyState>=1){video.currentTime=Math.min(Math.max(0,qa.start||0),Math.max(0,example.duration-.05));if(!reducedMotion.matches)video.play().catch(()=>{})}
 }
 function buildQaTabs(example){
  qaTabs.replaceChildren();
  example.qas.forEach((qa,i)=>{const button=document.createElement('button');button.type='button';button.id=`example-qa-${activeIndex}-${i}`;button.setAttribute('role','tab');button.textContent=`QA ${String(i+1).padStart(2,'0')}`;button.setAttribute('aria-controls','example-qa-panel');button.addEventListener('click',()=>setQa(i));button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const count=example.qas.length,next=event.key==='Home'?0:event.key==='End'?count-1:event.key==='ArrowRight'?(i+1)%count:(i-1+count)%count;setQa(next);qaTabs.children[next].focus()});qaTabs.append(button)});
 }
 function activate(index,autoplay=true){
  if(index===activeIndex){if(autoplay&&!reducedMotion.matches)video.play().catch(()=>{});return}
  const example=prepared[index],token=++loadToken;activeIndex=index;activeQa=0;
  document.querySelectorAll('.dataset-tile').forEach((tile,i)=>{tile.classList.toggle('is-active',i===index);tile.setAttribute('aria-pressed',String(i===index))});
  indexLabel.textContent=`EXAMPLE ${String(index+1).padStart(2,'0')} / ${examples.length}`;
  metaLabel.textContent=`${formatCount(example.qas.length,'QA','QA')} · ${formatCount(example.boxCount,'BOX','BOXES')}`;
  buildQaTabs(example);setQa(0,false);
  stopInspectorBoxes();boxLayer.replaceChildren();boxLabels.textContent='BOXES ON';
  video.pause();video.muted=!soundEnabled;video.poster=example.poster;video.src=example.video;video.load();playbackTime.textContent=`00:00.0 / ${formatTime(example.duration)}`;
  stopInspectorBoxes=followBoxes(video,boxLayer,example,labels=>{boxLabels.textContent=labels.length?labels.join(' · '):'BETWEEN BOXES'});
  const start=()=>{if(token!==loadToken)return;const qa=example.qas[0];video.currentTime=Math.min(Math.max(0,qa?.start||0),Math.max(0,example.duration-.05));if(autoplay&&!reducedMotion.matches)video.play().catch(()=>{})};
  if(video.readyState>=1)start();else video.addEventListener('loadedmetadata',start,{once:true});
 }
 function stopTile(tile,tileVideo,svg){
  stopTileBoxes();stopTileBoxes=()=>{};tile.classList.remove('is-playing');tileVideo.pause();tileVideo.removeAttribute('src');tileVideo.load();svg.replaceChildren();
 }
 prepared.forEach((example,index)=>{
  const tile=document.createElement('button');tile.type='button';tile.className='dataset-tile';tile.setAttribute('aria-pressed','false');tile.setAttribute('aria-label',`Example ${index+1}: ${example.qas[0]?.question||'dataset video'}`);
  const media=document.createElement('span');media.className='tile-media';
  const poster=document.createElement('img');poster.src=example.poster;poster.alt='';poster.loading='lazy';poster.decoding='async';
  const tileVideo=document.createElement('video');tileVideo.muted=true;tileVideo.loop=true;tileVideo.playsInline=true;tileVideo.preload='none';
  const svg=document.createElementNS(svgNS,'svg');svg.setAttribute('class','box-layer tile-box-layer');svg.setAttribute('preserveAspectRatio','xMidYMid meet');svg.setAttribute('aria-hidden','true');
  const state=document.createElement('span');state.className='tile-state';state.textContent='PLAYING · BOXES';media.append(poster,tileVideo,svg,state);
  const copy=document.createElement('span');copy.className='tile-copy';const meta=document.createElement('span');meta.className='tile-meta';const left=document.createElement('span');left.textContent=`EXAMPLE ${String(index+1).padStart(2,'0')}`;const right=document.createElement('span');right.textContent=formatCount(example.qas.length,'QA','QA');meta.append(left,right);const question=document.createElement('span');question.className='tile-question';question.textContent=example.qas[0]?.question||'Dataset example';copy.append(meta,question);tile.append(media,copy);
  const playTile=()=>{activate(index,true);if(reducedMotion.matches)return;stopTileBoxes();tileVideo.src=example.video;tileVideo.load();tile.classList.add('is-playing');stopTileBoxes=followBoxes(tileVideo,svg,example);tileVideo.play().catch(()=>{})};
  tile.addEventListener('pointerenter',playTile);tile.addEventListener('pointerleave',()=>stopTile(tile,tileVideo,svg));tile.addEventListener('focus',playTile);tile.addEventListener('blur',()=>stopTile(tile,tileVideo,svg));tile.addEventListener('click',()=>{activate(index,true);if(matchMedia('(max-width:860px)').matches)inspector.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'})});grid.append(tile);
 });
 soundToggle.addEventListener('click',()=>{soundEnabled=!soundEnabled;updateSoundControl();if(video.paused)video.play().catch(()=>{})});
 video.addEventListener('loadedmetadata',updatePlaybackTime);
 video.addEventListener('timeupdate',()=>{updatePlaybackTime();const example=prepared[activeIndex],qa=example?.qas[activeQa];if(!qa||video.paused)return;const start=Math.max(0,qa.start||0),end=Math.min(example.duration,qa.end||example.duration);if(end>start&&video.currentTime>=end-.04){video.currentTime=start;video.play().catch(()=>{})}});
 updateSoundControl();
 activate(0,true);
}
initExampleGallery();
