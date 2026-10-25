/**
 * SchoolDirect Ghana - Feature 4: WAEC / BECE / WASSCE & Cambridge Past Questions and Academic Resource Hub
 */
const ResourcesView = {
  filters: {
    examType: 'All',
    subject: 'All',
    year: 'All',
    difficulty: 'All',
    search: '',
    sort: 'newest'
  },

  downloadPaperDocument(resource) {
    API.downloadAcademicResource(resource.id).catch(console.error);

    const questions = resource.questions || [];
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${resource.paperCode} - ${resource.title}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 850px; margin: 2rem auto; padding: 2rem; color: #1e293b; line-height: 1.6; }
    .header { text-align: center; border-bottom: 3px double #0f172a; padding-bottom: 1.25rem; margin-bottom: 2rem; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 700; background: #e2e8f0; margin-bottom: 0.5rem; }
    h1 { font-size: 1.6rem; margin: 0.5rem 0; color: #0f172a; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .meta-table td { padding: 0.4rem 0.6rem; border: 1px solid #cbd5e1; }
    .instructions { background: #f8fafc; border-left: 4px solid #0284c7; padding: 1rem; margin-bottom: 2rem; font-size: 0.9rem; }
    .q-block { border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.25rem; margin-bottom: 2rem; page-break-inside: avoid; }
    .q-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.4rem; display: flex; justify-content: space-between; }
    .scheme-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 1rem; margin-top: 1rem; }
    .step-item { display: flex; justify-content: space-between; padding: 0.35rem 0; border-bottom: 1px dashed #dcfce7; font-size: 0.9rem; }
    .mark-pill { background: #0284c7; color: #fff; font-weight: 800; font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 4px; }
    .pitfall-box { background: #fff7ed; border-left: 4px solid #ea580c; padding: 0.85rem; margin-top: 1rem; font-size: 0.85rem; color: #9a3412; }
    @media print { body { padding: 0; margin: 1cm; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">${resource.examType} OFFICIAL REVISION PACK</div>
    <h1>${resource.title}</h1>
    <div style="font-weight: 600; color: #475569;">Official Examination Paper & Step-by-Step Marking Rubric</div>
  </div>

  <table class="meta-table">
    <tr>
      <td><strong>Paper Code:</strong> ${resource.paperCode}</td>
      <td><strong>Subject:</strong> ${resource.subject}</td>
      <td><strong>Year:</strong> ${resource.year}</td>
    </tr>
    <tr>
      <td><strong>Duration:</strong> ${resource.duration || '2 Hours 30 Mins'}</td>
      <td><strong>Total Marks:</strong> ${resource.totalMarks || 100} Marks</td>
      <td><strong>Exam Body:</strong> ${resource.examBody || 'WAEC / Cambridge'}</td>
    </tr>
  </table>

  <div class="instructions">
    <strong>INSTRUCTIONS TO CANDIDATES:</strong> Answer all questions with full working steps clearly shown. Credit will be given for logical mathematical method (M), accuracy (A), and independent statements (B). Non-programmable scientific calculators and mathematical tables are permitted where applicable.
  </div>

  <h2>SECTION A: EXAMINATION QUESTIONS</h2>
  ${questions.map((q, idx) => `
    <div class="q-block">
      <div class="q-title">
        <span>${q.questionNumber || 'Question ' + (idx + 1)}</span>
        <span>[${q.marks || 15} Marks]</span>
      </div>
      <div style="white-space: pre-line; margin-bottom: 1rem;">${q.questionText}</div>
    </div>
  `).join('')}

  <h2 style="margin-top: 3rem; page-break-before: always;">SECTION B: OFFICIAL MARKING SCHEME & STEP-BY-STEP SOLUTIONS</h2>
  ${questions.map((q, idx) => `
    <div class="q-block">
      <div class="q-title">
        <span>${q.questionNumber || 'Question ' + (idx + 1)} Marking Scheme</span>
        <span>Max: ${q.marks || 15} Marks</span>
      </div>
      <div class="scheme-box">
        <div style="font-weight: 700; color: #166534; margin-bottom: 0.5rem;">Marking Criteria & Model Working:</div>
        ${Array.isArray(q.markingScheme) && q.markingScheme.length > 0 ? q.markingScheme.map((item, i) => `
          <div class="step-item">
            <span><strong>Step ${i + 1}:</strong> ${item.step}</span>
            <span class="mark-pill">${item.mark || 'M1'}</span>
          </div>
        `).join('') : `<div style="white-space: pre-line;">${q.solution || 'Model steps provided.'}</div>`}
      </div>
      ${q.examinerPitfall || q.pitfall ? `
        <div class="pitfall-box">
          <strong>⚠️ Chief Examiner Remark:</strong> ${q.examinerPitfall || q.pitfall}
        </div>
      ` : ''}
    </div>
  `).join('')}

  <div style="margin-top: 3rem; border-top: 1px solid #cbd5e1; padding-top: 1rem; text-align: center; font-size: 0.8rem; color: #64748b;">
    Published by SchoolDirect Ghana Academic Network — Empowering Ghanaian Students & Schools.
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.paperCode}-Revision-Pack.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    State.showToast(`Downloaded ${resource.paperCode} official revision pack!`, 'success');
  },

  async render() {
    let resources = [];
    let stats = { totalResources: 0, totalDownloads: 0, examTypesCount: 0, subjectsCount: 0, subjects: [] };

    try {
      [resources, stats] = await Promise.all([
        API.getAcademicResources(this.filters),
        API.getAcademicResourceStats()
      ]);
    } catch (err) {
      console.error("Failed to load academic resources:", err);
    }

    const examPills = [
      { id: 'All', label: 'All Examinations' },
      { id: 'BECE', label: '🇬🇭 WAEC BECE (JHS)' },
      { id: 'WASSCE', label: '🇬🇭 WAEC WASSCE (SHS)' },
      { id: 'Cambridge IGCSE', label: '🌍 Cambridge IGCSE' },
      { id: 'Cambridge A-Levels', label: '🎓 Cambridge A-Levels' },
      { id: 'GES National Assessment', label: '🏛️ GES National (NSAT)' }
    ];

    const getExamBadge = (exam) => {
      if (exam.includes('BECE')) return '<span class="badge" style="background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; font-weight: 700;">WAEC BECE</span>';
      if (exam.includes('WASSCE')) return '<span class="badge" style="background: #fef3c7; color: #b45309; border: 1px solid #fde68a; font-weight: 700;">WAEC WASSCE</span>';
      if (exam.includes('Cambridge IGCSE')) return '<span class="badge" style="background: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff; font-weight: 700;">Cambridge IGCSE</span>';
      if (exam.includes('Cambridge A-Levels')) return '<span class="badge" style="background: #fae8ff; color: #86198f; border: 1px solid #f5d0fe; font-weight: 700;">Cambridge A-Level</span>';
      return '<span class="badge" style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; font-weight: 700;">GES National</span>';
    };

    const subjectsList = stats.subjects && stats.subjects.length > 0 
      ? stats.subjects 
      : ['Mathematics', 'Integrated Science', 'English Language', 'Physics', 'Social Studies', 'Biology', 'Numeracy & Literacy'];

    return `
      <section style="background: var(--bg-main); min-height: 85vh; padding: 2.5rem 0 5rem;">
        <div class="container">
          <!-- Breadcrumb & Top Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem;">
            <div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">
                <a href="#" id="res-breadcrumb-home" style="color: var(--primary-600); font-weight: 600;">Home</a> / Academic Hub
              </div>
              <h1 style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; color: var(--primary-900); margin: 0 0 0.5rem 0;">
                WAEC & Cambridge Past Questions & Marking Schemes
              </h1>
              <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 720px; line-height: 1.5; margin: 0;">
                Comprehensive revision repository for Ghanaian students: official WAEC BECE, WASSCE, Cambridge IGCSE, and GES National Standardized Assessment papers with verified step-by-step marking rubrics ($M_1, A_1$) and Chief Examiner pitfall remarks.
              </p>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button id="btn-upload-paper-top" class="btn-pill btn-gold">
                <span>📤</span> Upload Past Paper / Mock
              </button>
              <button id="btn-find-tutor-top" class="btn-pill btn-outline">
                <span>👨‍🏫</span> Book Subject Tutor
              </button>
            </div>
          </div>

          <!-- Highlight KPI Stats Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">
            <div class="card" style="padding: 1.25rem; background: #ffffff; border-radius: 12px; border: 1px solid var(--border-light); display: flex; align-items: center; gap: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                📚
              </div>
              <div>
                <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary-900);">${stats.totalResources || resources.length}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Verified Past Papers</div>
              </div>
            </div>

            <div class="card" style="padding: 1.25rem; background: #ffffff; border-radius: 12px; border: 1px solid var(--border-light); display: flex; align-items: center; gap: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 10px; background: #fef3c7; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                📥
              </div>
              <div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #b45309;">${(stats.totalDownloads || 3820).toLocaleString()}+</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Student Study Downloads</div>
              </div>
            </div>

            <div class="card" style="padding: 1.25rem; background: #ffffff; border-radius: 12px; border: 1px solid var(--border-light); display: flex; align-items: center; gap: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 10px; background: #f0fdf4; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                💯
              </div>
              <div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #15803d;">100% Free</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">With Step-by-Step Rubrics</div>
              </div>
            </div>

            <div class="card" style="padding: 1.25rem; background: #ffffff; border-radius: 12px; border: 1px solid var(--border-light); display: flex; align-items: center; gap: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 10px; background: #fae8ff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                ⚠️
              </div>
              <div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #86198f;">Official</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Chief Examiner Pitfalls</div>
              </div>
            </div>
          </div>

          <!-- WAEC Chief Examiner Pitfalls Spotlight Banner -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 1.75rem; color: #ffffff; margin-bottom: 2.5rem; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.75rem;">💡</span>
                <div>
                  <h3 style="margin: 0; font-size: 1.2rem; color: #fbbf24; font-weight: 800;">
                    WAEC & Cambridge Chief Examiner Common Pitfalls Wall
                  </h3>
                  <div style="font-size: 0.85rem; color: #cbd5e1;">
                    Why students miss Grade 1s / A*s in BECE and WASSCE:
                  </div>
                </div>
              </div>
              <span class="badge" style="background: rgba(251, 191, 36, 0.2); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.4);">
                Official Examiner Warnings
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-top: 1rem;">
              <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1rem;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 0.35rem;">
                  📐 BECE / WASSCE Core Mathematics
                </div>
                <p style="font-size: 0.85rem; color: #e2e8f0; line-height: 1.5; margin: 0;">
                  "Using a protractor when the question says 'By means of a pair of compasses and ruler only' results in <strong>0 marks</strong> for construction. Always leave construction arcs visible!"
                </p>
              </div>

              <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1rem;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #4ade80; text-transform: uppercase; margin-bottom: 0.35rem;">
                  🔬 WASSCE Integrated Science
                </div>
                <p style="font-size: 0.85rem; color: #e2e8f0; line-height: 1.5; margin: 0;">
                  "In genetics crosses, candidates lose marks for failing to label gametes, parental phenotypes, and F1 genotypes explicitly. Never write naked ratios without phenotype names!"
                </p>
              </div>

              <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1rem;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #f472b6; text-transform: uppercase; margin-bottom: 0.35rem;">
                  📝 BECE English Language
                </div>
                <p style="font-size: 0.85rem; color: #e2e8f0; line-height: 1.5; margin: 0;">
                  "In formal letters to District Chief Executives or Editors, using chat acronyms ('u', 'pls', 'am') or contractions ('don\'t', 'won\'t') automatically caps your mechanical accuracy at <strong>Band 4</strong>."
                </p>
              </div>
            </div>
          </div>

          <!-- Exam Type Tabs -->
          <div class="filter-pills" style="margin-bottom: 1.5rem; overflow-x: auto; white-space: nowrap; padding-bottom: 0.5rem;">
            ${examPills.map(p => `
              <button class="filter-pill ${this.filters.examType === p.id ? 'active' : ''} btn-exam-pill" data-exam="${p.id}">
                ${p.label}
              </button>
            `).join('')}
          </div>

          <!-- Search and Filter Bar -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 1.25rem 1.5rem; margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <div style="flex: 2; min-width: 250px;">
                <label class="form-label" style="font-size: 0.78rem;">Search by Subject, Topic or Paper Code</label>
                <input type="text" id="res-search-input" class="form-input" placeholder="e.g. Mathematics, Sets, Circle Theorems, 0580..." value="${this.filters.search || ''}" />
              </div>

              <div style="flex: 1; min-width: 160px;">
                <label class="form-label" style="font-size: 0.78rem;">Subject</label>
                <select id="res-filter-subject" class="form-select">
                  <option value="All" ${this.filters.subject === 'All' ? 'selected' : ''}>All Subjects (${subjectsList.length})</option>
                  ${subjectsList.map(sub => `
                    <option value="${sub}" ${this.filters.subject === sub ? 'selected' : ''}>${sub}</option>
                  `).join('')}
                </select>
              </div>

              <div style="flex: 1; min-width: 130px;">
                <label class="form-label" style="font-size: 0.78rem;">Exam Year</label>
                <select id="res-filter-year" class="form-select">
                  <option value="All" ${this.filters.year === 'All' ? 'selected' : ''}>All Years</option>
                  <option value="2025" ${this.filters.year === '2025' ? 'selected' : ''}>2025</option>
                  <option value="2024" ${this.filters.year === '2024' ? 'selected' : ''}>2024</option>
                  <option value="2023" ${this.filters.year === '2023' ? 'selected' : ''}>2023</option>
                  <option value="2022" ${this.filters.year === '2022' ? 'selected' : ''}>2022</option>
                  <option value="2021" ${this.filters.year === '2021' ? 'selected' : ''}>2021</option>
                </select>
              </div>

              <div style="flex: 1; min-width: 140px;">
                <label class="form-label" style="font-size: 0.78rem;">Difficulty</label>
                <select id="res-filter-diff" class="form-select">
                  <option value="All" ${this.filters.difficulty === 'All' ? 'selected' : ''}>All Levels</option>
                  <option value="Standard" ${this.filters.difficulty === 'Standard' ? 'selected' : ''}>Standard</option>
                  <option value="Advanced" ${this.filters.difficulty === 'Advanced' ? 'selected' : ''}>Advanced</option>
                  <option value="Foundation" ${this.filters.difficulty === 'Foundation' ? 'selected' : ''}>Foundation</option>
                </select>
              </div>

              <div style="flex: 1; min-width: 150px;">
                <label class="form-label" style="font-size: 0.78rem;">Sort By</label>
                <select id="res-sort" class="form-select">
                  <option value="newest" ${this.filters.sort === 'newest' ? 'selected' : ''}>Newest First</option>
                  <option value="downloads" ${this.filters.sort === 'downloads' ? 'selected' : ''}>Most Downloaded</option>
                  <option value="rating" ${this.filters.sort === 'rating' ? 'selected' : ''}>Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Active Results Count and Reset -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--primary-900);">
              Showing ${resources.length} Academic Paper${resources.length === 1 ? '' : 's'}
              ${this.filters.examType !== 'All' ? `for <span style="color: var(--gold-700);">${this.filters.examType}</span>` : ''}
              ${this.filters.subject !== 'All' ? `in <span style="color: var(--primary-700);">${this.filters.subject}</span>` : ''}
            </div>

            ${(this.filters.search || this.filters.examType !== 'All' || this.filters.subject !== 'All' || this.filters.year !== 'All' || this.filters.difficulty !== 'All') ? `
              <button id="btn-reset-filters" class="btn-pill btn-outline" style="font-size: 0.8rem; padding: 0.35rem 0.85rem;">
                <span>🔄</span> Reset Filters
              </button>
            ` : ''}
          </div>

          <!-- Paper Cards Grid -->
          ${resources.length === 0 ? `
            <div class="card" style="padding: 3.5rem 1.5rem; text-align: center; background: #ffffff; border-radius: 12px; border: 1px solid var(--border-light);">
              <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--primary-900); margin-bottom: 0.5rem;">No past questions found</h3>
              <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 480px; margin: 0 auto 1.5rem auto;">
                We couldn't find any papers matching your current search criteria. Try clearing filters or contribute a past examination paper.
              </p>
              <button id="btn-empty-reset" class="btn-pill btn-primary">Clear All Filters</button>
            </div>
          ` : `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
              ${resources.map(r => `
                <div class="card" style="display: flex; flex-direction: column; background: #ffffff; border-radius: 12px; border: 1px solid var(--border-light); padding: 1.5rem; transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: var(--shadow-sm);">
                  <!-- Top Badges -->
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <div>
                      ${getExamBadge(r.examType)}
                      <span class="badge" style="background: #f1f5f9; color: #475569; font-family: monospace; font-size: 0.75rem; margin-left: 0.35rem;">${r.paperCode}</span>
                    </div>
                    <span class="badge" style="background: #fef3c7; color: #b45309; font-size: 0.75rem; font-weight: 700;">
                      ⭐ ${r.rating || 5.0} (${r.downloadsCount || 1} dl)
                    </span>
                  </div>

                  <!-- Title -->
                  <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--primary-900); margin: 0 0 0.5rem 0; line-height: 1.4;">
                    ${r.title}
                  </h3>

                  <!-- Metadata Strip -->
                  <div style="display: flex; gap: 0.85rem; flex-wrap: wrap; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.75rem; padding-bottom: 0.65rem; border-bottom: 1px solid #f1f5f9;">
                    <span>📚 <strong>${r.subject}</strong></span>
                    <span>📅 <strong>${r.year}</strong></span>
                    <span>⏱️ <strong>${r.duration || '2 Hours'}</strong></span>
                    <span>🎯 <strong>${r.totalMarks || 100} Marks</strong></span>
                    <span>📝 <strong>${r.questions?.length || 1} Questions</strong></span>
                  </div>

                  <!-- Paper Description Snippet -->
                  <p style="font-size: 0.82rem; color: #475569; line-height: 1.5; margin: 0 0 0.85rem 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${r.description || 'Full question paper with step-by-step marking rubrics and examiner report notes.'}
                  </p>

                  <!-- Topics Pills -->
                  <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1rem;">
                    ${(r.topics || []).slice(0, 3).map(t => `
                      <span class="badge" style="background: #f8fafc; color: #334155; font-size: 0.72rem; border: 1px solid #e2e8f0;">
                        ${t}
                      </span>
                    `).join('')}
                    ${(r.topics && r.topics.length > 3) ? `<span class="badge" style="background: #f1f5f9; color: #64748b; font-size: 0.72rem;">+${r.topics.length - 3} more</span>` : ''}
                  </div>

                  <!-- Chief Examiner Tip Callout -->
                  <div style="background: #fff7ed; border-left: 3px solid #ea580c; padding: 0.65rem 0.85rem; border-radius: 4px; margin-bottom: 1.25rem; flex: 1;">
                    <div style="font-size: 0.72rem; font-weight: 700; color: #c2410c; text-transform: uppercase; margin-bottom: 0.2rem;">
                      ⚠️ Chief Examiner Warning:
                    </div>
                    <div style="font-size: 0.8rem; color: #7c2d12; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                      "${r.chiefExaminerRemarks || 'Check working steps and units.'}"
                    </div>
                  </div>

                  <!-- Action Buttons: Study + Download + Tutor -->
                  <div style="display: flex; gap: 0.5rem; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 1rem;">
                    <button class="btn-pill btn-primary btn-study-paper" data-id="${r.id}" style="flex: 2; justify-content: center; font-size: 0.85rem; padding: 0.55rem 0.75rem;">
                      <span>📖</span> Study Paper & Scheme
                    </button>
                    <button class="btn-pill btn-outline btn-download-paper-card" data-id="${r.id}" title="Download printable revision pack (.html)" style="padding: 0.55rem 0.75rem; font-size: 0.85rem;">
                      <span>📥</span> Download
                    </button>
                    <button class="btn-pill btn-outline btn-tutor-paper-card" data-subject="${r.subject}" title="Book a tutor for ${r.subject}" style="padding: 0.55rem 0.75rem; font-size: 0.85rem;">
                      <span>👨‍🏫</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </section>
    `;
  },

  attachEvents() {
    // Breadcrumb home
    document.getElementById('res-breadcrumb-home')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('home');
    });

    // Top action buttons
    document.getElementById('btn-upload-paper-top')?.addEventListener('click', () => {
      Modals.openUploadResourceModal(() => {
        App.refreshCurrentView();
      });
    });

    document.getElementById('btn-find-tutor-top')?.addEventListener('click', () => {
      if (typeof JobsView !== 'undefined') {
        JobsView.activeTab = 'teachers';
      }
      App.navigate('jobs');
    });

    // Exam type pill filter buttons
    document.querySelectorAll('.btn-exam-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filters.examType = btn.getAttribute('data-exam');
        App.refreshCurrentView();
      });
    });

    // Search input
    const searchInput = document.getElementById('res-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        App.debounce(() => {
          this.filters.search = e.target.value.trim();
          App.refreshCurrentView();
        }, 350);
      });
    }

    // Dropdown filters
    document.getElementById('res-filter-subject')?.addEventListener('change', (e) => {
      this.filters.subject = e.target.value;
      App.refreshCurrentView();
    });

    document.getElementById('res-filter-year')?.addEventListener('change', (e) => {
      this.filters.year = e.target.value;
      App.refreshCurrentView();
    });

    document.getElementById('res-filter-diff')?.addEventListener('change', (e) => {
      this.filters.difficulty = e.target.value;
      App.refreshCurrentView();
    });

    document.getElementById('res-sort')?.addEventListener('change', (e) => {
      this.filters.sort = e.target.value;
      App.refreshCurrentView();
    });

    // Reset filters
    const resetFilters = () => {
      this.filters = {
        examType: 'All',
        subject: 'All',
        year: 'All',
        difficulty: 'All',
        search: '',
        sort: 'newest'
      };
      App.refreshCurrentView();
    };

    document.getElementById('btn-reset-filters')?.addEventListener('click', resetFilters);
    document.getElementById('btn-empty-reset')?.addEventListener('click', resetFilters);

    // Card buttons: Study Paper
    document.querySelectorAll('.btn-study-paper').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        try {
          const resource = await API.getAcademicResourceById(id);
          Modals.openInteractivePaperModal(resource);
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Card buttons: Download Paper
    document.querySelectorAll('.btn-download-paper-card').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        try {
          const resource = await API.getAcademicResourceById(id);
          ResourcesView.downloadPaperDocument(resource);
        } catch (err) {
          State.showToast(err.message, 'error');
        }
      });
    });

    // Card buttons: Tutor for paper
    document.querySelectorAll('.btn-tutor-paper-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const subject = btn.getAttribute('data-subject');
        if (typeof JobsView !== 'undefined') {
          JobsView.activeTab = 'teachers';
          JobsView.teacherFilters.search = subject;
        }
        App.navigate('jobs');
        setTimeout(() => {
          const searchEl = document.getElementById('tch-search-input');
          if (searchEl) {
            searchEl.value = subject;
          }
          State.showToast(`Showing vetted tutors specializing in ${subject}`, 'info');
        }, 150);
      });
    });
  }
};
