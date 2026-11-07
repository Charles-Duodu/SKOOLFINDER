/**
 * SkoolFinder Ghana — Suppliers Portal Stage 6 Managed Tenders & Sealed Bids Test Suite
 * Baseline: Master Blueprint v2.0 (SUP-06-01 through SUP-06-08)
 */

const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const BASE_URL = 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'skoolfinder-jwt-secret-key-ghana-2026';

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runStage6Tests() {
  console.log('================================================================');
  console.log('🇬🇭 SUPPLIERS PORTAL — STAGE 6 MANAGED TENDERS & SEALED BIDS');
  console.log('Target: ' + BASE_URL);
  console.log('================================================================\n');

  let passes = 0;
  let fails = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName} ${details ? '— ' + details : ''}`);
      passes++;
    } else {
      console.error(`[FAIL] ${testName} ${details ? '— ' + details : ''}`);
      fails++;
    }
  }

  // Personas
  const schoolAdminUser = {
    id: `sch-admin-tnd-${Date.now()}`,
    school_id: 'sch-gis-accra',
    schoolName: 'Ghana International School',
    role: 'school_admin',
    email: 'procurement-chair@gis.edu.gh',
    full_name: 'Dr. Michael Addison'
  };
  const schoolAdminToken = jwt.sign(schoolAdminUser, JWT_SECRET, { expiresIn: '2h' });

  const supplierUser = {
    id: `sup-bidder-tnd-${Date.now()}`,
    role: 'supplier',
    email: 'stem-contracts@edurobotics.com.gh',
    companyName: 'EduRobotics Ghana Ltd',
    full_name: 'Eng. David Quaye'
  };
  const supplierToken = jwt.sign(supplierUser, JWT_SECRET, { expiresIn: '2h' });

  // 1. SUP-06-01: Public Discovery of High-Value Institutional Tenders (No Login Required)
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/tenders',
      method: 'GET'
    });

    const tenders = res.data?.tenders;
    const hasTenders = Array.isArray(tenders) && tenders.length >= 2;
    const sampleTender = tenders && tenders[0];

    assert(
      res.status === 200 && res.data?.success && hasTenders && sampleTender?.estimated_value_ghs >= 100000,
      'SUP-06-01: Public Discovery of High-Value Institutional Tenders (> GH₵ 100,000, No Login Required)',
      `Retrieved: ${tenders?.length} Tenders | Sample: ${sampleTender?.tender_number} (Budget: GH₵ ${sampleTender?.estimated_value_ghs})`
    );
  } catch (err) {
    assert(false, 'SUP-06-01: Tender Discovery', err.message);
  }

  // 2. SUP-06-01 & SUP-06-06: School Administrator Publishes Managed Multi-Year Framework Agreement
  let publishedTender = null;
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/tenders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${schoolAdminToken}`
      }
    }, {
      title: '2-Year Institutional School Transport Fleet Maintenance Framework Agreement',
      category_id: 'cat-transport',
      estimated_value_ghs: 480000.00,
      is_framework_agreement: true,
      framework_duration_months: 24,
      technical_weight_percent: 60,
      commercial_weight_percent: 40,
      submission_deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
      tender_security_required: true,
      tender_security_amount_ghs: 9600.00
    });

    publishedTender = res.data?.tender;
    assert(
      res.status === 201 && res.data?.success && publishedTender?.tender_number.startsWith('TND-2026-') && publishedTender.is_framework_agreement === true,
      'SUP-06-01 / SUP-06-06: School Administrator Publishes Multi-Year Framework Agreement with Evaluation Weights (60/40)',
      `Tender Ref: ${publishedTender?.tender_number}, Framework: ${publishedTender?.framework_duration_months} Months, Ceiling: GH₵ ${publishedTender?.estimated_value_ghs}`
    );
  } catch (err) {
    assert(false, 'SUP-06-01 / SUP-06-06: Tender Publication', err.message);
  }

  // 3. SUP-06-07: Mandatory Statutory Non-Collusion Attestation Enforcement
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/tenders/${publishedTender?.id}/bids`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, {
      bid_amount_ghs: 450000.00,
      non_collusion_attestation: false // REJECTED: Not accepted
    });

    assert(
      res.status === 400 && res.data?.error && res.data.error.includes('Non-Collusion'),
      'SUP-06-07: Statutory Non-Collusion Attestation Strictly Enforced (Unattested Bid Blocked)',
      `Status: ${res.status}, Rejection: ${res.data?.error}`
    );
  } catch (err) {
    assert(false, 'SUP-06-07: Non-Collusion Check', err.message);
  }

  // 4. SUP-06-02: Supplier Submits Cryptographically Sealed Bid to Vault
  let vaultedBid = null;
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/tenders/${publishedTender?.id}/bids`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, {
      bid_amount_ghs: 435000.00,
      delivery_schedule_days: 15,
      warranty_months: 24,
      non_collusion_attestation: true,
      conflict_of_interest_declaration: 'None declared'
    });

    vaultedBid = res.data?.bid;
    assert(
      res.status === 201 && res.data?.success && vaultedBid?.is_sealed === true && vaultedBid?.bid_number.startsWith('BID-2026-'),
      'SUP-06-02: Sealed Bid Vault Submission (Bid Encrypted & Sealed Upon Entry)',
      `Bid Ref: ${vaultedBid?.bid_number}, Vault Sealed: ${vaultedBid?.is_sealed}, Amount: GH₵ ${vaultedBid?.bid_amount_ghs}`
    );
  } catch (err) {
    assert(false, 'SUP-06-02: Sealed Bid Submission', err.message);
  }

  // 5. SUP-06-02: SEALED BID VAULT INVARIANT (Evaluators Blocked from Viewing Bids Prior to Deadline)
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/tenders/${publishedTender?.id}/bids`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${schoolAdminToken}`
      }
    });

    assert(
      res.status === 403 && res.data?.code === 'BID_VAULT_SEALED' && res.data?.is_vault_sealed === true,
      'SUP-06-02: Invariant Check — Bid Vault Inaccessible Prior to Submission Deadline (HTTP 403 BID_VAULT_SEALED)',
      `Status: ${res.status}, Code: ${res.data?.code}, Sealed Bids In Vault: ${res.data?.sealed_bids_count}`
    );
  } catch (err) {
    assert(false, 'SUP-06-02: Vault Invariant Check', err.message);
  }

  // 6. SUP-06-03: Anonymous Clarification Inquiry & Formal Public Addendum
  try {
    // Supplier submits clarification inquiry
    const clarifRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/tenders/${publishedTender?.id}/clarifications`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, {
      question_text: 'Will the school provide an on-site mechanical workshop bay for scheduled fleet maintenance?'
    });

    // School publishes public addendum to all bidders
    const addendumRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/tenders/${publishedTender?.id}/addenda`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${schoolAdminToken}`
      }
    }, {
      title: 'Addendum No. 01: On-Site Mechanical Bay Provision',
      clarification_summary: 'Inquiry regarding workshop facilities for fleet servicing',
      response_details: 'The school confirms a dedicated two-bay vehicle workshop with compressed air and inspection ramp will be made accessible to the contractor.'
    });

    const addendum = addendumRes.data?.addendum;

    assert(
      clarifRes.status === 201 && clarifRes.data?.clarification?.is_anonymous === true &&
      addendumRes.status === 201 && addendum?.addendum_number.includes('ADD-'),
      'SUP-06-03: Anonymous Clarification Query & Formal Public Addendum Published to All Bidders',
      `Addendum Ref: ${addendum?.addendum_number}, Title: "${addendum?.title}"`
    );
  } catch (err) {
    assert(false, 'SUP-06-03: Clarifications & Addenda', err.message);
  }

  // 7. SUP-06-04: Post-Deadline Bid Unsealing & Multi-Stakeholder Committee Evaluation
  try {
    // Unseal tender bids post-deadline (simulated authorized unsealing)
    const unsealRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/tenders/${publishedTender?.id}/unseal`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${schoolAdminToken}`
      }
    }, {
      force: true
    });

    // Committee member scores bid (Technical 85.0, Commercial 90.0) -> Weighted Total: (85*0.6) + (90*0.4) = 87.0
    const evalRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/tenders/${publishedTender?.id}/evaluate`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${schoolAdminToken}`
      }
    }, {
      bid_id: vaultedBid?.id,
      technical_score: 85.0,
      commercial_score: 90.0,
      compliance_notes: 'Fully compliant with DVLA roadworthiness standards and OEM spare parts availability',
      recommendation: 'award'
    });

    const evaluation = evalRes.data?.evaluation;

    assert(
      unsealRes.status === 200 && evalRes.status === 201 && evaluation?.weighted_total_score === 87.0,
      'SUP-06-04: Committee Evaluation Scoring (Technical 85.0, Commercial 90.0 -> Weighted Total 87.0 / 100)',
      `Tech: ${evaluation?.technical_score} (60%), Comm: ${evaluation?.commercial_score} (40%), Total: ${evaluation?.weighted_total_score}, Rec: ${evaluation?.recommendation}`
    );
  } catch (err) {
    assert(false, 'SUP-06-04: Committee Scoring', err.message);
  }

  // 8. DEC-015, SUP-06-05 & SUP-06-06: Human-Approved Contract Award & Multi-Year Framework Agreement Generation
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/tenders/${publishedTender?.id}/award`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${schoolAdminToken}`
      }
    }, {
      winning_bid_id: vaultedBid?.id,
      human_confirmation_signed: true, // DEC-015 Human Signature
      approved_by_title: 'Headmaster & Procurement Committee Chairman',
      award_rationale: 'Highest weighted composite score (87.0) with certified OEM fleet maintenance capacity'
    });

    const awardNotice = res.data?.award_notice;
    const fwcContract = res.data?.framework_contract;

    assert(
      res.status === 200 && res.data?.success && awardNotice?.award_notice_number.startsWith('NOA-2026-') && fwcContract?.contract_number.startsWith('FWC-2026-'),
      'DEC-015 / SUP-06-05 / SUP-06-06: Human-Approved Award Confirmation, Notice of Award Issued & Multi-Year Framework Contract Generated',
      `Notice of Award: ${awardNotice?.award_notice_number}, Framework Contract: ${fwcContract?.contract_number} (Term: ${fwcContract?.term_months} Months, Ceiling: GH₵ ${fwcContract?.ceiling_value_ghs})`
    );
  } catch (err) {
    assert(false, 'DEC-015 / SUP-06-05 / SUP-06-06: Award Confirmation', err.message);
  }

  console.log('\n================================================================');
  console.log(`STAGE 6 RESULTS: ${passes} Passed, ${fails} Failed (Total: ${passes + fails})`);
  console.log('================================================================\n');

  if (fails > 0) process.exit(1);
}

runStage6Tests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
