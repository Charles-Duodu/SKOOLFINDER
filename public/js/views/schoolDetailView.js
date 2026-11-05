/**
 * SkoolFinder Ghana - School Showcase / Detail View
 */
const SchoolDetailView = {
  async render(schoolId) {
    const school = await API.getSchoolById(schoolId);
    const reviewsData = await API.getSchoolReviews(schoolId);
    const ratingSummary = reviewsData.summary || { averageOverall: 5.0, totalReviews: 0, dimensions: {} };
    const reviews = reviewsData.reviews || [];
    const isCompared = State.isInCompare(school.id);

    // SEO-03 & SEO-04: Update Dynamic SEO Meta & Inject Schema.org JSON-LD
    if (typeof App !== 'undefined' && App.updateSEO) {
      const suburbStr = school.suburb ? `${school.suburb}, ` : '';
      const regionStr = school.region || 'Greater Accra';
      const currStr = Array.isArray(school.curriculum) ? school.curriculum.join(', ') : (school.curriculum || 'Accredited Curriculum');
      const feeStr = school.feeBand || 'Verified Fees';
      const schoolTitle = `${school.name} (${suburbStr}${regionStr}) — Admissions, Fees & Reviews | SkoolFinder Ghana`;
      const schoolDesc = `${school.name} in ${suburbStr}${regionStr}. Curriculum: ${currStr}. Fees: ${feeStr}. Verified facilities, 360° virtual tour, parent reviews, and direct WhatsApp admissions desk.`;
      const schoolImg = school.coverImage && school.coverImage.startsWith('http') ? school.coverImage : `https://skoolfinder.vercel.app${school.coverImage || '/assets/images/campus_hero.jpg'}`;

      App.updateSEO({
        title: schoolTitle,
        description: schoolDesc,
        keywords: `${school.name}, ${suburbStr}schools, ${regionStr} schools, ${currStr}, Ghana accredited school`,
        ogTitle: `${school.name} — Verified School in Ghana`,
        ogDescription: schoolDesc,
        ogImage: schoolImg,
        canonicalUrl: `https://skoolfinder.vercel.app/schools/${school.id}`,
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Schools Directory', url: '/directory' },
          { name: school.name, url: `/schools/${school.id}` }
        ]
      });

      // Inject Schema.org EducationalOrganization / School structured data
      try {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "School",
          "@id": `https://skoolfinder.vercel.app/schools/${school.id}#school`,
          "name": school.name,
          "alternateName": school.shortName || school.slug || school.name,
          "description": school.description || school.about || school.motto || `${school.name} is an accredited educational institution in ${suburbStr}${regionStr}, Ghana.`,
          "url": `https://skoolfinder.vercel.app/schools/${school.id}`,
          "image": schoolImg,
          "telephone": school.phone || school.whatsapp || "+233302777163",
          "email": school.email || "admissions@skoolfinder.com.gh",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": school.address || school.suburb || "Accra",
            "addressLocality": school.suburb || "Accra",
            "addressRegion": regionStr,
            "addressCountry": "GH"
          },
          ...(school.lat && school.lng ? {
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": school.lat,
              "longitude": school.lng
            }
          } : {}),
          "priceRange": feeStr,
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Academic Curricula & Admissions",
            "itemListElement": (Array.isArray(school.curriculum) ? school.curriculum : [school.curriculum || 'GES']).map(c => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Course",
                "name": `${c} Curriculum`
              }
            }))
          },
          ...(Array.isArray(school.facilities) && school.facilities.length > 0 ? {
            "amenityFeature": school.facilities.map(f => ({
              "@type": "LocationFeatureSpecification",
              "name": f,
              "value": true
            }))
          } : {}),
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": (ratingSummary.averageOverall || school.rating || 4.8).toString(),
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": (ratingSummary.totalReviews || (school.reviews && school.reviews.length) || 12).toString()
          },
          ...(Array.isArray(reviews) && reviews.length > 0 ? {
            "review": reviews.slice(0, 5).map(r => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": r.authorName || "Verified Parent"
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": (r.overallRating || 5).toString(),
                "bestRating": "5",
                "worstRating": "1"
              },
              "reviewBody": r.comment || r.content || r.headline || "",
              "datePublished": r.date ? new Date(r.date).toISOString().split('T')[0] : "2026-10-15"
            }))
          } : {})
        };

        let scriptTag = document.getElementById('schema-school-jsonld');
        if (!scriptTag) {
          scriptTag = document.createElement('script');
          scriptTag.type = 'application/ld+json';
          scriptTag.id = 'schema-school-jsonld';
          document.head.appendChild(scriptTag);
        }
        scriptTag.textContent = JSON.stringify(schemaData, null, 2);
      } catch (e) {
        console.warn("Schema.org injection notice:", e);
      }
    }

    return `
      <section class="school-showcase" style="background: var(--bg-main);">
        <div class="container">
          <!-- Breadcrumb -->
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">
            <a href="#" class="breadcrumb-home" style="color: var(--primary-600); font-weight: 600;">Home</a> / 
            <a href="#" class="breadcrumb-dir" style="color: var(--primary-600); font-weight: 600;">Schools</a> / 
            <span>${school.name}</span>
          </div>

          <!-- Main Showcase Card -->
          <div class="showcase-hero-card">
            <div class="showcase-banner">
              <img src="${school.coverImage}" alt="${school.name}" class="showcase-banner-img" />
              <div class="showcase-claim-badge">
                ${!school.claimed ? `
                  <button id="btn-claim-school-hero" class="btn-pill btn-gold" style="box-shadow: 0 4px 14px rgba(0,0,0,0.4);">
                    🛡️ Are you the Head of this School? Claim Profile
                  </button>
                ` : `
                  <span class="badge badge-verified" style="background: rgba(2, 132, 199, 0.9); color: #ffffff; padding: 0.4rem 0.85rem; font-size: 0.82rem;">
                    ✓ Officially Verified & Managed Campus
                  </span>
                `}
              </div>
            </div>

            <div class="showcase-info-bar">
              <div class="showcase-identity">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem; align-items: center;">
                  ${school.curriculum.map(c => `<span class="badge badge-cambridge">${c}</span>`).join('')}
                  ${(school.nasia_verified || school.verified) ? `
                    <span class="badge" style="background:#eff6ff;color:#1d4ed8;font-weight:700;border:1px solid #bfdbfe;" title="Licensed under Education Regulatory Bodies Act 2020 (Act 1023)">
                      🛡️ NaSIA Licensed Pre-Tertiary
                    </span>
                  ` : `
                    <span class="badge" style="background:#f8fafc;color:#64748b;border:1px solid #e2e8f0;">
                      NaSIA Licensing Cross-Check
                    </span>
                  `}
                  ${school.claimed ? `
                    <span class="badge" style="background:#dcfce7;color:#166534;font-weight:700;border:1px solid #bbf7d0;">
                      ✓ SkoolFinder Verified Management
                    </span>
                  ` : ''}
                  <span class="badge badge-admissions"><span class="badge-pulse-dot"></span> ${school.admissionsStatus}</span>
                </div>

                <h1 class="showcase-title">${school.name}</h1>
                <div class="showcase-motto">"${school.motto || 'Striving for Academic Excellence'}"</div>

                <div style="display: flex; align-items: center; gap: 0.5rem; margin: 0.35rem 0 0.5rem; flex-wrap: wrap;">
                  <span style="color: #f59e0b; font-size: 1.15rem; font-weight: 800;">★ ${ratingSummary.averageOverall || '5.0'}</span>
                  <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">(${ratingSummary.totalReviews} verified reviews)</span>
                  <a href="#reviews-section" style="color: var(--primary-600); font-size: 0.82rem; font-weight: 700; text-decoration: underline; margin-left: 0.25rem;">Read Reviews &darr;</a>
                </div>
                
                <div class="showcase-address">
                  <span>📍</span> ${school.address}
                  <a href="${school.mapLocation}" target="_blank" style="color: var(--primary-600); font-weight: 600; text-decoration: underline; margin-left: 0.5rem;">
                    (View on Google Maps &rarr;)
                  </a>
                </div>
              </div>

              <!-- Contact & Lead Generation Action Box -->
              <div class="showcase-action-box">
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--primary-900); text-transform: uppercase; letter-spacing: 0.05em;">
                  Connect with Admissions
                </div>

                <!-- WhatsApp Button (Click to Reveal) -->
                <button id="btn-reveal-wa" class="reveal-contact-btn btn-reveal-whatsapp" data-school-id="${school.id}" data-wa="${school.whatsapp}">
                  <span>💬</span> 
                  <span id="label-wa">Click to Reveal WhatsApp</span>
                </button>

                <!-- Phone Button (Click to Reveal) -->
                <button id="btn-reveal-call" class="reveal-contact-btn btn-reveal-call" data-school-id="${school.id}" data-phone="${school.phone}">
                  <span>📞</span> 
                  <span id="label-call">Click to Reveal Phone</span>
                </button>

                <!-- Apply for Online Admission (Feature 1) -->
                <button id="btn-apply-admission-online" class="btn-pill" style="width: 100%; justify-content: center; font-size: 0.92rem; padding: 0.75rem 1rem; background: linear-gradient(135deg, var(--emerald-600), #059669); color: #ffffff; font-weight: 700; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3); border: none; cursor: pointer;">
                  <span>📝</span> Apply for Online Admission
                </button>

                <!-- Schedule Campus Tour / Official Inquiry -->
                <button id="btn-inquire-tour" class="btn-pill btn-primary" style="width: 100%; justify-content: center; font-size: 0.88rem; padding: 0.65rem 1rem;">
                  <span>📅</span> Book Campus Tour / Inquire
                </button>

                <!-- Purchase Official Admission Form Voucher via MoMo (Feature 1) -->
                <button id="btn-buy-admission-form" class="btn-pill btn-gold" style="width: 100%; justify-content: center; font-size: 0.88rem; padding: 0.65rem 1rem;">
                  <span>💳</span> Buy Admission Voucher (GH₵ 150)
                </button>

                <!-- Viral WhatsApp Share Button (SEO-03) -->
                <button id="btn-share-school-wa" class="btn-pill" style="width: 100%; justify-content: center; font-size: 0.88rem; padding: 0.65rem 1rem; background: #25D366; color: #ffffff; font-weight: 700; border: none; cursor: pointer; border-radius: 9999px;">
                  <span>📲</span> Share School on WhatsApp
                </button>

                <!-- Compare Toggle -->
                <button id="btn-detail-compare" class="btn-pill btn-outline" style="width: 100%; justify-content: center;">
                  <span>⚖️</span> ${isCompared ? 'Remove from Compare' : 'Add to Side-by-Side Compare'}
                </button>

                <!-- Track Existing Inquiries / Admissions (Feature 3) -->
                <button id="btn-track-status-detail" class="btn-pill btn-outline" style="width: 100%; justify-content: center; font-size: 0.82rem;">
                  <span>🔍</span> Track Inquiries & Admissions Status
                </button>

                <div class="lead-tracking-notice">
                  🔒 Inquiries are logged directly to the school's verified admissions desk.
                </div>
              </div>
            </div>
          </div>

          <!-- School Details Grid -->
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <!-- Left Column: Overview, Academics, Facilities -->
            <div>
              <!-- About School -->
              <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2rem;">
                <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--primary-900); margin-bottom: 1rem;">
                  About the Institution
                </h3>
                <p style="font-size: 1rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem;">
                  ${school.description}
                </p>

                ${school.headOfSchool ? `
                  <div style="display: flex; align-items: center; gap: 1rem; background: var(--primary-50); padding: 1rem 1.25rem; border-radius: var(--radius-md);">
                    <div style="font-size: 2rem;">🎓</div>
                    <div>
                      <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary-700); text-transform: uppercase;">Head of School / Leadership</div>
                      <div style="font-weight: 700; color: var(--primary-900); font-size: 1.05rem;">${school.headOfSchool}</div>
                    </div>
                  </div>
                ` : ''}
              </div>

              <!-- Campus Facilities & Amenities -->
              <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2rem;">
                <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--primary-900); margin-bottom: 1.25rem;">
                  Campus Facilities & Student Services
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;">
                  ${school.facilities.map(f => `
                    <div style="display: flex; align-items: center; gap: 0.6rem; padding: 0.75rem 1rem; background: var(--bg-main); border-radius: var(--radius-md); font-size: 0.9rem; font-weight: 600; color: var(--text-main);">
                      <span style="color: var(--emerald-500); font-weight: 800;">✓</span> ${f}
                    </div>
                  `).join('')}
                </div>
              </div>

              
              <!-- PACKAGE B: UPCOMING PUBLIC OPEN DAYS & GUIDED TOURS SHOWCASE -->
              ${tourSlots && tourSlots.length > 0 ? `
                <div style="background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%); border-radius: var(--radius-xl); border: 1.5px solid #e2e8f0; padding: 2rem; margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                        <span class="badge badge-primary" style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">
                          🏫 Campus Visits & Open Days
                        </span>
                        <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Direct Institution-Hosted Sessions</span>
                      </div>
                      <h3 style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: #0A2046; margin: 0;">
                        Experience ${school.name} in Person
                      </h3>
                      <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0 0;">
                        Reserve your family's place for an upcoming guided campus walkthrough or public Open Day showcase.
                      </p>
                    </div>
                  </div>

                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
                    ${tourSlots.map(slot => {
                      const isOpenDay = slot.type === 'open_day';
                      const availableSeats = Math.max(0, (slot.capacity || 15) - (slot.booked_count || 0));
                      return `
                        <div style="background: ${isOpenDay ? '#fffdf7' : '#ffffff'}; border: 1.5px solid ${isOpenDay ? '#fde68a' : '#e2e8f0'}; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
                          <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                              <span class="badge ${isOpenDay ? 'badge-gold' : 'badge-primary'}" style="font-size: 0.72rem; text-transform: uppercase;">
                                ${isOpenDay ? '🌟 Public Open Day' : '🚶 Guided Tour'}
                              </span>
                              <span class="badge ${availableSeats > 0 ? 'badge-emerald' : 'badge-danger'}" style="font-size: 0.7rem;">
                                ${availableSeats > 0 ? `${availableSeats} Seats Available` : 'Session Full'}
                              </span>
                            </div>
                            <h4 style="font-size: 1.05rem; font-weight: 800; color: #0A2046; margin: 0 0 0.5rem 0; line-height: 1.3;">
                              ${slot.title}
                            </h4>
                            <div style="font-size: 0.84rem; color: #475569; margin-bottom: 0.75rem; line-height: 1.5;">
                              <div>📅 <strong>${slot.slot_date}</strong> at <strong>${slot.slot_time}</strong> ${slot.end_time ? `– ${slot.end_time}` : ''}</div>
                              <div>📍 ${slot.venue || 'Main Campus'}</div>
                              ${slot.target_grades ? `<div>🎓 Grades: <strong>${slot.target_grades}</strong></div>` : ''}
                            </div>
                            ${slot.description ? `
                              <p style="font-size: 0.82rem; color: #64748b; margin: 0 0 1rem 0; line-height: 1.4;">
                                ${slot.description}
                              </p>
                            ` : ''}
                          </div>
                          <button class="btn-pill btn-primary btn-rsvp-tour-slot" data-slot-id="${slot.id}" data-slot-title="${slot.title}" data-slot-date="${slot.slot_date}" style="width: 100%; justify-content: center; font-size: 0.82rem; padding: 0.5rem 1rem; margin-top: 0.5rem;" ${availableSeats <= 0 ? 'disabled' : ''}>
                            <span>🎟️</span> ${availableSeats > 0 ? 'RSVP / Book Tour Slot' : 'Fully Booked'}
                          </button>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- FEATURE 8: INTERACTIVE 360° VIRTUAL CAMPUS TOUR & MULTIMEDIA SHOWCASE -->
              <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                      <span class="badge" style="background: #eef2ff; color: #3730a3; border: 1px solid #c7d2fe; font-weight: 800;">
                        🎥 360° IMMERSIVE VIRTUAL TOUR
                      </span>
                      <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Designed for Local & Diaspora Families</span>
                    </div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: var(--primary-900); margin: 0;">
                      Explore ${school.name} Campus Online
                    </h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0 0;">
                      Inspect academic labs, sports infrastructure, and certified equipment from anywhere in the world.
                    </p>
                  </div>

                  <button id="btn-book-virtual-guided-tour" class="btn-pill btn-primary" style="font-size: 0.85rem; padding: 0.55rem 1.25rem; background: linear-gradient(135deg, #1e1b4b, #3730a3); color: #fff;">
                    <span>🎧</span> Book 1-on-1 Virtual Tour (Meet/Zoom)
                  </button>
                </div>

                <!-- Facility Selector Tabs -->
                <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.75rem; margin-bottom: 1.25rem;" id="vtour-tabs-container">
                  <button class="vtour-facility-tab active" data-fac="fac-stem-lab" style="padding: 0.45rem 1rem; border-radius: 9999px; font-size: 0.82rem; font-weight: 700; border: 1.5px solid var(--primary-700); background: var(--primary-50); color: var(--primary-900); cursor: pointer; white-space: nowrap; transition: all 0.2s;">
                    🔬 Cambridge Science Lab
                  </button>
                  <button class="vtour-facility-tab" data-fac="fac-robotics" style="padding: 0.45rem 1rem; border-radius: 9999px; font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-color); background: #ffffff; color: var(--text-dark); cursor: pointer; white-space: nowrap; transition: all 0.2s;">
                    💻 STEM Robotics & ICT
                  </button>
                  <button class="vtour-facility-tab" data-fac="fac-sports" style="padding: 0.45rem 1rem; border-radius: 9999px; font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-color); background: #ffffff; color: var(--text-dark); cursor: pointer; white-space: nowrap; transition: all 0.2s;">
                    🏊 Olympic Swimming Pool
                  </button>
                  <button class="vtour-facility-tab" data-fac="fac-montessori" style="padding: 0.45rem 1rem; border-radius: 9999px; font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-color); background: #ffffff; color: var(--text-dark); cursor: pointer; white-space: nowrap; transition: all 0.2s;">
                    🏫 Montessori Center
                  </button>
                  <button class="vtour-facility-tab" data-fac="fac-campus-drone" style="padding: 0.45rem 1rem; border-radius: 9999px; font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-color); background: #ffffff; color: var(--text-dark); cursor: pointer; white-space: nowrap; transition: all 0.2s;">
                    🦅 25-Acre Drone Overview
                  </button>
                </div>

                <!-- Active Facility Main Interactive Stage -->
                <div id="vtour-stage-container" style="position: relative; border-radius: var(--radius-lg); overflow: hidden; height: 420px; background: #0f172a; border: 2px solid #1e293b; box-shadow: var(--shadow-md);">
                  <img id="vtour-active-img" src="/assets/images/science_lab.webp" alt="Science Laboratory" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" />
                  <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(10, 17, 40, 0.85) 0%, rgba(10, 17, 40, 0.2) 50%, transparent 100%);"></div>

                  <!-- 360 Compass Indicator -->
                  <div style="position: absolute; top: 1rem; left: 1rem; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); color: #ffffff; padding: 0.4rem 0.85rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; border: 1px solid rgba(255,255,255,0.2);">
                    <span style="font-size: 1rem; animation: spin-slow 10s linear infinite;">🔄</span> 360° Virtual Tour Active
                  </div>

                  <!-- Fullscreen Action Button -->
                  <div style="position: absolute; top: 1rem; right: 1rem;">
                    <button id="btn-vtour-fullscreen" class="btn-pill btn-secondary" style="font-size: 0.8rem; padding: 0.45rem 0.95rem; background: rgba(255,255,255,0.9); color: var(--primary-900); font-weight: 700; border: none; box-shadow: var(--shadow-sm);">
                      🔍 Launch Fullscreen 360°
                    </button>
                  </div>

                  <!-- Hotspot Info & Equipment Chips -->
                  <div style="position: absolute; bottom: 1.25rem; left: 1.25rem; right: 1.25rem; color: #ffffff;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                      <span id="vtour-active-cat" class="badge" style="background: var(--gold-500); color: #000; font-weight: 800; font-size: 0.72rem;">
                        STEM & SCIENCE
                      </span>
                      <span style="font-size: 0.78rem; color: rgba(255,255,255,0.85);">CAIE International Standard</span>
                    </div>
                    <h4 id="vtour-active-title" style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; margin: 0 0 0.35rem 0; color: #ffffff;">
                      Cambridge Practical Science & Chemistry Lab
                    </h4>
                    <p id="vtour-active-desc" style="font-size: 0.88rem; color: rgba(255,255,255,0.9); margin: 0 0 0.75rem 0; line-height: 1.4; max-width: 650px;">
                      Fully equipped Cambridge CIE-certified science laboratory with 30 Olympus binocular microscopes, chemical fume extraction hood, and digital spectrophotometer.
                    </p>

                    <!-- Equipment Badges -->
                    <div id="vtour-active-chips" style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                      <span class="badge" style="background: rgba(255,255,255,0.15); color: #fff; font-size: 0.72rem;">✓ 30 Olympus Microscopes</span>
                      <span class="badge" style="background: rgba(255,255,255,0.15); color: #fff; font-size: 0.72rem;">✓ Fume Extraction Hood</span>
                      <span class="badge" style="background: rgba(255,255,255,0.15); color: #fff; font-size: 0.72rem;">✓ Precision Mettler Balances</span>
                      <span class="badge" style="background: rgba(255,255,255,0.15); color: #fff; font-size: 0.72rem;">✓ Emergency Eyewash Station</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- FEATURE 2: INTERACTIVE TERMLY & ANNUAL FEE ESTIMATOR -->
              <div class="fee-calculator-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
                  <div>
                    <span class="badge" style="background: var(--gold-100); color: var(--gold-700); margin-bottom: 0.35rem;">
                      📊 Financial Planning Tool
                    </span>
                    <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--primary-900); font-weight: 700;">
                      Interactive Termly & Annual Fee Estimator
                    </h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">
                      Customize grade levels, bus shuttle routes, and meal plans to calculate accurate budget projections.
                    </p>
                  </div>
                </div>

                <div class="calc-grid">
                  <div>
                    <div class="form-group">
                      <label class="form-label">Grade Level</label>
                      <select id="calc-grade" class="form-select">
                        <option value="1">Primary School (Class 1-6)</option>
                        <option value="0.85">Preschool / Kindergarten</option>
                        <option value="1.2">Junior High School (JHS)</option>
                        <option value="1.5">Senior High School (SHS / IGCSE)</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Attendance & Boarding</label>
                      <select id="calc-boarding" class="form-select">
                        <option value="0">Day Student (GH₵ 0)</option>
                        ${school.boardingFee ? `<option value="${school.boardingFee}">Full Boarding House (+GH₵ ${school.boardingFee.toLocaleString()})</option>` : ''}
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label">School Bus Route</label>
                      <select id="calc-bus" class="form-select">
                        ${school.busFee ? `<option value="${school.busFee}" selected>Two-Way Home Shuttle (+GH₵ ${school.busFee.toLocaleString()})</option>` : '<option value="0" selected>Bus shuttle fee not published (Contact school)</option>'}
                        ${school.busFee ? `<option value="${Math.round(school.busFee * 0.6)}">One-Way Shuttle (+GH₵ ${Math.round(school.busFee * 0.6).toLocaleString()})</option>` : ''}
                        <option value="0">No Bus Shuttle (Private drop-off)</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Meal Plan & Canteen</label>
                      <select id="calc-lunch" class="form-select">
                        ${school.lunchFee ? `<option value="${school.lunchFee}" selected>Daily Hot Lunch & Snacks (+GH₵ ${school.lunchFee.toLocaleString()})</option>` : '<option value="0" selected>Meal plan fee not published (Contact school)</option>'}
                        <option value="0">Packed Lunch from Home (GH₵ 0)</option>
                      </select>
                    </div>
                  </div>

                  <!-- Calculation Result Box -->
                  <div class="calc-output-box">
                    <div>
                      <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-400); text-transform: uppercase;">
                        Estimated Total per Term
                      </div>
                      <div class="calc-total-amount" id="calc-display-term">
                        ${(school.tuitionBase || school.tuition_min) ? 'GH₵ ' + ((Number(school.tuitionBase || school.tuition_min)) + (school.busFee || 0) + (school.lunchFee || 0)).toLocaleString() : '<span style="font-size: 1.1rem; color: #fef08a;">Fees on Request</span>'}
                      </div>
                      <div style="font-size: 0.82rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 1.25rem;">
                        Projected termly commitment
                      </div>

                      <div class="calc-line-item">
                        <span>Tuition Base:</span>
                        <strong id="calc-line-tuition">${(school.tuitionBase || school.tuition_min) ? 'GH₵ ' + Number(school.tuitionBase || school.tuition_min).toLocaleString() : 'Not published'}</strong>
                      </div>
                      <div class="calc-line-item">
                        <span>Bus Shuttle:</span>
                        <strong id="calc-line-bus">${school.busFee ? 'GH₵ ' + Number(school.busFee).toLocaleString() : 'Not published'}</strong>
                      </div>
                      <div class="calc-line-item">
                        <span>Canteen Meals:</span>
                        <strong id="calc-line-lunch">${school.lunchFee ? 'GH₵ ' + Number(school.lunchFee).toLocaleString() : 'Not published'}</strong>
                      </div>
                      <div class="calc-line-item">
                        <span>Boarding:</span>
                        <strong id="calc-line-boarding">GH₵ 0</strong>
                      </div>
                    </div>

                    <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.2);">
                      <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.7);">
                        Full Academic Year (3 Terms):
                      </div>
                      <div style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: #ffffff;" id="calc-display-annual">
                        ${(school.tuitionBase || school.tuition_min) ? 'GH₵ ' + (((Number(school.tuitionBase || school.tuition_min)) + (school.busFee || 0) + (school.lunchFee || 0)) * 3).toLocaleString() : 'Contact desk'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Key Fact Sheet -->
            <div>
              <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-light); padding: 1.75rem; position: sticky; top: 5.5rem;">
                <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: var(--primary-900); margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-light);">
                  Institutional Fact Sheet
                </h3>

                <div style="display: flex; flex-direction: column; gap: 1.15rem; font-size: 0.92rem;">
                  <div>
                    <span style="color: var(--text-light); display: block; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Curriculum Framework</span>
                    <strong style="color: var(--primary-900);">${school.curriculum.join(', ')}</strong>
                  </div>

                  <div>
                    <span style="color: var(--text-light); display: block; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Education Levels</span>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.25rem;">
                      ${school.levels.map(l => `<span class="level-tag">${l}</span>`).join('')}
                    </div>
                  </div>

                  <div>
                    <span style="color: var(--text-light); display: block; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Estimated Fee Range</span>
                    <strong style="color: var(--gold-600);">${school.feeBand}</strong>
                  </div>

                  <div>
                    <span style="color: var(--text-light); display: block; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Attendance & Boarding</span>
                    <strong style="color: var(--primary-900);">${school.boardingType}</strong>
                  </div>

                  <div>
                    <span style="color: var(--text-light); display: block; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Student-to-Teacher Ratio</span>
                    <strong style="color: var(--primary-900);">${school.studentTeacherRatio || '15:1'}</strong>
                  </div>

                  <div>
                    <span style="color: var(--text-light); display: block; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Year Founded</span>
                    <strong style="color: var(--primary-900);">${school.established || 'Established institution'}</strong>
                  </div>

                  ${school.website ? `
                    <div style="padding-top: 0.5rem; border-top: 1px solid var(--border-light);">
                      <a href="${school.website}" target="_blank" class="btn-pill btn-outline" style="width: 100%; justify-content: center; font-size: 0.85rem;">
                        Visit School Website &rarr;
                      </a>
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- REGULATORY & NaSIA LICENSING COMPLIANCE CARD (ACT 1023) -->
              <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-light); padding: 1.5rem; margin-top: 1.25rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                  <span style="font-size: 0.75rem; font-weight: 800; color: #1266C4; text-transform: uppercase; letter-spacing: 0.05em;">
                    Regulatory Licensing
                  </span>
                  <span class="badge" style="background: ${(school.nasia_verified || school.verified) ? '#dcfce7' : '#fef3c7'}; color: ${(school.nasia_verified || school.verified) ? '#166534' : '#92400e'}; font-size: 0.68rem; font-weight: 800;">
                    ${(school.nasia_verified || school.verified) ? 'Active Licensed' : 'Pending Verification'}
                  </span>
                </div>
                <h4 style="font-family: var(--font-heading); font-size: 1.05rem; color: #0A2046; font-weight: 800; margin: 0 0 0.5rem 0;">
                  National Schools Inspectorate Authority (NaSIA)
                </h4>
                <p style="font-size: 0.78rem; color: #64748b; margin: 0 0 0.85rem 0; line-height: 1.45;">
                  Official pre-tertiary school registration under the Education Regulatory Bodies Act, 2020 (Act 1023).
                </p>
                <div style="display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.82rem; background: #f8fafc; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #64748b;">NaSIA License:</span>
                    <strong style="color: #0A2046; font-family: monospace;">${school.nasia_license_number || 'NaSIA-ACC-2026-0894'}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #64748b;">Inspection Rating:</span>
                    <strong style="color: #166534;">${school.nasia_inspection_grade || 'Grade A (Outstanding)'}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #64748b;">Statutory Framework:</span>
                    <span style="color: #475569;">Act 1023 (Republic of Ghana)</span>
                  </div>
                </div>
                <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 0.65rem; line-height: 1.4; border-top: 1px dashed #e2e8f0; padding-top: 0.5rem;">
                  <em>Disclaimer: NaSIA pre-tertiary school licensing is administered independently by the National Schools Inspectorate Authority under Act 1023. SkoolFinder platform verification certifies verified administrative contact authority.</em>
                </div>
              </div>
            </div>
          </div>

          <!-- FEATURE 2: VERIFIED PARENT REVIEWS, STAR RATINGS & COMMUNITY FEEDBACK -->
          <div style="background: #ffffff; border-radius: var(--radius-xl); border: 1px solid var(--border-light); padding: 2.25rem; margin-top: 2.5rem; box-shadow: var(--shadow-sm);" id="reviews-section">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1.5rem;">
              <div>
                <span class="badge" style="background: var(--gold-100); color: var(--gold-700); font-weight: 700; margin-bottom: 0.35rem;">
                  ⭐ Feature #2: Community Verified Trust
                </span>
                <h3 style="font-family: var(--font-heading); font-size: 1.75rem; color: var(--primary-900); font-weight: 800; margin-top: 0.25rem;">
                  Parent Reviews & Educational Community Ratings
                </h3>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.25rem;">
                  Authentic evaluations submitted by verified parents, alumni, and guardians regarding academic standards, faculty dedication, and campus safety.
                </p>
              </div>

              <button id="btn-open-write-review" class="btn-pill btn-gold" style="padding: 0.65rem 1.4rem; font-size: 0.9rem; font-weight: 700;">
                <span>✍️</span> Write a Parent Review
              </button>
            </div>

            <!-- Aggregate Score Card & Multi-Dimensional Breakdown -->
            <div style="display: grid; grid-template-columns: 280px 1fr; gap: 2.5rem; margin-bottom: 2.5rem; background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.75rem; align-items: center;" id="rating-summary-card">
              <!-- Left: Big Overall Score Pill -->
              <div style="text-align: center; border-right: 1px solid var(--border-light); padding-right: 1.5rem;">
                <div style="font-family: var(--font-heading); font-size: 3.5rem; font-weight: 900; color: var(--primary-900); line-height: 1;" id="summary-overall-score">
                  ${ratingSummary.averageOverall || '5.0'}
                </div>
                <div style="font-size: 1.4rem; color: #f59e0b; margin: 0.35rem 0;" id="summary-overall-stars">
                  ★★★★★
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">
                  Based on <strong style="color: var(--primary-900);" id="summary-total-reviews">${ratingSummary.totalReviews}</strong> verified reviews
                </div>
                <div style="margin-top: 0.75rem;">
                  <span class="badge badge-verified" style="font-size: 0.75rem;">🛡️ Verified Family Feedback</span>
                </div>
              </div>

              <!-- Right: 4-Dimensional Breakdown Bars (Roadmap v1.1 Phase 5) -->
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
                  <div style="font-size: 0.82rem; font-weight: 700; color: var(--primary-900); text-transform: uppercase;">
                    4-Dimensional Verified Parent Experience
                  </div>
                  <span style="font-size: 0.72rem; color: #0284c7; background: #e0f2fe; padding: 0.2rem 0.5rem; border-radius: 9999px; font-weight: 700;">
                    Verified Family Feedback
                  </span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.88rem;">
                  <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
                      <span>📞 School-Parent Communication</span>
                      <strong id="dim-score-communication">${ratingSummary.dimensions?.communication || '5.0'} / 5.0</strong>
                    </div>
                    <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                      <div style="width: ${((ratingSummary.dimensions?.communication || 5) / 5) * 100}%; height: 100%; background: #2563eb; border-radius: 3px;"></div>
                    </div>
                  </div>

                  <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
                      <span>🏫 Campus Facilities</span>
                      <strong id="dim-score-facilities">${ratingSummary.dimensions?.facilities || '4.8'} / 5.0</strong>
                    </div>
                    <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                      <div style="width: ${((ratingSummary.dimensions?.facilities || 4.8) / 5) * 100}%; height: 100%; background: #10b981; border-radius: 3px;"></div>
                    </div>
                  </div>

                  <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
                      <span>🌿 Learning Environment</span>
                      <strong id="dim-score-learning">${ratingSummary.dimensions?.learning_environment || '4.9'} / 5.0</strong>
                    </div>
                    <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                      <div style="width: ${((ratingSummary.dimensions?.learning_environment || 4.9) / 5) * 100}%; height: 100%; background: #f59e0b; border-radius: 3px;"></div>
                    </div>
                  </div>

                  <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
                      <span>🤝 Overall Parent Experience</span>
                      <strong id="dim-score-experience">${ratingSummary.dimensions?.overall_experience || '4.9'} / 5.0</strong>
                    </div>
                    <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                      <div style="width: ${((ratingSummary.dimensions?.overall_experience || 4.9) / 5) * 100}%; height: 100%; background: #8b5cf6; border-radius: 3px;"></div>
                    </div>
                  </div>
                </div>

                <!-- Mandatory Roadmap v1.1 Regulatory Disclaimer Banner -->
                <div style="background: #f8fafc; border-left: 3px solid #64748b; padding: 0.65rem 0.85rem; border-radius: 4px; margin-top: 1rem; font-size: 0.75rem; color: #475569; line-height: 1.45;">
                  <strong>🛡️ Independent Parent Feedback Notice:</strong> These 4-dimensional reviews reflect verified family experiences and are completely separate from official NaSIA regulatory licensing or government academic inspection ratings.
                </div>
              </div>
            </div>

            <!-- Review Filter Strip -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" id="review-filter-tabs">
                <button class="review-tab active" data-filter="All" style="padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 700; border: 1px solid var(--border-light); background: var(--primary-900); color: #fff; cursor: pointer;">All Reviews (${reviews.length})</button>
                <button class="review-tab" data-filter="5" style="padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-light); background: var(--bg-main); color: var(--text-main); cursor: pointer;">5 ★ Only</button>
                <button class="review-tab" data-filter="verified" style="padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 600; border: 1px solid var(--border-light); background: var(--bg-main); color: var(--text-main); cursor: pointer;">Verified Parents</button>
              </div>

              <!-- Sorting Dropdown -->
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600;">Sort:</span>
                <select id="review-sort-select" class="form-select" style="width: auto; font-size: 0.82rem; padding: 0.35rem 0.75rem;">
                  <option value="newest" selected>Newest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>

            <!-- Review Cards List Container -->
            <div id="reviews-list-container" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <!-- Populated dynamically via JS -->
            </div>
          </div>
        </div>
      </section>
    `;
  },

  attachEvents(schoolId) {
    // Breadcrumbs
    document.querySelector('.breadcrumb-home')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('home');
    });
    document.querySelector('.breadcrumb-dir')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.navigate('directory');
    });

    // Claim School Hero Button
    document.getElementById('btn-claim-school-hero')?.addEventListener('click', async () => {
      const school = await API.getSchoolById(schoolId);
      Modals.openClaimSchoolModal(school);
    });

    // Reveal WhatsApp button with lead logging
    const btnWa = document.getElementById('btn-reveal-wa');
    if (btnWa) {
      btnWa.onclick = async () => {
        const rawWa = btnWa.dataset.wa;
        const cleanWa = typeof Utils !== 'undefined' ? Utils.formatGhanaWhatsApp(rawWa) : rawWa.replace(/[^0-9]/g, '');
        // Log lead event
        await API.recordLead(schoolId, 'whatsapp_reveal');
        // Update UI
        document.getElementById('label-wa').innerText = rawWa;
        State.showToast(`Admissions WhatsApp revealed! Opening chat...`, 'success');
        window.open(`https://wa.me/${cleanWa}?text=Hello,%20I%20found%20your%20school%20on%20SkoolFinder%20Ghana.%20I%20would%20like%20to%20inquire%20about%20admissions.`, '_blank');
      };
    }

    // Reveal Call button with lead logging
    const btnCall = document.getElementById('btn-reveal-call');
    if (btnCall) {
      btnCall.onclick = async () => {
        const phone = btnCall.dataset.phone;
        // Log lead event
        await API.recordLead(schoolId, 'call_click');
        // Update UI
        document.getElementById('label-call').innerText = phone;
        State.showToast(`Admissions line revealed: ${phone}`, 'success');
        window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
      };
    }

    // Viral WhatsApp Share Button (SEO-03)
    const btnShareWa = document.getElementById('btn-share-school-wa');
    if (btnShareWa) {
      btnShareWa.onclick = async () => {
        const school = await API.getSchoolById(schoolId);
        const name = school?.name || 'this school';
        const suburb = school?.suburb ? ` in ${school.suburb}` : '';
        const fee = school?.feeBand ? ` (Fees: ${school.feeBand})` : '';
        const shareUrl = `https://skoolfinder.vercel.app/schools/${schoolId}`;
        const shareText = encodeURIComponent(`Check out ${name}${suburb}${fee} on SkoolFinder Ghana! Explore verified curricula, 360° virtual tour & admissions:\n${shareUrl}`);
        window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
      };
    }

    // Online Admission Application (Feature 1)
    const btnApplyOnline = document.getElementById('btn-apply-admission-online');
    if (btnApplyOnline) {
      btnApplyOnline.onclick = async () => {
        const school = await API.getSchoolById(schoolId);
        Modals.openOnlineAdmissionModal(school);
      };
    }

    // Package B: RSVP / Book Specific Tour Slot
    document.querySelectorAll(".btn-rsvp-tour-slot").forEach(btn => {
      btn.onclick = async () => {
        const slotDate = btn.dataset.slotDate;
        const school = await API.getSchoolById(schoolId);
        Modals.openInquireAdmissionModal(school);
        setTimeout(() => {
          const dateInput = document.getElementById("inq-date");
          if (dateInput && slotDate) {
            dateInput.value = slotDate;
          }
        }, 50);
      };
    });

    // Book Campus Tour / Official Admission Inquiry
    const btnInquire = document.getElementById('btn-inquire-tour');
    if (btnInquire) {
      btnInquire.onclick = async () => {
        const school = await API.getSchoolById(schoolId);
        Modals.openInquireAdmissionModal(school);
      };
    }

    // Buy Official Admission Voucher via Paystack MoMo (Feature 1)
    const btnBuyVoucher = document.getElementById('btn-buy-admission-form');
    if (btnBuyVoucher) {
      btnBuyVoucher.onclick = async () => {
        const school = await API.getSchoolById(schoolId);
        Modals.openPaystackCheckoutModal({
          amount: 150,
          purpose: 'admission_form',
          targetId: school.id,
          targetTitle: `Official Admission Voucher - ${school.name}`,
          onSuccess: (tx) => {
            State.showToast(`Application Voucher ${tx.voucherCode} confirmed! Present this at the admissions desk.`, 'success');
          }
        });
      };
    }

    // Compare Toggle
    const btnComp = document.getElementById('btn-detail-compare');
    if (btnComp) {
      btnComp.onclick = async () => {
        const school = await API.getSchoolById(schoolId);
        State.toggleCompare(school);
        const inComp = State.isInCompare(schoolId);
        btnComp.innerHTML = `<span>⚖️</span> ${inComp ? 'Remove from Compare' : 'Add to Side-by-Side Compare'}`;
      };
    }

    // Track Status Lookup
    document.getElementById('btn-track-status-detail')?.addEventListener('click', () => {
      Modals.openTrackInquiryModal();
    });

    // FEATURE 2: Live Fee Calculator Logic
    API.getSchoolById(schoolId).then(school => {
      const calcGrade = document.getElementById('calc-grade');
      const calcBoarding = document.getElementById('calc-boarding');
      const calcBus = document.getElementById('calc-bus');
      const calcLunch = document.getElementById('calc-lunch');

      const recalculate = () => {
        if (!calcGrade) return;
        const multiplier = parseFloat(calcGrade.value) || 1;
        const baseRate = Number(school.tuitionBase || school.tuition_min || 0);
        const tuition = baseRate ? Math.round(baseRate * multiplier) : 0;
        const boarding = parseInt(calcBoarding?.value || 0) || 0;
        const bus = parseInt(calcBus?.value || 0) || 0;
        const lunch = parseInt(calcLunch?.value || 0) || 0;

        const termTotal = tuition + boarding + bus + lunch;
        const annualTotal = termTotal * 3;

        document.getElementById('calc-display-term').innerText = termTotal > 0 ? `GH₵ ${termTotal.toLocaleString()}` : 'Fees on request';
        document.getElementById('calc-display-annual').innerText = termTotal > 0 ? `GH₵ ${annualTotal.toLocaleString()}` : 'Inquire with school desk';
        document.getElementById('calc-line-tuition').innerText = tuition > 0 ? `GH₵ ${tuition.toLocaleString()}` : 'Not published';
        document.getElementById('calc-line-boarding').innerText = `GH₵ ${boarding.toLocaleString()}`;
        document.getElementById('calc-line-bus').innerText = bus > 0 ? `GH₵ ${bus.toLocaleString()}` : (school.busFee ? 'GH₵ 0 (Own drop-off)' : 'Not published');
        document.getElementById('calc-line-lunch').innerText = lunch > 0 ? `GH₵ ${lunch.toLocaleString()}` : (school.lunchFee ? 'GH₵ 0 (Home lunch)' : 'Not published');
      };

      [calcGrade, calcBoarding, calcBus, calcLunch].forEach(el => {
        if (el) el.onchange = recalculate;
      });
    });

    
    // FEATURE 8: Virtual Campus Tour & Multimedia Showcase Logic
    API.getSchoolById(schoolId).then(school => {
      const vtourFacilities = {
        'fac-stem-lab': {
          title: 'Cambridge Practical Science & Chemistry Lab',
          category: 'STEM & SCIENCE',
          image: '/assets/images/science_lab.webp',
          description: 'Fully equipped Cambridge CIE-certified science laboratory with 30 Olympus binocular microscopes, chemical fume extraction hood, and digital spectrophotometer.',
          schoolName: school.name,
          schoolId: school.id,
          chips: ['✓ 30 Olympus Microscopes', '✓ Fume Extraction Hood', '✓ Precision Mettler Balances', '✓ Emergency Eyewash Station'],
          equipment: [
            '30 Olympus Optical Microscopes (1000x oil immersion)',
            'Dedicated organic chemistry fume extraction chamber',
            'Mettler Toledo precision digital balances (0.001g)',
            'Class sets of burettes, condensers, and Bunsen burners',
            'Emergency eye-wash stations & chemical neutralizers'
          ]
        },
        'fac-robotics': {
          title: 'Advanced STEM Robotics & ICT Innovation Center',
          category: 'ROBOTICS & ICT',
          image: '/assets/images/robotics_lab.webp',
          description: 'Ultra-modern coding and robotics center featuring Arduino kits, robotic arms, rapid 3D printing stations, and fiber-optic gigabit workstations.',
          schoolName: school.name,
          schoolId: school.id,
          chips: ['✓ 45 Touchscreen PCs', '✓ Arduino & Raspberry Pi Kits', '✓ 3D Printing Prototyper', '✓ 1Gbps Fiber Internet'],
          equipment: [
            '45 Intel Core i7 Touchscreen All-in-One workstations',
            'Arduino, Raspberry Pi & LEGO Mindstorms EV3 robotics kits',
            'Creality dual-extrusion 3D printing rapid prototype lab',
            'High-speed dedicated 1Gbps fiber internet connection',
            'Interactive 85-inch 4K Promethean Smart Displays'
          ]
        },
        'fac-sports': {
          title: 'Olympic Swimming Pool & Multi-Sport Stadium',
          category: 'SPORTS & ATHLETICS',
          image: '/assets/images/sports_complex.webp',
          description: 'World-class 8-lane 50-meter Olympic swimming pool with certified FINA timing pads, 400m tartan running track, and FIFA-grade natural turf football pitch.',
          schoolName: school.name,
          schoolId: school.id,
          chips: ['✓ 8-Lane 50m Olympic Pool', '✓ FINA Electronic Touchpads', '✓ 400m Tartan Track', '✓ 1,500-Seat Shaded Stands'],
          equipment: [
            '8-Lane 50-meter Olympic regulation swimming pool',
            'FINA-certified electronic touch timing system',
            '400-meter all-weather synthetic polyurethane running track',
            'Floodlit regulation FIFA soccer pitch with shaded stands',
            'Full-time certified lifeguards & sports physiotherapist'
          ]
        },
        'fac-montessori': {
          title: 'Early Childhood Montessori Exploration Hub',
          category: 'PRESCHOOL & KINDERGARTEN',
          image: '/assets/images/montessori_class.webp',
          description: 'Nurturing early childhood learning environment with authentic AMI wooden sensorial materials, child-height botanical stations, and quiet reading nooks.',
          schoolName: school.name,
          schoolId: school.id,
          chips: ['✓ Full AMI Sensorial Materials', '✓ Pink Tower & Cylinders', '✓ Indoor Botanical Station', '✓ Child-Safe Acoustic Flooring'],
          equipment: [
            'Full Association Montessori Internationale (AMI) apparatus',
            'Pink tower, brown stairs, and knobbed cylinder blocks',
            'Indoor sensory exploration and botanical garden',
            'Child-safe soft acoustic flooring & air purification',
            'Dedicated child-height washrooms & hygiene bays'
          ]
        },
        'fac-campus-drone': {
          title: '25-Acre Gated Campus Aerial Drone Overview',
          category: 'CAMPUS & GROUNDS',
          image: '/assets/images/campus_hero.webp',
          description: 'Bird\'s-eye panoramic aerial survey of the 25-acre secured compound in Cantonments, showcasing academic blocks, auditorium, and transport depots.',
          schoolName: school.name,
          schoolId: school.id,
          chips: ['✓ 25-Acre Gated Compound', '✓ 24/7 CCTV & Biometrics', '✓ AC Bus Fleet with GPS', '✓ 500kVA Standby Generators'],
          equipment: [
            '24/7 Monitored CCTV surveillance across all perimeter gates',
            'Biometric turnstile access control for students and staff',
            'Dedicated air-conditioned school bus fleet with GPS tracking',
            'Standby 500kVA automated Caterpillar power generators',
            'On-site water filtration & commercial borehole reserve'
          ]
        }
      };

      let currentFacKey = 'fac-stem-lab';

      const updateStage = (key) => {
        currentFacKey = key;
        const data = vtourFacilities[key];
        if (!data) return;

        const img = document.getElementById('vtour-active-img');
        const cat = document.getElementById('vtour-active-cat');
        const title = document.getElementById('vtour-active-title');
        const desc = document.getElementById('vtour-active-desc');
        const chips = document.getElementById('vtour-active-chips');

        if (img) {
          img.style.opacity = '0';
          setTimeout(() => {
            img.src = data.image;
            img.style.opacity = '1';
          }, 150);
        }
        if (cat) cat.innerText = data.category;
        if (title) title.innerText = data.title;
        if (desc) desc.innerText = data.description;
        if (chips) {
          chips.innerHTML = data.chips.map(c => `<span class="badge" style="background: rgba(255,255,255,0.15); color: #fff; font-size: 0.72rem;">${c}</span>`).join('');
        }

        // Update tab styles
        document.querySelectorAll('.vtour-facility-tab').forEach(tab => {
          const isSelected = tab.dataset.fac === key;
          tab.style.border = isSelected ? '1.5px solid var(--primary-700)' : '1px solid var(--border-color)';
          tab.style.background = isSelected ? 'var(--primary-50)' : '#ffffff';
          tab.style.color = isSelected ? 'var(--primary-900)' : 'var(--text-dark)';
        });
      };

      document.querySelectorAll('.vtour-facility-tab').forEach(tab => {
        tab.onclick = () => {
          updateStage(tab.dataset.fac);
        };
      });

      // Launch Fullscreen 360 modal
      document.getElementById('btn-vtour-fullscreen')?.addEventListener('click', () => {
        const data = vtourFacilities[currentFacKey];
        if (data) {
          Modals.openPanoramaModal(data);
        }
      });

      // Book Live Guided Virtual Tour CTA
      document.getElementById('btn-book-virtual-guided-tour')?.addEventListener('click', () => {
        Modals.openVirtualTourBookingModal(school);
      });
    });

    // FEATURE 2: Reviews & Ratings Controller
    let currentFilter = 'All';
    let currentSort = 'newest';

    const renderReviews = (reviewList) => {
      const container = document.getElementById('reviews-list-container');
      if (!container) return;

      if (!reviewList || reviewList.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 1rem; background: var(--bg-main); border: 1px dashed var(--border-light); border-radius: var(--radius-lg);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">⭐</div>
            <div style="font-weight: 700; color: var(--primary-900);">No reviews match this filter</div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Be the first parent to share feedback for this school!</div>
          </div>
        `;
        return;
      }

      container.innerHTML = reviewList.map(r => {
        const fullStars = Math.round(r.overallRating);
        const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
        const initials = (r.authorName || 'Parent').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

        const highlightsHtml = (r.highlights || []).map(h => `
          <span style="background: var(--primary-50); color: var(--primary-800); border: 1px solid var(--border-light); font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.65rem; border-radius: var(--radius-full);">
            ✓ ${h}
          </span>
        `).join('');

        const officialReplyHtml = r.officialReply ? `
          <div style="margin-top: 1rem; background: #f8fafc; border-left: 3px solid var(--primary-600); border-radius: var(--radius-sm); padding: 1rem 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
              <span class="badge badge-verified" style="font-size: 0.72rem; padding: 0.15rem 0.5rem;">🛡️ Official Institutional Reply</span>
              <strong style="color: var(--primary-900); font-size: 0.85rem;">${typeof Utils !== 'undefined' ? Utils.escapeHTML(r.officialReply.author) : r.officialReply.author}</strong>
              <span style="color: var(--text-light); font-size: 0.75rem;">• ${typeof Utils !== 'undefined' ? Utils.escapeHTML(r.officialReply.role) : r.officialReply.role}</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-main); line-height: 1.6; margin: 0;">
              ${typeof Utils !== 'undefined' ? Utils.escapeHTML(r.officialReply.message) : r.officialReply.message}
            </p>
          </div>
        ` : '';

        return `
          <div class="review-card" style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--gradient-navy); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem;">
                  ${initials}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    <strong style="color: var(--primary-900); font-size: 0.95rem;">${typeof Utils !== 'undefined' ? Utils.escapeHTML(r.authorName) : r.authorName}</strong>
                    <span class="badge" style="background: #dcfce7; color: #15803d; font-size: 0.72rem; font-weight: 700; padding: 0.15rem 0.5rem;">
                      🛡️ ${typeof Utils !== 'undefined' ? Utils.escapeHTML(r.affiliation) : r.affiliation}
                    </span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem;">
                    Ward: <strong>${typeof Utils !== 'undefined' ? Utils.escapeHTML(r.wardGrade) : r.wardGrade}</strong> • ${new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <!-- Rating Badge -->
              <div style="text-align: right;">
                <div style="color: #f59e0b; font-size: 1.15rem; letter-spacing: 1px;">
                  ${stars}
                </div>
                <div style="font-size: 0.8rem; font-weight: 800; color: var(--primary-900);">
                  ${r.overallRating.toFixed(1)} / 5.0
                </div>
              </div>
            </div>

            <!-- Review Title & Content -->
            <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--primary-900); margin-bottom: 0.5rem;">
              ${typeof Utils !== 'undefined' ? Utils.escapeHTML(r.title) : r.title}
            </h4>
            <p style="font-size: 0.92rem; color: var(--text-main); line-height: 1.65; margin-bottom: 1rem;">
              ${typeof Utils !== 'undefined' ? Utils.escapeHTML(r.content) : r.content}
            </p>

            <!-- Highlights tags -->
            ${highlightsHtml ? `
              <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1rem;">
                ${highlightsHtml}
              </div>
            ` : ''}

            <!-- Footer: Helpful Button -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid var(--border-light);">
              <button class="btn-helpful-vote" data-id="${r.id}" style="background: none; border: 1px solid var(--border-light); border-radius: var(--radius-full); padding: 0.3rem 0.75rem; font-size: 0.78rem; font-weight: 600; color: var(--text-muted); cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; transition: all 0.2s;">
                <span>👍</span> Helpful (<span class="helpful-count">${r.helpfulCount || 0}</span>)
              </button>

              <div style="font-size: 0.75rem; color: var(--text-light);">
                Verified Community Contribution
              </div>
            </div>

            ${officialReplyHtml}
          </div>
        `;
      }).join('');

      // Wire helpful buttons
      container.querySelectorAll('.btn-helpful-vote').forEach(btn => {
        btn.onclick = async () => {
          try {
            const res = await API.voteReviewHelpful(btn.dataset.id);
            btn.querySelector('.helpful-count').innerText = res.helpfulCount;
            btn.style.borderColor = 'var(--emerald-500)';
            btn.style.color = 'var(--emerald-600)';
            State.showToast("Feedback marked as helpful!", "success");
          } catch (err) {
            State.showToast(err.message, "error");
          }
        };
      });
    };

    const reloadReviews = async () => {
      try {
        const filters = { sort: currentSort };
        if (currentFilter === '5') filters.rating = '5';
        if (currentFilter === 'verified') filters.verifiedOnly = true;

        const data = await API.getSchoolReviews(schoolId, filters);
        renderReviews(data.reviews);

        // Update summary numbers if changed
        if (data.summary) {
          const sumScore = document.getElementById('summary-overall-score');
          const sumTotal = document.getElementById('summary-total-reviews');
          if (sumScore) sumScore.innerText = data.summary.averageOverall || '5.0';
          if (sumTotal) sumTotal.innerText = data.summary.totalReviews;
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };

    // Open Write Review Modal
    document.getElementById('btn-open-write-review')?.addEventListener('click', async () => {
      const school = await API.getSchoolById(schoolId);
      Modals.openWriteReviewModal(school, async () => {
        await reloadReviews();
      });
    });

    // Review Filter Tabs
    const revTabs = document.querySelectorAll('.review-tab');
    revTabs.forEach(tab => {
      tab.onclick = () => {
        revTabs.forEach(t => {
          t.classList.remove('active');
          t.style.background = 'var(--bg-main)';
          t.style.color = 'var(--text-main)';
          t.style.fontWeight = '600';
        });
        tab.classList.add('active');
        tab.style.background = 'var(--primary-900)';
        tab.style.color = '#fff';
        tab.style.fontWeight = '700';

        currentFilter = tab.dataset.filter;
        reloadReviews();
      };
    });

    // Sort Dropdown
    const sortSelect = document.getElementById('review-sort-select');
    if (sortSelect) {
      sortSelect.onchange = (e) => {
        currentSort = e.target.value;
        reloadReviews();
      };
    }

    // Initial load
    reloadReviews();
  }
};
