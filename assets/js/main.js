/* INSIDERS CORPORATION — Copyright © 2026 Tamas "FATHER" Alex. All rights reserved. */
(()=>{
  const D=window.INSIDERS_DATA||{studio:{},games:[]};
  const S=D.studio||{};
  const fontUrl=name=>'https://fonts.googleapis.com/css2?family='+encodeURIComponent(name).replace(/%20/g,'+')+':wght@400;500;600;700;800&display=swap';
  const installFont=(name,id)=>{if(!name)return;const l=document.createElement('link');l.rel='stylesheet';l.href=fontUrl(name);l.id=id;document.head.append(l)};
  installFont(S.fontDisplay||'Oxanium','insiders-display-font');installFont(S.fontBody||'Space Grotesk','insiders-body-font');
  document.documentElement.style.setProperty('--font-display',`"${S.fontDisplay||'Oxanium'}",sans-serif`);
  document.documentElement.style.setProperty('--font-body',`"${S.fontBody||'Space Grotesk'}",sans-serif`);
  const $=(s,c=document)=>c.querySelector(s);
  const $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const depth=document.body.dataset.depth==='1';
  const path=p=>!p?'':(/^https?:\/\//i.test(p)?p:(depth?'../':'')+p);
  const set=(sel,val)=>{const e=$(sel);if(e)e.textContent=val||''};
  const setMeta=(name,content,property=false)=>{if(!content)return;const selector=property?`meta[property="${name}"]`:`meta[name="${name}"]`;let meta=$(selector);if(!meta){meta=document.createElement('meta');meta.setAttribute(property?'property':'name',name);document.head.append(meta)}meta.content=plain(content)};
  const setSocialMeta=(title,description,image='')=>{setMeta('description',description);setMeta('og:title',title,true);setMeta('og:description',description,true);setMeta('twitter:card','summary_large_image');if(image){setMeta('og:image',image,true);setMeta('twitter:image',image)}};
  const visibleGames=()=>(D.games||[]).filter(g=>g.visible!==false);

  $$('[data-year]').forEach(x=>x.textContent=new Date().getFullYear());
  $$('[data-discord]').forEach(x=>x.href=S.discord||'#');
  $$('[data-studio-logo]').forEach(x=>{if(S.logo)x.src=path(S.logo)});
  $$('.nav,.mobile-menu').forEach(nav=>{if(nav.querySelector('[data-press-link]'))return;const link=document.createElement('a');link.href=depth?'../press.html':'press.html';link.textContent='Press Kit';link.dataset.pressLink='';if(document.body.dataset.page==='press')link.className='active';const contact=[...nav.querySelectorAll('a')].find(item=>/contact\.html$/.test(item.getAttribute('href')||''));if(contact)nav.insertBefore(link,contact);else nav.append(link)});

  const menu=$('.menu-toggle'),mobile=$('.mobile-menu');
  if(menu&&mobile)menu.onclick=()=>{const open=mobile.classList.toggle('open');menu.setAttribute('aria-expanded',open)};

  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});
  const reveal=(c=document)=>$$('.reveal',c).forEach(x=>observer.observe(x));
  reveal();

  function cards(mount){
    const games=visibleGames();
    mount.innerHTML=games.map((g,i)=>`<article class="game-card reveal"><a class="card-media" href="${path(g.page)}" aria-label="Open ${esc(g.title)}" ${g.cover?`style="background-image:url('${path(g.cover)}')"`:''}><span class="card-number">${String(i+1).padStart(2,'0')}</span><span class="card-status">${esc(g.status)}</span></a><div class="card-body"><div class="card-meta">${esc(g.genre)} · ${esc(g.platforms)}</div><h3>${esc(g.title)}</h3><p>${esc(plain(g.short))}</p><a class="card-link" href="${path(g.page)}">View project <span>→</span></a></div></article>`).join('');
    reveal(mount);
  }
  function renderFeatured(){
    const g=visibleGames().find(x=>x.featured===true),section=$('[data-featured-section]'),mount=$('[data-featured-game]');
    if(!section||!mount||!g)return;
    section.hidden=false;
    mount.innerHTML=`<article class="featured-showcase reveal"><a class="featured-visual" href="${path(g.page)}" ${g.cover?`style="background-image:url('${path(g.cover)}')"`:''}><span class="featured-stamp">Studio selection</span><span class="featured-status">${esc(g.status)}</span></a><div class="featured-copy"><div class="card-meta">${esc(g.genre)} · ${esc(g.platforms)}</div><h3>${esc(g.title)}</h3><p>${esc(plain(g.short))}</p><div class="featured-actions"><a class="btn primary" href="${path(g.page)}">Explore featured game</a>${g.itch?`<a class="btn" href="${esc(g.itch)}" target="_blank" rel="noopener">Open on itch.io</a>`:''}</div></div></article>`;
    reveal(mount);
  }
  $$('[data-games-grid]').forEach(cards);

  const page=document.body.dataset.page;
  if(page==='home'){
    const hero=$('[data-home-hero]');
    if(hero){const type=S.heroMediaType||'image',src=S.heroMedia||S.heroImage||'';hero.innerHTML='';hero.style.backgroundImage='none';if(type==='video'&&src){const v=document.createElement('video');v.src=path(src);v.autoplay=true;v.muted=true;v.loop=true;v.playsInline=true;v.preload='metadata';v.setAttribute('aria-hidden','true');hero.append(v)}else if(type==='image'&&src){hero.style.backgroundImage=`url('${path(src)}')`}}
    set('[data-home-hero-eyebrow]',S.heroEyebrow);
    set('[data-home-hero-title]',S.heroHeadline);
    set('[data-home-hero-intro]',S.heroIntro);
    set('[data-home-primary]',S.heroPrimaryLabel);
    set('[data-home-secondary]',S.heroSecondaryLabel);
    set('[data-featured-eyebrow]',S.featuredEyebrow||'Studio spotlight');
    set('[data-featured-title]',S.featuredTitle||'Featured game');
    set('[data-featured-intro]',S.featuredIntro||'The project currently receiving the studio spotlight.');
    renderFeatured();
    set('[data-projects-eyebrow]',S.projectsEyebrow);
    set('[data-projects-title]',S.projectsTitle);
    set('[data-projects-intro]',S.projectsIntro);
    set('[data-about-eyebrow]',S.aboutEyebrow);
    set('[data-about-title]',S.aboutTitle);
    set('[data-about-text]',S.aboutText);
    set('[data-game-count]',visibleGames().length);
    set('[data-released-count]',visibleGames().filter(g=>/available|released/i.test(g.status)).length);
    const idx=$('[data-hero-index]');
    if(idx){
      idx.innerHTML=`<div class="hero-index-label">Selected projects</div>`+visibleGames().slice(0,5).map((g,i)=>`<a href="${path(g.page)}"><span>${String(i+1).padStart(2,'0')}</span><b>${esc(g.title)}</b><em>${esc(g.status)}</em><i aria-hidden="true">↗</i></a>`).join('');
    }
  }

  if(page==='games'){
    set('[data-games-page-eyebrow]',S.gamesPageEyebrow);
    set('[data-games-page-title]',S.gamesPageTitle);
    set('[data-games-page-intro]',S.gamesPageIntro);
  }

  if(page==='contact'){
    set('[data-contact-eyebrow]',S.contactEyebrow||'Contact');
    set('[data-contact-title]',S.contactTitle||'Contact');
    set('[data-contact-intro]',S.contactIntro||'');
  }

  const id=document.body.dataset.game;
  const g=(D.games||[]).find(x=>x.id===id);
  function applyGameIdentity(game){
    if(!game)return;
    const root=document.documentElement;
    const vars={'--accent':game.accentColor,'--bg':game.backgroundColor,'--panel':game.panelColor,'--font-display':game.gameFontDisplay?`"${game.gameFontDisplay}",sans-serif`:null,'--font-body':game.gameFontBody?`"${game.gameFontBody}",sans-serif`:null};
    Object.entries(vars).forEach(([key,value])=>{if(value)root.style.setProperty(key,value)});
    if(game.gameFontDisplay)installFont(game.gameFontDisplay,'insiders-game-display-font');
    if(game.gameFontBody)installFont(game.gameFontBody,'insiders-game-body-font');
    document.body.dataset.gameTheme=game.theme||'custom';
    const hero=$('[data-game-hero]');if(hero){hero.style.backgroundPosition=game.heroPosition||'center';hero.closest('.game-hero')?.setAttribute('data-archive-label',game.archiveLabel||'Project file')}
    const facts=$('.game-facts');if(facts)facts.hidden=game.showFacts===false;
    const sectionFor=selector=>$(selector)?.closest('section');
    [['[data-trailer]',game.showTrailer],['[data-roadmap-section]',game.showRoadmap],['[data-updates-section]',game.showUpdates],['[data-gallery]',game.showGallery]].forEach(([selector,visible])=>{const section=sectionFor(selector);if(section&&visible===false)section.hidden=true});
  }
  if(g){
    applyGameIdentity(g);
    setSocialMeta(`${g.title} — Insiders Corporation`,plain(g.short||g.description?.[0]||''),g.cover?new URL(path(g.cover),location.href).href:'');
    document.title=`${g.title} — Insiders Corporation`;
    const hero=$('[data-game-hero]');
    if(hero&&g.cover)hero.style.backgroundImage=`url('${path(g.cover)}')`;
    const logo=$('[data-game-logo]'),title=$('[data-game-title]');
    if(g.logo){logo.src=path(g.logo);logo.alt=g.title;logo.hidden=false;title.hidden=true}else{title.textContent=g.title;title.hidden=false;logo.hidden=true}
    const gs=$('[data-game-short]');if(gs)gs.innerHTML=rich(g.short||'');
    set('[data-about-eyebrow]',g.aboutEyebrow||'About the game');
    set('[data-about-title]',g.aboutTitle||'Inside the project');
    set('[data-trailer-eyebrow]',g.trailerEyebrow||'Official footage');
    set('[data-trailer-title]',g.trailerTitle||'Trailer');
    set('[data-gallery-eyebrow]',g.galleryEyebrow||'Game images');
    set('[data-gallery-title]',g.galleryTitle||'Gallery');
    const itch=$('[data-game-itch]');
    if(g.itch){itch.href=g.itch;itch.textContent=g.ctaLabel||'Play on itch.io';itch.hidden=false}else itch.hidden=true;
    const desc=$('[data-game-description]');if(desc)desc.innerHTML=(g.description||[]).map(p=>`<p>${esc(p)}</p>`).join('');
    const features=$('[data-game-features]');if(features)features.innerHTML=(g.features||[]).map(f=>`<div class="feature">${esc(f)}</div>`).join('');
    const facts=$('[data-game-facts]');if(facts)facts.innerHTML=`<dt>Status</dt><dd>${esc(g.status)}</dd><dt>Genre</dt><dd>${esc(g.genre)}</dd><dt>Engine</dt><dd>${esc(g.engine)}</dd><dt>Platforms</dt><dd>${esc(g.platforms)}</dd>`;
    renderTrailer(g);renderRoadmap(g);renderUpdates(g);renderGallery(g);renderGameBlocks(g);applyGameIdentity(g);
  }

  function youtubeId(url=''){const m=url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i);return m&&m[1]}
  function renderGameBlocks(game){
    const blocks=(game.blocks||[]).filter(block=>block&&block.type);
    if(!blocks.length)return;
    const section=document.createElement('section');
    section.className='section game-custom-section';
    section.innerHTML='<div class="wrap"><div class="media-title"><div><div class="eyebrow">Additional file</div><h2>Further material</h2></div></div><article class="article-content game-custom-content" data-game-blocks></article></div>';
    const gallerySection=$('[data-gallery]')?.closest('section');
    if(gallerySection)gallerySection.before(section);else $('#content')?.append(section);
    renderBlocks(blocks,$('[data-game-blocks]',section));
  }
  function renderTrailer(g){
    const shell=$('[data-trailer]'),empty=$('[data-trailer-empty]');if(!shell)return;
    let html='';
    if(g.trailer&&g.trailerType==='youtube'&&youtubeId(g.trailer)){
      const y=youtubeId(g.trailer);
      html=`<a class="video-facade" href="${esc(g.trailer)}" target="_blank" rel="noopener"><img src="https://i.ytimg.com/vi/${y}/maxresdefault.jpg" alt="${esc(g.title)} trailer"><span class="video-play">▶</span><span class="video-caption"><b>Watch official trailer</b><small>Open on YouTube</small></span></a>`;
    }else if(g.trailer&&g.trailerType==='video'){
      html=`<video controls preload="metadata"><source src="${path(g.trailer)}"></video>`;
    }else if(g.trailer&&g.trailerType==='vimeo'){
      const m=g.trailer.match(/vimeo\.com\/(?:video\/)?(\d+)/);if(m)html=`<iframe src="https://player.vimeo.com/video/${m[1]}" allowfullscreen></iframe>`;
    }
    shell.innerHTML=html;shell.hidden=!html;if(empty)empty.hidden=!!html;
  }

  function renderRoadmap(g){
    const section=$('[data-roadmap-section]'),mount=$('[data-roadmap-media]');if(!section||!mount)return;
    section.hidden=false;
    if(!g.roadmap){
      set('[data-roadmap-eyebrow]',g.roadmapEyebrow||'Development roadmap');
      set('[data-roadmap-title]',g.roadmapTitle||'What comes next');
      const ri=$('[data-roadmap-intro]');if(ri)ri.innerHTML=rich(g.roadmapIntro||'');
      mount.innerHTML='<div class="media-empty">Roadmap coming soon.</div>';
      return;
    }
    set('[data-roadmap-eyebrow]',g.roadmapEyebrow||'Development roadmap');
    set('[data-roadmap-title]',g.roadmapTitle||'What comes next');
    const ri=$('[data-roadmap-intro]');if(ri)ri.innerHTML=rich(g.roadmapIntro||'');
    mount.innerHTML=`<button class="roadmap-open" type="button"><img src="${path(g.roadmap)}" alt="${esc(g.title)} development roadmap" loading="lazy"><span>Open full roadmap</span></button>`;
    const b=$('.roadmap-open',mount);b.onclick=()=>{const box=document.createElement('dialog');box.className='lightbox roadmap-lightbox';box.innerHTML='<button class="lightbox-close">Close ×</button><img alt="Expanded roadmap">';document.body.append(box);$('img',box).src=$('img',b).src;$('.lightbox-close',box).onclick=()=>box.close();box.onclick=e=>{if(e.target===box)box.close()};box.addEventListener('close',()=>box.remove());box.showModal()};
  }
  function renderUpdates(g){
    const section=$('[data-updates-section]'),mount=$('[data-updates-list]'),updates=(g.updates||[]).filter(u=>u&&u.title);if(!section||!mount)return;
    section.hidden=false;
    if(!updates.length){
      const ue=$('[data-updates-eyebrow]');if(ue)ue.innerHTML=rich(g.updatesEyebrow||'Development updates');
      const ut=$('[data-updates-title]');if(ut)ut.innerHTML=rich(g.updatesTitle||'Latest progress');
      const ui=$('[data-updates-intro]');if(ui)ui.innerHTML=rich(g.updatesIntro||'');
      mount.innerHTML='<div class="media-empty">Development updates coming soon.</div>';
      return;
    }
    const ue=$('[data-updates-eyebrow]');if(ue)ue.innerHTML=rich(g.updatesEyebrow||'Development updates');
    const ut=$('[data-updates-title]');if(ut)ut.innerHTML=rich(g.updatesTitle||'Latest progress');
    const ui=$('[data-updates-intro]');if(ui)ui.innerHTML=rich(g.updatesIntro||'');
    mount.innerHTML=updates.map((u,i)=>`<article class="update-card"><div class="update-index">${String(i+1).padStart(2,'0')}</div><div class="update-content"><div class="update-date">${esc(u.date||'')}</div><h3>${esc(u.title)}</h3><div class="rich-copy">${rich(u.text||'')}</div>${u.link?`<a href="${esc(u.link)}" target="_blank" rel="noopener">Read full update →</a>`:''}</div></article>`).join('');
  }

  function renderGallery(g){
    const gal=$('[data-gallery]');if(!gal)return;
    if(!g.gallery?.length){gal.innerHTML='<div class="media-empty">Gallery coming soon</div>';return}
    gal.innerHTML=g.gallery.map((p,i)=>`<button class="gallery-item" type="button"><img src="${path(p)}" alt="${esc(g.title)} screenshot ${i+1}" loading="lazy"><span>${String(i+1).padStart(2,'0')}</span></button>`).join('');
    const box=document.createElement('dialog');box.className='lightbox';box.innerHTML='<button class="lightbox-close">Close ×</button><img alt="Expanded screenshot">';document.body.append(box);
    const image=$('img',box);$$('.gallery-item',gal).forEach(b=>b.onclick=()=>{image.src=$('img',b).src;image.alt=$('img',b).alt;box.showModal()});$('.lightbox-close',box).onclick=()=>box.close();box.onclick=e=>{if(e.target===box)box.close()};
  }
  function articleCard(a){return `<article class="news-card reveal">${a.cover?`<a class="news-cover" href="${path(a.page)}" style="background-image:url('${path(a.cover)}')"></a>`:''}<div class="news-body"><div class="card-meta">${esc(a.category||'News')} · ${esc(a.date||'')}</div><h3><a href="${path(a.page)}">${esc(a.title)}</a></h3><p>${esc(plain(a.excerpt||''))}</p><a class="card-link" href="${path(a.page)}">Read article →</a></div></article>`}
  function plain(v=''){const d=document.createElement('div');d.innerHTML=String(v);return d.textContent||''}
  function rich(v=''){
    const t=document.createElement('template');t.innerHTML=String(v);
    const allowed=new Set(['B','STRONG','I','EM','U','S','STRIKE','P','DIV','BR','UL','OL','LI','H2','H3','BLOCKQUOTE','A','IFRAME']);
    const safeFrame=src=>{try{const u=new URL(src,location.href);return u.protocol==='https:'&&(/(^|\.)itch\.io$/i.test(u.hostname)||u.hostname==='www.youtube.com'||u.hostname==='www.youtube-nocookie.com'||u.hostname==='player.vimeo.com')}catch{return false}};
    const walk=n=>{[...n.children].forEach(el=>{
      if(!allowed.has(el.tagName)){el.replaceWith(...el.childNodes);return}
      if(el.tagName==='IFRAME'){
        const src=el.getAttribute('src')||'';if(!safeFrame(src)){el.remove();return}
        const keep=new Set(['src','width','height','title','allow','allowfullscreen','loading','frameborder']);
        for(const a of [...el.attributes])if(!keep.has(a.name.toLowerCase()))el.removeAttribute(a.name);
        el.setAttribute('loading','lazy');el.setAttribute('referrerpolicy','no-referrer-when-downgrade');el.setAttribute('sandbox','allow-scripts allow-same-origin allow-popups allow-forms');
      }else for(const a of [...el.attributes]){
        if(el.tagName==='A'&&a.name==='href'){if(!/^(https?:|mailto:|#|\/)/i.test(a.value))el.removeAttribute(a.name)}
        else if(a.name==='style'&&/^(P|DIV|H2|H3|BLOCKQUOTE)$/.test(el.tagName)){const m=a.value.match(/text-align\s*:\s*(left|center|right|justify)/i);if(m)el.setAttribute('style','text-align:'+m[1].toLowerCase());else el.removeAttribute('style')}
        else el.removeAttribute(a.name)
      }
      if(el.tagName==='A'){el.setAttribute('rel','noopener');if(/^https?:/i.test(el.getAttribute('href')||''))el.setAttribute('target','_blank')}
      walk(el)
    })};walk(t.content);return t.innerHTML
  }
  function publishedArticles(){return (D.articles||[]).filter(a=>a.status==='published').sort((a,b)=>String(b.date).localeCompare(String(a.date)))}
  if(page==='news'){const grid=$('[data-news-grid]');if(grid){const articles=publishedArticles(),categories=[...new Set(articles.map(article=>article.category||'News'))];const filter=document.createElement('div');filter.className='news-filter';filter.innerHTML=`<button class="active" data-news-filter="all">All transmissions <span>${articles.length}</span></button>`+categories.map(category=>`<button data-news-filter="${esc(category)}">${esc(category)} <span>${articles.filter(article=>(article.category||'News')===category).length}</span></button>`).join('');grid.before(filter);const draw=category=>{const selected=category==='all'?articles:articles.filter(article=>(article.category||'News')===category);grid.innerHTML=selected.map(articleCard).join('')||'<div class="media-empty">No published articles in this category.</div>';reveal(grid)};filter.querySelectorAll('[data-news-filter]').forEach(button=>button.onclick=()=>{filter.querySelectorAll('button').forEach(item=>item.classList.toggle('active',item===button));draw(button.dataset.newsFilter)});draw('all')}}
  if(page==='home'){const articles=publishedArticles().slice(0,3),section=$('[data-latest-news-section]'),mount=$('[data-latest-news]');if(section&&mount&&articles.length){section.hidden=false;mount.innerHTML=articles.map(articleCard).join('');reveal(mount)}}
  function renderBlocks(blocks,mount){if(!mount)return;mount.innerHTML=(blocks||[]).map(b=>{if(b.type==='heading')return `<h2>${rich(b.text||'')}</h2>`;if(b.type==='image')return b.src?`<figure><img src="${path(b.src)}" alt="" loading="lazy"></figure>`:'';if(b.type==='youtube'){const y=youtubeId(b.url||'');return y?`<a class="video-facade" href="${esc(b.url)}" target="_blank" rel="noopener"><img src="https://i.ytimg.com/vi/${y}/maxresdefault.jpg"><span class="video-play">▶</span></a>`:''}if(b.type==='quote')return `<blockquote>${rich(b.text||'')}</blockquote>`;if(b.type==='button')return `<p><a class="btn primary" href="${esc(b.url||'#')}" target="_blank" rel="noopener">${esc(b.label||'Open')}</a></p>`;if(b.type==='divider')return '<hr>';return `<div class="rich-copy">${rich(b.text||'')}</div>`}).join('')}
  if(page==='article'){const a=(D.articles||[]).find(x=>x.id===document.body.dataset.article);if(a){document.title=`${a.title} — Insiders Corporation`;set('[data-article-category]',a.category);set('[data-article-title]',a.title);const ae=$('[data-article-excerpt]');if(ae)ae.innerHTML=rich(a.excerpt||'');set('[data-article-meta]',`${a.date||''}${a.gameId?' · '+((D.games||[]).find(g=>g.id===a.gameId)?.title||''):''}`);const h=$('[data-article-hero]');if(h&&a.cover)h.style.backgroundImage=`linear-gradient(180deg,rgba(0,0,0,.35),#000),url('${path(a.cover)}')`;renderBlocks(a.blocks,$('[data-article-content]'))}}
  if(page==='custom'){const p=(D.pages||[]).find(x=>x.id===document.body.dataset.customPage);if(p){document.title=`${p.title} — Insiders Corporation`;set('[data-custom-title]',p.title);const ci=$('[data-custom-intro]');if(ci)ci.innerHTML=rich(p.intro||'');renderBlocks(p.blocks,$('[data-custom-content]'))}}

  if(/\/press\.html$/i.test(location.pathname)){
    const title=S.pressTitle||'Press Kit',intro=S.pressIntro||'Official studio information, game descriptions, screenshots and contact links.';
    document.title=`${title} — ${S.name||'Insiders Corporation'}`;
    const h1=$('.page-hero h1'),lead=$('.page-hero p');if(h1)h1.textContent=title;if(lead)lead.textContent=intro;
    const contact=$('.game-facts');if(contact&&S.pressEmail)contact.insertAdjacentHTML('afterbegin',`<dt>Press email</dt><dd><a href="mailto:${esc(S.pressEmail)}">${esc(S.pressEmail)}</a></dd>`);
  }
})();
