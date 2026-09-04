import { AIService } from "./ai-service";
import { GeneratedMCQ, DifficultyLevel } from "@/types";

export class MockProvider implements AIService {
  async generateMCQs(params: {
    subject: string;
    courseTitle: string;
    topic: string;
    count: number;
    difficulty: DifficultyLevel;
    contentExcerpt?: string;
  }): Promise<GeneratedMCQ[]> {
    const { subject, topic, count, difficulty } = params;

    const repository: Record<string, GeneratedMCQ[]> = {
      "Radar Meteorology": [
        {
          questionText: "In dual-polarization radar operations, what physical characteristic of hydrometeors does the Differential Reflectivity (Z_DR) parameter directly measure?",
          options: [
            "The median oblateness (aspect ratio) of raindrops as they fall through the air",
            "The total dielectric constant of ice particles regardless of shape",
            "The radial velocity velocity component towards the radar transmitter",
            "The atmospheric turbulence intensity within the cloud boundary",
          ],
          correctOption: 0,
          explanation: "Z_DR represents the logarithmic ratio of horizontal to vertical reflectivity (Z_H / Z_V). Because larger raindrops flatten into oblate spheroids due to aerodynamic drag, horizontal scattering exceeds vertical scattering, resulting in positive Z_DR (in dB).",
          topic: "Dual-Polarization Hydrometeor Classification",
          difficulty: "ADVANCED",
          approved: true,
        },
        {
          questionText: "When examining a Doppler Radial Velocity display, what pattern indicates a cyclonic circulation (mesocyclone) in the Northern Hemisphere?",
          options: [
            "An inbound (green/blue) velocity core adjacent to an outbound (red/yellow) core oriented azimuthally",
            "A uniform ring of maximum outbound velocity encircling the radar station",
            "A sharp line of zero velocity perpendicular to the radar beam",
            "Randomly alternating speckles of maximum positive and negative velocity",
          ],
          correctOption: 0,
          explanation: "An azimuthal velocity shear where inbound velocity is located to the left and outbound velocity to the right (relative to the radar line of sight) defines cyclonic rotation in the Northern Hemisphere.",
          topic: "Doppler Velocity Interpretation",
          difficulty: "INTERMEDIATE",
          approved: true,
        },
        {
          questionText: "What radar artifact is created when an anomalous propagation (AP) duct bends the radar beam downward into the earth's surface?",
          options: [
            "Intense false high-reflectivity echoes near the ground with near-zero radial velocity and low Rho_HV",
            "A continuous spiral band resembling a hurricane eye",
            "An artificial increase in the Nyquist velocity threshold",
            "A sudden loss of all returned power at long ranges",
          ],
          correctOption: 0,
          explanation: "AP occurs during strong nocturnal temperature inversions and moisture gradients, refracting the beam into terrain and creating stationary, clutter-like false echoes.",
          topic: "Radar Artifacts & Quality Control",
          difficulty: "INTERMEDIATE",
          approved: true,
        },
        {
          questionText: "Why is the Specific Differential Phase (K_DP) especially reliable for estimating heavy rainfall under high-attenuation conditions?",
          options: [
            "Phase shift accumulation is independent of amplitude attenuation along the ray path",
            "K_DP does not depend on raindrop size distribution at all",
            "K_DP operates exclusively in the presence of spherical ice crystals",
            "K_DP doubles the pulse repetition frequency automatically",
          ],
          correctOption: 0,
          explanation: "Because K_DP measures the differential rate of phase change rather than reflected signal amplitude, it is immune to rain attenuation and absolute radar calibration drift.",
          topic: "Quantitative Precipitation Estimation",
          difficulty: "ADVANCED",
          approved: true,
        },
      ],
      "Satellite Meteorology": [
        {
          questionText: "Why does the 6.7 µm Water Vapor channel detect atmospheric circulation patterns even in regions with no visible cloud cover?",
          options: [
            "It measures the emission of radiation from water vapor molecules in the middle-to-upper troposphere (400–200 hPa)",
            "It measures the reflected sunlight from invisible boundary layer aerosols",
            "It utilizes radar backscatter from geostationary orbital heights",
            "It penetrates through the entire troposphere down to the sea surface skin",
          ],
          correctOption: 0,
          explanation: "The 6.7 µm band is located within a strong vibrational water vapor absorption band, meaning radiance reaching the satellite originates from upper-tropospheric humidity, revealing jet streams and troughs in clear air.",
          topic: "Infrared & Water Vapor Channels",
          difficulty: "INTERMEDIATE",
          approved: true,
        },
        {
          questionText: "In the Dvorak Technique for tropical cyclone analysis, what does a 'Curved Band Pattern' with 1.0 degree of band wrapping indicate?",
          options: [
            "A Data T-number (DT) of approximately T3.5 to T4.0",
            "Initial depression stage with T1.0",
            "Category 5 Super Cyclonic Storm with T7.0",
            "An extratropical system undergoing post-frontal decay",
          ],
          correctOption: 0,
          explanation: "The extent of logarithmic spiral cloud band wrapping around the storm center directly corresponds to the Dvorak intensity. A 1.0 full spiral wrap corresponds to roughly DT = 3.5 (~55-60 knots).",
          topic: "Dvorak Technique",
          difficulty: "ADVANCED",
          approved: true,
        },
      ],
      "Numerical Weather Prediction": [
        {
          questionText: "In 3D-Var / 4D-Var data assimilation systems, what role does the Background Error Covariance Matrix (B matrix) play?",
          options: [
            "It spreads observational increments spatially and balances dynamical variables (e.g. wind and geopotential height)",
            "It calculates the physical CPU time required for matrix inversion",
            "It stores the historical radar calibration constants across regional networks",
            "It replaces the Navier-Stokes equations during grid point initialization",
          ],
          correctOption: 0,
          explanation: "The B matrix determines the spatial weighting and multivariate balance (geostrophic/hydrostatic) applied to differences between model background and real-world observations.",
          topic: "Data Assimilation Physics",
          difficulty: "ADVANCED",
          approved: true,
        },
        {
          questionText: "What condition must be satisfied to avoid numerical instability in explicit finite-difference atmospheric models according to the CFL criterion?",
          options: [
            "The Courant number C = (u * Δt) / Δx must be less than or equal to 1.0",
            "The time step Δt must always exceed 3600 seconds",
            "The grid spacing Δx must be larger than the Rossby radius of deformation",
            "The vertical resolution must equal the horizontal resolution",
          ],
          correctOption: 0,
          explanation: "The Courant-Friedrichs-Lewy condition dictates that numerical information cannot propagate faster across grid cells than the maximum physical wave/advection speed.",
          topic: "Numerical Discretization",
          difficulty: "ADVANCED",
          approved: true,
        },
      ],
    };

    const defaultQuestions: GeneratedMCQ[] = [
      {
        questionText: `In the domain of ${subject} (${topic || "Core Principles"}), what is the primary diagnostic indicator for severe convective instability?`,
        options: [
          "High Convective Available Potential Energy (CAPE > 2500 J/kg) paired with low Convective Inhibition (CIN < 25 J/kg) and strong vertical wind shear",
          "Uniform surface barometric pressure with zero temperature gradient",
          "Persistent isothermal atmospheric temperature profile from surface to 500 hPa",
          "Absence of moisture convergence along boundary layer convergence lines",
        ],
        correctOption: 0,
        explanation: `Severe thunderstorm development requires ample thermodynamic instability (high CAPE), minimal capping (low CIN), and vertical shear to sustain tilted updrafts.`,
        topic: topic || "Convective Thermodynamics",
        difficulty: difficulty,
        approved: true,
      },
      {
        questionText: `When interpreting synoptic-scale vorticity advection on a 500 hPa constant pressure chart, positive vorticity advection (PVA) ahead of an upper trough triggers:`,
        options: [
          "Quasi-geostrophic vertical ascent (upward motion) promoting cloud and precipitation development",
          "Strong large-scale downward subsidence and rapid clear-sky heating",
          "Complete cessation of horizontal boundary layer winds",
          "Instant dissipation of all frontal boundaries",
        ],
        correctOption: 0,
        explanation: "According to the Quasi-Geostrophic Omega equation, differential positive vorticity advection with height forces synoptic-scale upward vertical velocity (omega < 0).",
        topic: topic || "Synoptic Diagnostics",
        difficulty: difficulty,
        approved: true,
      },
      {
        questionText: `What is the operational standard protocol when issuing a Red Category Severe Weather Warning?`,
        options: [
          "Immediate dissemination of high-priority action alerts to State Disaster Management Authorities with recommended emergency preparedness measures",
          "Log the observation in daily archives and wait for post-season verification",
          "Send an informal notification without specific district vulnerability coordinates",
          "Delay warning issuance until all AWS stations report rain accumulation",
        ],
        correctOption: 0,
        explanation: "Red Category alerts represent severe multi-hazard threats requiring immediate administrative action and disaster relief mobilization.",
        topic: "Impact-Based Warning Systems",
        difficulty: difficulty,
        approved: true,
      },
      {
        questionText: `In numerical atmospheric simulation, why are planetary boundary layer (PBL) parameterization schemes necessary?`,
        options: [
          "Turbulent eddy transports of heat, moisture, and momentum occur at spatial scales smaller than the resolved model grid grid spacing",
          "The hydrostatic approximation cannot be calculated without surface friction",
          "Solar radiation does not reach the lower atmosphere in standard models",
          "To force horizontal winds to follow exact geostrophic balance",
        ],
        correctOption: 0,
        explanation: "Boundary layer turbulence occurs at sub-grid scales (centimeters to hundreds of meters) and must be parameterized using closure approximations (e.g. K-profile or TKE-based schemes).",
        topic: "Model Physics & Boundary Layer",
        difficulty: difficulty,
        approved: true,
      },
    ];

    const matchSet = repository[subject] || defaultQuestions;
    const combined = [...matchSet, ...defaultQuestions];
    
    // Slice requested count
    const results = combined.slice(0, Math.min(count, combined.length)).map((item, index) => ({
      ...item,
      difficulty,
      topic: topic || item.topic,
      id: `mcq-mock-${Date.now()}-${index}`,
    }));

    return results;
  }

  async answerLearningQuestion(params: {
    question: string;
    courseContext?: string;
  }): Promise<{
    answer: string;
    sources: string[];
    recommendedTopics: string[];
  }> {
    const q = params.question.toLowerCase();

    if (q.includes("radar") || q.includes("doppler") || q.includes("zdr") || q.includes("kdp")) {
      return {
        answer:
          "In Doppler Radar Meteorology, dual-polarization provides critical insights into hydrometeor microphysics. Horizontal Reflectivity (Z_H) indicates precipitation density, Differential Reflectivity (Z_DR) reveals particle aspect ratio (oblateness), Correlation Coefficient (Rho_HV) differentiates meteorological from non-meteorological clutter (such as insects or ground echoes), and Specific Differential Phase (K_DP) accurately quantifies heavy rainfall even during severe beam attenuation.",
        sources: [
          "WMO Guidelines on Doppler Weather Radar Operations (Doc-No-1082)",
          "Course: MET-RAD-401 (Module 1: Dual-Polarization Theory)",
        ],
        recommendedTopics: [
          "Velocity De-aliasing & Nyquist Velocity",
          "Microburst Wind Shear Alerts",
          "Hail Core Detection via K_DP and Z_DR",
        ],
      };
    }

    if (q.includes("satellite") || q.includes("dvorak") || q.includes("rgb") || q.includes("cyclone")) {
      return {
        answer:
          "Geostationary and Polar satellites provide high-temporal tropical weather diagnostics. The Dvorak Technique determines tropical cyclone Current Intensity (CI) by evaluating cloud pattern geometry (Curved Band, Shear, Eye pattern) and temperature gradients between the warm eye and surrounding cold overcast ring. Multi-spectral RGB composites (e.g. Night Microphysics, Convective Storm RGB) allow immediate differentiation between low-level fog and high-altitude cirrus anvils.",
        sources: [
          "ISRO/EUMETSAT Tropical Satellite Interpretation Handbook",
          "Course: MET-SAT-302 (Module 3: Tropical Cyclone Intensity)",
        ],
        recommendedTopics: [
          "Water Vapor Channel (6.7 µm) Upper Tropospheric Jet Tracking",
          "Fog & Stratus Night Microphysics Recipe",
        ],
      };
    }

    if (q.includes("nwp") || q.includes("model") || q.includes("wrf") || q.includes("assimilation")) {
      return {
        answer:
          "Numerical Weather Prediction integrates the primitive atmospheric equations (momentum, thermodynamics, continuity, moisture) on discretized 3D grids. Data assimilation techniques like 3D-Var, 4D-Var, and EnKF combine real-time satellite radiances, radar velocities, and radiosondes with prior model states to produce balanced initial conditions. Physical parameterizations account for sub-grid processes like cumulus convection, microphysics, and boundary layer turbulence.",
        sources: [
          "NCNWP Technical Report: Modern Data Assimilation Pipelines",
          "Course: MET-NWP-501 (Module 2: Physical Parameterization)",
        ],
        recommendedTopics: [
          "Ensemble Prediction Systems (EPS) & Probabilistic Ensembles",
          "Courant-Friedrichs-Lewy (CFL) Stability Criterion",
        ],
      };
    }

    return {
      answer: `Based on the institutional curriculum of ${params.courseContext || "Atmospheric Sciences & Operational Meteorology"}, key competencies require understanding foundational thermodynamics (hydrostatic balance, CAPE/CIN on Skew-T diagrams), observational remote sensing (Doppler Radar & Satellite), and computational modeling. Would you like a structured breakdown of a specific operational SOP or concept?`,
      sources: [
        "National Capacity Building Core Curriculum Guidelines (2026)",
        "WMO Compendium of Training Modules in Meteorology",
      ],
      recommendedTopics: [
        "Doppler Weather Radar Diagnostics",
        "Synoptic Monsoon Depression Tracking",
        "Impact-Based Weather Warning Protocols",
      ],
    };
  }

  async generateCompetencyInsights(params: {
    traineeName: string;
    competencies: { subjectArea: string; currentScore: number; targetScore: number }[];
  }): Promise<{
    summary: string;
    strengths: string[];
    priorityGaps: string[];
    actionPlan: string[];
  }> {
    const gaps = params.competencies
      .map((c) => ({ ...c, gap: c.targetScore - c.currentScore }))
      .sort((a, b) => b.gap - a.gap);

    const largestGap = gaps[0];
    const topCompetency = [...params.competencies].sort((a, b) => b.currentScore - a.currentScore)[0];

    return {
      summary: `${params.traineeName} displays strong operational proficiency in ${topCompetency?.subjectArea || "Satellite Meteorology"} with ${topCompetency?.currentScore || 85}% mastery. The primary competency priority is ${largestGap?.subjectArea || "Radar Meteorology"}, where a ${Math.round(largestGap?.gap || 20)}% competency gap remains to achieve operational certification standards.`,
      strengths: [
        `High precision in ${topCompetency?.subjectArea || "Satellite Interpretation"} assessments (>80% score).`,
        "Consistent module progress in core theoretical coursework.",
        "Timely submission of operational diagnostic exercises.",
      ],
      priorityGaps: [
        `Remediation needed in ${largestGap?.subjectArea || "Radar Meteorology"} (Current: ${largestGap?.currentScore || 50}%, Target: ${largestGap?.targetScore || 85}%).`,
        "Advanced practical exercises in dual-polarization hydrometeor classification.",
      ],
      actionPlan: [
        `Enroll in MET-RAD-401 Module 2: Doppler Velocity Analysis & Artifact Filtering.`,
        `Complete the interactive severe weather nowcasting simulation quiz.`,
        `Schedule a 30-minute mentoring session with Dr. Rajesh Sharma before the mid-term audit.`,
      ],
    };
  }
}
