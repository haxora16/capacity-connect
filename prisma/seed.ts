import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CAPACITY CONNECT institutional database with Argon2id secure hashes...");

  // Generate real Argon2id hash for development seed credentials
  const defaultPasswordHash = await hashPassword("Password123!");

  // Clean existing tables in reverse order
  await prisma.session.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.emailVerificationToken.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.riskAssessment.deleteMany();
  await prisma.trainerCompetency.deleteMany();
  await prisma.traineeCompetency.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.assessmentAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.traineeProfile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@capacityconnect.gov.in",
      passwordHash: defaultPasswordHash,
      name: "Dr. Arvind Nambiar",
      fullName: "Dr. Arvind Nambiar",
      role: "ADMIN",
      status: "ACTIVE",
      isActive: true,
      isApproved: true,
      organization: "National Institute of Atmospheric & Meteorological Sciences (NIAMS)",
      designation: "Director of Capacity Building & Training",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    },
  });

  await prisma.adminProfile.create({
    data: {
      userId: adminUser.id,
      department: "Directorate of Capacity Building & Training",
      designation: "Director General",
    },
  });

  // 2. Create Trainers
  const trainer1User = await prisma.user.create({
    data: {
      email: "trainer.sharma@capacityconnect.gov.in",
      passwordHash: defaultPasswordHash,
      name: "Dr. Rajesh Sharma",
      role: "TRAINER",
      status: "ACTIVE",
      organization: "Center for Radar & Satellite Meteorology (CRSM)",
      designation: "Chief Scientist & Master Trainer",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const trainer1Profile = await prisma.trainerProfile.create({
    data: {
      userId: trainer1User.id,
      specialization: "Doppler Weather Radar & Satellite Remote Sensing",
      qualifications: JSON.stringify(["Ph.D. in Atmospheric Physics (IIT Delhi)", "M.Tech in Remote Sensing"]),
      experienceYears: 18,
      rating: 4.9,
      matchScoreCache: 94.0,
    },
  });

  const trainer2User = await prisma.user.create({
    data: {
      email: "trainer.sen@capacityconnect.gov.in",
      passwordHash: defaultPasswordHash,
      name: "Dr. Sunita Sen",
      role: "TRAINER",
      status: "ACTIVE",
      organization: "National Center for Numerical Weather Prediction (NCNWP)",
      designation: "Senior Lead Modeler",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
  });

  const trainer2Profile = await prisma.trainerProfile.create({
    data: {
      userId: trainer2User.id,
      specialization: "Numerical Weather Prediction & Data Assimilation",
      qualifications: JSON.stringify(["Ph.D. in Meteorology (IISc Bangalore)", "M.Sc. in Applied Mathematics"]),
      experienceYears: 14,
      rating: 4.8,
      matchScoreCache: 91.0,
    },
  });

  const trainer3User = await prisma.user.create({
    data: {
      email: "trainer.mukherjee@capacityconnect.gov.in",
      passwordHash: defaultPasswordHash,
      name: "Dr. Amitav Mukherjee",
      role: "TRAINER",
      status: "ACTIVE",
      organization: "Aviation & Tropical Meteorology Directorate",
      designation: "Principal Technical Trainer",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  const trainer3Profile = await prisma.trainerProfile.create({
    data: {
      userId: trainer3User.id,
      specialization: "Synoptic Meteorology & Aviation Weather Hazards",
      qualifications: JSON.stringify(["Ph.D. in Tropical Meteorology", "WMO Class-I Certified Forecaster"]),
      experienceYears: 20,
      rating: 4.7,
      matchScoreCache: 88.0,
    },
  });

  // 3. Create Trainees
  const trainee1User = await prisma.user.create({
    data: {
      email: "ananya.verma@capacityconnect.gov.in",
      passwordHash: defaultPasswordHash,
      name: "Ananya Verma",
      role: "TRAINEE",
      status: "ACTIVE",
      organization: "Regional Meteorological Forecasting Center, Delhi",
      designation: "Operational Forecaster (Grade II)",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  });

  const trainee1Profile = await prisma.traineeProfile.create({
    data: {
      userId: trainee1User.id,
      qualifications: JSON.stringify(["M.Sc. Physics (University of Delhi)", "PG Diploma in Meteorology"]),
      experienceYears: 4,
      skills: JSON.stringify(["Synoptic Chart Analysis", "Satellite Imagery Interpretation", "Nowcasting", "Python Data Science"]),
      interests: JSON.stringify(["Convective Storm Nowcasting", "Doppler Radar Velocity De-aliasing", "NWP Verification"]),
      competencyScore: 82.5,
    },
  });

  const trainee2User = await prisma.user.create({
    data: {
      email: "rohan.deshmukh@capacityconnect.gov.in",
      passwordHash: defaultPasswordHash,
      name: "Rohan Deshmukh",
      role: "TRAINEE",
      status: "ACTIVE",
      organization: "Coastal Cyclone Warning Centre, Mumbai",
      designation: "Assistant Meteorologist",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
  });

  const trainee2Profile = await prisma.traineeProfile.create({
    data: {
      userId: trainee2User.id,
      qualifications: JSON.stringify(["B.Tech Environmental Engineering", "Diploma in Geospatial Tech"]),
      experienceYears: 2,
      skills: JSON.stringify(["Radar Basic Interpretation", "GIS Mapping", "Surface Observations"]),
      interests: JSON.stringify(["Tropical Cyclogenesis", "Sea Surface Temperature Modeling"]),
      competencyScore: 68.0,
    },
  });

  const trainee3User = await prisma.user.create({
    data: {
      email: "priya.balakrishnan@capacityconnect.gov.in",
      passwordHash: defaultPasswordHash,
      name: "Priya Balakrishnan",
      role: "TRAINEE",
      status: "ACTIVE",
      organization: "Agromet Field Unit, Coimbatore",
      designation: "Agromet Technical Officer",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
  });

  const trainee3Profile = await prisma.traineeProfile.create({
    data: {
      userId: trainee3User.id,
      qualifications: JSON.stringify(["M.Sc. Agricultural Meteorology", "B.Sc. Agriculture"]),
      experienceYears: 3,
      skills: JSON.stringify(["Crop Weather Modeling", "Rainfall Statistical Analysis"]),
      interests: JSON.stringify(["Monsoon Long-range Forecasting", "Soil Moisture Indices"]),
      competencyScore: 44.5,
    },
  });

  const trainee4User = await prisma.user.create({
    data: {
      email: "karan.malhotra@capacityconnect.gov.in",
      passwordHash: defaultPasswordHash,
      name: "Karan Malhotra",
      role: "TRAINEE",
      status: "ACTIVE",
      organization: "Mountain Weather Observatory, Shimla",
      designation: "Radar Station In-Charge",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    },
  });

  const trainee4Profile = await prisma.traineeProfile.create({
    data: {
      userId: trainee4User.id,
      qualifications: JSON.stringify(["B.Tech Electronics & Communication", "Radar Maintenance Cert"]),
      experienceYears: 5,
      skills: JSON.stringify(["Radar Calibration", "Doppler Product Tuning", "Signal Processing"]),
      interests: JSON.stringify(["Orographic Precipitation", "Cloud Burst Dynamics"]),
      competencyScore: 58.0,
    },
  });

  const trainee5User = await prisma.user.create({
    data: {
      email: "meera.swaminathan@capacityconnect.gov.in",
      passwordHash: defaultPasswordHash,
      name: "Meera Swaminathan",
      role: "TRAINEE",
      status: "ACTIVE",
      organization: "National River Flow Forecasting Center, Patna",
      designation: "Hydromet Specialist",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
  });

  const trainee5Profile = await prisma.traineeProfile.create({
    data: {
      userId: trainee5User.id,
      qualifications: JSON.stringify(["M.Tech Water Resources Engineering", "B.Tech Civil"]),
      experienceYears: 6,
      skills: JSON.stringify(["Quantitative Precipitation Estimation (QPE)", "Hydrological Routing", "HEC-HMS"]),
      interests: JSON.stringify(["Urban Flood Modeling", "Extreme Event Probability"]),
      competencyScore: 89.0,
    },
  });

  const trainee6User = await prisma.user.create({
    data: {
      email: "vikram.rathore@capacityconnect.gov.in",
      passwordHash: defaultPasswordHash,
      name: "Vikram Rathore",
      role: "TRAINEE",
      status: "ACTIVE",
      organization: "Aviation Met Office, Bengaluru International Airport",
      designation: "Aerodrome Forecaster",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    },
  });

  const trainee6Profile = await prisma.traineeProfile.create({
    data: {
      userId: trainee6User.id,
      qualifications: JSON.stringify(["M.Sc. Atmospheric Science", "Aviation Meteorology License (ICAO)"]),
      experienceYears: 4,
      skills: JSON.stringify(["METAR/TAF Formulation", "Low-Level Wind Shear Detection", "Runway Fog Forecasting"]),
      interests: JSON.stringify(["Clear Air Turbulence (CAT)", "Aviation Convective Warnings"]),
      competencyScore: 86.0,
    },
  });

  // 4. Create 8 Realistic Domain Courses
  const coursesData = [
    {
      code: "MET-RAD-401",
      title: "Doppler Weather Radar: Operational Principles & Severe Weather Nowcasting",
      subject: "Radar Meteorology",
      category: "Operational Remote Sensing",
      difficulty: "ADVANCED",
      durationHours: 32,
      trainerId: trainer1Profile.id,
      description:
        "Comprehensive operational curriculum covering dual-polarization radar signatures, velocity de-aliasing, Z-R relationship calibration, meso-cyclone detection, and microburst warning algorithms for critical severe weather nowcasting.",
      objectives: JSON.stringify([
        "Interpret dual-polarimetric variables (Z_DR, Rho_HV, K_DP) for hydrometeor classification",
        "Identify hook echoes, bow echoes, and bounded weak echo regions (BWER) in convective storms",
        "Calibrate Quantitative Precipitation Estimation (QPE) grids using ground rain gauge networks",
        "Execute nowcasting warning issuances within standard 15-minute lead-time protocols",
      ]),
      modules: [
        {
          title: "Module 1: Dual-Polarization Theory & Base Products",
          orderIndex: 1,
          durationMin: 90,
          resourceType: "PDF",
          content: "Detailed mathematical foundations of reflectivity factor Z, differential reflectivity ZDR, and copolar correlation coefficient RhoHV. Analysis of raindrop flattening and non-meteorological artifact filtering.",
        },
        {
          title: "Module 2: Doppler Velocity Analysis & Artifact Filtering",
          orderIndex: 2,
          durationMin: 75,
          resourceType: "VIDEO",
          content: "Techniques for resolving Doppler velocity ambiguity, Nyquist velocity bounds, folding patterns, ground clutter suppression, and anomalous propagation (AP) signatures.",
        },
        {
          title: "Module 3: Convective Storm Signatures & Severe Weather Warnings",
          orderIndex: 3,
          durationMin: 120,
          resourceType: "PPT",
          content: "Case studies of supercell thunderstorms, microburst wind shear alerts, hail core detection using Differential Phase shift (KDP), and automated storm cell tracking.",
        },
      ],
    },
    {
      code: "MET-SAT-302",
      title: "Geostationary & Polar Satellite Imagery Interpretation for Tropical Weather",
      subject: "Satellite Meteorology",
      category: "Remote Sensing",
      difficulty: "INTERMEDIATE",
      durationHours: 24,
      trainerId: trainer1Profile.id,
      description:
        "Practical training on multi-spectral satellite channels (Visible, Thermal IR, Water Vapor), RGB composite interpretations (Dust, Day Convective Storm, Air Mass), and Dvorak technique for tropical cyclone intensity estimation.",
      objectives: JSON.stringify([
        "Analyze Water Vapor channel imagery to diagnose upper-tropospheric jet streaks and trough dynamics",
        "Utilize Cloud Top Brightness Temperature (CTBT) thresholds for deep convection monitoring",
        "Apply the Dvorak Technique using enhanced IR and visible curves for cyclone T-number calculation",
      ]),
      modules: [
        {
          title: "Module 1: Spectral Channels & Atmospheric Windows",
          orderIndex: 1,
          durationMin: 60,
          resourceType: "PDF",
          content: "Physical principles of radiance emission, absorption bands of H2O and CO2, thermal infrared calibration, and visible albedo corrections.",
        },
        {
          title: "Module 2: RGB Composite Products & Feature Extraction",
          orderIndex: 2,
          durationMin: 90,
          resourceType: "PPT",
          content: "Constructing and interpreting standard EUMETSAT/ISRO RGB recipes: Ash/Dust composite, Night-time microphysics (fog/low cloud), and Severe Convection RGB.",
        },
        {
          title: "Module 3: Tropical Cyclone Intensity & Dvorak Analysis",
          orderIndex: 3,
          durationMin: 110,
          resourceType: "TEXT",
          content: "Step-by-step evaluation of Curved Band pattern, Shear pattern, Eye pattern, and Central Cold Cover (CCC) for assigning Current Intensity (CI) numbers.",
        },
      ],
    },
    {
      code: "MET-NWP-501",
      title: "Numerical Weather Prediction: Model Physics, Data Assimilation & Ensembles",
      subject: "Numerical Weather Prediction",
      category: "Computational Modeling",
      difficulty: "ADVANCED",
      durationHours: 40,
      trainerId: trainer2Profile.id,
      description:
        "Advanced course covering grid-point and spectral formulations, hydrostatic vs non-hydrostatic dynamics, 3D/4D-Var data assimilation pipelines, parameterization of boundary layers, and ensemble prediction system (EPS) interpretation.",
      objectives: JSON.stringify([
        "Understand primitive equations of atmospheric dynamics and Navier-Stokes approximations",
        "Evaluate the impact of satellite radiance assimilation and Doppler radial velocity in WRF/GFS",
        "Interpret ensemble postage-stamp charts and ensemble meteograms for probabilistic forecasts",
      ]),
      modules: [
        {
          title: "Module 1: Governing Dynamical Equations & Discretization",
          orderIndex: 1,
          durationMin: 90,
          resourceType: "PDF",
          content: "Continuity, thermodynamic energy, momentum equations in generalized vertical coordinates. Courant-Friedrichs-Lewy (CFL) numerical stability criteria.",
        },
        {
          title: "Module 2: Physical Parameterization Schemes",
          orderIndex: 2,
          durationMin: 100,
          resourceType: "TEXT",
          content: "Cumulus parameterization (Kain-Fritsch, Grell-Freitas), microphysics schemes (Thompson, Morrison), planetary boundary layer (YSU, MYJ), and land-surface interaction (Noah LSM).",
        },
        {
          title: "Module 3: Data Assimilation & Ensemble Forecasting (EPS)",
          orderIndex: 3,
          durationMin: 120,
          resourceType: "PPT",
          content: "Variational assimilation equations (Cost function J(x)), background error covariance matrix B, ensemble kalman filtering (EnKF), and ensemble spread-skill relationship.",
        },
      ],
    },
    {
      code: "MET-SYN-201",
      title: "Synoptic Meteorology: Weather Systems, Fronts & Monsoon Dynamics",
      subject: "Synoptic Meteorology",
      category: "Theoretical & Applied",
      difficulty: "INTERMEDIATE",
      durationHours: 28,
      trainerId: trainer3Profile.id,
      description:
        "Core foundational training on constant pressure chart plotting, quasi-geostrophic theory, vorticity advection, jet streak circulations, Western Disturbances, and the South Asian Monsoon low-pressure trough.",
      objectives: JSON.stringify([
        "Analyze 850, 500, 300, and 200 hPa synoptic isobaric charts with streamline/isotach analysis",
        "Apply QG Omega equation to diagnose synoptic-scale vertical motion (updrafts/downdrafts)",
        "Track Monsoon Depressions, Monsoon Trough axis fluctuations, and Break Monsoon episodes",
      ]),
      modules: [
        {
          title: "Module 1: Atmospheric Kinematics & Pressure Systems",
          orderIndex: 1,
          durationMin: 80,
          resourceType: "TEXT",
          content: "Geostrophic, gradient, and thermal wind balances. Barotropic versus baroclinic atmosphere definitions and thickness advection diagnostics.",
        },
        {
          title: "Module 2: Quasi-Geostrophic Dynamics & Vorticity",
          orderIndex: 2,
          durationMin: 90,
          resourceType: "PDF",
          content: "Absolute and relative vorticity, potential vorticity (PV) thinking, dynamical tropopause folding, and cyclogenesis triggering mechanisms.",
        },
        {
          title: "Module 3: Monsoon Depressions & Synoptic Systems",
          orderIndex: 3,
          durationMin: 100,
          resourceType: "PPT",
          content: "Origins of Bay of Bengal monsoon depressions, Tibetan High influence, Tropical Easterly Jet (TEJ), Low-Level Jet (Somali Jet), and Western Disturbance interactions.",
        },
      ],
    },
    {
      code: "MET-AVI-303",
      title: "Aviation Meteorology: Aerodrome Hazards, Fog, Wind Shear & ICAO Standards",
      subject: "Aviation Meteorology",
      category: "Aviation Safety",
      difficulty: "INTERMEDIATE",
      durationHours: 20,
      trainerId: trainer3Profile.id,
      description:
        "Standardized training for airport meteorologists following WMO Doc 258 and ICAO Annex 3. Covers Runway Visual Range (RVR), radiation and advection fog mechanisms, Clear Air Turbulence (CAT), microburst wind shear detection, and SIGMET/TAF formulation.",
      objectives: JSON.stringify([
        "Formulate precise, error-free METAR, SPECI, and 24/30-hour TAF reports per ICAO formats",
        "Forecast airport radiation fog onset and dissipation using boundary layer humidity profiles",
        "Issue aviation hazard warnings for Low-Level Wind Shear (LLWS) and severe aircraft icing",
      ]),
      modules: [
        {
          title: "Module 1: ICAO Annex 3 Regulations & Aerodrome Reports",
          orderIndex: 1,
          durationMin: 60,
          resourceType: "TEXT",
          content: "Code forms and criteria for SPECI amendments, CAVOK conditions, trend forecasts, significant weather charts (SIGWX), and aerodrome climatological tables.",
        },
        {
          title: "Module 2: Boundary Layer Hazards: Radiation Fog & Visibility",
          orderIndex: 2,
          durationMin: 75,
          resourceType: "PDF",
          content: "Thermodynamics of droplet nucleation, nocturnal cooling rate calculations, moisture convergence in low-lying aerodromes, and transmissometer instrumentation.",
        },
        {
          title: "Module 3: In-Flight Hazards: Turbulence, Icing & Wind Shear",
          orderIndex: 3,
          durationMin: 85,
          resourceType: "PPT",
          content: "Mountain wave turbulence, Richardson number thresholds, supercooled large droplet (SLD) icing physics, and Terminal Doppler Weather Radar (TDWR) microburst alerts.",
        },
      ],
    },
    {
      code: "MET-CLM-402",
      title: "Climate Science & Long-Range Teleconnections (ENSO, IOD, MJO)",
      subject: "Climate Science",
      category: "Climate & Diagnostics",
      difficulty: "ADVANCED",
      durationHours: 30,
      trainerId: trainer2Profile.id,
      description:
        "In-depth investigation of ocean-atmosphere coupled systems, equatorial wave dynamics, El Niño Southern Oscillation (ENSO) indices, Indian Ocean Dipole (IOD), and Madden-Julian Oscillation (MJO) phase tracking for extended-range monsoon forecasting.",
      objectives: JSON.stringify([
        "Compute and interpret Niño 3.4 SST anomalies and Southern Oscillation Index (SOI)",
        "Track MJO Real-time Multivariate MJO (RMM) phase space diagram for rainfall pulse prediction",
        "Utilize Climate Forecast System (CFSv2) outputs for seasonal rainfall outlooks",
      ]),
      modules: [
        {
          title: "Module 1: Ocean-Atmosphere Coupled Physics",
          orderIndex: 1,
          durationMin: 90,
          resourceType: "PDF",
          content: "Walker circulation, thermocline depth variations, Kelvin wave propagation along the equatorial waveguide, and Bjerknes positive feedback mechanism.",
        },
        {
          title: "Module 2: Regional Dipoles & Intraseasonal Oscillations",
          orderIndex: 2,
          durationMin: 85,
          resourceType: "PPT",
          content: "Dipole Mode Index (DMI), equatorial Indian Ocean counter-currents, Boreal Summer Intra-Seasonal Oscillation (BSISO), and eastward/northward propagation modes.",
        },
        {
          title: "Module 3: Statistical & Dynamical Long-Range Modeling",
          orderIndex: 3,
          durationMin: 95,
          resourceType: "TEXT",
          content: "Canonical correlation analysis, multi-model ensemble downscaling, spatial correlation verification, and communicating probabilistic climate risk to policy makers.",
        },
      ],
    },
    {
      code: "MET-ATM-101",
      title: "Foundations of Atmospheric Physics & Skew-T / Log-P Thermodynamic Diagrams",
      subject: "Atmospheric Science",
      category: "Core Foundations",
      difficulty: "BEGINNER",
      durationHours: 18,
      trainerId: trainer1Profile.id,
      description:
        "Essential atmospheric thermodynamics: hydrostatic balance, hypsometric equation, dry and moist adiabatic lapse rates, radiosonde tephigram/skew-T analysis, CAPE, CIN, Lifted Condensation Level (LCL), and Level of Free Convection (LFC).",
      objectives: JSON.stringify([
        "Plot and evaluate radiosonde sounding data on Skew-T / Log-P thermodynamic diagrams",
        "Calculate Convective Available Potential Energy (CAPE) and Convective Inhibition (CIN)",
        "Estimate cloud base heights (LCL) and thunderstorm initiation potential from sounding indices",
      ]),
      modules: [
        {
          title: "Module 1: Thermodynamic Equations & Hydrostatics",
          orderIndex: 1,
          durationMin: 60,
          resourceType: "PDF",
          content: "Equation of state for dry and moist air, virtual temperature definition, geopotential height, hydrostatic equation, and standard atmosphere benchmarks.",
        },
        {
          title: "Module 2: Adiabatic Processes & Lapse Rates",
          orderIndex: 2,
          durationMin: 75,
          resourceType: "TEXT",
          content: "Dry adiabatic lapse rate (DALR = 9.8°C/km), saturated adiabatic lapse rate (SALR), pseudo-adiabatic charts, equivalent potential temperature Theta_e, and entropy.",
        },
        {
          title: "Module 3: Sounding Indices & Atmospheric Stability",
          orderIndex: 3,
          durationMin: 90,
          resourceType: "PPT",
          content: "Graphical determination of LCL, CCL, LFC, EL. Computing K-Index, Total Totals (TT), Bulk Richardson Number (BRN), and severe weather instability thresholds.",
        },
      ],
    },
    {
      code: "MET-FOR-304",
      title: "Operational Weather Forecasting, Verification & Impact-Based Warning Systems",
      subject: "Weather Forecasting",
      category: "Operational Practice",
      difficulty: "INTERMEDIATE",
      durationHours: 26,
      trainerId: trainer3Profile.id,
      description:
        "Bridging theoretical meteorology with operational decision support: color-coded disaster warning matrices (Green/Yellow/Orange/Red), forecast verification metrics (POD, FAR, CSI, Brier Score), and public safety dissemination protocols.",
      objectives: JSON.stringify([
        "Construct 5-day district-level impact-based weather forecast bulletins",
        "Calculate standard contingency table verification metrics (Probability of Detection, False Alarm Ratio)",
        "Design disaster management alert matrices in coordination with civil defense authorities",
      ]),
      modules: [
        {
          title: "Module 1: Operational Forecasting Workflow & Synthesis",
          orderIndex: 1,
          durationMin: 70,
          resourceType: "TEXT",
          content: "Integration of real-time AWS observations, radar scans, satellite IR/visible feeds, and multi-model NWP guidance in operational 24/7 briefing rooms.",
        },
        {
          title: "Module 2: Impact-Based Forecast & Warning Matrices",
          orderIndex: 2,
          durationMin: 80,
          resourceType: "PDF",
          content: "WMO Guidelines on Multi-Hazard Impact-Based Forecast and Warning Services (WMO-No. 1150). Vulnerability and exposure mapping for municipal action plans.",
        },
        {
          title: "Module 3: Forecast Skill Scores & Statistical Verification",
          orderIndex: 3,
          durationMin: 90,
          resourceType: "PPT",
          content: "2x2 contingency tables, Critical Success Index (Threat Score), Equitable Threat Score (ETS), Relative Operating Characteristic (ROC) curves, and continuous RMSE analysis.",
        },
      ],
    },
  ];

  const createdCourses = [];
  for (const c of coursesData) {
    const { modules, ...courseFields } = c;
    const course = await prisma.course.create({
      data: {
        ...courseFields,
        modules: {
          create: modules.map((m) => ({
            title: m.title,
            orderIndex: m.orderIndex,
            durationMin: m.durationMin,
            resourceType: m.resourceType,
            content: m.content,
            isOfflineReady: true,
          })),
        },
      },
      include: { modules: true },
    });
    createdCourses.push(course);
  }

  console.log(`✅ Created ${createdCourses.length} realistic courses with structured modules.`);

  // 5. Create Resources in Trainer Library
  const resourcesData = [
    {
      trainerId: trainer1Profile.id,
      title: "WMO Guidelines on Doppler Weather Radar Operations (Doc-No-1082)",
      type: "PDF",
      subject: "Radar Meteorology",
      fileSizeKb: 4850,
      fileUrl: "/docs/radar-guidelines-wmo.pdf",
    },
    {
      trainerId: trainer1Profile.id,
      title: "Dual-Polarization Hydrometeor Classification Decision Tree",
      type: "PPT",
      subject: "Radar Meteorology",
      fileSizeKb: 8420,
      fileUrl: "/docs/dual-pol-decision-tree.pptx",
    },
    {
      trainerId: trainer2Profile.id,
      title: "WRF Model Physics Parameterization Best Practices Manual",
      type: "PDF",
      subject: "Numerical Weather Prediction",
      fileSizeKb: 6200,
      fileUrl: "/docs/wrf-physics-manual.pdf",
    },
    {
      trainerId: trainer2Profile.id,
      title: "Ensemble Prediction System (EPS) Interpretation Lecture Slides",
      type: "PPT",
      subject: "Numerical Weather Prediction",
      fileSizeKb: 12400,
      fileUrl: "/docs/eps-interpretation.pptx",
    },
    {
      trainerId: trainer3Profile.id,
      title: "ICAO Annex 3: Meteorological Service for International Air Navigation",
      type: "PDF",
      subject: "Aviation Meteorology",
      fileSizeKb: 9150,
      fileUrl: "/docs/icao-annex-3.pdf",
    },
    {
      trainerId: trainer3Profile.id,
      title: "Synoptic Chart Plotting Symbols & Pressure Tendency Reference Card",
      type: "PDF",
      subject: "Synoptic Meteorology",
      fileSizeKb: 1850,
      fileUrl: "/docs/synoptic-symbols-card.pdf",
    },
  ];

  for (const r of resourcesData) {
    await prisma.resource.create({ data: r });
  }

  // 6. Create Comprehensive Assessments with realistic domain Questions
  const radCourse = createdCourses.find((c) => c.code === "MET-RAD-401")!;
  const satCourse = createdCourses.find((c) => c.code === "MET-SAT-302")!;
  const nwpCourse = createdCourses.find((c) => c.code === "MET-NWP-501")!;
  const synCourse = createdCourses.find((c) => c.code === "MET-SYN-201")!;

  const radAssessment = await prisma.assessment.create({
    data: {
      courseId: radCourse.id,
      title: "Comprehensive Evaluation: Doppler Radar Dual-Pol & Severe Weather Diagnostics",
      subject: "Radar Meteorology",
      difficulty: "ADVANCED",
      durationMinutes: 25,
      passingScore: 65.0,
      totalMarks: 50,
      isAiGenerated: true,
      questions: {
        create: [
          {
            orderIndex: 1,
            marks: 10,
            topic: "Dual-Polarization Hydrometeor Classification",
            questionText:
              "In a severe convective storm core, you observe very high horizontal reflectivity (Z_H > 62 dBZ) accompanied by near-zero differential reflectivity (Z_DR ≈ 0.0 to 0.4 dB) and low copolar correlation coefficient (Rho_HV < 0.88). What is the most definitive hydrometeor signature?",
            options: JSON.stringify([
              "Large tumbling dry hail stones (> 4 cm diameter)",
              "Intense tropical warm rain with oblate raindrops",
              "Dry aggregated snow flakes above freezing level",
              "Biological scatterers (insects/birds) in the boundary layer",
            ]),
            correctOption: 0,
            explanation:
              "Large dry hail tumbles randomly as it falls, presenting an apparent spherical aspect ratio on average (Z_DR ≈ 0 dB) despite extremely high radar reflectivity (Z_H > 60 dBZ). Mixed-phase irregular scattering causes a dip in correlation coefficient (Rho_HV < 0.90).",
          },
          {
            orderIndex: 2,
            marks: 10,
            topic: "Doppler Velocity & Nyquist Limit",
            questionText:
              "A Doppler weather radar operates at a Pulse Repetition Frequency (PRF) of 1000 Hz at C-band (wavelength λ = 5.3 cm). What is the maximum unambiguous Doppler velocity (Nyquist velocity V_max)?",
            options: JSON.stringify([
              "13.25 m/s",
              "26.5 m/s",
              "53.0 m/s",
              "106.0 m/s",
            ]),
            correctOption: 0,
            explanation:
              "The Nyquist velocity formula is V_max = (PRF * λ) / 4. Substituting PRF = 1000 Hz and λ = 0.053 m gives V_max = (1000 * 0.053) / 4 = 53 / 4 = 13.25 m/s.",
          },
          {
            orderIndex: 3,
            marks: 10,
            topic: "Supercell Convective Signatures",
            questionText:
              "Which radar reflectivity feature on a low-elevation PPI scan is most famously associated with a cyclonically rotating updraft (mesocyclone) and potential tornadogenesis?",
            options: JSON.stringify([
              "Hook Echo surrounding a Weak Echo Region (WER)",
              "Bright Band signature at the 0°C melting level",
              "Uniform stratiform shield with low Z_DR gradient",
              "Speckled ground clutter return near the radar tower",
            ]),
            correctOption: 0,
            explanation:
              "A Hook Echo is formed when precipitation wraps around the strong updraft and mesocyclone in a classic supercell, enclosing the Bounded Weak Echo Region (BWER).",
          },
          {
            orderIndex: 4,
            marks: 10,
            topic: "Differential Phase Shift (K_DP)",
            questionText:
              "What is the primary operational advantage of using Specific Differential Phase (K_DP) over horizontal reflectivity (Z_H) for heavy rainfall estimation?",
            options: JSON.stringify([
              "K_DP is immune to partial radar beam blockage and radar absolute calibration errors",
              "K_DP is unaffected by raindrop size distribution variations",
              "K_DP operates exclusively in light snow and clear air",
              "K_DP does not require dual-polarization hardware",
            ]),
            correctOption: 0,
            explanation:
              "Because K_DP is a phase-propagation metric rather than an amplitude-power measurement, it is immune to attenuation, receiver calibration drift, and partial beam blockage.",
          },
          {
            orderIndex: 5,
            marks: 10,
            topic: "Microburst Wind Shear Alerts",
            questionText:
              "A Terminal Doppler Weather Radar detects a rapid divergence signature of Delta-V = 45 knots over a 3 km baseline near the airport runway threshold. Which immediate protocol must be executed?",
            options: JSON.stringify([
              "Issue an immediate Microburst Wind Shear Alert to Air Traffic Control (ATC)",
              "Wait for ground anemometers to verify the gust front",
              "Downgrade the alert to general convective turbulence",
              "Re-scan the volume at higher elevation angles only",
            ]),
            correctOption: 0,
            explanation:
              "A velocity difference > 30 knots across a short baseline (< 4 km) indicates a severe microburst outflow capable of causing fatal aircraft loss of airspeed on approach/takeoff. An immediate Microburst Alert is mandatory per ICAO protocols.",
          },
        ],
      },
    },
  });

  const satAssessment = await prisma.assessment.create({
    data: {
      courseId: satCourse.id,
      title: "Mid-Term Examination: Satellite Meteorology & Tropical Systems",
      subject: "Satellite Meteorology",
      difficulty: "INTERMEDIATE",
      durationMinutes: 20,
      passingScore: 60.0,
      totalMarks: 30,
      isAiGenerated: false,
      questions: {
        create: [
          {
            orderIndex: 1,
            marks: 10,
            topic: "Spectral Bands",
            questionText:
              "In which spectral region is the 6.7 µm infrared channel centered, and what atmospheric feature is it primarily used to diagnose?",
            options: JSON.stringify([
              "Water Vapor absorption band; upper-tropospheric moisture and jet stream dynamics",
              "Thermal Window band; sea surface skin temperatures",
              "Visible band; daytime boundary layer aerosol optical depth",
              "Carbon Dioxide band; stratospheric ozone depletion",
            ]),
            correctOption: 0,
            explanation:
              "The 6.7 µm band is sensitive to water vapor in the middle and upper troposphere (400-200 hPa), revealing jet streams, dry intrusions, and vorticity lobes even in cloud-free skies.",
          },
          {
            orderIndex: 2,
            marks: 10,
            topic: "Dvorak Cyclone Intensity",
            questionText:
              "According to the Dvorak Technique, when an eye pattern exhibits a cold surrounding ring with temperature < -70°C and a warm eye with temperature > +10°C, the estimated T-number indicates:",
            options: JSON.stringify([
              "Very Severe / Super Cyclonic Storm intensity (T5.5 to T6.5+)",
              "Initial tropical depression stage (T1.5)",
              "Dissipating remnant low pressure area",
              "Subtropical extratropical transition state",
            ]),
            correctOption: 0,
            explanation:
              "The eye pattern intensity is governed by the temperature difference between the warm eye and the coldest surrounding overcast ring. A warm eye encased in extremely cold cloud tops yields high T-numbers (T5.5 - T6.5+).",
          },
          {
            orderIndex: 3,
            marks: 10,
            topic: "RGB Composite Interpretation",
            questionText:
              "On a Night Microphysics RGB composite, low-level warm water-droplet clouds (such as radiation fog and stratus) appear characteristically in which distinct color tone?",
            options: JSON.stringify([
              "Light green to cyan tone",
              "Deep dark blue tone",
              "Bright red/magenta tone",
              "Pitch black tone",
            ]),
            correctOption: 0,
            explanation:
              "Because 3.9 µm emissivity differs significantly from 10.8 µm for water droplet clouds at night, the difference channel creates a prominent green component, rendering fog/stratus in distinctive light green/cyan.",
          },
        ],
      },
    },
  });

  // 7. Create Enrollments and Assessment Attempts for Trainees
  // Ananya Verma (Trainee 1) - High Performer (Enrolled in 3 courses, passed assessments with high scores)
  await prisma.enrollment.create({
    data: {
      userId: trainee1User.id,
      courseId: radCourse.id,
      progressPercent: 90.0,
      lastAccessedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: trainee1User.id,
      courseId: satCourse.id,
      progressPercent: 100.0,
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: trainee1User.id,
      courseId: nwpCourse.id,
      progressPercent: 65.0,
    },
  });

  // Attempt for Ananya on Radar (Score 40/50 = 80%)
  const ananyaRadAttempt = await prisma.assessmentAttempt.create({
    data: {
      userId: trainee1User.id,
      assessmentId: radAssessment.id,
      score: 40.0,
      percentage: 80.0,
      isPassed: true,
      timeTakenSec: 1120,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
    },
  });

  // Ananya Attempt on Satellite (Score 30/30 = 100%)
  const ananyaSatAttempt = await prisma.assessmentAttempt.create({
    data: {
      userId: trainee1User.id,
      assessmentId: satAssessment.id,
      score: 30.0,
      percentage: 100.0,
      isPassed: true,
      timeTakenSec: 780,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    },
  });

  // Rohan Deshmukh (Trainee 2) - Steady Progress
  await prisma.enrollment.create({
    data: {
      userId: trainee2User.id,
      courseId: satCourse.id,
      progressPercent: 75.0,
    },
  });

  await prisma.assessmentAttempt.create({
    data: {
      userId: trainee2User.id,
      assessmentId: satAssessment.id,
      score: 20.0,
      percentage: 66.7,
      isPassed: true,
      timeTakenSec: 980,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
  });

  // Priya Balakrishnan (Trainee 3) - AT RISK (Low score on Radar test, 1 missed test, inactive for 16 days)
  await prisma.enrollment.create({
    data: {
      userId: trainee3User.id,
      courseId: radCourse.id,
      progressPercent: 30.0,
      lastAccessedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16),
    },
  });

  await prisma.assessmentAttempt.create({
    data: {
      userId: trainee3User.id,
      assessmentId: radAssessment.id,
      score: 20.0,
      percentage: 40.0,
      isPassed: false,
      timeTakenSec: 1450,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16),
    },
  });

  // Karan Malhotra (Trainee 4) - Medium Risk
  await prisma.enrollment.create({
    data: {
      userId: trainee4User.id,
      courseId: radCourse.id,
      progressPercent: 55.0,
      lastAccessedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    },
  });

  await prisma.assessmentAttempt.create({
    data: {
      userId: trainee4User.id,
      assessmentId: radAssessment.id,
      score: 28.0,
      percentage: 56.0,
      isPassed: false,
      timeTakenSec: 1300,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    },
  });

  // 8. Competency Mapping Records (Current vs Target Scores)
  const competenciesData = [
    // Ananya Verma
    { profileId: trainee1Profile.id, subjectArea: "Radar Meteorology", currentScore: 82.0, targetScore: 90.0, gapScore: 8.0 },
    { profileId: trainee1Profile.id, subjectArea: "Satellite Meteorology", currentScore: 92.0, targetScore: 90.0, gapScore: -2.0 },
    { profileId: trainee1Profile.id, subjectArea: "Numerical Weather Prediction", currentScore: 68.0, targetScore: 85.0, gapScore: 17.0 },
    { profileId: trainee1Profile.id, subjectArea: "Synoptic Meteorology", currentScore: 85.0, targetScore: 88.0, gapScore: 3.0 },
    { profileId: trainee1Profile.id, subjectArea: "Aviation Meteorology", currentScore: 78.0, targetScore: 85.0, gapScore: 7.0 },

    // Rohan Deshmukh
    { profileId: trainee2Profile.id, subjectArea: "Radar Meteorology", currentScore: 58.0, targetScore: 80.0, gapScore: 22.0 },
    { profileId: trainee2Profile.id, subjectArea: "Satellite Meteorology", currentScore: 72.0, targetScore: 85.0, gapScore: 13.0 },
    { profileId: trainee2Profile.id, subjectArea: "Numerical Weather Prediction", currentScore: 52.0, targetScore: 75.0, gapScore: 23.0 },
    { profileId: trainee2Profile.id, subjectArea: "Synoptic Meteorology", currentScore: 65.0, targetScore: 80.0, gapScore: 15.0 },

    // Priya Balakrishnan (At-Risk Trainee)
    { profileId: trainee3Profile.id, subjectArea: "Radar Meteorology", currentScore: 38.0, targetScore: 80.0, gapScore: 42.0 },
    { profileId: trainee3Profile.id, subjectArea: "Satellite Meteorology", currentScore: 45.0, targetScore: 80.0, gapScore: 35.0 },
    { profileId: trainee3Profile.id, subjectArea: "Numerical Weather Prediction", currentScore: 40.0, targetScore: 75.0, gapScore: 35.0 },
    { profileId: trainee3Profile.id, subjectArea: "Synoptic Meteorology", currentScore: 52.0, targetScore: 80.0, gapScore: 28.0 },
  ];

  for (const comp of competenciesData) {
    await prisma.traineeCompetency.create({ data: comp });
  }

  // 9. Trainer Subject Matching Matrix Records (Explainable 40/20/20/20 scoring model)
  const trainerMatches = [
    // Radar Meteorology
    {
      trainerId: trainer1Profile.id,
      subjectArea: "Radar Meteorology",
      skillMatch: 96.0,
      qualScore: 92.0,
      expScore: 95.0,
      perfScore: 94.0,
      overallMatch: 94.7, // (96*0.4)+(92*0.2)+(95*0.2)+(94*0.2)
    },
    {
      trainerId: trainer3Profile.id,
      subjectArea: "Radar Meteorology",
      skillMatch: 82.0,
      qualScore: 88.0,
      expScore: 95.0,
      perfScore: 90.0,
      overallMatch: 87.4,
    },
    {
      trainerId: trainer2Profile.id,
      subjectArea: "Radar Meteorology",
      skillMatch: 75.0,
      qualScore: 90.0,
      expScore: 85.0,
      perfScore: 88.0,
      overallMatch: 82.6,
    },
    // Numerical Weather Prediction
    {
      trainerId: trainer2Profile.id,
      subjectArea: "Numerical Weather Prediction",
      skillMatch: 98.0,
      qualScore: 96.0,
      expScore: 92.0,
      perfScore: 94.0,
      overallMatch: 95.6,
    },
    {
      trainerId: trainer1Profile.id,
      subjectArea: "Numerical Weather Prediction",
      skillMatch: 80.0,
      qualScore: 90.0,
      expScore: 90.0,
      perfScore: 92.0,
      overallMatch: 86.4,
    },
  ];

  for (const tm of trainerMatches) {
    await prisma.trainerCompetency.create({ data: tm });
  }

  // 10. Transparent At-Risk Records
  await prisma.riskAssessment.create({
    data: {
      userId: trainee3User.id,
      riskLevel: "HIGH",
      averageScore: 40.0,
      completionRate: 30.0,
      missedAssessments: 2,
      inactiveDays: 16,
      primaryReason: "Average score 40.0% (<50% threshold), 2 missed deadlines, inactive for 16 consecutive days.",
      recommendedAction: "Assign 1-on-1 mentor intervention with Dr. Rajesh Sharma; re-schedule radar fundamentals remediation.",
    },
  });

  await prisma.riskAssessment.create({
    data: {
      userId: trainee4User.id,
      riskLevel: "MEDIUM",
      averageScore: 56.0,
      completionRate: 55.0,
      missedAssessments: 1,
      inactiveDays: 8,
      primaryReason: "Score 56% in intermediate band (50-65%), incomplete Doppler velocity module.",
      recommendedAction: "Send automated refresher prompt and provide access to Doppler velocity video walkthrough.",
    },
  });

  await prisma.riskAssessment.create({
    data: {
      userId: trainee2User.id,
      riskLevel: "LOW",
      averageScore: 66.7,
      completionRate: 75.0,
      missedAssessments: 0,
      inactiveDays: 2,
      primaryReason: "Healthy participation, consistent weekly progress, score above 65% passing grade.",
      recommendedAction: "Maintain standard self-paced learning schedule.",
    },
  });

  // 11. Official Certificate for Ananya
  await prisma.certificate.create({
    data: {
      certificateCode: "CC-NIAMS-2026-SAT-0842",
      traineeId: trainee1Profile.id,
      courseId: satCourse.id,
      issuedOn: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      grade: "Distinction (100% Score)",
      verificationUrl: "/verify/CC-NIAMS-2026-SAT-0842",
    },
  });

  // 12. Feedback
  await prisma.feedback.create({
    data: {
      courseId: satCourse.id,
      userId: trainee1User.id,
      courseRating: 5,
      contentRating: 5,
      trainerRating: 5,
      comments: "Exceptional deep dive on the Dvorak cyclone technique. The RGB composite case studies from the Arabian Sea were directly applicable to operational shifts.",
    },
  });

  // 13. Institutional Announcements
  const announcements = [
    {
      title: "Monsoon 2026 Operational Readiness & Pre-Season Capacity Workshop",
      summary: "All regional forecasters are required to complete the updated Synoptic & Doppler Radar nowcasting modules before May 15.",
      content:
        "In preparation for the Southwest Monsoon 2026 season, the Directorate has published revised standardized operating procedures (SOPs). Mandatory assessment completions will be audited in the quarterly capacity review.",
      category: "Mandatory Training",
      targetRole: "ALL",
      isUrgent: true,
    },
    {
      title: "Upgraded WRF 4.5 Non-Hydrostatic Model Training Series Released",
      summary: "Dr. Sunita Sen has published Module 2 on high-resolution convective-permitting domain setups.",
      content:
        "The Numerical Weather Prediction division has launched 4 new practical laboratory exercises focusing on 3 km resolution domain nests over complex orography in the Western Ghats and Himalayan foothills.",
      category: "Course Release",
      targetRole: "TRAINEE",
      isUrgent: false,
    },
    {
      title: "AI Question Generator v2.4 Enabled for All Certified Master Trainers",
      summary: "Trainers can now generate curriculum-aligned MCQs directly from uploaded technical PDFs using Gemini API integration.",
      content:
        "The assessment creation pipeline now supports automatic bloom taxonomy tagging, explanation generation, and instant publishing to active trainee cohorts.",
      category: "Platform Upgrade",
      targetRole: "TRAINER",
      isUrgent: false,
    },
  ];

  for (const a of announcements) {
    await prisma.announcement.create({ data: a });
  }

  // 14. Notifications for Trainee 1 (Ananya)
  await prisma.notification.create({
    data: {
      userId: trainee1User.id,
      title: "Assessment tomorrow",
      message: "Weather Forecasting assessment is due tomorrow.",
      type: "ASSESSMENT",
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  });

  await prisma.notification.create({
    data: {
      userId: trainee1User.id,
      title: "New course available",
      message: "Numerical Weather Prediction is now available for enrollment.",
      type: "COURSE",
      isRead: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  await prisma.notification.create({
    data: {
      userId: trainee1User.id,
      title: "Certificate available",
      message: "Your course certificate for Satellite Meteorology is ready.",
      type: "CERTIFICATE",
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Notifications for Trainer 1 (Dr. Rajesh Sharma)
  await prisma.notification.create({
    data: {
      userId: trainer1User.id,
      title: "New trainee enrolled",
      message: "3 candidates enrolled in Doppler Weather Radar.",
      type: "TRAINING",
      isRead: false,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
  });

  await prisma.notification.create({
    data: {
      userId: trainer1User.id,
      title: "Assessment submitted",
      message: "Ananya Verma completed Doppler Radar Final Assessment.",
      type: "ASSESSMENT",
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  });

  await prisma.notification.create({
    data: {
      userId: trainer1User.id,
      title: "Course approved",
      message: "Monsoon Dynamics curriculum has been approved by the Directorate.",
      type: "COURSE",
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Notifications for Admin (Dr. Arvind Nambiar)
  await prisma.notification.create({
    data: {
      userId: adminUser.id,
      title: "New trainer registration",
      message: "Dr. Vikram Seth registered as a trainer and is awaiting verification.",
      type: "SYSTEM",
      isRead: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  });

  await prisma.notification.create({
    data: {
      userId: adminUser.id,
      title: "Training announcement published",
      message: "National Monsoon Training Compendium circular broadcasted to all trainees.",
      type: "ANNOUNCEMENT",
      isRead: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  });

  console.log("🌟 Seeding completed successfully with institutional realism!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
