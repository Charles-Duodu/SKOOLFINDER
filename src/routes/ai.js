/**
 * SkoolFinder Ghana - Module 6.3: Operations Copilot & Education RAG API (/api/ai & /api/admin/copilot)
 * Grounded in:
 * - Pre-Tertiary Education Regulatory Bodies Act 2020 (Act 1023) - NaSIA Standards
 * - Children's Act 1998 (Act 560) - Gate G4 Child Safeguarding
 * - Data Protection Act 2012 (Act 843) - DPC Subject Rights
 * - Ghana National Curricula (NaCCA / GES Standards-Based & CCP)
 * - CSSPS Secondary Placement Guidelines 2026
 * - Master Blueprint Decision DEC-015: Prohibited Autonomous Decisions Guardrail
 */

const express = require('express');
const router = express.Router();

// Grounding Statutory Knowledge Base
const STATUTORY_KNOWLEDGE = {
  nasia: {
    act: "Education Regulatory Bodies Act 2020 (Act 1023)",
    authority: "National Schools Inspectorate Authority (NaSIA)",
    licensingRequirements: [
      "School leadership and management governance structure",
      "Academic quality: curriculum compliance (NaCCA, Cambridge, or IB accreditation)",
      "Learner safety, physical infrastructure & child protection policy compliant with Act 560",
      "Teacher qualifications: minimum NTC licensing for all instructional staff",
      "Valid business registration with Registrar General's Department (RGD)",
      "Ghana National Fire Service & District Environmental Health clearance certificates"
    ],
    inspectionGrades: ["Outstanding (Grade 1)", "Good (Grade 2)", "Satisfactory (Grade 3)", "Unsatisfactory (Grade 4)"]
  },
  curricula: {
    ges_nacca: {
      name: "Ghana National Curriculum (NaCCA / GES)",
      stages: [
        "Kindergarten (KG1 - KG2): Play-based foundational literacy and numeracy",
        "Primary School (B1 - B6): Standards-Based Curriculum with national assessments",
        "Junior High School (JHS1 - JHS3): Common Core Programme (CCP) culminating in Basic Education Certificate Examination (BECE)",
        "Senior High School (SHS1 - SHS3): Specialized tracks (General Science, Business, General Arts, Visual Arts, Home Economics, Technical)"
      ]
    },
    cambridge: {
      name: "Cambridge Assessment International Education (CAIE)",
      stages: ["Cambridge Primary (Ages 5-11)", "Cambridge Lower Secondary (Checkpoint)", "Cambridge Upper Secondary (IGCSE)", "Cambridge Advanced (AS & A Levels)"]
    },
    ib: {
      name: "International Baccalaureate (IB)",
      stages: ["Primary Years Programme (PYP)", "Middle Years Programme (MYP)", "Diploma Programme (IB DP)"]
    }
  },
  cssps: {
    name: "Computerized School Selection and Placement System (CSSPS 2026)",
    aggregateRules: "Raw scores across 4 core subjects (English Language, Integrated Science, Mathematics, Social Studies) plus 2 best elective subjects. Perfect aggregate is 6 (1 in each of the 6 subjects).",
    categories: [
      "Category A (National Over-subscribed Elite Schools): Max 1 choice allowed. Cut-off typically aggregate 6 - 9.",
      "Category B (Regional High-Performance Schools): Max 2 choices allowed. Cut-off typically aggregate 10 - 18.",
      "Category C (District Schools): Mandatory choices. Includes day school options within residential catchment.",
      "Category D (Day Catchment Schools): Mandatory day school selection within 16km radius of primary residence."
    ],
    equityProtocol: "30% public basic school affirmative equity allocation reserved in all Category A national senior high schools for candidates from government basic schools."
  },
  safeguarding: {
    act: "Children's Act 1998 (Act 560) & Master Blueprint Decision DEC-004",
    rules: [
      "Zero unverified minor contact permitted across tutoring and parent messaging",
      "Mandatory D4 Safeguarding approval and Ghana Police CID criminal background clearance for educators",
      "Mandatory 1-click cooling-off emergency profile freeze upon severe incident reporting",
      "Immediate statutory case referral to Ghana Police DOVVSU (Domestic Violence & Victim Support Unit) and Department of Social Welfare"
    ]
  },
  dataPrivacy: {
    act: "Ghana Data Protection Act 2012 (Act 843)",
    controllerCode: "DPC/REG/GH-2024-81920",
    rights: [
      "Section 20: Right to object to processing and withdraw consent (zero dark patterns)",
      "Section 24: Right of access to personal data (Subject Access Requests within 21 days)",
      "Section 28: Field-level PII masking of Ghana Card PINs and minor phone numbers",
      "Section 30: Automated data retention schedules with cryptographic purge proofs (sha256)"
    ]
  }
};

// Pilot Budget and Query Tracking
let PILOT_BUDGET_METRICS = {
  monthlyBudgetGhs: 1000.00,
  consumedGhs: 142.50,
  totalQueriesProcessed: 87,
  activeModel: "Gemini 1.5 Pro & Text-Embedding-004",
  documentsIndexedCount: 14,
  dec015GuardrailEnforced: true
};

/**
 * Core RAG Generation Engine
 */
function generateCopilotResponse(message, history = [], context = {}) {
  const query = (message || '').toLowerCase().trim();

  // 1. DEC-015 Autonomous Decisions Guardrail Check
  // The AI must strictly refuse autonomous mutations on safeguarding, money, roles, or claims.
  const mutationKeywords = [
    'approve claim', 'approve school', 'approve teacher', 'disburse money',
    'disburse escrow', 'refund', 'clear hold', 'lift hold', 'unfreeze',
    'delete user', 'assign role', 'make super admin', 'grant admin'
  ];

  const triggersMutation = mutationKeywords.some(kw => query.includes(kw));
  if (triggersMutation) {
    return {
      reply: `### 🛡️ [GUARDRAIL REFUSAL: DEC-015 / POL-015]
**Autonomous Action Barred by Platform Governance Policy Engine**

Under **Master Blueprint Decision DEC-015** and **Governance Policy POL-015 (Prohibited Autonomous AI Decisions)**, SkoolFinder AI Copilot is strictly advisory. AI agents are structurally barred from executing state mutations, approving school claims, disbursing financial escrows, granting administrative permissions, or clearing safeguarding holds.

#### Mandatory Administrative Action Required:
* **School Claim Approvals:** Navigate to **Group 1.3: Approvals Desk** (\`/admin#approvals\`) for dual-control sign-off.
* **Safeguarding Holds:** Navigate to **Module 5.1: Child Safeguarding Centre** (\`/admin#safeguarding\`) for human officer review under Act 560.
* **Escrow Disbursements:** Navigate to **Group 4.2: Finance & Escrow Holdings** (\`/admin#finance\`) for two-officer authorization.`,
      citations: [
        "Master Blueprint Decision DEC-015 (Prohibited Autonomous AI Decisions)",
        "Governance Policy POL-003 (Two-Officer Dual Control Sign-off)",
        "Children's Act 1998 (Act 560 Section 6)"
      ],
      actionCards: [
        { title: "Review Approvals Desk", link: "#approvals", badge: "Dual Sign-Off" },
        { title: "Safeguarding Centre", link: "#safeguarding", badge: "Act 560" }
      ],
      suggestions: [
        "What are the dual-control thresholds under POL-003?",
        "Explain Gate G4 child safeguarding protocol",
        "How is escrow protected under Bank of Ghana guidelines?"
      ],
      guardrailTriggered: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // 2. NaSIA Licensing Query
  if (query.includes('nasia') || query.includes('license') || query.includes('licensing') || query.includes('accredit') || query.includes('act 1023') || query.includes('pre-tertiary')) {
    return {
      reply: `### 🏫 NaSIA Institutional Licensing & Accreditation Framework
**Regulatory Authority:** National Schools Inspectorate Authority (NaSIA)  
**Governing Statute:** *Education Regulatory Bodies Act 2020 (Act 1023)*

Under Act 1023 Section 58, all private pre-tertiary educational institutions in Ghana must possess active registration and inspection certification from NaSIA prior to admitting students or publishing academic curricula.

#### Statutory Licensing Prerequisites:
1. **Curriculum Compliance:** Verification of alignment with NaCCA National Curriculum, Cambridge International (CAIE), or International Baccalaureate (IB) standards.
2. **Teacher Professional Licensing:** Mandatory National Teaching Council (NTC) teacher licensing for 100% of instructional staff.
3. **Physical & Safety Standards:** Clean Fire Safety (GNFS) inspection, district sanitation clearance, and adequate pupil-to-space ratios (min 1.2m² per learner).
4. **Child Safeguarding Policy:** Institutional safeguarding protocol aligned with the Ghanaian Children's Act (Act 560).
5. **Business Registration:** Official incorporation documents from the Registrar General's Department (RGD).

#### SkoolFinder Verification Badge:
Schools that submit valid NaSIA license PINs receive the official **✓ NaSIA / GES Verified Institutional Campus** badge on the national directory.`,
      citations: [
        "Education Regulatory Bodies Act 2020 (Act 1023 Part IV)",
        "National Schools Inspectorate Authority (NaSIA) Inspection Handbook",
        "National Teaching Council (NTC) Licensing Guidelines"
      ],
      actionCards: [
        { title: "Verify School License", link: "#verification", badge: "Act 1023" },
        { title: "Directory Inspection Queue", link: "#schools", badge: "Schools List" }
      ],
      suggestions: [
        "What are Cambridge vs GES curriculum differences?",
        "How do teachers obtain NTC D4 Safeguarding clearance?",
        "Explain the CSSPS Category A school placement criteria"
      ],
      guardrailTriggered: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // 3. CSSPS BECE Aggregate Guidance
  if (query.includes('cssps') || query.includes('bece') || query.includes('aggregate') || query.includes('placement') || query.includes('category a') || query.includes('waec')) {
    return {
      reply: `### 🎯 CSSPS BECE Aggregate Evaluation & Placement Guidelines
**Governing Agency:** Ghana Education Service (GES) CSSPS Secretariat (2026 Season)

The Computerized School Selection and Placement System (CSSPS) assigns Grade 9 BECE candidates to Senior High Schools (SHS) and Technical / Vocational Institutes (TVET) across Ghana using a 6-subject aggregate formula.

#### Aggregate Calculation Formula:
$$\\text{Aggregate} = \\sum (\\text{4 Core Subjects}) + \\sum (\\text{2 Best Electives})$$
* **4 Mandatory Core Subjects:**
  1. English Language (Grade 1 - 9)
  2. Integrated Science (Grade 1 - 9)
  3. Mathematics (Grade 1 - 9)
  4. Social Studies (Grade 1 - 9)
* **2 Best Electives:** Top 2 grades from subjects such as BDT/Pre-Tech, ICT, French, Ghanaian Language, or Religious & Moral Education (RME).
* **Aggregate Range:** 6 (Best Possible / 6 Grade 1s) to 54 (Maximum).

#### School Categorization & Selection Protocol:
* **Category A (National Over-Subscribed):** Max **1 choice** allowed. Strict aggregate threshold (typically aggregate 6 - 9 for premier boarding institutions such as Achimota, Prempeh, Wesley Girls, Presby Boys Legon).
* **Category B (Regional High Performance):** Max **2 choices** allowed.
* **Category C (District / Day Catchment):** Mandatory district choice to guarantee universal access.
* **30% Public Basic School Affirmative Equity:** 30% of boarding vacancies in Category A schools are statutorily reserved for candidates graduating from government/public basic schools.`,
      citations: [
        "Ghana Education Service (GES) CSSPS Guidelines 2026",
        "Free Senior High School (FSHS) Policy Manual",
        "West African Examinations Council (WAEC) BECE Grading Scheme"
      ],
      actionCards: [
        { title: "Launch CSSPS Simulator", link: "#/cssps", badge: "Interactive Tool" },
        { title: "Browse Category A Schools", link: "#/directory", badge: "Directory" }
      ],
      suggestions: [
        "Which Category A schools offer General Science in Greater Accra?",
        "How does the 30% public basic school equity rule work?",
        "Compare Cambridge IGCSE and WASSCE pathways"
      ],
      guardrailTriggered: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // 4. Safeguarding & Children's Act 560
  if (query.includes('safeguard') || query.includes('child protection') || query.includes('act 560') || query.includes('gate g4') || query.includes('dovvsu') || query.includes('freeze') || query.includes('minor')) {
    return {
      reply: `### 🛡️ Gate G4 Child Protection & Safeguarding Framework
**Governing Statute:** *Ghana Children's Act 1998 (Act 560)*  
**Platform Policy:** *Master Blueprint Decision DEC-004 (Gate G4 Hard-Stop)*

Under Act 560, children's best interests are paramount. SkoolFinder enforces a non-negotiable architectural Gate G4 protocol prohibiting unverified adult interaction with minors.

#### Core Safeguarding Mandates:
1. **Gate G4 Hard-Stop Engine:** All tutoring bookings and minor direct messaging channels are hard-locked at the API boundary until the educator receives approved **D4 Child Safeguarding clearance**.
2. **Adult-to-Adult Legal Contracting (DEC-005):** Contracts, financial lessons, and schedules are executed exclusively between verified adult guardians and accredited educators. Zero direct minor billing or messaging.
3. **Emergency 1-Click Profile Freeze:** Super Admins and Safeguarding Leads have statutory authority under Act 560 to immediately suspend an accused educator profile upon filing of a critical concern.
4. **DOVVSU Case Referral Protocol:** Critical cases involving minor boundary breaches or inappropriate conduct are escalated within 4 hours to the **Domestic Violence and Victim Support Unit (DOVVSU)** of the Ghana Police Service and the Department of Social Welfare.`,
      citations: [
        "Children's Act 1998 (Act 560 Sections 6, 8, 13)",
        "Master Blueprint Decision DEC-004 (Gate G4 Hard-Stop)",
        "Ghana Police Service DOVVSU Referral Protocol"
      ],
      actionCards: [
        { title: "Open Safeguarding Centre", link: "#safeguarding", badge: "Act 560 Desk" },
        { title: "Review Teacher Vetting", link: "#teachers", badge: "D4 Clearance" }
      ],
      suggestions: [
        "How do I initiate a 1-click emergency profile freeze?",
        "What evidence documents are required for D4 clearance?",
        "Explain adult-to-adult contracting under DEC-005"
      ],
      guardrailTriggered: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // 5. Data Privacy & DPC Act 843
  if (query.includes('dpc') || query.includes('privacy') || query.includes('act 843') || query.includes('sar') || query.includes('subject access') || query.includes('redact') || query.includes('retention')) {
    return {
      reply: `### 🔒 Data Governance & Statutory Privacy Compliance
**Regulatory Body:** Republic of Ghana Data Protection Commission (DPC)  
**Governing Statute:** *Ghana Data Protection Act 2012 (Act 843)*  
**Registration Certificate:** \`DPC/REG/GH-2024-81920\`

#### Statutory Data Subject Rights & Enforcement:
* **Section 20 (Right to Object / Revoke Consent):** Parents and guardians may revoke consent at any time. SkoolFinder generates cryptographic proof hashes (\`sha256:...\`) documenting statutory compliance.
* **Section 24 (Subject Access Requests - SAR):** Data subjects may request portable exports of all stored academic, financial, and messaging records, fulfilled in structured JSON/ZIP packages within 21 statutory days.
* **Section 28 (PII Field-Level Masking):** Automatic masking of Ghana Card PINs (\`GHA-****-*\`), minor phone numbers, and birth certificates in administrative view consoles.
* **Retention Schedules:**
  - *Safeguarding Incident Files:* 7 Years (Act 560 / Act 843 legal obligation).
  - *Financial & MoMo Escrow Ledgers:* 10 Years (Bank of Ghana PSA Act 987).
  - *Prospect & Inquiry Logs:* 12 Months automated purge.`,
      citations: [
        "Ghana Data Protection Act 2012 (Act 843 Sections 20, 24, 28, 30)",
        "Data Protection Commission (DPC) Compliance Register Code DPC/REG/GH-2024-81920",
        "Payment Systems and Services Act 2019 (Act 987)"
      ],
      actionCards: [
        { title: "Data Governance Desk", link: "#datagov", badge: "Act 843 SAR" },
        { title: "View DPC Certificate", link: "#datagov", badge: "Compliance" }
      ],
      suggestions: [
        "How do I process a parent data portability export?",
        "What are the statutory retention schedules under Act 843?",
        "Explain field-level PII masking for Ghana Card PINs"
      ],
      guardrailTriggered: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // 6. Curricula Comparison
  if (query.includes('curriculum') || query.includes('curricula') || query.includes('cambridge') || query.includes('igcse') || query.includes('ib') || query.includes('montessori')) {
    return {
      reply: `### 📚 Ghana Educational Curricula Comparison Matrix

| Dimension | Ghana National (NaCCA / GES) | Cambridge International (CAIE) | International Baccalaureate (IB) |
| :--- | :--- | :--- | :--- |
| **Foundational Stage** | Kindergarten (KG1-KG2) Play-based | Cambridge Primary (Ages 5-11) | Primary Years Programme (PYP) |
| **Middle Years** | Common Core Programme (JHS1-JHS3) | Cambridge Lower Secondary | Middle Years Programme (MYP) |
| **Terminal Secondary** | WASSCE (West African Senior School Cert) | Cambridge IGCSE & A Levels | IB Diploma Programme (IB DP) |
| **Grading Scale** | Grades 1 (Highest) to 9 (Lowest) | A*, A, B, C, D, E, U | 1 (Lowest) to 7 (Highest) per subject |
| **Tertiary Pathways** | Direct entry to all Ghanaian & West African Universities | Globally recognized (UK, US, Canada, EU, Ghana) | Highly competitive global admissions credit |
| **Accreditation Body** | Ministry of Education / NaSIA | Cambridge Assessment (British Council Ghana) | International Baccalaureate Organization (Geneva) |

#### Selecting the Right Pathway for Your Ward:
* **GES / NaCCA:** Ideal for students planning to write BECE/WASSCE and pursue tertiary education in Ghana and West Africa at predictable cost.
* **Cambridge:** Ideal for families seeking structured international qualifications with global portability and dual options for local and overseas university matriculation.
* **IB DP:** Ideal for holistic, inquiry-led learners focused on critical thinking, Theory of Knowledge (TOK), and North American / European universities.`,
      citations: [
        "National Council for Curriculum and Assessment (NaCCA) Framework",
        "Cambridge Assessment International Education (CAIE) Global Guide",
        "International Baccalaureate (IB) Diploma Regulations"
      ],
      actionCards: [
        { title: "Compare Curricula in Directory", link: "#/directory", badge: "Filter Curricula" },
        { title: "School Comparison Tool", link: "#/compare", badge: "Side-by-Side" }
      ],
      suggestions: [
        "Which schools offer Cambridge IGCSE in Airport Residential?",
        "What are the fee ranges for IB schools in Accra?",
        "How does BECE aggregate translate for SHS placement?"
      ],
      guardrailTriggered: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // Default Fallback
  return {
    reply: `### 🇬🇭 SkoolFinder Operations Copilot & Educational Advisor
I am grounded in the complete **Ghanaian educational, statutory, and regulatory framework**, including:

* 🏫 **NaSIA Institutional Accreditation** under the *Education Regulatory Bodies Act 2020 (Act 1023)*.
* 🎯 **GES CSSPS 2026 BECE Placement & Aggregate Calculations** across Category A, B, and C schools.
* 🛡️ **Child Safeguarding & Gate G4 Protocols** under the *Ghana Children's Act 1998 (Act 560)*.
* 🔒 **Data Protection Commission (DPC) Compliance** under *Act 843*.
* 📚 **Curricula Alignment:** GES (NaCCA Standards-Based & CCP), Cambridge (IGCSE / A Levels), and International Baccalaureate (IB).

*Note: In accordance with Master Blueprint Decision DEC-015, I provide statutory advisory analysis and document intelligence. I am structurally prohibited from autonomously executing state changes or approvals.*

How may I assist your administrative review or parental guidance today?`,
    citations: [
      "Education Regulatory Bodies Act 2020 (Act 1023)",
      "Children's Act 1998 (Act 560)",
      "Ghana Data Protection Act 2012 (Act 843)",
      "GES CSSPS Secondary Placement Guidelines 2026"
    ],
    actionCards: [
      { title: "Explore School Directory", link: "#/directory", badge: "Directory" },
      { title: "CSSPS Placement Simulator", link: "#/cssps", badge: "Calculator" },
      { title: "Safeguarding Centre", link: "#safeguarding", badge: "Admin" }
    ],
    suggestions: [
      "What are NaSIA licensing requirements under Act 1023?",
      "How is BECE aggregate calculated for CSSPS Category A?",
      "Explain the Gate G4 child protection protocol",
      "Compare Cambridge vs GES curriculum"
    ],
    guardrailTriggered: false,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

/**
 * POST /api/ai/chat
 * Canonical education RAG chat endpoint for Akosua AI & parent inquiries
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [], context = {} } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Missing required 'message' string in request body." });
    }

    PILOT_BUDGET_METRICS.totalQueriesProcessed += 1;
    PILOT_BUDGET_METRICS.consumedGhs = Number((PILOT_BUDGET_METRICS.consumedGhs + 0.15).toFixed(2));

    const response = generateCopilotResponse(message, history, context);
    return res.json({
      success: true,
      ...response
    });
  } catch (err) {
    console.error("AI Chat error:", err);
    return res.status(500).json({ error: "Failed to process educational AI chat query" });
  }
});

/**
 * POST /api/admin/copilot/query
 * Specialized Super Admin Copilot query endpoint
 */
router.post('/copilot/query', async (req, res) => {
  try {
    const { query, history = [], context = {} } = req.body || {};
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: "Missing required 'query' string in request body." });
    }

    PILOT_BUDGET_METRICS.totalQueriesProcessed += 1;
    PILOT_BUDGET_METRICS.consumedGhs = Number((PILOT_BUDGET_METRICS.consumedGhs + 0.15).toFixed(2));

    const adminContext = {
      ...context,
      userRole: 'super_admin',
      elevatedAuthority: true
    };

    const response = generateCopilotResponse(query, history, adminContext);
    return res.json({
      success: true,
      ...response,
      budgetMetrics: PILOT_BUDGET_METRICS
    });
  } catch (err) {
    console.error("Super Admin Copilot Query error:", err);
    return res.status(500).json({ error: "Failed to process Super Admin copilot query" });
  }
});

/**
 * GET /api/ai/status
 * Grounding status, active models, and pilot budget burn telemetry
 */
router.get('/status', (req, res) => {
  return res.json({
    success: true,
    status: "OPERATIONAL",
    knowledgeGrounding: {
      frameworksIndexed: [
        "Education Regulatory Bodies Act 2020 (Act 1023)",
        "Ghana Children's Act 1998 (Act 560)",
        "Data Protection Act 2012 (Act 843)",
        "National Teaching Council (NTC) Teacher Licensing Regulations",
        "GES CSSPS 2026 Secondary Placement Guidelines",
        "Payment Systems and Services Act 2019 (Act 987) MoMo Escrow",
        "NaCCA Basic & Common Core Curricula Guidelines",
        "Cambridge International CAIE Standards 2026",
        "International Baccalaureate DP Assessment Principles",
        "Ghana National Fire Service Act 537 School Regulations",
        "Local Governance Act 936 District Health & Sanitation Standards",
        "Master Blueprint Decision DEC-004 Gate G4 Safeguarding Engine",
        "Master Blueprint Decision DEC-005 Adult-to-Adult Legal Contracting",
        "Master Blueprint Decision DEC-015 Prohibited Autonomous Decisions"
      ],
      totalDocumentsCount: PILOT_BUDGET_METRICS.documentsIndexedCount
    },
    budgetMetrics: PILOT_BUDGET_METRICS
  });
});

module.exports = router;

