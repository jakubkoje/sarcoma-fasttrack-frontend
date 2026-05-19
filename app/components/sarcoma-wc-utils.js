export const statusLabels = {
  DRAFT: "Koncept",
  ACTIVE: "Aktivní",
  SUBMITTED: "Odesláno",
  SENT: "Odesláno",
  DONE: "Hotovo",
  ERROR: "Chyba",
};

export const wcRootTags = [
  "sarcoma-fasttrack-app",
  "sarcoma-fasttrack-login",
  "sarcoma-fasttrack-signup",
  "sarcoma-fasttrack-dashboard",
  "sarcoma-fasttrack-case-form",
  "sarcoma-fasttrack-report-list",
  "sarcoma-fasttrack-report-detail",
  "sarcoma-fasttrack-analytics",
  "sarcoma-fasttrack-articles",
  "sarcoma-fasttrack-article-detail",
  "sarcoma-fasttrack-api-tester",
];

export const articles = [
  {
    id: "0",
    title: "Nové možnosti léčby vzácných sarkomů v roce 2024",
    description: "Přehled nejnovějších terapeutických přístupů a klinických studií zaměřených na léčbu vzácných typů sarkomů.",
    date: "2024-11-15",
    category: "Léčba",
    author: "MUDr. Jana Nováková, Ph.D.",
    readTime: "8 min",
    image: "./mou-logo.jpg",
    sections: [
      ["Cílená terapie", "Inhibitory tyrozinkináz, biologická léčba a personalizované režimy mění možnosti léčby u vybraných typů sarkomů."],
      ["Imunoterapie", "Checkpoint inhibitory a kombinované režimy jsou perspektivní hlavně u vybraných histologických podtypů a v klinických studiích."],
      ["Klinické studie", "Pacienta s podezřením na vzácný sarkom je vhodné konzultovat v centru, kde lze posoudit dostupné studie."],
    ],
  },
  {
    id: "1",
    title: "Diagnostika sarkomů: Role moderního zobrazení",
    description: "Význam MRI, CT a PET/CT vyšetření v diagnostice a stagingu sarkomů.",
    date: "2024-10-28",
    category: "Diagnostika",
    author: "Prof. MUDr. Petr Dvořák, CSc.",
    readTime: "10 min",
    image: "./fn-motol.jpg",
    sections: [
      ["MRI", "Magnetická rezonance je zásadní pro lokální staging, vztah tumoru k cévám a nervům a plánování biopsie."],
      ["CT a PET/CT", "CT hrudníku pomáhá při hodnocení metastáz, PET/CT se používá pro staging a hodnocení aktivity tumoru."],
      ["Praktický postup", "Před excizí suspektního tumoru má být doplněno zobrazování a kontaktováno specializované centrum."],
    ],
  },
  {
    id: "2",
    title: "Multidisciplinární přístup v léčbě sarkomů",
    description: "Spolupráce onkologů, chirurgů, radiologů a patologů v péči o pacienty se sarkomy.",
    date: "2024-10-10",
    category: "Péče",
    author: "MUDr. Marie Svobodová",
    readTime: "12 min",
    image: "./sarkom-logo.png",
    sections: [
      ["Tým", "Optimální rozhodování vyžaduje chirurgickou, onkologickou, radiologickou a patologickou expertizu."],
      ["Konzilium", "Na MDT konziliu se řeší diagnóza, staging, plán léčby i kontrola odpovědi na terapii."],
      ["Referování", "Primární lékař má pacienta odeslat do centra před neplánovaným zákrokem na suspektním tumoru."],
    ],
  },
  {
    id: "3",
    title: "Raritní případy: Angiosarkom a jeho variabilita",
    description: "Diagnostické nástrahy, projevy a terapeutické možnosti u angiosarkomu.",
    date: "2024-09-22",
    category: "Kazuistika",
    author: "MUDr. Tomáš Procházka, Ph.D.",
    readTime: "7 min",
    image: "./hop-logo.png",
    sections: [
      ["Klinika", "Angiosarkom může napodobovat benigní kožní nebo měkkotkáňové léze a vyžaduje vysokou míru podezření."],
      ["Diagnostika", "Biopsie, imunohistochemie a správný odběr vzorku jsou rozhodující pro rychlé potvrzení diagnózy."],
    ],
  },
  {
    id: "4",
    title: "Genetické vyšetření u sarkomů: Co nám říká?",
    description: "Molekulárně genetická diagnostika a její význam pro volbu terapie.",
    date: "2024-09-05",
    category: "Genetika",
    author: "RNDr. Eva Malá, Ph.D.",
    readTime: "9 min",
    image: "./obcan-id.png",
    sections: [
      ["Translokace", "Některé sarkomy jsou definované typickými translokacemi, které pomáhají potvrdit diagnózu."],
      ["Terapie", "Molekulární nález může otevřít možnost cílené léčby nebo zařazení do studie."],
    ],
  },
  {
    id: "5",
    title: "Pediatrické sarkomy: Specifika v diagnostice a léčbě",
    description: "Nejčastější typy, prognostické faktory a sledování po léčbě u dětských pacientů.",
    date: "2024-08-18",
    category: "Pediatrie",
    author: "MUDr. Kateřina Horáková",
    readTime: "11 min",
    image: "./fn-brno.jpg",
    sections: [
      ["Diagnostika", "U dětí je nutné zohlednit věk, růst, dlouhodobé následky léčby a spolupráci pediatrického centra."],
      ["Follow-up", "Kontroly po léčbě sledují recidivu, růstové změny a pozdní toxicitu terapie."],
    ],
  },
  {
    id: "6",
    title: "Imunoterapie u sarkomů: Realita a perspektivy",
    description: "Současný stav poznatků o využití imunoterapie v léčbě sarkomů.",
    date: "2024-08-01",
    category: "Imunoterapie",
    author: "Prof. MUDr. Martin Kolář, Ph.D.",
    readTime: "8 min",
    image: "./mou-logo.jpg",
    sections: [
      ["Výběr pacientů", "Efekt imunoterapie se liší podle histologického typu a biologických vlastností nádoru."],
      ["Kombinace", "Probíhají studie kombinující imunoterapii s chemoterapií, radioterapií nebo cílenou léčbou."],
    ],
  },
  {
    id: "7",
    title: "Následná péče po léčbě sarkomu",
    description: "Doporučené schéma kontrol a včasné rozpoznání recidivy po ukončení léčby.",
    date: "2024-07-15",
    category: "Follow-up",
    author: "MUDr. Lucie Čermáková",
    readTime: "6 min",
    image: "./sarkom-logo.png",
    sections: [
      ["Kontroly", "Interval kontrol závisí na typu nádoru, stadiu, riziku recidivy a typu provedené léčby."],
      ["Komunikace", "Pacient potřebuje jasný plán, kam se obrátit při nových potížích nebo změně lokálního nálezu."],
    ],
  },
  {
    id: "8",
    title: "GIST: Gastrointestinální stromální tumory",
    description: "Aktuální informace o diagnostice a léčbě GIST včetně role cílené terapie.",
    date: "2024-06-28",
    category: "GIST",
    author: "MUDr. Robert Novotný, Ph.D.",
    readTime: "9 min",
    image: "./fn-motol.jpg",
    sections: [
      ["Diagnostika", "GIST vyžaduje histologické potvrzení a molekulární vyšetření mutací KIT nebo PDGFRA."],
      ["Léčba", "Imatinib a další inhibitory tyrozinkináz jsou zásadní u pokročilého nebo rizikového onemocnění."],
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
  if (clean === "analytics") return { view: "analytics" };
  if (clean === "clanky" || clean === "articles") return { view: "articles" };
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
  if (view === "analytics") return "analytics";
  if (view === "articles") return "clanky";
  if (view === "article") return `clanky/${detailId || "0"}`;
  if (view === "api-tester") return "api-tester";
  return "dashboard";
}
