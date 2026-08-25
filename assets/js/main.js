/* iNSIDERS Games public site — static GitHub Pages renderer. */
(()=>{
  'use strict';
  const D=window.INSIDERS_DATA||{studio:{},games:[],articles:[],pages:[]};
  const S=D.studio||{};
  const L=S.labels||{};
  const P=S.pages||{};
  const $=(s,c=document)=>c.querySelector(s);
  const $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const depth=document.body.dataset.depth==='1';
  const page=document.body.dataset.page||'';
  const gameId=document.body.dataset.game||document.body.dataset.publisherGame||'';
  const game=(D.games||[]).find(g=>g.id===gameId);
  const currentFile=location.pathname.split('/').pop()||'index.html';
  const isExternal=v=>/^(https?:|mailto:|tel:|#)/i.test(String(v||''));
  const path=p=>!p?'':(isExternal(p)?String(p):(depth?'../':'')+String(p).replace(/^\.\//,''));
  const absolute=p=>{try{return new URL(path(p),location.href).href}catch{return path(p)}};
  const set=(sel,val)=>{const e=$(sel);if(e)e.textContent=val??''};
  const setHtml=(sel,val)=>{const e=$(sel);if(e)e.innerHTML=val||''};
  const val=(v,fallback='')=>(v===undefined||v===null)?fallback:v;
  const visibleGames=()=>(D.games||[]).filter(g=>g.visible!==false);
  const plain=(v='')=>{const d=document.createElement('div');d.innerHTML=String(v).replace(/<br\s*\/?\s*>/gi,' ').replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi,'</$1> ');return (d.textContent||'').replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim()};
  const contrastInk=(color)=>{const m=String(color||'').trim().match(/^#([0-9a-f]{6})$/i);if(!m)return'#050505';const n=parseInt(m[1],16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;const cv=x=>{x/=255;return x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4)};const lum=.2126*cv(r)+.7152*cv(g)+.0722*cv(b);return lum>.38?'#050505':'#ffffff'};

  const fontUrl=name=>'https://fonts.googleapis.com/css2?family='+encodeURIComponent(name).replace(/%20/g,'+')+':wght@400;500;600;700;800&display=swap';
  const installFont=(name,id)=>{if(!name||S.loadExternalFonts===false||document.getElementById(id))return;const l=document.createElement('link');l.rel='stylesheet';l.href=fontUrl(name);l.id=id;document.head.append(l)};
  installFont(S.fontDisplay||'Oxanium','insiders-display-font');
  installFont(S.fontBody||'Space Grotesk','insiders-body-font');
  document.documentElement.style.setProperty('--font-display',`"${S.fontDisplay||'Oxanium'}",sans-serif`);
  document.documentElement.style.setProperty('--font-body',`"${S.fontBody||'Space Grotesk'}",sans-serif`);
  document.documentElement.style.setProperty('--max',`${Number(S.siteMaxWidth)||1240}px`);
  document.documentElement.style.setProperty('--site-pad',`${Math.max(12,Number(S.sitePadding)||24)}px`);
  document.documentElement.style.setProperty('--card-min',`${Math.max(240,Number(S.cardMinWidth)||300)}px`);
  if(S.globalAccent){document.documentElement.style.setProperty('--accent',S.globalAccent);document.documentElement.style.setProperty('--accent-ink',contrastInk(S.globalAccent))}
  if(S.globalBackground)document.documentElement.style.setProperty('--bg',S.globalBackground);
  if(S.globalPanel)document.documentElement.style.setProperty('--panel-user',S.globalPanel);
  if(S.globalText)document.documentElement.style.setProperty('--text',S.globalText);
  const studioArt=S.heroMedia||S.heroImage||'';
  if(studioArt)document.documentElement.style.setProperty('--page-art',`url("${absolute(studioArt)}")`);

  function setMeta(name,content,property=false){if(!content)return;const selector=property?`meta[property="${name}"]`:`meta[name="${name}"]`;let m=$(selector);if(!m){m=document.createElement('meta');m.setAttribute(property?'property':'name',name);document.head.append(m)}m.content=plain(content)}
  function socialMeta(title,description,image=''){setMeta('description',description);setMeta('og:title',title,true);setMeta('og:description',description,true);setMeta('twitter:card','summary_large_image');if(image){setMeta('og:image',image,true);setMeta('twitter:image',image)}}
  if(S.favicon){let f=$('link[rel~="icon"]');if(!f){f=document.createElement('link');f.rel='icon';document.head.append(f)}f.href=path(S.favicon)}

  function rich(v=''){
    const t=document.createElement('template');t.innerHTML=String(v||'');
    const allowed=new Set(['B','STRONG','I','EM','U','S','STRIKE','P','DIV','BR','UL','OL','LI','H2','H3','BLOCKQUOTE','A','IFRAME','SMALL','SPAN']);
    const safeFrame=src=>{try{const u=new URL(src,location.href);return u.protocol==='https:'&&(/(^|\.)itch\.io$/i.test(u.hostname)||/(^|\.)youtube(-nocookie)?\.com$/i.test(u.hostname)||u.hostname==='player.vimeo.com'||/(^|\.)humblebundle\.com$/i.test(u.hostname)||/(^|\.)gog\.com$/i.test(u.hostname))}catch{return false}};
    const walk=n=>{[...n.children].forEach(el=>{
      if(!allowed.has(el.tagName)){el.replaceWith(...el.childNodes);return}
      if(el.tagName==='IFRAME'){
        if(!safeFrame(el.getAttribute('src')||'')){el.remove();return}
        const keep=new Set(['src','width','height','title','allow','allowfullscreen','loading','frameborder','scrolling']);for(const a of [...el.attributes])if(!keep.has(a.name.toLowerCase()))el.removeAttribute(a.name);el.loading='lazy';
      }else for(const a of [...el.attributes]){
        if(el.tagName==='A'&&a.name==='href'){if(!/^(https?:|mailto:|#|\/)/i.test(a.value))el.removeAttribute(a.name)}
        else if(a.name==='style'&&/^(P|DIV|H2|H3|BLOCKQUOTE|SPAN)$/.test(el.tagName)){const m=a.value.match(/text-align\s*:\s*(left|center|right|justify)/i);if(m)el.setAttribute('style','text-align:'+m[1].toLowerCase());else el.removeAttribute('style')}
        else el.removeAttribute(a.name)
      }
      if(el.tagName==='A'){el.rel='noopener';if(/^https?:/i.test(el.getAttribute('href')||''))el.target='_blank'}
      walk(el);
    })};walk(t.content);return t.innerHTML;
  }

  const revealObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.06}):null;
  function reveal(c=document){$$('.reveal',c).forEach(x=>revealObserver?revealObserver.observe(x):x.classList.add('visible'))}

  function isActive(url=''){
    const clean=String(url).split('#')[0].split('?')[0].replace(/^\.\.\//,'').replace(/^\.\//,'');
    if(page==='publisher-assets'&&clean==='press.html')return true;
    if(currentFile===clean)return true;
    if(gameId&&page!=='publisher-assets'&&clean==='games.html')return true;
    return false;
  }
  function renderShell(){
    $$('[data-year]').forEach(x=>x.textContent=new Date().getFullYear());
    $$('.skip').forEach(x=>x.textContent=val(L.skipToContent,'Skip to content'));
    $$('.menu-toggle').forEach(x=>x.textContent=val(L.menu,'Menu'));
    $$('[data-discord]').forEach(x=>x.href=S.discord||'#');
    $$('[data-studio-logo]').forEach(x=>{if(S.logo){x.src=path(S.logo);x.alt=S.name||'iNSIDERS Games'}});
    const h=S.header||{},nav=(h.nav||[]).filter(x=>x&&x.visible!==false&&x.label&&x.url);
    $$('.nav').forEach(n=>n.innerHTML=nav.map(x=>`<a class="${isActive(x.url)?'active':''}" href="${esc(path(x.url))}" ${x.newTab?'target="_blank" rel="noopener"':''}>${esc(x.label)}</a>`).join(''));
    $$('.mobile-menu').forEach(n=>n.innerHTML=nav.map(x=>`<a class="${isActive(x.url)?'active':''}" href="${esc(path(x.url))}" ${x.newTab?'target="_blank" rel="noopener"':''}>${esc(x.label)}</a>`).join('')+(h.ctaUrl&&h.ctaLabel?`<a class="mobile-cta" href="${esc(path(h.ctaUrl))}" ${h.ctaNewTab?'target="_blank" rel="noopener"':''}>${esc(h.ctaLabel)}</a>`:''));
    $$('.site-header').forEach(header=>{
      header.classList.toggle('not-sticky',h.sticky===false);
      if(!$('.utility-bar',header)){
        const utility=document.createElement('div');utility.className='utility-bar';
        const u=h.utility||{};utility.hidden=u.visible===false;const ul=(u.links||[]).filter(l=>l&&l.visible!==false&&l.label&&l.url);utility.innerHTML=`<div class="wrap utility-inner"><span>${esc(u.label||S.name||'iNSIDERS Games')}</span><nav aria-label="Studio links">${ul.map(l=>`<a href="${esc(path(l.url))}" ${l.newTab?'target="_blank" rel="noopener"':''}>${esc(l.label)}</a>`).join('')}</nav></div>`;
        header.prepend(utility);
      }
      const brand=$('.brand',header);if(brand){brand.hidden=h.showLogo===false;const bi=$('img',brand);if(bi&&(h.logo||S.logo)){bi.src=path(h.logo||S.logo);bi.alt=S.name||'iNSIDERS Games'}}let cta=$('.header-cta',header);if(h.ctaUrl&&h.ctaLabel){if(!cta){cta=document.createElement('a');cta.className='header-cta';$('.header-inner',header)?.append(cta)}cta.href=path(h.ctaUrl);cta.textContent=h.ctaLabel;cta.hidden=false;if(h.ctaNewTab){cta.target='_blank';cta.rel='noopener'}}else if(cta)cta.hidden=true
    });
    const menu=$('.menu-toggle'),mobile=$('.mobile-menu');if(menu&&mobile)menu.onclick=()=>{const open=mobile.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))};
    const f=S.footer||{};$$('.footer').forEach(footer=>{const cols=(f.columns||[]).filter(c=>c&&((c.links||[]).length||c.title));footer.innerHTML=`<div class="wrap footer-builder">${f.showLogo&&S.logo?`<div class="footer-brand"><img src="${esc(path(S.logo))}" alt="${esc(S.name||'iNSIDERS Games')}"></div>`:''}<div class="footer-legal"><b>${esc(String(f.primaryText||`© {year} ${S.name||'iNSIDERS Games'}`).replace('{year}',new Date().getFullYear()))}</b><span>${esc(f.secondaryText||'')}</span></div>${cols.length?`<div class="footer-columns">${cols.map(c=>`<div><b>${esc(c.title||'')}</b>${(c.links||[]).filter(l=>l.label&&l.url).map(l=>`<a href="${esc(path(l.url))}" ${l.newTab?'target="_blank" rel="noopener"':''}>${esc(l.label)}</a>`).join('')}</div>`).join('')}</div>`:''}</div>`});
  }

  function gameCard(g){return `<article class="game-card reveal"><a class="card-media" href="${path(g.page)}" aria-label="Open ${esc(g.title)}" ${g.cover?`style="background-image:url('${path(g.cover)}');background-size:${g.cardFit||'cover'}"`:''}><span class="card-status">${esc(g.status||'')}</span></a><div class="card-body"><div class="card-meta">${esc(g.genre||'Game')}${g.platforms?` · ${esc(g.platforms)}`:''}</div><h3>${esc(g.title)}</h3><p>${esc(plain(g.short||g.description?.[0]||''))}</p><a class="card-link" href="${path(g.page)}">${esc(val(L.projectCardLink,'View project'))} <span>→</span></a></div></article>`}
  function renderGameCards(){const games=visibleGames();$$('[data-games-grid]').forEach(m=>{m.innerHTML=games.map(gameCard).join('')||(page==='games'?`<div class="media-empty">${esc(val((P.games||{}).emptyText,'No public games are available yet.'))}</div>`:'');reveal(m)})}
  function renderFeatured(){const g=visibleGames().find(x=>x.featured===true),section=$('[data-featured-section]'),mount=$('[data-featured-game]');if(!section||!mount||!g)return;section.hidden=false;const primaryStore=activeStores(g)[0];mount.innerHTML=`<article class="featured-showcase reveal"><a class="featured-visual" href="${path(g.page)}" ${g.cover?`style="background-image:url('${path(g.cover)}');background-size:${g.cardFit||'cover'}"`:''}><span class="featured-stamp">${esc(val(L.featuredBadge,'Studio selection'))}</span><span class="featured-status">${esc(g.status||'')}</span></a><div class="featured-copy"><div class="card-meta">${esc(g.genre||'Game')}${g.platforms?` · ${esc(g.platforms)}`:''}</div><h3>${esc(g.title)}</h3><p>${esc(plain(g.short||''))}</p><div class="featured-actions"><a class="btn primary" href="${path(g.page)}">${esc(val(L.featuredPrimary,'Explore featured game'))}</a>${primaryStore?.url?`<a class="btn" href="${esc(primaryStore.url)}" target="_blank" rel="noopener">${esc(primaryStore.label)}</a>`:''}</div></div></article>`;reveal(mount)}

  const STORE_CFG={
    steam:{name:'Steam',icon:'steam.svg'},humble:{name:'Humble Bundle',icon:'humblebundle.svg'},gog:{name:'GOG',icon:'gogdotcom.svg'},epic:{name:'Epic Games Store',icon:'epicgames.svg'},itch:{name:'itch.io',icon:'itchdotio.svg'},gamejolt:{name:'Game Jolt',icon:'gamejolt.svg'}
  };
  function normalizeStore(key,v,g){v=v||{};if(typeof v==='string')v={url:v};const cfg=STORE_CFG[key]||{name:v.label||key,icon:''};return {key,label:v.label||cfg.name,note:val(v.note,'Official storefront'),buttonLabel:val(v.buttonLabel,'Open '+(v.label||cfg.name)),url:v.url||(key==='itch'?g.itch||'':''),enabled:v.enabled!==false,display:v.display||v.mode||'button',embed:v.embed||v.widget||'',icon:cfg.icon}}
  function activeStores(g){return Object.entries(g.stores||{}).map(([k,v])=>normalizeStore(k,v,g)).filter(s=>s.enabled&&(s.url||s.embed))}
  function youtubeId(url=''){const m=String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i);return m&&m[1]}
  function vimeoId(url=''){const m=String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/i);return m&&m[1]}
  function trailerKind(g){const src=String(g.trailer||'').trim(),type=String(g.trailerType||'auto').toLowerCase();if(!src)return'none';if(type==='video'||/\.(mp4|webm)(?:$|\?)/i.test(src))return'video';if(type==='vimeo'||vimeoId(src))return'vimeo';if(type==='youtube'||youtubeId(src))return'youtube';return type==='none'?'auto':'auto'}
  function hasTrailer(g){return !!String(g.trailer||'').trim()}

  function renderHome(){
    document.title=S.homeMetaTitle||`${S.name||'iNSIDERS Games'} — Independent Game Studio`;setMeta('description',S.homeMetaDescription||S.heroIntro||'');
    const hero=$('[data-home-hero]');if(hero){const type=S.heroMediaType||'image',src=S.heroMedia||S.heroImage||'';hero.innerHTML='';hero.style.backgroundImage='none';hero.style.backgroundSize=S.homeHeroFit||'cover';hero.style.backgroundPosition=S.homeHeroPosition||'center';if(type==='video'&&src){const v=document.createElement('video');v.src=path(src);v.autoplay=true;v.muted=true;v.loop=true;v.playsInline=true;v.preload='metadata';v.setAttribute('aria-hidden','true');hero.append(v)}else if(src)hero.style.backgroundImage=`url('${path(src)}')`}
    set('[data-home-hero-eyebrow]',S.heroEyebrow);set('[data-home-hero-title]',S.heroHeadline);set('[data-home-hero-intro]',S.heroIntro);set('[data-home-primary]',S.heroPrimaryLabel);set('[data-home-secondary]',S.heroSecondaryLabel);const hp=$('[data-home-primary]'),hs=$('[data-home-secondary]');if(hp)hp.href=path(S.homePrimaryUrl||'games.html');if(hs)hs.href=path(S.homeSecondaryUrl||S.discord||'#');
    set('[data-featured-eyebrow]',val(S.featuredEyebrow,'Studio spotlight'));set('[data-featured-title]',val(S.featuredTitle,'Featured game'));set('[data-featured-intro]',val(S.featuredIntro,''));renderFeatured();
    set('[data-projects-eyebrow]',S.projectsEyebrow);set('[data-projects-title]',S.projectsTitle);set('[data-projects-intro]',S.projectsIntro);set('[data-about-eyebrow]',S.aboutEyebrow);set('[data-about-title]',S.aboutTitle);set('[data-about-text]',S.aboutText);set('[data-game-count]',visibleGames().length);set('[data-released-count]',visibleGames().filter(g=>/available|released/i.test(g.status||'')).length);set('[data-projects-fact-label]',val(L.projectsFact,'Projects'));set('[data-available-fact-label]',val(L.availableFact,'Available now'));set('[data-independent-value]',val(L.independentValue,'100%'));set('[data-independent-fact-label]',val(L.independentFact,'Independent'));
    const idx=$('[data-hero-index]');if(idx)idx.innerHTML=`<div class="hero-index-label">${esc(val(L.heroIndexLabel,'Current projects'))}</div>`+visibleGames().slice(0,6).map(g=>`<a href="${path(g.page)}"><b>${esc(g.title)}</b><em>${esc(g.status||'')}</em><i aria-hidden="true">↗</i></a>`).join('');
    const news=$('[data-latest-news-section]');if(news){const ey=$('.eyebrow',news),h2=$('h2',news),a=$('.card-link',news);if(ey)ey.textContent=val(L.latestNewsEyebrow,'Latest transmissions');if(h2)h2.textContent=val(L.latestNewsTitle,'News & development');if(a)a.textContent=val(L.latestNewsLink,'View all news →')}
  }

  function gameButtons(g,stores){
    const custom=(g.ctaButtons||[]).filter(b=>b&&b.label&&b.url&&b.visible!==false);
    const generated=custom.length?custom:stores.filter(s=>s.url).slice(0,3).map((s,i)=>({label:s.label,url:s.url,style:i===0?'primary':'secondary',newTab:true}));
    if(hasTrailer(g)&&!generated.some(b=>String(b.url).includes('#trailer')))generated.push({label:val((g.pageLabels||{}).watchTrailer,'Watch trailer'),url:'#trailer',style:'secondary',newTab:false});
    if(g.pressEnabled!==false)generated.push({label:val(L.publisherAssets,'Publisher assets'),url:`press/${g.id}.html`,style:'secondary',newTab:false,relative:true});
    return generated;
  }
  function mountTrustedEmbed(container,html){
    container.innerHTML=String(html||'');
    [...container.querySelectorAll('script')].forEach(old=>{const s=document.createElement('script');for(const a of [...old.attributes])s.setAttribute(a.name,a.value);s.textContent=old.textContent;old.replaceWith(s)});
  }
  function descriptionHeading(item,index,items){
    const text=plain(item||'');
    if(!text||/[.!?;:]$/.test(text)||text.length>42)return false;
    if(text===text.toUpperCase()&&/[A-Z]/.test(text))return true;
    const words=text.split(/\s+/).filter(Boolean);
    if(words.length>5)return false;
    const prev=plain(items[index-1]||''),next=plain(items[index+1]||'');
    const titleish=words.every(w=>/^[A-Z0-9&+–—'’\/-]/.test(w));
    return titleish&&(prev.length>=75||next.length>=75);
  }
  function descriptionHtml(items=[]){
    return items.map((item,index)=>descriptionHeading(item,index,items)
      ?`<h3 class="game-description-heading">${esc(plain(item))}</h3>`
      :`<p>${esc(plain(item))}</p>`).join('');
  }
  function renderDescription(g){
    const mount=$('[data-game-description]');if(!mount)return;
    const items=(g.description||[]).filter(x=>plain(x));
    if(!items.length){mount.innerHTML='';return}
    const collapse=g.collapseLongDescription!==false;
    const preview=Math.max(3,Math.min(items.length,Number(g.descriptionPreviewCount)||10));
    if(!collapse||items.length<=preview+2){mount.innerHTML=descriptionHtml(items);return}
    const lead=items.slice(0,preview),rest=items.slice(preview);
    mount.innerHTML=`<div class="game-description-lead">${descriptionHtml(lead)}</div><details class="game-description-more"><summary><span>${esc((g.pageLabels||{}).readFullOverview||val(L.readFullOverview,'Read full overview'))}</span><small>${rest.length} ${esc(val(L.moreSections,'more sections'))}</small></summary><div class="game-description-expanded">${descriptionHtml(rest)}</div></details>`;
  }
  function updateExcerpt(text,maxChars){
    const value=plain(text||'');if(value.length<=maxChars)return value;
    let cut=value.slice(0,maxChars+1),at=Math.max(cut.lastIndexOf('. '),cut.lastIndexOf('! '),cut.lastIndexOf('? '));
    if(at<Math.max(120,maxChars*.55))at=cut.lastIndexOf(' ');
    return cut.slice(0,Math.max(1,at)).trim().replace(/[,:;\-–—]+$/,'')+'…';
  }

  function renderGamePage(g){
    const root=document.documentElement;const vars={'--accent':g.useGameTheme===true?g.accentColor:null,'--bg':g.useGameTheme===true?g.backgroundColor:null,'--panel-user':g.useGameTheme===true?g.panelColor:null,'--font-display':g.gameFontDisplay?`"${g.gameFontDisplay}",sans-serif`:null,'--font-body':g.gameFontBody?`"${g.gameFontBody}",sans-serif`:null};Object.entries(vars).forEach(([k,v])=>{if(v)root.style.setProperty(k,v)});if(g.useGameTheme===true&&g.accentColor)root.style.setProperty('--accent-ink',contrastInk(g.accentColor));if(g.cover)root.style.setProperty('--page-art',`url("${absolute(g.cover)}")`);if(g.gameFontDisplay)installFont(g.gameFontDisplay,'insiders-game-display-font');if(g.gameFontBody)installFont(g.gameFontBody,'insiders-game-body-font');document.body.dataset.gameTheme=g.theme||'custom';
    document.title=`${g.title} — ${S.name||'iNSIDERS Games'}`;socialMeta(document.title,plain(g.short||g.description?.[0]||''),g.cover?absolute(g.cover):'');
    const hero=$('[data-game-hero]');if(hero&&g.cover){hero.style.backgroundImage=`url('${path(g.cover)}')`;hero.style.backgroundPosition=g.heroPosition||'center';hero.style.backgroundSize=g.heroFit||'cover';hero.style.backgroundRepeat='no-repeat'}
    set('[data-game-kicker]',g.archiveLabel||g.status||'Game');
    const logo=$('[data-game-logo]'),title=$('[data-game-title]');if(g.logo&&logo){logo.src=path(g.logo);logo.alt=g.title;logo.hidden=false;logo.style.maxWidth=`${Number(g.logoMaxWidth)||560}px`;if(title)title.hidden=true}else if(title){title.textContent=g.title;title.hidden=false;if(logo)logo.hidden=true}
    const tags=$('[data-game-hero-tags]');if(tags)tags.innerHTML=[g.status,g.genre,g.platforms].filter(Boolean).map((x,i)=>`<span class="game-tag ${i===0?'accent':''}">${esc(x)}</span>`).join('');
    setHtml('[data-game-short]',rich(g.short||''));
    const stores=activeStores(g);const GL=g.pageLabels||{};set('[data-label-project-info]',val(GL.projectInfo,'Project information'));set('[data-label-trailer-get-game]',val(GL.trailerGetGame,'Get the game ↓'));set('[data-trailer-empty]',val(GL.trailerEmpty,'No trailer published yet.'));set('[data-label-stores-eyebrow]',val(GL.storesEyebrow,'Storefronts'));set('[data-label-game-file]',val(GL.gameFile,'Game file'));set('[data-label-custom-eyebrow]',val(GL.customEyebrow,'More about the game'));set('[data-label-custom-title]',val(GL.customTitle,'Details'));set('[data-label-gallery-note]',val(GL.galleryNote,'Click an image to open it at full size.'));
    const cta=$('[data-game-cta]');if(cta)cta.innerHTML=gameButtons(g,stores).map((b,i)=>`<a class="btn ${(b.style==='primary'||i===0)?'primary':''}" href="${esc((b.relative||!isExternal(b.url))?path(b.url):b.url)}" ${(b.newTab!==false&&!String(b.url).startsWith('#'))?'target="_blank" rel="noopener"':''}>${esc(b.label)}</a>`).join('');
    const factsQuick=$('[data-game-quick-facts]');if(factsQuick)factsQuick.innerHTML=[[val((g.pageLabels||{}).status,'Status'),g.status],[val((g.pageLabels||{}).genre,'Genre'),g.genre],[val((g.pageLabels||{}).engine,'Engine'),g.engine],[val((g.pageLabels||{}).platforms,'Platforms'),g.platforms]].filter(([,v])=>v).map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    const quick=$('[data-game-quick-stores]');if(quick)quick.innerHTML=stores.filter(s=>s.url).slice(0,5).map(s=>`<a class="quick-store" data-store="${esc(s.key)}" href="${esc(s.url)}" target="_blank" rel="noopener">${s.icon?`<img class="store-logo store-logo-small" src="${esc(path('assets/icons/stores/'+s.icon))}" alt="" aria-hidden="true">`:''}<span>${esc(s.label)}</span><span>↗</span></a>`).join('');

    set('[data-about-eyebrow]',val(g.aboutEyebrow,'About the game'));set('[data-about-title]',val(g.aboutTitle,'About'));set('[data-trailer-eyebrow]',val(g.trailerEyebrow,'Official footage'));set('[data-trailer-title]',val(g.trailerTitle,'Trailer'));set('[data-gallery-eyebrow]',val(g.galleryEyebrow,'Screenshots'));set('[data-gallery-title]',val(g.galleryTitle,'Gallery'));
    renderDescription(g);
    const features=$('[data-game-features]');if(features)features.innerHTML=(g.features||[]).map(f=>`<div class="feature">${esc(f)}</div>`).join('');
    const facts=$('[data-game-facts]');if(facts)facts.innerHTML=[[val((g.pageLabels||{}).status,'Status'),g.status],[val((g.pageLabels||{}).genre,'Genre'),g.genre],[val((g.pageLabels||{}).engine,'Engine'),g.engine],[val((g.pageLabels||{}).platforms,'Platforms'),g.platforms]].filter(([,v])=>v).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');const factsPanel=$('[data-game-facts-panel]');if(factsPanel)factsPanel.hidden=g.showFacts===false;
    const factActions=$('[data-game-facts-actions]');if(factActions)factActions.innerHTML=(g.pressEnabled!==false?`<a class="btn" href="${path('press/'+g.id+'.html')}">${esc(val(L.publisherAssets,'Publisher assets'))}</a>`:'')+(stores[0]?.url?`<a class="btn primary" href="${esc(stores[0].url)}" target="_blank" rel="noopener">${esc(stores[0].label)}</a>`:'');

    renderTrailer(g);renderStores(g,stores);renderCustomBlocks(g);renderRoadmap(g);renderUpdates(g);renderGallery(g);renderGameSubnav(g,stores);
  }
  function renderTrailer(g){
    const section=$('[data-trailer-section]'),shell=$('[data-trailer]'),empty=$('[data-trailer-empty]');if(!section||!shell)return;const src=String(g.trailer||'').trim();const visible=g.showTrailer!==false;section.hidden=!visible;if(!visible)return;if(!src){shell.hidden=true;if(empty){empty.hidden=false;empty.textContent=val((g.pageLabels||{}).trailerEmpty,'No trailer published yet.')}return}let html='';const kind=trailerKind(g);if(kind==='youtube'&&youtubeId(src)){html=`<iframe src="https://www.youtube-nocookie.com/embed/${youtubeId(src)}?rel=0" title="${esc(g.title)} trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`}else if(kind==='vimeo'&&vimeoId(src)){html=`<iframe src="https://player.vimeo.com/video/${vimeoId(src)}" title="${esc(g.title)} trailer" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>`}else if(kind==='video'||!/^https?:/i.test(src)){html=`<video controls preload="metadata" playsinline><source src="${esc(path(src))}"></video>`}else{html=`<a class="video-facade" href="${esc(src)}" target="_blank" rel="noopener"><span class="video-play">▶</span><span class="video-caption"><b>${esc(val((g.pageLabels||{}).watchTrailer,'Watch official trailer'))}</b><small>${esc(val((g.pageLabels||{}).openVideo,'Open video'))}</small></span></a>`}shell.innerHTML=html;shell.hidden=!html;if(empty)empty.hidden=!!html;const copy=$('[data-trailer-copy]');if(copy)copy.innerHTML=rich(g.trailerText||`<strong>${esc(g.title)}</strong><p>${esc(plain(g.short||g.description?.[0]||''))}</p>`)}
  function renderStores(g,stores){
    const section=$('[data-store-section]'),mount=$('[data-storefronts]');if(!section||!mount)return;section.hidden=!stores.length;if(!stores.length)return;set('[data-store-title]',val(g.storeTitle,'Get the game'));set('[data-store-intro]',val(g.storeIntro,'Choose the storefront that works for you.'));mount.innerHTML=stores.map(s=>{const wantWidget=(s.display==='widget'||s.display==='both')&&s.embed;const wantButton=!!s.url&&(s.display!=='widget'||!s.embed);return `<article class="storefront-card ${s.display==='widget'?'widget-only':''}" data-store-card="${esc(s.key)}"><div class="storefront-card-head">${s.icon?`<img class="store-logo store-logo-large" src="${esc(path('assets/icons/stores/'+s.icon))}" alt="" aria-hidden="true">`:''}<div><b>${esc(s.label)}</b><small>${esc(val(s.note,wantWidget?'Official purchase widget':'External storefront'))}</small></div>${s.url?`<a class="section-anchor" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(val((g.pageLabels||{}).storeOpen,'Open'))} ↗</a>`:''}</div><div class="storefront-card-body">${wantWidget?`<div class="storefront-widget" data-store-embed="${esc(s.key)}"></div>`:''}${wantButton?`<div class="storefront-card-actions"><a class="btn primary" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(val(s.buttonLabel,'Open '+s.label))}</a></div>`:''}</div></article>`}).join('');stores.forEach(s=>{const m=$(`[data-store-embed="${CSS.escape(s.key)}"]`,mount);if(m&&s.embed)mountTrustedEmbed(m,s.embed)})
  }
  function renderCustomBlocks(g){const section=$('[data-game-custom-section]'),mount=$('[data-game-blocks]'),blocks=(g.blocks||[]).filter(Boolean);if(!section||!mount)return;section.hidden=!blocks.length;if(blocks.length)renderBlocks(blocks,mount)}
  function renderRoadmap(g){const section=$('[data-roadmap-section]'),mount=$('[data-roadmap-media]');if(!section||!mount)return;const visible=g.showRoadmap!==false&&!!(g.roadmap||plain(g.roadmapIntro||''));section.hidden=!visible;if(!visible)return;set('[data-roadmap-eyebrow]',plain(val(g.roadmapEyebrow,'Development roadmap')));set('[data-roadmap-title]',plain(val(g.roadmapTitle,'What comes next')));setHtml('[data-roadmap-intro]',rich(g.roadmapIntro||''));if(!g.roadmap){mount.innerHTML=`<div class="media-empty">${esc(val((g.pageLabels||{}).roadmapEmpty,'Roadmap coming soon.'))}</div>`;return}mount.innerHTML=`<button class="roadmap-open" type="button"><img src="${path(g.roadmap)}" alt="${esc(g.title)} roadmap" loading="lazy"><span>${esc(val((g.pageLabels||{}).roadmapOpen,'Open full roadmap'))}</span></button>`;const b=$('.roadmap-open',mount);b.onclick=()=>openImage($('img',b).src,$('img',b).alt)}
  function renderUpdates(g){
    const section=$('[data-updates-section]'),mount=$('[data-updates-list]'),updates=(g.updates||[]).filter(u=>u&&u.title);if(!section||!mount)return;
    const visible=g.showUpdates!==false&&updates.length>0;section.hidden=!visible;if(!visible)return;
    setHtml('[data-updates-eyebrow]',rich(val(g.updatesEyebrow,'Development updates')));setHtml('[data-updates-title]',rich(val(g.updatesTitle,'Latest progress')));setHtml('[data-updates-intro]',rich(g.updatesIntro||''));
    const collapse=g.collapseLongUpdates!==false,limit=Math.max(180,Number(g.updatePreviewChars)||520);
    mount.innerHTML=updates.map(u=>{
      const full=plain(u.text||''),long=collapse&&full.length>limit;
      const body=long?`<p class="update-excerpt">${esc(updateExcerpt(u.text,limit))}</p><details class="update-details"><summary>${esc(val((g.pageLabels||{}).readFullUpdate,'Read full update'))} <span>→</span></summary><div class="rich-copy update-full-copy">${rich(u.text||'')}</div></details>`:`<div class="rich-copy">${rich(u.text||'')}</div>`;
      return `<article class="update-card"><div class="update-date">${esc(u.date||val((g.pageLabels||{}).updateFallback,'Update'))}</div><div><h3>${esc(u.title)}</h3>${body}${u.link?`<a class="update-external" href="${esc(u.link)}" target="_blank" rel="noopener">${esc(val((g.pageLabels||{}).openLinkedPost,'Open linked post →'))}</a>`:''}</div></article>`
    }).join('')
  }
  function renderGallery(g){const section=$('[data-gallery-section]'),gal=$('[data-gallery]');if(!section||!gal)return;const items=(g.gallery||[]).filter(Boolean);section.hidden=g.showGallery===false||!items.length;if(section.hidden)return;gal.innerHTML=items.map((p,i)=>`<button type="button"><img src="${path(p)}" alt="${esc(g.title)} screenshot ${i+1}" loading="lazy" style="object-fit:${g.galleryFit||'cover'}"></button>`).join('');$$('button',gal).forEach(b=>b.onclick=()=>openImage($('img',b).src,$('img',b).alt))}
  function openImage(src,alt=''){const box=document.createElement('dialog');box.className='lightbox';box.innerHTML=`<button class="lightbox-close">${esc(val(L.closeLightbox,'Close ×'))}</button><img>`;document.body.append(box);$('img',box).src=src;$('img',box).alt=alt;$('.lightbox-close',box).onclick=()=>box.close();box.onclick=e=>{if(e.target===box)box.close()};box.addEventListener('close',()=>box.remove());box.showModal()}
  function renderGameSubnav(g,stores){const brand=$('[data-game-subnav-brand]'),nav=$('[data-game-subnav]');if(brand)brand.textContent=g.title;if(!nav)return;const gl=g.pageLabels||{};const links=[['overview',val(gl.navOverview,'Overview'),true],['trailer',val(gl.navTrailer,'Trailer'),!$('[data-trailer-section]')?.hidden],['buy',val(gl.navBuy,'Buy'),stores.length>0],['details',val(gl.navDetails,'Details'),!$('[data-game-custom-section]')?.hidden],['roadmap',val(gl.navRoadmap,'Roadmap'),!$('[data-roadmap-section]')?.hidden],['updates',val(gl.navUpdates,'Updates'),!$('[data-updates-section]')?.hidden],['screenshots',val(gl.navScreenshots,'Screenshots'),!$('[data-gallery-section]')?.hidden]].filter(x=>x[2]);if(g.pressEnabled!==false)links.push([path('press/'+g.id+'.html'),val(gl.navPress,'Press / Assets'),'page']);nav.innerHTML=links.map(([id,label,kind])=>kind==='page'?`<a href="${esc(id)}">${esc(label)} ↗</a>`:`<a href="#${esc(id)}" data-section-link="${esc(id)}">${esc(label)}</a>`).join('');const sectionLinks=$$('[data-section-link]',nav);if('IntersectionObserver' in window&&sectionLinks.length){const obs=new IntersectionObserver(entries=>{const hit=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!hit)return;sectionLinks.forEach(a=>a.classList.toggle('active',a.dataset.sectionLink===hit.target.id))},{rootMargin:'-28% 0px -60% 0px',threshold:[0,.2,.5]});sectionLinks.forEach(a=>{const s=document.getElementById(a.dataset.sectionLink);if(s&&!s.hidden)obs.observe(s)})}}

  function articleCard(a){return `<article class="news-card reveal">${a.cover?`<a class="news-cover" href="${path(a.page)}" style="background-image:url('${path(a.cover)}')"></a>`:''}<div class="news-body"><div class="card-meta">${esc(val(a.category,'News'))} · ${esc(a.date||'')}</div><h3><a href="${path(a.page)}">${esc(a.title)}</a></h3><p>${esc(plain(a.excerpt||''))}</p><a class="card-link" href="${path(a.page)}">${esc(val(L.readArticle,'Read article'))} →</a></div></article>`}
  function publishedArticles(){return (D.articles||[]).filter(a=>a.status==='published').sort((a,b)=>String(b.date).localeCompare(String(a.date)))}
  function renderNews(){const grid=$('[data-news-grid]');if(!grid)return;const articles=publishedArticles();grid.innerHTML=articles.map(articleCard).join('')||`<div class="media-empty">${esc(val((P.news||{}).emptyText,'No published news yet.'))}</div>`;reveal(grid)}
  function renderBlocks(blocks,mount){if(!mount)return;mount.innerHTML=(blocks||[]).map(b=>{if(b.type==='heading')return `<h2>${rich(b.text||'')}</h2>`;if(b.type==='image')return b.src?`<figure><img src="${path(b.src)}" alt="" loading="lazy"></figure>`:'';if(b.type==='youtube'){const y=youtubeId(b.url||'');return y?`<div class="video-shell"><iframe src="https://www.youtube-nocookie.com/embed/${y}?rel=0" title="Video" allowfullscreen loading="lazy"></iframe></div>`:''}if(b.type==='quote')return `<blockquote>${rich(b.text||'')}</blockquote>`;if(b.type==='button')return `<p><a class="btn primary" href="${esc(b.url||'#')}" target="_blank" rel="noopener">${esc(b.label||'Open')}</a></p>`;if(b.type==='divider')return '<hr>';return `<div class="rich-copy">${rich(b.text||'')}</div>`}).join('')}
  function renderArticle(){const a=(D.articles||[]).find(x=>x.id===document.body.dataset.article);if(!a)return;document.title=`${a.title} — ${S.name||'iNSIDERS Games'}`;set('[data-article-category]',a.category);set('[data-article-title]',a.title);setHtml('[data-article-excerpt]',rich(a.excerpt||''));set('[data-article-meta]',`${a.date||''}${a.gameId?' · '+((D.games||[]).find(g=>g.id===a.gameId)?.title||''):''}`);const h=$('[data-article-hero]');if(h&&a.cover)h.style.backgroundImage=`linear-gradient(180deg,rgba(0,0,0,.32),#090b09),url('${path(a.cover)}')`;renderBlocks(a.blocks,$('[data-article-content]'))}
  function renderCustomPage(){const p=(D.pages||[]).find(x=>x.id===document.body.dataset.customPage);if(!p)return;document.title=`${p.title} — ${S.name||'iNSIDERS Games'}`;set('[data-custom-title]',p.title);setHtml('[data-custom-intro]',rich(p.intro||''));renderBlocks(p.blocks,$('[data-custom-content]'))}
  function renderContact(){const grid=$('.contact-grid');if(grid&&Array.isArray(S.contactCards)){grid.innerHTML=S.contactCards.filter(c=>c&&c.title).map(c=>{const tab=c.newTab!==false?' target="_blank" rel="noopener"':'';return `<article class="contact-card reveal"><div class="eyebrow">${esc(val(c.eyebrow,''))}</div><h2>${esc(c.title)}</h2><p>${esc(val(c.text,''))}</p>${c.url&&c.buttonLabel?`<a class="btn ${c.style==='primary'?'primary':''}" href="${esc(path(c.url))}"${tab}>${esc(c.buttonLabel)}</a>`:''}</article>`}).join('');reveal(grid)}}
  function renderPressIndex(){const c=P.press||{};document.title=val(c.browserTitle,`${val(c.title,'Press Kit')} — ${S.name||'iNSIDERS Games'}`);set('[data-press-eyebrow]',val(c.eyebrow,''));set('[data-press-title]',val(c.title,'Press Kit'));set('[data-press-intro]',val(c.intro,''));const studio=$('[data-press-studio-section]');if(studio){studio.hidden=c.showStudio===false;set('[data-press-studio-eyebrow]',val(c.studioEyebrow,''));set('[data-press-studio-title]',val(c.studioTitle,S.name||'iNSIDERS Games'));set('[data-press-studio-description]',val(c.studioDescription,''));const chips=$('[data-press-features]');if(chips)chips.innerHTML=(c.featureChips||[]).filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join('');set('[data-press-facts-title]',val(c.factsTitle,''));const facts=$('[data-press-facts]');if(facts)facts.innerHTML=(c.facts||[]).filter(x=>x&&x.label&&x.value).map(x=>{const value=x.type==='email'?`<a href="mailto:${esc(x.value)}">${esc(x.value)}</a>`:esc(x.value);return `<dt>${esc(x.label)}</dt><dd>${value}</dd>`}).join('');set('[data-press-links-title]',val(c.linksTitle,''));const links=$('[data-press-links]');if(links)links.innerHTML=(c.links||[]).filter(x=>x&&x.visible!==false&&x.label&&x.url).map(x=>`<a href="${esc(path(x.url))}" ${x.newTab?'target="_blank" rel="noopener"':''}>${esc(x.label)} <span>↗</span></a>`).join('')}const games=$('[data-press-games-section]');if(games){games.hidden=c.showGames===false;set('[data-press-games-eyebrow]',val(c.gamesEyebrow,''));set('[data-press-games-title]',val(c.gamesTitle,''));set('[data-press-games-intro]',val(c.gamesIntro,''))}}
  function renderPublisherAssets(g){const c=g.publisherPage||{};document.title=`${val(g.pressTitle,`${g.title} — Publisher Assets`)} — ${S.name||'iNSIDERS Games'}`;set('[data-publisher-eyebrow]',val(c.eyebrow,'Publisher / Press resources'));set('[data-publisher-title]',val(g.pressTitle,`${g.title} — Publisher Assets`));set('[data-publisher-intro]',val(g.pressIntro,''));const back=$('[data-publisher-game-link]');if(back){back.href=path(g.page);back.textContent=val(c.backLabel,'View game page')}set('[data-publisher-section-eyebrow]',val(c.sectionEyebrow,'Approved files'));set('[data-publisher-section-title]',val(c.sectionTitle,'Asset gallery'));set('[data-publisher-section-intro]',val(c.sectionIntro,'Open or download the original files supplied by the developer.'));const mount=$('[data-publisher-assets]'),assets=g.pressAssets||[];if(mount)mount.innerHTML=assets.length?assets.map(a=>`<article class="publisher-asset-card"><a class="publisher-asset-preview" href="${esc(path(a.path))}" target="_blank" rel="noopener"><img src="${esc(path(a.path))}" alt="${esc(a.label||g.title)}" loading="lazy"></a><div class="publisher-asset-copy"><span>${esc((a.type||'asset').replace('-', ' '))}</span><h3>${esc(a.label||'Asset')}</h3>${a.note?`<p>${esc(a.note)}</p>`:''}<div class="publisher-asset-actions"><a href="${esc(path(a.path))}" target="_blank" rel="noopener">${esc(val(c.viewLabel,val(L.viewOriginal,'View original')))}</a><a href="${esc(path(a.path))}" download>${esc(val(c.downloadLabel,val(L.download,'Download')))}</a></div></div></article>`).join(''):`<div class="media-empty">${esc(val(c.emptyText,'No publisher assets published yet.'))}</div>`}

  renderShell();renderGameCards();
  if(page==='home')renderHome();
  if(page==='games'){const c=P.games||{};document.title=val(c.browserTitle,`${val(c.title,'Games')} — ${S.name||'iNSIDERS Games'}`);set('[data-games-page-eyebrow]',val(c.eyebrow,''));set('[data-games-page-title]',val(c.title,'Games'));set('[data-games-page-intro]',val(c.intro,''))}
  if(page==='news'){const c=P.news||{};document.title=val(c.browserTitle,`${val(c.title,'News')} — ${S.name||'iNSIDERS Games'}`);set('[data-news-page-eyebrow]',val(c.eyebrow,''));set('[data-news-page-title]',val(c.title,'News & Updates'));set('[data-news-page-intro]',val(c.intro,''));renderNews()}
  if(page==='contact'){const c=P.contact||{};document.title=val(c.browserTitle,`${val(c.title,'Contact')} — ${S.name||'iNSIDERS Games'}`);set('[data-contact-eyebrow]',val(c.eyebrow,''));set('[data-contact-title]',val(c.title,'Contact'));set('[data-contact-intro]',val(c.intro,''));renderContact()}
  if(page==='404'){const c=P.notFound||{};document.title=val(c.browserTitle,`404 — ${S.name||'iNSIDERS Games'}`);set('[data-404-eyebrow]',val(c.eyebrow,'Signal lost'));set('[data-404-title]',val(c.title,'404'));set('[data-404-intro]',val(c.intro,'This page does not exist.'));const b=$('[data-404-button]');if(b){b.textContent=val(c.buttonLabel,'Return home');b.href=path(val(c.buttonUrl,'index.html'))}}
  if(page==='game'&&game)renderGamePage(game);
  if(page==='article')renderArticle();
  if(page==='custom')renderCustomPage();
  if(page==='press')renderPressIndex();
  if(page==='publisher-assets'&&game)renderPublisherAssets(game);
  if(page==='home'){const articles=publishedArticles().slice(0,3),section=$('[data-latest-news-section]'),mount=$('[data-latest-news]');if(section&&mount&&articles.length){section.hidden=false;mount.innerHTML=articles.map(articleCard).join('');reveal(mount)}}
  reveal();
})();
