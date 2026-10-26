/**
 * SkoolFinder Ghana - Directory View (with Feature 1: Interactive Geolocation Map View)
 */
const DirectoryView = {
  viewMode: 'list', // 'list' | 'map'
  mapInstance: null,

  async render() {
    const schools = await API.getSchools(State.filters);

    return `
      <section style="background: var(--bg-main); min-height: 80vh;">
        <div class="container">
          <!-- Directory Header & Breadcrumb -->
          <div style="padding: 2rem 0 1rem;">
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
              <a href="#" class="breadcrumb-home" style="color: var(--primary-600); font-weight: 600;">Home</a> / School Directory
            </div>
            <div style="display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h1 style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; color: var(--primary-900);">
                  School Directory: Greater Accra & Kumasi
                </h1>
                <p style="color: var(--text-muted); font-size: 0.95rem;">
                  Showing <strong>${schools.length}</strong> accredited schools matching your criteria.
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

              <!-- Region Filter -->
              <div class="filter-group">
                <label class="filter-group-label">Region</label>
                <select id="filter-region" class="filter-select">
                  <option value="All" ${State.filters.region === 'All' ? 'selected' : ''}>All Regions</option>
                  <option value="Greater Accra" ${State.filters.region === 'Greater Accra' ? 'selected' : ''}>Greater Accra</option>
                  <option value="Ashanti" ${State.filters.region === 'Ashanti' ? 'selected' : ''}>Ashanti (Kumasi)</option>
                </select>
              </div>

              <!-- Suburb Filter -->
              <div class="filter-group">
                <label class="filter-group-label">Suburb / Enclave</label>
                <select id="filter-suburb" class="filter-select">
                  <option value="All" ${State.filters.suburb === 'All' ? 'selected' : ''}>All Neighborhoods</option>
                  <optgroup label="Greater Accra">
                    <option value="East Legon" ${State.filters.suburb === 'East Legon' ? 'selected' : ''}>East Legon</option>
                    <option value="Cantonments" ${State.filters.suburb === 'Cantonments' ? 'selected' : ''}>Cantonments</option>
                    <option value="Airport Residential" ${State.filters.suburb === 'Airport Residential' ? 'selected' : ''}>Airport Residential</option>
                    <option value="Spintex" ${State.filters.suburb === 'Spintex' ? 'selected' : ''}>Spintex Road</option>
                    <option value="Tema" ${State.filters.suburb === 'Tema' ? 'selected' : ''}>Tema (Comm 1-25)</option>
                    <option value="Adenta" ${State.filters.suburb === 'Adenta' ? 'selected' : ''}>Adenta / Oyarifa</option>
                  </optgroup>
                  <optgroup label="Kumasi (Ashanti)">
                    <option value="Ahodwo" ${State.filters.suburb === 'Ahodwo' ? 'selected' : ''}>Ahodwo</option>
                    <option value="Nhyiaeso" ${State.filters.suburb === 'Nhyiaeso' ? 'selected' : ''}>Nhyiaeso</option>
                    <option value="Ridge" ${State.filters.suburb === 'Ridge' ? 'selected' : ''}>Ridge Residential</option>
                    <option value="KNUST Enclave" ${State.filters.suburb === 'KNUST Enclave' ? 'selected' : ''}>KNUST Enclave</option>
                  </optgroup>
                </select>
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
                    <input type="checkbox" class="facility-checkbox" value="School Bus" ${State.filters.facility === 'School Bus' ? 'checked' : ''} />
                    <span>School Bus Shuttle</span>
                  </label>
                  <label class="filter-checkbox-item">
                    <input type="checkbox" class="facility-checkbox" value="Science" ${State.filters.facility === 'Science' ? 'checked' : ''} />
                    <span>Science & Robotics Lab</span>
                  </label>
                  <label class="filter-checkbox-item">
                    <input type="checkbox" class="facility-checkbox" value="Swimming" ${State.filters.facility === 'Swimming' ? 'checked' : ''} />
                    <span>Swimming Pool</span>
                  </label>
                  <label class="filter-checkbox-item">
                    <input type="checkbox" class="facility-checkbox" value="Sick Bay" ${State.filters.facility === 'Sick Bay' ? 'checked' : ''} />
                    <span>Sick Bay & Nurse</span>
                  </label>
                </div>
              </div>
            </aside>

            <!-- Results Section -->
            <main>
              ${this.viewMode === 'map' ? `
                <!-- FEATURE 1: INTERACTIVE GEOLOCATION MAP -->
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">
                      📍 Click any school crest marker to view details and admissions:
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                      <button id="btn-zoom-accra" class="btn-pill btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                        🇬🇭 Focus Accra
                      </button>
                      <button id="btn-zoom-kumasi" class="btn-pill btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">
                        🇬🇭 Focus Kumasi
                      </button>
                    </div>
                  </div>
                  <div id="school-map" class="directory-map-container"></div>
                </div>
              ` : `
                <!-- CARDS GRID VIEW -->
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
                  <div class="schools-grid">
                    ${schools.map(s => HomeView.renderSchoolCard(s)).join('')}
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
              <img src="${s.coverImage}" class="map-popup-img" alt="${s.name}" />
              <div class="map-popup-body">
                <div class="map-popup-title">${s.name}</div>
                <div class="map-popup-suburb">📍 ${s.suburb}, ${s.region}</div>
                <div style="font-size: 0.75rem; color: var(--gold-600); font-weight: 700; margin-bottom: 0.5rem;">${s.feeBand}</div>
                <div style="display: flex; gap: 0.35rem;">
                  <button class="btn-pill btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.72rem; flex: 1;" onclick="App.navigate('school-detail', '${s.id}')">View Profile</button>
                  <a href="https://wa.me/${s.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="btn-card-wa" style="padding: 0.3rem 0.5rem; font-size: 0.72rem;">💬</a>
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

    } catch (err) {
      console.warn("Leaflet map initialization notice:", err);
    }
  },

  attachEvents() {
    // Breadcrumb Home
    document.querySelector('.breadcrumb-home')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('home');
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

    // Search Input
    const searchInput = document.getElementById('dir-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        State.filters.search = e.target.value.trim();
        App.debounce(() => App.navigate('directory'), 350);
      };
    }

    // Filter Selects
    const selects = [
      { id: 'filter-region', key: 'region' },
      { id: 'filter-suburb', key: 'suburb' },
      { id: 'filter-level', key: 'level' },
      { id: 'filter-curriculum', key: 'curriculum' },
      { id: 'filter-boarding', key: 'boarding' },
      { id: 'filter-feeband', key: 'feeBand' }
    ];

    selects.forEach(({ id, key }) => {
      const el = document.getElementById(id);
      if (el) {
        el.onchange = (e) => {
          State.filters[key] = e.target.value;
          App.navigate('directory');
        };
      }
    });

    // Facility Checkboxes
    document.querySelectorAll('.facility-checkbox').forEach(cb => {
      cb.onchange = (e) => {
        State.filters.facility = e.target.checked ? e.target.value : 'All';
        App.navigate('directory');
      };
    });

    // Reset Filters
    const resetFilters = () => {
      State.filters = {
        search: '',
        region: 'All',
        suburb: 'All',
        level: 'All',
        curriculum: 'All',
        boarding: 'All',
        feeBand: 'All',
        facility: 'All'
      };
      App.navigate('directory');
    };

    document.getElementById('btn-reset-filters')?.addEventListener('click', resetFilters);
    document.getElementById('btn-empty-reset')?.addEventListener('click', resetFilters);

    // If in map mode, initialize Leaflet map
    if (this.viewMode === 'map') {
      API.getSchools(State.filters).then(schools => this.initMap(schools));
    } else {
      // School card click events for grid mode
      HomeView.attachEvents();
    }
  }
};
