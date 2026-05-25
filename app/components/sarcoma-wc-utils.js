export const statusLabels = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  SUBMITTED: "Submitted",
  SENT: "Sent",
  DONE: "Done",
  ERROR: "Error",
};

export const wcRootTags = [
  "sarcoma-fasttrack-app",
  "sarcoma-fasttrack-login",
  "sarcoma-fasttrack-signup",
  "sarcoma-fasttrack-dashboard",
  "sarcoma-fasttrack-case-form",
  "sarcoma-fasttrack-report-list",
  "sarcoma-fasttrack-report-detail",
  "sarcoma-fasttrack-articles",
  "sarcoma-fasttrack-article-detail",
  "sarcoma-fasttrack-centers",
  "sarcoma-fasttrack-api-tester",
];

export const articles = [
  {
    id: "0",
    title: "New treatment options for rare sarcomas in 2024",
    description: "Overview of the latest therapeutic approaches and clinical trials targeting the treatment of rare types of sarcomas.",
    date: "2024-11-15",
    category: "Treatment",
    author: "MUDr. Jana Nováková, Ph.D.",
    readTime: "8 min",
    image: "./mou-logo.jpg",
    sections: [
      ["Targeted therapy", "Tyrosine kinase inhibitors, biological therapy and personalized regimens are changing the treatment options for selected sarcoma types."],
      ["Immunotherapy", "Checkpoint inhibitors and combination regimens are promising mainly in selected histological subtypes and clinical trials."],
      ["Clinical trials", "A patient with suspected rare sarcoma should be consulted at a center where available trials can be evaluated."],
    ],
  },
  {
    id: "1",
    title: "Sarcoma diagnostics: The role of modern imaging",
    description: "The importance of MRI, CT and PET/CT scans in the diagnosis and staging of sarcomas.",
    date: "2024-10-28",
    category: "Diagnostics",
    author: "Prof. MUDr. Peter Dvorák, CSc.",
    readTime: "10 min",
    image: "./fn-motol.jpg",
    sections: [
      ["MRI", "Magnetic resonance imaging is essential for local staging, tumor relationship to vessels and nerves, and biopsy planning."],
      ["CT and PET/CT", "Chest CT helps assess metastases; PET/CT is used for staging and assessment of tumor activity."],
      ["Practical approach", "Before excision of a suspicious tumor, imaging should be completed and a specialized center contacted."],
    ],
  },
  {
    id: "2",
    title: "Multidisciplinary approach in sarcoma treatment",
    description: "Collaboration of oncologists, surgeons, radiologists and pathologists in the care of sarcoma patients.",
    date: "2024-10-10",
    category: "Care",
    author: "MUDr. Mária Slobodová",
    readTime: "12 min",
    image: "./sarkom-logo.png",
    sections: [
      ["Team", "Optimal decision making requires surgical, oncological, radiological and pathological expertise."],
      ["Tumor board", "At the MDT board, diagnosis, staging, treatment plan, and response monitoring are discussed."],
      ["Referral", "The primary care physician should refer the patient to a center before any unplanned procedure on a suspicious tumor."],
    ],
  },
  {
    id: "3",
    title: "Rare cases: Angiosarcoma and its variability",
    description: "Diagnostic pitfalls, manifestations and therapeutic options for angiosarcoma.",
    date: "2024-09-22",
    category: "Case study",
    author: "MUDr. Tomáš Prochádzka, Ph.D.",
    readTime: "7 min",
    image: "./hop-logo.png",
    sections: [
      ["Clinical picture", "Angiosarcoma may mimic benign skin or soft tissue lesions and requires a high index of suspicion."],
      ["Diagnostics", "Biopsy, immunohistochemistry and proper sampling are crucial for rapid confirmation of the diagnosis."],
    ],
  },
  {
    id: "4",
    title: "Genetic testing in sarcomas: What does it tell us?",
    description: "Molecular genetic diagnostics and its importance for therapy selection.",
    date: "2024-09-05",
    category: "Genetics",
    author: "RNDr. Eva Malá, Ph.D.",
    readTime: "9 min",
    image: "./obcan-id.png",
    sections: [
      ["Translocations", "Some sarcomas are defined by typical translocations that help confirm the diagnosis."],
      ["Therapy", "Molecular findings may open up options for targeted treatment or enrollment in a clinical trial."],
    ],
  },
  {
    id: "5",
    title: "Pediatric sarcomas: Specifics in diagnostics and treatment",
    description: "Most common types, prognostic factors and follow-up after treatment in pediatric patients.",
    date: "2024-08-18",
    category: "Pediatrics",
    author: "MUDr. Katarína Horáková",
    readTime: "11 min",
    image: "./fn-brno.jpg",
    sections: [
      ["Diagnostics", "In children, age, growth, long-term treatment effects and cooperation with a pediatric center must be taken into account."],
      ["Follow-up", "Post-treatment follow-up monitors recurrence, growth changes and late toxicity of therapy."],
    ],
  },
  {
    id: "6",
    title: "Immunotherapy in sarcomas: Reality and outlook",
    description: "Current state of knowledge on the use of immunotherapy in sarcoma treatment.",
    date: "2024-08-01",
    category: "Immunotherapy",
    author: "Prof. MUDr. Martin Kolár, Ph.D.",
    readTime: "8 min",
    image: "./mou-logo.jpg",
    sections: [
      ["Patient selection", "The effect of immunotherapy varies by histological type and biological properties of the tumor."],
      ["Combinations", "Trials are underway combining immunotherapy with chemotherapy, radiotherapy or targeted treatment."],
    ],
  },
  {
    id: "7",
    title: "Follow-up care after sarcoma treatment",
    description: "Recommended follow-up schedule and early detection of recurrence after treatment completion.",
    date: "2024-07-15",
    category: "Follow-up",
    author: "MUDr. Lucia Čermáková",
    readTime: "6 min",
    image: "./sarkom-logo.png",
    sections: [
      ["Follow-up visits", "The interval of follow-up visits depends on tumor type, stage, recurrence risk and type of treatment performed."],
      ["Communication", "The patient needs a clear plan of whom to contact in case of new problems or changes in the local finding."],
    ],
  },
  {
    id: "8",
    title: "GIST: Gastrointestinal stromal tumors",
    description: "Up-to-date information on the diagnosis and treatment of GIST, including the role of targeted therapy.",
    date: "2024-06-28",
    category: "GIST",
    author: "MUDr. Robert Novotný, Ph.D.",
    readTime: "9 min",
    image: "./fn-motol.jpg",
    sections: [
      ["Diagnostics", "GIST requires histological confirmation and molecular testing for KIT or PDGFRA mutations."],
      ["Treatment", "Imatinib and other tyrosine kinase inhibitors are essential in advanced or high-risk disease."],
    ],
  },
];

export function normalizeApiBase(value) {
  const base = value || "http://localhost:8000";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

export function patientDisplayName(patient) {
  if (!patient) return "";
  const first = patient.first_name || patient.given_name || "";
  const last = patient.last_name || patient.family_name || "";
  return [first, last].filter(Boolean).join(" ").trim() || `#${patient.id}`;
}

export function pathToView(pathname, basePath = "") {
  const base = basePath || "";
  const relative = base && pathname.startsWith(base)
    ? pathname.slice(base.length)
    : pathname.replace(/^\//, "");
  const clean = relative.replace(/^\/+|\/+$/g, "");
  if (!clean || clean === "dashboard") return { view: "dashboard" };
  if (clean === "login") return { view: "login" };
  if (clean === "signup") return { view: "signup" };
  if (clean === "new" || clean === "sarcoma-form") return { view: "new" };
  if (clean === "reports") return { view: "reports" };
  if (clean === "clanky" || clean === "articles") return { view: "articles" };
  if (clean === "centers" || clean === "admin/organizations") return { view: "centers" };
  if (clean === "api-tester") return { view: "api-tester" };
  const match = clean.match(/^reports\/(\d+)$/);
  if (match) return { view: "detail", reportId: Number(match[1]) };
  const articleMatch = clean.match(/^(?:clanky|articles)\/([^/]+)$/);
  if (articleMatch) return { view: "article", articleId: articleMatch[1] };
  return { view: "dashboard" };
}

export function viewToPath(view, detailId) {
  if (view === "dashboard") return "dashboard";
  if (view === "login") return "login";
  if (view === "signup") return "signup";
  if (view === "new") return "sarcoma-form";
  if (view === "reports") return "reports";
  if (view === "detail") return `reports/${detailId || ""}`.replace(/\/$/, "");
  if (view === "articles") return "clanky";
  if (view === "article") return `clanky/${detailId || "0"}`;
  if (view === "centers") return "admin/organizations";
  if (view === "api-tester") return "api-tester";
  return "dashboard";
}
