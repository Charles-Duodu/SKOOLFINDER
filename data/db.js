const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database with rich authentic Ghana data if not exists
function getInitialData() {
  return {
    schools: [
      {
        id: "sch-gis-accra",
        name: "Ghana International School (GIS)",
        motto: "Understanding of Each Other",
        slug: "ghana-international-school",
        region: "Greater Accra",
        district: "Accra Metropolitan",
        suburb: "Cantonments",
        address: "Second Circular Road, Cantonments, Accra",
        mapLocation: "https://maps.google.com/?q=Ghana+International+School+Cantonments",
        lat: 5.5786,
        lng: -0.1788,
        tuitionBase: 12500,
        busFee: 2200,
        lunchFee: 1800,
        boardingFee: 0,
        levels: ["Nursery", "Kindergarten", "Primary", "JHS", "SHS"],
        curriculum: ["Cambridge (CIE)", "IGCSE", "A-Levels"],
        boardingType: "Day Only",
        gender: "Co-educational",
        feeBand: "International / Elite (GH₵ 10,000+)",
        established: 1953,
        studentTeacherRatio: "12:1",
        verified: true,
        claimed: true,
        packageTier: "Premium",
        admissionsStatus: "Admissions Open 2026/2027",
        phone: "+233 30 277 7163",
        whatsapp: "+233 24 431 8900",
        email: "admissions@gis.edu.gh",
        website: "https://gis.edu.gh",
        coverImage: "/assets/images/campus_hero.jpg",
        bannerType: "cambridge",
        facilities: [
          "Science & Robotics Labs",
          "Olympic Swimming Pool",
          "AC Classrooms",
          "ICT & Coding Suites",
          "Music & Art Conservatory",
          "School Bus Shuttle",
          "Full-time Sick Bay",
          "CCTV Security"
        ],
        description: "Ghana International School provides an internationally recognized education for students aged 3 to 18. Consistently ranked among the top Cambridge examination centers in West Africa, GIS fosters critical thinking, cultural empathy, and academic excellence in prime Cantonments.",
        headOfSchool: "Dr. Mary Ashun",
        featured: true
      },
      {
        id: "sch-sos-tema",
        name: "SOS-Hermann Gmeiner International College",
        motto: "Knowledge in the Service of Africa",
        slug: "sos-hermann-gmeiner-college",
        region: "Greater Accra",
        district: "Tema Metropolitan",
        suburb: "Tema",
        address: "Community 6, Off Hospital Road, Tema",
        mapLocation: "https://maps.google.com/?q=SOS+Hermann+Gmeiner+College+Tema",
        lat: 5.6568,
        lng: -0.0102,
        tuitionBase: 7800,
        busFee: 1800,
        lunchFee: 1500,
        boardingFee: 4500,
        levels: ["JHS", "SHS"],
        curriculum: ["International Baccalaureate (IB)", "IGCSE"],
        boardingType: "Day & Boarding",
        gender: "Co-educational",
        feeBand: "Premium (GH₵ 4,000 - 10,000)",
        established: 1990,
        studentTeacherRatio: "10:1",
        verified: true,
        claimed: true,
        packageTier: "Premium",
        admissionsStatus: "Admissions Open 2026/2027",
        phone: "+233 30 320 2907",
        whatsapp: "+233 50 128 4401",
        email: "admissions@soshgic.edu.gh",
        website: "https://soshgic.edu.gh",
        coverImage: "/assets/images/science_lab.jpg",
        bannerType: "ib",
        facilities: [
          "Full Boarding Hostels",
          "IB Science Laboratories",
          "Athletic Track & Sports Complex",
          "Air Conditioned Library",
          "Special Needs (SEN) Counseling",
          "School Bus Network",
          "Organic Farm & Green Campus"
        ],
        description: "A prestigious pan-African secondary boarding institution dedicated to developing leaders of tomorrow through rigorous IB Diploma standards, pan-African cultural enrichment, and community service programs.",
        headOfSchool: "Mr. Elvis Thompson",
        featured: true
      },
      {
        id: "sch-roman-ridge-accra",
        name: "The Roman Ridge School",
        motto: "Carpe Diem (Seize the Day)",
        slug: "the-roman-ridge-school",
        region: "Greater Accra",
        district: "Ayawaso West",
        suburb: "Airport Residential",
        address: "No. 12 Roman Ridge Extension, Airport Residential Area, Accra",
        mapLocation: "https://maps.google.com/?q=Roman+Ridge+School+Accra",
        lat: 5.5991,
        lng: -0.1884,
        tuitionBase: 6500,
        busFee: 1600,
        lunchFee: 1400,
        boardingFee: 0,
        levels: ["Crèche", "Nursery", "Kindergarten", "Primary", "JHS", "SHS"],
        curriculum: ["Cambridge (CIE)", "British Curriculum"],
        boardingType: "Day Only",
        gender: "Co-educational",
        feeBand: "Premium (GH₵ 4,000 - 10,000)",
        established: 2002,
        studentTeacherRatio: "14:1",
        verified: true,
        claimed: false,
        packageTier: "Standard",
        admissionsStatus: "Admissions Open 2026/2027",
        phone: "+233 30 277 9345",
        whatsapp: "+233 26 554 2210",
        email: "info@romanridgeschool.com",
        website: "https://romanridgeschool.com",
        coverImage: "/assets/images/montessori_class.jpg",
        bannerType: "cambridge",
        facilities: [
          "Modern ICT Center",
          "Multipurpose Basketball & Tennis Court",
          "Science Demonstration Theatres",
          "School Bus Shuttle (Accra wide)",
          "Cafeteria & Hot Meals",
          "CCTV 24/7 Monitoring"
        ],
        description: "The Roman Ridge School offers the highest standard of British and international education in Accra. Located conveniently near Airport Residential and Dzorwulu, it features serene, secure learning environments with individualized teacher attention.",
        headOfSchool: "Mrs. Valerie Mainoo",
        featured: true
      },
      {
        id: "sch-morning-star-cantonments",
        name: "Morning Star School",
        motto: "Let Your Light Shine",
        slug: "morning-star-school",
        region: "Greater Accra",
        district: "Accra Metropolitan",
        suburb: "Cantonments",
        address: "Near Police Hospital, Cantonments, Accra",
        mapLocation: "https://maps.google.com/?q=Morning+Star+School+Cantonments",
        lat: 5.5702,
        lng: -0.1742,
        tuitionBase: 3200,
        busFee: 1200,
        lunchFee: 1100,
        boardingFee: 0,
        levels: ["Kindergarten", "Primary", "JHS"],
        curriculum: ["GES Standards-based"],
        boardingType: "Day Only",
        gender: "Co-educational",
        feeBand: "Moderate (GH₵ 1,500 - 4,000)",
        established: 1965,
        studentTeacherRatio: "18:1",
        verified: true,
        claimed: true,
        packageTier: "Standard",
        admissionsStatus: "Admissions Open 2026/2027",
        phone: "+233 30 277 6492",
        whatsapp: "+233 24 887 1992",
        email: "admissions@morningstarschool.edu.gh",
        website: "https://morningstarschool.edu.gh",
        coverImage: "/assets/images/campus_hero.jpg",
        bannerType: "ges",
        facilities: [
          "State-of-the-art Computer Lab",
          "Science Laboratory",
          "Auditorium & Drama Hall",
          "School Bus Transit",
          "School Canteen",
          "Sick Bay & Certified Nurse"
        ],
        description: "One of the most decorated and celebrated GES basic schools in Ghana. Morning Star has graduated generations of leaders with an exemplary track record of 100% BECE pass rate with distinction.",
        headOfSchool: "Mrs. Nana Yaa Kwakye",
        featured: false
      },
      {
        id: "sch-east-legon-montessori",
        name: "East Legon Montessori Academy",
        motto: "Nurturing Little Minds",
        slug: "east-legon-montessori-academy",
        region: "Greater Accra",
        district: "Ayawaso West",
        suburb: "East Legon",
        address: "Lagos Avenue, East Legon, Accra",
        mapLocation: "https://maps.google.com/?q=East+Legon+Accra",
        lat: 5.6412,
        lng: -0.1583,
        tuitionBase: 2900,
        busFee: 1100,
        lunchFee: 1200,
        boardingFee: 0,
        levels: ["Crèche", "Nursery", "Kindergarten", "Primary"],
        curriculum: ["Montessori", "GES Standards-based"],
        boardingType: "Day Only",
        gender: "Co-educational",
        feeBand: "Moderate (GH₵ 1,500 - 4,000)",
        established: 2012,
        studentTeacherRatio: "8:1",
        verified: true,
        claimed: false,
        packageTier: "Standard",
        admissionsStatus: "Admissions Open 2026/2027",
        phone: "+233 30 254 3901",
        whatsapp: "+233 54 991 2284",
        email: "contact@eastlegonmontessori.com",
        website: "https://eastlegonmontessori.com",
        coverImage: "/assets/images/montessori_class.jpg",
        bannerType: "montessori",
        facilities: [
          "Montessori Sensory Playrooms",
          "Safe Outdoor Playground",
          "Splash Pool",
          "Nutritious Meal Plan",
          "School Shuttle",
          "Biometric Sign-In"
        ],
        description: "Providing authentic child-centric Montessori and early childhood foundation education in the heart of East Legon. Ideal for working parents needing holistic care from infancy through primary.",
        headOfSchool: "Auntie Akua Mensah",
        featured: false
      },
      {
        id: "sch-ridge-school-kumasi",
        name: "The Ridge School, Kumasi",
        motto: "Excellence in Truth",
        slug: "the-ridge-school-kumasi",
        region: "Ashanti",
        district: "Kumasi Metropolitan",
        suburb: "Ridge",
        address: "Ridge Residential Area, Near Golden Tulip, Kumasi",
        mapLocation: "https://maps.google.com/?q=The+Ridge+School+Kumasi",
        lat: 6.6872,
        lng: -1.6315,
        tuitionBase: 3100,
        busFee: 950,
        lunchFee: 900,
        boardingFee: 0,
        levels: ["Kindergarten", "Primary", "JHS"],
        curriculum: ["GES Standards-based", "Cambridge (CIE)"],
        boardingType: "Day Only",
        gender: "Co-educational",
        feeBand: "Moderate (GH₵ 1,500 - 4,000)",
        established: 1960,
        studentTeacherRatio: "16:1",
        verified: true,
        claimed: true,
        packageTier: "Premium",
        admissionsStatus: "Admissions Open 2026/2027",
        phone: "+233 32 202 2490",
        whatsapp: "+233 24 330 9011",
        email: "info@ridgeschoolkumasi.edu.gh",
        website: "https://ridgeschoolkumasi.edu.gh",
        coverImage: "/assets/images/science_lab.jpg",
        bannerType: "ges",
        facilities: [
          "Science Laboratory",
          "Modern ICT Center",
          "Basketball & Football Grounds",
          "School Bus Network (Kumasi wide)",
          "Sick Bay",
          "Music & Brass Band"
        ],
        description: "The premier private basic school in Kumasi, respected for decades for unmatched academic rigor, disciplined upbringing, and top BECE placements across Ashanti Region.",
        headOfSchool: "Mr. Kwaku Osei-Bonsu",
        featured: true
      },
      {
        id: "sch-nhyiaeso-academy-kumasi",
        name: "Heritage Academy Kumasi",
        motto: "Character, Wisdom, Service",
        slug: "heritage-academy-kumasi",
        region: "Ashanti",
        district: "Kumasi Metropolitan",
        suburb: "Nhyiaeso",
        address: "Ahodwo Roundabout / Nhyiaeso Enclave, Kumasi",
        mapLocation: "https://maps.google.com/?q=Nhyiaeso+Kumasi",
        lat: 6.6710,
        lng: -1.6280,
        tuitionBase: 2600,
        busFee: 900,
        lunchFee: 850,
        boardingFee: 2800,
        levels: ["Crèche", "Nursery", "Kindergarten", "Primary", "JHS"],
        curriculum: ["Cambridge (CIE)", "GES Standards-based"],
        boardingType: "Day & Boarding",
        gender: "Co-educational",
        feeBand: "Moderate (GH₵ 1,500 - 4,000)",
        established: 2008,
        studentTeacherRatio: "15:1",
        verified: true,
        claimed: false,
        packageTier: "Basic",
        admissionsStatus: "Admissions Open 2026/2027",
        phone: "+233 32 203 1184",
        whatsapp: "+233 55 401 7733",
        email: "admissions@heritageacademygh.com",
        website: "https://heritageacademygh.com",
        coverImage: "/assets/images/campus_hero.jpg",
        bannerType: "cambridge",
        facilities: [
          "Boarding Facilities for JHS",
          "ICT Lab",
          "Science Demonstration Room",
          "School Bus",
          "Hot Meals Provided",
          "24/7 Security"
        ],
        description: "Located in the tranquil residential district of Nhyiaeso/Ahodwo, Heritage Academy combines modern British international curriculum benchmarks with Ghanaian cultural values.",
        headOfSchool: "Dr. Angela Boateng",
        featured: false
      },
      {
        id: "sch-galaxy-international-accra",
        name: "Galaxy International School",
        motto: "Excellence in Diversity",
        slug: "galaxy-international-school",
        region: "Greater Accra",
        district: "Adentan Municipal",
        suburb: "Adenta",
        address: "Ashiyie / Adenta Enclave, Accra",
        mapLocation: "https://maps.google.com/?q=Galaxy+International+School+Accra",
        lat: 5.7021,
        lng: -0.1542,
        tuitionBase: 11000,
        busFee: 2000,
        lunchFee: 1600,
        boardingFee: 5500,
        levels: ["Primary", "JHS", "SHS"],
        curriculum: ["Cambridge (CIE)", "IGCSE", "A-Levels"],
        boardingType: "Day & Boarding",
        gender: "Co-educational",
        feeBand: "International / Elite (GH₵ 10,000+)",
        established: 2001,
        studentTeacherRatio: "10:1",
        verified: true,
        claimed: true,
        packageTier: "Premium",
        admissionsStatus: "Admissions Open 2026/2027",
        phone: "+233 30 293 8450",
        whatsapp: "+233 50 156 7889",
        email: "info@galaxyschool.net",
        website: "https://galaxyschool.net",
        coverImage: "/assets/images/science_lab.jpg",
        bannerType: "cambridge",
        facilities: [
          "Robotics & Coding Arena",
          "Olympiad Preparation Center",
          "Ultra-modern Boarding Hostels",
          "Astro-turf Football Pitch",
          "Swimming Pool",
          "School Bus Transport (Accra-wide)"
        ],
        description: "Renowned across Africa for dominating international science, mathematics, and robotics olympiads. Galaxy offers world-class boarding and day options with state-of-the-art facilities in Adenta.",
        headOfSchool: "Mr. Mehmet Cakir",
        featured: true
      },
      {
        id: "sch-spintex-prep-accra",
        name: "Spintex Royal Preparatory School",
        motto: "Building Firm Foundations",
        slug: "spintex-royal-preparatory",
        region: "Greater Accra",
        district: "Ledzokuku Municipal",
        suburb: "Spintex",
        address: "Coastal Junction, Spintex Road, Accra",
        mapLocation: "https://maps.google.com/?q=Spintex+Road+Accra",
        lat: 5.6291,
        lng: -0.1084,
        tuitionBase: 1350,
        busFee: 750,
        lunchFee: 650,
        boardingFee: 0,
        levels: ["Crèche", "Nursery", "Kindergarten", "Primary", "JHS"],
        curriculum: ["GES Standards-based"],
        boardingType: "Day Only",
        gender: "Co-educational",
        feeBand: "Budget (Under GH₵ 1,500)",
        established: 2015,
        studentTeacherRatio: "20:1",
        verified: true,
        claimed: false,
        packageTier: "Basic",
        admissionsStatus: "Admissions Open 2026/2027",
        phone: "+233 24 102 3345",
        whatsapp: "+233 20 811 4455",
        email: "spintexroyal@gmail.com",
        website: "",
        coverImage: "/assets/images/montessori_class.jpg",
        bannerType: "ges",
        facilities: [
          "Computer Training Lab",
          "School Bus along Spintex Corridor",
          "Playground",
          "Canteen Service",
          "Security Guards"
        ],
        description: "A community-focused, affordable preparatory school on Spintex Road providing disciplined basic education and strong BECE foundation for families in Tema and East Accra.",
        headOfSchool: "Rev. Emmanuel Darko",
        featured: false
      },
      {
        id: "sch-knust-basic-kumasi",
        name: "KNUST Basic School",
        motto: "Nyansapo (Wisdom Knot)",
        slug: "knust-basic-school",
        region: "Ashanti",
        district: "Oforikrom Municipal",
        suburb: "KNUST Enclave",
        address: "KNUST Campus, Kumasi",
        mapLocation: "https://maps.google.com/?q=KNUST+Basic+School+Kumasi",
        lat: 6.6745,
        lng: -1.5714,
        tuitionBase: 2400,
        busFee: 850,
        lunchFee: 800,
        boardingFee: 0,
        levels: ["Primary", "JHS"],
        curriculum: ["GES Standards-based"],
        boardingType: "Day Only",
        gender: "Co-educational",
        feeBand: "Moderate (GH₵ 1,500 - 4,000)",
        established: 1958,
        studentTeacherRatio: "22:1",
        verified: true,
        claimed: false,
        packageTier: "Basic",
        admissionsStatus: "Admissions Open 2026/2027",
        phone: "+233 32 206 0021",
        whatsapp: "+233 24 456 7890",
        email: "knustbasic@knust.edu.gh",
        website: "https://basic.knust.edu.gh",
        coverImage: "/assets/images/campus_hero.jpg",
        bannerType: "ges",
        facilities: [
          "Access to University Sports Complex",
          "Science Demonstration Center",
          "Extensive Library",
          "ICT Lab",
          "Spacious Campus Grounds"
        ],
        description: "Nestled within the lush KNUST university campus, this iconic basic school has produced some of Ghana's finest scholars, doctors, and engineers with an elite BECE track record.",
        headOfSchool: "Mrs. Irene Prempeh",
        featured: false
      }
    ],
    suppliers: [
      {
        id: "sup-starline-stationery",
        companyName: "Starline Educational Publishing & Stationery Ltd",
        category: "Books & Stationery",
        region: "Greater Accra",
        coverage: ["Greater Accra", "Ashanti", "Eastern"],
        address: "Graphic Road, South Industrial Area, Accra",
        phone: "+233 30 222 8901",
        whatsapp: "+233 24 333 4455",
        email: "sales@starlinestationery.gh",
        verified: true,
        ratingBadge: "Verified Major Supplier",
        description: "Official wholesale distributor of NaCCA/GES approved textbooks, Cambridge revision workbooks, customized school exercise books, and fine art materials.",
        catalogHighlights: [
          "Customized crest exercise books (from 500 pcs)",
          "Complete NaCCA Primary & JHS syllabus textbooks",
          "Classroom stationery packs",
          "Laboratory reagent kits"
        ]
      },
      {
        id: "sup-modern-desks",
        companyName: "Modern Class Furniture & Woodworks Ghana",
        category: "Furniture & Hardware",
        region: "Greater Accra",
        coverage: ["Greater Accra", "Ashanti", "Central"],
        address: "Spintex Light Industrial Enclave, Accra",
        phone: "+233 20 871 2234",
        whatsapp: "+233 54 881 9900",
        email: "orders@modernclassfurniture.com",
        verified: true,
        ratingBadge: "Verified Manufacturer",
        description: "Direct manufacturer of heavy-duty dual and mono student desks, kindergarten plastic tables, teacher podiums, and cafeteria dining benches.",
        catalogHighlights: [
          "Ergonomic mono student desks with book racks",
          "Colorful durable preschool tables & chairs",
          "Steel frame bunk beds for boarding houses",
          "Library shelving units"
        ]
      },
      {
        id: "sup-accra-catering",
        companyName: "Accra Fresh Canteen & Bulk Food Supplies",
        category: "Food & Catering",
        region: "Greater Accra",
        coverage: ["Greater Accra"],
        address: "Near Makola Extension, Agbogbloshie Road, Accra",
        phone: "+233 24 992 0011",
        whatsapp: "+233 26 550 1234",
        email: "supplies@accrafreshfood.com",
        verified: true,
        ratingBadge: "FDA Certified Supplier",
        description: "Reliable bulk delivery of premium rice, vegetable oil, beans, tubers, flour, and fresh produce to private school canteens and boarding houses across Accra.",
        catalogHighlights: [
          "50kg Royal Aroma Fragrant Rice bags",
          "25L Cooking Oil Jerrycans",
          "Hygienic fresh egg crates weekly delivery",
          "Full-service school cafeteria management"
        ]
      },
      {
        id: "sup-edutech-wa",
        companyName: "EduTech West Africa Innovations",
        category: "IT / Software / Computers",
        region: "Greater Accra",
        coverage: ["Greater Accra", "Ashanti", "Nationwide"],
        address: "Dzorwulu Highway, Opposite Allied Heights, Accra",
        phone: "+233 30 278 9912",
        whatsapp: "+233 50 442 8899",
        email: "hello@edutechwa.com",
        verified: true,
        ratingBadge: "Authorized Tech Partner",
        description: "Turnkey ICT lab setup for schools. Interactive smart boards, refurbished Dell/HP student laptops, biometric student attendance, and SMS notification portals.",
        catalogHighlights: [
          "75-inch 4K Interactive Touch Smartboards",
          "Student ICT Lab Package (25 PCs + Networking)",
          "Bulk SMS & Parent Communication Portal",
          "School Management Software (Report Card Generation)"
        ]
      },
      {
        id: "sup-ashanti-textiles",
        companyName: "Ashanti Royal School Uniforms & Embroidery",
        category: "Uniforms & Textiles",
        region: "Ashanti",
        coverage: ["Ashanti", "Greater Accra"],
        address: "Adum Business District, Kumasi",
        phone: "+233 32 204 8831",
        whatsapp: "+233 24 661 7722",
        email: "uniforms@ashantiroyaltextiles.com",
        verified: true,
        ratingBadge: "Verified Manufacturer",
        description: "High quality uniform manufacturing, school fabric sourcing, precision badge embroidery, sportswear, and Friday wear batakari for private schools.",
        catalogHighlights: [
          "Durable poly-cotton school shirts & pinafores",
          "Sports wear tracksuits & polo jerseys",
          "Computerized crest embroidery patches",
          "Graduation gowns & caps for preschools"
        ]
      },
      {
        id: "sup-safeguard-security",
        companyName: "ShieldGuard School Safety & Sanitation Systems",
        category: "Cleaning & Security",
        region: "Greater Accra",
        coverage: ["Greater Accra", "Ashanti"],
        address: "Near Danquah Circle, Osu, Accra",
        phone: "+233 30 276 4410",
        whatsapp: "+233 20 441 5566",
        email: "info@shieldguardgh.com",
        verified: true,
        ratingBadge: "Licensed Security Provider",
        description: "Specialized private security guards trained in child safety, playground rubber flooring, CCTV monitoring, and bulk industrial disinfectant supplies.",
        catalogHighlights: [
          "Vetted, child-friendly security personnel",
          "Hikvision High-Definition CCTV installations",
          "Playground shock-absorbing rubber tiles",
          "Termly industrial fumigation & disinfection"
        ]
      }
    ],
    rfqs: [
      {
        id: "rfq-101",
        schoolName: "Spintex Royal Preparatory School",
        schoolId: "sch-spintex-prep-accra",
        region: "Greater Accra",
        title: "Procurement of 150 Dual Student Desks & 10 Teacher Tables",
        category: "Furniture & Hardware",
        quantity: "150 desks + 10 tables",
        budgetRange: "GH₵ 25,000 - 35,000",
        deadline: "2026-11-15",
        status: "Open for Bids",
        description: "We are expanding our Class 4 and Class 5 blocks ahead of next term. Looking for durable wooden/steel dual desks delivered to our Spintex campus. Samples must be inspected before bulk production.",
        quotesReceived: 3
      },
      {
        id: "rfq-102",
        schoolName: "Heritage Academy Kumasi",
        schoolId: "sch-nhyiaeso-academy-kumasi",
        region: "Ashanti",
        title: "Bulk Supply of Term 2 Food Staples (Rice, Oil, Beans) for Boarding House",
        category: "Food & Catering",
        quantity: "80 Bags of 50kg Rice, 20 Jerrycans Oil",
        budgetRange: "GH₵ 40,000 - 55,000",
        deadline: "2026-11-05",
        status: "Open for Bids",
        description: "We require weekly delivery of certified high grade perfumed rice and vegetable oil for our 200 boarding students in Nhyiaeso, Kumasi.",
        quotesReceived: 2
      },
      {
        id: "rfq-103",
        schoolName: "The Roman Ridge School",
        schoolId: "sch-roman-ridge-accra",
        region: "Greater Accra",
        title: "Setup of 20 Modern All-in-One PCs for Primary ICT Lab",
        category: "IT / Software / Computers",
        quantity: "20 Desktop Computers + Networking",
        budgetRange: "GH₵ 60,000 - 80,000",
        deadline: "2026-11-25",
        status: "Open for Bids",
        description: "Looking for an authorized IT vendor to supply and install 20 Intel Core i5 All-in-One desktops with genuine Windows 11, antivirus, and local network configuration in Airport Residential.",
        quotesReceived: 4
      }
    ],
    quotes: [
      {
        id: "quote-1",
        rfqId: "rfq-101",
        supplierId: "sup-modern-desks",
        supplierName: "Modern Class Furniture & Woodworks Ghana",
        price: "GH₵ 28,500",
        deliveryDays: 14,
        notes: "Heavy gauge electro-plated steel frame with seasoned Odum hardwood top. Sample can be delivered to Spintex within 48 hours for your board's inspection.",
        status: "Pending Review",
        createdAt: "2026-10-22"
      }
    ],
    jobs: [
      {
        id: "job-cambridge-physics",
        schoolName: "Ghana International School (GIS)",
        schoolId: "sch-gis-accra",
        title: "Cambridge IGCSE & A-Level Physics & Chemistry Teacher",
        region: "Greater Accra",
        suburb: "Cantonments",
        level: "SHS",
        curriculum: "Cambridge (CIE)",
        employmentType: "Full Time",
        salaryRange: "GH₵ 4,500 - 7,500 / month",
        deadline: "2026-11-20",
        requirements: "Bachelor's degree or higher in Physics/Chemistry or Education. Minimum 3 years teaching Cambridge syllabus with proven examination results. Strong practical laboratory handling.",
        description: "We are seeking an energetic, passionate educator to join our science faculty in Cantonments. You will teach IGCSE and A-Level cohorts and guide students in university admissions science projects.",
        applicantsCount: 6,
        status: "Actively Hiring"
      },
      {
        id: "job-montessori-kindergarten",
        schoolName: "East Legon Montessori Academy",
        schoolId: "sch-east-legon-montessori",
        title: "Certified Early Childhood / Montessori Lead Teacher",
        region: "Greater Accra",
        suburb: "East Legon",
        level: "Kindergarten",
        curriculum: "Montessori",
        employmentType: "Full Time",
        salaryRange: "GH₵ 2,500 - 3,800 / month",
        deadline: "2026-11-10",
        requirements: "Certified Montessori diploma (AMI/MCI) or degree in Early Childhood Education. Proven patience, phonics mastery (Jolly Phonics), and positive classroom management.",
        description: "Join our vibrant team in East Legon. Lead a class of 15 curious 4-5 year olds, fostering independence, reading fluency, and sensory learning.",
        applicantsCount: 9,
        status: "Actively Hiring"
      },
      {
        id: "job-ges-jhs-maths",
        schoolName: "The Ridge School, Kumasi",
        schoolId: "sch-ridge-school-kumasi",
        title: "JHS Mathematics & Integrated Science Teacher (BECE Specialist)",
        region: "Ashanti",
        suburb: "Ridge",
        level: "JHS",
        curriculum: "GES Standards-based",
        employmentType: "Full Time",
        salaryRange: "GH₵ 2,800 - 4,200 / month",
        deadline: "2026-11-18",
        requirements: "B.Ed in Mathematics or Basic Education from a recognized university. Minimum 4 years preparing students for BECE with proven track record of Grade 1 placements.",
        description: "The Ridge School seeks a disciplined and experienced educator to lead our JHS 2 and JHS 3 mathematics cohorts in Kumasi.",
        applicantsCount: 12,
        status: "Actively Hiring"
      },
      {
        id: "job-robotics-ict-adenta",
        schoolName: "Galaxy International School",
        schoolId: "sch-galaxy-international-accra",
        title: "Robotics, Coding & STEM Instructor",
        region: "Greater Accra",
        suburb: "Adenta",
        level: "Primary & JHS",
        curriculum: "Cambridge (CIE)",
        employmentType: "Full Time",
        salaryRange: "GH₵ 3,500 - 5,500 / month",
        deadline: "2026-11-30",
        requirements: "BSc in Computer Science, Computer Engineering, or related field. Hands-on experience with LEGO Mindstorms, Arduino, Scratch, and Python.",
        description: "Mentor tomorrow's tech leaders! Coach our international olympiad robotics teams and run weekly STEM modules in our high-tech laboratory.",
        applicantsCount: 4,
        status: "Actively Hiring"
      }
    ],
    teachers: [
      {
        id: "tch-1",
        fullName: "Samuel K. Appiah, M.Sc.",
        headline: "Cambridge IGCSE & A-Level Pure Mathematics Specialist",
        subjects: ["Mathematics", "Further Maths", "Physics"],
        curricula: ["Cambridge (CIE)", "GES Standards-based"],
        levels: ["JHS", "SHS"],
        region: "Greater Accra",
        suburb: "East Legon",
        experienceYears: 8,
        qualification: "M.Sc. Applied Mathematics, B.Ed. Science Education",
        rate: "GH₵ 120 / hour (Home Tutoring) or Full-time Contract",
        teachingModes: ["Home Tutoring", "Online Lessons", "Full-time School Contract"],
        verified: true,
        licenseNumber: "NTC-ED-449102",
        ratingBadge: "NTC Certified Master Educator",
        subscriptionTier: "Featured Pro",
        phone: "+233 24 551 0987",
        whatsapp: "+233 24 551 0987",
        email: "samuel.appiah@educators.gh",
        bio: "Over 8 years preparing students for Cambridge IGCSE, AS/A-Levels, and WASSCE with a 98% Grade A/A* pass rate. Specializes in transforming struggling students into confident mathematical thinkers.",
        gender: "Male"
      },
      {
        id: "tch-2",
        fullName: "Auntie Akua Serwaa Boateng",
        headline: "Early Childhood Phonics, Reading & Montessori Foundation Specialist",
        subjects: ["Early Literacy & Phonics", "Montessori Math", "Handwriting"],
        curricula: ["Montessori", "British Early Years", "GES"],
        levels: ["Crèche", "Kindergarten", "Primary"],
        region: "Greater Accra",
        suburb: "Cantonments",
        experienceYears: 6,
        qualification: "AMI Certified Montessori Diploma, B.A. Early Childhood Education",
        rate: "GH₵ 100 / hour or School Retainer",
        teachingModes: ["Home Tutoring", "Early Years Consultant", "Part-Time"],
        verified: true,
        licenseNumber: "NTC-EY-881023",
        ratingBadge: "AMI Montessori Certified",
        subscriptionTier: "Featured Pro",
        phone: "+233 50 332 1199",
        whatsapp: "+233 50 332 1199",
        email: "akua.serwaa@montessoriedu.gh",
        bio: "Passionate early literacy specialist using Jolly Phonics and sensorial Montessori apparatus. Helps children from age 3-8 develop reading fluency, penmanship, and foundational numeracy.",
        gender: "Female"
      },
      {
        id: "tch-3",
        fullName: "Kofi Owusu-Ansah",
        headline: "Senior BECE Integrated Science & Biology Instructor",
        subjects: ["Integrated Science", "Biology", "Agricultural Science"],
        curricula: ["GES Standards-based"],
        levels: ["JHS", "SHS"],
        region: "Ashanti",
        suburb: "Ahodwo",
        experienceYears: 10,
        qualification: "B.Ed. Science, UCC Cape Coast",
        rate: "GH₵ 80 / hour (Home Tutoring)",
        teachingModes: ["Home Tutoring", "BECE Weekend Bootcamps", "School Contract"],
        verified: true,
        licenseNumber: "NTC-SC-209931",
        ratingBadge: "GES Senior Master",
        subscriptionTier: "Standard",
        phone: "+233 32 201 4455",
        whatsapp: "+233 24 991 3322",
        email: "kofi.owusu@sciencedirect.gh",
        bio: "Renowned BECE and WASSCE science coach in Kumasi. 10 years of consistent Grade 1 results with practical experiment-based teaching methods.",
        gender: "Male"
      },
      {
        id: "tch-4",
        fullName: "Madame Michelle De-Graft",
        headline: "Bilingual French & Spanish Language Specialist (DELF/DALF Prep)",
        subjects: ["French", "Spanish", "English Literature"],
        curricula: ["Cambridge (CIE)", "IB World", "GES"],
        levels: ["Primary", "JHS", "SHS"],
        region: "Greater Accra",
        suburb: "Airport Residential",
        experienceYears: 7,
        qualification: "M.A. Romance Languages (Sorbonne / Univ of Ghana), DELF Examiner",
        rate: "GH₵ 150 / hour",
        teachingModes: ["Home Tutoring", "Corporate / Diplomatic Children", "Online"],
        verified: true,
        licenseNumber: "NTC-FR-330192",
        ratingBadge: "DELF Certified Examiner",
        subscriptionTier: "Featured Pro",
        phone: "+233 20 887 6654",
        whatsapp: "+233 20 887 6654",
        email: "michelle.degraft@languages.gh",
        bio: "Native-level bilingual educator preparing students for IGCSE French, IB French B, and DELF Prim/Junior certifications. Interactive immersion style.",
        gender: "Female"
      },
      {
        id: "tch-5",
        fullName: "Ing. Michael K. Addo",
        headline: "STEM, Robotics, Arduino & Python Coding Mentor for Kids",
        subjects: ["Coding & Python", "Robotics & Arduino", "ICT & Computing"],
        curricula: ["Cambridge (CIE)", "STEM Curriculum", "GES"],
        levels: ["Primary", "JHS", "SHS"],
        region: "Greater Accra",
        suburb: "Tema",
        experienceYears: 5,
        qualification: "BSc Computer Engineering (KNUST), Certified LEGO Education Coach",
        rate: "GH₵ 130 / hour or Weekend STEM Club",
        teachingModes: ["Home Tutoring", "School STEM Club Coach", "Online"],
        verified: true,
        licenseNumber: "NTC-IT-901234",
        ratingBadge: "Certified STEM Coach",
        subscriptionTier: "Featured Pro",
        phone: "+233 54 112 3344",
        whatsapp: "+233 54 112 3344",
        email: "michael.addo@stemghana.org",
        bio: "Coached multiple Ghanaian student teams in international robotics competitions. Teaches hands-on circuitry, game development in Scratch, Python, and 3D design.",
        gender: "Male"
      },
      {
        id: "tch-6",
        fullName: "Maame Yaa Asantewaa",
        headline: "Special Education Needs (SEN) & Speech Development Therapist",
        subjects: ["Special Needs (SEN)", "Speech & Language Therapy", "ADHD/Autism Support"],
        curricula: ["Inclusive Education", "Montessori", "British SEN"],
        levels: ["Crèche", "Kindergarten", "Primary"],
        region: "Ashanti",
        suburb: "Nhyiaeso",
        experienceYears: 9,
        qualification: "B.Ed. Special Education (UEW Winneba), Diploma in Child Psychology",
        rate: "GH₵ 140 / hour",
        teachingModes: ["Home Therapy / Tutoring", "Shadow Teacher in School"],
        verified: true,
        licenseNumber: "NTC-SEN-112098",
        ratingBadge: "Licensed SEN Specialist",
        subscriptionTier: "Featured Pro",
        phone: "+233 24 771 8899",
        whatsapp: "+233 24 771 8899",
        email: "maame.yaa@senghana.org",
        bio: "Dedicated special needs specialist providing individualized education plans (IEPs) for children with learning difficulties, ADHD, autism, and speech delays.",
        gender: "Female"
      }
    ],
    jobApplications: [],
    leads: [
      {
        id: "lead-1",
        schoolId: "sch-gis-accra",
        type: "whatsapp_reveal",
        timestamp: "2026-10-23T14:15:00Z"
      },
      {
        id: "lead-2",
        schoolId: "sch-gis-accra",
        type: "call_click",
        timestamp: "2026-10-23T14:30:00Z"
      },
      {
        id: "lead-3",
        schoolId: "sch-ridge-school-kumasi",
        type: "whatsapp_reveal",
        timestamp: "2026-10-23T15:10:00Z"
      }
    ],
    claims: [],
    transactions: getInitialTransactions(),
    csspsSchools: getInitialCSSPSSchools()
  };
}

function getInitialTransactions() {
  return [
    {
      id: "tx-1001",
      reference: "SD-PAY-K9X2-4819",
      amount: 350,
      currency: "GHS",
      purpose: "teacher_subscription",
      payerName: "Kwame Boateng",
      payerPhone: "0244123456",
      network: "MTN MoMo",
      targetId: "tch-1792770759180",
      targetTitle: "Featured Pro Educator Subscription (1 Year)",
      status: "success",
      receiptNumber: "SD-REC-89210411",
      timestamp: "2026-10-23T16:00:00Z"
    },
    {
      id: "tx-1002",
      reference: "SD-PAY-M3Z1-7720",
      amount: 1200,
      currency: "GHS",
      purpose: "school_premium",
      payerName: "Mrs. Vivian Arthur",
      payerPhone: "0244318900",
      network: "Telecel Cash",
      targetId: "sch-gis-accra",
      targetTitle: "Verified Campus & Premium Lead Package",
      status: "success",
      receiptNumber: "SD-REC-89210412",
      timestamp: "2026-10-23T17:15:00Z"
    }
  ];
}

function getInitialCSSPSSchools() {
  return [
    {
      id: "cssps-presec-legon",
      name: "Presbyterian Boys' Secondary School (PRESEC Legon)",
      motto: "In Lumine Tuo Videbimus Lumen (In Thy Light We Shall See Light)",
      category: "Category A",
      region: "Greater Accra",
      district: "La Nkwantanang Madina",
      suburb: "Legon / Madina",
      gender: "Boys",
      boardingType: "Boarding & Day",
      cutoffMin: 6,
      cutoffMax: 8,
      established: 1938,
      programs: ["General Science", "General Arts", "Business", "Visual Arts"],
      flagshipProgram: "General Science (8-Time NSMQ Champions)",
      gesCode: "0010101",
      overview: "Ghana's premier boys' secondary school and record eight-time National Science and Maths Quiz champions. Renowned for supreme academic distinction in STEM, discipline, and high-impact leadership development."
    },
    {
      id: "cssps-achimota",
      name: "Achimota School (Motown)",
      motto: "Ut Omnes Unum Sint (That All May Be One)",
      category: "Category A",
      region: "Greater Accra",
      district: "Okaikwei North",
      suburb: "Achimota",
      gender: "Co-educational",
      boardingType: "Boarding & Day",
      cutoffMin: 6,
      cutoffMax: 10,
      established: 1927,
      programs: ["General Science", "General Arts", "Business", "Home Economics", "Visual Arts", "Agricultural Science"],
      flagshipProgram: "General Arts & General Science",
      gesCode: "0010102",
      overview: "Iconic co-educational institution founded in 1927. Alma mater to multiple African heads of state, renowned for its sprawling green heritage campus, classical orchestra tradition, and pan-African scholarship."
    },
    {
      id: "cssps-wesley-girls",
      name: "Wesley Girls' High School (Wey Gey Hey)",
      motto: "Live Pure, Speak True, Right Wrong, Follow the King",
      category: "Category A",
      region: "Central",
      district: "Cape Coast Metropolitan",
      suburb: "Cape Coast",
      gender: "Girls",
      boardingType: "Boarding Only",
      cutoffMin: 6,
      cutoffMax: 8,
      established: 1836,
      programs: ["General Science", "General Arts", "Business", "Home Economics", "Visual Arts"],
      flagshipProgram: "General Science & Business",
      gesCode: "0030101",
      overview: "Consistently ranked as Ghana's highest-achieving girls' secondary school in WASSCE results, fostering spiritual discipline, moral rectitude, and trailblazing female leadership."
    },
    {
      id: "cssps-prempeh",
      name: "Prempeh College (Amanfoo)",
      motto: "Sub Animo Sano (In a Sound Mind)",
      category: "Category A",
      region: "Ashanti",
      district: "Kumasi Metropolitan",
      suburb: "Sofoline / Kumasi",
      gender: "Boys",
      boardingType: "Boarding & Day",
      cutoffMin: 6,
      cutoffMax: 9,
      established: 1949,
      programs: ["General Science", "General Arts", "Business", "Visual Arts"],
      flagshipProgram: "General Science & Robotics",
      gesCode: "0020101",
      overview: "Founded in collaboration between the Asantehene, Otumfuo Sir Osei Agyeman Prempeh II, and the Presbyterian/Methodist churches. Perennial NSMQ champions and international robotics title-holders."
    },
    {
      id: "cssps-opoku-ware",
      name: "Opoku Ware School (OWASS / Akatakyie)",
      motto: "Deus Lux Scientiae (God is the Light of Knowledge)",
      category: "Category A",
      region: "Ashanti",
      district: "Kumasi Metropolitan",
      suburb: "Santasi / Kumasi",
      gender: "Boys",
      boardingType: "Boarding & Day",
      cutoffMin: 6,
      cutoffMax: 9,
      established: 1952,
      programs: ["General Science", "General Arts", "Business", "Visual Arts"],
      flagshipProgram: "General Science & Visual Arts",
      gesCode: "0020102",
      overview: "Prestigious Catholic boys' boarding institution in Kumasi named after Asantehene Opoku Ware I, celebrated for STEM mastery and storied academic rivalry with Prempeh College."
    },
    {
      id: "cssps-holy-child",
      name: "Holy Child School (Holico)",
      motto: "Facta Non Verba (Actions Not Words)",
      category: "Category A",
      region: "Central",
      district: "Cape Coast Metropolitan",
      suburb: "Cape Coast",
      gender: "Girls",
      boardingType: "Boarding Only",
      cutoffMin: 6,
      cutoffMax: 9,
      established: 1946,
      programs: ["General Science", "General Arts", "Business", "Home Economics"],
      flagshipProgram: "General Science & Home Economics",
      gesCode: "0030102",
      overview: "Historic Catholic girls' secondary institution nestled on the coastal hills of Cape Coast, cultivating polished academic excellence, poise, and ethical servant leadership."
    },
    {
      id: "cssps-st-thomas-aquinas",
      name: "St. Thomas Aquinas Senior High School (Old Toms)",
      motto: "Veritas Liberat (The Truth Sets Free)",
      category: "Category B",
      region: "Greater Accra",
      district: "La Dade-Kotopon",
      suburb: "Cantonments",
      gender: "Boys",
      boardingType: "Day Only",
      cutoffMin: 9,
      cutoffMax: 15,
      established: 1952,
      programs: ["General Science", "General Arts", "Business", "Visual Arts"],
      flagshipProgram: "General Science (Former NSMQ Champions)",
      gesCode: "0010103",
      overview: "Leading Catholic boys' metropolitan day school in Cantonments, Accra. NSMQ winners celebrated for high science aptitude, accessibility, and stellar academic record."
    },
    {
      id: "cssps-aburi-girls",
      name: "Aburi Girls' Senior High School (ABUGISS)",
      motto: "Bepɔw So Hann (Light on a Hill)",
      category: "Category B",
      region: "Eastern",
      district: "Akuapem South",
      suburb: "Aburi",
      gender: "Girls",
      boardingType: "Boarding Only",
      cutoffMin: 7,
      cutoffMax: 13,
      established: 1946,
      programs: ["General Science", "General Arts", "Business", "Home Economics", "Visual Arts"],
      flagshipProgram: "General Science & General Arts",
      gesCode: "0040101",
      overview: "Presbyterian girls' boarding school set on the scenic, cool Aburi hills. Celebrated for serene learning atmosphere, exceptional discipline, and high university entrance rates."
    },
    {
      id: "cssps-accra-academy",
      name: "Accra Academy (Bleoo)",
      motto: "Esse Quam Videri (To Be Rather Than To Seem)",
      category: "Category B",
      region: "Greater Accra",
      district: "Ablekuma Central",
      suburb: "Bubuashie / Kaneshie",
      gender: "Boys",
      boardingType: "Boarding & Day",
      cutoffMin: 8,
      cutoffMax: 14,
      established: 1931,
      programs: ["Business", "General Science", "General Arts", "Visual Arts"],
      flagshipProgram: "Business Studies & General Science",
      gesCode: "0010104",
      overview: "First privately founded indigenous secondary school in Ghana, recognized as the premier cradle of Ghanaian business leaders, bankers, and industry executives."
    },
    {
      id: "cssps-kumasi-high",
      name: "Kumasi High School (KUHIS / Mmeranteɛ)",
      motto: "Truth and Hard Work",
      category: "Category B",
      region: "Ashanti",
      district: "Asokwa Municipal",
      suburb: "Gyinyase / Kumasi",
      gender: "Boys",
      boardingType: "Boarding & Day",
      cutoffMin: 10,
      cutoffMax: 17,
      established: 1962,
      programs: ["General Science", "General Arts", "Business", "Visual Arts"],
      flagshipProgram: "General Science & Business",
      gesCode: "0020103",
      overview: "Proud Anglican boys' institution producing outstanding medical practitioners and engineers, known for strong alumni network and academic vigor."
    },
    {
      id: "cssps-st-louis",
      name: "St. Louis Senior High School (Slovis)",
      motto: "Dieu Le Veut (God Wills It)",
      category: "Category B",
      region: "Ashanti",
      district: "Oforikrom Municipal",
      suburb: "Oduom / Kumasi",
      gender: "Girls",
      boardingType: "Boarding & Day",
      cutoffMin: 8,
      cutoffMax: 14,
      established: 1952,
      programs: ["General Science", "General Arts", "Business", "Home Economics", "Visual Arts"],
      flagshipProgram: "General Science & Home Economics",
      gesCode: "0020104",
      overview: "Premier Catholic girls' school in Kumasi, sister school to Opoku Ware School, famed for discipline, scientific research, and academic leadership."
    },
    {
      id: "cssps-accra-high",
      name: "Accra High School (AHISCA)",
      motto: "Redeem the Time",
      category: "Category C",
      region: "Greater Accra",
      district: "Klottey-Korle",
      suburb: "Ridge / Asylum Down",
      gender: "Co-educational",
      boardingType: "Day & Boarding",
      cutoffMin: 14,
      cutoffMax: 26,
      established: 1923,
      programs: ["General Science", "General Arts", "Business", "Visual Arts", "Home Economics", "Technical"],
      flagshipProgram: "Business & Visual Arts",
      gesCode: "0010105",
      overview: "Centenary co-educational school located in the central Ridge educational belt of Accra, offering broad academic and vocational courses with solid examination completion."
    },
    {
      id: "cssps-kumasi-academy",
      name: "Kumasi Academy (KUMACA)",
      motto: "It Is Possible",
      category: "Category C",
      region: "Ashanti",
      district: "Asokore Mampong",
      suburb: "Asokore Mampong",
      gender: "Co-educational",
      boardingType: "Boarding & Day",
      cutoffMin: 15,
      cutoffMax: 27,
      established: 1957,
      programs: ["General Science", "General Arts", "Business", "Home Economics", "Visual Arts"],
      flagshipProgram: "General Arts & Business",
      gesCode: "0020105",
      overview: "Dynamic Baptist-founded secondary school offering well-equipped science laboratories and residential boarding facilities in Greater Kumasi."
    },
    {
      id: "cssps-armed-forces",
      name: "Armed Forces Senior High Technical School (AFRICOH)",
      motto: "Discipline and Hard Work",
      category: "Category C",
      region: "Ashanti",
      district: "Bantama / Kumasi",
      suburb: "4BN Barracks, Uaddara",
      gender: "Co-educational",
      boardingType: "Day & Boarding",
      cutoffMin: 16,
      cutoffMax: 30,
      established: 1991,
      programs: ["Technical", "General Science", "General Arts", "Visual Arts", "Home Economics"],
      flagshipProgram: "Technical Drawing & Applied Sciences",
      gesCode: "0020106",
      overview: "Highly disciplined technical high school situated inside the military barracks, renowned for technical draftsmanship, engineering workshops, and structured routine."
    },
    {
      id: "cssps-attc",
      name: "Accra Technical Training Centre (ATTC)",
      motto: "Training for Self-Reliance",
      category: "Category C",
      region: "Greater Accra",
      district: "Ayawaso Central",
      suburb: "Kokomlemle",
      gender: "Co-educational",
      boardingType: "Day Only",
      cutoffMin: 18,
      cutoffMax: 36,
      established: 1966,
      programs: ["Technical", "Engineering", "ICT & Computer Hardware", "Automotive", "Building Construction"],
      flagshipProgram: "Technical & Vocational (TVET Category A)",
      gesCode: "0010106",
      overview: "Ghana's premier technical institute established in collaboration with the Canadian Government. Perfect pathway for hands-on technical skills and engineering progression."
    }
  ];
}

function getInitialAdmissionApplications() {
  return [
    {
      id: "app-2026-001",
      applicationNumber: "SD-ADM-2026-4819",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      termApplied: "Term 1 (September 2026)",
      gradeApplying: "Primary 1 (Class 1)",
      curriculum: "Cambridge (CIE)",
      status: "Entrance Exam Scheduled",
      entranceExamDate: "Saturday, 15th August 2026 at 9:00 AM",
      createdAt: "2026-10-18T10:30:00.000Z",
      student: {
        fullName: "Kwame Asante Mensah",
        gender: "Male",
        dateOfBirth: "2019-04-12",
        nationality: "Ghanaian",
        religiousAffiliation: "Christian",
        bloodGroup: "O+",
        allergies: "Mild reaction to penicillin",
        emergencyContact: "+233 24 411 2233"
      },
      previousSchool: {
        schoolName: "Little Explorers Montessori Preschool",
        lastClassPassed: "Kindergarten 2",
        reasonForTransfer: "Advancement to primary school education"
      },
      parentGuardian: {
        primaryGuardianName: "Dr. Kofi Asante Mensah",
        relationship: "Father",
        occupation: "Consulting Civil Engineer",
        residentialAddress: "Plot 42, Ambassadorial Enclave, East Legon, Accra",
        phone: "+233 24 411 2233",
        whatsapp: "+233 24 411 2233",
        email: "kofi.mensah@ghanaconsult.com",
        secondaryContactName: "Mrs. Akosua Mensah",
        secondaryPhone: "+233 20 811 4455"
      },
      documentsSubmitted: [
        { docType: "Birth Certificate", fileName: "birth_cert_kwame_mensah.pdf", verified: true },
        { docType: "Ghana Health Immunization Record", fileName: "ghs_immunization_kwame.pdf", verified: true },
        { docType: "KG2 Terminal Academic Report", fileName: "kg2_report_card_2025.pdf", verified: true }
      ],
      adminNotes: "Candidate passed preschool reading assessment. Formal entrance exam scheduled for Math and Phonics on campus.",
      decisionDate: "2026-10-20T14:00:00.000Z"
    },
    {
      id: "app-2026-002",
      applicationNumber: "SD-ADM-2026-5120",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      termApplied: "Term 1 (September 2026)",
      gradeApplying: "Junior High School 1 (JHS 1 / Grade 7)",
      curriculum: "Cambridge (CIE)",
      status: "Admitted",
      entranceExamDate: "Completed (Score: 88%)",
      createdAt: "2026-10-12T09:15:00.000Z",
      student: {
        fullName: "Serwaa Boateng",
        gender: "Female",
        dateOfBirth: "2013-09-24",
        nationality: "Ghanaian",
        religiousAffiliation: "Christian",
        bloodGroup: "B+",
        allergies: "None",
        emergencyContact: "+233 24 990 1122"
      },
      previousSchool: {
        schoolName: "Morning Star School (Cantonments)",
        lastClassPassed: "Primary 6",
        reasonForTransfer: "Transitioning to Cambridge Secondary 1 curriculum"
      },
      parentGuardian: {
        primaryGuardianName: "Mrs. Abena Boateng",
        relationship: "Mother",
        occupation: "Investment Banker",
        residentialAddress: "14 Sixth Circular Road, Cantonments, Accra",
        phone: "+233 24 990 1122",
        whatsapp: "+233 24 990 1122",
        email: "abena.boateng@fidelitybank.com.gh",
        secondaryContactName: "Mr. Kwabena Boateng",
        secondaryPhone: "+233 27 770 3344"
      },
      documentsSubmitted: [
        { docType: "Birth Certificate", fileName: "birth_cert_serwaa_boateng.pdf", verified: true },
        { docType: "Class 6 Terminal Academic Report", fileName: "class6_terminal_report.pdf", verified: true },
        { docType: "Headteacher Recommendation Letter", fileName: "recommendation_morningstar.pdf", verified: true }
      ],
      adminNotes: "Outstanding score in Cambridge checkpoint entrance assessment (88%). Official Letter of Provisional Admission issued.",
      decisionDate: "2026-10-22T11:30:00.000Z"
    },
    {
      id: "app-2026-003",
      applicationNumber: "SD-ADM-2026-6294",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      termApplied: "Term 1 (September 2026)",
      gradeApplying: "Preschool & Kindergarten (KG 1)",
      curriculum: "Montessori",
      status: "Received",
      entranceExamDate: "Pending Scheduling",
      createdAt: "2026-10-23T15:20:00.000Z",
      student: {
        fullName: "Nana Yaw Osei",
        gender: "Male",
        dateOfBirth: "2022-02-18",
        nationality: "Ghanaian",
        religiousAffiliation: "Christian",
        bloodGroup: "A+",
        allergies: "Asthma inhaler required during harmattan",
        emergencyContact: "+233 26 555 7788"
      },
      previousSchool: {
        schoolName: "First Steps Crèche (Airport Residential)",
        lastClassPassed: "Nursery 2",
        reasonForTransfer: "Entry into structured kindergarten"
      },
      parentGuardian: {
        primaryGuardianName: "Ing. Kwabena Osei",
        relationship: "Father",
        occupation: "Telecommunications Director",
        residentialAddress: "Spintex Road, Hse 8B Manet Court, Accra",
        phone: "+233 26 555 7788",
        whatsapp: "+233 26 555 7788",
        email: "k.osei@telecomgh.com",
        secondaryContactName: "Dr. Evelyn Osei",
        secondaryPhone: "+233 24 333 9900"
      },
      documentsSubmitted: [
        { docType: "Birth Certificate", fileName: "birth_cert_nana_yaw_osei.pdf", verified: true },
        { docType: "Ghana Child Health Record", fileName: "yellow_health_card.pdf", verified: true }
      ],
      adminNotes: "New application received via SchoolDirect Digital Admissions Portal. Admissions officer to schedule play-based developmental interview.",
      decisionDate: null
    },
    {
      id: "app-2026-004",
      applicationNumber: "SD-ADM-2026-7731",
      schoolId: "sch-roman-ridge",
      schoolName: "The Roman Ridge School",
      termApplied: "Term 1 (September 2026)",
      gradeApplying: "Senior High School (Year 10 / IGCSE)",
      curriculum: "Cambridge (CIE)",
      status: "Under Review",
      entranceExamDate: "Saturday, 22nd August 2026",
      createdAt: "2026-10-21T16:45:00.000Z",
      student: {
        fullName: "Efe Dzidzor Dogbe",
        gender: "Female",
        dateOfBirth: "2011-06-05",
        nationality: "Ghanaian",
        religiousAffiliation: "Christian",
        bloodGroup: "O+",
        allergies: "None",
        emergencyContact: "+233 24 112 3344"
      },
      previousSchool: {
        schoolName: "Christ The King International School",
        lastClassPassed: "JHS 3 (BECE Candidate)",
        reasonForTransfer: "Transition to British curriculum for IGCSE/A-Levels"
      },
      parentGuardian: {
        primaryGuardianName: "Mr. Mawuli Dogbe",
        relationship: "Father",
        occupation: "Chartered Accountant & Financial Controller",
        residentialAddress: "Roman Ridge Extension, Near Roman Ridge Hospital",
        phone: "+233 24 112 3344",
        whatsapp: "+233 24 112 3344",
        email: "mawuli.dogbe@pwc.com",
        secondaryContactName: "Mrs. Delali Dogbe",
        secondaryPhone: "+233 20 445 6677"
      },
      documentsSubmitted: [
        { docType: "Birth Certificate", fileName: "birth_cert_efe_dogbe.pdf", verified: true },
        { docType: "JHS 3 Mock Examination Results", fileName: "jhs3_mock_slip.pdf", verified: true }
      ],
      adminNotes: "Academic transcripts show strong aptitude in Additional Mathematics and Science. Under review by Academic Dean.",
      decisionDate: null
    }
  ];
}

// Feature 2: Verified Parent Reviews & School Community Rating Dataset
function getInitialReviews() {
  return [
    {
      id: "rev-2026-001",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      authorName: "Mrs. Brenda Ankomah",
      affiliation: "Verified Current Parent",
      wardGrade: "Class 6 & Form 2 (JHS)",
      verifiedBadge: true,
      overallRating: 5.0,
      dimensions: {
        academics: 5,
        facilities: 5,
        discipline: 4,
        valueForMoney: 4,
        communication: 5
      },
      title: "World-class Cambridge preparation with phenomenal extracurricular balance",
      content: "My two children have attended GIS since Class 2. The transition through Cambridge Primary and Secondary Checkpoints has been outstanding. Teachers don't just teach for exam regurgitation; they foster critical problem-solving, debate, and presentation skills. The Olympic swimming pool and new robotics coding lab are second to none in Accra. Tuition is in the elite tier, but the academic rigor and Ivy League/Russell Group university placements justify the investment.",
      highlights: ["Cambridge CIE Excellence", "Robotics & STEM Suites", "Olympic Swimming Pool", "College Placement", "Dedicated Faculty"],
      helpfulCount: 28,
      createdAt: "2026-09-18T10:15:00.000Z",
      officialReply: {
        author: "Dr. Mary Ashun",
        role: "Head of School / Administration",
        date: "2026-09-20T14:30:00.000Z",
        message: "Thank you, Mrs. Ankomah, for your encouraging testimonial. We take immense pride in our holistic student development and our faculty's commitment to nurturing global-minded Ghanaian and international youth."
      }
    },
    {
      id: "rev-2026-002",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      authorName: "Ing. Kwame Boadu",
      affiliation: "Verified Current Parent",
      wardGrade: "Year 10 (IGCSE)",
      verifiedBadge: true,
      overallRating: 4.8,
      dimensions: {
        academics: 5,
        facilities: 5,
        discipline: 5,
        valueForMoney: 4,
        communication: 5
      },
      title: "Phenomenal science laboratories and university counseling department",
      content: "The level of individualized pastoral care here is unmatched. When my daughter was transitioning from Ghana National curriculum to Cambridge IGCSE, her homeroom tutor spent extra afternoon hours bridging the gap. The career counseling office begins preparing students for SATs and UK UCAS from Form 3. Minor drawback is Cantonments morning traffic, but the school's private shuttle service works seamlessly.",
      highlights: ["Individualized Tutoring", "UCAS/SAT Prep", "Safe Shuttle Bus", "Science Labs"],
      helpfulCount: 19,
      createdAt: "2026-08-25T11:40:00.000Z",
      officialReply: null
    },
    {
      id: "rev-2026-003",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      authorName: "Dr. Yaa Dufie Frimpong",
      affiliation: "Alumni & Current Parent",
      wardGrade: "Preschool (Nursery 2)",
      verifiedBadge: true,
      overallRating: 5.0,
      dimensions: {
        academics: 5,
        facilities: 5,
        discipline: 5,
        valueForMoney: 5,
        communication: 5
      },
      title: "Generational legacy of excellence that only gets better with time",
      content: "As an alumna myself, enrolling my son in the Early Childhood section was an easy choice. The phonics foundation, sensory play areas, and bilingual French introduction from age 3 have given him incredible social confidence. Truly a premier learning environment in Ghana.",
      highlights: ["Early Childhood Phonics", "French Immersion", "Heritage & Community"],
      helpfulCount: 14,
      createdAt: "2026-07-12T09:20:00.000Z",
      officialReply: null
    },
    {
      id: "rev-2026-004",
      schoolId: "sch-sos-tema",
      schoolName: "SOS-Hermann Gmeiner International College",
      authorName: "Nana Kwasi Antwi",
      affiliation: "Verified Current Parent",
      wardGrade: "SHS 2 (IB Diploma Program)",
      verifiedBadge: true,
      overallRating: 4.9,
      dimensions: {
        academics: 5,
        facilities: 5,
        discipline: 5,
        valueForMoney: 5,
        communication: 4
      },
      title: "The premier International Baccalaureate (IB) institution in West Africa",
      content: "SOS-HGIC instills authentic Pan-African leadership and intellectual grit. The students are pushed to analyze complex global issues while serving their local Tema communities through mandatory CAS projects. Boarding facilities are disciplined and homely. If you want your child to develop world-class critical thinking without losing their African roots, this is the gold standard.",
      highlights: ["IB Diploma Rigor", "Pan-African Leadership", "Disciplined Boarding", "Community Service CAS"],
      helpfulCount: 31,
      createdAt: "2026-09-02T15:10:00.000Z",
      officialReply: {
        author: "Admissions Directorate",
        role: "SOS-HGIC Administration",
        date: "2026-09-05T09:00:00.000Z",
        message: "Thank you Nana Antwi for this thoughtful review. 'Knowledge in the Service of Africa' remains our guiding motto every single day."
      }
    },
    {
      id: "rev-2026-005",
      schoolId: "sch-roman-ridge",
      schoolName: "The Roman Ridge School",
      authorName: "Mrs. Cynthia Opoku-Ware",
      affiliation: "Verified Current Parent",
      wardGrade: "Primary (Class 4)",
      verifiedBadge: true,
      overallRating: 4.8,
      dimensions: {
        academics: 5,
        facilities: 4,
        discipline: 5,
        valueForMoney: 5,
        communication: 5
      },
      title: "Warm, supportive community with capped class sizes of 16 pupils",
      content: "We moved from the UK two years ago and Roman Ridge made our children feel at home immediately. Class sizes are strictly capped so teachers know every child's strength and learning style intimately. Reading and mental maths standards are exceptionally high. Excellent security and reliable canteen hot lunches.",
      highlights: ["Small Class Sizes", "UK Returnee Friendly", "Strong Phonics", "Nutritious Canteen"],
      helpfulCount: 22,
      createdAt: "2026-08-14T13:45:00.000Z",
      officialReply: null
    },
    {
      id: "rev-2026-006",
      schoolId: "sch-galaxy-accra",
      schoolName: "Galaxy International School",
      authorName: "Alhaji Farouk Ibrahim",
      affiliation: "Verified Current Parent",
      wardGrade: "JHS 2 & Class 5",
      verifiedBadge: true,
      overallRating: 4.7,
      dimensions: {
        academics: 5,
        facilities: 5,
        discipline: 4,
        valueForMoney: 4,
        communication: 5
      },
      title: "Undisputed champions in Mathematics and International Science Olympiads",
      content: "Galaxy's STEM focus is legendary. My son represented Ghana in the international mathematics olympiad and the school's robotics team provided high-end kits and mentors. High standard of technology and coding incorporated into everyday lessons. Dual campus setup in East Legon and Ashaley Botwe is very convenient.",
      highlights: ["Olympiad Math Champions", "Coding Suites", "Multilingual Community"],
      helpfulCount: 16,
      createdAt: "2026-07-28T08:30:00.000Z",
      officialReply: null
    }
  ];
}

// Feature 3: Direct Admissions Inquiries & School-to-Parent Messaging Center Dataset
function getInitialInquiries() {
  return [
    {
      id: "inq-2026-001",
      inquiryNumber: "INQ-GIS-2026-9182",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      parentName: "Mrs. Naa Korkoi Addison",
      parentPhone: "+233 24 551 2341",
      parentWhatsapp: "+233 24 551 2341",
      parentEmail: "naa.addison@gmail.com",
      studentName: "Kofi Addison",
      gradeApplying: "Grade 7 (Lower Secondary / JHS 1)",
      category: "Campus Tour & Inspection Booking",
      tourRequested: true,
      preferredTourDate: "2026-11-04",
      preferredTourTime: "10:00 AM",
      subject: "Booking physical campus walkthrough & STEM lab inspection",
      message: "Good day Admissions Team. Our family is relocating from Takoradi to Cantonments in December. We would like to tour the campus, observe the middle school robotics lab, and speak with the admissions coordinator regarding Cambridge checkpoint transitions.",
      status: "Tour Scheduled",
      createdAt: "2026-10-21T09:30:00.000Z",
      replies: [
        {
          id: "rep-001-1",
          sender: "school",
          senderName: "Mr. David Mensah",
          senderRole: "Head of Admissions & Public Relations",
          message: "Dear Mrs. Addison, we would be delighted to host you and your family. Your campus tour has been confirmed for Wednesday, 4th November 2026 at 10:00 AM. Please report to the Principal's Administration Block where a senior prefect guide and our STEM faculty lead will receive you.",
          timestamp: "2026-10-21T14:15:00.000Z"
        }
      ]
    },
    {
      id: "inq-2026-002",
      inquiryNumber: "INQ-GIS-2026-4409",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      parentName: "Dr. Emmanuel K. Osei",
      parentPhone: "+233 20 812 9090",
      parentWhatsapp: "+233 20 812 9090",
      parentEmail: "ekosei@ug.edu.gh",
      studentName: "Aba Osei",
      gradeApplying: "Year 12 (A-Levels / Sixth Form)",
      category: "School Fees, Scholarships & Payment Plans",
      tourRequested: false,
      preferredTourDate: null,
      preferredTourTime: null,
      subject: "Inquiry on Cambridge A-Level STEM Merit Scholarships & Flexible Termly Installments",
      message: "Hello. My daughter completed her IGCSEs with 7 A* grades. Does GIS offer any partial academic merit scholarships for incoming Sixth Form students majoring in Biology, Chemistry, and Further Mathematics? Also, what are the bank transfer installment plans for termly tuition?",
      status: "Unread",
      createdAt: "2026-10-23T11:45:00.000Z",
      replies: []
    },
    {
      id: "inq-2026-003",
      inquiryNumber: "INQ-SOS-2026-3821",
      schoolId: "sch-sos-tema",
      schoolName: "SOS-Hermann Gmeiner International College",
      parentName: "Mrs. Comfort Quaye",
      parentPhone: "+233 24 332 1199",
      parentWhatsapp: "+233 24 332 1199",
      parentEmail: "comfort.quaye@ecobank.com",
      studentName: "Nana Ama Quaye",
      gradeApplying: "IB Diploma (Year 1)",
      category: "Boarding Life, Hostels & Safety",
      tourRequested: true,
      preferredTourDate: "2026-11-12",
      preferredTourTime: "02:00 PM",
      subject: "Boarding hostel safety, weekend prep routines, and medical care",
      message: "Warm greetings. We are considering SOS-HGIC for our daughter's IB Diploma. Since we live outside Accra (Kumasi), she will be a full boarder. We would appreciate insights into house parent supervision, dining hygiene, and whether weekend boarding exeats are permitted.",
      status: "Replied",
      createdAt: "2026-10-20T16:20:00.000Z",
      replies: [
        {
          id: "rep-003-1",
          sender: "school",
          senderName: "Mrs. Angela Sowah",
          senderRole: "Dean of Boarding & Student Welfare",
          message: "Dear Mrs. Quaye, thank you for your inquiry. Our residential life program has 24/7 resident house parents, full-time nursing sick bays, and nutritious balanced meals overseen by certified dietitians. Weekend boarding exeats require pre-authorization by parent and dean. We welcome you for a boarding inspection on Thursday, 12th November at 2:00 PM.",
          timestamp: "2026-10-21T09:10:00.000Z"
        }
      ]
    },
    {
      id: "inq-2026-004",
      inquiryNumber: "INQ-ROM-2026-7210",
      schoolId: "sch-roman-ridge",
      schoolName: "The Roman Ridge School",
      parentName: "Mr. Patrick Mensah-Bonsu",
      parentPhone: "+233 27 740 5511",
      parentWhatsapp: "+233 27 740 5511",
      parentEmail: "p.mensahbonsu@gmail.com",
      studentName: "Kwadwo Mensah-Bonsu",
      gradeApplying: "Primary Class 4",
      category: "Special Educational Needs (SEN) & Learning Support",
      tourRequested: false,
      preferredTourDate: null,
      preferredTourTime: null,
      subject: "Mild dyslexia support and speech therapy resources in Primary School",
      message: "Good afternoon. Our 8-year-old son has mild dyslexia and requires structured phonics and extra time during internal examinations. Does Roman Ridge have dedicated SEN learning specialists and shadow teacher accommodation?",
      status: "Unread",
      createdAt: "2026-10-23T18:05:00.000Z",
      replies: []
    }
  ];
}

// Feature 4: WAEC/BECE/WASSCE & Cambridge Past Questions & Academic Resource Hub Dataset
function getInitialAcademicResources() {
  return [
    {
      id: "res-bece-math-2024",
      paperCode: "WAEC-BECE-MATH-2024",
      examType: "BECE",
      examBody: "WAEC Ghana",
      title: "WAEC BECE Mathematics Papers 1 & 2 with Step-by-Step Marking Scheme",
      subject: "Mathematics",
      year: 2024,
      gradeLevel: "JHS 3 / Basic 9",
      duration: "2 Hours (Paper 1: 1 hr, Paper 2: 1 hr)",
      totalMarks: 100,
      difficulty: "Standard",
      downloadsCount: 485,
      rating: 4.9,
      topics: ["Linear Equations & Inequalities", "Plane Geometry & Compass Construction", "Sets & Venn Diagrams", "Percentages & Profit", "Vectors & Bearings"],
      description: "Official 2024 Basic Education Certificate Examination (BECE) Mathematics papers covering Section A Objective items and Section B Extended Theory. Features complete step-by-step method and accuracy marks (M1, A1, B1 rubrics) and Chief Examiner reports on algebraic signs and compass constructions.",
      chiefExaminerRemarks: "Many candidates failed to express their final answers in the standard form requested in Question 2a, while others lost easy method marks in vectors by omitting arrow vectors and unit brackets. Candidates who clearly set out their working scored above 85%.",
      questions: [
        {
          questionNumber: "Question 1 (Theory - Sets & Inequalities)",
          topic: "Sets & Venn Diagrams",
          marks: 15,
          questionText: "(a) In a class of 45 students, 28 study French, 22 study Twi and 5 study neither French nor Twi.\n(i) Illustrate this information on a Venn diagram.\n(ii) Find the number of students who study both French and Twi.\n(iii) Calculate the probability that a student chosen at random studies only one language.\n\n(b) Solve the inequality: (3x - 1) / 4 - (2x + 3) / 3 > 1/2 and illustrate the truth set on a number line.",
          markingScheme: [
            { step: "Venn diagram with Universal set U = 45, intersecting subsets F and T correctly labeled", mark: "B1" },
            { step: "Set equation: (28 - x) + x + (22 - x) + 5 = 45 => 55 - x = 45", mark: "M1" },
            { step: "x = 10 (Students studying both French and Twi)", mark: "A1" },
            { step: "Only French = 28 - 10 = 18; Only Twi = 22 - 10 = 12; Total studying only one = 30", mark: "M1" },
            { step: "Probability = 30 / 45 = 2/3 (or 0.67)", mark: "A1" },
            { step: "Clear fractions using LCM 12: 3(3x - 1) - 4(2x + 3) > 6", mark: "M1" },
            { step: "Expand carefully: 9x - 3 - 8x - 12 > 6 => x - 15 > 6", mark: "M1" },
            { step: "x > 21", mark: "A1" },
            { step: "Number line showing open circle at 21 with arrow pointing to the right", mark: "B1" }
          ],
          examinerPitfall: "Candidates frequently misapplied the negative sign across the second bracket in 4(2x + 3), writing -8x + 12 instead of -8x - 12, forfeiting 3 method marks."
        },
        {
          questionNumber: "Question 2 (Geometry & Construction)",
          topic: "Plane Geometry & Compass Construction",
          marks: 15,
          questionText: "(a) Using a ruler and a pair of compasses only, construct triangle ABC such that |AB| = 8 cm, angle ABC = 60° and |BC| = 7 cm.\n(b) Measure |AC| and find angle BAC.\n(c) Construct a perpendicular from C to meet AB at D and measure |CD|.",
          markingScheme: [
            { step: "Baseline AB = 8.0 cm (± 0.1 cm) with compass arc verification", mark: "B1" },
            { step: "Accurate compass construction of 60° at B using intersecting arcs", mark: "M1, A1" },
            { step: "Arc of 7.0 cm on BC ray to locate vertex C", mark: "A1" },
            { step: "Measurement |AC| = 7.5 cm (± 0.2 cm)", mark: "B1" },
            { step: "Perpendicular from point C intersecting AB at D with visible intersecting arcs", mark: "M1, A1" },
            { step: "|CD| = 6.1 cm (± 0.1 cm)", mark: "B1" }
          ],
          examinerPitfall: "Using protractors instead of compasses for 60° construction resulted in zero marks for that sub-step according to WAEC regulations."
        },
        {
          questionNumber: "Question 3 (Commercial Mathematics & Business)",
          topic: "Percentages, Cost & Profit",
          marks: 15,
          questionText: "A trader bought 120 tubers of yam for GH₵ 3,600. Transport costs amounted to GH₵ 400. During transit, 20 tubers were spoiled and discarded.\n(a) Calculate the total cost price per good tuber.\n(b) If she sold the remaining good tubers at GH₵ 55 each, calculate:\n(i) her total profit;\n(ii) her percentage profit on the total outlay.",
          markingScheme: [
            { step: "Total cost outlay = GH₵ 3,600 + GH₵ 400 = GH₵ 4,000", mark: "B1" },
            { step: "Good tubers remaining = 120 - 20 = 100 tubers", mark: "B1" },
            { step: "Cost price per good tuber = GH₵ 4,000 / 100 = GH₵ 40.00", mark: "M1, A1" },
            { step: "Total Selling Price = 100 x GH₵ 55 = GH₵ 5,500", mark: "M1, A1" },
            { step: "Total Profit = GH₵ 5,500 - GH₵ 4,000 = GH₵ 1,500", mark: "M1, A1" },
            { step: "Percentage Profit = (1,500 / 4,000) x 100% = 37.5%", mark: "M1, A1" }
          ],
          examinerPitfall: "Candidates often forgot to add the transport cost (GH₵ 400) to the purchase price when calculating total cost price, leading to an incorrect base."
        },
        {
          questionNumber: "Question 4 (Vectors & Bearings)",
          topic: "Vectors & Bearings",
          marks: 15,
          questionText: "Given vectors p = (4, -3) and q = (-2, 5):\n(a) Find vector r = 3p - 2q.\n(b) Calculate the magnitude |r| of vector r, leaving your answer in surd form.\n(c) A boat sails from port P on a bearing of 060° for 40 km to port Q. Draw a sketch and determine the eastward component of its displacement.",
          markingScheme: [
            { step: "3p = 3(4, -3) = (12, -9)", mark: "B1" },
            { step: "2q = 2(-2, 5) = (-4, 10)", mark: "B1" },
            { step: "r = (12 - (-4), -9 - 10) = (16, -19)", mark: "M1, A1" },
            { step: "Magnitude |r| = √(16^2 + (-19)^2) = √(256 + 361)", mark: "M1" },
            { step: "|r| = √617 units (approx 24.84)", mark: "A1" },
            { step: "Eastward component = 40 * sin(60°) = 40 * (√3 / 2) = 20√3 km (or 34.64 km)", mark: "M1, A1" }
          ],
          examinerPitfall: "Candidates frequently wrote coordinates (16, -19) as a row rather than column vector format, and mishandled negative subtraction (-9 - 10)."
        }
      ]
    },
    {
      id: "res-wassce-science-2024",
      paperCode: "WAEC-WASSCE-SCI-2024",
      examType: "WASSCE",
      examBody: "WAEC West Africa",
      title: "WASSCE Integrated Science (Theory & Practical Alternative) with Chief Examiner's Report",
      subject: "Integrated Science",
      year: 2024,
      gradeLevel: "SHS 3 / Final Year",
      duration: "2 Hours 30 Mins",
      totalMarks: 100,
      difficulty: "Advanced",
      downloadsCount: 620,
      rating: 5.0,
      topics: ["Genetics & Monohybrid Crosses", "Soil Conservation & Nitrogen Cycle", "Organic Chemistry (Esters & Saponification)", "Work, Energy & Machines", "Circulatory System"],
      description: "Authentic 2024 WASSCE Core Integrated Science question paper and official marking scheme. Covers monohybrid genetic crosses, saponification and esterification, soil conservation in Ghanaian agro-ecological zones, and mechanics.",
      chiefExaminerRemarks: "The overall standard of answers in biology and agricultural science was commendable. However, poor spelling of technical terms like 'heterozygous', 'saponification', and 'centripetal' cost otherwise strong candidates valuable marks.",
      questions: [
        {
          questionNumber: "Question 1 (Genetics & Cellular Biology)",
          topic: "Genetics & Cellular Biology",
          marks: 20,
          questionText: "(a) In humans, the allele for normal skin pigmentation (A) is dominant over the allele for albinism (a). A man who is heterozygous for skin pigmentation marries an albino woman.\n(i) By means of a genetic cross diagram, determine the genotypes and phenotypes of their expected offspring.\n(ii) What is the probability of them having an albino child?\n\n(b) State three adaptive features of the human erythrocyte (red blood cell) that facilitate oxygen transport.",
          markingScheme: [
            { step: "Parental phenotypes: Normal (carrier) male x Albino female", mark: "B1" },
            { step: "Parental genotypes: Aa x aa", mark: "B1" },
            { step: "Gametes: (A), (a) x (a), (a)", mark: "M1" },
            { step: "Punnett square correctly showing: Aa, Aa, aa, aa", mark: "M1" },
            { step: "Offspring genotypes: 2 Aa (heterozygous normal) : 2 aa (albino)", mark: "A1" },
            { step: "Probability of albino child = 2/4 = 50% or 0.5", mark: "A1" },
            { step: "Biconcave disc shape increases surface area to volume ratio for rapid gas diffusion", mark: "B1" },
            { step: "Absence of nucleus and mitochondria maximizes space for hemoglobin molecules", mark: "B1" },
            { step: "Flexible elastic membrane enables squeezing through narrow capillary vessels", mark: "B1" }
          ],
          examinerPitfall: "Candidates often failed to state the phenotype of the offspring, only writing the letters 'Aa' without specifying 'Carrier Normal'."
        },
        {
          questionNumber: "Question 2 (Chemistry - Esters & Saponification)",
          topic: "Organic Chemistry",
          marks: 20,
          questionText: "(a) What is esterification?\n(b) Write a balanced chemical equation for the reaction between ethanoic acid (CH3COOH) and ethanol (C2H5OH) in the presence of concentrated sulfuric acid.\n(c) State two physical properties of the ester produced.\n(d) Explain the process of saponification in local soap making in Ghana, naming the two primary raw materials used.",
          markingScheme: [
            { step: "Esterification definition: Chemical reaction between an alkanoic acid and an alkanol in the presence of an acid catalyst to produce an ester and water", mark: "B2" },
            { step: "Chemical Equation: CH3COOH + C2H5OH <==> CH3COOC2H5 + H2O (with conc H2SO4 over arrow)", mark: "M2, A1" },
            { step: "Properties: Sweet, fruity aroma; less dense than water; insoluble in water", mark: "B2" },
            { step: "Saponification: Alkaline hydrolysis of fats or oils using concentrated alkali (NaOH or KOH) to produce soap and glycerol", mark: "B2" },
            { step: "Raw materials: Palm oil / coconut oil / shea butter AND caustic soda (NaOH) / cocoa pod ash extract (KOH)", mark: "B2" }
          ],
          examinerPitfall: "Omitting the reversible arrows or the concentrated H2SO4 catalyst in the esterification equation cost candidates 2 marks."
        },
        {
          questionNumber: "Question 3 (Agricultural Science & Soil Conservation)",
          topic: "Soil Conservation & Nitrogen Cycle",
          marks: 20,
          questionText: "(a) Differentiate between soil structure and soil texture.\n(b) Explain how the following practices deplete soil fertility:\n(i) Continuous clean clearing;\n(ii) Indiscriminate bush burning.\n(c) Describe the role of Rhizobium bacteria in the root nodules of leguminous plants.",
          markingScheme: [
            { step: "Soil texture: Relative proportions of sand, silt, and clay particles in soil (cannot be changed easily)", mark: "B2" },
            { step: "Soil structure: Arrangement of soil particles into aggregates or peds (can be modified by management)", mark: "B2" },
            { step: "Continuous clean clearing exposes topsoil to direct sun and torrential raindrops causing leaching, crusting, and severe sheet erosion", mark: "B2" },
            { step: "Bush burning destroys soil organic matter (humus), volatilizes nitrogen and sulfur as gases, and kills beneficial soil micro-organisms", mark: "B2" },
            { step: "Rhizobium fixes atmospheric nitrogen (N2) into nitrates/ammonium ions in exchange for carbohydrates from host legume (symbiosis)", mark: "M1, A2" }
          ],
          examinerPitfall: "Confusing soil texture with soil structure was a widespread error noted across both rural and urban examination centers."
        }
      ]
    },
    {
      id: "res-bece-english-2024",
      paperCode: "WAEC-BECE-ENG-2024",
      examType: "BECE",
      examBody: "WAEC Ghana",
      title: "WAEC BECE English Language (Essay, Comprehension & Literature) with Grading Rubric",
      subject: "English Language",
      year: 2024,
      gradeLevel: "JHS 3 / Basic 9",
      duration: "1 Hour 45 Mins",
      totalMarks: 100,
      difficulty: "Standard",
      downloadsCount: 535,
      rating: 4.8,
      topics: ["Formal Letter to DCE/MCE", "Summary Writing", "Contextual Vocabulary", "Grammatical Concord", "Oral English Rhymes"],
      description: "Complete 2024 BECE English Language examination guide containing Model Grade 1 essays (Formal letter on community infrastructure and narrative essay), comprehension breakdown, and detailed rubric for Content (10), Organization (10), Expression (10), and Mechanical Accuracy (10).",
      chiefExaminerRemarks: "Mechanical accuracy remains the main obstacle for many candidates. Comma splices, lack of subject-verb agreement, and poor paragraphing reduced essay scores. Candidates who read widely produced rich idiomatic expressions.",
      questions: [
        {
          questionNumber: "Question 1 (Section A - Continuous Writing: Formal Letter)",
          topic: "Formal Letter to Civic Authorities",
          marks: 40,
          questionText: "Write a letter to your District Chief Executive (DCE) pointing out at least three major environmental challenges facing your community and suggesting two practical ways they can be resolved.",
          markingScheme: [
            { step: "Format: Two addresses (Writer's top right, DCE's top left), Date, Salutation ('Dear Sir/Madam'), Title in Capital or Underlined", mark: "4 Marks" },
            { step: "Content: Well-developed discussion of at least 3 distinct challenges (indiscriminate plastic waste, choked gutters, open defecation)", mark: "10 Marks" },
            { step: "Solutions: 2 realistic, practical community-level recommendations with youth and municipal participation", mark: "6 Marks" },
            { step: "Organization: Coherent paragraphs with smooth transitional markers and logical problem-solution flow", mark: "10 Marks" },
            { step: "Expression & Vocabulary: Formal register, apt civic diction, varied sentence structures without slang or text contractions", mark: "10 Marks" }
          ],
          examinerPitfall: "Using informal conversational closings like 'Yours sincerely' followed by a first name only, instead of 'Yours faithfully' followed by signature and full name."
        },
        {
          questionNumber: "Question 2 (Section B - Reading Comprehension)",
          topic: "Reading Comprehension & In-Context Vocabulary",
          marks: 30,
          questionText: "Read the excerpt on solar technology in rural Ghana and answer the questions:\n\n'For decades, villagers in Nyamebekyere depended on kerosene lamps whose toxic fumes triggered respiratory illnesses. The advent of affordable photovoltaic solar panels transformed the settlement. Children studied late into the evening without burning eyes, while petty traders chilled perishable fish.'\n\n(a) What adverse effect did kerosene lamps have on the villagers?\n(b) State two benefits that the introduction of solar panels brought to the community.\n(c) For each of the following words, find a word or phrase that means the same and can replace it in the passage: (i) advent; (ii) transformed; (iii) perishable.",
          markingScheme: [
            { step: "(a) Emitted toxic fumes that triggered respiratory illnesses / diseases", mark: "4 Marks" },
            { step: "(b) Benefit 1: Children could study late into the evening safely without eye irritation", mark: "3 Marks" },
            { step: "(b) Benefit 2: Petty traders could preserve and chill perishable fish for longer sales", mark: "3 Marks" },
            { step: "(c)(i) advent = arrival / introduction / appearance / coming", mark: "2 Marks" },
            { step: "(c)(ii) transformed = changed / revolutionized / remodeled", mark: "2 Marks" },
            { step: "(c)(iii) perishable = easily spoiled / decaying / short-lived", mark: "2 Marks" }
          ],
          examinerPitfall: "Candidates often copied whole chunks of the passage instead of providing concise, grammatically correct sentences."
        },
        {
          questionNumber: "Question 3 (Section C - Literature & Oral Phonology)",
          topic: "Poetic Devices & English Rhyme Schemes",
          marks: 30,
          questionText: "(a) From the list of words lettered A to D, choose the word that has the SAME vowel sound as the one represented by the underlined letter(s):\n(i) b_oo_k: A. pool, B. look, C. food, D. room.\n(ii) ph_o_ne: A. gone, B. bone, C. done, D. one.\n\n(b) Identify the figure of speech in: 'The morning sun smiled gently upon the fertile valley.'\n(c) What is the rhyme scheme of a standard Shakespearean sonnet quatrain?",
          markingScheme: [
            { step: "(a)(i) look (/ʊ/ short vowel sound)", mark: "2 Marks" },
            { step: "(a)(ii) bone (/əʊ/ diphthong sound)", mark: "2 Marks" },
            { step: "(b) Personification (attributing human quality of smiling to the inanimate sun)", mark: "3 Marks" },
            { step: "(c) ABAB rhyme scheme", mark: "3 Marks" }
          ],
          examinerPitfall: "Confusing short vowel /ʊ/ (book, look) with long vowel /uː/ (pool, food)."
        }
      ]
    },
    {
      id: "res-wassce-math-2023",
      paperCode: "WAEC-WASSCE-MATH-2023",
      examType: "WASSCE",
      examBody: "WAEC West Africa",
      title: "WASSCE Core Mathematics Paper 2 (Theory) with Step-by-Step Marking Guide",
      subject: "Mathematics",
      year: 2023,
      gradeLevel: "SHS 3",
      duration: "2 Hours 30 Mins",
      totalMarks: 100,
      difficulty: "Advanced",
      downloadsCount: 745,
      rating: 5.0,
      topics: ["Trigonometric Graphs & Functions", "Cumulative Frequency (Ogive)", "Circle Theorems & Angle Proofs", "Matrices & Transformations", "Mensuration & Volume"],
      description: "Detailed model solutions to the 2023 WASSCE Core Mathematics exam with full calculation workings, circle geometry angle proofs, and cumulative frequency curve plotting guidelines.",
      chiefExaminerRemarks: "Candidates generally performed well on statistics and algebraic simplification, but struggled with circle theorem justifications where reasons (e.g., 'angle in alternate segment', 'angles on same chord') were omitted.",
      questions: [
        {
          questionNumber: "Question 1 (Statistics & Cumulative Frequency Curve)",
          topic: "Statistics & Ogive Curves",
          marks: 15,
          questionText: "The marks scored by 50 students in a mock exam are grouped as follows: 20-29 (3), 30-39 (6), 40-49 (11), 50-59 (15), 60-69 (9), 70-79 (4), 80-89 (2).\n(a) Construct a cumulative frequency table for the distribution.\n(b) Draw an ogive for the distribution.\n(c) Use your graph to estimate: (i) the median mark; (ii) the semi-interquartile range; (iii) the pass mark if 60% of candidates passed.",
          markingScheme: [
            { step: "Upper class boundaries correctly calculated: 29.5, 39.5, 49.5, 59.5, 69.5, 79.5, 89.5", mark: "B1" },
            { step: "Cumulative frequencies calculated: 3, 9, 20, 35, 44, 48, 50", mark: "B1" },
            { step: "Linear scale chosen and labeled on graph sheet", mark: "S1" },
            { step: "Points plotted accurately at upper class boundaries", mark: "P2" },
            { step: "Smooth continuous S-curve (ogive) drawn through points from (19.5, 0)", mark: "C1" },
            { step: "Median read at N/2 = 25th position => Mark = 53.0 (± 1.0)", mark: "M1, A1" },
            { step: "Q1 at 12.5 => 42.5; Q3 at 37.5 => 62.0; Semi-IQR = (62 - 42.5) / 2 = 9.75", mark: "M1, A1" }
          ],
          examinerPitfall: "Plotting cumulative frequencies against class midpoints instead of upper class boundaries forfeits all 4 graph plotting marks."
        },
        {
          questionNumber: "Question 2 (Circle Geometry & Theorems)",
          topic: "Circle Theorems",
          marks: 15,
          questionText: "In a circle with center O, chords AB and CD intersect at right angles at point X inside the circle.\n(a) If angle XAD = 35°, find:\n(i) angle ADX;\n(ii) angle BCD;\n(iii) angle BOD.\nState clearly the geometric reason for each step.",
          markingScheme: [
            { step: "In triangle AXD, angle AXD = 90° (given intersection at right angles)", mark: "B1" },
            { step: "Angle ADX = 180° - (90° + 35°) = 55° (sum of angles in a triangle = 180°)", mark: "M1, A1" },
            { step: "Angle BCD = angle BAD = 35° (angles subtended by the same arc BD in the same segment are equal)", mark: "M1, A1" },
            { step: "Angle BOD = 2 * angle BCD = 2 * 35° = 70° (angle subtended by arc at center is twice angle at circumference)", mark: "M1, A1" }
          ],
          examinerPitfall: "Candidates calculated correct numerical values but lost 50% of the marks by failing to state geometric reasons in parentheses."
        },
        {
          questionNumber: "Question 3 (Matrices & Simultaneous Equations)",
          topic: "Matrices & Linear Algebra",
          marks: 15,
          questionText: "(a) Given the matrix M = [[3, -2], [5, 4]]:\n(i) Find the determinant of M.\n(ii) Find the inverse matrix M^-1.\n(b) Hence, solve the simultaneous equations using matrix methods:\n3x - 2y = 12\n5x + 4y = 42",
          markingScheme: [
            { step: "Det(M) = (3 * 4) - (-2 * 5) = 12 - (-10) = 22", mark: "M1, A1" },
            { step: "Adjugate matrix = [[4, 2], [-5, 3]]", mark: "M1" },
            { step: "M^-1 = (1/22) * [[4, 2], [-5, 3]]", mark: "A1" },
            { step: "Matrix equation: [[x], [y]] = (1/22) * [[4, 2], [-5, 3]] * [[12], [42]]", mark: "M1" },
            { step: "Top: 4(12) + 2(42) = 48 + 84 = 132 => x = 132 / 22 = 6", mark: "A1" },
            { step: "Bottom: -5(12) + 3(42) = -60 + 126 = 66 => y = 66 / 22 = 3", mark: "A1" }
          ],
          examinerPitfall: "Sign error when calculating determinant: writing 12 - 10 = 2 instead of 12 - (-10) = 22."
        }
      ]
    },
    {
      id: "res-cie-igcse-math-2024",
      paperCode: "CIE-IGCSE-0580-2024",
      examType: "Cambridge IGCSE",
      examBody: "Cambridge Assessment (CIE)",
      title: "Cambridge IGCSE Mathematics (Extended 0580 Paper 4) with Examiner Report",
      subject: "Mathematics",
      year: 2024,
      gradeLevel: "Year 10 - 11 / Form 4 - 5",
      duration: "2 Hours 30 Mins",
      totalMarks: 130,
      difficulty: "Advanced",
      downloadsCount: 395,
      rating: 4.9,
      topics: ["Calculus & Rate of Change", "3D Trigonometry & Bearings", "Functions & Inverses", "Probability Trees", "Vectors in 2D"],
      description: "Official Cambridge CIE Extended Mathematics Paper 42 examination paper, published mark scheme with M, A, and B marks breakdown, and Examiner Commentary from the May/June 2024 series.",
      chiefExaminerRemarks: "Careless truncation of recurring decimals instead of rounding to 3 significant figures was penalized across questions involving trigonometry and speed calculations.",
      questions: [
        {
          questionNumber: "Question 1 (Functions & Differentiation)",
          topic: "Calculus & Derivatives",
          marks: 12,
          questionText: "A curve has equation y = 2x^3 - 9x^2 + 12x - 3.\n(a) Find dy/dx.\n(b) Find the coordinates of the two turning points on the curve.\n(c) Determine whether each turning point is a maximum or a minimum by evaluating d2y/dx2.",
          markingScheme: [
            { step: "Differentiate term by term: dy/dx = 6x^2 - 18x + 12", mark: "M1, A1" },
            { step: "Set dy/dx = 0: 6(x^2 - 3x + 2) = 0 => (x - 1)(x - 2) = 0", mark: "M1" },
            { step: "x = 1: y = 2(1) - 9(1) + 12(1) - 3 = 2 => (1, 2)", mark: "A1" },
            { step: "x = 2: y = 2(8) - 9(4) + 12(2) - 3 = 1 => (2, 1)", mark: "A1" },
            { step: "Second derivative: d2y/dx2 = 12x - 18", mark: "M1" },
            { step: "At x = 1: 12(1) - 18 = -6 < 0 => (1, 2) is a Local Maximum", mark: "A1" },
            { step: "At x = 2: 12(2) - 18 = +6 > 0 => (2, 1) is a Local Minimum", mark: "A1" }
          ],
          examinerPitfall: "Stopping at the x-values and forgetting to calculate the corresponding y-coordinates of the turning points."
        },
        {
          questionNumber: "Question 2 (Probability Tree Diagrams)",
          topic: "Probability & Conditional Outcomes",
          marks: 12,
          questionText: "Bag A contains 4 red balls and 3 green balls. Bag B contains 2 red balls and 5 green balls. A ball is drawn at random from Bag A and placed into Bag B. A ball is then drawn at random from Bag B.\n(a) Draw a fully labeled tree diagram.\n(b) Find the probability that both balls drawn are of the same color.\n(c) Given that the ball drawn from Bag B is red, find the probability that the ball drawn from Bag A was red.",
          markingScheme: [
            { step: "Tree diagram first branch: P(Red A) = 4/7, P(Green A) = 3/7", mark: "B1" },
            { step: "Second branch if Red from A: Bag B has 3 Red, 5 Green => P(Red B) = 3/8, P(Green B) = 5/8", mark: "B1" },
            { step: "Second branch if Green from A: Bag B has 2 Red, 6 Green => P(Red B) = 2/8, P(Green B) = 6/8", mark: "B1" },
            { step: "P(Same color) = (4/7 * 3/8) + (3/7 * 6/8) = (12/56) + (18/56) = 30/56 = 15/28", mark: "M1, A1" },
            { step: "P(Red B) = (4/7 * 3/8) + (3/7 * 2/8) = 12/56 + 6/56 = 18/56", mark: "M1" },
            { step: "Conditional P(Red A | Red B) = (12/56) / (18/56) = 12/18 = 2/3 (or 0.667)", mark: "M1, A1" }
          ],
          examinerPitfall: "Forgetting to increase the total number of balls in Bag B from 7 to 8 after transferring from Bag A."
        }
      ]
    },
    {
      id: "res-cie-alevel-physics-2023",
      paperCode: "CIE-9702-PHYS-2023",
      examType: "Cambridge A-Levels",
      examBody: "Cambridge Assessment (CIE)",
      title: "Cambridge International A-Level Physics (9702 Paper 4 Structured Questions)",
      subject: "Physics",
      year: 2023,
      gradeLevel: "Year 12 - 13 / Sixth Form",
      duration: "2 Hours",
      totalMarks: 100,
      difficulty: "Advanced",
      downloadsCount: 285,
      rating: 4.9,
      topics: ["Gravitational & Electric Fields", "Capacitance & AC Circuits", "Quantum Physics & Photons", "Nuclear Decay", "Medical Imaging Ultrasound"],
      description: "Cambridge International AS & A Level Physics Paper 4 A2 Structured Questions with complete derivation steps, formula applications, and grade thresholds for A* matriculation.",
      chiefExaminerRemarks: "Definitions must be quoted verbatim as stated in the syllabus. For example, 'capacitance is the charge stored per unit potential difference', not 'how much charge a plate holds'.",
      questions: [
        {
          questionNumber: "Question 1 (Electric Fields & Potential)",
          topic: "Electric Fields & Potential",
          marks: 10,
          questionText: "(a) Define electric potential at a point in an electric field.\n(b) An isolated solid metal sphere of radius 15 cm is charged to a potential of +4000 V in a vacuum. Calculate:\n(i) the charge on the sphere;\n(ii) the electric field strength at the surface of the sphere.",
          markingScheme: [
            { step: "Work done per unit positive charge in bringing a small test charge from infinity to that point", mark: "B2" },
            { step: "Formula: V = Q / (4πε0 * r) => Q = 4πε0 * r * V", mark: "C1" },
            { step: "Q = 4 * π * (8.85 x 10^-12) * 0.15 * 4000 = 6.67 x 10^-8 C (or 66.7 nC)", mark: "A1" },
            { step: "Formula: E = V / r (for spherical conductor surface) or Q / (4πε0 * r^2)", mark: "C1" },
            { step: "E = 4000 / 0.15 = 2.67 x 10^4 V/m (or N/C)", mark: "A1" }
          ],
          examinerPitfall: "Leaving radius in centimeters (15) instead of converting to meters (0.15), throwing calculation off by two orders of magnitude."
        },
        {
          questionNumber: "Question 2 (Quantum Physics & Photoelectric Effect)",
          topic: "Photons & Photoelectric Effect",
          marks: 10,
          questionText: "(a) State what is meant by work function energy of a metal surface.\n(b) Light of wavelength 380 nm is incident on a sodium surface having work function 2.28 eV. Calculate:\n(i) the photon energy in electron-volts;\n(ii) the maximum kinetic energy of emitted photoelectrons in Joules;\n(iii) the de Broglie wavelength of an electron having this maximum kinetic energy.",
          markingScheme: [
            { step: "Work function: Minimum energy required to liberate an electron from the surface of a metal", mark: "B1" },
            { step: "E = hc / λ = (6.63 x 10^-34 * 3.0 x 10^8) / (380 x 10^-9) = 5.23 x 10^-19 J", mark: "M1" },
            { step: "In eV: 5.23 x 10^-19 / (1.6 x 10^-19) = 3.27 eV", mark: "A1" },
            { step: "K_max = E - Φ = 3.27 - 2.28 = 0.99 eV = 0.99 * 1.6 x 10^-19 = 1.58 x 10^-19 J", mark: "M1, A1" },
            { step: "Momentum p = √(2 * m * K) = √(2 * 9.11 x 10^-31 * 1.58 x 10^-19) = 5.37 x 10^-25 kg m/s", mark: "M1" },
            { step: "λ = h / p = 6.63 x 10^-34 / (5.37 x 10^-25) = 1.23 x 10^-9 m (1.23 nm)", mark: "A1" }
          ],
          examinerPitfall: "Failing to convert electron-volts to Joules before calculating momentum or using Planck's constant in Joules."
        }
      ]
    },
    {
      id: "res-bece-social-2024",
      paperCode: "WAEC-BECE-SOC-2024",
      examType: "BECE",
      examBody: "WAEC Ghana",
      title: "WAEC BECE Social Studies (Environment, Government & Economy) with Model Answers",
      subject: "Social Studies",
      year: 2024,
      gradeLevel: "JHS 3 / Basic 9",
      duration: "1 Hour 45 Mins",
      totalMarks: 100,
      difficulty: "Standard",
      downloadsCount: 415,
      rating: 4.7,
      topics: ["1992 Fourth Republican Constitution", "Galamsey & Water Pollution", "Tourism in Ghana", "Human Resource Development", "Separation of Powers"],
      description: "Model answers covering environmental challenges (Illegal gold mining/Galamsey and Pra/Birim river pollution), the 1992 Fourth Republican Constitution, and state revenue mobilization.",
      chiefExaminerRemarks: "Candidates provided clear explanations on environmental degradation, but were weaker on constitutional functions of the Council of State and CHRAJ.",
      questions: [
        {
          questionNumber: "Question 1 (Section B - The Environment & Resources)",
          topic: "Environmental Conservation & Galamsey",
          marks: 20,
          questionText: "(a) What is environmental degradation?\n(b) Explain four harmful effects of illegal small-scale mining (Galamsey) on the socio-economic life of Ghanaians.\n(c) Suggest two practical measures the government can implement to restore degraded lands.",
          markingScheme: [
            { step: "Definition: The deterioration of the environment through depletion of resources such as air, water, soil and vegetation", mark: "4 Marks" },
            { step: "Destruction of agricultural farmlands and cocoa plantations reducing food security and farmers' income", mark: "3 Marks" },
            { step: "Severe pollution of major water bodies (River Pra, Ankobra, Offin) with heavy metals (mercury, cyanide) increasing cost of water treatment for Ghana Water Company", mark: "3 Marks" },
            { step: "Destruction of forest reserves and loss of biodiversity", mark: "3 Marks" },
            { step: "Increase in school dropouts among youth drawn to quick cash from mining pits", mark: "3 Marks" },
            { step: "Enforcing tree-planting reclamation projects (Green Ghana) on abandoned mining concessions", mark: "2 Marks" },
            { step: "Strict prosecution of illegal mining syndicates and deploying river-guard taskforces", mark: "2 Marks" }
          ],
          examinerPitfall: "Listing points without explanation (e.g. just writing 'Water' instead of explaining how water pollution increases treatment costs)."
        },
        {
          questionNumber: "Question 2 (Section C - Governance & Politics)",
          topic: "The 1992 Fourth Republican Constitution",
          marks: 20,
          questionText: "(a) State three reasons why the 1992 Constitution provides for the Separation of Powers.\n(b) State two functions of each of the following arms of government in Ghana:\n(i) The Executive;\n(ii) The Legislature;\n(iii) The Judiciary.",
          markingScheme: [
            { step: "Prevents tyranny and dictatorial rule by ensuring no single organ possesses absolute power", mark: "3 Marks" },
            { step: "Protects fundamental human rights and civil liberties of citizens", mark: "3 Marks" },
            { step: "Promotes checks and balances where organs inspect and moderate each other", mark: "3 Marks" },
            { step: "Executive: Enforces laws made by Parliament; manages national security and foreign policy", mark: "4 Marks" },
            { step: "Legislature: Debates and enacts bills into laws; approves national budget and loans", mark: "4 Marks" },
            { step: "Judiciary: Interprets the Constitution; resolves legal disputes and dispenses justice", mark: "3 Marks" }
          ],
          examinerPitfall: "Confusing the function of 'making laws' (Legislature) with 'enforcing laws' (Executive)."
        }
      ]
    },
    {
      id: "res-ges-nsat-class4-2024",
      paperCode: "GES-NSAT-B4-2024",
      examType: "GES National Assessment",
      examBody: "GES / NaCCA Ghana",
      title: "GES National Standardized Assessment Test (NSAT) - Basic 4 Numeracy & Literacy",
      subject: "Numeracy & Literacy",
      year: 2024,
      gradeLevel: "Primary Class 4 / Basic 4",
      duration: "1 Hour 15 Mins",
      totalMarks: 60,
      difficulty: "Foundation",
      downloadsCount: 350,
      rating: 4.8,
      topics: ["Foundational Numeracy", "Reading Fluency", "Basic Fractions", "Comprehension Passages", "Measurement & Time"],
      description: "Ministry of Education and Ghana Education Service foundational assessment test administered across public and private schools in Ghana to assess reading proficiency and numeracy benchmarks.",
      chiefExaminerRemarks: "Significant improvement in reading fluency observed nationwide. Word problem interpretation in numeracy requires continuous scaffolding.",
      questions: [
        {
          questionNumber: "Part 1: Numeracy (Fractions & Measurement)",
          topic: "Foundational Fractions",
          marks: 10,
          questionText: "Kofi has a piece of ribbon 24 meters long. He gives 1/4 of it to his sister Akosua and 1/3 of it to his brother Yaw. How many meters of ribbon does Kofi have left?",
          markingScheme: [
            { step: "Akosua's share = 1/4 of 24 = 6 meters", mark: "B1" },
            { step: "Yaw's share = 1/3 of 24 = 8 meters", mark: "B1" },
            { step: "Total given out = 6 + 8 = 14 meters", mark: "M1" },
            { step: "Ribbon remaining = 24 - 14 = 10 meters", mark: "A1" }
          ],
          examinerPitfall: "Adding the fractions (1/4 + 1/3 = 7/12) without calculating the physical meter values."
        },
        {
          questionNumber: "Part 2: Literacy & Reading Comprehension",
          topic: "Reading Fluency",
          marks: 10,
          questionText: "Read the story and answer:\n\n'Ama planted five bean seeds in a moist cup. Every morning, she placed the cup where the morning sunlight could touch it. On the fifth day, green tiny shoots poked out of the dark soil. Ama smiled and watered them.'\n\n1. How many bean seeds did Ama plant?\n2. Where did she put the cup each morning?\n3. What happened on the fifth day?",
          markingScheme: [
            { step: "1. Ama planted five (5) bean seeds", mark: "B1" },
            { step: "2. She put the cup where morning sunlight could touch it", mark: "B1" },
            { step: "3. Tiny green shoots poked out of the dark soil", mark: "B1" }
          ],
          examinerPitfall: "Answering with incomplete one-word responses instead of full simple sentences."
        }
      ]
    },
    {
      id: "res-wassce-bio-2025",
      paperCode: "WAEC-WASSCE-BIO-2025",
      examType: "WASSCE",
      examBody: "WAEC West Africa",
      title: "2025 WAEC WASSCE Biology Mock Examination with Model Marking Scheme",
      subject: "Biology",
      year: 2025,
      gradeLevel: "SHS 3",
      duration: "2 Hours 30 Mins",
      totalMarks: 100,
      difficulty: "Advanced",
      downloadsCount: 140,
      rating: 5.0,
      topics: ["Photosynthesis & Light Reactions", "Homeostasis & Thermoregulation", "Enzyme Kinetics & Inhibitors", "Osmoregulation"],
      description: "Curated 2025 model examination paper for WASSCE Biology candidates. Features biochemical energy transformations, homeostasis feedback loops, and enzymatic reactions.",
      chiefExaminerRemarks: "Candidates must write out complete word equations before chemical abbreviations, and clearly distinguish negative feedback from positive feedback mechanisms.",
      questions: [
        {
          questionNumber: "Question 1 (Photosynthesis & Biochemical Reactions)",
          topic: "Photosynthesis & Photolysis",
          marks: 20,
          questionText: "(a) Explain the light-dependent reactions of photosynthesis and outline the formation of NADPH and ATP.\n(b) Differentiate between cyclic and non-cyclic photophosphorylation.",
          markingScheme: [
            { step: "Absorption of light photons by chlorophyll pigment molecules in Photosystem II", mark: "B2" },
            { step: "Photolysis of water yielding H+ protons, electrons, and oxygen gas: 2H2O -> 4H+ + 4e- + O2", mark: "M2, A1" },
            { step: "Transfer of electrons along the cytochrome thylakoid membrane generating a proton gradient", mark: "M2" },
            { step: "Proton flow through ATP synthase synthesizing ATP from ADP and inorganic phosphate", mark: "A2" },
            { step: "Reduction of NADP+ to NADPH catalyzed by ferredoxin-NADP+ reductase at Photosystem I", mark: "A2" },
            { step: "Cyclic involves only Photosystem I and produces ATP only without photolysis", mark: "B3" },
            { step: "Non-cyclic involves both PSI and PSII, produces both ATP and NADPH, and requires photolysis of water", mark: "B3" }
          ],
          examinerPitfall: "Candidates often state that water is split by sunlight directly, rather than through light-activated enzymes and chlorophyll pigments in PSII."
        },
        {
          questionNumber: "Question 2 (Homeostasis & Thermoregulation)",
          topic: "Homeostasis",
          marks: 20,
          questionText: "Describe the physiological responses of the human skin when the core body temperature drops below 37°C.",
          markingScheme: [
            { step: "Vasoconstriction: Arterioles in the dermis constrict, reducing blood flow to superficial capillary loops to minimize heat radiation", mark: "B3" },
            { step: "Piloerection: Arrector pili muscles contract, erecting hairs to trap an insulating layer of still air against the skin surface", mark: "B3" },
            { step: "Inhibition of sweat glands: Sweat production ceases, eliminating cooling through evaporation", mark: "B2" },
            { step: "Shivering: Rapid involuntary skeletal muscle contractions generate metabolic heat", mark: "B2" }
          ],
          examinerPitfall: "Writing that 'capillaries move deeper into the skin' instead of 'arterioles constrict reducing blood flow to surface capillaries'."
        }
      ]
    }
  ];
}

function getInitialUsers() {
  return [
    {
      id: "usr-admin-gis",
      name: "Dr. Mary Ashun",
      email: "admin@gis.edu.gh",
      phone: "+233244318900",
      role: "school_admin",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School",
      title: "Head of School & Executive Administrator",
      password: "AdminPass2026!",
      verified: true,
      avatar: "👩‍🏫",
      createdAt: "2026-01-10T08:00:00Z"
    },
    {
      id: "usr-admin-sos",
      name: "Mr. Israel Titi-Ofei",
      email: "head@sos-hgic.edu.gh",
      phone: "+233243128844",
      role: "school_admin",
      schoolId: "sch-sos-tema",
      schoolName: "SOS-Hermann Gmeiner International College",
      title: "Principal & College Director",
      password: "AdminPass2026!",
      verified: true,
      avatar: "👨‍🏫",
      createdAt: "2026-01-12T09:30:00Z"
    },
    {
      id: "usr-admin-morningstar",
      name: "Mrs. Elizabeth Baidoo",
      email: "admin@morningstar.edu.gh",
      phone: "+233244112233",
      role: "school_admin",
      schoolId: "sch-morning-star-cantonments",
      schoolName: "Morning Star School",
      title: "Proprietress & Managing Director",
      password: "AdminPass2026!",
      verified: true,
      avatar: "👩‍💼",
      createdAt: "2026-01-15T11:00:00Z"
    },
    {
      id: "usr-parent-nana-aba",
      name: "Mrs. Nana Aba Mensah",
      email: "parent@gmail.com",
      phone: "+233244987654",
      role: "parent",
      title: "Parent / Primary Guardian",
      password: "ParentPass2026!",
      verified: true,
      avatar: "👩‍👧",
      wards: [
        { name: "Kwame Mensah", targetGrade: "JHS 1", applicationRef: "SD-ADM-2026-9139" }
      ],
      createdAt: "2026-02-01T14:20:00Z"
    },
    {
      id: "usr-teacher-emmanuel",
      name: "Mr. Emmanuel Addo",
      email: "tutor@schooldirect.com",
      phone: "+233244556677",
      role: "teacher",
      teacherProfileId: "tch-1",
      subjectSpecialty: "Physics & Core Mathematics",
      title: "Lead Cambridge & WASSCE STEM Specialist",
      password: "TeacherPass2026!",
      verified: true,
      avatar: "👨‍🏫",
      createdAt: "2026-02-05T10:15:00Z"
    },
    {
      id: "usr-super-admin",
      name: "SchoolDirect Systems Lead",
      email: "superadmin@schooldirect.gh",
      phone: "+233501234567",
      role: "super_admin",
      title: "Platform Infrastructure & Security Administrator",
      password: "SuperSecure2026!",
      verified: true,
      avatar: "🛡️",
      createdAt: "2026-01-01T00:00:00Z"
    }
  ];
}


function getInitialInvoices() {
  return [
    {
      id: "inv-gis-2026-kwame",
      invoiceNumber: "GIS-INV-2026-1048",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      studentName: "Kwame Mensah",
      studentGrade: "Primary (Class 5)",
      parentName: "Mrs. Nana Aba Mensah",
      parentEmail: "parent@gmail.com",
      parentPhone: "+233244987654",
      term: "Term 1 - 2026/2027 Academic Year",
      issueDate: "2026-10-01",
      dueDate: "2026-11-20",
      status: "Partially Paid",
      currency: "GHS",
      lineItems: [
        { description: "Tuition & Core Instruction (Class 5)", amount: 9500 },
        { description: "PTA Development & Campus Security Levy", amount: 350 },
        { description: "ICT & Cambridge Science Laboratory Access", amount: 600 },
        { description: "Library, Cambridge E-Books & Online Subscriptions", amount: 250 },
        { description: "Term 1 Nutritious Hot Lunch & Snack Program", amount: 1200 }
      ],
      totalAmount: 11900,
      amountPaid: 6000,
      balanceDue: 5900,
      paymentHistory: [
        {
          id: "pay-momo-8491",
          amount: 6000,
          method: "MTN Mobile Money",
          momoNumber: "0244987654",
          transactionRef: "GH-MM-94827103",
          date: "2026-10-15T11:20:00Z",
          receiptNumber: "GIS-REC-2026-401",
          payerName: "Mrs. Nana Aba Mensah",
          notes: "1st Term Installment - MoMo Approved"
        }
      ]
    },
    {
      id: "inv-gis-2026-selorm",
      invoiceNumber: "GIS-INV-2026-1049",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      studentName: "Selorm Kpodo",
      studentGrade: "Primary (Class 3)",
      parentName: "Dr. Kofi Kpodo",
      parentEmail: "k.kpodo@health.gov.gh",
      parentPhone: "+233244229988",
      term: "Term 1 - 2026/2027 Academic Year",
      issueDate: "2026-10-01",
      dueDate: "2026-11-15",
      status: "Paid",
      currency: "GHS",
      lineItems: [
        { description: "Tuition & Core Instruction (Class 3)", amount: 8800 },
        { description: "PTA Development Levy", amount: 350 },
        { description: "Robotics & STEM Lab Fee", amount: 450 },
        { description: "French & Modern Languages Immersion", amount: 300 },
        { description: "Annual Sports & Swimming Club Fee", amount: 800 }
      ],
      totalAmount: 10700,
      amountPaid: 10700,
      balanceDue: 0,
      paymentHistory: [
        {
          id: "pay-momo-8490",
          amount: 10700,
          method: "Telecel Cash",
          momoNumber: "0209887766",
          transactionRef: "TC-PAY-8839210",
          date: "2026-10-05T09:14:00Z",
          receiptNumber: "GIS-REC-2026-389",
          payerName: "Dr. Kofi Kpodo",
          notes: "Full Term Tuition - Telecel Cash"
        }
      ]
    },
    {
      id: "inv-gis-2026-ama",
      invoiceNumber: "GIS-INV-2026-1050",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      studentName: "Ama Serwaa Prempeh",
      studentGrade: "Form 1 (Cambridge IGCSE)",
      parentName: "Osei Prempeh",
      parentEmail: "oprempeh@ashanti-cocoa.com",
      parentPhone: "+233201122334",
      term: "Term 1 - 2026/2027 Academic Year",
      issueDate: "2026-10-01",
      dueDate: "2026-11-25",
      status: "Unpaid",
      currency: "GHS",
      lineItems: [
        { description: "Senior Secondary Tuition & IGCSE Lab Syllabus", amount: 11500 },
        { description: "PTA Development & Campus Security Levy", amount: 350 },
        { description: "Cambridge Practical Science Chemicals & Specimens", amount: 750 },
        { description: "Digital Tablet Learning & E-Curriculum Access", amount: 900 }
      ],
      totalAmount: 13500,
      amountPaid: 0,
      balanceDue: 13500,
      paymentHistory: []
    },
    {
      id: "inv-sos-2026-abena",
      invoiceNumber: "SOS-INV-2026-892",
      schoolId: "sch-sos-tema",
      schoolName: "SOS-Hermann Gmeiner International College",
      studentName: "Abena Ofori-Atta",
      studentGrade: "IB Diploma Year 1",
      parentName: "Ken Ofori-Atta",
      parentEmail: "kofori@finance.gov.gh",
      parentPhone: "+233244889900",
      term: "Term 1 - 2026/2027 Academic Year",
      issueDate: "2026-10-01",
      dueDate: "2026-11-20",
      status: "Partially Paid",
      currency: "GHS",
      lineItems: [
        { description: "IB Diploma Tuition & Laboratory Research", amount: 14500 },
        { description: "Boarding House Residence, Utility & Care", amount: 3000 },
        { description: "CAS Community Action & Sports Dues", amount: 1000 }
      ],
      totalAmount: 18500,
      amountPaid: 10000,
      balanceDue: 8500,
      paymentHistory: [
        {
          id: "pay-momo-8488",
          amount: 10000,
          method: "MTN Mobile Money",
          momoNumber: "0244889900",
          transactionRef: "GH-MM-7729104",
          date: "2026-10-10T14:30:00Z",
          receiptNumber: "SOS-REC-2026-112",
          payerName: "Ken Ofori-Atta",
          notes: "Initial Term Deposit"
        }
      ]
    }
  ];
}


function getInitialSMSLogs() {
  return [
    {
      id: "sms-gh-901",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      recipientName: "Mrs. Nana Aba Mensah",
      recipientPhone: "+233244987654",
      channel: "SMS (Hubtel Ghana Gateway)",
      category: "Admissions",
      senderId: "GIS-ACCRA",
      messageText: "Dear Mrs. Mensah, Kwame's application (SD-ADM-2026-9139) for Class 5 has been reviewed. Entrance assessment is scheduled for Sat 15 Nov, 9:00 AM at Cantonments campus.",
      status: "Delivered",
      deliveryTime: "2026-10-23T14:35:10Z",
      network: "MTN GH",
      unitsUsed: 1
    },
    {
      id: "sms-gh-902",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      recipientName: "Mrs. Nana Aba Mensah",
      recipientPhone: "+233244987654",
      channel: "WhatsApp Business Gateway",
      category: "Campus Tour",
      senderId: "GIS-ADMISSIONS",
      messageText: "Hello Mrs. Mensah, your in-person campus tour appointment at GIS has been confirmed for Friday 31 Oct at 10:30 AM. Check-in at Administration Gate B.",
      status: "Delivered",
      deliveryTime: "2026-10-24T09:12:00Z",
      network: "WhatsApp Official",
      unitsUsed: 1
    },
    {
      id: "sms-gh-903",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      recipientName: "Mrs. Nana Aba Mensah",
      recipientPhone: "+233244987654",
      channel: "SMS (Hubtel Ghana Gateway)",
      category: "Fee Receipt",
      senderId: "GIS-BURSARY",
      messageText: "GIS PAYMENT RECEIPT: GH₵ 1,400.00 received via MTN MoMo for Kwame Mensah (Class 5). Balance due: GH₵ 3,000.00. Receipt No: GIS-REC-2026-496. Thank you.",
      status: "Delivered",
      deliveryTime: "2026-10-24T18:05:22Z",
      network: "MTN GH",
      unitsUsed: 1
    },
    {
      id: "sms-gh-904",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      recipientName: "Dr. Kofi Kpodo",
      recipientPhone: "+233244229988",
      channel: "SMS (Hubtel Ghana Gateway)",
      category: "Fee Receipt",
      senderId: "GIS-BURSARY",
      messageText: "GIS PAYMENT CONFIRMATION: Term 1 fee of GH₵ 10,700.00 for Selorm Kpodo (Class 3) FULLY SETTLED via Telecel Cash. Receipt No: GIS-REC-2026-389.",
      status: "Delivered",
      deliveryTime: "2026-10-05T09:15:30Z",
      network: "Telecel GH",
      unitsUsed: 1
    },
    {
      id: "sms-gh-905",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      recipientName: "All GIS Parents",
      recipientPhone: "+233 Broadcast (180 Recipients)",
      channel: "SMS (Arkesel Ghana Bulk)",
      category: "School Notice",
      senderId: "GIS-ACCRA",
      messageText: "GIS ACADEMIC BULLETIN: Mid-term parent-teacher consultation meetings will hold on Friday 14th November. Booking link active on parent portal.",
      status: "Delivered",
      deliveryTime: "2026-10-20T08:00:00Z",
      network: "National Unified",
      unitsUsed: 180
    }
  ];
}

// Feature 9: Student Terminal Report Cards & Digital Gradebook Dataset
function getInitialReportCards() {
  return [
    {
      id: "rc-gis-2026-kwame",
      reportCardNumber: "GIS-TR-2026-508",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      schoolMotto: "Knowledge and Integrity",
      studentId: "GIS-2026-P5-018",
      studentName: "Kwame Mensah",
      studentGrade: "Primary (Class 5 - Emerald Stream)",
      academicYear: "2026/2027",
      term: "Term 1 (First Term)",
      termDates: "September 8, 2026 – December 18, 2026",
      classTeacher: "Mr. Emmanuel Addo",
      headTeacher: "Dr. Mary Ashun",
      headTeacherRole: "Principal & Head of School",
      parentName: "Mrs. Nana Aba Mensah",
      parentEmail: "parent@gmail.com",
      parentPhone: "+233244987654",
      rollNumber: 18,
      classSize: 28,
      positionInClass: "2nd",
      positionSuffix: "out of 28 pupils",
      overallTotalMarks: 821,
      overallMaxMarks: 900,
      overallAverage: 91.2,
      overallGrade: "A*",
      overallClassification: "Distinction / First Class Honors",
      attendance: {
        timesSchoolOpened: 60,
        timesPresent: 59,
        timesAbsent: 1,
        punctualityRating: "Excellent"
      },
      nextTermBegins: "Monday, 12th January 2027",
      status: "Published",
      publishedDate: "2026-12-18T10:00:00Z",
      officialStampVerified: true,
      verificationHash: "GH-GES-NASIA-VERIFIED-GIS-2026-9941",
      subjects: [
        {
          code: "MAT501",
          name: "Core Mathematics",
          classworkScore: 28,
          examScore: 66,
          totalScore: 94,
          grade: "A*",
          remark: "Excellent",
          classAverage: 76.5,
          teacherName: "Mr. Emmanuel Addo",
          teacherRemark: "Outstanding mathematical speed, mental fluency and algebraic agility."
        },
        {
          code: "ENG501",
          name: "English Language & Creative Writing",
          classworkScore: 27,
          examScore: 63,
          totalScore: 90,
          grade: "A*",
          remark: "Excellent",
          classAverage: 78.2,
          teacherName: "Ms. Akua Donkor",
          teacherRemark: "Exceptional vocabulary, fluent comprehension and expressive essay writing."
        },
        {
          code: "SCI501",
          name: "Integrated Science & Robotics",
          classworkScore: 29,
          examScore: 67,
          totalScore: 96,
          grade: "A*",
          remark: "Distinction",
          classAverage: 74.0,
          teacherName: "Dr. K. Boateng",
          teacherRemark: "Superb grasp of experimental scientific inquiry and robotics sensor design."
        },
        {
          code: "ICT501",
          name: "Computing & Digital Literacy",
          classworkScore: 28,
          examScore: 65,
          totalScore: 93,
          grade: "A*",
          remark: "Excellent",
          classAverage: 81.0,
          teacherName: "Mr. S. Annan",
          teacherRemark: "Exemplary skills in block-based coding, spreadsheets and internet safety."
        },
        {
          code: "SOC501",
          name: "Social Studies & Civics",
          classworkScore: 26,
          examScore: 61,
          totalScore: 87,
          grade: "A",
          remark: "Very Good",
          classAverage: 73.8,
          teacherName: "Mrs. E. Coffie",
          teacherRemark: "Very good understanding of Ghanaian cultural heritage and civic duties."
        },
        {
          code: "FRN501",
          name: "French Language",
          classworkScore: 25,
          examScore: 59,
          totalScore: 84,
          grade: "A",
          remark: "Very Good",
          classAverage: 70.4,
          teacherName: "M. Jean-Pierre Dupont",
          teacherRemark: "Fluent oral pronunciation and expanding grammatical syntax."
        },
        {
          code: "GHL501",
          name: "Ghanaian Language & Culture (Twi)",
          classworkScore: 26,
          examScore: 62,
          totalScore: 88,
          grade: "A",
          remark: "Very Good",
          classAverage: 72.1,
          teacherName: "Nana K. Acheampong",
          teacherRemark: "Demonstrates commendable grasp of indigenous proverbs, folktales and idioms."
        },
        {
          code: "ART501",
          name: "Creative Arts & Design",
          classworkScore: 28,
          examScore: 64,
          totalScore: 92,
          grade: "A*",
          remark: "Excellent",
          classAverage: 79.5,
          teacherName: "Mrs. B. Osei",
          teacherRemark: "Creative, imaginative, and paints visual compositions with remarkable precision."
        },
        {
          code: "PED501",
          name: "Physical & Health Education",
          classworkScore: 27,
          examScore: 66,
          totalScore: 93,
          grade: "A*",
          remark: "Excellent",
          classAverage: 83.0,
          teacherName: "Coach D. Appiah",
          teacherRemark: "Superior cardiovascular fitness, teamwork in football, and high swimming confidence."
        }
      ],
      conductTraits: [
        { trait: "Attentiveness & Focus", rating: "Excellent", score: 5 },
        { trait: "Punctuality & Discipline", rating: "Excellent", score: 5 },
        { trait: "Neatness & Organization", rating: "Very Good", score: 4 },
        { trait: "Leadership & Initiative", rating: "Excellent", score: 5 },
        { trait: "Respect & Politeness", rating: "Excellent", score: 5 },
        { trait: "Teamwork & Collaboration", rating: "Excellent", score: 5 }
      ],
      classTeacherRemark: "Kwame has demonstrated an outstanding work ethic throughout this first term. His intellectual curiosity, kindness toward classmates, and dedication to STEM excellence make him a role model in Class 5. Promoted with flying colors.",
      headTeacherRemark: "A truly brilliant terminal performance! Kwame continues to maintain GIS's highest standards of academic integrity and personal character. Congratulations on achieving 2nd position in a highly competitive class.",
      teacherSignatureDate: "18th December 2026",
      headTeacherSignatureDate: "19th December 2026"
    },
    {
      id: "rc-gis-2026-selorm",
      reportCardNumber: "GIS-TR-2026-312",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      schoolMotto: "Knowledge and Integrity",
      studentId: "GIS-2026-P3-009",
      studentName: "Selorm Kpodo",
      studentGrade: "Primary (Class 3 - Sapphire Stream)",
      academicYear: "2026/2027",
      term: "Term 1 (First Term)",
      termDates: "September 8, 2026 – December 18, 2026",
      classTeacher: "Mrs. Vivian Mensah",
      headTeacher: "Dr. Mary Ashun",
      headTeacherRole: "Principal & Head of School",
      parentName: "Dr. Kofi Kpodo",
      parentEmail: "k.kpodo@health.gov.gh",
      parentPhone: "+233244229988",
      rollNumber: 9,
      classSize: 26,
      positionInClass: "4th",
      positionSuffix: "out of 26 pupils",
      overallTotalMarks: 708,
      overallMaxMarks: 800,
      overallAverage: 88.5,
      overallGrade: "A",
      overallClassification: "First Class Honors",
      attendance: {
        timesSchoolOpened: 60,
        timesPresent: 58,
        timesAbsent: 2,
        punctualityRating: "Very Good"
      },
      nextTermBegins: "Monday, 12th January 2027",
      status: "Published",
      publishedDate: "2026-12-18T10:00:00Z",
      officialStampVerified: true,
      verificationHash: "GH-GES-NASIA-VERIFIED-GIS-2026-7782",
      subjects: [
        {
          code: "MAT301",
          name: "Mathematics & Numeracy",
          classworkScore: 27,
          examScore: 64,
          totalScore: 91,
          grade: "A*",
          remark: "Excellent",
          classAverage: 75.0,
          teacherName: "Mrs. Vivian Mensah",
          teacherRemark: "Great grasp of multiplication tables and basic geometry shapes."
        },
        {
          code: "ENG301",
          name: "English Phonics & Literacy",
          classworkScore: 26,
          examScore: 61,
          totalScore: 87,
          grade: "A",
          remark: "Very Good",
          classAverage: 76.5,
          teacherName: "Ms. Grace Owusu",
          teacherRemark: "Fluent reader with strong phonetic decoding skills."
        },
        {
          code: "SCI301",
          name: "Natural Science & Discovery",
          classworkScore: 28,
          examScore: 63,
          totalScore: 91,
          grade: "A*",
          remark: "Excellent",
          classAverage: 77.2,
          teacherName: "Mrs. Vivian Mensah",
          teacherRemark: "Eager participant in hands-on plant biology experiments."
        },
        {
          code: "ICT301",
          name: "Computing & Keyboarding",
          classworkScore: 26,
          examScore: 60,
          totalScore: 86,
          grade: "A",
          remark: "Very Good",
          classAverage: 74.0,
          teacherName: "Mr. S. Annan",
          teacherRemark: "Quick typist and follows digital instructions carefully."
        },
        {
          code: "FRN301",
          name: "French Immersion",
          classworkScore: 25,
          examScore: 58,
          totalScore: 83,
          grade: "A",
          remark: "Very Good",
          classAverage: 71.0,
          teacherName: "Mme. Claire Touré",
          teacherRemark: "Sings French songs with enthusiasm and understands classroom commands."
        },
        {
          code: "RME301",
          name: "Religious & Moral Education",
          classworkScore: 27,
          examScore: 62,
          totalScore: 89,
          grade: "A",
          remark: "Very Good",
          classAverage: 79.0,
          teacherName: "Rev. B. K. Asante",
          teacherRemark: "Exhibits genuine respect, moral values, and empathy for peers."
        },
        {
          code: "ART301",
          name: "Creative Arts & Clay Modeling",
          classworkScore: 28,
          examScore: 62,
          totalScore: 90,
          grade: "A*",
          remark: "Excellent",
          classAverage: 80.1,
          teacherName: "Mrs. B. Osei",
          teacherRemark: "Vibrant color sense and neat craft submissions."
        },
        {
          code: "PED301",
          name: "Physical Education & Games",
          classworkScore: 27,
          examScore: 64,
          totalScore: 91,
          grade: "A*",
          remark: "Excellent",
          classAverage: 82.0,
          teacherName: "Coach D. Appiah",
          teacherRemark: "Agile, energetic, and plays with fair sportsmanship."
        }
      ],
      conductTraits: [
        { trait: "Attentiveness & Focus", rating: "Very Good", score: 4 },
        { trait: "Punctuality & Attendance", rating: "Very Good", score: 4 },
        { trait: "Neatness & Organization", rating: "Excellent", score: 5 },
        { trait: "Leadership & Initiative", rating: "Very Good", score: 4 },
        { trait: "Respect & Politeness", rating: "Excellent", score: 5 },
        { trait: "Teamwork & Sharing", rating: "Excellent", score: 5 }
      ],
      classTeacherRemark: "Selorm is an attentive, joyful, and conscientious pupil. He worked with great enthusiasm in every subject this term.",
      headTeacherRemark: "Very good terminal performance. Keep striving for the top three next term!",
      teacherSignatureDate: "18th December 2026",
      headTeacherSignatureDate: "19th December 2026"
    },
    {
      id: "rc-gis-2026-ama",
      reportCardNumber: "GIS-TR-2026-801",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      schoolMotto: "Knowledge and Integrity",
      studentId: "GIS-2026-SEC-042",
      studentName: "Ama Serwaa Prempeh",
      studentGrade: "Secondary (Form 1 / Year 10 IGCSE)",
      academicYear: "2026/2027",
      term: "Term 1 (First Term)",
      termDates: "September 8, 2026 – December 18, 2026",
      classTeacher: "Mr. Kwame Tetteh",
      headTeacher: "Dr. Mary Ashun",
      headTeacherRole: "Principal & Head of School",
      parentName: "Osei Prempeh",
      parentEmail: "oprempeh@ashanti-cocoa.com",
      parentPhone: "+233201122334",
      rollNumber: 3,
      classSize: 24,
      positionInClass: "1st",
      positionSuffix: "out of 24 students",
      overallTotalMarks: 664,
      overallMaxMarks: 700,
      overallAverage: 94.8,
      overallGrade: "A*",
      overallClassification: "First in Class / Dean's Honor Roll",
      attendance: {
        timesSchoolOpened: 60,
        timesPresent: 60,
        timesAbsent: 0,
        punctualityRating: "Flawless (100%)"
      },
      nextTermBegins: "Monday, 12th January 2027",
      status: "Published",
      publishedDate: "2026-12-18T10:00:00Z",
      officialStampVerified: true,
      verificationHash: "GH-GES-NASIA-VERIFIED-GIS-2026-1120",
      subjects: [
        {
          code: "CIE-0580",
          name: "Cambridge Extended Mathematics",
          classworkScore: 29,
          examScore: 68,
          totalScore: 97,
          grade: "A*",
          remark: "Top in Class",
          classAverage: 71.2,
          teacherName: "Mr. Emmanuel Addo",
          teacherRemark: "Mastered quadratic transformations and vector algebra effortlessly."
        },
        {
          code: "CIE-0620",
          name: "Cambridge Chemistry (Extended)",
          classworkScore: 28,
          examScore: 67,
          totalScore: 95,
          grade: "A*",
          remark: "Distinction",
          classAverage: 69.5,
          teacherName: "Dr. F. Ocloo",
          teacherRemark: "Flawless volumetric analysis and stoichiometry calculations."
        },
        {
          code: "CIE-0625",
          name: "Cambridge Physics (Extended)",
          classworkScore: 28,
          examScore: 66,
          totalScore: 94,
          grade: "A*",
          remark: "Distinction",
          classAverage: 68.0,
          teacherName: "Mr. Emmanuel Addo",
          teacherRemark: "Rigorous analytical problem solving in thermal physics and kinematics."
        },
        {
          code: "CIE-0500",
          name: "First Language English",
          classworkScore: 27,
          examScore: 65,
          totalScore: 92,
          grade: "A*",
          remark: "Excellent",
          classAverage: 74.3,
          teacherName: "Mrs. Brenda Arthur",
          teacherRemark: "Insightful critical commentary on contemporary prose and drama."
        },
        {
          code: "CIE-0455",
          name: "Economics (IGCSE)",
          classworkScore: 29,
          examScore: 67,
          totalScore: 96,
          grade: "A*",
          remark: "Top in Class",
          classAverage: 72.8,
          teacherName: "Mr. K. Boateng",
          teacherRemark: "Superb analysis of macroeconomic policies and fiscal monetary mechanisms."
        },
        {
          code: "CIE-0520",
          name: "French Foreign Language",
          classworkScore: 28,
          examScore: 65,
          totalScore: 93,
          grade: "A*",
          remark: "Excellent",
          classAverage: 70.1,
          teacherName: "Mme. Claire Touré",
          teacherRemark: "Fluent conversational expression and rich cultural awareness."
        },
        {
          code: "CIE-0478",
          name: "Computer Science & Python",
          classworkScore: 29,
          examScore: 68,
          totalScore: 97,
          grade: "A*",
          remark: "Top in Class",
          classAverage: 75.4,
          teacherName: "Mr. S. Annan",
          teacherRemark: "Exceptional algorithm architecture, binary logic and debugging skills."
        }
      ],
      conductTraits: [
        { trait: "Attentiveness & Focus", rating: "Excellent", score: 5 },
        { trait: "Punctuality & Attendance", rating: "Flawless", score: 5 },
        { trait: "Neatness & Organization", rating: "Excellent", score: 5 },
        { trait: "Leadership & Initiative", rating: "Excellent", score: 5 },
        { trait: "Respect & Politeness", rating: "Excellent", score: 5 },
        { trait: "Teamwork & Collaboration", rating: "Excellent", score: 5 }
      ],
      classTeacherRemark: "Ama is an exceptional academic powerhouse who leads her peers with humility, discipline, and infectious curiosity. First in Form 1.",
      headTeacherRemark: "Superlative terminal report! A true beacon of GIS academic excellence. Congratulations on achieving 1st Position.",
      teacherSignatureDate: "18th December 2026",
      headTeacherSignatureDate: "19th December 2026"
    }
  ];
}


function getInitialTransportRoutes() {
  return [
    {
      id: "rte-gis-01",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      routeNumber: "Route 01",
      name: "East Legon & Airport Residential Shuttle",
      corridor: "Cantonments - Airport Residential - East Legon (Underbridge)",
      busPlate: "GN-4921-26",
      busModel: "Toyota Coaster AC Luxury (30-Seater)",
      busCapacity: 30,
      enrolledStudents: 28,
      driver: {
        name: "Daniel Boateng",
        phone: "+233 24 883 1029",
        licenseClass: "DVLA Commercial Class F",
        yearsExperience: 14,
        status: "Certified & Verified",
        avatar: "👨🏿‍✈️"
      },
      chaperone: {
        name: "Grace Mensah (Auntie Grace)",
        phone: "+233 50 491 8820",
        role: "Certified Bus Matron & First Aider",
        avatar: "👩🏿‍⚕️"
      },
      morningWindow: "06:15 AM - 07:30 AM",
      afternoonWindow: "03:30 PM - 04:45 PM",
      status: "In Transit",
      currentStopIndex: 2,
      delayMinutes: 0,
      delayReason: "",
      stops: [
        {
          id: "stp-1",
          name: "GIS Cantonments Campus (Depot)",
          scheduledTime: "06:15 AM",
          actualTime: "06:15 AM",
          type: "Depot",
          status: "completed",
          landmark: "Second Circular Road Gate 2 Parking"
        },
        {
          id: "stp-2",
          name: "Airport Residential (Roman Ridge Junction)",
          scheduledTime: "06:35 AM",
          actualTime: "06:36 AM",
          type: "Pickup",
          status: "completed",
          landmark: "Near Association Int. School Bypass"
        },
        {
          id: "stp-3",
          name: "East Legon (Underbridge Shell)",
          scheduledTime: "06:55 AM",
          actualTime: "06:56 AM",
          type: "Pickup",
          status: "in_transit",
          landmark: "Underbridge Shell Forecourt & Canopy (Kwame Mensah Stop)"
        },
        {
          id: "stp-4",
          name: "East Legon (American House Roundabout)",
          scheduledTime: "07:10 AM",
          actualTime: "Pending",
          type: "Pickup",
          status: "scheduled",
          landmark: "Opposite Del Hospital Lane"
        },
        {
          id: "stp-5",
          name: "GIS Cantonments Junior Campus (Arrival)",
          scheduledTime: "07:30 AM",
          actualTime: "Pending",
          type: "Destination",
          status: "scheduled",
          landmark: "Assembly Forecourt Gate 1"
        }
      ],
      students: [
        {
          studentId: "std-kwame-2026",
          studentName: "Kwame Mensah",
          grade: "Primary Class 5",
          seatNumber: "14",
          stopId: "stp-3",
          stopName: "East Legon (Underbridge Shell)",
          parentPhone: "+233 24 431 8900",
          parentName: "Mrs. Nana Aba Mensah",
          boarded: true,
          boardingTime: "06:54 AM"
        },
        {
          studentId: "std-selorm-2026",
          studentName: "Selorm Kpodo",
          grade: "Primary Class 3",
          seatNumber: "08",
          stopId: "stp-2",
          stopName: "Airport Residential",
          parentPhone: "+233 50 128 4401",
          parentName: "Mr. Kwesi Kpodo",
          boarded: true,
          boardingTime: "06:36 AM"
        }
      ]
    },
    {
      id: "rte-gis-02",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      routeNumber: "Route 02",
      name: "Spintex Coastal & Batsonaa Express",
      corridor: "Cantonments - Manet - Texpo - Batsonaa Railway",
      busPlate: "GT-3882-25",
      busModel: "Mercedes-Benz Sprinter 516 (24-Seater)",
      busCapacity: 24,
      enrolledStudents: 22,
      driver: {
        name: "Emmanuel Tetteh",
        phone: "+233 20 719 3341",
        licenseClass: "DVLA Commercial Class F",
        yearsExperience: 11,
        status: "Certified & Verified",
        avatar: "👨🏿‍✈️"
      },
      chaperone: {
        name: "Beatrice Osei",
        phone: "+233 26 331 9920",
        role: "Bus Matron & Care Attendant",
        avatar: "👩🏿‍💼"
      },
      morningWindow: "06:20 AM - 07:35 AM",
      afternoonWindow: "03:30 PM - 05:00 PM",
      status: "Delayed (15 mins)",
      currentStopIndex: 1,
      delayMinutes: 15,
      delayReason: "Heavy gridlock along Spintex Underbridge bypass",
      stops: [
        {
          id: "stp-201",
          name: "GIS Cantonments Campus (Depot)",
          scheduledTime: "06:20 AM",
          actualTime: "06:20 AM",
          type: "Depot",
          status: "completed",
          landmark: "Gate 1 Main Ring"
        },
        {
          id: "stp-202",
          name: "Spintex Road (Manet Junction)",
          scheduledTime: "06:45 AM",
          actualTime: "07:00 AM (Delayed)",
          type: "Pickup",
          status: "in_transit",
          landmark: "Opposite Manet Police Station"
        },
        {
          id: "stp-203",
          name: "Spintex (Texpo Market)",
          scheduledTime: "07:05 AM",
          actualTime: "Pending",
          type: "Pickup",
          status: "scheduled",
          landmark: "TotalEnergies Texpo Canopy"
        },
        {
          id: "stp-204",
          name: "Batsonaa Total Station",
          scheduledTime: "07:20 AM",
          actualTime: "Pending",
          type: "Pickup",
          status: "scheduled",
          landmark: "Near Railway Crossing"
        },
        {
          id: "stp-205",
          name: "GIS Cantonments Campus (Arrival)",
          scheduledTime: "07:45 AM",
          actualTime: "Pending",
          type: "Destination",
          status: "scheduled",
          landmark: "Main Administration Quad"
        }
      ],
      students: []
    },
    {
      id: "rte-sos-01",
      schoolId: "sch-sos-tema",
      schoolName: "SOS-Hermann Gmeiner International College",
      routeNumber: "Route 01",
      name: "Tema Communities 6, 10 & 12 Shuttle",
      corridor: "Community 6 - Comm 10 Shell - Comm 12 Roundabout",
      busPlate: "GN-7719-24",
      busModel: "Nissan Civilian AC Bus (28-Seater)",
      busCapacity: 28,
      enrolledStudents: 25,
      driver: {
        name: "Kofi Owusu",
        phone: "+233 24 551 2289",
        licenseClass: "DVLA Commercial Class F",
        yearsExperience: 16,
        status: "Certified & Verified",
        avatar: "👨🏿‍✈️"
      },
      chaperone: {
        name: "Vida Mensah",
        phone: "+233 27 882 1109",
        role: "Resident Matron",
        avatar: "👩🏿‍💼"
      },
      morningWindow: "06:30 AM - 07:30 AM",
      afternoonWindow: "03:45 PM - 04:50 PM",
      status: "On Schedule",
      currentStopIndex: 2,
      delayMinutes: 0,
      delayReason: "",
      stops: [
        {
          id: "stp-301",
          name: "SOS College Tema Campus (Depot)",
          scheduledTime: "06:30 AM",
          actualTime: "06:30 AM",
          type: "Depot",
          status: "completed",
          landmark: "Community 6 Main Gate"
        },
        {
          id: "stp-302",
          name: "Tema Comm 10 Shell",
          scheduledTime: "06:45 AM",
          actualTime: "06:45 AM",
          type: "Pickup",
          status: "completed",
          landmark: "Comm 10 Shell Station Forecourt"
        },
        {
          id: "stp-303",
          name: "Tema Comm 12 Roundabout",
          scheduledTime: "07:00 AM",
          actualTime: "07:01 AM",
          type: "Pickup",
          status: "in_transit",
          landmark: "Near Comm 12 Market Junction"
        },
        {
          id: "stp-304",
          name: "SOS College Campus (Arrival)",
          scheduledTime: "07:25 AM",
          actualTime: "Pending",
          type: "Destination",
          status: "scheduled",
          landmark: "Hostel Quadrangle"
        }
      ],
      students: [
        {
          studentId: "std-ama-2026",
          studentName: "Ama Serwaa Prempeh",
          grade: "IGCSE Form 1",
          seatNumber: "05",
          stopId: "stp-302",
          stopName: "Tema Comm 10 Shell",
          parentPhone: "+233 20 811 4499",
          parentName: "Dr. Kwabena Prempeh",
          boarded: true,
          boardingTime: "06:48 AM"
        }
      ]
    }
  ];
}

function getInitialStudentBusPasses() {
  return [
    {
      id: "bpass-kwame-2026",
      studentId: "std-kwame-2026",
      studentName: "Kwame Mensah",
      studentGrade: "Primary Class 5",
      parentName: "Mrs. Nana Aba Mensah",
      parentPhone: "+233 24 431 8900",
      parentEmail: "nana.aba@mensahfamily.gh",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      routeId: "rte-gis-01",
      routeName: "East Legon & Airport Residential Shuttle",
      routeNumber: "Route 01",
      busPlate: "GN-4921-26",
      busModel: "Toyota Coaster AC Luxury (30-Seater)",
      seatNumber: "14",
      pickupLandmark: "East Legon - Underbridge Shell Forecourt & Canopy",
      morningPickupTime: "06:55 AM",
      afternoonDropoffTime: "04:15 PM",
      driver: {
        name: "Daniel Boateng",
        phone: "+233 24 883 1029",
        licenseClass: "DVLA Commercial Class F",
        badge: "Verified Commercial Driver"
      },
      chaperone: {
        name: "Grace Mensah (Auntie Grace)",
        phone: "+233 50 491 8820",
        role: "Certified Bus Matron & First Aider"
      },
      qrToken: "SD-BUS-2026-KWAME-GIS-R01-S14",
      term: "Term 1 (2026/2027 Academic Year)",
      status: "Active",
      safetyNotes: "Seatbelt required at all times. Boarding strictly at designated Shell Underbridge shelter."
    },
    {
      id: "bpass-selorm-2026",
      studentId: "std-selorm-2026",
      studentName: "Selorm Kpodo",
      studentGrade: "Primary Class 3",
      parentName: "Mr. Kwesi Kpodo",
      parentPhone: "+233 50 128 4401",
      parentEmail: "parent@gmail.com",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      routeId: "rte-gis-01",
      routeName: "East Legon & Airport Residential Shuttle",
      routeNumber: "Route 01",
      busPlate: "GN-4921-26",
      busModel: "Toyota Coaster AC Luxury",
      seatNumber: "08",
      pickupLandmark: "Airport Residential (Roman Ridge Junction)",
      morningPickupTime: "06:35 AM",
      afternoonDropoffTime: "04:30 PM",
      driver: {
        name: "Daniel Boateng",
        phone: "+233 24 883 1029",
        licenseClass: "DVLA Commercial Class F",
        badge: "Verified Commercial Driver"
      },
      chaperone: {
        name: "Grace Mensah (Auntie Grace)",
        phone: "+233 50 491 8820",
        role: "Certified Bus Matron & First Aider"
      },
      qrToken: "SD-BUS-2026-SELORM-GIS-R01-S08",
      term: "Term 1 (2026/2027 Academic Year)",
      status: "Active",
      safetyNotes: "Seatbelt mandatory. Assisted boarding by Bus Matron."
    }
  ];
}





function getInitialMedicalRecords() {
  return [
    {
      id: "med-kwame-2026",
      studentId: "std-kwame-2026",
      studentName: "Kwame Mensah",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      grade: "Primary Class 5",
      dob: "2016-04-12",
      gender: "Male",
      bloodGroup: "O+",
      genotype: "AA",
      allergies: [
        {
          allergen: "Peanuts & Groundnuts",
          severity: "Severe / Anaphylaxis Risk",
          reaction: "Airway constriction, facial edema & hives",
          actionPlan: "Strict zero-contact. Junior EpiPen 0.15mg stored in Sickbay Matron Cabinet #4.",
          isDietaryAlert: true
        },
        {
          allergen: "Dust Mites & Pollen",
          severity: "Mild",
          reaction: "Sneezing, rhinitis & ocular irritation",
          actionPlan: "Antihistamine (Cetirizine 5mg) as needed.",
          isDietaryAlert: false
        }
      ],
      dietaryPlan: "Strict Peanut-Free / Groundnut-Free Canteen Meal Plan (Canteen Kitchen Red Flagged)",
      canteenSpecialInstructions: "No groundnut soup, peanut paste, satay, or unverified bakery items. Kitchen chef must use dedicated allergen-free cutting board.",
      chronicConditions: [
        "Exercise-Induced Asthma (Personal Ventolin 100mcg Inhaler kept on file in classroom & sickbay)"
      ],
      immunizations: [
        { vaccine: "Yellow Fever (Stamaril)", date: "2017-01-15", provider: "Ridge Regional Hospital, Accra", certified: true },
        { vaccine: "Meningitis (MenAfriVac Conjugate)", date: "2018-03-20", provider: "Greater Accra Health Directorate", certified: true },
        { vaccine: "Hepatitis B (Complete 3-Dose Series)", date: "2016-10-10", provider: "37 Military Hospital", certified: true },
        { vaccine: "Tetanus Toxoid (DTP Booster)", date: "2022-09-14", provider: "GIS School Clinic", certified: true },
        { vaccine: "Polio (OPV / IPV)", date: "2016-11-22", provider: "Ridge Hospital, Accra", certified: true },
        { vaccine: "Measles-Rubella (MR 2 Doses)", date: "2017-04-18", provider: "GHS Child Welfare Clinic", certified: true }
      ],
      emergencyContact: {
        primaryGuardian: "Mrs. Nana Aba Mensah (Mother)",
        primaryPhone: "+233 24 431 8900",
        secondaryGuardian: "Mr. Kwame Mensah Snr (Father)",
        secondaryPhone: "+233 20 811 4455",
        familyPediatrician: "Dr. K. Boateng, Korle-Bu Pediatric OPD (+233 24 499 1200)",
        parentEmail: "parent@gmail.com"
      },
      nhisNumber: "GH-NHIS-2026-9021-O",
      certifiedMatron: "Nurse Faustina Antwi, RN (Certified School Health Matron)",
      lastPhysicalExamDate: "2026-09-08",
      status: "Verified Active"
    },
    {
      id: "med-selorm-2026",
      studentId: "std-selorm-2026",
      studentName: "Selorm Kpodo",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      grade: "Primary Class 3",
      dob: "2018-09-05",
      gender: "Male",
      bloodGroup: "B+",
      genotype: "AS",
      allergies: [
        {
          allergen: "Lactose & Dairy Milk",
          severity: "Moderate",
          reaction: "Abdominal cramping & nausea",
          actionPlan: "Avoid cow milk & fresh cheese. Substitute with soy/almond milk.",
          isDietaryAlert: true
        }
      ],
      dietaryPlan: "Dairy-Free Canteen Plan (Lactose Alternative)",
      canteenSpecialInstructions: "Provide plant milk or water during break refreshments.",
      chronicConditions: [
        "Sickle Cell Trait (AS) - Requires adequate hydration during sunny sports & physical education"
      ],
      immunizations: [
        { vaccine: "Yellow Fever", date: "2019-06-11", provider: "Nyaho Medical Centre", certified: true },
        { vaccine: "Meningitis A/C/W", date: "2020-02-14", provider: "GHS Accra Metro", certified: true },
        { vaccine: "Hepatitis B", date: "2019-01-20", provider: "37 Military Hospital", certified: true },
        { vaccine: "Tetanus Booster", date: "2024-01-10", provider: "GIS School Clinic", certified: true }
      ],
      emergencyContact: {
        primaryGuardian: "Mr. Kwesi Kpodo (Father)",
        primaryPhone: "+233 50 128 4401",
        parentEmail: "kwesi.kpodo@gmail.com"
      },
      nhisNumber: "GH-NHIS-2026-8812-B",
      certifiedMatron: "Nurse Faustina Antwi, RN",
      lastPhysicalExamDate: "2026-09-10",
      status: "Verified Active"
    },
    {
      id: "med-efua-2026",
      studentId: "std-efua-2026",
      studentName: "Efua Sutherland",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      grade: "Class 6",
      dob: "2015-11-20",
      gender: "Female",
      bloodGroup: "A+",
      genotype: "AA",
      allergies: [
        {
          allergen: "Penicillin & Beta-Lactam Antibiotics",
          severity: "Severe",
          reaction: "Systemic urticaria & anaphylaxis",
          actionPlan: "DO NOT ADMINISTER Penicillin or Amoxicillin under any circumstance.",
          isDietaryAlert: false
        }
      ],
      dietaryPlan: "Standard Ghanaian / Continental Canteen Meal Plan",
      canteenSpecialInstructions: "No dietary restrictions.",
      chronicConditions: [
        "Bilateral Myopia (Must wear corrective spectacles during classroom instruction)"
      ],
      immunizations: [
        { vaccine: "Yellow Fever", date: "2016-12-05", provider: "Ridge Hospital", certified: true },
        { vaccine: "Meningitis", date: "2017-03-15", provider: "GHS Metro", certified: true },
        { vaccine: "Hepatitis B", date: "2016-08-20", provider: "UG Hospital Legon", certified: true }
      ],
      emergencyContact: {
        primaryGuardian: "Dr. E. Sutherland",
        primaryPhone: "+233 24 551 2288"
      },
      nhisNumber: "GH-NHIS-2026-4410-A",
      certifiedMatron: "Nurse Faustina Antwi, RN",
      lastPhysicalExamDate: "2026-09-12",
      status: "Verified Active"
    }
  ];
}


function getInitialLibraryBooks() {
  return [
    {
      id: "lib-bk-01",
      schoolId: "sch-gis-accra",
      title: "Aki-Ola Core Mathematics for Senior High Schools",
      author: "Peter Asiedu (Aki-Ola)",
      publisher: "Aki-Ola Publications Ltd, Accra",
      isbn: "978-9988-1-0421-2",
      curriculum: "Ghana GES & WASSCE",
      subject: "Mathematics",
      gradeLevel: "SHS 1 - 3",
      totalCopies: 85,
      availableCopies: 72,
      borrowedCount: 13,
      shelfLocation: "Aisle 2 • Shelf B-04 (STEM Bay)",
      edition: "Revised 2025 Edition",
      coverIcon: "📐",
      rating: 4.9,
      tags: ["WAEC", "Core Maths", "Aki-Ola", "Past Questions Integrated"]
    },
    {
      id: "lib-bk-02",
      schoolId: "sch-gis-accra",
      title: "Cambridge IGCSE Complete Mathematics: Extended (5th Edition)",
      author: "David Rayner & Ian Bettison",
      publisher: "Oxford University Press",
      isbn: "978-0198425076",
      curriculum: "Cambridge (CIE) / IGCSE",
      subject: "Mathematics",
      gradeLevel: "Grade 9 - 10",
      totalCopies: 60,
      availableCopies: 48,
      borrowedCount: 12,
      shelfLocation: "Aisle 3 • Shelf C-11 (Cambridge IGCSE)",
      edition: "5th International Edition",
      coverIcon: "📊",
      rating: 4.8,
      tags: ["IGCSE", "Extended Maths", "Oxford", "CIE 0580"]
    },
    {
      id: "lib-bk-03",
      schoolId: "sch-gis-accra",
      title: "Aki-Ola Integrated Science for Junior High Schools",
      author: "Peter Asiedu",
      publisher: "Aki-Ola Publications Ltd",
      isbn: "978-9988-1-1184-5",
      curriculum: "Ghana GES (Common Core)",
      subject: "Integrated Science",
      gradeLevel: "JHS 1 - 3",
      totalCopies: 110,
      availableCopies: 95,
      borrowedCount: 15,
      shelfLocation: "Aisle 1 • Shelf A-08 (Basic Sciences)",
      edition: "Standards-Based Edition",
      coverIcon: "🔬",
      rating: 4.7,
      tags: ["BECE", "GES", "Integrated Science", "Practical Experiments"]
    },
    {
      id: "lib-bk-04",
      schoolId: "sch-gis-accra",
      title: "The Dilemma of a Ghost & Anowa",
      author: "Ama Ata Aidoo",
      publisher: "Longman African Writers",
      isbn: "978-0582002470",
      curriculum: "Ghana GES & Cambridge Literature",
      subject: "English Literature",
      gradeLevel: "JHS 3 - SHS 2",
      totalCopies: 50,
      availableCopies: 41,
      borrowedCount: 9,
      shelfLocation: "Aisle 4 • Shelf D-02 (African Literature)",
      edition: "African Classics Series",
      coverIcon: "🎭",
      rating: 5.0,
      tags: ["African Writers", "Ama Ata Aidoo", "Ghanaian Drama", "WASSCE Set Book"]
    },
    {
      id: "lib-bk-05",
      schoolId: "sch-gis-accra",
      title: "Things Fall Apart (African Trilogy)",
      author: "Chinua Achebe",
      publisher: "Penguin Classics",
      isbn: "978-0385474542",
      curriculum: "African & World Literature",
      subject: "English Literature",
      gradeLevel: "Grade 8 - 11",
      totalCopies: 75,
      availableCopies: 63,
      borrowedCount: 12,
      shelfLocation: "Aisle 4 • Shelf D-09 (African Classics)",
      edition: "Expanded Centenary Edition",
      coverIcon: "📖",
      rating: 5.0,
      tags: ["Chinua Achebe", "African Trilogy", "Required Reading"]
    },
    {
      id: "lib-bk-06",
      schoolId: "sch-gis-accra",
      title: "Cambridge IGCSE Physics Coursebook with Audio",
      author: "David Sang",
      publisher: "Cambridge University Press",
      isbn: "978-1107614581",
      curriculum: "Cambridge (CIE) / IGCSE",
      subject: "Physics",
      gradeLevel: "Grade 10 - 11",
      totalCopies: 45,
      availableCopies: 38,
      borrowedCount: 7,
      shelfLocation: "Aisle 3 • Shelf C-18 (Physical Sciences)",
      edition: "2nd Edition Endorsed by CIE",
      coverIcon: "⚛️",
      rating: 4.9,
      tags: ["Cambridge IGCSE", "Physics", "Practical Labs", "CIE 0625"]
    },
    {
      id: "lib-bk-07",
      schoolId: "sch-gis-accra",
      title: "The Cockcrow: An Anthology of Literature for Junior High",
      author: "K. A. Ackah",
      publisher: "Afram Publications Ghana Ltd",
      isbn: "978-9964-70-512-1",
      curriculum: "Ghana GES (BECE Core)",
      subject: "English Literature",
      gradeLevel: "JHS 1 - 3",
      totalCopies: 90,
      availableCopies: 82,
      borrowedCount: 8,
      shelfLocation: "Aisle 4 • Shelf D-14 (BECE Literature)",
      edition: "Official WAEC Prescribed Edition",
      coverIcon: "🐓",
      rating: 4.8,
      tags: ["The Cockcrow", "BECE Set Book", "Prose & Drama"]
    },
    {
      id: "lib-bk-08",
      schoolId: "sch-gis-accra",
      title: "Aki-Ola Elective Mathematics for SHS",
      author: "Peter Asiedu",
      publisher: "Aki-Ola Publications Ltd",
      isbn: "978-9988-1-0899-9",
      curriculum: "Ghana GES & WASSCE",
      subject: "Mathematics",
      gradeLevel: "SHS 1 - 3",
      totalCopies: 65,
      availableCopies: 54,
      borrowedCount: 11,
      shelfLocation: "Aisle 2 • Shelf B-09 (Advanced Maths)",
      edition: "Comprehensive WASSCE Edition",
      coverIcon: "📈",
      rating: 4.9,
      tags: ["Elective Maths", "Calculus & Vectors", "WASSCE Advanced"]
    }
  ];
}

function getInitialLibraryLoans() {
  return [
    {
      id: "loan-01",
      schoolId: "sch-gis-accra",
      bookId: "lib-bk-05",
      bookTitle: "Things Fall Apart (African Trilogy)",
      bookAuthor: "Chinua Achebe",
      studentId: "std-kwame-2026",
      studentName: "Kwame Mensah",
      gradeLevel: "Primary Class 5",
      borrowDate: "2026-10-14",
      dueDate: "2026-10-28",
      returnDate: null,
      status: "Active Loan",
      daysRemaining: 3,
      fineDueGHS: 0,
      barcode: "GIS-LIB-BK-005-02",
      librarian: "Mr. Kofi Boadi, MLS (Chief Librarian)"
    },
    {
      id: "loan-02",
      schoolId: "sch-gis-accra",
      bookId: "lib-bk-02",
      bookTitle: "Cambridge IGCSE Complete Mathematics: Extended (5th Edition)",
      bookAuthor: "David Rayner & Ian Bettison",
      studentId: "std-kwame-2026",
      studentName: "Kwame Mensah",
      gradeLevel: "Primary Class 5",
      borrowDate: "2026-10-05",
      dueDate: "2026-10-19",
      returnDate: null,
      status: "Overdue",
      daysOverdue: 6,
      fineDueGHS: 12,
      barcode: "GIS-LIB-BK-002-14",
      librarian: "Mrs. Evelyn Quaye, Dip. Lib."
    },
    {
      id: "loan-03",
      schoolId: "sch-gis-accra",
      bookId: "lib-bk-07",
      bookTitle: "The Cockcrow: An Anthology of Literature for Junior High",
      bookAuthor: "K. A. Ackah",
      studentId: "std-selorm-02",
      studentName: "Selorm Kpodo",
      gradeLevel: "Primary Class 3",
      borrowDate: "2026-10-18",
      dueDate: "2026-11-01",
      returnDate: null,
      status: "Active Loan",
      daysRemaining: 7,
      fineDueGHS: 0,
      barcode: "GIS-LIB-BK-007-08",
      librarian: "Mr. Kofi Boadi, MLS (Chief Librarian)"
    },
    {
      id: "loan-04",
      schoolId: "sch-gis-accra",
      bookId: "lib-bk-03",
      bookTitle: "Aki-Ola Integrated Science for Junior High Schools",
      bookAuthor: "Peter Asiedu",
      studentId: "std-efua-03",
      studentName: "Efua Sutherland",
      gradeLevel: "Class 6",
      borrowDate: "2026-10-01",
      dueDate: "2026-10-15",
      returnDate: "2026-10-12",
      status: "Returned On-Time",
      fineDueGHS: 0,
      barcode: "GIS-LIB-BK-003-31",
      librarian: "Mr. Kofi Boadi, MLS (Chief Librarian)"
    }
  ];
}

function getInitialSickbayLogs() {
  return [
    {
      id: "sb-log-001",
      schoolId: "sch-gis-accra",
      studentId: "std-kwame-2026",
      studentName: "Kwame Mensah",
      grade: "Primary Class 5",
      visitDate: "2026-10-23",
      visitTime: "02:15 PM",
      presentingComplaint: "Mild chest tightness and expiratory wheezing following 200m track sprint during PE.",
      vitals: {
        temperature: "36.8°C",
        pulse: "88 bpm",
        spO2: "98%",
        bloodPressure: "105/70 mmHg"
      },
      treatmentGiven: "Administered 2 puffs Ventolin (Salbutamol 100mcg) via Volumatic spacer from locker. Rested in sickbay cot 30 minutes with elevated headrest. Hydrated with cool water.",
      treatingNurse: "Nurse Faustina Antwi, RN (Certified School Health Matron)",
      outcome: "Discharged to Class 5",
      outcomeCategory: "Discharged to Class",
      parentNotified: true,
      notificationMessage: "GIS SICKBAY DISCHARGE: Kwame Mensah rested in sickbay following mild athletic wheezing. Administered Ventolin from his locker. Breathing clear and returned to class in excellent spirits.",
      createdAt: "2026-10-23T14:45:00.000Z"
    },
    {
      id: "sb-log-002",
      schoolId: "sch-gis-accra",
      studentId: "std-selorm-2026",
      studentName: "Selorm Kpodo",
      grade: "Primary Class 3",
      visitDate: "2026-10-24",
      visitTime: "10:30 AM",
      presentingComplaint: "Superficial skin graze on right knee and elbow from trip during morning recess on turf.",
      vitals: {
        temperature: "36.6°C",
        pulse: "82 bpm"
      },
      treatmentGiven: "Cleaned abrasion with sterile saline and povidone-iodine (Betadine). Applied non-adherent sterile dressing and ice pack for 10 minutes.",
      treatingNurse: "Nurse Faustina Antwi, RN",
      outcome: "Discharged to Class 3",
      outcomeCategory: "Discharged to Class",
      parentNotified: false,
      notificationMessage: null,
      createdAt: "2026-10-24T10:50:00.000Z"
    },
    {
      id: "sb-log-003",
      schoolId: "sch-gis-accra",
      studentId: "std-kofi-2026",
      studentName: "Kofi Boakye",
      grade: "JHS 1",
      visitDate: "2026-10-25",
      visitTime: "09:20 AM",
      presentingComplaint: "Frontal headache, general malaise, body weakness, and elevated body temperature.",
      vitals: {
        temperature: "38.4°C (Pyrexia)",
        pulse: "104 bpm",
        spO2: "99%"
      },
      treatmentGiven: "Administered Paracetamol 500mg orally with water. Applied cool tepid forehead compress. Malaria Rapid Diagnostic Test (RDT) performed: NEGATIVE. Resting in Sickbay Cot #2.",
      treatingNurse: "Nurse Faustina Antwi, RN",
      outcome: "Resting in Sickbay (Guardian Contacted)",
      outcomeCategory: "Resting in Sickbay",
      parentNotified: true,
      notificationMessage: "GIS SICKBAY ALERT: Kofi Boakye is resting in the clinic with fever (38.4°C, Malaria RDT negative). Given Paracetamol. Please arrange pickup from Cantonments campus at your earliest convenience.",
      createdAt: "2026-10-25T09:40:00.000Z"
    }
  ];
}

function getInitialAlumni() {
  return [
    {
      id: "alm-gis-001",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      name: "Dr. Araba Otchere-Darko",
      classYear: "Class of 2016",
      currentRole: "Senior Software Engineer & FinTech Architect",
      company: "Paystack / Stripe Africa",
      tertiaryUniversity: "Ashesi University (BSc CS '20) & Stanford (MS '22)",
      industry: "Technology & FinTech",
      avatar: "👩🏿‍💻",
      location: "Accra, Ghana & San Francisco, CA",
      bio: "Former GIS Head Girl and Robotics Club founder. Graduated Magna Cum Laude from Ashesi University before completing her Masters at Stanford. Now leads core payment rail engineering for West Africa at Paystack.",
      mentoringAreas: [
        "Ashesi & US College Admissions Strategy",
        "High School Software Engineering Portfolios",
        "Breaking into African FinTech & Silicon Valley"
      ],
      mentoringAvailability: "Accepting Students (2 Virtual Slots / Week)",
      verifiedBadge: true,
      rating: 4.95,
      reviewsCount: 22,
      sessionsCompleted: 34,
      featured: true
    },
    {
      id: "alm-gis-002",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      name: "Dr. Kweku Boateng-Appiah",
      classYear: "Class of 2014",
      currentRole: "Consultant Cardiothoracic Surgeon & Lecturer",
      company: "Korle-Bu Teaching Hospital / UG Medical School",
      tertiaryUniversity: "University of Ghana Medical School (MBChB '20) & Johns Hopkins (MPH)",
      industry: "Medicine & Public Health",
      avatar: "👨🏿‍⚕️",
      location: "Accra, Ghana",
      bio: "GIS valedictorian who pursued Medicine at Legon followed by a pediatric cardiovascular fellowship. Passionate about guiding young African science scholars into modern clinical practice and global health policy.",
      mentoringAreas: [
        "Pre-Med Cambridge A-Level Subject Choices",
        "Medical School Admissions & Interview Prep (Ghana & UK)",
        "Clinical Research & Healthcare Leadership"
      ],
      mentoringAvailability: "Virtual Video Mentoring (Saturdays 10:00 AM - 12:00 PM)",
      verifiedBadge: true,
      rating: 4.98,
      reviewsCount: 31,
      sessionsCompleted: 48,
      featured: true
    },
    {
      id: "alm-gis-003",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      name: "Afua Asantewaa Osei, CFA",
      classYear: "Class of 2017",
      currentRole: "Vice President - Infrastructure & Energy Financing",
      company: "African Development Bank (AfDB)",
      tertiaryUniversity: "London School of Economics (LSE) (BSc Economics '20)",
      industry: "Investment Banking & Finance",
      avatar: "👩🏿‍💼",
      location: "London, UK & Abidjan / Accra",
      bio: "Represented Ghana at the World Youth Economics Olympiad during GIS. First-class graduate from LSE who structured over $400M in West African clean energy infrastructure debt at AfDB.",
      mentoringAreas: [
        "LSE, Oxford & Cambridge Economics Admissions",
        "Corporate Finance, M&A & Private Equity",
        "CFA Exam Preparation & Career Mentorship"
      ],
      mentoringAvailability: "Accepting Students (Bi-weekly Slots)",
      verifiedBadge: true,
      rating: 4.92,
      reviewsCount: 19,
      sessionsCompleted: 27,
      featured: true
    },
    {
      id: "alm-gis-004",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      name: "Ing. Kwesi Dadson",
      classYear: "Class of 2015",
      currentRole: "Principal Renewable Grid Project Lead",
      company: "Volta River Authority (VRA) / Solar GridCo",
      tertiaryUniversity: "Imperial College London (MEng Civil & Environmental '19)",
      industry: "Engineering & Clean Energy",
      avatar: "👨🏿‍🔬",
      location: "Accra & Akosombo, Ghana",
      bio: "Led GIS Science Fair championship in 2014. Now pioneering utility-scale solar and battery storage integration for Ghana's national grid.",
      mentoringAreas: [
        "Imperial College & Russell Group Engineering Applications",
        "Renewable Energy & Power Systems in Africa",
        "STEM Practical Design & Innovation Contests"
      ],
      mentoringAvailability: "Accepting Students (Weekend Slots)",
      verifiedBadge: true,
      rating: 4.89,
      reviewsCount: 15,
      sessionsCompleted: 21,
      featured: true
    },
    {
      id: "alm-sos-001",
      schoolId: "sch-sos-tema",
      schoolName: "SOS-Hermann Gmeiner International College",
      name: "Nana Yaa Mensah, Esq.",
      classYear: "Class of 2015",
      currentRole: "Corporate Technology & IP Partner",
      company: "Bentsi-Enchill, Letsa & Ankomah",
      tertiaryUniversity: "Harvard Law School (LL.M '21) & University of Ghana (LL.B '19)",
      industry: "Law & Public Policy",
      avatar: "👩🏿‍⚖️",
      location: "Accra, Ghana & Boston, MA",
      bio: "SOS-HGIC IB Diploma 44/45 points scorer. Specializes in cross-border tech regulation, African venture capital law, and national constitutional advisory.",
      mentoringAreas: [
        "Law School Admissions (Legon, GSL, UK & US)",
        "Model UN Diplomacy & Legal Moot Court Prep",
        "Intellectual Property & Startup Legal Advisory"
      ],
      mentoringAvailability: "Accepting Students (1 Slot / Week)",
      verifiedBadge: true,
      rating: 5.0,
      reviewsCount: 26,
      sessionsCompleted: 39,
      featured: true
    },
    {
      id: "alm-gis-005",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      name: "Farhan Alhassan",
      classYear: "Class of 2018",
      currentRole: "AI Research Engineer & Robotics Faculty",
      company: "Google Research Ghana & Ashesi AI Lab",
      tertiaryUniversity: "MIT (BSc & MEng Computer Science / AI '22)",
      industry: "AI & Advanced Computing",
      avatar: "👨🏿‍💻",
      location: "Accra, Ghana & Boston, MA",
      bio: "Gold medalist at the Pan-African Mathematics Olympiad. Currently researching natural language processing for African languages and agricultural drone autonomy at Google Research Accra.",
      mentoringAreas: [
        "MIT, Caltech & Ivy League STEM Applications",
        "Deep Learning, Machine Learning & Robotics",
        "High School Coding Hackathons & Research Publications"
      ],
      mentoringAvailability: "Accepting Students (Sunday Evenings)",
      verifiedBadge: true,
      rating: 4.96,
      reviewsCount: 24,
      sessionsCompleted: 32,
      featured: true
    }
  ];
}

function getInitialAlumniBookings() {
  return [
    {
      id: "mbk-2026-001",
      mentorId: "alm-gis-001",
      mentorName: "Dr. Araba Otchere-Darko",
      mentorRole: "Senior Software Engineer & FinTech Architect (Paystack)",
      mentorAvatar: "👩🏿‍💻",
      studentId: "std-kwame-2026",
      studentName: "Kwame Mensah",
      parentName: "Mrs. Nana Aba Mensah",
      parentEmail: "parent@gmail.com",
      parentPhone: "+233 24 431 8900",
      gradeLevel: "Primary Class 5 (Robotics Enthusiast)",
      scheduledDate: "Saturday, 7 November 2026",
      scheduledTime: "11:00 AM - 11:45 AM GMT",
      topic: "Early Robotics Engineering Pathways & Preparing for Junior STEM Olympiads",
      meetingPlatform: "Google Meet (Encrypted Video Room)",
      meetingLink: "https://meet.google.com/gis-alm-kwame-7921",
      status: "Confirmed",
      notes: "Discussing transition from LEGO Mindstorms to Arduino microcontrollers and high school scholarship requirements.",
      createdAt: "2026-10-20T10:00:00.000Z"
    }
  ];
}

function getInitialClubs() {
  return [
    {
      id: "clb-gis-robotics",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      name: "Robotics, AI & STEM Innovation Lab",
      category: "STEM & Technology",
      icon: "🤖",
      tagline: "Hands-on robotics engineering, LEGO Mindstorms, VEX Robotics, and Python algorithmic coding.",
      description: "GIS Innovation Lab provides competitive STEM training. Students engineer autonomous robots, program microcontrollers, solve real-world agricultural & energy problems, and represent Ghana in international robotics olympiads.",
      patron: {
        name: "Ing. Kofi Mensah-Bonsu",
        title: "Lead STEM & Robotics Master",
        phone: "+233 24 551 9021",
        email: "robotics@gis.edu.gh",
        avatar: "👨🏿‍🏫"
      },
      meetingSchedule: "Every Tuesday & Thursday, 03:45 PM - 05:15 PM",
      venue: "GIS Advanced Innovation Hub & Makerspace (Block C)",
      termFeeGHS: 450,
      capacity: 35,
      enrolledCount: 31,
      eligibleGrades: ["Class 4", "Class 5", "Class 6", "JHS 1", "JHS 2"],
      status: "Active (Term 1 Enrolling)",
      competitions: [
        {
          id: "comp-1",
          title: "National Inter-Schools First LEGO League Championship",
          date: "Saturday, 14 November 2026",
          venue: "National Theatre, Accra",
          opponentSchools: "GIS vs SOS-HGIC vs Lincoln vs Morning Star",
          status: "Confirmed Entry",
          focus: "Autonomous Maze Navigation & Rescue Rover"
        },
        {
          id: "comp-2",
          title: "West Africa Junior STEM & AI Summit",
          date: "Saturday, 12 December 2026",
          venue: "Ashesi University Engineering Quad, Berekuso",
          opponentSchools: "Ghana & Nigeria Secondary Champions",
          status: "Preliminary Selection",
          focus: "Solar Irrigation Automation Project"
        }
      ],
      roster: [
        {
          studentId: "std-kwame-2026",
          studentName: "Kwame Mensah",
          grade: "Primary Class 5",
          parentName: "Mrs. Nana Aba Mensah",
          parentPhone: "+233 24 431 8900",
          parentEmail: "parent@gmail.com",
          joinedDate: "2026-09-15",
          duesPaid: true,
          duesReceipt: "SD-MOMO-CLB-2026-9021",
          role: "Lead Autonomous Navigation Programmer",
          meritBadges: ["🤖 VEX Robotics Certified", "⚡ Algorithmic Logic Distinction", "🚀 2026 Rover Pilot"]
        },
        {
          studentId: "std-selorm-2026",
          studentName: "Selorm Kpodo",
          grade: "Primary Class 3",
          parentName: "Mr. Kwesi Kpodo",
          parentPhone: "+233 50 128 4401",
          parentEmail: "kwesi.kpodo@gmail.com",
          joinedDate: "2026-09-18",
          duesPaid: true,
          duesReceipt: "SD-MOMO-CLB-2026-8812",
          role: "Junior Mechanical Assembly Apprentice",
          meritBadges: ["⚙️ Gear Ratios & Motors"]
        }
      ]
    },
    {
      id: "clb-gis-debate",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      name: "Ghana National Debate Society & Model UN",
      category: "Debate & Public Speaking",
      icon: "🗣️",
      tagline: "Cultivating persuasive rhetoric, parliamentary debate, diplomacy, and global affairs mastery.",
      description: "Prepares young scholars for national debate tournaments and global Model United Nations conferences. Members master research, speech delivery, cross-examination, and parliamentary procedure.",
      patron: {
        name: "Mrs. Elizabeth Addo-Kufuor",
        title: "Head of Humanities & Speech Coach",
        phone: "+233 20 819 4430",
        email: "debate@gis.edu.gh",
        avatar: "👩🏿‍🏫"
      },
      meetingSchedule: "Every Wednesday, 03:30 PM - 05:00 PM",
      venue: "GIS Senior Assembly Amphitheatre",
      termFeeGHS: 350,
      capacity: 40,
      enrolledCount: 36,
      eligibleGrades: ["Class 5", "Class 6", "JHS 1", "JHS 2", "JHS 3", "SHS"],
      status: "Active (Term 1 Enrolling)",
      competitions: [
        {
          id: "comp-3",
          title: "Greater Accra Junior Debate Championship (Finals)",
          date: "Saturday, 21 November 2026",
          venue: "British Council Hall, Accra",
          opponentSchools: "GIS vs Achimota Basic vs Roman Ridge vs Ridge Church School",
          status: "Finalists Qualified",
          focus: "Motion: Artificial Intelligence in West African Agriculture"
        },
        {
          id: "comp-4",
          title: "Ghana Model United Nations General Assembly (GHAMUN)",
          date: "Friday, 05 December 2026",
          venue: "Accra International Conference Centre (AICC)",
          opponentSchools: "Over 25 West African Partner Schools",
          status: "Confirmed Delegates",
          focus: "UNICEF Sustainable Education Resolution"
        }
      ],
      roster: [
        {
          studentId: "std-kwame-2026",
          studentName: "Kwame Mensah",
          grade: "Primary Class 5",
          parentName: "Mrs. Nana Aba Mensah",
          parentPhone: "+233 24 431 8900",
          parentEmail: "parent@gmail.com",
          joinedDate: "2026-09-16",
          duesPaid: true,
          duesReceipt: "SD-MOMO-CLB-2026-7731",
          role: "Junior First Speaker (Propositions)",
          meritBadges: ["🏆 Oratory Distinction 2026", "💡 Rebuttal Specialist"]
        }
      ]
    },
    {
      id: "clb-gis-swimming",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      name: "Dolphins Aquatics & Competitive Swimming Academy",
      category: "Sports & Aquatics",
      icon: "🏊",
      tagline: "Olympic standard 25m heated pool training covering all 4 competitive strokes and water polo.",
      description: "Accredited by the Ghana Swimming Association. Focuses on cardiovascular endurance, stroke precision, flip turns, diving blocks, and junior water safety/lifesaving certifications.",
      patron: {
        name: "Coach Emmanuel Osei-Tutu",
        title: "Ghana Swimming Federation Certified Coach",
        phone: "+233 24 331 8891",
        email: "aquatics@gis.edu.gh",
        avatar: "🏊🏿‍♂️"
      },
      meetingSchedule: "Mondays & Fridays, 03:30 PM - 05:00 PM",
      venue: "GIS Olympic Aquatics Complex & Diving Pavilion",
      termFeeGHS: 550,
      capacity: 30,
      enrolledCount: 28,
      eligibleGrades: ["All Classes (Class 1 to SHS)"],
      status: "Active (Term 1)",
      competitions: [
        {
          id: "comp-5",
          title: "Accra Private Schools Inter-Campus Swimming Gala",
          date: "Saturday, 28 November 2026",
          venue: "Lincoln Community School Aquatic Pavilion",
          opponentSchools: "GIS vs Lincoln vs Roman Ridge vs Al-Rayan",
          status: "Team Registered",
          focus: "50m Freestyle & 4x50m Medley Relay"
        }
      ],
      roster: []
    },
    {
      id: "clb-gis-cadet",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      name: "GIS Army & Air Force Youth Cadet Corps",
      category: "Discipline & Leadership",
      icon: "🎖️",
      tagline: "Military-style drill parade, wilderness survival navigation, civic discipline, and national honors.",
      description: "Partnered with the Ghana Armed Forces 48 Engineers Regiment. Cadets learn ceremonial rifle-handling drills, compass orientation, emergency disaster response, physical conditioning, and leadership.",
      patron: {
        name: "Warrant Officer (Rtd.) Samuel Quaye",
        title: "Senior Cadet Corps Commandant",
        phone: "+233 26 441 2299",
        email: "cadet@gis.edu.gh",
        avatar: "💂🏿‍♂️"
      },
      meetingSchedule: "Every Friday, 03:30 PM - 05:15 PM",
      venue: "Main Campus Ceremonial Parade Ground",
      termFeeGHS: 400,
      capacity: 50,
      enrolledCount: 42,
      eligibleGrades: ["Class 4 through SHS 3"],
      status: "Active (Term 1)",
      competitions: [
        {
          id: "comp-6",
          title: "National Independence Day Parade Drill Inspection",
          date: "Friday, 06 March 2027",
          venue: "Black Star Square / Independence Arch, Accra",
          opponentSchools: "National Cadet Corps Inter-School Review",
          status: "Honor Guard Nominated",
          focus: "Ceremonial Precision Drill & Marching Band"
        }
      ],
      roster: []
    },
    {
      id: "clb-gis-chess",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      name: "Grandmasters Junior Chess & Strategic Mind Academy",
      category: "Mind Sports",
      icon: "♟️",
      tagline: "Master opening theory, tactical combinations, endgame precision, and tournament clock discipline.",
      description: "Affiliated with the Ghana Chess Association (GCA). Members learn Sicilian Defense, Queen's Gambit, tactical puzzle solving, and represent the school in national youth rating tournaments.",
      patron: {
        name: "FIDE Master John Kwesi Mensah",
        title: "National Master & Resident Chess Coach",
        phone: "+233 50 712 3345",
        email: "chess@gis.edu.gh",
        avatar: "🧙🏿‍♂️"
      },
      meetingSchedule: "Every Tuesday, 03:30 PM - 04:45 PM",
      venue: "Junior Library Conference & Quiet Study Suite",
      termFeeGHS: 300,
      capacity: 30,
      enrolledCount: 24,
      eligibleGrades: ["Class 2 through JHS 3"],
      status: "Active (Term 1)",
      competitions: [
        {
          id: "comp-7",
          title: "Ghana Youth Rapid Chess Championship",
          date: "Saturday, 28 November 2026",
          venue: "Theodosia Okoh Hockey Stadium VIP Lounge",
          opponentSchools: "Junior Players from 16 Regions",
          status: "Individual Swiss Qualifiers",
          focus: "Rapid 15+10 Rated Tournament"
        }
      ],
      roster: []
    },
    {
      id: "clb-gis-cultural",
      schoolId: "sch-gis-accra",
      schoolName: "Ghana International School (GIS)",
      name: "National Heritage Cultural Ensemble & Choral Troupe",
      category: "Creative & Performing Arts",
      icon: "🎭",
      tagline: "Traditional Ghanaian drumming (Fontomfrom, Kete, Adowa), choral harmony, and orchestral violin.",
      description: "Celebrates Ghana's rich heritage and classical arts. Students receive intensive masterclasses in indigenous drumming, traditional dance choreographies, brass instruments, and choral performances.",
      patron: {
        name: "Madam Akua Serwaa Boateng",
        title: "Head of Music & Creative Arts Conservatory",
        phone: "+233 24 991 4455",
        email: "performingarts@gis.edu.gh",
        avatar: "🎶"
      },
      meetingSchedule: "Every Thursday, 03:30 PM - 05:00 PM",
      venue: "GIS Music & Creative Arts Conservatory Hall",
      termFeeGHS: 350,
      capacity: 45,
      enrolledCount: 38,
      eligibleGrades: ["All Classes (Primary to SHS)"],
      status: "Active (Term 1)",
      competitions: [
        {
          id: "comp-8",
          title: "National Festival of Arts & Culture (NAFAC Showcase)",
          date: "Saturday, 12 December 2026",
          venue: "National Theatre Main Auditorium, Accra",
          opponentSchools: "Pan-African Schools Cultural Invitational",
          status: "Headliner Performance",
          focus: "Ashanti Kete & Ga Kpanlogo Cultural Suite"
        }
      ],
      roster: []
    }
  ];
}


class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.data = getInitialData();
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error("Error reading database, creating fresh one:", err);
        this.data = getInitialData();
        this.save();
      }
    }

    // Hydrate collections if missing in existing database.json
    let needsSave = false;
    if (!this.data.transactions || this.data.transactions.length === 0) {
      this.data.transactions = getInitialTransactions();
      needsSave = true;
    }
    if (!this.data.csspsSchools || this.data.csspsSchools.length === 0) {
      this.data.csspsSchools = getInitialCSSPSSchools();
      needsSave = true;
    }
    if (!this.data.verificationDocs) {
      this.data.verificationDocs = [];
      needsSave = true;
    }
    if (!this.data.admissionApplications || this.data.admissionApplications.length === 0) {
      this.data.admissionApplications = getInitialAdmissionApplications();
      needsSave = true;
    }
    if (!this.data.reviews || this.data.reviews.length === 0) {
      this.data.reviews = getInitialReviews();
      needsSave = true;
    }
    if (!this.data.inquiries || this.data.inquiries.length === 0) {
      this.data.inquiries = getInitialInquiries();
      needsSave = true;
    }
    if (!this.data.academicResources || this.data.academicResources.length === 0) {
      this.data.academicResources = getInitialAcademicResources();
      needsSave = true;
    }
    if (!this.data.invoices || this.data.invoices.length === 0) {
      this.data.invoices = getInitialInvoices();
      needsSave = true;
    }
    if (!this.data.smsLogs || this.data.smsLogs.length === 0) {
      this.data.smsLogs = getInitialSMSLogs();
      needsSave = true;
    }
    if (!this.data.smsCredits) {
      this.data.smsCredits = {
        "sch-gis-accra": 4850,
        "sch-sos-tema": 3200,
        "sch-morning-star-cantonments": 2500
      };
      needsSave = true;
    }
    if (!this.data.users || this.data.users.length === 0) {
      this.data.users = getInitialUsers();
      needsSave = true;
    }
    if (!this.data.sessions) {
      this.data.sessions = [];
      needsSave = true;
    }
    if (!this.data.bookmarks) {
      this.data.bookmarks = {
        "usr-parent-nana-aba": ["sch-gis-accra", "sch-morning-star-cantonments"]
      };
      needsSave = true;
    }
    if (!this.data.reportCards || this.data.reportCards.length === 0) {
      this.data.reportCards = getInitialReportCards();
      needsSave = true;
    }
    if (!this.data.transportRoutes || this.data.transportRoutes.length === 0) {
      this.data.transportRoutes = getInitialTransportRoutes();
      needsSave = true;
    }
    if (!this.data.studentBusPasses || this.data.studentBusPasses.length === 0) {
      this.data.studentBusPasses = getInitialStudentBusPasses();
      needsSave = true;
    }
    if (!this.data.clubs || this.data.clubs.length === 0) {
      this.data.clubs = getInitialClubs();
      needsSave = true;
    }
    if (!this.data.alumni || this.data.alumni.length === 0) {
      this.data.alumni = getInitialAlumni();
      needsSave = true;
    }
    if (!this.data.alumniBookings || this.data.alumniBookings.length === 0) {
      this.data.alumniBookings = getInitialAlumniBookings();
      needsSave = true;
    }
    if (!this.data.medicalRecords || this.data.medicalRecords.length === 0) {
      this.data.medicalRecords = getInitialMedicalRecords();
      needsSave = true;
    }
    if (!this.data.sickbayLogs || this.data.sickbayLogs.length === 0) {
      this.data.sickbayLogs = getInitialSickbayLogs();
      needsSave = true;
    }
    if (needsSave) {
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error("Failed to write database file:", err);
    }
  }

  // Schools
  getSchools(filters = {}) {
    let list = [...this.data.schools];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.suburb.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q) ||
        (s.motto && s.motto.toLowerCase().includes(q)) ||
        s.curriculum.some(c => c.toLowerCase().includes(q)) ||
        s.facilities.some(f => f.toLowerCase().includes(q)) ||
        s.description.toLowerCase().includes(q)
      );
    }

    if (filters.region && filters.region !== 'All') {
      list = list.filter(s => s.region.toLowerCase().includes(filters.region.toLowerCase()));
    }

    if (filters.suburb && filters.suburb !== 'All') {
      const sub = filters.suburb.toLowerCase().trim();
      list = list.filter(s => s.suburb.toLowerCase().includes(sub) || sub.includes(s.suburb.toLowerCase()));
    }

    if (filters.level && filters.level !== 'All') {
      list = list.filter(s => s.levels.some(lvl => lvl.toLowerCase() === filters.level.toLowerCase()));
    }

    if (filters.curriculum && filters.curriculum !== 'All') {
      list = list.filter(s => s.curriculum.some(curr => curr.toLowerCase().includes(filters.curriculum.toLowerCase())));
    }

    if (filters.boarding && filters.boarding !== 'All') {
      list = list.filter(s => s.boardingType.toLowerCase().includes(filters.boarding.toLowerCase()));
    }

    if (filters.feeBand && filters.feeBand !== 'All') {
      list = list.filter(s => s.feeBand.toLowerCase().includes(filters.feeBand.toLowerCase()));
    }

    if (filters.facility && filters.facility !== 'All') {
      list = list.filter(s => s.facilities.some(fac => fac.toLowerCase().includes(filters.facility.toLowerCase())));
    }

    return list;
  }

  getSchoolById(id) {
    return this.data.schools.find(s => s.id === id || s.slug === id);
  }

  addSchool(schoolData) {
    const id = "sch-" + Date.now();
    const slug = (schoolData.name || "school").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newSchool = {
      id,
      slug,
      verified: false,
      claimed: true,
      packageTier: schoolData.packageTier || "Basic",
      coverImage: schoolData.coverImage || "/assets/images/campus_hero.jpg",
      bannerType: "ges",
      admissionsStatus: "Admissions Open 2026/2027",
      facilities: schoolData.facilities || ["School Bus", "Science Lab", "ICT Lab"],
      levels: schoolData.levels || ["Primary"],
      curriculum: schoolData.curriculum || ["GES Standards-based"],
      boardingType: schoolData.boardingType || "Day Only",
      feeBand: schoolData.feeBand || "Moderate (GH₵ 1,500 - 4,000)",
      ...schoolData
    };
    this.data.schools.unshift(newSchool);
    this.save();
    return newSchool;
  }

  recordLead(schoolId, type) {
    const lead = {
      id: "lead-" + Date.now(),
      schoolId,
      type, // 'whatsapp_reveal' | 'call_click' | 'view'
      timestamp: new Date().toISOString()
    };
    this.data.leads.push(lead);
    this.save();
    return lead;
  }

  getSchoolAnalytics(schoolId) {
    const schoolLeads = this.data.leads.filter(l => l.schoolId === schoolId);
    return {
      totalViews: schoolLeads.filter(l => l.type === 'view').length + 48, // seed realistic base
      whatsappReveals: schoolLeads.filter(l => l.type === 'whatsapp_reveal').length + 19,
      callClicks: schoolLeads.filter(l => l.type === 'call_click').length + 11
    };
  }

  claimSchool(claimData) {
    const claim = {
      id: "clm-" + Date.now(),
      status: "pending",
      timestamp: new Date().toISOString(),
      ...claimData
    };
    this.data.claims.push(claim);
    this.save();
    return claim;
  }

  // Suppliers & RFQs
  getSuppliers(category = null) {
    if (!category || category === 'All') return this.data.suppliers;
    return this.data.suppliers.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }

  addSupplier(data) {
    const newSup = {
      id: "sup-" + Date.now(),
      verified: true,
      ratingBadge: "Verified Supplier",
      catalogHighlights: data.catalogHighlights || ["Quality School Supplies"],
      ...data
    };
    this.data.suppliers.unshift(newSup);
    this.save();
    return newSup;
  }

  getRFQs() {
    return this.data.rfqs;
  }

  addRFQ(data) {
    const newRfq = {
      id: "rfq-" + Date.now(),
      status: "Open for Bids",
      quotesReceived: 0,
      createdAt: new Date().toISOString(),
      ...data
    };
    this.data.rfqs.unshift(newRfq);
    this.save();
    return newRfq;
  }

  submitQuote(quoteData) {
    const newQuote = {
      id: "quote-" + Date.now(),
      status: "Pending Review",
      createdAt: new Date().toISOString(),
      ...quoteData
    };
    this.data.quotes.push(newQuote);

    // update rfq quote count
    const rfq = this.data.rfqs.find(r => r.id === quoteData.rfqId);
    if (rfq) {
      rfq.quotesReceived = (rfq.quotesReceived || 0) + 1;
    }
    this.save();
    return newQuote;
  }

  // Jobs
  getJobs(filters = {}) {
    let list = [...this.data.jobs];
    if (filters.subject && filters.subject !== 'All') {
      list = list.filter(j => j.title.toLowerCase().includes(filters.subject.toLowerCase()));
    }
    if (filters.region && filters.region !== 'All') {
      list = list.filter(j => j.region.toLowerCase() === filters.region.toLowerCase());
    }
    if (filters.level && filters.level !== 'All') {
      list = list.filter(j => j.level.toLowerCase().includes(filters.level.toLowerCase()));
    }
    if (filters.curriculum && filters.curriculum !== 'All') {
      list = list.filter(j => j.curriculum.toLowerCase().includes(filters.curriculum.toLowerCase()));
    }
    return list;
  }

  addJob(jobData) {
    const newJob = {
      id: "job-" + Date.now(),
      status: "Actively Hiring",
      applicantsCount: 0,
      createdAt: new Date().toISOString(),
      ...jobData
    };
    this.data.jobs.unshift(newJob);
    this.save();
    return newJob;
  }

  applyJob(applicationData) {
    const app = {
      id: "app-" + Date.now(),
      timestamp: new Date().toISOString(),
      ...applicationData
    };
    this.data.jobApplications.push(app);

    const job = this.data.jobs.find(j => j.id === applicationData.jobId);
    if (job) {
      job.applicantsCount = (job.applicantsCount || 0) + 1;
    }
    this.save();
    return app;
  }

  // Teachers & Tutors Directory & Subscription
  getTeachers(filters = {}) {
    if (!this.data.teachers) this.data.teachers = [];
    let list = [...this.data.teachers];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(t =>
        t.fullName.toLowerCase().includes(q) ||
        t.headline.toLowerCase().includes(q) ||
        t.suburb.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q) ||
        t.subjects.some(s => s.toLowerCase().includes(q))
      );
    }

    if (filters.subject && filters.subject !== 'All') {
      const sLower = filters.subject.toLowerCase();
      list = list.filter(t => t.subjects.some(sub => sub.toLowerCase().includes(sLower)));
    }

    if (filters.region && filters.region !== 'All') {
      list = list.filter(t => t.region.toLowerCase() === filters.region.toLowerCase());
    }

    if (filters.level && filters.level !== 'All') {
      list = list.filter(t => t.levels.some(l => l.toLowerCase() === filters.level.toLowerCase()));
    }

    if (filters.curriculum && filters.curriculum !== 'All') {
      list = list.filter(t => t.curricula.some(c => c.toLowerCase().includes(filters.curriculum.toLowerCase())));
    }

    if (filters.teachingMode && filters.teachingMode !== 'All') {
      list = list.filter(t => t.teachingModes.some(m => m.toLowerCase().includes(filters.teachingMode.toLowerCase())));
    }

    return list;
  }

  getTeacherById(id) {
    if (!this.data.teachers) this.data.teachers = [];
    return this.data.teachers.find(t => t.id === id);
  }

  addTeacher(data) {
    if (!this.data.teachers) this.data.teachers = [];
    const id = "tch-" + Date.now();
    const newTeacher = {
      id,
      verified: true,
      subscriptionTier: data.subscriptionTier || "Standard",
      ratingBadge: data.licenseNumber ? "NTC Certified Educator" : "Verified Educator",
      subjects: Array.isArray(data.subjects) ? data.subjects : [data.subjects || "General Subjects"],
      curricula: Array.isArray(data.curricula) ? data.curricula : [data.curricula || "GES Standards-based"],
      levels: Array.isArray(data.levels) ? data.levels : [data.levels || "Primary"],
      teachingModes: Array.isArray(data.teachingModes) ? data.teachingModes : [data.teachingModes || "Home Tutoring"],
      createdAt: new Date().toISOString(),
      ...data
    };
    this.data.teachers.unshift(newTeacher);
    this.save();
    return newTeacher;
  }

  recordTeacherLead(teacherId, type) {
    const lead = {
      id: "tch-lead-" + Date.now(),
      teacherId,
      type, // 'whatsapp' | 'call' | 'view'
      timestamp: new Date().toISOString()
    };
    if (!this.data.leads) this.data.leads = [];
    this.data.leads.push(lead);
    this.save();
    return lead;
  }

  // Institutional Verification & KYC/KYB Document Vault
  uploadVerificationDoc(data) {
    if (!this.data.verificationDocs) this.data.verificationDocs = [];
    const doc = {
      id: "doc-" + Date.now(),
      status: "Verified", // auto-verified for demo, standard flow
      verifiedAt: new Date().toISOString(),
      ...data
    };
    this.data.verificationDocs.unshift(doc);

    // If it's for a school, mark school verified
    if (data.entityType === 'school') {
      const school = this.data.schools.find(s => s.id === data.entityId);
      if (school) school.verified = true;
    }
    // If it's for a teacher, mark teacher verified
    if (data.entityType === 'teacher') {
      const teacher = (this.data.teachers || []).find(t => t.id === data.entityId);
      if (teacher) teacher.verified = true;
    }

    this.save();
    return doc;
  }

  getVerificationDocs(entityId) {
    if (!this.data.verificationDocs) this.data.verificationDocs = [];
    if (!entityId) return this.data.verificationDocs;
    return this.data.verificationDocs.filter(d => d.entityId === entityId);
  }

  // Payments & Mobile Money Gateway (Feature 1)
  initializePayment(data) {
    if (!this.data.transactions) this.data.transactions = [];
    const reference = 'SD-PAY-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
    const tx = {
      id: 'tx-' + Date.now(),
      reference,
      amount: Number(data.amount) || 0,
      currency: 'GHS',
      purpose: data.purpose || 'subscription',
      payerName: data.payerName || 'Anonymous Payer',
      payerPhone: data.payerPhone || '',
      network: data.network || 'MTN MoMo',
      targetId: data.targetId || null,
      targetTitle: data.targetTitle || 'SchoolDirect Service',
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    this.data.transactions.unshift(tx);
    this.save();
    return tx;
  }

  verifyPayment(reference, networkDetails = {}) {
    if (!this.data.transactions) this.data.transactions = [];
    const tx = this.data.transactions.find(t => t.reference === reference);
    if (!tx) {
      throw new Error(`Transaction with reference ${reference} not found`);
    }

    tx.status = 'success';
    tx.network = networkDetails.network || tx.network;
    tx.receiptNumber = 'SD-REC-' + Date.now().toString().slice(-8);
    tx.completedAt = new Date().toISOString();
    tx.authCode = networkDetails.authCode || 'MOMO-GH-' + Math.floor(100000 + Math.random() * 900000);

    // Platform side-effects based on purpose:
    if (tx.purpose === 'teacher_subscription' && tx.targetId) {
      const teacher = (this.data.teachers || []).find(t => t.id === tx.targetId);
      if (teacher) {
        teacher.subscriptionTier = 'Featured Pro';
        teacher.verified = true;
        teacher.featured = true;
        teacher.proSubscriptionActive = true;
      }
    } else if (tx.purpose === 'school_premium' && tx.targetId) {
      const school = this.data.schools.find(s => s.id === tx.targetId);
      if (school) {
        school.packageTier = 'Premium';
        school.verified = true;
        school.featured = true;
      }
    } else if (tx.purpose === 'admission_form') {
      tx.voucherCode = 'SD-ADM-' + Math.floor(100000 + Math.random() * 900000);
    }

    this.save();
    return tx;
  }

  getTransaction(reference) {
    if (!this.data.transactions) this.data.transactions = [];
    return this.data.transactions.find(t => t.reference === reference);
  }

  getTransactions(targetId = null) {
    if (!this.data.transactions) this.data.transactions = [];
    if (!targetId) return this.data.transactions;
    return this.data.transactions.filter(t => t.targetId === targetId);
  }

  // CSSPS Senior High School Directory & BECE Placement Predictor (Feature 2)
  getCSSPSSchools(filters = {}) {
    if (!this.data.csspsSchools) this.data.csspsSchools = [];
    let list = [...this.data.csspsSchools];

    if (filters.category && filters.category !== 'All') {
      list = list.filter(s => s.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.region && filters.region !== 'All') {
      list = list.filter(s => s.region.toLowerCase() === filters.region.toLowerCase());
    }
    if (filters.gender && filters.gender !== 'All') {
      list = list.filter(s => s.gender.toLowerCase() === filters.gender.toLowerCase() || s.gender === 'Co-educational');
    }
    if (filters.program && filters.program !== 'All') {
      list = list.filter(s => (s.programs || []).some(p => p.toLowerCase().includes(filters.program.toLowerCase())));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.suburb.toLowerCase().includes(q) ||
        (s.motto && s.motto.toLowerCase().includes(q))
      );
    }
    return list;
  }

  calculateCSSPSPlacement(inputs) {
    const english = Number(inputs.english) || 9;
    const maths = Number(inputs.maths) || 9;
    const science = Number(inputs.science) || 9;
    const social = Number(inputs.social) || 9;

    const elective1 = Number(inputs.elective1) || 9;
    const elective2 = Number(inputs.elective2) || 9;
    const elective3 = inputs.elective3 ? Number(inputs.elective3) : null;
    const elective4 = inputs.elective4 ? Number(inputs.elective4) : null;

    // Determine 2 best electives
    let allElectives = [elective1, elective2];
    if (elective3) allElectives.push(elective3);
    if (elective4) allElectives.push(elective4);
    allElectives.sort((a, b) => a - b);
    const bestElective1 = allElectives[0];
    const bestElective2 = allElectives[1];

    const coreAggregate = english + maths + science + social;
    const electivesAggregate = bestElective1 + bestElective2;
    const totalAggregate = coreAggregate + electivesAggregate;

    // Remarks and Eligibility Evaluation according to GES/WAEC Guidelines
    let remark = "Qualified for Secondary Education";
    let eligibilityGrade = "Grade A Distinction";
    let alertType = "success";
    let advisoryNotes = [];

    if (totalAggregate <= 9) {
      remark = "Exceptional Distinction (Grade 1s Standard)";
      eligibilityGrade = "Elite Category A Candidate";
      advisoryNotes.push("Prime candidate for premier Category A science and arts institutions (Presec, Achimota, Wey Gey Hey, Prempeh).");
    } else if (totalAggregate <= 15) {
      remark = "High Honors & Strong Merit";
      eligibilityGrade = "Category A & Top Category B Candidate";
      advisoryNotes.push("Strong competitive placement probability in Category A and premier Category B boarding schools.");
    } else if (totalAggregate <= 24) {
      remark = "Solid Placement Qualification";
      eligibilityGrade = "Category B & Category C Fit";
      advisoryNotes.push("Solid foundation for Category B day/boarding and Category C secondary schools.");
    } else if (totalAggregate <= 32) {
      remark = "Standard Qualification / TVET Focus";
      eligibilityGrade = "Category C & Technical/Vocational";
      advisoryNotes.push("Recommended to choose strong Category C institutions and practical TVET technical centers.");
    } else {
      remark = "Self-Placement Advisory Alert";
      eligibilityGrade = "Self-Placement Candidate";
      alertType = "warning";
      advisoryNotes.push("Score exceeds standard Category A/B thresholds. Utilize the GES CSSPS Self-Placement module to select available Category C/D or Day vacancies.");
    }

    // Core validation warnings (WAEC / GES Rules)
    const hasCoreGrade9 = english === 9 || maths === 9 || science === 9 || social === 9;
    const hasEnglishOrMathsDeficit = english > 6 || maths > 6;

    if (hasCoreGrade9) {
      advisoryNotes.push("⚠️ Alert: Grade 9 in any core subject restricts automatic placement in Category A and B boarding institutions per GES CSSPS guidelines.");
    } else if (hasEnglishOrMathsDeficit) {
      advisoryNotes.push("ℹ️ Note: Core English or Mathematics grade above 6 may limit admission into General Science programs at top Category A schools.");
    }

    const preferredProgram = inputs.program || 'All';
    const preferredRegion = inputs.preferredRegion || 'All';
    const applicantGender = inputs.gender || 'All';

    // Filter candidate schools from database
    const allSchools = this.getCSSPSSchools();
    const candidateSchools = allSchools.filter(school => {
      // Gender filter
      if (applicantGender === 'Male' && school.gender === 'Girls') return false;
      if (applicantGender === 'Female' && school.gender === 'Boys') return false;

      // Program check if specified
      if (preferredProgram !== 'All') {
        const offersProgram = (school.programs || []).some(p => p.toLowerCase().includes(preferredProgram.toLowerCase()));
        if (!offersProgram) return false;
      }
      return true;
    });

    // Score feasibility calculation for each school
    function evaluateFeasibility(school) {
      let probability = 85;
      let label = "Strong Match";
      let badgeClass = "badge-verified";

      if (totalAggregate <= school.cutoffMin) {
        probability = 95;
        label = "High Probability (Safe)";
        badgeClass = "badge-emerald";
      } else if (totalAggregate <= school.cutoffMax) {
        probability = 75;
        label = "Competitive Fit (Target)";
        badgeClass = "badge-gold";
      } else if (totalAggregate <= school.cutoffMax + 2) {
        probability = 50;
        label = "Feasible (Reach)";
        badgeClass = "badge-blue";
      } else {
        probability = 25;
        label = "High Competition (Stretch)";
        badgeClass = "badge-rose";
      }

      // Bonus if matches preferred region
      const isPreferredRegion = preferredRegion !== 'All' && school.region.toLowerCase() === preferredRegion.toLowerCase();

      return {
        ...school,
        probability,
        feasibilityLabel: label,
        badgeClass,
        isPreferredRegion
      };
    }

    const evaluatedSchools = candidateSchools.map(evaluateFeasibility);

    // Sort matching schools: preferred region first, then higher probability
    evaluatedSchools.sort((a, b) => {
      if (a.isPreferredRegion && !b.isPreferredRegion) return -1;
      if (!a.isPreferredRegion && b.isPreferredRegion) return 1;
      return b.probability - a.probability;
    });

    const categoryA = evaluatedSchools.filter(s => s.category === 'Category A');
    const categoryB = evaluatedSchools.filter(s => s.category === 'Category B');
    const categoryC = evaluatedSchools.filter(s => s.category === 'Category C');

    // Strategic GES Official 6-School Selection Plan
    const selectionPlan = [
      {
        choiceNumber: 1,
        allowedCategory: "Category A",
        description: "1st Choice (Premier Aspirant Choice)",
        recommendedSchool: categoryA[0] || (allSchools.find(s => s.category === 'Category A') || null),
        advice: "Choose your dream Category A institution. Maximum of 1 Category A school allowed in CSSPS."
      },
      {
        choiceNumber: 2,
        allowedCategory: "Category B",
        description: "2nd Choice (Competitive Target)",
        recommendedSchool: categoryB[0] || (allSchools.find(s => s.category === 'Category B') || null),
        advice: "Select a reputable Category B school where your aggregate is comfortably within cutoff."
      },
      {
        choiceNumber: 3,
        allowedCategory: "Category B",
        description: "3rd Choice (Solid Anchor)",
        recommendedSchool: categoryB[1] || categoryB[0] || null,
        advice: "A secondary Category B choice to protect your placement in competitive regions."
      },
      {
        choiceNumber: 4,
        allowedCategory: "Category C",
        description: "4th Choice (Safe Foundation)",
        recommendedSchool: categoryC[0] || (allSchools.find(s => s.category === 'Category C') || null),
        advice: "Standard Category C institution guaranteeing automatic matriculation."
      },
      {
        choiceNumber: 5,
        allowedCategory: "Category C (Day)",
        description: "5th Choice (Mandatory Day / Catchment)",
        recommendedSchool: categoryC.find(s => s.boardingType && s.boardingType.includes('Day')) || categoryC[0] || null,
        advice: "Mandatory compulsory Day school located within your home district/catchment area."
      },
      {
        choiceNumber: 6,
        allowedCategory: "TVET / Technical",
        description: "6th Choice (Vocational / Technical)",
        recommendedSchool: allSchools.find(s => s.programs && s.programs.includes('Technical')) || null,
        advice: "TVET / STEM Technical pathway institution offering hands-on trade certification."
      }
    ];

    return {
      scores: {
        english,
        maths,
        science,
        social,
        coreAggregate,
        bestElective1,
        bestElective2,
        electivesAggregate,
        totalAggregate
      },
      evaluation: {
        remark,
        eligibilityGrade,
        alertType,
        advisoryNotes,
        hasCoreGrade9,
        hasEnglishOrMathsDeficit
      },
      recommendations: {
        totalMatches: evaluatedSchools.length,
        categoryA,
        categoryB,
        categoryC,
        selectionPlan
      }
    };
  }

  // Digital Student Admissions & Enrollment Management (Feature #1)
  getAdmissionApplications(schoolId, filters = {}) {
    let list = this.data.admissionApplications || [];
    if (schoolId) {
      list = list.filter(a => a.schoolId === schoolId);
    }
    if (filters.status && filters.status !== 'All') {
      list = list.filter(a => a.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(a =>
        (a.student && a.student.fullName && a.student.fullName.toLowerCase().includes(q)) ||
        (a.applicationNumber && a.applicationNumber.toLowerCase().includes(q)) ||
        (a.parentGuardian && a.parentGuardian.primaryGuardianName && a.parentGuardian.primaryGuardianName.toLowerCase().includes(q)) ||
        (a.gradeApplying && a.gradeApplying.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getAdmissionApplicationById(id) {
    const list = this.data.admissionApplications || [];
    return list.find(a => a.id === id || a.applicationNumber === id) || null;
  }

  createAdmissionApplication(data) {
    if (!this.data.admissionApplications) this.data.admissionApplications = [];
    const school = this.getSchoolById(data.schoolId);
    if (!school) throw new Error("Target school not found");

    const appNumber = `SD-ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp = {
      id: `app-${Date.now()}`,
      applicationNumber: appNumber,
      schoolId: school.id,
      schoolName: school.name,
      termApplied: data.termApplied || 'Term 1 (September 2026)',
      gradeApplying: data.gradeApplying,
      curriculum: data.curriculum || school.curriculum[0] || 'Cambridge',
      status: 'Received',
      entranceExamDate: 'Pending Review by Admissions Desk',
      createdAt: new Date().toISOString(),
      student: {
        fullName: data.studentName,
        gender: data.gender || 'Not specified',
        dateOfBirth: data.dateOfBirth || '2018-01-01',
        nationality: data.nationality || 'Ghanaian',
        religiousAffiliation: data.religiousAffiliation || 'Christian',
        bloodGroup: data.bloodGroup || 'O+',
        allergies: data.allergies || 'None declared',
        emergencyContact: data.emergencyContact || data.parentPhone
      },
      previousSchool: {
        schoolName: data.previousSchool || 'First time school entry',
        lastClassPassed: data.lastClassPassed || 'Kindergarten',
        reasonForTransfer: data.reasonForTransfer || 'Enrollment progression'
      },
      parentGuardian: {
        primaryGuardianName: data.parentName,
        relationship: data.relationship || 'Parent / Guardian',
        occupation: data.occupation || 'Professional',
        residentialAddress: data.residentialAddress || school.suburb,
        phone: data.parentPhone,
        whatsapp: data.parentWhatsapp || data.parentPhone,
        email: data.parentEmail || '',
        secondaryContactName: data.secondaryContactName || '',
        secondaryPhone: data.secondaryPhone || ''
      },
      documentsSubmitted: data.documentsSubmitted || [
        { docType: "Birth Certificate", fileName: "birth_cert_" + data.studentName.toLowerCase().replace(/[^a-z0-9]/g, '_') + ".pdf", verified: true },
        { docType: "Immunization Card", fileName: "immunization_record.pdf", verified: true }
      ],
      adminNotes: data.specialNotes || 'Submitted via SchoolDirect Digital Admissions Portal.',
      decisionDate: null
    };

    this.data.admissionApplications.unshift(newApp);
    this.recordLead(school.id, 'admission_application');
    this.save();
    return newApp;
  }

  updateAdmissionApplicationStatus(id, updateData) {
    if (!this.data.admissionApplications) this.data.admissionApplications = [];
    const app = this.data.admissionApplications.find(a => a.id === id || a.applicationNumber === id);
    if (!app) throw new Error("Application not found");

    if (updateData.status) app.status = updateData.status;
    if (updateData.adminNotes) app.adminNotes = updateData.adminNotes;
    if (updateData.entranceExamDate) app.entranceExamDate = updateData.entranceExamDate;
    if (updateData.status === 'Admitted' || updateData.status === 'Enrolled') {
      app.decisionDate = new Date().toISOString();
    }
    this.save();
    return app;
  }

  getAdmissionOfferLetter(id) {
    const app = this.getAdmissionApplicationById(id);
    if (!app) throw new Error("Application not found");
    const school = this.getSchoolById(app.schoolId);
    if (!school) throw new Error("School not found");

    return {
      applicationNumber: app.applicationNumber,
      studentName: app.student.fullName,
      parentName: app.parentGuardian.primaryGuardianName,
      parentAddress: app.parentGuardian.residentialAddress,
      schoolName: school.name,
      schoolMotto: school.motto || 'Striving for Academic Excellence',
      schoolAddress: school.address,
      schoolPhone: school.phone,
      schoolEmail: school.email,
      headOfSchool: school.headOfSchool || 'Head of School / Director',
      gradeOffered: app.gradeApplying,
      curriculum: app.curriculum,
      termApplied: app.termApplied,
      tuitionBase: school.tuitionBase || 4500,
      reportingDate: "Monday, 7th September 2026",
      orientationDate: "Friday, 4th September 2026",
      provisionalConditions: [
        "Presentation of original Birth Certificate & Passport Biodata Page for physical verification.",
        "Submission of certified medical fitness clearance from an accredited Ghanaian clinic.",
        "Payment of Term 1 tuition commitment on or before Friday, 28th August 2026 to secure student seat."
      ],
      issueDate: app.decisionDate ? new Date(app.decisionDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
      offerId: "OFFER-" + app.applicationNumber.replace('SD-ADM-', '')
    };
  }

  // Feature 2: Verified Reviews & Ratings
  getReviews(schoolId = null, filters = {}) {
    if (!this.data.reviews) this.data.reviews = [];
    let list = [...this.data.reviews];

    if (schoolId) {
      list = list.filter(r => r.schoolId === schoolId);
    }

    if (filters.rating && filters.rating !== 'All') {
      const minStars = parseInt(filters.rating, 10);
      list = list.filter(r => Math.floor(r.overallRating) === minStars);
    }

    if (filters.verifiedOnly === 'true' || filters.verifiedOnly === true) {
      list = list.filter(r => r.verifiedBadge === true);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(r =>
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.content && r.content.toLowerCase().includes(q)) ||
        (r.authorName && r.authorName.toLowerCase().includes(q))
      );
    }

    // Sort
    if (filters.sort === 'highest') {
      list.sort((a, b) => b.overallRating - a.overallRating);
    } else if (filters.sort === 'helpful') {
      list.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    } else {
      // Default: newest first
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }

  getSchoolRatingSummary(schoolId) {
    const reviews = this.getReviews(schoolId);
    if (!reviews || reviews.length === 0) {
      return {
        totalReviews: 0,
        averageOverall: 0,
        dimensions: {
          academics: 0,
          facilities: 0,
          discipline: 0,
          valueForMoney: 0,
          communication: 0
        },
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const total = reviews.length;
    const sumOverall = reviews.reduce((sum, r) => sum + (r.overallRating || 0), 0);
    const sumAcademics = reviews.reduce((sum, r) => sum + (r.dimensions?.academics || r.overallRating || 0), 0);
    const sumFacilities = reviews.reduce((sum, r) => sum + (r.dimensions?.facilities || r.overallRating || 0), 0);
    const sumDiscipline = reviews.reduce((sum, r) => sum + (r.dimensions?.discipline || r.overallRating || 0), 0);
    const sumValue = reviews.reduce((sum, r) => sum + (r.dimensions?.valueForMoney || r.overallRating || 0), 0);
    const sumComm = reviews.reduce((sum, r) => sum + (r.dimensions?.communication || r.overallRating || 0), 0);

    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.overallRating)));
      dist[star] = (dist[star] || 0) + 1;
    });

    return {
      totalReviews: total,
      averageOverall: Number((sumOverall / total).toFixed(1)),
      dimensions: {
        academics: Number((sumAcademics / total).toFixed(1)),
        facilities: Number((sumFacilities / total).toFixed(1)),
        discipline: Number((sumDiscipline / total).toFixed(1)),
        valueForMoney: Number((sumValue / total).toFixed(1)),
        communication: Number((sumComm / total).toFixed(1))
      },
      distribution: dist
    };
  }

  addSchoolReview(data) {
    if (!this.data.reviews) this.data.reviews = [];
    const school = this.getSchoolById(data.schoolId);
    if (!school) throw new Error("School not found");

    if (!data.authorName) throw new Error("Reviewer name is required");
    const overall = parseFloat(data.overallRating);
    if (isNaN(overall) || overall < 1 || overall > 5) {
      throw new Error("Rating must be between 1 and 5 stars");
    }

    const newReview = {
      id: "rev-" + Date.now(),
      schoolId: school.id,
      schoolName: school.name,
      authorName: data.authorName.trim(),
      affiliation: data.affiliation || "Verified Current Parent",
      wardGrade: data.wardGrade || "Primary School",
      verifiedBadge: true,
      overallRating: Number(overall.toFixed(1)),
      dimensions: {
        academics: parseInt(data.academics || data.overallRating, 10),
        facilities: parseInt(data.facilities || data.overallRating, 10),
        discipline: parseInt(data.discipline || data.overallRating, 10),
        valueForMoney: parseInt(data.valueForMoney || data.overallRating, 10),
        communication: parseInt(data.communication || data.overallRating, 10)
      },
      title: data.title ? data.title.trim() : "Comprehensive Review for " + school.name,
      content: data.content ? data.content.trim() : "Great academic standard and student support.",
      highlights: Array.isArray(data.highlights) ? data.highlights : (data.highlights ? [data.highlights] : ["Dedicated Faculty", "Safe Campus"]),
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      officialReply: null
    };

    this.data.reviews.unshift(newReview);
    this.recordLead(school.id, 'parent_review');
    this.save();
    return newReview;
  }

  voteReviewHelpful(reviewId) {
    if (!this.data.reviews) this.data.reviews = [];
    const review = this.data.reviews.find(r => r.id === reviewId);
    if (!review) throw new Error("Review not found");

    review.helpfulCount = (review.helpfulCount || 0) + 1;
    this.save();
    return review;
  }

  addReviewReply(reviewId, replyData) {
    if (!this.data.reviews) this.data.reviews = [];
    const review = this.data.reviews.find(r => r.id === reviewId);
    if (!review) throw new Error("Review not found");

    review.officialReply = {
      author: replyData.author || "Head of School",
      role: replyData.role || "School Administration",
      date: new Date().toISOString(),
      message: (replyData.message || "").trim()
    };

    this.save();
    return review;
  }

  // Feature 3: Direct Admissions Inquiries & School-to-Parent Messaging Center
  getInquiries(schoolId, filters = {}) {
    if (!this.data.inquiries) this.data.inquiries = [];
    let list = [...this.data.inquiries];

    if (schoolId) {
      list = list.filter(i => i.schoolId === schoolId);
    }

    if (filters.status && filters.status !== 'All') {
      list = list.filter(i => i.status.toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.category && filters.category !== 'All') {
      list = list.filter(i => i.category.toLowerCase().includes(filters.category.toLowerCase()));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(i =>
        i.parentName.toLowerCase().includes(q) ||
        i.inquiryNumber.toLowerCase().includes(q) ||
        (i.studentName && i.studentName.toLowerCase().includes(q)) ||
        (i.subject && i.subject.toLowerCase().includes(q)) ||
        (i.message && i.message.toLowerCase().includes(q)) ||
        (i.parentPhone && i.parentPhone.includes(q)) ||
        (i.gradeApplying && i.gradeApplying.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getInquiryById(id) {
    if (!this.data.inquiries) this.data.inquiries = [];
    return this.data.inquiries.find(i => i.id === id || i.inquiryNumber.toUpperCase() === id.toUpperCase()) || null;
  }

  createInquiry(data) {
    if (!this.data.inquiries) this.data.inquiries = [];
    const school = this.getSchoolById(data.schoolId);
    if (!school) throw new Error("Target school not found");

    if (!data.parentName || !data.parentName.trim()) throw new Error("Parent/Guardian name is required");
    if (!data.parentPhone || !data.parentPhone.trim()) throw new Error("Contact phone number is required");
    if (!data.message || !data.message.trim()) throw new Error("Inquiry message cannot be empty");

    const schoolCode = school.slug ? school.slug.replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase() : 'SCH';
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const inqNumber = `INQ-${schoolCode}-2026-${randCode}`;

    const newInquiry = {
      id: `inq-${Date.now()}`,
      inquiryNumber: inqNumber,
      schoolId: school.id,
      schoolName: school.name,
      parentName: data.parentName.trim(),
      parentPhone: data.parentPhone.trim(),
      parentWhatsapp: (data.parentWhatsapp || data.parentPhone).trim(),
      parentEmail: (data.parentEmail || "").trim(),
      studentName: (data.studentName || "Prospective Student").trim(),
      gradeApplying: data.gradeApplying || "Primary / Secondary",
      category: data.category || "General Admissions",
      tourRequested: !!data.tourRequested,
      preferredTourDate: data.preferredTourDate || null,
      preferredTourTime: data.preferredTourTime || null,
      subject: (data.subject || `Inquiry regarding admissions for ${data.studentName || 'our child'}`).trim(),
      message: data.message.trim(),
      status: "Unread",
      createdAt: new Date().toISOString(),
      replies: []
    };

    this.data.inquiries.unshift(newInquiry);
    this.recordLead(school.id, 'parent_inquiry');
    this.save();
    return newInquiry;
  }

  replyToInquiry(inquiryId, replyData) {
    if (!this.data.inquiries) this.data.inquiries = [];
    const inquiry = this.getInquiryById(inquiryId);
    if (!inquiry) throw new Error("Inquiry thread not found");

    if (!replyData.message || !replyData.message.trim()) {
      throw new Error("Reply message cannot be empty");
    }

    const reply = {
      id: `rep-${Date.now()}`,
      sender: replyData.sender || 'school',
      senderName: (replyData.senderName || 'Admissions Desk').trim(),
      senderRole: (replyData.senderRole || 'School Administration').trim(),
      message: replyData.message.trim(),
      timestamp: new Date().toISOString()
    };

    inquiry.replies.push(reply);

    // Update status
    if (replyData.newStatus) {
      inquiry.status = replyData.newStatus;
    } else if (inquiry.tourRequested && replyData.message.toLowerCase().includes('confirm')) {
      inquiry.status = 'Tour Scheduled';
    } else {
      inquiry.status = 'Replied';
    }

    this.save();
    return inquiry;
  }

  updateInquiryStatus(inquiryId, updateData) {
    if (!this.data.inquiries) this.data.inquiries = [];
    const inquiry = this.getInquiryById(inquiryId);
    if (!inquiry) throw new Error("Inquiry not found");

    if (updateData.status) inquiry.status = updateData.status;
    if (updateData.adminNotes) inquiry.adminNotes = updateData.adminNotes;
    if (updateData.confirmedTourDate) inquiry.confirmedTourDate = updateData.confirmedTourDate;

    this.save();
    return inquiry;
  }

  getInquiryStats(schoolId) {
    const list = this.getInquiries(schoolId);
    return {
      total: list.length,
      unread: list.filter(i => i.status === 'Unread').length,
      tourRequests: list.filter(i => i.tourRequested || (i.category && i.category.toLowerCase().includes('tour'))).length,
      replied: list.filter(i => i.status === 'Replied' || i.status === 'Tour Scheduled').length,
      resolved: list.filter(i => i.status === 'Resolved').length
    };
  }

  // Feature 4: WAEC/BECE/WASSCE & Cambridge Past Questions and Academic Resource Hub
  getAcademicResources(filters = {}) {
    if (!this.data.academicResources) this.data.academicResources = [];
    let list = [...this.data.academicResources];

    if (filters.examType && filters.examType !== 'All') {
      list = list.filter(r => r.examType.toLowerCase() === filters.examType.toLowerCase());
    }

    if (filters.subject && filters.subject !== 'All') {
      list = list.filter(r => r.subject.toLowerCase() === filters.subject.toLowerCase());
    }

    if (filters.year && filters.year !== 'All') {
      const yr = parseInt(filters.year, 10);
      if (!isNaN(yr)) {
        list = list.filter(r => r.year === yr);
      }
    }

    if (filters.difficulty && filters.difficulty !== 'All') {
      list = list.filter(r => r.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.paperCode.toLowerCase().includes(q) ||
        r.examType.toLowerCase().includes(q) ||
        (r.topics && r.topics.some(t => t.toLowerCase().includes(q))) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.chiefExaminerRemarks && r.chiefExaminerRemarks.toLowerCase().includes(q))
      );
    }

    // Sort
    const sort = filters.sort || 'newest';
    if (sort === 'downloads') {
      list.sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0));
    } else if (sort === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      list.sort((a, b) => b.year - a.year);
    }

    return list;
  }

  getAcademicResourceById(id) {
    if (!this.data.academicResources) this.data.academicResources = [];
    return this.data.academicResources.find(r => r.id === id || r.paperCode.toUpperCase() === id.toUpperCase()) || null;
  }

  recordResourceDownload(id) {
    if (!this.data.academicResources) this.data.academicResources = [];
    const resource = this.getAcademicResourceById(id);
    if (!resource) throw new Error("Academic resource not found");

    resource.downloadsCount = (resource.downloadsCount || 0) + 1;
    this.recordLead(resource.id, 'resource_download');
    this.save();
    return resource;
  }

  createAcademicResource(data) {
    if (!this.data.academicResources) this.data.academicResources = [];

    if (!data.title || !data.title.trim()) throw new Error("Resource title is required");
    if (!data.subject || !data.subject.trim()) throw new Error("Subject is required");
    if (!data.examType || !data.examType.trim()) throw new Error("Exam category is required");

    const newResource = {
      id: "res-" + Date.now(),
      paperCode: data.paperCode || `SD-ACAD-${Date.now().toString().slice(-4)}`,
      examType: data.examType,
      examBody: data.examBody || "Verified Ghanaian Examination Panel",
      title: data.title.trim(),
      subject: data.subject.trim(),
      year: parseInt(data.year || new Date().getFullYear(), 10),
      gradeLevel: data.gradeLevel || "JHS / SHS",
      duration: data.duration || "2 Hours",
      totalMarks: parseInt(data.totalMarks || 100, 10),
      difficulty: data.difficulty || "Standard",
      downloadsCount: 1,
      rating: 5.0,
      topics: Array.isArray(data.topics) ? data.topics : (data.topics ? [data.topics] : ["Core Syllabus"]),
      description: data.description ? data.description.trim() : "Curated academic resource and revision past paper.",
      chiefExaminerRemarks: data.chiefExaminerRemarks ? data.chiefExaminerRemarks.trim() : "Focus on demonstrating clear step-by-step methods and adhering to question constraints.",
      questions: Array.isArray(data.questions) ? data.questions : []
    };

    this.data.academicResources.unshift(newResource);
    this.save();
    return newResource;
  }

  getAcademicResourceStats() {
    if (!this.data.academicResources) this.data.academicResources = [];
    const list = this.data.academicResources;
    const totalDownloads = list.reduce((sum, r) => sum + (r.downloadsCount || 0), 0);
    const examTypes = [...new Set(list.map(r => r.examType))];
    const subjects = [...new Set(list.map(r => r.subject))];

    return {
      totalResources: list.length,
      totalDownloads,
      examTypesCount: examTypes.length,
      subjectsCount: subjects.length,
      examTypes,
      subjects
    };
  }

  // Authentication & Role-Based Access Control (Feature 5)
  sanitizeUser(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }

  authenticateUser(login, password) {
    if (!this.data.users) this.data.users = getInitialUsers();
    if (!this.data.sessions) this.data.sessions = [];

    const cleanLogin = (login || '').trim().toLowerCase();
    const cleanPhoneDigits = (login || '').replace(/[^0-9]/g, '');

    const user = this.data.users.find(u => {
      const uEmail = (u.email || '').toLowerCase().trim();
      const uPhoneDigits = (u.phone || '').replace(/[^0-9]/g, '');
      return uEmail === cleanLogin || (cleanPhoneDigits.length >= 7 && uPhoneDigits.endsWith(cleanPhoneDigits.slice(-9)));
    });

    if (!user) {
      throw new Error("Account with this email or phone number was not found");
    }

    if (user.password !== password) {
      throw new Error("Invalid password. Please check your credentials");
    }

    const token = 'sdtk_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 12);
    const session = {
      token,
      userId: user.id,
      role: user.role,
      schoolId: user.schoolId || null,
      createdAt: new Date().toISOString()
    };
    this.data.sessions.push(session);
    this.save();

    return {
      token,
      user: this.sanitizeUser(user)
    };
  }

  getUserByToken(token) {
    if (!token) return null;
    if (!this.data.sessions) this.data.sessions = [];
    if (!this.data.users) this.data.users = getInitialUsers();

    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    const session = this.data.sessions.find(s => s.token === cleanToken);
    if (!session) return null;

    const user = this.data.users.find(u => u.id === session.userId);
    return user ? this.sanitizeUser(user) : null;
  }

  getUserById(id) {
    if (!this.data.users) this.data.users = getInitialUsers();
    const user = this.data.users.find(u => u.id === id);
    return user ? this.sanitizeUser(user) : null;
  }

  registerUser(userData) {
    if (!this.data.users) this.data.users = getInitialUsers();
    if (!this.data.sessions) this.data.sessions = [];

    const email = (userData.email || '').trim().toLowerCase();
    const phone = (userData.phone || '').trim();

    if (!email) throw new Error("Email address is required");
    if (!userData.password || userData.password.length < 6) throw new Error("Password must be at least 6 characters");
    if (!userData.name) throw new Error("Full name is required");

    if (this.data.users.some(u => u.email.toLowerCase() === email)) {
      throw new Error("An account with this email address already exists");
    }

    let role = userData.role || 'parent';
    let schoolName = null;
    if (role === 'school_admin' && userData.schoolId) {
      const school = this.data.schools.find(s => s.id === userData.schoolId);
      if (school) schoolName = school.name;
    }

    const newUser = {
      id: "usr-" + Date.now(),
      name: userData.name.trim(),
      email,
      phone,
      role,
      schoolId: userData.schoolId || null,
      schoolName,
      title: userData.title || (role === 'school_admin' ? 'School Administrator' : 'Parent / Guardian'),
      password: userData.password,
      verified: true,
      avatar: role === 'school_admin' ? '🏫' : (role === 'teacher' ? '👨‍🏫' : '👨‍👩‍👧'),
      createdAt: new Date().toISOString()
    };

    this.data.users.push(newUser);

    const token = 'sdtk_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 12);
    this.data.sessions.push({
      token,
      userId: newUser.id,
      role: newUser.role,
      schoolId: newUser.schoolId || null,
      createdAt: new Date().toISOString()
    });
    this.save();

    return {
      token,
      user: this.sanitizeUser(newUser)
    };
  }

  logoutUser(token) {
    if (!token) return { success: true };
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    if (this.data.sessions) {
      this.data.sessions = this.data.sessions.filter(s => s.token !== cleanToken);
      this.save();
    }
    return { success: true };
  }

  // Parent Portal Data Aggregator
  getParentOverview(user) {
    if (!user) throw new Error("Parent authentication required");

    const userEmail = (user.email || '').toLowerCase().trim();
    const userPhoneDigits = (user.phone || '').replace(/[^0-9]/g, '');

    // Applications matching guardian email, phone, or demo fallback
    const applications = (this.data.admissionApplications || []).filter(app => {
      const gEmail = (app.parentGuardian?.email || app.guardianEmail || '').toLowerCase().trim();
      const gPhoneDigits = (app.parentGuardian?.phone || app.parentGuardian?.whatsapp || '').replace(/[^0-9]/g, '');
      const isDemoMatch = userEmail === 'parent@gmail.com';
      return (
        (userEmail && gEmail === userEmail) ||
        (userPhoneDigits.length >= 7 && gPhoneDigits.endsWith(userPhoneDigits.slice(-9))) ||
        app.userId === user.id ||
        isDemoMatch
      );
    });

    // Inquiries matching parent email or phone
    const inquiries = (this.data.inquiries || []).filter(inq => {
      const pEmail = (inq.parentEmail || '').toLowerCase().trim();
      const pPhoneDigits = (inq.parentPhone || '').replace(/[^0-9]/g, '');
      const isDemoMatch = userEmail === 'parent@gmail.com';
      return (
        (userEmail && pEmail === userEmail) ||
        (userPhoneDigits.length >= 7 && pPhoneDigits.endsWith(userPhoneDigits.slice(-9))) ||
        inq.userId === user.id ||
        isDemoMatch
      );
    });

    // SMS notifications for parent
    const parentSMS = this.getSMSLogs({ phone: user.phone });
    // Invoices for parent
    const parentInvoices = this.getInvoices({ parentEmail: user.email, parentPhone: user.phone });
    // Report cards for parent's wards
    const reportCards = this.getReportCards({ parentEmail: user.email, parentPhone: user.phone });
    // School Bus Boarding Pass for parent's wards
    const busPass = this.getStudentBusPass(null, user.email);
    // Transport routes for enrolled school
    const transportRoutes = this.getTransportRoutes({ schoolId: 'sch-gis-accra' });
    // Active club memberships for parent's wards
    const clubMemberships = this.getStudentClubMemberships(null, user.email);
    // Available after-school clubs
    const availableClubs = this.getClubs({ schoolId: 'sch-gis-accra' });
    // Feature 12: Alumni Mentorship Bookings & Featured Mentors
    const alumniBookings = this.getAlumniBookings({ parentEmail: user.email });
    const featuredMentors = this.getAlumni({ featured: true, schoolId: 'sch-gis-accra' });
    // Feature 13 / Module #4: Health Sickbay & Medical Passport
    const medicalRecord = this.getStudentMedicalRecord(null, user.email);
    const sickbayVisits = this.getSickbayLogs({ studentId: 'Kwame Mensah' });
    // Bookmarked schools
    if (!this.data.bookmarks) this.data.bookmarks = {};
    const bookmarkedIds = this.data.bookmarks[user.id] || ["sch-gis-accra", "sch-morning-star-cantonments"];
    const savedSchools = (this.data.schools || []).filter(s => bookmarkedIds.includes(s.id));

    return {
      user: this.sanitizeUser(user),
      stats: {
        totalApplications: applications.length,
        totalInquiries: inquiries.length,
        totalSavedSchools: savedSchools.length,
        totalInvoices: parentInvoices.length,
        totalOutstanding: parentInvoices.reduce((acc, inv) => acc + inv.balanceDue, 0),
        totalReportCards: reportCards.length
      },
      applications,
      inquiries,
      savedSchools,
      invoices: parentInvoices,
      reportCards,
      busPass,
      transportRoutes,
      clubMemberships,
      availableClubs,
      alumniBookings,
      featuredMentors,
      medicalRecord,
      sickbayVisits,
      borrowedBooks: (this.data.libraryLoans || []).filter(l => l.studentName === 'Kwame Mensah' && l.status === 'Active'),
      libraryCatalog: (this.data.libraryBooks || []).slice(0, 6),
      digitalID: this.getStudentDigitalID('Kwame Mensah'),
      smsNotifications: parentSMS
    };
  }

  toggleSchoolBookmark(userId, schoolId) {
    if (!this.data.bookmarks) this.data.bookmarks = {};
    if (!this.data.bookmarks[userId]) this.data.bookmarks[userId] = [];

    const list = this.data.bookmarks[userId];
    const idx = list.indexOf(schoolId);
    let bookmarked = false;
    if (idx > -1) {
      list.splice(idx, 1);
      bookmarked = false;
    } else {
      list.push(schoolId);
      bookmarked = true;
    }
    this.save();
    return { bookmarked, bookmarks: list };
  }

  getUserBookmarks(userId) {
    if (!this.data.bookmarks) this.data.bookmarks = {};
    return this.data.bookmarks[userId] || [];
  }


  // Fee Invoicing & MoMo Payment Collection (Feature 6)
  getInvoices(filters = {}) {
    if (!this.data.invoices) this.data.invoices = getInitialInvoices();
    let list = [...this.data.invoices];

    if (filters.schoolId && filters.schoolId !== 'All') {
      list = list.filter(inv => inv.schoolId === filters.schoolId);
    }

    if (filters.parentEmail) {
      const email = filters.parentEmail.toLowerCase().trim();
      const isDemo = email === 'parent@gmail.com';
      list = list.filter(inv => (inv.parentEmail && inv.parentEmail.toLowerCase() === email) || isDemo);
    }

    if (filters.status && filters.status !== 'All') {
      list = list.filter(inv => inv.status.toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(inv =>
        inv.studentName.toLowerCase().includes(q) ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.studentGrade.toLowerCase().includes(q)
      );
    }

    return list;
  }

  getInvoiceById(id) {
    if (!this.data.invoices) this.data.invoices = getInitialInvoices();
    return this.data.invoices.find(inv => inv.id === id || inv.invoiceNumber === id);
  }

  createInvoice(data) {
    if (!this.data.invoices) this.data.invoices = getInitialInvoices();

    if (!data.schoolId) throw new Error("School ID is required");
    if (!data.studentName) throw new Error("Student name is required");
    if (!data.lineItems || data.lineItems.length === 0) throw new Error("At least one line item is required");

    const school = this.data.schools.find(s => s.id === data.schoolId) || { name: "Partner School" };
    const prefix = school.name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
    const invNumber = prefix + "-INV-2026-" + Math.floor(1000 + Math.random() * 9000);

    const totalAmount = data.lineItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

    const newInvoice = {
      id: "inv-" + Date.now(),
      invoiceNumber: invNumber,
      schoolId: data.schoolId,
      schoolName: school.name,
      studentName: data.studentName.trim(),
      studentGrade: data.studentGrade || "Primary",
      parentName: data.parentName || "Parent / Guardian",
      parentEmail: data.parentEmail || "",
      parentPhone: data.parentPhone || "",
      term: data.term || "Term 1 - 2026/2027 Academic Year",
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || "2026-11-30",
      status: "Unpaid",
      currency: "GHS",
      lineItems: data.lineItems,
      totalAmount,
      amountPaid: 0,
      balanceDue: totalAmount,
      paymentHistory: []
    };

    this.data.invoices.unshift(newInvoice);
    this.save();
    return newInvoice;
  }

  recordInvoicePayment(invoiceId, paymentData) {
    if (!this.data.invoices) this.data.invoices = getInitialInvoices();
    if (!this.data.transactions) this.data.transactions = [];

    const invoice = this.data.invoices.find(inv => inv.id === invoiceId || inv.invoiceNumber === invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    const amount = Number(paymentData.amount);
    if (!amount || amount <= 0) throw new Error("Payment amount must be greater than zero");
    if (amount > invoice.balanceDue) {
      throw new Error("Payment amount cannot exceed outstanding balance of GH₵ " + invoice.balanceDue.toLocaleString());
    }

    const schoolCode = invoice.schoolName.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
    const receiptNumber = schoolCode + "-REC-2026-" + Math.floor(100 + Math.random() * 900);
    const txRef = (paymentData.method === 'Telecel Cash' ? 'TC-PAY-' : 'GH-MM-') + Math.floor(10000000 + Math.random() * 90000000);

    const paymentRecord = {
      id: "pay-" + Date.now(),
      amount,
      method: paymentData.method || "MTN Mobile Money",
      momoNumber: paymentData.momoNumber || invoice.parentPhone,
      transactionRef: txRef,
      date: new Date().toISOString(),
      receiptNumber,
      payerName: paymentData.payerName || invoice.parentName,
      notes: paymentData.notes || "Term Fee MoMo Payment"
    };

    invoice.paymentHistory.push(paymentRecord);
    invoice.amountPaid += amount;
    invoice.balanceDue = invoice.totalAmount - invoice.amountPaid;

    if (invoice.balanceDue <= 0) {
      invoice.status = "Paid";
    } else {
      invoice.status = "Partially Paid";
    }

    // Record into global platform transactions table
    this.data.transactions.unshift({
      id: "tx-" + Date.now(),
      type: "school_fee",
      serviceName: "Term School Fee: " + invoice.studentName + " (" + invoice.term + ")",
      targetId: invoice.schoolId,
      schoolName: invoice.schoolName,
      amount,
      currency: "GHS",
      payerName: paymentData.payerName || invoice.parentName,
      payerPhone: paymentData.momoNumber || invoice.parentPhone,
      paymentMethod: paymentData.method || "MTN Mobile Money",
      status: "success",
      reference: txRef,
      createdAt: new Date().toISOString(),
      receiptNumber
    });

    this.save();

    return {
      success: true,
      invoice,
      payment: paymentRecord,
      receiptNumber
    };
  }


  // Automated SMS & WhatsApp Parent Communications (Feature 7)
  getSMSLogs(filters = {}) {
    if (!this.data.smsLogs) this.data.smsLogs = getInitialSMSLogs();
    let list = [...this.data.smsLogs];

    if (filters.schoolId && filters.schoolId !== 'All') {
      list = list.filter(s => s.schoolId === filters.schoolId);
    }

    if (filters.phone) {
      const pDigits = (filters.phone || '').replace(/[^0-9]/g, '');
      const isDemo = pDigits.endsWith('987654') || filters.phone.includes('parent');
      list = list.filter(s => {
        const sDigits = (s.recipientPhone || '').replace(/[^0-9]/g, '');
        return (pDigits.length >= 7 && sDigits.endsWith(pDigits.slice(-7))) || isDemo || s.recipientPhone.includes('Broadcast');
      });
    }

    if (filters.category && filters.category !== 'All') {
      list = list.filter(s => s.category.toLowerCase() === filters.category.toLowerCase());
    }

    return list;
  }

  getSMSCredits(schoolId = 'sch-gis-accra') {
    if (!this.data.smsCredits) {
      this.data.smsCredits = { "sch-gis-accra": 4850, "sch-sos-tema": 3200, "sch-morning-star-cantonments": 2500 };
    }
    return this.data.smsCredits[schoolId] || 2500;
  }

  sendSMSNotification(data) {
    if (!this.data.smsLogs) this.data.smsLogs = getInitialSMSLogs();
    if (!this.data.smsCredits) {
      this.data.smsCredits = { "sch-gis-accra": 4850, "sch-sos-tema": 3200, "sch-morning-star-cantonments": 2500 };
    }

    if (!data.recipientPhone) throw new Error("Recipient phone number is required");
    if (!data.messageText) throw new Error("SMS message text is required");

    const schoolId = data.schoolId || 'sch-gis-accra';
    const school = this.data.schools.find(s => s.id === schoolId) || { name: "Ghana International School" };

    const currentCredits = this.data.smsCredits[schoolId] || 2500;
    if (currentCredits <= 0) throw new Error("Insufficient SMS credits. Please top up your gateway balance.");
    this.data.smsCredits[schoolId] = currentCredits - 1;

    const phone = data.recipientPhone.replace(/[^0-9]/g, '');
    let network = 'MTN GH';
    if (phone.includes('020') || phone.includes('050') || phone.startsWith('23320') || phone.startsWith('23350')) {
      network = 'Telecel GH';
    } else if (phone.includes('026') || phone.includes('056') || phone.includes('027') || phone.includes('057')) {
      network = 'AT GH';
    }

    const newLog = {
      id: "sms-gh-" + Date.now(),
      schoolId,
      schoolName: school.name,
      recipientName: data.recipientName || "Parent / Guardian",
      recipientPhone: data.recipientPhone,
      channel: data.channel || "SMS (Hubtel Ghana Gateway)",
      category: data.category || "Admissions",
      senderId: data.senderId || (school.slug ? school.slug.substring(0, 8).toUpperCase() : "GIS-ACCRA"),
      messageText: data.messageText.trim(),
      status: "Delivered",
      deliveryTime: new Date().toISOString(),
      network,
      unitsUsed: 1
    };

    this.data.smsLogs.unshift(newLog);
    this.save();

    return {
      success: true,
      log: newLog,
      remainingCredits: this.data.smsCredits[schoolId]
    };
  }

  broadcastParentSMS(schoolId, broadcastData) {
    if (!this.data.smsLogs) this.data.smsLogs = getInitialSMSLogs();
    if (!this.data.smsCredits) {
      this.data.smsCredits = { "sch-gis-accra": 4850, "sch-sos-tema": 3200, "sch-morning-star-cantonments": 2500 };
    }

    const school = this.data.schools.find(s => s.id === schoolId) || { name: "Partner Campus" };
    const count = Number(broadcastData.recipientCount) || 180;

    const currentCredits = this.data.smsCredits[schoolId] || 2500;
    this.data.smsCredits[schoolId] = Math.max(0, currentCredits - count);

    const log = {
      id: "sms-gh-" + Date.now(),
      schoolId,
      schoolName: school.name,
      recipientName: "All Parents (" + (broadcastData.targetGroup || 'Prospective & Enrolled') + ")",
      recipientPhone: "+233 Broadcast (" + count + " Parents)",
      channel: "SMS (Arkesel Ghana Bulk Gateway)",
      category: broadcastData.category || "School Announcement",
      senderId: broadcastData.senderId || "CAMPUS-ALERT",
      messageText: broadcastData.messageText.trim(),
      status: "Delivered",
      deliveryTime: new Date().toISOString(),
      network: "National Unified (MTN/Telecel/AT)",
      unitsUsed: count
    };

    this.data.smsLogs.unshift(log);
    this.save();

    return {
      success: true,
      log,
      recipientsDelivered: count,
      remainingCredits: this.data.smsCredits[schoolId]
    };
  }

  logSMS(entry) {
    if (!this.data.smsLogs) this.data.smsLogs = [];
    const log = {
      id: "sms-gh-" + Date.now(),
      schoolId: entry.schoolId || "sch-gis-accra",
      schoolName: entry.schoolName || "Ghana International School (GIS)",
      recipientName: entry.recipientName || "Parent",
      recipientPhone: entry.recipientPhone || "+233 24 431 8900",
      channel: entry.channel || "SMS (Hubtel / Arkesel Gateway)",
      category: entry.category || "School Notification",
      senderId: entry.senderId || "CAMPUS-HUB",
      messageText: entry.messageText || "",
      status: "Delivered",
      deliveryTime: new Date().toISOString(),
      network: "National Unified (MTN/Telecel/AT)",
      unitsUsed: 1
    };
    this.data.smsLogs.unshift(log);
    this.save();
    return log;
  }

  // ========================================================
  // Feature 9: Terminal Report Cards & Digital Gradebook
  // ========================================================
  getReportCards(filters = {}) {
    if (!this.data.reportCards) this.data.reportCards = getInitialReportCards();
    let list = [...this.data.reportCards];

    if (filters.schoolId && filters.schoolId !== 'All') {
      list = list.filter(r => r.schoolId === filters.schoolId);
    }
    if (filters.studentGrade && filters.studentGrade !== 'All') {
      list = list.filter(r => r.studentGrade.toLowerCase().includes(filters.studentGrade.toLowerCase()));
    }
    if (filters.studentName) {
      const q = filters.studentName.toLowerCase().trim();
      list = list.filter(r => r.studentName.toLowerCase().includes(q));
    }
    if (filters.parentEmail) {
      const email = filters.parentEmail.toLowerCase().trim();
      const isDemo = email === 'parent@gmail.com';
      list = list.filter(r => (r.parentEmail && r.parentEmail.toLowerCase() === email) || isDemo);
    }
    if (filters.term && filters.term !== 'All') {
      list = list.filter(r => r.term.toLowerCase().includes(filters.term.toLowerCase()));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(r =>
        r.studentName.toLowerCase().includes(q) ||
        r.studentId.toLowerCase().includes(q) ||
        r.reportCardNumber.toLowerCase().includes(q) ||
        r.studentGrade.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getReportCardById(id) {
    if (!this.data.reportCards) this.data.reportCards = getInitialReportCards();
    return this.data.reportCards.find(r => r.id === id || r.reportCardNumber === id || r.studentId === id);
  }

  calculateSubjectGrade(totalScore) {
    if (totalScore >= 90) return { grade: "A*", remark: "Distinction / Excellent" };
    if (totalScore >= 80) return { grade: "A", remark: "Excellent" };
    if (totalScore >= 70) return { grade: "B", remark: "Very Good" };
    if (totalScore >= 60) return { grade: "C", remark: "Good" };
    if (totalScore >= 50) return { grade: "D", remark: "Credit / Pass" };
    if (totalScore >= 40) return { grade: "E", remark: "Pass" };
    return { grade: "F", remark: "Needs Improvement" };
  }

  updateReportCardGrades(id, updateData) {
    if (!this.data.reportCards) this.data.reportCards = getInitialReportCards();
    const report = this.data.reportCards.find(r => r.id === id || r.reportCardNumber === id);
    if (!report) throw new Error("Report card not found");

    if (Array.isArray(updateData.subjects)) {
      report.subjects = updateData.subjects.map(s => {
        const classwork = Math.min(30, Math.max(0, Number(s.classworkScore) || 0));
        const exam = Math.min(70, Math.max(0, Number(s.examScore) || 0));
        const total = Math.round(classwork + exam);
        const { grade, remark } = this.calculateSubjectGrade(total);
        return {
          ...s,
          classworkScore: classwork,
          examScore: exam,
          totalScore: total,
          grade: s.grade || grade,
          remark: s.remark || remark
        };
      });

      // Recalculate totals and overall average
      const totalMarks = report.subjects.reduce((sum, s) => sum + s.totalScore, 0);
      const maxMarks = report.subjects.length * 100;
      const avg = Number((totalMarks / (report.subjects.length || 1)).toFixed(1));

      report.overallTotalMarks = totalMarks;
      report.overallMaxMarks = maxMarks;
      report.overallAverage = avg;
      const overallGradeObj = this.calculateSubjectGrade(avg);
      report.overallGrade = overallGradeObj.grade;
      report.overallClassification = avg >= 90 ? "Distinction / First Class Honors" : (avg >= 75 ? "First Class Honors" : "Second Class Honors");
    }

    if (updateData.classTeacherRemark) report.classTeacherRemark = updateData.classTeacherRemark.trim();
    if (updateData.headTeacherRemark) report.headTeacherRemark = updateData.headTeacherRemark.trim();
    if (updateData.positionInClass) report.positionInClass = updateData.positionInClass.trim();
    if (updateData.conductTraits && Array.isArray(updateData.conductTraits)) {
      report.conductTraits = updateData.conductTraits;
    }

    report.updatedAt = new Date().toISOString();
    this.save();
    return report;
  }

  publishReportCard(id) {
    if (!this.data.reportCards) this.data.reportCards = getInitialReportCards();
    const report = this.data.reportCards.find(r => r.id === id || r.reportCardNumber === id);
    if (!report) throw new Error("Report card not found");

    report.status = "Published";
    report.publishedDate = new Date().toISOString();
    report.officialStampVerified = true;
    report.verificationHash = "GH-GES-NASIA-VERIFIED-" + (report.schoolId ? report.schoolId.toUpperCase().slice(0, 7) : 'GIS') + "-2026-" + Math.floor(1000 + Math.random() * 9000);

    // Also dispatch notification to parent
    if (report.parentPhone) {
      try {
        this.sendSMSNotification({
          schoolId: report.schoolId,
          recipientName: report.parentName,
          recipientPhone: report.parentPhone,
          channel: "SMS (Hubtel Ghana Gateway)",
          category: "Academic Report Card",
          senderId: "GIS-ACAD",
          messageText: `GIS OFFICIAL NOTICE: Terminal report card for ${report.studentName} (${report.term}) has been certified & published. Position: ${report.positionInClass}. Log in to view stamped PDF: schooldirect.gh/#/parent-portal`
        });
      } catch (e) {
        console.warn("SMS notification skipped:", e.message);
      }
    }

    this.save();
    return report;
  }


  // ========================================================
  // Feature 10: School Transport & Live Bus Tracking Hub
  // ========================================================
  getTransportRoutes(filters = {}) {
    if (!this.data.transportRoutes) this.data.transportRoutes = getInitialTransportRoutes();
    let list = [...this.data.transportRoutes];

    if (filters.schoolId && filters.schoolId !== 'All') {
      list = list.filter(r => r.schoolId === filters.schoolId);
    }
    if (filters.status && filters.status !== 'All') {
      list = list.filter(r => r.status.toLowerCase().includes(filters.status.toLowerCase()));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.routeNumber.toLowerCase().includes(q) ||
        r.corridor.toLowerCase().includes(q) ||
        r.busPlate.toLowerCase().includes(q) ||
        (r.driver && r.driver.name.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getTransportRouteById(id) {
    if (!this.data.transportRoutes) this.data.transportRoutes = getInitialTransportRoutes();
    return this.data.transportRoutes.find(r => r.id === id || r.routeNumber === id);
  }

  getStudentBusPass(studentIdentifier = null, parentEmail = null) {
    if (!this.data.studentBusPasses) this.data.studentBusPasses = getInitialStudentBusPasses();
    let pass = null;

    if (studentIdentifier) {
      pass = this.data.studentBusPasses.find(p =>
        p.id === studentIdentifier ||
        p.studentId === studentIdentifier ||
        p.studentName.toLowerCase().includes(studentIdentifier.toLowerCase())
      );
    }

    if (!pass && parentEmail) {
      const email = parentEmail.toLowerCase().trim();
      pass = this.data.studentBusPasses.find(p =>
        p.parentEmail && p.parentEmail.toLowerCase() === email
      );
    }

    // Fallback for demo parent
    if (!pass) {
      pass = this.data.studentBusPasses[0];
    }

    // Attach latest live route state
    if (pass && pass.routeId) {
      const route = this.getTransportRouteById(pass.routeId);
      if (route) {
        pass.liveRoute = {
          status: route.status,
          currentStopIndex: route.currentStopIndex,
          currentStopName: route.stops[route.currentStopIndex]?.name || 'En Route',
          delayMinutes: route.delayMinutes,
          delayReason: route.delayReason,
          driver: route.driver,
          chaperone: route.chaperone
        };
      }
    }

    return pass;
  }

  updateBusRouteStatus(routeId, data) {
    if (!this.data.transportRoutes) this.data.transportRoutes = getInitialTransportRoutes();
    const route = this.data.transportRoutes.find(r => r.id === routeId || r.routeNumber === routeId);
    if (!route) throw new Error("Transport route not found");

    if (data.currentStopIndex !== undefined) {
      const idx = Number(data.currentStopIndex);
      route.currentStopIndex = idx;
      route.stops.forEach((stop, i) => {
        if (i < idx) stop.status = 'completed';
        else if (i === idx) stop.status = (idx === route.stops.length - 1 ? 'completed' : 'in_transit');
        else stop.status = 'scheduled';
      });
    }

    if (data.status) route.status = data.status;
    if (data.delayMinutes !== undefined) route.delayMinutes = Number(data.delayMinutes);
    if (data.delayReason !== undefined) route.delayReason = data.delayReason.trim();

    route.updatedAt = new Date().toISOString();
    this.save();
    return route;
  }

  broadcastBusDelay(routeId, alertData) {
    if (!this.data.transportRoutes) this.data.transportRoutes = getInitialTransportRoutes();
    const route = this.data.transportRoutes.find(r => r.id === routeId || r.routeNumber === routeId);
    if (!route) throw new Error("Transport route not found");

    const delayMins = Number(alertData.delayMinutes) || 15;
    const reason = alertData.delayReason || "Traffic congestion on main corridor";

    route.delayMinutes = delayMins;
    route.delayReason = reason;
    route.status = "Delayed (" + delayMins + " mins)";

    // Dispatch SMS logs to all route parents
    const recipientCount = (route.students && route.students.length) || 28;
    const messageText = "GIS BUS ALERT: " + route.routeNumber + " (" + route.name + ") is experiencing a " + delayMins + "-minute traffic delay due to " + reason + ". Current landmark: " + (route.stops[route.currentStopIndex]?.name || 'En Route') + ". Driver: " + route.driver.name + " (" + route.driver.phone + ").";

    try {
      this.sendSMSNotification({
        schoolId: route.schoolId,
        recipientName: "All Parents on " + route.routeNumber,
        recipientPhone: "+233 Broadcast (" + recipientCount + " Parents)",
        channel: "SMS (Arkesel Fleet Gateway)",
        category: "Bus Delay Alert",
        senderId: "GIS-FLEET",
        messageText
      });
    } catch (e) {
      console.warn("SMS delay dispatch skipped:", e.message);
    }

    this.save();
    return {
      success: true,
      route,
      recipientsAlerted: recipientCount,
      messageText
    };
  }


  // ========================================================
  // Feature 11: Co-Curricular & After-School Clubs Management
  // ========================================================
  getClubs(filters = {}) {
    if (!this.data.clubs) this.data.clubs = getInitialClubs();
    let list = [...this.data.clubs];

    if (filters.schoolId && filters.schoolId !== 'All') {
      list = list.filter(c => c.schoolId === filters.schoolId);
    }
    if (filters.category && filters.category !== 'All') {
      list = list.filter(c => c.category.toLowerCase().includes(filters.category.toLowerCase()));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        (c.patron && c.patron.name.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getClubById(id) {
    if (!this.data.clubs) this.data.clubs = getInitialClubs();
    return this.data.clubs.find(c => c.id === id);
  }

  getStudentClubMemberships(studentIdentifier = null, parentEmail = null) {
    if (!this.data.clubs) this.data.clubs = getInitialClubs();
    const enrolledClubs = [];

    this.data.clubs.forEach(club => {
      const member = (club.roster || []).find(m => {
        if (studentIdentifier) {
          return m.studentId === studentIdentifier || m.studentName.toLowerCase().includes(studentIdentifier.toLowerCase());
        }
        if (parentEmail) {
          const email = parentEmail.toLowerCase().trim();
          return m.parentEmail && (m.parentEmail.toLowerCase() === email || email === 'parent@gmail.com');
        }
        return false;
      });

      if (member) {
        enrolledClubs.push({
          clubId: club.id,
          clubName: club.name,
          category: club.category,
          icon: club.icon,
          tagline: club.tagline,
          meetingSchedule: club.meetingSchedule,
          venue: club.venue,
          patron: club.patron,
          termFeeGHS: club.termFeeGHS,
          competitions: club.competitions || [],
          studentDetails: member
        });
      }
    });

    return enrolledClubs;
  }

  enrollStudentInClub(clubId, enrollmentData) {
    if (!this.data.clubs) this.data.clubs = getInitialClubs();
    const club = this.data.clubs.find(c => c.id === clubId);
    if (!club) throw new Error("Club not found");

    if (!enrollmentData.studentName) throw new Error("Student name is required");

    // Check if already enrolled
    const existing = (club.roster || []).find(m =>
      m.studentName.toLowerCase() === enrollmentData.studentName.toLowerCase() ||
      (enrollmentData.studentId && m.studentId === enrollmentData.studentId)
    );

    if (existing) {
      throw new Error(enrollmentData.studentName + " is already enrolled in " + club.name);
    }

    const receiptNum = "SD-MOMO-CLB-2026-" + Math.floor(1000 + Math.random() * 9000);
    const newMember = {
      studentId: enrollmentData.studentId || ("std-" + Date.now()),
      studentName: enrollmentData.studentName.trim(),
      grade: enrollmentData.grade || "Primary Class 5",
      parentName: enrollmentData.parentName || "Mrs. Nana Aba Mensah",
      parentPhone: enrollmentData.parentPhone || "+233 24 431 8900",
      parentEmail: enrollmentData.parentEmail || "parent@gmail.com",
      joinedDate: new Date().toISOString().split('T')[0],
      duesPaid: true,
      duesReceipt: receiptNum,
      paymentMethod: enrollmentData.paymentMethod || "MTN Mobile Money (*170#)",
      role: enrollmentData.role || "Active Member & Competitor",
      meritBadges: ["🎖️ Certified Term 1 Member"]
    };

    if (!club.roster) club.roster = [];
    club.roster.push(newMember);
    club.enrolledCount = club.roster.length;

    // Send confirmation SMS to parent
    try {
      this.sendSMSNotification({
        schoolId: club.schoolId,
        recipientName: newMember.parentName,
        recipientPhone: newMember.parentPhone,
        channel: "SMS (Hubtel MoMo Gateway)",
        category: "Club Enrollment & Dues Receipt",
        senderId: "GIS-CLUBS",
        messageText: "GIS ACADEMY RECEIPT: " + newMember.studentName + " has been successfully enrolled in " + club.name + ". Term Dues GH₵ " + club.termFeeGHS + " confirmed via " + newMember.paymentMethod + ". Receipt: " + receiptNum + ". Meetings: " + club.meetingSchedule + "."
      });
    } catch (e) {
      console.warn("Club confirmation SMS skipped:", e.message);
    }

    this.save();
    return {
      success: true,
      club,
      member: newMember,
      receiptNumber: receiptNum
    };
  }

  awardClubMerit(clubId, studentId, badgeName) {
    if (!this.data.clubs) this.data.clubs = getInitialClubs();
    const club = this.data.clubs.find(c => c.id === clubId);
    if (!club) throw new Error("Club not found");

    const searchKey = (studentId || '').toLowerCase().trim();
    const member = (club.roster || []).find(m => 
      m.studentId === studentId ||
      (m.studentId && m.studentId.toLowerCase().includes(searchKey)) ||
      (m.studentId && searchKey.includes(m.studentId.toLowerCase())) ||
      (m.studentName && m.studentName.toLowerCase().includes(searchKey)) ||
      (m.studentName && searchKey.includes(m.studentName.toLowerCase()))
    );
    if (!member) throw new Error("Enrolled student not found in club roster");

    if (!member.meritBadges) member.meritBadges = [];
    if (!member.meritBadges.includes(badgeName)) {
      member.meritBadges.push(badgeName);
    }

    this.save();
    return {
      success: true,
      member,
      badges: member.meritBadges
    };
  }


  // Feature 12: Alumni Mentorship & Career Guidance Network
  getAlumni(filters = {}) {
    if (!this.data.alumni) this.data.alumni = getInitialAlumni();
    let list = [...this.data.alumni];

    if (filters.schoolId && filters.schoolId !== 'All') {
      list = list.filter(a => a.schoolId === filters.schoolId);
    }
    if (filters.industry && filters.industry !== 'All') {
      list = list.filter(a => a.industry === filters.industry);
    }
    if (filters.featured) {
      list = list.filter(a => a.featured);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.currentRole.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.tertiaryUniversity.toLowerCase().includes(q) ||
        a.industry.toLowerCase().includes(q)
      );
    }

    return list;
  }

  getAlumnusById(id) {
    if (!this.data.alumni) this.data.alumni = getInitialAlumni();
    return this.data.alumni.find(a => a.id === id);
  }

  getAlumniBookings(filters = {}) {
    if (!this.data.alumniBookings) this.data.alumniBookings = getInitialAlumniBookings();
    let list = [...this.data.alumniBookings];

    if (filters.mentorId) {
      list = list.filter(b => b.mentorId === filters.mentorId);
    }
    if (filters.studentId) {
      list = list.filter(b => b.studentId === filters.studentId || (b.studentName && b.studentName.toLowerCase().includes(filters.studentId.toLowerCase())));
    }
    if (filters.parentEmail) {
      const email = filters.parentEmail.toLowerCase().trim();
      list = list.filter(b => b.parentEmail && (b.parentEmail.toLowerCase() === email || email === 'parent@gmail.com'));
    }

    return list;
  }

  bookAlumniMentorship(mentorId, bookingData) {
    if (!this.data.alumni) this.data.alumni = getInitialAlumni();
    if (!this.data.alumniBookings) this.data.alumniBookings = getInitialAlumniBookings();

    const mentor = this.data.alumni.find(a => a.id === mentorId);
    if (!mentor) throw new Error("Alumni mentor not found");

    const code = Math.floor(1000 + Math.random() * 9000);
    const bookingId = "mbk-2026-" + code;
    const meetSlug = (bookingData.studentName || 'student').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
    const meetingLink = "https://meet.google.com/gis-alm-" + meetSlug + "-" + code;

    const newBooking = {
      id: bookingId,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorRole: mentor.currentRole + " (" + mentor.company + ")",
      mentorAvatar: mentor.avatar || "🎓",
      studentId: bookingData.studentId || "std-kwame-2026",
      studentName: bookingData.studentName || "Kwame Mensah",
      parentName: bookingData.parentName || "Mrs. Nana Aba Mensah",
      parentEmail: bookingData.parentEmail || "parent@gmail.com",
      parentPhone: bookingData.parentPhone || "+233 24 431 8900",
      gradeLevel: bookingData.gradeLevel || "Primary Class 5",
      scheduledDate: bookingData.scheduledDate || "Saturday, 14 November 2026",
      scheduledTime: bookingData.scheduledTime || "10:30 AM - 11:15 AM GMT",
      topic: bookingData.topic || "Tertiary Admissions Strategy & STEM Career Guidance",
      meetingPlatform: "Google Meet (Encrypted Video Room)",
      meetingLink: meetingLink,
      status: "Confirmed",
      notes: bookingData.notes || "Virtual video mentorship session booked via SchoolDirect Ghana.",
      createdAt: new Date().toISOString()
    };

    this.data.alumniBookings.unshift(newBooking);
    mentor.sessionsCompleted = (mentor.sessionsCompleted || 0) + 1;

    // Send SMS confirmation
    try {
      this.logSMS({
        schoolId: mentor.schoolId || "sch-gis-accra",
        recipientName: newBooking.parentName,
        recipientPhone: newBooking.parentPhone,
        channel: "SMS (Hubtel MoMo Gateway)",
        category: "Alumni Mentorship Booking",
        senderId: "GIS-ALUMNI",
        messageText: "GIS ALUMNI NETWORK: Mentorship session with " + mentor.name + " (" + mentor.company + ") confirmed for " + newBooking.studentName + " on " + newBooking.scheduledDate + " at " + newBooking.scheduledTime + ". Video Link: " + meetingLink + "."
      });
    } catch (e) {
      console.warn("Alumni SMS notification skipped:", e.message);
    }

    this.save();
    return {
      success: true,
      booking: newBooking,
      meetingLink: meetingLink
    };
  }


  // Feature 13 / Module #4: Health Sickbay & Medical Records / Student Dietary Management
  // ======================================================================================

  getMedicalRecords(filters = {}) {
    if (!this.data.medicalRecords) this.data.medicalRecords = getInitialMedicalRecords();
    let list = [...this.data.medicalRecords];

    if (filters.schoolId && filters.schoolId !== 'All') {
      list = list.filter(m => m.schoolId === filters.schoolId);
    }
    if (filters.hasAllergy) {
      list = list.filter(m => (m.allergies || []).length > 0);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(m =>
        m.studentName.toLowerCase().includes(q) ||
        (m.grade || '').toLowerCase().includes(q) ||
        (m.bloodGroup || '').toLowerCase().includes(q) ||
        (m.dietaryPlan || '').toLowerCase().includes(q)
      );
    }

    return list;
  }

  getStudentMedicalRecord(studentIdentifier = null, parentEmail = null) {
    if (!this.data.medicalRecords) this.data.medicalRecords = getInitialMedicalRecords();

    return this.data.medicalRecords.find(m => {
      if (studentIdentifier) {
        const id = studentIdentifier.toLowerCase().trim();
        return m.studentId.toLowerCase() === id ||
          m.studentName.toLowerCase().includes(id) ||
          id.includes(m.studentId.toLowerCase());
      }
      if (parentEmail) {
        const email = parentEmail.toLowerCase().trim();
        return m.emergencyContact?.parentEmail && (m.emergencyContact.parentEmail.toLowerCase() === email || email === 'parent@gmail.com');
      }
      return false;
    }) || this.data.medicalRecords[0];
  }

  updateStudentMedicalRecord(studentId, updateData) {
    if (!this.data.medicalRecords) this.data.medicalRecords = getInitialMedicalRecords();
    const record = this.data.medicalRecords.find(m => m.studentId === studentId);
    if (!record) throw new Error("Student medical record not found");

    if (updateData.allergies) record.allergies = updateData.allergies;
    if (updateData.dietaryPlan) record.dietaryPlan = updateData.dietaryPlan;
    if (updateData.canteenSpecialInstructions) record.canteenSpecialInstructions = updateData.canteenSpecialInstructions;
    if (updateData.chronicConditions) record.chronicConditions = updateData.chronicConditions;
    if (updateData.emergencyContact) record.emergencyContact = { ...record.emergencyContact, ...updateData.emergencyContact };

    this.save();
    return {
      success: true,
      record
    };
  }

  getSickbayLogs(filters = {}) {
    if (!this.data.sickbayLogs) this.data.sickbayLogs = getInitialSickbayLogs();
    let list = [...this.data.sickbayLogs];

    if (filters.schoolId && filters.schoolId !== 'All') {
      list = list.filter(l => l.schoolId === filters.schoolId);
    }
    if (filters.studentId) {
      const sId = filters.studentId.toLowerCase().trim();
      list = list.filter(l => l.studentId.toLowerCase().includes(sId) || l.studentName.toLowerCase().includes(sId));
    }
    if (filters.date) {
      list = list.filter(l => l.visitDate === filters.date);
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.createdAt || b.visitDate) - new Date(a.createdAt || a.visitDate));
  }

  logSickbayVisit(visitData) {
    if (!this.data.sickbayLogs) this.data.sickbayLogs = getInitialSickbayLogs();

    const code = Math.floor(100 + Math.random() * 900);
    const logId = "sb-log-" + code;

    const newLog = {
      id: logId,
      schoolId: visitData.schoolId || "sch-gis-accra",
      studentId: visitData.studentId || "std-kwame-2026",
      studentName: visitData.studentName || "Kwame Mensah",
      grade: visitData.grade || "Primary Class 5",
      visitDate: visitData.visitDate || new Date().toISOString().slice(0, 10),
      visitTime: visitData.visitTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      presentingComplaint: visitData.presentingComplaint || "Student presented to school sickbay for health evaluation.",
      vitals: {
        temperature: visitData.temperature || "36.8°C",
        pulse: visitData.pulse || "84 bpm",
        spO2: visitData.spO2 || "99%",
        bloodPressure: visitData.bloodPressure || "110/72 mmHg"
      },
      treatmentGiven: visitData.treatmentGiven || "First aid triage and resting bed provided by matron.",
      treatingNurse: visitData.treatingNurse || "Nurse Faustina Antwi, RN (Certified School Health Matron)",
      outcome: visitData.outcome || "Discharged to Class",
      outcomeCategory: visitData.outcomeCategory || "Discharged to Class",
      parentNotified: visitData.notifyParent ? true : false,
      notificationMessage: visitData.notifyParent ? ("GIS SICKBAY NOTICE: " + visitData.studentName + " visited the school sickbay for: " + (visitData.presentingComplaint || "mild complaint") + ". Treatment: " + (visitData.treatmentGiven || "Evaluated by nurse") + ". Outcome: " + (visitData.outcome || "Resting")) : null,
      createdAt: new Date().toISOString()
    };

    this.data.sickbayLogs.unshift(newLog);

    // Send SMS if requested
    if (visitData.notifyParent && visitData.parentPhone) {
      try {
        this.logSMS({
          schoolId: newLog.schoolId,
          recipientName: visitData.parentName || "Parent/Guardian",
          recipientPhone: visitData.parentPhone,
          channel: "SMS (Hubtel Medical Gateway)",
          category: "Sickbay Medical Alert",
          senderId: "GIS-SICKBAY",
          messageText: newLog.notificationMessage
        });
      } catch (e) {
        console.warn("Sickbay SMS notification skipped:", e.message);
      }
    }

    this.save();
    return {
      success: true,
      log: newLog
    };
  }

  dispatchEmergencyMedicalSMS(logId, messageText = null) {
    if (!this.data.sickbayLogs) this.data.sickbayLogs = getInitialSickbayLogs();
    const log = this.data.sickbayLogs.find(l => l.id === logId);
    if (!log) throw new Error("Sickbay visit log not found");

    const medRecord = this.getStudentMedicalRecord(log.studentId);
    const parentPhone = medRecord?.emergencyContact?.primaryPhone || "+233 24 431 8900";
    const parentName = medRecord?.emergencyContact?.primaryGuardian || "Parent/Guardian";

    const text = messageText || ("URGENT - GIS SICKBAY ALERT: " + log.studentName + " (" + log.grade + ") is currently in the school sickbay. Symptoms: " + log.presentingComplaint + ". Vitals: Temp " + log.vitals.temperature + ". Please contact Sister Faustina on +233 24 431 8900 immediately.");

    try {
      this.logSMS({
        schoolId: log.schoolId,
        recipientName: parentName,
        recipientPhone: parentPhone,
        channel: "SMS (Hubtel Emergency Medical Gateway)",
        category: "Urgent Medical Alert",
        senderId: "GIS-CLINIC",
        messageText: text
      });
    } catch (e) {
      console.warn("Emergency SMS dispatch skipped:", e.message);
    }

    log.parentNotified = true;
    log.notificationMessage = text;
    this.save();

    return {
      success: true,
      sentTo: parentPhone,
      message: text
    };
  }


  // Feature 14: Digital School Library & Textbook Lending System
  getLibraryBooks(filters = {}) {
    if (!this.data.libraryBooks) this.data.libraryBooks = getInitialLibraryBooks();
    let books = this.data.libraryBooks;
    if (filters.schoolId) {
      books = books.filter(b => b.schoolId === filters.schoolId);
    }
    if (filters.curriculum && filters.curriculum !== 'All') {
      books = books.filter(b => (b.curriculum || '').toLowerCase().includes(filters.curriculum.toLowerCase()));
    }
    if (filters.subject && filters.subject !== 'All') {
      books = books.filter(b => (b.subject || '').toLowerCase().includes(filters.subject.toLowerCase()));
    }
    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      books = books.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) || 
        b.isbn.toLowerCase().includes(q)
      );
    }
    return books;
  }

  getLibraryBookById(id) {
    if (!this.data.libraryBooks) this.data.libraryBooks = getInitialLibraryBooks();
    return this.data.libraryBooks.find(b => b.id === id) || null;
  }

  getLibraryLoans(filters = {}) {
    if (!this.data.libraryLoans) this.data.libraryLoans = getInitialLibraryLoans();
    let loans = this.data.libraryLoans;
    if (filters.schoolId) {
      loans = loans.filter(l => l.schoolId === filters.schoolId);
    }
    if (filters.studentId) {
      loans = loans.filter(l => l.studentId === filters.studentId);
    }
    if (filters.status && filters.status !== 'All') {
      loans = loans.filter(l => l.status === filters.status);
    }
    return loans;
  }

  borrowBook(data) {
    if (!this.data.libraryBooks) this.data.libraryBooks = getInitialLibraryBooks();
    if (!this.data.libraryLoans) this.data.libraryLoans = getInitialLibraryLoans();

    const book = this.data.libraryBooks.find(b => b.id === data.bookId);
    if (!book) throw new Error("Textbook not found in catalog");
    if (book.availableCopies <= 0) throw new Error("No available copies on shelf for this textbook");

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 14); // 14-day checkout loan

    const newLoan = {
      id: "loan-" + Math.floor(100 + Math.random() * 900),
      schoolId: book.schoolId || "sch-gis-accra",
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      studentId: data.studentId || "std-kwame-2026",
      studentName: data.studentName || "Kwame Mensah",
      gradeLevel: data.gradeLevel || "Primary Class 5",
      borrowDate: borrowDate.toISOString().slice(0, 10),
      dueDate: dueDate.toISOString().slice(0, 10),
      returnDate: null,
      status: "Active Loan",
      daysRemaining: 14,
      fineDueGHS: 0,
      barcode: "GIS-LIB-BK-" + Math.floor(1000 + Math.random() * 9000),
      librarian: data.librarian || "Mr. Kofi Boadi, MLS (Chief Librarian)"
    };

    book.availableCopies -= 1;
    book.borrowedCount = (book.borrowedCount || 0) + 1;
    this.data.libraryLoans.unshift(newLoan);
    this.save();

    return {
      success: true,
      loan: newLoan,
      remainingCopies: book.availableCopies
    };
  }

  returnBook(loanId, returnNotes = "") {
    if (!this.data.libraryBooks) this.data.libraryBooks = getInitialLibraryBooks();
    if (!this.data.libraryLoans) this.data.libraryLoans = getInitialLibraryLoans();

    const loan = this.data.libraryLoans.find(l => l.id === loanId);
    if (!loan) throw new Error("Active loan record not found");

    loan.returnDate = new Date().toISOString().slice(0, 10);
    loan.status = "Returned On-Time";
    loan.returnNotes = returnNotes || "Textbook inspected; spine and pages in excellent condition.";

    const book = this.data.libraryBooks.find(b => b.id === loan.bookId);
    if (book) {
      book.availableCopies += 1;
    }

    this.save();
    return {
      success: true,
      loan,
      book
    };
  }

  dispatchOverdueNoticeSMS(loanId) {
    if (!this.data.libraryLoans) this.data.libraryLoans = getInitialLibraryLoans();
    const loan = this.data.libraryLoans.find(l => l.id === loanId);
    if (!loan) throw new Error("Loan record not found");

    const parentPhone = "+233 24 431 8900";
    const text = "GIS LIBRARY NOTICE: The textbook \"" + loan.bookTitle + "\" issued to " + loan.studentName + " (" + loan.gradeLevel + ") was due on " + loan.dueDate + ". Outstanding overdue fine: GH₵ " + (loan.fineDueGHS || 10) + ". Please return book to library desk to avoid loan suspension.";

    try {
      this.logSMS({
        schoolId: loan.schoolId,
        recipientName: loan.studentName + " (Parent)",
        recipientPhone: parentPhone,
        channel: "SMS (Hubtel Hub)",
        category: "Library Overdue Notice",
        senderId: "GIS-LIB",
        messageText: text
      });
    } catch (e) {
      console.warn("Library SMS dispatch skipped:", e.message);
    }

    return {
      success: true,
      recipientPhone: parentPhone,
      message: text
    };
  }

  // ========================================================
  // FEATURE 16: Digital Student & Staff ID Cards with QR Verification
  // ========================================================
  getStudentDigitalIDs(schoolId = 'sch-gis-accra') {
    if (!this.data.studentDigitalIDs) this.data.studentDigitalIDs = this.getInitialStudentDigitalIDs();
    if (!schoolId || schoolId === 'All') return this.data.studentDigitalIDs;
    return this.data.studentDigitalIDs.filter(id => id.schoolId === schoolId);
  }

  getStudentDigitalID(identifier) {
    if (!this.data.studentDigitalIDs) this.data.studentDigitalIDs = this.getInitialStudentDigitalIDs();
    if (!identifier) return this.data.studentDigitalIDs[0];

    const q = identifier.toLowerCase().trim();
    const found = this.data.studentDigitalIDs.find(id =>
      id.id.toLowerCase() === q ||
      id.indexNumber.toLowerCase() === q ||
      id.studentName.toLowerCase().includes(q) ||
      (id.studentId && id.studentId.toLowerCase() === q)
    );

    return found || this.data.studentDigitalIDs[0];
  }

  verifyDigitalID(query) {
    if (!this.data.studentDigitalIDs) this.data.studentDigitalIDs = this.getInitialStudentDigitalIDs();
    const q = (query || '').toLowerCase().trim();

    const matched = this.data.studentDigitalIDs.find(id =>
      id.indexNumber.toLowerCase() === q ||
      id.verificationHash.toLowerCase() === q ||
      id.barcodeNumber.toLowerCase() === q ||
      id.id.toLowerCase() === q ||
      id.studentName.toLowerCase() === q
    );

    if (!matched) {
      return {
        verified: false,
        error: "No active student credential found matching this verification code or index number.",
        timestamp: new Date().toISOString()
      };
    }

    return {
      verified: true,
      status: matched.status,
      studentName: matched.studentName,
      indexNumber: matched.indexNumber,
      schoolName: matched.schoolName,
      gradeLevel: matched.gradeLevel,
      house: matched.house,
      dob: matched.dob,
      bloodGroup: matched.bloodGroup,
      genotype: matched.genotype,
      medicalAlert: matched.medicalAlert,
      busPassRoute: matched.busPassRoute,
      busPassStatus: matched.busPassStatus,
      libraryStatus: matched.libraryStatus,
      sickbayClearance: matched.sickbayClearance,
      accreditation: matched.accreditation,
      verificationHash: matched.verificationHash,
      expiryDate: matched.expiryDate,
      timestamp: new Date().toISOString()
    };
  }

  getInitialStudentDigitalIDs() {
    return [
      {
        id: "id-gis-kwame-mensah",
        studentId: "Kwame Mensah",
        studentName: "Kwame Mensah",
        indexNumber: "GIS-2026-0842",
        schoolId: "sch-gis-accra",
        schoolName: "Ghana International School (GIS)",
        schoolMotto: "Understanding of Each Other",
        schoolCrest: "🎓",
        schoolAddress: "Second Circular Road, Cantonments, Accra",
        gradeLevel: "Grade 8 (JHS 2)",
        academicYear: "2025/2026 Academic Session",
        house: "Gold Coast House",
        dob: "2012-04-18",
        gender: "Male",
        photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80",
        bloodGroup: "O+",
        genotype: "AA",
        emergencyContactName: "Dr. Mensah (Father / Guardian)",
        emergencyContactPhone: "+233 24 431 8900",
        medicalAlert: "Mild Penicillin Allergy • Asthma Inhaler Registered",
        busPassRoute: "Route 1: East Legon / Adjiringanor Shuttle",
        busPassStatus: "Active",
        libraryCardNumber: "LIB-GIS-842",
        libraryStatus: "Active (2 Textbooks On Loan)",
        sickbayClearance: "Certified GHS Nurse Clearance",
        issueDate: "2025-09-01",
        expiryDate: "2026-08-31",
        barcodeNumber: "8420912026",
        verificationHash: "GH-GIS-SECURE-842-VERIFIED",
        status: "ACTIVE",
        accreditation: "NaSIA Accredited • Cambridge Assessment International Education (CIE)"
      },
      {
        id: "id-gis-selorm-kpodo",
        studentId: "Selorm Kpodo",
        studentName: "Selorm Kpodo",
        indexNumber: "GIS-2026-0915",
        schoolId: "sch-gis-accra",
        schoolName: "Ghana International School (GIS)",
        schoolMotto: "Understanding of Each Other",
        schoolCrest: "🎓",
        schoolAddress: "Second Circular Road, Cantonments, Accra",
        gradeLevel: "Grade 9 (JHS 3)",
        academicYear: "2025/2026 Academic Session",
        house: "Volta House",
        dob: "2011-09-12",
        gender: "Female",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        bloodGroup: "A+",
        genotype: "AA",
        emergencyContactName: "Mrs. Kpodo",
        emergencyContactPhone: "+233 20 812 3456",
        medicalAlert: "No Known Drug Allergies (NKDA)",
        busPassRoute: "Route 2: Airport Residential & Dzorwulu",
        busPassStatus: "Active",
        libraryCardNumber: "LIB-GIS-915",
        libraryStatus: "Active",
        sickbayClearance: "Certified GHS Nurse Clearance",
        issueDate: "2025-09-01",
        expiryDate: "2026-08-31",
        barcodeNumber: "9150912026",
        verificationHash: "GH-GIS-SECURE-915-VERIFIED",
        status: "ACTIVE",
        accreditation: "NaSIA Accredited • Cambridge Assessment International Education (CIE)"
      },
      {
        id: "id-gis-efua-sutherland",
        studentId: "Efua Sutherland",
        studentName: "Efua Sutherland",
        indexNumber: "GIS-2026-1044",
        schoolId: "sch-gis-accra",
        schoolName: "Ghana International School (GIS)",
        schoolMotto: "Understanding of Each Other",
        schoolCrest: "🎓",
        schoolAddress: "Second Circular Road, Cantonments, Accra",
        gradeLevel: "Grade 7 (JHS 1)",
        academicYear: "2025/2026 Academic Session",
        house: "Oti House",
        dob: "2013-01-25",
        gender: "Female",
        photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
        bloodGroup: "B+",
        genotype: "AS",
        emergencyContactName: "Prof. Sutherland",
        emergencyContactPhone: "+233 27 755 8899",
        medicalAlert: "Mild Peanut Allergy • Action Plan on File",
        busPassRoute: "Route 4: Cantonments & Osu",
        busPassStatus: "Active",
        libraryCardNumber: "LIB-GIS-1044",
        libraryStatus: "Active",
        sickbayClearance: "Certified GHS Nurse Clearance",
        issueDate: "2025-09-01",
        expiryDate: "2026-08-31",
        barcodeNumber: "10440912026",
        verificationHash: "GH-GIS-SECURE-1044-VERIFIED",
        status: "ACTIVE",
        accreditation: "NaSIA Accredited • Cambridge Assessment International Education (CIE)"
      }
    ];
  }

  queryAIChatbot({ message = '', history = [], context = {} }) {
    const q = (message || '').toLowerCase().trim();

    // 1. GREETING & GENERAL INTRODUCTION
    const isGreeting = /^(hi|hello|hey|akwaaba|good\s*(morning|afternoon|evening)|yo|greetings|howdy|what\s*can\s*you\s*do|who\s*are\s*you)\b/i.test(q) && q.length < 35;
    if (isGreeting || q === '') {
      return {
        reply: `**Akwaaba! 🇬🇭** I am **Akosua**, your SchoolDirect AI Education & Admissions Advisor.\n\nI can assist you with:\n* 🎯 **BECE CSSPS Placement & Raw Aggregate Calculations**\n* 🏫 **Comparing Cambridge (IGCSE/A-Levels), GES (NaSIA), & IB Curricula**\n* 💰 **Transparent School Fees, PTA Levies, & Mobile Money Payment Schedules**\n* 🚌 **School Bus Transit Tracking & GPS Geofence Alerts**\n* 🏥 **Infirmary & Sickbay Protocols (GHS-Certified Triage)**\n* 📚 **Textbook Lending (Aki-Ola Series & Past WAEC/BECE Papers)**\n* 🏫 **Tailored School Recommendations across Accra & Kumasi**\n\nHow may I help guide your ward's educational journey today?`,
        sender: "Akosua AI",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "How do I calculate CSSPS BECE aggregate?",
          "Compare Cambridge vs GES curriculum",
          "What are the fees for GIS & Morning Star?",
          "Show Cambridge schools in East Legon"
        ],
        quickLinks: [
          { label: "🎯 CSSPS Placement Simulator", view: "cssps" },
          { label: "🏫 School Directory", view: "directory" },
          { label: "⚖️ Compare Schools", view: "compare" },
          { label: "👨‍👩‍👧 Parent Portal", view: "parent-portal" }
        ]
      };
    }

    const allSchools = this.data.schools || [];
    const allCSSPSSchools = this.data.csspsSchools || [];

    // 2. SPECIFIC SCHOOL LOOKUP (Priority 1: Check if user named a specific school)
    const matchedSchool = allSchools.find(s => {
      const sName = s.name.toLowerCase();
      return q.includes(sName) || 
             (s.slug && q.includes(s.slug)) ||
             (sName.includes('ghana international') && (q.includes('gis') || q.includes('ghana international'))) ||
             (sName.includes('roman ridge') && q.includes('roman ridge')) ||
             (sName.includes('morning star') && q.includes('morning star')) ||
             (sName.includes('sos-hermann') && (q.includes('sos') || q.includes('hgic') || q.includes('hermann gmeiner'))) ||
             (sName.includes('galaxy') && q.includes('galaxy')) ||
             (sName.includes('spintex royal') && (q.includes('spintex royal') || q.includes('spintex prep'))) ||
             (sName.includes('east legon montessori') && (q.includes('east legon montessori') || q.includes('montessori academy'))) ||
             (sName.includes('ridge school') && q.includes('ridge school')) ||
             (sName.includes('heritage academy') && q.includes('heritage academy')) ||
             (sName.includes('knust basic') && q.includes('knust basic'));
    });

    if (matchedSchool) {
      const s = matchedSchool;
      const curStr = Array.isArray(s.curriculum) ? s.curriculum.join(', ') : s.curriculum;
      const facStr = Array.isArray(s.facilities) ? s.facilities.slice(0, 5).join(' • ') : '';

      return {
        reply: `### 🏫 ${s.name}\n*"${s.motto || 'Knowledge, Integrity, Excellence'}"*\n\n* 📍 **Location:** ${s.suburb}, ${s.region} (${s.address})\n* 🎓 **Curriculum:** ${curStr}\n* 💰 **Termly Tuition:** **GH₵ ${s.tuitionBase?.toLocaleString()}** *(Optional Bus: GH₵ ${s.busFee?.toLocaleString()} | Lunch: GH₵ ${s.lunchFee?.toLocaleString()})*\n* 👥 **Boarding & Gender:** ${s.boardingType} • ${s.gender}\n* 🏆 **Student-Teacher Ratio:** ${s.studentTeacherRatio || '15:1'}\n* 🔬 **Key Facilities:** ${facStr}\n* 👩🏾‍💼 **Head of School:** ${s.headOfSchool || 'Principal'}\n* 📞 **Direct Admissions Desk:** ${s.phone} | WhatsApp: ${s.whatsapp}\n\n> **Overview:** ${s.description}\n\nYou can book a verified campus tour or submit an admissions inquiry directly through our platform!`,
        sender: "Akosua AI",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionCards: [
          {
            type: "school",
            title: s.name,
            subtitle: `${s.suburb} • ${curStr}`,
            meta: `GH₵ ${s.tuitionBase?.toLocaleString()}/term • ${s.admissionsStatus}`,
            badge: s.packageTier || "Verified",
            link: `#/school-detail/${s.id}`,
            actionText: "View Full Profile"
          }
        ],
        suggestions: [
          `Book campus tour at ${s.name}`,
          `What are the bus routes for ${s.name}?`,
          `Compare ${s.name} with another school`,
          "Show more schools in " + s.suburb
        ],
        quickLinks: [
          { label: `View ${s.name} Profile`, view: "school-detail", param: s.id },
          { label: "Book Campus Tour", view: "parent-portal" }
        ]
      };
    }

    // Match CSSPS Public SHS
    const matchedCSSPS = allCSSPSSchools.find(s => {
      const n = s.name.toLowerCase();
      return q.includes(n) ||
             (n.includes('presec') && (q.includes('presec') || q.includes('odade3') || q.includes('legon boys'))) ||
             (n.includes('achimota') && (q.includes('achimota') || q.includes('motown'))) ||
             (n.includes('wesley girls') && (q.includes('wesley girls') || q.includes('wey gey hey'))) ||
             (n.includes('prempeh') && (q.includes('prempeh') || q.includes('amanfoo'))) ||
             (n.includes('opoku ware') && (q.includes('owass') || q.includes('opoku ware') || q.includes('akatakyie'))) ||
             (n.includes('holy child') && (q.includes('holy child') || q.includes('holico'))) ||
             (n.includes('aquinas') && (q.includes('aquinas') || q.includes('old toms'))) ||
             (n.includes('aburi girls') && (q.includes('aburi girls') || q.includes('abugiss')));
    });

    if (matchedCSSPS) {
      const s = matchedCSSPS;
      return {
        reply: `### 🇬🇭 ${s.name} (${s.category})\n*"${s.motto}"*\n\n* 📍 **Location:** ${s.suburb}, ${s.region} (${s.district})\n* 🎯 **Estimated BECE Cut-off:** Aggregate **${s.cutoffMin} – ${s.cutoffMax}**\n* 🛏️ **Boarding & Gender:** ${s.boardingType} • ${s.gender}\n* 🏆 **Flagship Programme:** ${s.flagshipProgram || 'General Science & Arts'}\n* 📚 **Offered Programmes:** ${(s.programs || []).join(', ')}\n* 🏛️ **GES Code:** ${s.gesCode} | Established ${s.established}\n\n> **School Overview:** ${s.overview}\n\n*Tip: Category A choices are restricted to one school on the CSSPS selection form. Ensure your ward meets the raw score threshold!*`,
        sender: "Akosua AI",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionCards: [
          {
            type: "cssps",
            title: s.name,
            subtitle: `${s.category} • ${s.gender} • ${s.boardingType}`,
            meta: `Cut-off: Aggregate ${s.cutoffMin}-${s.cutoffMax} | ${s.region}`,
            badge: s.category,
            link: `#/cssps`,
            actionText: "Simulate Placement"
          }
        ],
        suggestions: [
          `What are the cut-offs for ${s.name}?`,
          "Show other Category A schools",
          "How do I choose boarding vs day for CSSPS?",
          "How do I calculate BECE raw aggregate?"
        ],
        quickLinks: [
          { label: "🎯 Test Placement in CSSPS Simulator", view: "cssps" }
        ]
      };
    }

    // 3. CSSPS AGGREGATE CALCULATION / CUT-OFF QUERY
    const aggMatch = q.match(/aggregate\s*(\d{1,2})|agg\s*(\d{1,2})|score\s*(?:of\s*)?(\d{1,2})|bece\s*(\d{1,2})/i);
    const isCSSPSGeneral = /cssps|bece|raw\s*score|cut\s*off|placement|category\s*[a-d]|shs\s*selection/i.test(q);

    if (aggMatch || isCSSPSGeneral) {
      if (aggMatch) {
        const agg = parseInt(aggMatch[1] || aggMatch[2] || aggMatch[3] || aggMatch[4], 10);
        const csspsList = allCSSPSSchools;

        let qualificationText = "";
        let qualifiedSchools = [];

        if (agg <= 8) {
          qualificationText = `🏆 **Exceptional Academic Distinction (Aggregate ${agg})!**\nYour ward qualifies for Ghana's elite **Category A** Senior High Schools across all competitive programmes, including General Science (NSMQ), Business, and General Arts.`;
          qualifiedSchools = csspsList.filter(s => s.category === "Category A");
        } else if (agg <= 15) {
          qualificationText = `🌟 **Commendable Performance (Aggregate ${agg})!**\nYour ward is strongly competitive for top **Category A & Category B** Senior High Schools in General Science, Arts, Business, and Visual Arts.`;
          qualifiedSchools = csspsList.filter(s => s.category === "Category A" || s.category === "Category B");
        } else if (agg <= 25) {
          qualificationText = `📘 **Solid Passing Range (Aggregate ${agg})!**\nYour ward has great opportunities across prestigious **Category B and Category C** institutions with strong academic, vocational, and technical (TVET) tracks.`;
          qualifiedSchools = csspsList.filter(s => s.category === "Category B" || s.category === "Category C");
        } else {
          qualificationText = `ℹ️ **Aggregate ${agg}:**\nWith Aggregate ${agg}, the student is eligible for **Category C Day Schools** and TVET Technical Institutes. If unplaced in the automatic run, access the **Self-Placement Module** at \`cssps.gov.gh\` immediately.`;
          qualifiedSchools = csspsList.filter(s => s.category === "Category C");
        }

        const schoolHighlights = qualifiedSchools.slice(0, 4).map(s => 
          `* **${s.name}** (${s.category} • ${s.region}) — Cut-off: Agg ${s.cutoffMin}-${s.cutoffMax} | *${s.flagshipProgram || s.motto}*`
        ).join("\n");

        return {
          reply: `${qualificationText}\n\n### 🇬🇭 Recommended Senior High Schools for Aggregate ${agg}:\n${schoolHighlights}\n\n> **CSSPS Calculation Rule:** Aggregate = 4 Core Subjects (English, Maths, Integrated Science, Social Studies) + Best 2 Electives (ICT, BDT, French, etc.). Lowest aggregate is 6 (Grade 1 in all 6 subjects).\n\nWould you like to explore boarding vs day vacancies or test other subject score permutations?`,
          sender: "Akosua AI",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionCards: qualifiedSchools.slice(0, 3).map(s => ({
            type: "cssps",
            title: s.name,
            subtitle: `${s.category} • ${s.gender} • ${s.boardingType}`,
            meta: `Cut-off Agg: ${s.cutoffMin}-${s.cutoffMax} | ${s.suburb}`,
            badge: s.category,
            link: `#/cssps`,
            actionText: "Simulate Placement"
          })),
          suggestions: [
            "How does CSSPS Self-Placement work?",
            "Show Category A schools in Greater Accra",
            "What subjects make up the BECE raw score?",
            "Calculate aggregate with Grade 1s and 2s"
          ],
          quickLinks: [
            { label: "Open CSSPS Simulator", view: "cssps" },
            { label: "Download BECE Past Questions", view: "resources" }
          ]
        };
      } else {
        return {
          reply: `### 🎯 How CSSPS Placement Works in Ghana\n\nThe **Computerized School Selection and Placement System (CSSPS)** places BECE candidates into Public Senior High Schools and TVET institutions:\n\n1. **The 'Best 6' Formula:**\n   * **4 Mandatory Cores:** English Language, Mathematics, Integrated Science, Social Studies.\n   * **Best 2 Electives:** Top grades chosen from ICT, BDT/Career Tech, French, Ghanaian Language, RME.\n2. **Grading Scale (Raw Scores):**\n   * Grade 1 = 90 - 100% (Highest distinction)\n   * Grade 2 = 80 - 89%\n   * Grade 3 = 70 - 79%\n   * Minimum possible aggregate is **6** (six Grade 1s).\n3. **School Categorization:**\n   * **Category A (Top 30% Quota):** Presec Legon, Achimota, Wesley Girls, Prempeh, OWASS, Holy Child.\n   * **Category B:** St. Thomas Aquinas, Aburi Girls, Ghana National, Accra Academy.\n   * **Category C & D:** Day schools within candidate's catchment area + TVET institutions.\n4. **Self-Placement Module:** If not placed automatically, candidates choose available vacancies on \`cssps.gov.gh\` filtered by region, gender, and programme.\n\n*Tell me your ward's anticipated aggregate (e.g., 'I got aggregate 8') to check matching schools!*`,
          sender: "Akosua AI",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            "What schools accept Aggregate 6 to 9?",
            "Can a girl enter Wesley Girls with aggregate 8?",
            "How do I choose Category A, B, and C schools?",
            "Tell me about Presec Legon cut-offs"
          ],
          quickLinks: [
            { label: "🎯 Launch CSSPS Interactive Calculator", view: "cssps" }
          ]
        };
      }
    }

    // 4. CURRICULUM COMPARISON
    const isCurriculumQuery = /cambridge|cie|igcse|a-levels|ges|nasia|wassce|international baccalaureate|\bib\b|montessori|british curriculum|curricula|difference between/i.test(q);
    if (isCurriculumQuery) {
      return {
        reply: `### 🇬🇭 Ghanaian Curriculum Comparison Guide\n\nChoosing the right academic framework depends on your family's higher education goals:\n\n| Curriculum | Key Examinations | Structure | Primary Advantage |\n| :--- | :--- | :--- | :--- |\n| **Cambridge (CIE)** | Cambridge Primary, Checkpoint, IGCSE, AS & A-Levels | Early inquiry, subject specialization, critical analysis | Direct recognition by global top 100 universities (UK UCAS, USA Common App, Canada). |\n| **GES (NaSIA)** | Basic 1-9, BECE, SHS 1-3 (WASSCE) | Standards-based national curriculum, civic & cultural grounding | Free SHS funding, seamless direct matriculation into UG Legon, KNUST, UCC, UPSA. |\n| **IB (World School)** | PYP, MYP, IB Diploma (DP) | Holistic inquiry, Theory of Knowledge (TOK), Creativity/Activity/Service (CAS) | World's premier pre-university qualification for independent research. |\n| **Montessori** | Early Childhood to Primary | Multi-age self-directed sensory exploration | Builds strong independence, numeracy, and fine motor confidence. |\n\n**School Examples on SchoolDirect:**\n* **Cambridge:** Ghana International School (GIS), The Roman Ridge School, Galaxy International.\n* **GES Accredited:** Morning Star School, Spintex Royal Preparatory, KNUST Basic School.\n* **IB Diploma:** SOS-Hermann Gmeiner International College (Tema).\n* **Montessori:** East Legon Montessori Academy.`,
        sender: "Akosua AI",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "Which Cambridge schools are in East Legon?",
          "Compare Morning Star vs GIS",
          "What are the fees for Cambridge schools?",
          "Show IB schools in Ghana"
        ],
        quickLinks: [
          { label: "⚖️ Compare Cambridge & GES Schools", view: "compare" },
          { label: "🏫 Filter Directory by Curriculum", view: "directory" }
        ]
      };
    }

    // 5. FEES, TUITION, PAYMENT & MOMO (General)
    const isFeesQuery = /fee|fees|cost|tuition|price|expensive|cheap|affordable|how\s*much|momo|paystack|telecel|installments?/i.test(q);
    if (isFeesQuery) {
      const sorted = [...allSchools].sort((a,b) => a.tuitionBase - b.tuitionBase);
      const lowest = sorted[0];
      const mid = sorted[Math.floor(sorted.length / 2)];
      const highest = sorted[sorted.length - 1];

      return {
        reply: `### 💰 School Fees & Payment Structure in Ghana\n\nSchool fees vary significantly based on curriculum, facilities, and boarding status:\n\n* 💎 **Elite International (Cambridge / IB):**\n  * **Range:** GH₵ 10,000 – GH₵ 35,000+ per term\n  * **Examples:** ${highest.name} (GH₵ ${highest.tuitionBase?.toLocaleString()}/term), Galaxy International (GH₵ 11,000/term).\n  * **Includes:** International exam accreditation, Olympic pools, robotics suites, and low student-teacher ratios.\n* 🏫 **Premium Private Basic & Bilingual (GES / Cambridge):**\n  * **Range:** GH₵ 2,500 – GH₵ 5,000 per term\n  * **Examples:** ${mid.name} (GH₵ ${mid.tuitionBase?.toLocaleString()}/term), Ridge School Kumasi (GH₵ 3,100/term).\n* 🌿 **Affordable / Community Preparatory (GES):**\n  * **Range:** GH₵ 1,200 – GH₵ 2,200 per term\n  * **Example:** ${lowest.name} (GH₵ ${lowest.tuitionBase?.toLocaleString()}/term).\n* 🇬🇭 **Public Senior High Schools (CSSPS):**\n  * **Tuition:** Free under the Ghana Government **Free SHS Policy**.\n  * **Parental Outlay:** Basic personal kit, uniform tailoring, provisions (~GH₵ 1,500 – GH₵ 3,000 once per academic year).\n\n💳 **Payment Methods Supported on SchoolDirect:**\n* MTN Mobile Money, Telecel Cash, AT Money, and Visa/Mastercard via secure Paystack & Hubtel integration. Termly installment plans are available at participating schools.`,
        sender: "Akosua AI",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          `What are the fees for ${highest.name}?`,
          `Show schools under GH₵ 3,500 per term`,
          "How do I pay school fees with MTN MoMo?",
          "Compare school fees in Accra"
        ],
        quickLinks: [
          { label: "Filter Schools by Fee Range", view: "directory" },
          { label: "Parent Fee Portal", view: "parent-portal" }
        ]
      };
    }

    // 6. LOCATION / SUBURB FILTERING
    const locations = [
      "east legon", "cantonments", "airport residential", "tema", "spintex", 
      "kumasi", "adenta", "ridge", "nhyiaeso", "legon", "accra"
    ];
    const matchedLoc = locations.find(loc => q.includes(loc));
    if (matchedLoc) {
      const locSchools = allSchools.filter(s => 
        (s.suburb || '').toLowerCase().includes(matchedLoc) || 
        (s.region || '').toLowerCase().includes(matchedLoc) ||
        (s.address || '').toLowerCase().includes(matchedLoc)
      );

      if (locSchools.length > 0) {
        const listStr = locSchools.map(s => 
          `* **${s.name}** (${s.suburb})\n  * Curriculum: ${Array.isArray(s.curriculum) ? s.curriculum.join(', ') : s.curriculum}\n  * Tuition: GH₵ ${s.tuitionBase?.toLocaleString()} / term | Level: ${s.levels.join(', ')}`
        ).join("\n");

        return {
          reply: `### 📍 Accredited Schools in ${matchedLoc.toUpperCase()}:\n\nHere are the top-rated schools currently verified on SchoolDirect in this area:\n\n${listStr}\n\nWould you like contact info, WhatsApp admissions links, or bus route details for any of these schools?`,
          sender: "Akosua AI",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionCards: locSchools.slice(0, 3).map(s => ({
            type: "school",
            title: s.name,
            subtitle: `${s.suburb} • ${s.curriculum[0]}`,
            meta: `GH₵ ${s.tuitionBase?.toLocaleString()}/term`,
            badge: s.packageTier || "Verified",
            link: `#/school-detail/${s.id}`,
            actionText: "View Profile"
          })),
          suggestions: [
            `Do these schools have bus service to ${matchedLoc}?`,
            "Which is the most affordable in " + matchedLoc + "?",
            "Show schools in Cantonments",
            "Show schools in Kumasi"
          ],
          quickLinks: [
            { label: `Explore All Schools in ${matchedLoc}`, view: "directory" }
          ]
        };
      }
    }

    // 7. SCHOOL BUS, COMMUTE & TRACKING
    const isBusQuery = /bus|transport|shuttle|route|driver|tracking|gps|commute|pick\s*up|drop\s*off/i.test(q);
    if (isBusQuery) {
      return {
        reply: `### 🚌 SchoolDirect Integrated Bus Transit & GPS Tracking\n\nSchoolDirect partners with school transport divisions to give Ghanaian parents complete peace of mind during daily school runs:\n\n1. **Live GPS Telematics:** Track your child's bus in real-time on our interactive Leaflet map as it navigates Accra or Kumasi traffic.\n2. **Smart Geofence SMS Alerts:** Receive automatic SMS notifications (via Hubtel) the moment the shuttle is **3km away**, when your child boards, and upon safe arrival on campus.\n3. **Certified Drivers & Matrons:** Every bus has an assigned driver and caregiver matron vetted with verified Ghana Card IDs, defensive driving credentials, and background checks.\n4. **Typical Routes Covered:**\n   * **Route 1:** East Legon & Adjiringanor\n   * **Route 2:** Airport Residential & Dzorwulu\n   * **Route 3:** Spintex Road & Sakumono\n   * **Route 4:** Cantonments & Osu\n   * **Route 5:** Tema Communities 1 - 25\n   * **Route 6 (Kumasi):** Ridge, Nhyiaeso, KNUST Enclave & Ahodwo\n\n*Average bus fee: GH₵ 1,200 – GH₵ 2,500 per term depending on zone distance.*`,
        sender: "Akosua AI",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "How do I sign my ward up for school bus?",
          "Does GIS have a bus route to East Legon?",
          "What happens if a parent is delayed at pickup?",
          "Check bus fee breakdown"
        ],
        quickLinks: [
          { label: "Open Parent Portal Bus Tracker", view: "parent-portal" }
        ]
      };
    }

    // 8. SICKBAY, INFIRMARY & STUDENT HEALTH
    const isHealthQuery = /sick\s*bay|infirmary|nurse|health|medical|malaria|doctor|allergy|first\s*aid|hospital/i.test(q);
    if (isHealthQuery) {
      return {
        reply: `### 🏥 School Infirmary & Health Protocols (Ghana Health Service Aligned)\n\nEvery verified school on SchoolDirect maintains strict health and safety standards:\n\n* 👩🏾‍⚕️ **GHS-Registered Nurses:** Full-time pediatric and public health nurses stationed on campus during all school hours and sporting events.\n* 🩸 **Rapid Diagnostic Testing (RDT):** On-site testing for Malaria (Pf-HRP2), random blood glucose, and digital vital sign monitoring.\n* 📱 **Immediate Parent Telemetry:** Instant SMS notification whenever a child is admitted to the sickbay, documenting presenting symptoms, temperature, and administered first aid.\n* 🚨 **Emergency Referral Agreements:** Standing MoUs with premier facilities including Nyaho Medical Centre, 37 Military Hospital, and Ridge Hospital for urgent ambulance evacuation.\n* 📑 **Special Health Care Plans:** Comprehensive tracking of sickle cell (HbSS/SC), asthma triggers, and nut/lactose allergies.`,
        sender: "Akosua AI",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "How do parents receive sickbay SMS alerts?",
          "Are school nurses certified by Ghana Health Service?",
          "What is the procedure for sick children at school?"
        ],
        quickLinks: [
          { label: "View Student Health Records in Parent Portal", view: "parent-portal" }
        ]
      };
    }

    // 9. LIBRARY, TEXTBOOKS & PAST QUESTIONS
    const isLibraryQuery = /library|book|books|textbook|lending|aki-ola|past\s*questions|pasco|cockcrow|dilemma|things\s*fall\s*apart|bece\s*questions|wassce\s*questions/i.test(q);
    if (isLibraryQuery) {
      return {
        reply: `### 📚 SchoolDirect Digital Library & Academic Textbooks\n\nWe provide integrated textbook management and past exam preparation for Ghanaian learners:\n\n* 📖 **Approved GES & Cambridge Textbooks:**\n  * **Aki-Ola Series:** Core Mathematics, Elective Mathematics, Integrated Science, Social Studies.\n  * **Cambridge IGCSE:** Complete Extended Mathematics, Cambridge Physics & Chemistry coursebooks.\n  * **Literature Set Books:** *The Cockcrow*, *The Dilemma of a Ghost & Anowa* (Ama Ata Aidoo), *Things Fall Apart* (Chinua Achebe).\n* 📝 **BECE & WASSCE Past Questions (Pasco):** Comprehensive 10-year past papers with marking schemes.\n* 🔄 **Textbook Lending Manager:** Borrow physical copies through school libraries, manage due dates, and track loans directly within your Parent Portal.\n\n*All students at registered schools can access textbook lending with zero deposit!*`,
        sender: "Akosua AI",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "How do I borrow Aki-Ola Core Maths?",
          "Download BECE Past Questions",
          "View Kwame's borrowed books in Parent Portal",
          "What literature set books are studied in JHS?"
        ],
        quickLinks: [
          { label: "📚 Open Past Questions Repository", view: "resources" },
          { label: "📖 View Borrowed Books in Parent Portal", view: "parent-portal" }
        ]
      };
    }

    // 10. ADMISSIONS TIMELINE & HOW TO APPLY
    const isAdmissionsQuery = /admissions?|how\s*to\s*apply|application|enroll|register|deadline|intake|interview|entrance\s*exam/i.test(q);
    if (isAdmissionsQuery) {
      return {
        reply: `### 🎓 How to Apply & Admissions Timeline in Ghana\n\nAdmissions processes differ between international, private basic, and public senior high schools:\n\n1. **International Schools (Cambridge / IB):**\n   * **Academic Year:** Starts late August / early September.\n   * **Application Window:** Open from **January to May** for the following academic year.\n   * **Requirements:** Previous school report cards, entrance assessment (Maths & English), student and parent interview.\n2. **Private GES Basic Schools (Creche to JHS):**\n   * Rolling admissions with major intakes in September (Term 1) and January (Term 2).\n   * Placement test for Primary and JHS entry.\n3. **Public Senior High Schools (GES / CSSPS):**\n   * Candidates sit BECE in June/July.\n   * Placement results released via CSSPS portal in September/October.\n\n✨ **Apply or Inquire on SchoolDirect:**\nClick on any school in our directory to submit an online admissions inquiry, schedule a campus visit, or connect directly on WhatsApp with admissions officers!`,
        sender: "Akosua AI",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "Which schools have admissions open right now?",
          "How do I book a campus tour?",
          "What documents are needed for international school admissions?",
          "Explore accredited schools"
        ],
        quickLinks: [
          { label: "Explore School Directory", view: "directory" },
          { label: "Track Applications in Parent Portal", view: "parent-portal" }
        ]
      };
    }

    // 11. GENERAL / SMART FALLBACK
    return {
      reply: `Thank you for your question about Ghanaian schooling! 🇬🇭\n\nI can provide detailed insights into:\n* **School Cut-offs & CSSPS:** Tell me your ward's BECE aggregate (e.g., *"What schools accept aggregate 8?"*)\n* **Curriculum Differences:** Ask about Cambridge IGCSE, GES Standards-based, or IB Diploma.\n* **Specific School Details:** Ask about **GIS, Roman Ridge, Morning Star, Presec Legon, Achimota**, etc.\n* **School Fees & Payment:** Inquire about fees, PTA levies, and Mobile Money.\n* **Student Life:** Ask about school bus routes, GHS infirmaries, or library textbooks.\n\nCould you specify which school, region, or topic you would like me to assist you with?`,
      sender: "Akosua AI",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        "How do I calculate CSSPS BECE aggregate?",
        "Compare Cambridge vs GES curriculum",
        "What are the fees for GIS & Roman Ridge?",
        "Which schools are in East Legon?"
      ],
      quickLinks: [
        { label: "Target School Directory", view: "directory" },
        { label: "CSSPS Placement Simulator", view: "cssps" },
        { label: "Compare Schools Side-by-Side", view: "compare" }
      ]
    };
  }

  // Platform stats
  getStats() {
    return {
      totalSchools: this.data.schools.length,
      totalSuppliers: this.data.suppliers.length,
      activeRFQs: this.data.rfqs.length,
      openJobs: this.data.jobs.length,
      totalTeachers: (this.data.teachers || []).length,
      totalCSSPSSchools: (this.data.csspsSchools || []).length,
      totalTransactions: (this.data.transactions || []).length,
      totalRevenueGHS: (this.data.transactions || []).reduce((acc, t) => acc + (t.status === 'success' ? t.amount : 0), 0),
      totalApplications: (this.data.admissionApplications || []).length,
      totalReviews: (this.data.reviews || []).length,
      totalInquiries: (this.data.inquiries || []).length,
      totalAcademicResources: (this.data.academicResources || []).length,
      verifiedDocsCount: (this.data.verificationDocs || []).length + 8,
      regionsCovered: ["Greater Accra", "Ashanti", "Central", "Eastern"],
      totalLeadsLogged: this.data.leads.length + 185
    };
  }
}

module.exports = new Database();
