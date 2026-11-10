/**
 * SkoolFinder Ghana - Directory View (with Feature 1: Interactive Geolocation Map View)
 */
const DirectoryView = {
  viewMode: 'list', // 'list' | 'map'
  mapInstance: null,

  async render() {
    let schools = [];
    let activePromo = null;
    try {
      const [schoolsRes, promoRes] = await Promise.allSettled([
        API.getSchools(State.filters),
        API.getActivePromotions('directory_top')
      ]);
      if (schoolsRes.status === 'fulfilled') {
        const rawSchools = Array.isArray(schoolsRes.value) ? schoolsRes.value : [];
        schools = rawSchools.slice(0, 3);
      }
      if (promoRes.status === 'fulfilled' && promoRes.value?.success && promoRes.value?.promotions?.length > 0) {
        activePromo = promoRes.value.promotions[0];
        API.trackPromotionImpression(activePromo.id).catch(() => {});
      }
    } catch (e) {
      console.warn('Failed to fetch schools or promo:', e);
      schools = [];
    }

    return `
      <section style="background: var(--bg-main); min-height: 80vh;">
        <div class="directory-container">
          <!-- Directory Header & Breadcrumb -->
          <div style="padding: 2rem 0 1rem;">
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
              <a href="#" class="breadcrumb-home" style="color: var(--primary-600); font-weight: 600;">Home</a> / School Directory
            </div>
            <div style="display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h1 style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; color: var(--primary-900);">
                  Nationwide School Directory & Regional Hubs
                </h1>
                <p id="dir-count-text" style="color: var(--text-muted); font-size: 0.95rem;">
                  Showing <strong>${schools.length}</strong> accredited schools across Greater Accra, Kumasi, Cape Coast & Takoradi.
                </p>
              </div>

              <!-- Top Controls: Search & Map/List View Toggle -->
              <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                <!-- View Mode Toggle -->
                <div class="directory-view-toggle">
                  <button id="toggle-list-view" class="view-toggle-btn ${this.viewMode === 'list' ? 'active' : ''}">
                    📋 Cards View
                  </button>
                  <button id="toggle-map-view" class="view-toggle-btn ${this.viewMode === 'map' ? 'active' : ''}">
                    🗺️ Map View
                  </button>
                </div>

                <!-- Quick Search Input -->
                <div style="min-width: 250px;">
                  <input type="text" id="dir-search-input" class="search-input" placeholder="Search school or suburb..." value="${State.filters.search || ''}" />
                </div>
              </div>
            </div>
          </div>

          <!-- Main Layout: Sidebar Filters + Content Area -->
          <div class="directory-layout">
            <!-- Filter Sidebar -->
            <aside class="filter-sidebar">
              <div class="filter-header">
                <span class="filter-title"><span>⚡</span> Refine Search</span>
                <button id="btn-reset-filters" class="filter-reset-btn">Reset All</button>
              </div>

              <!-- Blueprint v4.2: Matchmaker Direct Banner -->
              <div style="background: linear-gradient(135deg, #0A2046 0%, #16366f 100%); border-radius: var(--radius-md); padding: 0.85rem 1rem; color: #ffffff; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; box-shadow: var(--shadow-sm);">
                <div>
                  <div style="font-weight: 800; font-size: 0.82rem; color: #fbbf24;">🎯 Not sure where to start?</div>
                  <div style="font-size: 0.72rem; color: rgba(255,255,255,0.85); margin-top: 0.15rem;">Try our 2-step Fit Adviser.</div>
                </div>
                <button id="btn-dir-launch-match" class="btn-pill btn-gold" style="font-size: 0.72rem; padding: 0.3rem 0.65rem; font-weight: 800; white-space: nowrap;">
                  Fit Adviser &rarr;
                </button>
              </div>

              <!-- Region Filter -->
              <div class="filter-group">
                <label class="filter-group-label">Region</label>
                <select id="filter-region" class="filter-select">
                  <option value="All" ${State.filters.region === 'All' ? 'selected' : ''}>All Regions</option>
                  <option value="Greater Accra" ${State.filters.region === 'Greater Accra' ? 'selected' : ''}>Greater Accra (Accra, Tema)</option>
                  <option value="Ashanti" ${State.filters.region === 'Ashanti' ? 'selected' : ''}>Ashanti (Kumasi)</option>
                  <option value="Central" ${State.filters.region === 'Central' ? 'selected' : ''}>Central (Cape Coast)</option>
                  <option value="Western" ${State.filters.region === 'Western' ? 'selected' : ''}>Western (Sekondi-Takoradi)</option>
                  <option value="Eastern" ${State.filters.region === 'Eastern' ? 'selected' : ''}>Eastern (Koforidua)</option>
                </select>
              </div>

              <!-- Area Input Filter -->
              <div class="filter-group">
                <label class="filter-group-label" for="filter-suburb">Area</label>
                <input type="text" id="filter-suburb" class="filter-input" placeholder="type area name" value="${State.filters.suburb && State.filters.suburb !== 'All' ? State.filters.suburb : ''}" />
              </div>

              <!-- Level Filter -->
              <div class="filter-group">
                <label class="filter-group-label">School Level</label>
                <select id="filter-level" class="filter-select">
                  <option value="All" ${State.filters.level === 'All' ? 'selected' : ''}>All Levels</option>
                  <option value="Crèche" ${State.filters.level === 'Crèche' ? 'selected' : ''}>Crèche / Daycare</option>
                  <option value="Kindergarten" ${State.filters.level === 'Kindergarten' ? 'selected' : ''}>Nursery & Kindergarten</option>
                  <option value="Primary" ${State.filters.level === 'Primary' ? 'selected' : ''}>Primary (Class 1-6)</option>
                  <option value="JHS" ${State.filters.level === 'JHS' ? 'selected' : ''}>Junior High School (JHS)</option>
                  <option value="SHS" ${State.filters.level === 'SHS' ? 'selected' : ''}>Senior High School (SHS)</option>
                </select>
              </div>

              <!-- Curriculum Filter -->
              <div class="filter-group">
                <label class="filter-group-label">Curriculum</label>
                <select id="filter-curriculum" class="filter-select">
                  <option value="All" ${State.filters.curriculum === 'All' ? 'selected' : ''}>All Curricula</option>
                  <option value="Cambridge" ${State.filters.curriculum === 'Cambridge' ? 'selected' : ''}>Cambridge (CIE / IGCSE)</option>
                  <option value="GES" ${State.filters.curriculum === 'GES' ? 'selected' : ''}>GES Standards-based</option>
                  <option value="Montessori" ${State.filters.curriculum === 'Montessori' ? 'selected' : ''}>Montessori</option>
                  <option value="IB" ${State.filters.curriculum === 'IB' ? 'selected' : ''}>International Baccalaureate (IB)</option>
                </select>
              </div>

              <!-- Boarding Filter -->
              <div class="filter-group">
                <label class="filter-group-label">Attendance Type</label>
                <select id="filter-boarding" class="filter-select">
                  <option value="All" ${State.filters.boarding === 'All' ? 'selected' : ''}>Day & Boarding</option>
                  <option value="Day Only" ${State.filters.boarding === 'Day Only' ? 'selected' : ''}>Day Only</option>
                  <option value="Boarding" ${State.filters.boarding === 'Boarding' ? 'selected' : ''}>Boarding Options</option>
                </select>
              </div>

              <!-- Fee Band Filter -->
              <div class="filter-group">
                <label class="filter-group-label">Estimated Term Fees</label>
                <select id="filter-feeband" class="filter-select">
                  <option value="All" ${State.filters.feeBand === 'All' ? 'selected' : ''}>All Fee Ranges</option>
                  <option value="Budget" ${State.filters.feeBand === 'Budget' ? 'selected' : ''}>Budget (Under GH₵ 1,500)</option>
                  <option value="Moderate" ${State.filters.feeBand === 'Moderate' ? 'selected' : ''}>Moderate (GH₵ 1,500 - 4,000)</option>
                  <option value="Premium" ${State.filters.feeBand === 'Premium' ? 'selected' : ''}>Premium (GH₵ 4,000 - 10,000)</option>
                  <option value="International" ${State.filters.feeBand === 'International' ? 'selected' : ''}>Elite (GH₵ 10,000+)</option>
                </select>
              </div>

              <!-- Key Facilities Checkboxes -->
              <div class="filter-group">
                <label class="filter-group-label">Must-Have Amenities</label>
                <div class="filter-checkbox-list">
                  <label class="filter-checkbox-item">
                    <input type="checkbox" class="facility-checkbox" value="School Bus" ${(Array.isArray(State.filters.facilities) && State.filters.facilities.includes('School Bus')) || State.filters.facility === 'School Bus' ? 'checked' : ''} />
                    <span>School Bus Shuttle</span>
                  </label>
                  <label class="filter-checkbox-item">
                    <input type="checkbox" class="facility-checkbox" value="Science" ${(Array.isArray(State.filters.facilities) && State.filters.facilities.includes('Science')) || State.filters.facility === 'Science' ? 'checked' : ''} />
                    <span>Science & Robotics Lab</span>
                  </label>
                  <label class="filter-checkbox-item">
                    <input type="checkbox" class="facility-checkbox" value="Swimming" ${(Array.isArray(State.filters.facilities) && State.filters.facilities.includes('Swimming')) || State.filters.facility === 'Swimming' ? 'checked' : ''} />
                    <span>Swimming Pool</span>
                  </label>
                  <label class="filter-checkbox-item">
                    <input type="checkbox" class="facility-checkbox" value="Sick Bay" ${(Array.isArray(State.filters.facilities) && State.filters.facilities.includes('Sick Bay')) || State.filters.facility === 'Sick Bay' ? 'checked' : ''} />
                    <span>Sick Bay & Nurse</span>
                  </label>
                </div>
              </div>
            </aside>

            <!-- Results Section -->
            <main id="dir-results-main">
              ${this.viewMode === 'map' ? `
                <!-- FEATURE 1: INTERACTIVE GEOLOCATION MAP -->
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">
                      📍 Click any school crest marker to view details and admissions:
                    </div>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                      <button id="btn-zoom-accra" class="btn-pill btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                        🇬🇭 Focus Accra
                      </button>
                      <button id="btn-zoom-kumasi" class="btn-pill btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                        🇬🇭 Focus Kumasi
                      </button>
                      <button id="btn-zoom-capecoast" class="btn-pill btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                        🇬🇭 Focus Cape Coast
                      </button>
                      <button id="btn-zoom-takoradi" class="btn-pill btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                        🇬🇭 Focus Takoradi
                      </button>
                    </div>
                  </div>
                  <div id="school-map" class="directory-map-container"></div>
                </div>
              ` : `
                <!-- CARDS GRID VIEW -->
                ${activePromo ? `
                  <div id="dir-active-sponsored-banner" style="background: linear-gradient(135deg, #091e42 0%, #1e3a8a 100%); border-radius: var(--radius-lg); padding: 1.25rem 1.75rem; color: #ffffff; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border: 1.5px solid #fbbf24; box-shadow: 0 10px 25px rgba(10,32,70,0.18);">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                      <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(251,191,36,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; border: 1px solid rgba(251,191,36,0.4);">
                        ⭐
                      </div>
                      <div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                          <span style="background: #fbbf24; color: #000; font-size: 0.68rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 100px; letter-spacing: 0.05em; text-transform: uppercase;">
                            Sponsored Spotlight
                          </span>
                          <span style="font-size: 0.8rem; color: #93c5fd; font-weight: 700;">${activePromo.school_name || 'Accredited Institution'}</span>
                        </div>
                        <h3 style="color: #ffffff; font-size: 1.15rem; margin: 0 0 0.25rem 0; font-weight: 800; font-family: var(--font-heading);">
                          ${activePromo.headline || 'Premier Admissions & Cambridge Academic Excellence'}
                        </h3>
                        <p style="color: #cbd5e1; font-size: 0.82rem; margin: 0;">
                          📍 ${activePromo.suburb || 'Accra'}, ${activePromo.region || 'Greater Accra'} &bull; Verified Accreditation
                        </p>
                      </div>
                    </div>
                    <button class="btn-pill btn-gold" id="btn-dir-promo-cta" data-campaign-id="${activePromo.id}" data-target-url="${activePromo.target_url || `/school/${activePromo.school_id}`}" style="font-weight: 800; padding: 0.55rem 1.35rem; font-size: 0.85rem; white-space: nowrap;">
                      ${activePromo.cta_label || 'Explore Admissions'} &rarr;
                    </button>
                  </div>
                ` : ''}

                ${schools.length === 0 ? `
                  <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px dashed var(--border-light); padding: 4rem 2rem; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--primary-900); margin-bottom: 0.5rem;">
                      No schools matched your exact filters
                    </h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                      Try clearing some filters or searching a nearby suburb in Accra or Kumasi.
                    </p>
                    <button id="btn-empty-reset" class="btn-pill btn-primary">
                      Clear All Filters
                    </button>
                  </div>
                ` : `
                  <div class="schools-grid directory-schools-grid">
                    ${schools.map(s => (typeof HomeView !== 'undefined' && HomeView.renderSchoolCard ? HomeView.renderSchoolCard(s) : this.renderSchoolCard(s))).join('')}
                  </div>
                `}
              `}
            </main>
          </div>
        </div>
      </section>
    `;
  },

  initMap(schools) {
    const mapEl = document.getElementById('school-map');
    if (!mapEl || typeof L === 'undefined') return;

    // Center on Accra initially or Kumasi if filtered
    const isKumasi = State.filters.region === 'Ashanti' || State.filters.suburb === 'Ahodwo' || State.filters.suburb === 'Nhyiaeso';
    const initialCenter = isKumasi ? [6.6872, -1.6280] : [5.6037, -0.1788];
    const initialZoom = isKumasi ? 13 : 11;

    try {
      this.mapInstance = L.map('school-map').setView(initialCenter, initialZoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors | SkoolFinder'
      }).addTo(this.mapInstance);

      // Add school markers with popups
      schools.forEach(s => {
        if (s.lat && s.lng) {
          const marker = L.marker([s.lat, s.lng]).addTo(this.mapInstance);
          marker.bindPopup(`
            <div class="map-popup-card">
              <img src="${s.coverImage || s.banner_url || '/assets/images/campus_hero.webp'}" class="map-popup-img" alt="${s.name}" loading="lazy" />
              <div class="map-popup-body">
                <div class="map-popup-title">${s.name}</div>
                <div class="map-popup-suburb">📍 ${s.suburb || s.locality || 'Accra'}, ${s.region || 'Greater Accra'}</div>
                <div style="font-size: 0.75rem; color: var(--gold-600); font-weight: 700; margin-bottom: 0.5rem;">${s.feeBand || (s.tuition_min ? 'GH₵ ' + Number(s.tuition_min).toLocaleString() + (s.tuition_max ? ' - ' + Number(s.tuition_max).toLocaleString() : '') : 'Official fee schedule not published')}</div>
                <div style="display: flex; gap: 0.35rem;">
                  <button class="btn-pill btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.72rem; flex: 1;" onclick="App.navigate('school-detail', '${s.id}')">View Profile</button>
                  <a href="https://wa.me/${(s.whatsapp || s.phone || '+233302777163').replace(/[^0-9]/g, '')}" target="_blank" class="btn-card-wa" style="padding: 0.3rem 0.5rem; font-size: 0.72rem;">💬</a>
                </div>
              </div>
            </div>
          `);
        }
      });

      // Zoom buttons
      document.getElementById('btn-zoom-accra')?.addEventListener('click', () => {
        this.mapInstance.flyTo([5.6037, -0.1788], 12);
      });
      document.getElementById('btn-zoom-kumasi')?.addEventListener('click', () => {
        this.mapInstance.flyTo([6.6872, -1.6280], 13);
      });
      document.getElementById('btn-zoom-capecoast')?.addEventListener('click', () => {
        this.mapInstance.flyTo([5.1054, -1.2466], 13);
      });
      document.getElementById('btn-zoom-takoradi')?.addEventListener('click', () => {
        this.mapInstance.flyTo([4.8931, -1.7554], 13);
      });

    } catch (err) {
      console.warn("Leaflet map initialization notice:", err);
    }
  },

  updateResults(schools) {
    const displaySchools = Array.isArray(schools) ? schools.slice(0, 3) : [];
    const countEl = document.getElementById('dir-count-text');
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${displaySchools.length}</strong> accredited demonstration schools matching your criteria.`;
    }

    const mainEl = document.getElementById('dir-results-main');
    if (!mainEl) return;

    if (this.viewMode === 'map') {
      this.initMap(displaySchools);
      return;
    }

    if (displaySchools.length === 0) {
      mainEl.innerHTML = `
        <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px dashed var(--border-light); padding: 4rem 2rem; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--primary-900); margin-bottom: 0.5rem;">
            No schools matched your exact filters
          </h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
            Try clearing some filters or searching a nearby suburb in Accra or Kumasi.
          </p>
          <button id="btn-empty-reset" class="btn-pill btn-primary">
            Clear All Filters
          </button>
        </div>
      `;
      document.getElementById('btn-empty-reset')?.addEventListener('click', () => this.resetFilters());
    } else {
      mainEl.innerHTML = `
        <div class="schools-grid directory-schools-grid">
          ${displaySchools.map(s => (typeof HomeView !== 'undefined' && HomeView.renderSchoolCard ? HomeView.renderSchoolCard(s) : this.renderSchoolCard(s))).join('')}
        </div>
      `;
      this.attachCardEvents();
    }
  },

  renderSchoolCard(school) {
    if (typeof HomeView !== 'undefined' && HomeView.renderSchoolCard) {
      return HomeView.renderSchoolCard(school);
    }
    return '';
  },

  attachCardEvents() {
    if (typeof HomeView !== 'undefined' && HomeView.attachEvents) {
      try { HomeView.attachEvents(); } catch(e) {}
    }

    document.querySelectorAll('.btn-card-view').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const schoolId = btn.dataset.schoolId;
        if (schoolId) App.navigate('school-detail', schoolId);
      };
    });

    document.querySelectorAll('.btn-card-wa').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const wa = btn.dataset.wa;
        if (wa) {
          const cleanWa = wa.replace(/[^0-9]/g, '');
          window.open(`https://wa.me/${cleanWa}?text=Hello,%20I%20found%20your%20school%20on%20SkoolFinder%20Ghana.%20I%20would%20like%20to%20inquire%20about%20admissions.`, '_blank');
        }
      };
    });

    document.querySelectorAll('.btn-card-compare').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const schoolId = btn.dataset.schoolId;
        if (schoolId) {
          State.toggleCompare(schoolId);
          btn.classList.toggle('active', State.isInCompare(schoolId));
        }
      };
    });

    document.querySelectorAll('.btn-card-bookmark').forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const schoolId = btn.dataset.schoolId;
        const schoolName = btn.dataset.schoolName || 'School';
        if (schoolId) {
          await State.toggleBookmark(schoolId, schoolName);
          const isNowSaved = State.isBookmarked(schoolId);
          btn.classList.toggle('active', isNowSaved);
          btn.innerHTML = isNowSaved ? '🔖' : '🤍';
        }
      };
    });

    document.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.onclick = (e) => {
        e.stopPropagation();
        const parentDots = dot.parentElement;
        const schoolId = parentDots?.dataset?.schoolId;
        const targetImg = document.getElementById(`img-${schoolId}`);
        if (targetImg && dot.dataset.img) {
          targetImg.style.opacity = '0.5';
          setTimeout(() => {
            targetImg.src = dot.dataset.img;
            targetImg.style.opacity = '1';
          }, 120);
          parentDots.querySelectorAll('.carousel-dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
        }
      };
    });
  },

  resetFilters() {
    State.filters = {
      search: '',
      region: 'All',
      suburb: 'All',
      level: 'All',
      curriculum: 'All',
      boarding: 'All',
      feeBand: 'All',
      facility: 'All',
      facilities: []
    };
    App.navigate('directory');
  },

  attachEvents() {
    // Breadcrumb Home
    document.querySelector('.breadcrumb-home')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('home');
    });

    // Launch Matchmaker
    document.getElementById('btn-dir-launch-match')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('matchmaker');
    });

    // View Mode Toggle buttons
    document.getElementById('toggle-list-view')?.addEventListener('click', () => {
      this.viewMode = 'list';
      App.navigate('directory');
    });
    document.getElementById('toggle-map-view')?.addEventListener('click', () => {
      this.viewMode = 'map';
      App.navigate('directory');
    });

    // In-Place Search Input (Preserves Keyboard Focus)
    const searchInput = document.getElementById('dir-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        State.filters.search = e.target.value.trim();
        App.debounce(async () => {
          try {
            const schools = await API.getSchools(State.filters);
            DirectoryView.updateResults(schools);
          } catch (err) {
            console.warn("Search input error:", err);
          }
        }, 250);
      };
    }

    // Filter Selects (Fast in-place refresh)
    const selects = [
      { id: 'filter-region', key: 'region' },
      { id: 'filter-level', key: 'level' },
      { id: 'filter-curriculum', key: 'curriculum' },
      { id: 'filter-boarding', key: 'boarding' },
      { id: 'filter-feeband', key: 'feeBand' }
    ];

    // Area Input Filter (debounced live search)
    const suburbInput = document.getElementById('filter-suburb');
    if (suburbInput) {
      const handleAreaFilter = async () => {
        const val = suburbInput.value.trim();
        State.filters.suburb = val || 'All';
        try {
          const schools = await API.getSchools(State.filters);
          DirectoryView.updateResults(schools);
        } catch (err) {
          console.warn('Area filter error:', err);
        }
      };

      suburbInput.addEventListener('input', () => {
        if (typeof App !== 'undefined' && App.debounce) {
          App.debounce(handleAreaFilter, 300);
        } else {
          handleAreaFilter();
        }
      });
      suburbInput.addEventListener('change', handleAreaFilter);
      suburbInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAreaFilter();
        }
      });
    }

    selects.forEach(({ id, key }) => {
      const el = document.getElementById(id);
      if (el) {
        el.onchange = async (e) => {
          State.filters[key] = e.target.value;
          try {
            const schools = await API.getSchools(State.filters);
            DirectoryView.updateResults(schools);
          } catch (err) {
            App.navigate('directory');
          }
        };
      }
    });

    // Multi-Select Facility Checkboxes
    document.querySelectorAll('.facility-checkbox').forEach(cb => {
      cb.onchange = async () => {
        const checkedValues = Array.from(document.querySelectorAll('.facility-checkbox:checked')).map(el => el.value);
        State.filters.facilities = checkedValues;
        State.filters.facility = checkedValues.length > 0 ? checkedValues.join(',') : 'All';
        try {
          const schools = await API.getSchools(State.filters);
          DirectoryView.updateResults(schools);
        } catch (err) {
          console.warn("Facility filter error:", err);
        }
      };
    });

    // Reset Filters Buttons
    document.getElementById('btn-reset-filters')?.addEventListener('click', () => this.resetFilters());
    document.getElementById('btn-empty-reset')?.addEventListener('click', () => this.resetFilters());

    // Sponsored Promotion Spotlight CTA Click Handler
    document.getElementById('btn-dir-promo-cta')?.addEventListener('click', (e) => {
      const campaignId = e.currentTarget.dataset.campaignId;
      const targetUrl = e.currentTarget.dataset.targetUrl;
      if (campaignId) {
        API.trackPromotionClick(campaignId).catch(() => {});
      }
      if (targetUrl) {
        if (targetUrl.startsWith('http')) {
          window.open(targetUrl, '_blank');
        } else if (targetUrl.startsWith('/school/')) {
          const schoolId = targetUrl.replace('/school/', '');
          App.navigate('school-detail', schoolId);
        } else {
          window.location.href = targetUrl;
        }
      }
    });

    // If in map mode, initialize Leaflet map
    if (this.viewMode === 'map') {
      API.getSchools(State.filters).then(schools => this.initMap(schools));
    } else {
      // School card click events for grid mode
      this.attachCardEvents();
    }
  }
};
