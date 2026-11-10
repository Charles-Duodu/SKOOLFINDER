/** SkoolFinder six-section public Parents page — OFFLINE DESIGN PROTOTYPE.
 * All example school records are fictional. No live site, API, account or analytics traffic.
 */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const schools = [
    {id:'s1',name:'Cedar Grove Learning House',area:'East Legon',level:['Preschool','Primary'],curriculum:['Montessori'],image:'assets/school-early.jpg',feature:'Early years focus',detail:'Example profile: play-based early learning, small-group activities and a welcoming family environment.'},
    {id:'s2',name:'Golden Horizon Academy',area:'Tema',level:['Primary','Junior high'],curriculum:['Ghana national'],image:'assets/school-campus.jpg',feature:'Primary & JHS',detail:'Example profile: Ghana national curriculum, outdoor activities and school-to-family communication.'},
    {id:'s3',name:'Bluebell International School',area:'Spintex',level:['Primary','Junior high'],curriculum:['Cambridge'],image:'assets/school-stem.jpg',feature:'International curriculum',detail:'Example profile: Cambridge learning pathway, collaborative projects and enrichment activities.'},
    {id:'s4',name:'Palmview Early Learning Centre',area:'Adenta',level:['Preschool'],curriculum:['Montessori'],image:'assets/school-early.jpg',feature:'Preschool',detail:'Example profile: early literacy, exploratory learning and outdoor play.'},
    {id:'s5',name:'Harbour Heights School',area:'Tema',level:['Junior high','Senior high'],curriculum:['Ghana national'],image:'assets/school-campus.jpg',feature:'JHS & SHS',detail:'Example profile: subject options, study skills and student development.'},
    {id:'s6',name:'Hillcrest Learning Academy',area:'Madina',level:['Primary','Junior high'],curriculum:['Ghana national','Cambridge'],image:'assets/school-stem.jpg',feature:'Flexible pathways',detail:'Example profile: combined learning programmes, student clubs and family engagement.'}
  ];
  const filters = {
    level:['Preschool','Primary','Junior high','Senior high'],
    curriculum:['Ghana national','Montessori','Cambridge'],
    area:['East Legon','Tema','Spintex','Adenta','Madina']
  };
  const state={tab:'level',q:'',level:'',curriculum:'',area:'',showAll:false,comparison:new Set(),bookmarks:new Set()};
  const STORAGE_COMPARE = 'skoolfinder_guest_comparison_v3';
  const STORAGE_BOOKMARKS = 'skoolfinder_guest_bookmarks_v3';

  function loadSavedState(){
    try {
      const rawComp = localStorage.getItem(STORAGE_COMPARE);
      if(rawComp) {
        const arr = JSON.parse(rawComp);
        if(Array.isArray(arr)) arr.forEach(id => { if(schools.some(s=>s.id===id)) state.comparison.add(id); });
      }
    } catch(e) {}
    try {
      const rawBm = localStorage.getItem(STORAGE_BOOKMARKS);
      if(rawBm) {
        const arr = JSON.parse(rawBm);
        if(Array.isArray(arr)) arr.forEach(id => { if(schools.some(s=>s.id===id)) state.bookmarks.add(id); });
      }
    } catch(e) {}
  }

  function saveState(){
    try {
      localStorage.setItem(STORAGE_COMPARE, JSON.stringify([...state.comparison]));
      localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify([...state.bookmarks]));
    } catch(e) {}
    updateGuestSyncStatus();
  }

  function updateGuestSyncStatus(){
    const count = state.bookmarks.size;
    const compCount = state.comparison.size;
    const el = $('#guestShortlistCount');
    const pill = $('#guestSyncStatus');
    if(el) {
      if(count > 0 || compCount > 0) {
        el.textContent = `${count} shortlisted · ${compCount} in compare`;
        if(pill) pill.classList.add('active');
      } else {
        el.textContent = '0 saved';
        if(pill) pill.classList.remove('active');
      }
    }
  }

  function toggleBookmark(id){
    if(state.bookmarks.has(id)){
      state.bookmarks.delete(id);
    } else {
      state.bookmarks.add(id);
    }
    saveState();
    renderSchools();
  }

  const maxCompare=()=>window.matchMedia('(max-width: 680px)').matches?2:4;
  const escapeHTML=(str)=>String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dialog=$('#infoDialog');
  function showDialog(title,content,kicker='DESIGN PREVIEW'){
    $('#dialogTitle').textContent=title;
    $('#dialogEyebrow').textContent=kicker;
    $('#dialogContent').innerHTML=content;
    if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');
  }
  function closeDialog(){if(dialog.close && dialog.open)dialog.close();else dialog.removeAttribute('open')}
  $('#dialogX').addEventListener('click',closeDialog);
  $('#dialogClose').addEventListener('click',closeDialog);
  dialog.addEventListener('click',e=>{if(e.target===dialog)closeDialog()});
  $('#dismissRibbon').addEventListener('click',()=>$('#previewRibbon').remove());
  const menu=$('#mobileNav'), toggle=$('#menuToggle');
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));toggle.setAttribute('aria-label',open?'Open navigation':'Close navigation');menu.hidden=open});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false')}));
  function match(s){
    const t=state.q.toLowerCase().trim();
    const haystack=[s.name,s.area,...s.level,...s.curriculum].join(' ').toLowerCase();
    return (!t||haystack.includes(t))&&(!state.level||s.level.includes(state.level))&&(!state.curriculum||s.curriculum.includes(state.curriculum))&&(!state.area||s.area===state.area);
  }
  function renderSchools(){
    const filtered=schools.filter(match);
    const show=state.showAll||state.q||state.level||state.curriculum||state.area?filtered:filtered.slice(0,3);
    const grid=$('#schoolsGrid');
    grid.innerHTML=show.length?show.map(s=>{
      const selected=state.comparison.has(s.id);
      const bookmarked=state.bookmarks.has(s.id);
      return `<article class="school-card">
        <div class="school-image">
          <img src="${s.image}" alt="Illustrative educational environment, not a photo of a named school" loading="lazy">
          <span class="school-tag">FICTIONAL EXAMPLE</span>
          <button type="button" class="card-bookmark-btn ${bookmarked ? 'saved' : ''}" data-bookmark="${s.id}" aria-label="${bookmarked ? 'Remove from shortlist' : 'Save to shortlist'}" title="${bookmarked ? 'Saved to shortlist' : 'Save to shortlist'}">${bookmarked ? '♥' : '♡'}</button>
        </div>
        <div class="school-body">
          <h3>${escapeHTML(s.name)}</h3>
          <p class="school-location"><span aria-hidden="true">⌖</span> ${escapeHTML(s.area)}, Greater Accra</p>
          <div class="school-facts"><span>${escapeHTML(s.level.join(' · '))}</span><span>${escapeHTML(s.curriculum.join(' · '))}</span></div>
          <div class="school-meta">${escapeHTML(s.feature)} · Fees not supplied</div>
        </div>
        <div class="school-actions">
          <button type="button" data-school="${s.id}" class="primary">View sample profile ↗</button>
          <button type="button" data-compare="${s.id}" aria-pressed="${selected}">${selected?'✓ Added':'↔ Compare'}</button>
        </div>
      </article>`;
    }).join(''):`<div class="empty-state"><h3>No matching demonstration schools</h3><p>Try removing a filter or choosing another category. These are fictional examples, not a live school directory.</p><button type="button" class="btn btn-navy" id="clearFilters">Clear filters</button></div>`;
    const msg=$('#resultMessage');
    msg.textContent=filtered.length?`${show.length} of ${filtered.length} fictional school example${filtered.length===1?'':'s'} shown.`:'No fictional examples match those criteria.';
    grid.querySelector('#clearFilters')?.addEventListener('click',clearFilters);
    grid.querySelectorAll('[data-school]').forEach(b=>b.addEventListener('click',()=>showProfile(b.dataset.school)));
    grid.querySelectorAll('[data-compare]').forEach(b=>b.addEventListener('click',()=>toggleCompare(b.dataset.compare)));
    grid.querySelectorAll('[data-bookmark]').forEach(b=>b.addEventListener('click',(e)=>{e.stopPropagation();toggleBookmark(b.dataset.bookmark)}));
  }
  function clearFilters(){
    state.q='';state.level='';state.curriculum='';state.area='';state.showAll=false;
    $('#query').value='';$('#level').value='';$('#curriculum').value='';renderSchools();
  }
  function renderChips(){
    $('#quickChips').innerHTML=filters[state.tab].map(v=>`<button type="button" data-filter="${escapeHTML(v)}">${escapeHTML(v)}</button>`).join('');
    $('#quickChips').querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
      const v=b.dataset.filter;
      if(state.tab==='level'){$('#level').value=v;state.level=v}
      else if(state.tab==='curriculum'){$('#curriculum').value=v;state.curriculum=v}
      else {state.area=v;$('#query').value=v;state.q=''}
      state.showAll=true;renderSchools();$('#compare').scrollIntoView({behavior:'smooth'});
    }));
  }
  document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>changeTab(b.dataset.tab)));
  function changeTab(tab){
    state.tab=tab;
    document.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab===tab;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1});
    $('#quickPanel').setAttribute('aria-labelledby','tab-'+tab);renderChips();
  }
  document.querySelector('.tab-group').addEventListener('keydown',e=>{
    if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();
    const keys=['level','curriculum','area'];let i=keys.indexOf(state.tab);
    i=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;
    changeTab(keys[i]);$('#tab-'+keys[i]).focus();
  });
  $('#schoolSearch').addEventListener('submit',e=>{
    e.preventDefault();state.q=$('#query').value.trim();state.level=$('#level').value;state.curriculum=$('#curriculum').value;state.area='';state.showAll=true;
    renderSchools();$('#compare').scrollIntoView({behavior:'smooth'});
  });
  $('#viewAll').addEventListener('click',()=>{clearFilters();state.showAll=true;renderSchools();$('#compare').scrollIntoView({behavior:'smooth'})});
  $('#resetSchools').addEventListener('click',()=>{clearFilters();state.showAll=true;renderSchools()});
  function showProfile(id){
    const s=schools.find(x=>x.id===id);if(!s)return;
    showDialog(s.name,`<p><strong>Fictional demonstration profile — not a real school listing.</strong></p><p><strong>Location:</strong> ${escapeHTML(s.area)}, Greater Accra<br><strong>Levels:</strong> ${escapeHTML(s.level.join(', '))}<br><strong>Curriculum:</strong> ${escapeHTML(s.curriculum.join(', '))}</p><p>${escapeHTML(s.detail)}</p><p>No real fees, admissions status, school contact details or licensing claims are provided in this concept.</p>`,'SAMPLE PROFILE');
  }
  function toggleCompare(id){
    if(state.comparison.has(id)){state.comparison.delete(id)}
    else if(state.comparison.size>=maxCompare()){
      showDialog('Comparison limit reached',`<p>You can compare up to <strong>${maxCompare()}</strong> illustrative schools in this preview at your current screen width. Remove one to add another.</p>`);return;
    }else state.comparison.add(id);
    saveState();
    renderSchools();renderDock();
  }
  function renderDock(){
    const count=state.comparison.size;$('#compareDock').hidden=count===0;$('#dockCount').textContent=`${count} school${count===1?'':'s'} selected`;
  }
  $('#clearCompare').addEventListener('click',()=>{state.comparison.clear();saveState();renderSchools();renderDock()});
  function showCompare(){
    const selected=[...state.comparison].map(id=>schools.find(s=>s.id===id)).filter(Boolean);
    if(!selected.length){showDialog('Choose schools to compare','<p>Use the Compare button on the fictional school cards to build a sample side-by-side comparison. No account is needed in this demonstration.</p>');return}
    const row=(label,f)=>`<tr><th>${label}</th>${selected.map(s=>`<td>${escapeHTML(f(s))}</td>`).join('')}</tr>`;
    showDialog('Your example comparison',`<p>This comparison uses fictional records and makes no claims about actual Ghanaian schools.</p><div class="modal-compare"><table><thead>${row('Details',s=>s.name)}</thead><tbody>${row('Area',s=>s.area)}${row('School level',s=>s.level.join(', '))}${row('Curriculum',s=>s.curriculum.join(', '))}${row('School fees',()=> 'Not provided')}${row('Admissions',()=> 'Confirm with school')}</tbody></table></div>`,'GUEST COMPARISON PREVIEW');
  }
  $('#viewCompare').addEventListener('click',showCompare);
  $('#openComparison').addEventListener('click',showCompare);
  const guides={
    visit:{title:'Questions to ask on a school visit',html:'<p>Before visiting, prepare a short checklist for the headteacher or admissions team.</p><ul><li>How does the school communicate with families?</li><li>What support is available for different learning needs?</li><li>What fees are compulsory and which are optional?</li><li>How do arrival, collection and student safety procedures work?</li></ul><p>This is illustrative advice, not a published SkoolFinder article.</p>'},
    learning:{title:'Understanding learning approaches',html:'<p>Ask each school which curriculum it offers and how teaching works in practice.</p><ul><li>What is the balance between guided lessons and hands-on learning?</li><li>How is progress assessed and shared with parents?</li><li>Which pathways are available at the next educational stage?</li></ul><p>Montessori and international curriculum labels can mean different things across schools. Confirm programmes directly.</p>'},
    admissions:{title:'Preparing for the next school year',html:'<p>Before applying, speak to each school about the current admission process.</p><ul><li>Confirm availability, important dates and entry requirements.</li><li>Ask for a written schedule of all expected costs.</li><li>Arrange a visit and prepare questions for teachers.</li><li>Keep a note of each enquiry and reply.</li></ul><p>Private school requirements vary. Government SHS placement uses official CSSPS procedures.</p>'}
  };
  document.querySelectorAll('[data-guide]').forEach(b=>b.addEventListener('click',()=>{const g=guides[b.dataset.guide];showDialog(g.title,g.html,'SAMPLE PARENT GUIDE')}));
  document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{
    const action=b.dataset.action;
    const content={
      account:['Free parent account','<p>On the actual SkoolFinder website this would link to the <strong>existing</strong> parent registration page. The preview does not collect or save account information.</p><p>No changes have been made to the registered Parents Portal.</p>'],
      signin:['Parent sign in','<p>This control represents the existing parent sign-in route. It is intentionally not connected to a live service.</p>'],
      educators:['Explore education professionals','<p>In the live product, this should open the existing public Teachers & Education Professionals discovery experience.</p><p>Academic tutoring, music, swimming, sports and learning support are illustrative service categories. This preview offers no booking or child messaging.</p>'],
      admissions:['Admissions guidance','<p>Start by comparing a small number of schools. Confirm admission dates, places, fees, age requirements and visits with each school directly.</p><p>For official government SHS placements, consult <a href="https://www.cssps.gov.gh/" rel="noopener noreferrer" target="_blank">the CSSPS website</a>.</p>'],
      'all-guides':['Parent guidance resources','<p>The three short sample guides shown on this page illustrate a future resource centre. No real articles or content system have been added.</p>'],
      'other-portals':['SkoolFinder ecosystem','<p>The production SkoolFinder ecosystem includes School Owners, Teachers & Education Professionals, and Suppliers & Service Providers. This standalone design is not connected to their live portals.</p>'],
      legal:['Privacy & contact','<p>This is a visual prototype only. It does not submit personal details, use a database, collect analytics, or send enquiries. The live site must link to its real Privacy, Terms and Contact pages.</p>']
    }[action];
    if(content)showDialog(content[0],content[1]);
  }));
  loadSavedState();
  renderChips();
  renderSchools();
  renderDock();
  updateGuestSyncStatus();
})();
