/*
 * Currículo Studio 2.1 — Desenvolvedor: Dev Kayko
 * Aplicativo estático para GitHub Pages. Sem bibliotecas, sem servidor e sem rastreamento.
 * Edição rápida: veja FIELDS, COLLECTIONS, DEMO e buildResume() abaixo.
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'devkayko_curriculo_studio_v1';
  const TEMPLATES = ['modern', 'classic', 'executive', 'creative', 'minimal', 'columns', 'elegant', 'tech', 'timeline', 'compact', 'editorial', 'academic'];
  const COLORS = ['#2355d5', '#163d75', '#2774a6', '#0b7a91', '#0f766e', '#127c55', '#657c37', '#248789', '#783bb5', '#6454aa', '#9870b6', '#a74186', '#ba5e72', '#9f344a', '#b63d39', '#a44533', '#bb6633', '#95702a', '#745748', '#263449'];
  const FIELDS = ['fullName', 'jobTitle', 'email', 'phone', 'phoneType', 'city', 'state', 'street', 'addressNumber', 'district', 'zipCode', 'addressComplement', 'linkedin', 'website', 'summary', 'skills', 'additional', 'cnhCategory'];
  const PHONE_TYPES = {whatsapp:'WhatsApp', celular:'Celular', fixo:'Fixo'};
  const CNH_CATEGORIES = ['ACC', 'A', 'B', 'AB', 'AC', 'AD', 'AE', 'C', 'D', 'E'];
  const COLLECTIONS = {
    contacts: [
      {key:'type',label:'Tipo de número',type:'select',options:[{value:'whatsapp',label:'WhatsApp'},{value:'celular',label:'Celular'},{value:'fixo',label:'Telefone fixo'}]},
      {key:'number',label:'Número com DDD',type:'tel',placeholder:'Ex.: (87) 98888-8888',max:40}
    ],
    experience: [
      {key:'role',label:'Cargo / função',placeholder:'Ex.: Assistente administrativo',full:false,max:100},
      {key:'company',label:'Empresa / organização',placeholder:'Ex.: Empresa ABC',full:false,max:120},
      {key:'location',label:'Local',placeholder:'Ex.: Recife, PE',full:false,max:90},
      {key:'start',label:'Início',placeholder:'Ex.: jan/2023',full:false,max:45},
      {key:'end',label:'Término',placeholder:'Ex.: dez/2025',full:false,max:45},
      {key:'current',label:'Trabalho aqui atualmente',type:'checkbox'},
      {key:'description',label:'Atividades e resultados',placeholder:'Atendimento ao cliente\nControle de planilhas\nApoio na gestão de documentos',type:'textarea',full:true,max:2500}
    ],
    education: [
      {key:'degree',label:'Curso / formação',placeholder:'Ex.: Técnico em Administração',full:true,max:140},
      {key:'institution',label:'Instituição',placeholder:'Ex.: Escola Técnica Estadual',full:true,max:140},
      {key:'period',label:'Período / conclusão',placeholder:'Ex.: 2024–2026 / Em andamento',full:true,max:100},
      {key:'details',label:'Detalhes (opcional)',placeholder:'Ênfase, projeto de conclusão, destaques...',type:'textarea',full:true,max:600}
    ],
    courses: [
      {key:'name',label:'Curso / certificação',placeholder:'Ex.: Excel avançado',full:true,max:140},
      {key:'provider',label:'Instituição / emissor',placeholder:'Ex.: SENAC',full:false,max:140},
      {key:'year',label:'Ano / carga horária',placeholder:'Ex.: 2026 • 40 horas',full:false,max:70}
    ],
    languages: [
      {key:'name',label:'Idioma',placeholder:'Ex.: Inglês',full:false,max:80},
      {key:'level',label:'Nível',placeholder:'Ex.: Intermediário',full:false,max:80}
    ],
    projects: [
      {key:'name',label:'Nome do projeto',placeholder:'Ex.: Site de divulgação de serviços',full:true,max:140},
      {key:'context',label:'Onde foi realizado / período',placeholder:'Ex.: Projeto pessoal • 2026',full:true,max:130},
      {key:'description',label:'Descrição e resultados',placeholder:'O que foi desenvolvido e quais habilidades foram utilizadas.',type:'textarea',full:true,max:1200}
    ]
  };
  const LABELS = {contacts:'Contato',experience:'Experiência',education:'Formação',courses:'Curso',languages:'Idioma',projects:'Projeto'};
  const COUNTS = {contacts:'contactsCount',education:'educationCount',courses:'courseCount',languages:'languageCount',projects:'projectCount'};
  const DEMO = {
    fullName:'Mariana Oliveira',jobTitle:'Assistente Administrativa',email:'mariana.exemplo@email.com',phone:'(87) 99999-0000',phoneType:'whatsapp',city:'Arcoverde',state:'PE',street:'Rua das Acácias',addressNumber:'42',district:'Centro',zipCode:'',addressComplement:'',showFullAddress:true,contacts:[{type:'fixo',number:'(87) 3821-0000'}],hasCnh:true,cnhCategory:'B',cnhEar:false,linkedin:'linkedin.com/in/mariana-exemplo',website:'',
    summary:'Profissional organizada, comunicativa e dedicada, com experiência em atendimento ao público, rotinas administrativas e apoio a equipes. Busca contribuir para a eficiência dos processos e a qualidade do atendimento.',
    experience:[
      {role:'Assistente Administrativa',company:'Empresa Exemplo',location:'Arcoverde, PE',start:'2023',end:'2025',current:false,description:'Organização de documentos e atualização de cadastros.\nAtendimento a clientes por telefone e presencialmente.\nAcompanhamento de planilhas e relatórios internos.'},
      {role:'Auxiliar de Atendimento',company:'Loja Modelo',location:'Arcoverde, PE',start:'2021',end:'2022',current:false,description:'Atendimento aos clientes e suporte à equipe de vendas.\nControle e organização do estoque.'}
    ],
    education:[{degree:'Técnico em Administração',institution:'Escola Técnica Exemplo',period:'2023–2025',details:''}],
    courses:[{name:'Excel e ferramentas de escritório',provider:'Instituição Exemplo',year:'2025 • 40 horas'}],
    skills:'Atendimento ao cliente, Organização, Microsoft Excel, Comunicação, Trabalho em equipe, Rotinas administrativas',
    additional:'Disponibilidade para contratação imediata.',
    languages:[{name:'Português',level:'Nativo'},{name:'Inglês',level:'Básico'}],
    projects:[],template:'modern',color:'#2355d5',fontSize:100,showPhoto:false,photo:''
  };

  const $ = id => document.getElementById(id);
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const cleanText = (v,max=2500) => typeof v === 'string' ? v.slice(0,max) : '';
  const cleanPhoto = v => typeof v === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v) && v.length < 650000 ? v : '';
  // A cor personalizada é validada como HEX (#RRGGBB), inclusive ao importar backup.
  function blendHex(a,b,ratio){
    const out=[1,3,5].map(i=>{
      const x=parseInt(a.slice(i,i+2),16),y=parseInt(b.slice(i,i+2),16);
      return Math.round(x*(1-ratio)+y*ratio).toString(16).padStart(2,'0');
    });
    return '#'+out.join('');
  }
  function luminance(hex){
    const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
    const c=rgb.map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));
    return c[0]*.2126+c[1]*.7152+c[2]*.0722;
  }
  function contrast(a,b){
    const l1=luminance(a),l2=luminance(b);
    return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
  }
  function accentForText(hex){
    let result=hex;
    for(let n=0;n<12 && contrast(result,'#ffffff')<4.5;n++)result=blendHex(result,'#102033',.14);
    return result;
  }
  const blankState = () => ({...Object.fromEntries(FIELDS.map(x=>[x,''])),...Object.fromEntries(Object.keys(COLLECTIONS).map(x=>[x,[]])),showFullAddress:false,hasCnh:false,cnhEar:false,template:'modern',color:COLORS[0],fontSize:100,showPhoto:false,photo:''});
  let state = blankState();
  let toastTimeout = null;
  let saveTimeout = null;
  let manualZoom = 0;

  function normalize(data){
    const output = blankState();
    if (!data || typeof data !== 'object' || Array.isArray(data)) return output;
    for(const f of FIELDS) output[f] = cleanText(data[f],f==='summary'||f==='additional'?2200:1600);
    output.phoneType = Object.hasOwn(PHONE_TYPES, output.phoneType) ? output.phoneType : '';
    output.cnhCategory = CNH_CATEGORIES.includes(output.cnhCategory) ? output.cnhCategory : '';
    output.showFullAddress = data.showFullAddress === true;
    output.hasCnh = data.hasCnh === true;
    output.cnhEar = data.cnhEar === true;
    for(const [collection, schema] of Object.entries(COLLECTIONS)){
      output[collection] = Array.isArray(data[collection]) ? data[collection].slice(0,30).map(item => {
        const row={};
        for(const f of schema) row[f.key] = f.type==='checkbox' ? item?.[f.key]===true : f.type==='select' ? (f.options.some(o=>o.value===item?.[f.key])?item[f.key]:f.options[0].value) : cleanText(item?.[f.key],f.max||250);
        return row;
      }) : [];
    }
    output.template=TEMPLATES.includes(data.template)?data.template:'modern';
    output.color=typeof data.color==='string' && /^#[0-9a-fA-F]{6}$/.test(data.color)?data.color.toLowerCase():COLORS[0];
    output.fontSize=[90,95,100,105,110].includes(Number(data.fontSize))?Number(data.fontSize):100;
    output.showPhoto=data.showPhoto===true;
    output.photo=cleanPhoto(data.photo);
    return output;
  }

  function loadSaved(){
    try {const saved=localStorage.getItem(STORAGE_KEY);if(saved)state=normalize(JSON.parse(saved));}
    catch(e){console.warn('Não foi possível ler os dados locais:',e);}
  }
  function queueSave(){
    $('saveStatus').textContent='Salvando alterações...';
    clearTimeout(saveTimeout);
    saveTimeout=setTimeout(() => {
      try {localStorage.setItem(STORAGE_KEY,JSON.stringify(state));$('saveStatus').textContent='Salvo neste navegador';}
      catch(e){$('saveStatus').textContent='Armazenamento indisponível';notify('O navegador não conseguiu salvar. Faça um backup em JSON.',5000);}
    },330);
  }
  function notify(message,ms=3300){
    const el=$('toast');el.textContent=message;el.classList.add('is-visible');
    clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('is-visible'),ms);
  }

  function renderForm(){
    for(const f of FIELDS) $(f).value=state[f];
    for(const key of Object.keys(COLLECTIONS)) renderRepeater(key);
    $('showFullAddress').checked=state.showFullAddress;
    $('hasCnh').checked=state.hasCnh;
    $('cnhEar').checked=state.cnhEar;
    $('cnhOptions').hidden=!state.hasCnh;
    renderSettings();updateProgress();renderResume();
  }
  function renderSettings(){
    document.querySelectorAll('[data-template]').forEach(btn=>{
      const active=btn.dataset.template===state.template;btn.classList.toggle('is-selected',active);btn.setAttribute('aria-pressed',String(active));
    });
    document.querySelectorAll('[data-color]').forEach(btn=>{
      const active=btn.dataset.color===state.color;btn.classList.toggle('is-selected',active);btn.setAttribute('aria-pressed',String(active));
    });
    $('customColorPicker').value=state.color; $('customColorValue').textContent=state.color.toUpperCase();
    $('fontSize').value=state.fontSize;$('fontSizeValue').textContent=state.fontSize+'%';
    $('showPhoto').checked=state.showPhoto;$('photoSettings').hidden=!state.showPhoto;
    $('photoStatus').textContent=state.photo?'Foto selecionada':'Nenhuma foto escolhida';
  }
  function renderRepeater(collection){
    const target=$(collection+'List');
    const fields=COLLECTIONS[collection];
    target.innerHTML=state[collection].map((item,index)=>`<div class="repeat-card" data-collection="${collection}" data-index="${index}">
      <div class="repeat-card-top"><strong>${escapeHtml(LABELS[collection])} ${index+1}</strong><button type="button" class="remove-item" data-remove="${collection}" data-index="${index}" aria-label="Remover ${escapeHtml(LABELS[collection])} ${index+1}">Remover</button></div>
      <div class="repeat-grid">${fields.map(f=>{
        if(f.type==='checkbox')return `<label class="check-field"><input type="checkbox" data-item-field="${f.key}" ${item[f.key]?'checked':''}><span>${escapeHtml(f.label)}</span></label>`;
        if(f.type==='select')return `<label class="field"><span>${escapeHtml(f.label)}</span><select data-item-field="${f.key}">${f.options.map(opt=>`<option value="${escapeHtml(opt.value)}" ${item[f.key]===opt.value?'selected':''}>${escapeHtml(opt.label)}</option>`).join('')}</select></label>`;
        const disabled=collection==='experience'&&f.key==='end'&&item.current;
        return `<label class="field ${f.full?'full':''}"><span>${escapeHtml(f.label)}</span>${f.type==='textarea'
          ? `<textarea data-item-field="${f.key}" maxlength="${f.max||2500}" rows="3" placeholder="${escapeHtml(f.placeholder)}">${escapeHtml(item[f.key])}</textarea>`
          : `<input type="${f.type==='tel'?'tel':'text'}" ${f.type==='tel'?'inputmode="tel"':''} data-item-field="${f.key}" maxlength="${f.max||250}" value="${escapeHtml(item[f.key])}" placeholder="${escapeHtml(f.placeholder)}" ${disabled?'disabled':''}>`}</label>`;
      }).join('')}</div></div>`).join('');
    const countId=COUNTS[collection];if(countId)$(countId).textContent=state[collection].length+' '+(state[collection].length===1?'item':'itens');
  }

  function showTab(name){
    document.querySelectorAll('[data-tab]').forEach(btn=>{
      const active=btn.dataset.tab===name;btn.classList.toggle('is-active',active);btn.setAttribute('aria-selected',String(active));
    });
    document.querySelectorAll('.tab-panel').forEach(panel=>{
      const active=panel.id==='panel-'+name;panel.hidden=!active;panel.classList.toggle('is-active',active);
    });
  }
  function nonEmpty(item){return item&&Object.entries(item).some(([key,value])=>!['current','type'].includes(key)&&String(value||'').trim().length>0);}
  function updateProgress(){
    const essentials=['fullName','jobTitle','email','city','summary','skills'];
    let completed=essentials.filter(key=>state[key].trim()).length;
    completed+=(state.phone.trim()||state.contacts.some(item=>item.number.trim()))?1:0;
    completed+=state.experience.some(nonEmpty)?1:0;
    completed+=state.education.some(nonEmpty)?1:0;
    completed+=state.courses.some(nonEmpty)?1:0;
    const pct=Math.round(completed/10*100);
    $('progressFill').style.width=pct+'%';$('progressText').textContent=pct+'% preenchido';
  }
  const plain = value => escapeHtml(value?.trim()||'');
  function lines(raw){return String(raw||'').split(/\r?\n/g).map(x=>x.trim().replace(/^[-•*]\s*/,'' )).filter(Boolean);}
  function bullets(raw){
    const items=lines(raw);return items.length?`<ul class="cv-bullets">${items.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`:'';
  }
  function section(title,content){return content?`<section class="cv-section"><h2 class="cv-section-title">${escapeHtml(title)}</h2>${content}</section>`:'';}
  function dateRange(start,end,current){return [start,current?'Atual':end].filter(Boolean).map(plain).join(' – ');}
  function resumeEntry({title,subtitle,period,description,asBullets=false}){
    if(![title,subtitle,period,description].some(x=>String(x||'').trim()))return '';
    return `<div class="cv-entry"><div class="cv-entry-head"><h3 class="cv-entry-title">${plain(title)}</h3>${period?`<span class="cv-entry-date">${escapeHtml(period)}</span>`:''}</div>${subtitle?`<div class="cv-entry-subtitle">${plain(subtitle)}</div>`:''}${description?(asBullets?bullets(description):`<div class="cv-entry-info">${plain(description)}</div>`):''}</div>`;
  }
  function renderResume(){
    const paper=$('resumePaper');
    paper.className='resume-paper template-'+state.template;
    paper.style.setProperty('--resume-accent',state.color);
    const accentInk=accentForText(state.color);
    paper.style.setProperty('--resume-accent-ink',accentInk);
    paper.style.setProperty('--resume-accent-soft',blendHex(state.color,'#ffffff',.93));
    paper.style.setProperty('--resume-accent-dark',blendHex(accentInk,'#102033',.22));
    paper.style.setProperty('--resume-accent-on',contrast(state.color,'#ffffff')>=4.5?'#ffffff':'#17243b');
    paper.style.setProperty('--font-scale',String(state.fontSize/100));
    const name=state.fullName.trim();
    const nameDisplay=name?plain(name):'<span class="cv-muted">Seu nome completo</span>';
    const role=state.jobTitle.trim()?plain(state.jobTitle):'<span class="cv-placeholder-role">Sua área profissional</span>';
    // Mantém cidade/UF como padrão; o endereço detalhado só aparece com autorização.
    const cityUF=[state.city.trim(),state.state.trim()].filter(Boolean).join(' / ');
    const detailed=[state.street.trim(),state.addressNumber.trim()].filter(Boolean).join(', ');
    const fullAddress=[detailed,state.addressComplement.trim(),state.district.trim(),cityUF,state.zipCode.trim()].filter(Boolean).join(' • ');
    const location=state.showFullAddress && [state.street,state.addressNumber,state.district,state.zipCode,state.addressComplement].some(s=>s.trim()) ? fullAddress : cityUF;
    const labelNumber=(type,number)=>`${PHONE_TYPES[type]||'Contato'}: ${number.trim()}`;
    const contactNumbers=[
      state.phone.trim()?labelNumber(state.phoneType,state.phone):'',
      ...state.contacts.filter(x=>x.number.trim()).map(x=>labelNumber(x.type,x.number))
    ].filter(Boolean);
    const contacts=[location,...contactNumbers,state.email,state.linkedin,state.website].map(x=>x.trim()).filter(Boolean);
    const photo=state.showPhoto&&state.photo?`<img class="cv-photo" src="${escapeHtml(state.photo)}" alt="Foto de perfil">`:'';
    const header=`<header class="cv-header"><div class="cv-profile"><h1>${nameDisplay}</h1><div class="cv-role">${role}</div>${contacts.length?`<div class="cv-contacts">${contacts.map(x=>`<span class="cv-contact">${escapeHtml(x)}</span>`).join('')}</div>`:''}</div>${photo}</header>`;
    const summary=state.summary.trim()?section('Perfil profissional',`<p class="cv-summary">${plain(state.summary)}</p>`):'';
    const experience=state.experience.filter(nonEmpty).map(x=>resumeEntry({title:x.role,subtitle:[x.company,x.location].filter(Boolean).join(' • '),period:dateRange(x.start,x.end,x.current),description:x.description,asBullets:true})).join('');
    const education=state.education.filter(nonEmpty).map(x=>resumeEntry({title:x.degree,subtitle:x.institution,period:x.period,description:x.details})).join('');
    const courses=state.courses.filter(nonEmpty).map(x=>resumeEntry({title:x.name,subtitle:x.provider,period:x.year})).join('');
    const skills=state.skills.split(/[,;\n]/g).map(x=>x.trim()).filter(Boolean).slice(0,80);
    const skillsHtml=skills.length?`<div class="cv-chip-list">${skills.map(x=>`<span class="cv-chip">${escapeHtml(x)}</span>`).join('')}</div>`:'';
    const langs=state.languages.filter(nonEmpty).map(x=>`<div class="cv-language"><strong>${plain(x.name)}</strong>${x.level?` <span>— ${plain(x.level)}</span>`:''}</div>`).join('');
    const projects=state.projects.filter(nonEmpty).map(x=>resumeEntry({title:x.name,subtitle:x.context,description:x.description,asBullets:false})).join('');
    const cnh=state.hasCnh ? `CNH${state.cnhCategory?' — Categoria '+state.cnhCategory:''}${state.cnhEar?' • EAR':''}` : '';
    const addition=[cnh,state.additional.trim()].filter(Boolean).map(x=>`<div class="cv-entry-info">${plain(x)}</div>`).join('');
    const blocks={
      summary, experience:section('Experiência profissional',experience),education:section('Formação acadêmica',education),
      courses:section('Cursos e certificações',courses),skills:section('Competências',skillsHtml),
      languages:section('Idiomas',langs?`<div class="cv-languages">${langs}</div>`:''),
      projects:section('Projetos e realizações',projects),additional:section('Informações adicionais',addition)
    };
    const mainContent=['summary','experience','education','courses','skills','languages','projects','additional'].map(key=>blocks[key]).join('');
    // Apenas modelos que têm barra lateral recebem duas colunas reais.
    // A estrutura já é a mesma usada pelo PDF/versão impressa (sem canvas nem imagem rasterizada).
    const split=['columns','tech'].includes(state.template);
    const content=split
      ? `<div class="cv-content cv-layout-grid"><div class="cv-main">${['summary','experience','education','projects'].map(key=>blocks[key]).join('')}</div><aside class="cv-sidebar">${['skills','courses','languages','additional'].map(key=>blocks[key]).join('')}</aside></div>`
      : `<div class="cv-content">${mainContent}</div>`;
    $('resumeBody').innerHTML=header+(mainContent?content:'<div class="cv-content"><div class="cv-empty"><p>Seu currículo aparecerá aqui<br>conforme você preencher os campos.</p></div></div>');
    requestAnimationFrame(resizePreview);
  }
  function resizePreview(){
    const viewport=$('previewViewport');if(!viewport)return;
    const width=viewport.clientWidth;const fullWidth=793.7008;
    const auto=Math.min(1,Math.max(.35,(width-6)/fullWidth));
    const factor=Math.max(.35,Math.min(1.5,auto+manualZoom));
    $('resumePaper').style.zoom=String(factor);
    $('paperOuter').style.width=Math.round(fullWidth*factor)+'px';
    viewport.style.overflowX=factor>auto+.01?'auto':'hidden';
    $('zoomLabel').textContent=manualZoom===0?'Auto':Math.round(factor*100)+'%';
  }
  function preparePrint(){
    if(!state.fullName.trim()) {showTab('dados');$('fullName').focus();notify('Preencha o nome completo antes de imprimir ou salvar em PDF.');return false;}
    return true;
  }
  function saveJson(){
    const payload={...state,version:'2.1',exportedAt:new Date().toISOString()};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    const safeName=(state.fullName||'novo-cliente').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,55)||'novo-cliente';
    a.href=url;a.download=`curriculo-${safeName}-backup.json`;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    notify('Backup salvo. Guarde o arquivo JSON para editar o currículo novamente.');
  }
  function showNewDialog(){
    const dialog=$('confirmDialog');
    if(typeof dialog.showModal==='function')dialog.showModal();
    else if(window.confirm('Apagar os dados atuais e começar novo currículo?'))resetState();
  }
  function resetState(){
    clearTimeout(saveTimeout);state=blankState();manualZoom=0;
    try {localStorage.removeItem(STORAGE_KEY);} catch(e){console.warn(e);}
    showTab('dados');renderForm();resizePreview();$('saveStatus').textContent='Novo currículo';notify('Pronto! Formulário limpo para o próximo cliente.');
  }
  function attachEvents(){
    document.querySelectorAll('[data-field]').forEach(input=>input.addEventListener('input',()=>{
      state[input.dataset.field]=input.value;updateProgress();renderResume();queueSave();
    }));
    $('showFullAddress').addEventListener('change',e=>{state.showFullAddress=e.target.checked;renderResume();queueSave();});
    $('hasCnh').addEventListener('change',e=>{state.hasCnh=e.target.checked;$('cnhOptions').hidden=!state.hasCnh;renderResume();queueSave();});
    $('cnhEar').addEventListener('change',e=>{state.cnhEar=e.target.checked;renderResume();queueSave();});
    document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>showTab(btn.dataset.tab)));
    document.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',()=>{
      const key=btn.dataset.add;if(state[key].length>=30){notify('Limite de 30 registros nessa seção.');return;}
      const row=Object.fromEntries(COLLECTIONS[key].map(f=>[f.key,f.type==='checkbox'?false:f.type==='select'?f.options[0].value:'']));
      state[key].push(row);renderRepeater(key);updateProgress();queueSave();
      const last=$(key+'List').lastElementChild;last?.querySelector('input:not([type=checkbox]),textarea')?.focus();
    }));
    document.querySelectorAll('.repeater').forEach(list=>{
      list.addEventListener('input',event=>{
        const field=event.target.closest('[data-item-field]');if(!field||field.type==='checkbox')return;
        const card=field.closest('[data-collection]');if(!card)return;
        state[card.dataset.collection][Number(card.dataset.index)][field.dataset.itemField]=field.value;
        updateProgress();renderResume();queueSave();
      });
      list.addEventListener('change',event=>{
        const field=event.target.closest('[data-item-field]');if(!field||field.type!=='checkbox')return;
        const card=field.closest('[data-collection]');if(!card)return;
        const item=state[card.dataset.collection][Number(card.dataset.index)];
        item[field.dataset.itemField]=field.checked;
        renderRepeater(card.dataset.collection);updateProgress();renderResume();queueSave();
      });
      list.addEventListener('click',event=>{
        const button=event.target.closest('[data-remove]');if(!button)return;
        const key=button.dataset.remove;state[key].splice(Number(button.dataset.index),1);
        renderRepeater(key);updateProgress();renderResume();queueSave();
        notify('Item removido do currículo.');
      });
    });
    document.querySelectorAll('[data-template]').forEach(btn=>btn.addEventListener('click',()=>{
      state.template=btn.dataset.template;renderSettings();renderResume();queueSave();
    }));
    document.querySelectorAll('[data-color]').forEach(btn=>btn.addEventListener('click',()=>{
      state.color=btn.dataset.color;renderSettings();renderResume();queueSave();
    }));
    // A seleção de tonalidade própria não depende de pertencer à paleta predefinida.
    $('customColorPicker').addEventListener('input',event=>{
      const chosen=event.target.value;
      if(!/^#[0-9a-fA-F]{6}$/.test(chosen))return;
      state.color=chosen.toLowerCase();renderSettings();renderResume();queueSave();
    });
    $('fontSize').addEventListener('input',event=>{
      state.fontSize=Number(event.target.value);$('fontSizeValue').textContent=state.fontSize+'%';renderResume();queueSave();
    });
    $('showPhoto').addEventListener('change',event=>{
      state.showPhoto=event.target.checked;renderSettings();renderResume();queueSave();
    });
    $('uploadPhotoBtn').addEventListener('click',()=>$('photoInput').click());
    $('removePhotoBtn').addEventListener('click',()=>{state.photo='';$('photoInput').value='';renderSettings();renderResume();queueSave();});
    $('photoInput').addEventListener('change',async event=>{
      const file=event.target.files?.[0];if(!file)return;
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){notify('Use uma foto JPG, PNG ou WebP de até 5 MB.');return;}
      try{
        const imageUrl=URL.createObjectURL(file);const img=new Image();
        await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=imageUrl;});
        URL.revokeObjectURL(imageUrl);
        const canvas=document.createElement('canvas');canvas.width=400;canvas.height=480;
        const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas indisponível');
        const scale=Math.max(canvas.width/img.width,canvas.height/img.height);
        const w=img.width*scale,h=img.height*scale;
        ctx.drawImage(img,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
        state.photo=canvas.toDataURL('image/jpeg',.79);state.showPhoto=true;
        renderSettings();renderResume();queueSave();notify('Foto adicionada. Ela ficará salva apenas neste navegador.');
      }catch(e){console.error(e);notify('Não foi possível abrir a foto. Tente outra imagem.');}
      finally{event.target.value='';}
    });
    $('zoomOutBtn').addEventListener('click',()=>{manualZoom=Math.max(-.4,Number((manualZoom-.1).toFixed(2)));resizePreview();});
    $('zoomInBtn').addEventListener('click',()=>{manualZoom=Math.min(.5,Number((manualZoom+.1).toFixed(2)));resizePreview();});
    $('printBtn').addEventListener('click',()=>{if(preparePrint())window.print();});
    $('pdfBtn').addEventListener('click',()=>{
      if(!preparePrint())return;
      notify('Na janela que abrir, selecione “Salvar como PDF” no destino e confirme.',6000);
      window.print();
    });
    $('backupBtn').addEventListener('click',saveJson);
    $('importBtn').addEventListener('click',()=>$('importInput').click());
    $('importInput').addEventListener('change',async event=>{
      const file=event.target.files?.[0];if(!file)return;
      try{
        if(file.size>1000000)throw Error('Arquivo muito grande');
        const json=JSON.parse(await file.text());
        if(!json||typeof json!=='object'||Array.isArray(json)||!FIELDS.some(f=>typeof json[f]==='string'))throw Error('Formato inválido');
        if(hasData()&&!window.confirm('Importar este backup vai substituir os dados atuais. Continuar?'))return;
        state=normalize(json);showTab('dados');renderForm();queueSave();notify('Backup importado com sucesso.');
      }catch(e){console.error(e);notify('Backup inválido. Selecione um arquivo JSON criado pelo Currículo Studio.');}
      finally{event.target.value='';}
    });
    $('demoBtn').addEventListener('click',()=>{
      if(hasData()&&!window.confirm('Carregar o exemplo vai substituir os dados atuais. Continuar?'))return;
      state=normalize(DEMO);showTab('dados');renderForm();queueSave();notify('Exemplo fictício carregado. Personalize antes de entregar ao cliente.');
    });
    $('newBtn').addEventListener('click',()=>{if(!hasData())resetState();else showNewDialog();});
    $('confirmDialog').addEventListener('close',()=>{if($('confirmDialog').returnValue==='confirm')resetState();});
    $('privacyBtn').addEventListener('click',()=>{$('privacyDialog').showModal();});
    window.addEventListener('resize',resizePreview);
    window.addEventListener('beforeprint',()=>{ /* No hidden form fields or branding printed */ });
  }
  function hasData(){return FIELDS.some(f=>state[f].trim())||Object.keys(COLLECTIONS).some(k=>state[k].some(nonEmpty))||state.showFullAddress||state.hasCnh||state.cnhEar||!!state.photo;}
  function init(){
    loadSaved();$('currentYear').textContent=String(new Date().getFullYear());
    attachEvents();renderForm();requestAnimationFrame(resizePreview);
    if(hasData())$('saveStatus').textContent='Rascunho recuperado deste navegador';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
