<template>
  <UApp :portal="false">
    <div class="light sft-shell">
      <header v-if="token && !isAuthView" class="sft-topbar">
        <div class="sft-topbar-inner">
          <button class="sft-brand" type="button" @click="go('dashboard')">
            <img :src="assetUrl('sarkom-logo.png')" alt="Sarkom FastTrack Logo" />
            <span>Sarkom FastTrack</span>
          </button>
          <nav class="sft-nav" aria-label="Main navigation">
            <button type="button" :class="{ active: visibleView === 'dashboard' }" @click="go('dashboard')">Dashboard</button>
            <button v-if="isDoctor" type="button" :class="{ active: visibleView === 'new' }" @click="go('new')">New record</button>
            <button type="button" :class="{ active: visibleView === 'reports' || visibleView === 'detail' }" @click="go('reports')">Reports overview</button>
            <button type="button" :class="{ active: visibleView === 'articles' || visibleView === 'article' }" @click="go('articles')">Educational materials</button>
          </nav>
          <div class="sft-header-actions">
            <button class="sft-icon-button" type="button" aria-label="Notifications">
              <span class="sft-bell" aria-hidden="true">2</span>
            </button>
            <button class="sft-logout" type="button" @click="logout">Log out</button>
          </div>
        </div>
      </header>

      <main class="sft-main" :class="{ 'sft-main-auth': isAuthView }">
        <div v-if="message" class="sft-message" :class="message.kind">{{ message.text }}</div>

      <section v-if="visibleView === 'login'" class="sft-auth-screen">
        <form class="sft-auth-card" @submit.prevent="login">
          <div class="sft-auth-head">
            <span class="sft-auth-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0" />
              </svg>
            </span>
            <h2>Login</h2>
            <p>Enter your credentials.</p>
          </div>
          <label class="sft-field">
            <span>Test account</span>
            <select v-model="selectedAccountId" class="sft-input" @change="applySelectedAccount">
              <option v-for="account in testAccounts" :key="account.id" :value="account.id">{{ account.label }}</option>
            </select>
          </label>
          <label class="sft-field">
            <span>Email</span>
            <input v-model="loginForm.email" class="sft-input" autocomplete="username" type="email" placeholder="Enter your email" required />
          </label>
          <label class="sft-field">
            <span>Password</span>
            <input v-model="loginForm.password" class="sft-input" autocomplete="current-password" type="password" placeholder="Enter your password" required />
          </label>
          <label class="sft-check-inline">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <button class="sft-auth-submit" type="submit" :disabled="loading">Log in</button>
          <p class="sft-auth-note">The application is intended for healthcare professionals.</p>
        </form>
      </section>

      <section v-else-if="visibleView === 'signup'" class="sft-auth-screen">
        <form class="sft-auth-card sft-auth-card-scroll" @submit.prevent="signup">
          <div class="sft-auth-head">
            <span class="sft-auth-icon solid" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <h2>Create account</h2>
            <p>Start using Sarkom FastTrack</p>
          </div>
          <label class="sft-field">
            <span>Email <b>*</b></span>
            <input v-model="signupForm.email" class="sft-input" type="email" autocomplete="username" placeholder="your-email@example.com" required />
          </label>
          <label class="sft-field">
            <span>Role <b>*</b></span>
            <select v-model="signupForm.role" class="sft-input">
              <option value="doctor">Doctor</option>
              <option value="specialist">Specialist</option>
              <option value="coordinator">Coordinator</option>
            </select>
          </label>
          <label class="sft-field">
            <span>Organization ID for doctor</span>
            <input v-model="signupForm.organization_id" class="sft-input" inputmode="numeric" placeholder="14" />
          </label>
          <label class="sft-field">
            <span>Password <b>*</b></span>
            <input v-model="signupForm.password" class="sft-input" type="password" autocomplete="new-password" placeholder="At least 8 characters" required />
          </label>
          <label class="sft-field">
            <span>Confirm password <b>*</b></span>
            <input v-model="signupForm.confirm_password" class="sft-input" type="password" autocomplete="new-password" placeholder="Re-enter password" required />
          </label>
          <button class="sft-auth-submit" type="submit" :disabled="loading">Sign up</button>
          <p class="sft-auth-link">Already have an account? <button type="button" @click="go('login')">Log in</button></p>
          <p class="sft-auth-note">By signing up you agree to our terms of use and privacy policy</p>
        </form>
      </section>

      <section v-else-if="visibleView === 'dashboard'" class="sft-page sft-dashboard">
        <div class="sft-page-head">
          <h1>Dashboard</h1>
          <p>Quick overview of all sarcoma cases</p>
        </div>

        <button v-if="isDoctor" class="sft-new-case-card" type="button" @click="go('new')">
          <span class="sft-new-case-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </span>
          <span>
            <strong>New case</strong>
            <small>Refer a patient with suspected sarcoma to a specialized center</small>
          </span>
        </button>

        <div class="sft-stat-grid nuxt">
          <button class="sft-stat nuxt highlight" type="button" @click="go('reports')">
            <span class="sft-stat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span class="sft-click-badge">Click here</span>
            <small>Pending cases</small>
            <strong>{{ dashboardStats.pending }}</strong>
            <em>Require assessment</em>
          </button>
          <button class="sft-stat nuxt" type="button" @click="go('reports')">
            <span class="sft-stat-icon muted" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <small>Total cases</small>
            <strong>{{ dashboardStats.total }}</strong>
          </button>
          <button class="sft-stat nuxt" type="button" @click="go('reports')">
            <span class="sft-stat-icon muted" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <small>Processed</small>
            <strong>{{ dashboardStats.completed }}</strong>
          </button>
        </div>

        <article v-if="isDoctor" class="sft-panel sft-dashboard-articles">
          <div class="sft-section-head">
            <div>
              <h2>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13c-1.168-.776-2.754-1.253-4.5-1.253-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Expert articles on sarcomas
              </h2>
              <p>Current findings in diagnostics and treatment</p>
            </div>
            <button class="sft-outline-action" type="button" @click="go('articles')">All articles</button>
          </div>
          <div v-if="featuredArticles.length > 0" class="sft-article-grid dashboard">
            <button v-for="article in featuredArticles" :key="article.id" class="sft-feature-article" type="button" @click="openArticle(article.id)">
              <img v-if="article.image" :src="article.image" :alt="article.title" loading="lazy" />
              <span v-if="article.category" class="sft-status">{{ article.category }}</span>
              <strong>{{ article.title }}</strong>
              <small>{{ article.summary }}</small>
              <em>{{ formatDateOnly(article.date) }}</em>
            </button>
          </div>
          <p v-else class="sft-muted">No published articles yet.</p>
        </article>
      </section>

      <section v-else-if="visibleView === 'new'" class="sft-panel">
        <form class="sft-form" @submit.prevent="createCase">
          <div>
            <p class="sft-kicker">Form</p>
            <h2>Patient with suspected sarcoma</h2>
            <p class="sft-muted">Compact web component version of the original multi-step form.</p>
          </div>

          <fieldset class="sft-fieldset">
            <legend>Care center and patient type</legend>
            <div class="sft-grid">
              <label class="sft-field">
                <span>Care center</span>
                <select v-model="caseForm.care_center" class="sft-input">
                  <option value="14">Masaryk Memorial Cancer Institute</option>
                  <option value="15">Motol University Hospital</option>
                </select>
              </label>
              <label class="sft-field">
                <span>Patient type</span>
                <select v-model="caseForm.patient_type" class="sft-input">
                  <option value="new">New patient</option>
                  <option value="existing">Existing patient</option>
                </select>
              </label>
              <label class="sft-field">
                <span>ICD-10</span>
                <select v-model="caseForm.mkn10_code" class="sft-input">
                  <option value="">Not specified</option>
                  <option value="C49.0">C49.0 - head, face and neck</option>
                  <option value="C49.1">C49.1 - upper limb</option>
                  <option value="C49.2">C49.2 - lower limb</option>
                  <option value="C49.3">C49.3 - thorax</option>
                  <option value="C49.4">C49.4 - abdomen</option>
                </select>
              </label>
              <label class="sft-field">
                <span>Status</span>
                <select v-model="caseForm.status" class="sft-input">
                  <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset class="sft-fieldset">
            <legend>Patient contact</legend>
            <div class="sft-grid">
              <label class="sft-field">
                <span>First name</span>
                <input v-model="caseForm.first_name" class="sft-input" required />
              </label>
              <label class="sft-field">
                <span>Last name</span>
                <input v-model="caseForm.last_name" class="sft-input" required />
              </label>
              <label class="sft-field">
                <span>Personal ID number</span>
                <input v-model="caseForm.birth_number" class="sft-input" required />
              </label>
              <label class="sft-field">
                <span>Insurance company</span>
                <select v-model="caseForm.insurance" class="sft-input">
                  <option value="">Not specified</option>
                  <option value="111">VZP</option>
                  <option value="201">VOZP</option>
                  <option value="205">ČPZP</option>
                  <option value="207">OZP</option>
                  <option value="211">ZPMV ČR</option>
                  <option value="213">RBP</option>
                </select>
              </label>
              <label class="sft-field">
                <span>Phone</span>
                <input v-model="caseForm.phone" class="sft-input" required />
              </label>
              <label class="sft-field">
                <span>Email</span>
                <input v-model="caseForm.email" class="sft-input" type="email" />
              </label>
              <label class="sft-field sft-span">
                <span>Address</span>
                <input v-model="caseForm.address" class="sft-input" required />
              </label>
            </div>
          </fieldset>

          <fieldset class="sft-fieldset">
            <legend>Imaging examination</legend>
            <div class="sft-check-grid">
              <label v-for="option in imagingOptions" :key="option.value" class="sft-check">
                <input v-model="caseForm.selected_imaging" type="checkbox" :value="option.value" />
                <span>{{ option.label }}</span>
              </label>
            </div>
            <div class="sft-grid">
              <label class="sft-field">
                <span>Main examination date</span>
                <input v-model="caseForm.imaging_date" class="sft-input" type="date" />
              </label>
              <label class="sft-field">
                <span>Further examination planned</span>
                <select v-model="caseForm.additional_imaging_planned" class="sft-input">
                  <option :value="false">No</option>
                  <option :value="true">Yes</option>
                </select>
              </label>
              <label class="sft-field sft-span">
                <span>Imaging description</span>
                <textarea v-model="caseForm.note" class="sft-input" rows="3" />
              </label>
              <label class="sft-field sft-span">
                <span>Plan for further examinations</span>
                <textarea v-model="caseForm.additional_imaging_note" class="sft-input" rows="2" />
              </label>
            </div>
          </fieldset>

          <fieldset class="sft-fieldset">
            <legend>Medical history and histology</legend>
            <div class="sft-grid">
              <label class="sft-field sft-span">
                <span>Medical history</span>
                <textarea v-model="caseForm.anamnesis" class="sft-input" rows="4" />
              </label>
              <label class="sft-field sft-span">
                <span>Family history</span>
                <textarea v-model="caseForm.family_history" class="sft-input" rows="2" />
              </label>
              <label class="sft-field">
                <span>Anticoagulation therapy</span>
                <select v-model="caseForm.anticoagulant_medication" class="sft-input">
                  <option :value="false">No</option>
                  <option :value="true">Yes</option>
                </select>
              </label>
              <label class="sft-field">
                <span>Histological verification</span>
                <select v-model="caseForm.histology_performed" class="sft-input">
                  <option :value="false">No</option>
                  <option :value="true">Yes</option>
                </select>
              </label>
              <label class="sft-field">
                <span>Histology date</span>
                <input v-model="caseForm.histology_date" class="sft-input" type="date" />
              </label>
              <label class="sft-field">
                <span>Histology result</span>
                <input v-model="caseForm.histology_result" class="sft-input" />
              </label>
              <label class="sft-field sft-span">
                <span>Diagnostic summary and finalization</span>
                <textarea v-model="caseForm.summary" class="sft-input" rows="3" />
              </label>
            </div>
          </fieldset>

          <div class="sft-submit">
            <UButton type="submit" icon="i-lucide-save" :loading="loading">Create record</UButton>
            <UButton color="neutral" variant="outline" icon="i-lucide-list" @click="go('reports')">Cancel</UButton>
          </div>
        </form>
      </section>

      <section v-else-if="visibleView === 'detail'" class="sft-stack">
        <div v-if="selectedReport" class="sft-stack">
          <div class="sft-panel">
            <div class="sft-detail-head">
              <div>
                <p class="sft-kicker">Report #{{ selectedReport.id }}</p>
                <h2>{{ patientNames[selectedReport.patient_id] || `Patient #${selectedReport.patient_id}` }}</h2>
                <p class="sft-muted">FHIR: {{ selectedReport.fhir_id || "—" }}</p>
              </div>
              <div class="sft-status-row">
                <span class="sft-status">{{ statusLabels[selectedReport.status] || selectedReport.status }}</span>
                <select
                  v-if="isSpecialist"
                  class="sft-input sft-select-small"
                  :value="selectedReport.status"
                  @change="updateStatus(selectedReport.id, ($event.target as HTMLSelectElement).value)"
                >
                  <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
              </div>
            </div>
            <dl class="sft-facts">
              <div>
                <dt>Organization</dt>
                <dd>{{ organizationNames[selectedReport.target_organization_id] || `#${selectedReport.target_organization_id}` }}</dd>
              </div>
              <div>
                <dt>Doctor</dt>
                <dd>{{ userNames[selectedReport.doctor_id] || `#${selectedReport.doctor_id}` }}</dd>
              </div>
              <div>
                <dt>Severity</dt>
                <dd>{{ selectedReport.severity || "—" }}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{{ formatDate(selectedReport.created_at) }}</dd>
              </div>
            </dl>
          </div>

          <div class="sft-grid">
            <article class="sft-panel">
              <h3>Clinical information</h3>
              <p><b>Medical history:</b> {{ selectedReport.anamnesis || "—" }}</p>
              <p><b>ICD-10:</b> {{ selectedReport.mkn10_code || "—" }}</p>
              <p><b>Summary:</b> {{ selectedReport.summary || "—" }}</p>
              <p><b>Family history:</b> {{ selectedReport.family_history || "—" }}</p>
            </article>
            <article class="sft-panel">
              <h3>Histology and imaging</h3>
              <p><b>Imaging:</b> {{ selectedReport.any_imaging_performed ? "Yes" : "No" }}</p>
              <p><b>Further planned:</b> {{ selectedReport.additional_imaging_planned ? "Yes" : "No" }}</p>
              <p><b>Histology:</b> {{ selectedReport.histology_performed ? "Yes" : "No" }}</p>
              <p><b>Note:</b> {{ selectedReport.note || selectedReport.additional_imaging_note || "—" }}</p>
            </article>
            <article class="sft-panel">
              <h3>Classification</h3>
              <p><b>Specialist:</b> {{ selectedReport.specialist || "—" }}</p>
              <p><b>Confidence:</b> {{ percent(selectedReport.overall_confidence) }}</p>
              <p><b>Severity code:</b> {{ selectedReport.severity_code || "—" }}</p>
              <UButton size="sm" variant="outline" icon="i-lucide-refresh-cw" :loading="loading" @click="reclassify">Recalculate</UButton>
            </article>
            <article class="sft-panel">
              <h3>Specialist feedback</h3>
              <textarea v-model="feedbackText" class="sft-input" rows="4" :disabled="!isSpecialist" />
              <div class="sft-submit">
                <UButton v-if="isSpecialist" icon="i-lucide-send" :loading="loading" @click="saveFeedback">Save feedback</UButton>
                <UButton color="neutral" variant="outline" icon="i-lucide-arrow-left" @click="go('reports')">Back</UButton>
              </div>
            </article>
          </div>
        </div>
        <div v-else class="sft-panel">
          <h2>Report not found</h2>
          <p class="sft-muted">Select a record from the overview or set the report-id attribute.</p>
          <UButton icon="i-lucide-list" @click="go('reports')">Reports overview</UButton>
        </div>
      </section>

      <section v-else-if="visibleView === 'articles'" class="sft-page">
        <div class="sft-page-head with-action">
          <div>
            <h1>Educational materials</h1>
            <p>Articles and clinical guidance for the diagnosis and treatment of sarcomas.</p>
          </div>
          <button v-if="isEditor" class="sft-auth-submit compact" type="button">New article</button>
        </div>

        <div class="sft-article-controls">
          <input v-model="articleSearch" class="sft-input" placeholder="Search articles..." />
          <div class="sft-filter-row">
            <button
              v-for="category in articleCategories"
              :key="category"
              type="button"
              class="sft-filter-chip"
              :class="{ active: articleCategory === category }"
              @click="articleCategory = category"
            >
              {{ category === 'all' ? 'All categories' : category }}
            </button>
          </div>
          <div v-if="isEditor" class="sft-filter-row status">
            <span>Status</span>
            <button
              v-for="value in articleStatuses"
              :key="value"
              type="button"
              class="sft-filter-chip small"
              :class="{ active: articleStatusFilter === value }"
              @click="articleStatusFilter = value"
            >
              {{ value }}
            </button>
          </div>
        </div>

        <div v-if="filteredArticles.length > 0" class="sft-article-grid">
          <button v-for="article in filteredArticles" :key="article.id" class="sft-article-card" type="button" @click="openArticle(article.id)">
            <img v-if="article.image" :src="article.image" :alt="article.title" loading="lazy" />
            <div v-else class="sft-article-placeholder" />
            <div class="sft-article-body">
              <div class="sft-card-badges">
                <span v-if="article.category" class="sft-status">{{ article.category }}</span>
                <span class="sft-status subtle">{{ article.status }}</span>
              </div>
              <h3>{{ article.title }}</h3>
              <p>{{ article.summary }}</p>
              <small>{{ formatDateOnly(article.date) }}<span v-if="article.readTime"> · {{ article.readTime }} min read</span></small>
            </div>
          </button>
        </div>
        <article v-else class="sft-panel sft-empty-state">
          <h2>No articles match these filters</h2>
          <p>Try clearing the search or status filter.</p>
        </article>
      </section>

      <section v-else-if="visibleView === 'article'" class="sft-stack">
        <article class="sft-panel sft-reader">
          <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" @click="go('articles')">Back to articles</UButton>
          <img v-if="selectedArticle.image" :src="selectedArticle.image" :alt="selectedArticle.title" loading="lazy" />
          <p class="sft-kicker">{{ selectedArticle.category }}</p>
          <h2>{{ selectedArticle.title }}</h2>
          <p class="sft-lead">{{ selectedArticle.summary }}</p>
          <p class="sft-muted">{{ formatDateOnly(selectedArticle.date) }}<span v-if="selectedArticle.readTime"> · {{ selectedArticle.readTime }} min read</span><span v-if="selectedArticle.author"> · {{ selectedArticle.author }}</span></p>
          <section v-for="section in selectedArticle.sections" :key="section[0]">
            <h3>{{ section[0] }}</h3>
            <p>{{ section[1] }}</p>
          </section>
        </article>
      </section>

      <section v-else-if="visibleView === 'api-tester'" class="sft-stack">
        <div class="sft-hero">
          <div>
            <p class="sft-kicker">API Tester</p>
            <h2>Functional smoke client</h2>
            <p class="sft-muted">Quick calls to health, OpenAPI and protected endpoints against the current api-base.</p>
          </div>
          <span class="sft-status">{{ token ? "Token set" : "No token" }}</span>
        </div>
        <div class="sft-grid">
          <article class="sft-panel">
            <h3>Login</h3>
            <div class="sft-form">
              <input v-model="apiLoginForm.email" class="sft-input" placeholder="email@example.test" />
              <input v-model="apiLoginForm.password" class="sft-input" type="password" placeholder="password" />
              <UButton icon="i-lucide-log-in" :loading="apiTesterLoading" @click="apiLogin">Login & set token</UButton>
            </div>
          </article>
          <article class="sft-panel">
            <h3>Endpoints</h3>
            <div class="sft-submit">
              <UButton size="sm" variant="outline" @click="runApiProbe('health', '/health/db')">Health</UButton>
              <UButton size="sm" variant="outline" @click="runApiProbe('openapi', '/openapi')">OpenAPI</UButton>
              <UButton size="sm" variant="outline" @click="runApiProbe('reports', '/api/v1/reports')">Reports</UButton>
              <UButton size="sm" variant="outline" @click="runApiProbe('patients', '/api/v1/patients')">Patients</UButton>
              <UButton size="sm" variant="outline" @click="runApiProbe('organizations', '/api/v1/organizations')">Organizations</UButton>
              <UButton size="sm" variant="outline" @click="runApiProbe('users', '/api/v1/users')">Users</UButton>
            </div>
          </article>
        </div>
        <pre class="sft-response">{{ apiTesterResponse || "No response yet." }}</pre>
      </section>

      <section v-else class="sft-page">
        <div class="sft-page-head">
          <h1>Reports overview</h1>
          <p>List of all submitted forms with patient information</p>
        </div>

        <div class="sft-report-stats">
          <article class="sft-report-stat critical">
            <span class="sft-report-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" />
              </svg>
            </span>
            <div>
              <small>Critical (Severity 1)</small>
              <strong>{{ reports.filter((r) => r.severity === '1').length }}</strong>
            </div>
          </article>
          <article class="sft-report-stat">
            <span class="sft-report-icon yellow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <small>Pending</small>
              <strong>{{ dashboardStats.pending }}</strong>
            </div>
          </article>
          <article class="sft-report-stat">
            <span class="sft-report-icon green" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <small>Sent</small>
              <strong>{{ reports.filter((r) => r.status === 'SENT').length }}</strong>
            </div>
          </article>
          <article class="sft-report-stat">
            <span class="sft-report-icon gray" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <div>
              <small>Total</small>
              <strong>{{ reports.length }}</strong>
            </div>
          </article>
        </div>

        <div class="sft-toolbar">
          <input v-model="query" class="sft-input" placeholder="Search patient, organization or status" />
          <UButton icon="i-lucide-refresh-cw" color="neutral" variant="outline" :loading="loading" @click="loadReports">Refresh</UButton>
        </div>

        <div class="sft-list">
          <button v-for="report in filteredReports" :key="report.id" class="sft-row" type="button" @click="openReport(report.id)">
            <span>
              <strong>#{{ report.id }} {{ patientNames[report.patient_id] || `Patient #${report.patient_id}` }}</strong>
              <small>{{ organizationNames[report.target_organization_id] || `Organization #${report.target_organization_id}` }}</small>
            </span>
            <span class="sft-row-meta">
              <span class="sft-severity">S{{ report.severity || "—" }}</span>
              <span class="sft-status">{{ statusLabels[report.status] || report.status }}</span>
            </span>
          </button>
          <div v-if="!filteredReports.length && !loading" class="sft-empty">No records</div>
        </div>
      </section>
      </main>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import type { ArticleRead, PatientRead, ReportRead, TokenResponse, UserRead } from "../types/api";
import { articles as fallbackArticles, normalizeApiBase, pathToView, patientDisplayName, statusLabels, viewToPath } from "./sarcoma-wc-utils.js";

const props = withDefaults(defineProps<{
  apiBase?: string;
  basePath?: string;
  initialView?: string;
  reportId?: string | number;
  articleId?: string | number;
}>(), {
  apiBase: "http://localhost:8000",
  basePath: "",
  initialView: "dashboard",
  reportId: "",
  articleId: "0",
});

type Message = { kind: "ok" | "error"; text: string };
type View = "login" | "signup" | "dashboard" | "reports" | "new" | "detail" | "articles" | "article" | "api-tester";
type ApiProbeOptions = RequestInit & { raw?: boolean };
type ArticleView = {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  image: string;
  author: string;
  readTime: number | null;
  status: string;
  date: string;
  sections: [string, string][];
};

const knownViews = new Set<View>(["login", "signup", "dashboard", "reports", "new", "detail", "articles", "article", "api-tester"]);
const publicViews = new Set<View>(["login", "signup"]);
const storageKey = "sarcoma-fasttrack-wc";

const token = ref("");
const role = ref("");
const view = ref<View>(sanitizeView(props.initialView));
const selectedReportId = ref<number | null>(numberOrNull(props.reportId) || (view.value === "detail" ? 1 : null));
const selectedArticleId = ref(String(props.articleId || "0"));
const loading = ref(false);
const message = ref<Message | null>(null);
const reports = ref<ReportRead[]>([]);
const users = ref<UserRead[]>([]);
const apiArticles = ref<ArticleRead[]>([]);
const patientNames = ref<Record<number, string>>({});
const organizationNames = ref<Record<number, string>>({});
const query = ref("");
const feedbackText = ref("");
const articleSearch = ref("");
const articleCategory = ref("all");
const articleStatusFilter = ref<"ALL" | "PUBLISHED" | "DRAFT" | "ARCHIVED">("PUBLISHED");
const apiTesterLoading = ref(false);
const apiTesterResponse = ref("");

const testAccounts = [
  { id: "admin", label: "Admin", email: "admin@admin.com", password: "admin" },
  { id: "doctor", label: "Doctor", email: "doctor@sft.local", password: "doctor" },
  { id: "specialist", label: "Specialist", email: "specialist@sft.local", password: "specialist" },
  { id: "coordinator", label: "Coordinator", email: "coordinator@sft.local", password: "coordinator" },
];
const selectedAccountId = ref(testAccounts[0].id);
const assetUrls: Record<string, string> = {
  "fn-brno.jpg": new URL("../../public/fn-brno.jpg", import.meta.url).href,
  "fn-motol.jpg": new URL("../../public/fn-motol.jpg", import.meta.url).href,
  "hop-logo.png": new URL("../../public/hop-logo.png", import.meta.url).href,
  "mou-logo.jpg": new URL("../../public/mou-logo.jpg", import.meta.url).href,
  "obcan-id.png": new URL("../../public/obcan-id.png", import.meta.url).href,
  "sarkom-logo.png": new URL("../../public/sarkom-logo.png", import.meta.url).href,
};

const loginForm = reactive({
  email: "admin@admin.com",
  password: "admin",
});

const signupForm = reactive({
  email: "",
  role: "doctor",
  organization_id: "14",
  password: "",
  confirm_password: "",
});

const apiLoginForm = reactive({
  email: "admin@admin.com",
  password: "admin",
});

const caseForm = reactive({
  care_center: "14",
  patient_type: "new",
  first_name: "",
  last_name: "",
  address: "",
  birth_number: "",
  phone: "",
  email: "",
  insurance: "",
  selected_imaging: [] as string[],
  imaging_date: "",
  additional_imaging_planned: false,
  additional_imaging_note: "",
  status: "DRAFT",
  mkn10_code: "",
  anamnesis: "",
  family_history: "",
  anticoagulant_medication: false,
  histology_performed: false,
  histology_date: "",
  histology_result: "",
  summary: "",
  note: "",
});

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Active", value: "ACTIVE" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Sent", value: "SENT" },
  { label: "Done", value: "DONE" },
  { label: "Error", value: "ERROR" },
];

const imagingOptions = [
  { value: "sonografie", label: "Sonography" },
  { value: "ct", label: "CT" },
  { value: "pet-ct", label: "PET/CT" },
  { value: "mri", label: "MRI" },
];

const apiRoot = computed(() => normalizeApiBase(props.apiBase));
const isDoctor = computed(() => role.value === "doctor" || role.value === "admin");
const isSpecialist = computed(() => role.value === "specialist" || role.value === "admin");
const isEditor = computed(() => role.value === "coordinator" || role.value === "admin");
const visibleView = computed<View>(() => (!token.value && !publicViews.has(view.value) ? "login" : view.value));
const isAuthView = computed(() => visibleView.value === "login" || visibleView.value === "signup");
const userNames = computed(() => Object.fromEntries(users.value.map((user) => [user.id, user.email])));
const selectedReport = computed(() => reports.value.find((report) => report.id === selectedReportId.value) || null);
const articleCards = computed<ArticleView[]>(() => {
  if (apiArticles.value.length) return apiArticles.value.map(apiArticleToView);
  return fallbackArticles.map(fallbackArticleToView);
});
const selectedArticle = computed(() => articleCards.value.find((article) => article.id === selectedArticleId.value) || articleCards.value[0]);
const featuredArticles = computed(() => articleCards.value.filter((article) => article.status === "PUBLISHED").slice(0, 3));
const articleStatuses = ["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"] as const;
const articleCategories = computed(() => ["all", ...new Set(articleCards.value.map((article) => article.category).filter(Boolean))]);
const filteredArticles = computed(() => {
  const needle = articleSearch.value.trim().toLowerCase();
  return articleCards.value.filter((article) => {
    if (articleStatusFilter.value !== "ALL" && article.status !== articleStatusFilter.value) return false;
    const categoryMatch = articleCategory.value === "all" || article.category === articleCategory.value;
    const textMatch = !needle || [article.title, article.summary, article.category, article.author].join(" ").toLowerCase().includes(needle);
    return categoryMatch && textMatch;
  });
});
const dashboardStats = computed(() => {
  const total = reports.value.length;
  return {
    total,
    pending: reports.value.filter((report) => ["ACTIVE", "SUBMITTED"].includes(report.status)).length,
    completed: reports.value.filter((report) => ["DONE", "SENT"].includes(report.status)).length,
    draft: reports.value.filter((report) => report.status === "DRAFT").length,
  };
});
const filteredReports = computed(() => {
  const needle = query.value.trim().toLowerCase();
  if (!needle) return reports.value;
  return reports.value.filter((report) => {
    const haystack = [
      report.id,
      report.status,
      report.severity,
      patientNames.value[report.patient_id],
      organizationNames.value[report.target_organization_id],
    ].join(" ").toLowerCase();
    return haystack.includes(needle);
  });
});
watch(selectedReport, (report) => {
  feedbackText.value = report?.feedback_specialist || "";
});

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token.value) {
    headers.set("Authorization", `Bearer ${token.value}`);
  }
  const response = await fetch(`${apiRoot.value}${path}`, { ...options, headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || payload.message || response.statusText);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

async function login() {
  await run(async () => {
    const response = await request<TokenResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(loginForm),
    });
    token.value = response.access_token;
    role.value = response.user_role || "";
    localStorage.setItem(storageKey, JSON.stringify({ token: token.value, role: role.value }));
    const nextView = view.value === "login" || view.value === "signup" ? "dashboard" : view.value;
    go(nextView);
    await Promise.all([loadReports(), loadArticles()]);
  });
}

async function signup() {
  await run(async () => {
    if (signupForm.password !== signupForm.confirm_password) {
      throw new Error("Passwords do not match.");
    }
    await request<UserRead>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: signupForm.email,
        password: signupForm.password,
        role: signupForm.role,
        organization_id: signupForm.role === "doctor" ? Number(signupForm.organization_id || 14) : null,
      }),
    });
    loginForm.email = signupForm.email;
    loginForm.password = signupForm.password;
    show("ok", "User created. Logging in.");
    await login();
  }, false);
}

async function apiLogin() {
  loginForm.email = apiLoginForm.email;
  loginForm.password = apiLoginForm.password;
  await login();
  apiTesterResponse.value = JSON.stringify({ status: "token set", role: role.value }, null, 2);
}

function logout() {
  token.value = "";
  role.value = "";
  reports.value = [];
  localStorage.removeItem(storageKey);
  message.value = null;
  go("login");
}

async function loadReports() {
  if (!token.value) return;
  await run(async () => {
    const [reportList, userList] = await Promise.all([
      request<ReportRead[]>("/api/v1/reports"),
      request<UserRead[]>("/api/v1/users"),
    ]);
    reports.value = reportList;
    users.value = userList;
    await loadNames(reportList);
  }, false);
}

async function loadArticles() {
  if (!token.value) return;
  await run(async () => {
    apiArticles.value = await request<ArticleRead[]>("/api/v1/articles");
  }, false);
}

async function loadNames(reportList: ReportRead[]) {
  const patientEntries = await Promise.all(
    [...new Set(reportList.map((report) => report.patient_id))].map(async (id) => {
      try {
        const response = await request<{ name: string }>(`/api/v1/patients/${id}/name`);
        return [id, response.name] as const;
      } catch {
        return [id, `#${id}`] as const;
      }
    }),
  );
  const organizationEntries = await Promise.all(
    [...new Set(reportList.map((report) => report.target_organization_id))].map(async (id) => {
      try {
        const response = await request<{ name: string }>(`/api/v1/organizations/${id}/name`);
        return [id, response.name] as const;
      } catch {
        return [id, `#${id}`] as const;
      }
    }),
  );
  patientNames.value = Object.fromEntries(patientEntries);
  organizationNames.value = Object.fromEntries(organizationEntries);
}

async function createCase() {
  await run(async () => {
    const targetOrganizationId = Number(caseForm.care_center);
    const imagingNote = [
      caseForm.selected_imaging.length ? `Examinations: ${caseForm.selected_imaging.join(", ")}` : "",
      caseForm.imaging_date ? `Date: ${caseForm.imaging_date}` : "",
      caseForm.note,
    ].filter(Boolean).join("\n");
    const patient = await request<PatientRead>("/api/v1/patients", {
      method: "POST",
      body: JSON.stringify({
        first_name: caseForm.first_name,
        last_name: caseForm.last_name,
        address: caseForm.address,
        birth_number: caseForm.birth_number,
        phone: caseForm.phone,
        email: caseForm.email || null,
        managing_organization_id: targetOrganizationId,
        insurance_company_code: caseForm.insurance || null,
      }),
    });
    const report = await request<ReportRead>("/api/v1/reports", {
      method: "POST",
      body: JSON.stringify({
        patient_id: patient.id,
        doctor_id: 19,
        target_organization_id: targetOrganizationId,
        status: caseForm.status,
        is_new_patient: caseForm.patient_type === "new",
        any_imaging_performed: caseForm.selected_imaging.length > 0,
        additional_imaging_planned: caseForm.additional_imaging_planned,
        additional_imaging_note: caseForm.additional_imaging_note || null,
        anamnesis: caseForm.anamnesis || null,
        mkn10_code: caseForm.mkn10_code || null,
        family_history: caseForm.family_history || null,
        anticoagulant_medication: caseForm.anticoagulant_medication,
        histology_performed: caseForm.histology_performed,
        histology_date: caseForm.histology_date || null,
        histology_result: caseForm.histology_result || null,
        summary: caseForm.summary || null,
        note: imagingNote || null,
      }),
    });
    patientNames.value = { ...patientNames.value, [patient.id]: patientDisplayName(patient) };
    reports.value = [report, ...reports.value].sort((a, b) => a.id - b.id);
    resetCaseForm();
    openReport(report.id);
    show("ok", "Record has been created.");
  });
}

async function updateStatus(reportId: number, status: string) {
  await run(async () => {
    const updated = await request<ReportRead>(`/api/v1/reports/${reportId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    replaceReport(updated);
  });
}

async function saveFeedback() {
  if (!selectedReport.value) return;
  await run(async () => {
    const updated = await request<ReportRead>(`/api/v1/reports/${selectedReport.value!.id}/feedback`, {
      method: "PATCH",
      body: JSON.stringify({ feedback_specialist: feedbackText.value }),
    });
    replaceReport(updated);
    show("ok", "Feedback saved.");
  });
}

async function reclassify() {
  if (!selectedReport.value) return;
  await run(async () => {
    await request<Record<string, unknown>>(`/api/v1/reports/${selectedReport.value!.id}/reclassify`, { method: "POST" });
    const updated = await request<ReportRead>(`/api/v1/reports/${selectedReport.value!.id}`);
    replaceReport(updated);
    show("ok", "Classification recalculated.");
  });
}

async function runApiProbe(label: string, path: string, options: ApiProbeOptions = {}) {
  apiTesterLoading.value = true;
  apiTesterResponse.value = "";
  try {
    const headers = new Headers(options.headers);
    if (token.value) headers.set("Authorization", `Bearer ${token.value}`);
    if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    const response = await fetch(`${apiRoot.value}${path}`, { ...options, headers });
    const text = await response.text();
    const payload = text && !options.raw ? JSON.stringify(JSON.parse(text), null, 2) : text;
    apiTesterResponse.value = `${label} -> ${response.status}\n${payload}`;
  } catch (error) {
    apiTesterResponse.value = error instanceof Error ? error.message : "Probe failed.";
  } finally {
    apiTesterLoading.value = false;
  }
}

function replaceReport(updated: ReportRead) {
  reports.value = reports.value.map((report) => report.id === updated.id ? updated : report);
}

function openReport(reportId: number) {
  selectedReportId.value = reportId;
  go("detail", reportId);
}

function openArticle(articleId: string) {
  selectedArticleId.value = articleId;
  go("article", articleId);
}

function applySelectedAccount() {
  const account = testAccounts.find((item) => item.id === selectedAccountId.value) || testAccounts[0];
  loginForm.email = account.email;
  loginForm.password = account.password;
}

function go(next: View, detailId?: number | string) {
  view.value = next;
  if (next === "detail") selectedReportId.value = numberOrNull(detailId) || selectedReportId.value || 1;
  else selectedReportId.value = null;
  if (next === "article") selectedArticleId.value = String(detailId || selectedArticleId.value || "0");
  pushHostPath(viewToPath(next, next === "detail" ? selectedReportId.value : next === "article" ? selectedArticleId.value : undefined));
}

function pushHostPath(relative: string) {
  if (!props.basePath || typeof window === "undefined") return;
  const absolute = new URL(relative, new URL(props.basePath, document.baseURI)).pathname;
  if (window.location.pathname !== absolute) {
    window.history.pushState({}, "", absolute);
  }
}

async function run(action: () => Promise<void>, clearMessage = true) {
  loading.value = true;
  if (clearMessage) message.value = null;
  try {
    await action();
  } catch (error) {
    show("error", error instanceof Error ? error.message : "Operation failed.");
  } finally {
    loading.value = false;
  }
}

function show(kind: Message["kind"], text: string) {
  message.value = { kind, text };
}

function resetCaseForm() {
  Object.assign(caseForm, {
    care_center: "14",
    patient_type: "new",
    first_name: "",
    last_name: "",
    address: "",
    birth_number: "",
    phone: "",
    email: "",
    insurance: "",
    selected_imaging: [],
    imaging_date: "",
    additional_imaging_planned: false,
    additional_imaging_note: "",
    status: "DRAFT",
    mkn10_code: "",
    anamnesis: "",
    family_history: "",
    anticoagulant_medication: false,
    histology_performed: false,
    histology_date: "",
    histology_result: "",
    summary: "",
    note: "",
  });
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateOnly(value: string) {
  return new Date(value).toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function assetUrl(fileName: string) {
  return assetUrls[fileName] || new URL(fileName, import.meta.url).href;
}

function apiArticleToView(article: ArticleRead): ArticleView {
  return {
    id: String(article.id),
    title: article.title,
    summary: article.summary,
    body: article.body,
    category: article.category || "",
    image: article.image_url || "",
    author: article.author_name || "",
    readTime: article.read_time_minutes || null,
    status: article.status,
    date: article.published_at || article.created_at,
    sections: markdownSections(article.body),
  };
}

function fallbackArticleToView(article: (typeof fallbackArticles)[number]): ArticleView {
  return {
    id: article.id,
    title: article.title,
    summary: article.description,
    body: article.sections.map((section) => `## ${section[0]}\n\n${section[1]}`).join("\n\n"),
    category: article.category,
    image: assetUrl(article.image.replace(/^\.\//, "")),
    author: article.author,
    readTime: Number.parseInt(article.readTime, 10) || null,
    status: "PUBLISHED",
    date: article.date,
    sections: article.sections as [string, string][],
  };
}

function markdownSections(body: string): [string, string][] {
  const parts = body.split(/^##\s+/m).map((part) => part.trim()).filter(Boolean);
  if (!parts.length) return [["Article", body]];
  return parts.map((part) => {
    const [heading = "Article", ...lines] = part.split(/\n+/);
    return [heading.replace(/^#+\s*/, "").trim(), lines.join("\n").trim()] as [string, string];
  });
}

function percent(value?: number | null) {
  if (typeof value !== "number") return "—";
  return `${Math.round(value * 100)} %`;
}

function syncViewFromLocation() {
  if (!props.basePath || typeof window === "undefined") return;
  const mapped = pathToView(window.location.pathname, props.basePath);
  view.value = sanitizeView(mapped.view);
  selectedReportId.value = mapped.reportId || selectedReportId.value;
  selectedArticleId.value = mapped.articleId || selectedArticleId.value;
}

function sanitizeView(value?: string): View {
  return knownViews.has(value as View) ? value as View : "dashboard";
}

function numberOrNull(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

onMounted(() => {
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      token.value = parsed.token || "";
      role.value = parsed.role || "";
    } catch {
      localStorage.removeItem(storageKey);
    }
  }
  syncViewFromLocation();
  window.addEventListener("popstate", syncViewFromLocation);
  if (view.value === "detail" && !selectedReportId.value) selectedReportId.value = 1;
  if (token.value) void Promise.all([loadReports(), loadArticles()]);
});

onUnmounted(() => {
  window.removeEventListener("popstate", syncViewFromLocation);
});
</script>

<style scoped>
.sft-shell {
  --sft-page-bg: #f8fafc;
  --sft-surface: #ffffff;
  --sft-surface-raised: #f1f5f9;
  --sft-heading: #0f172a;
  --sft-text: #334155;
  --sft-muted: #64748b;
  --sft-border: #e2e8f0;
  --sft-primary: #0f766e;
  --sft-primary-strong: #115e59;
  --sft-success: #15803d;
  --sft-success-bg: #f0fdf4;
  --sft-error: #b91c1c;
  --sft-error-bg: #fef2f2;
  --ui-primary: var(--sft-primary);
  --ui-success: var(--sft-success);
  --ui-error: var(--sft-error);
  --ui-text: var(--sft-text);
  --ui-text-muted: var(--sft-muted);
  --ui-bg: var(--sft-surface);
  --ui-bg-muted: var(--sft-page-bg);
  --ui-bg-elevated: var(--sft-surface-raised);
  --ui-border: var(--sft-border);
  --ui-success-50: var(--sft-success-bg);
  --ui-success-700: var(--sft-success);
  --ui-error-50: var(--sft-error-bg);
  --ui-error-700: var(--sft-error);
  box-sizing: border-box;
  width: 100%;
  min-height: max(720px, calc(100vh - 80px));
  color: var(--ui-text);
  background: var(--ui-bg-muted);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.sft-shell *,
.sft-shell *::before,
.sft-shell *::after {
  box-sizing: border-box;
}

.sft-topbar {
  width: min(100%, 1180px);
  margin: 0 auto;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg);
}

.sft-topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4.5rem;
  padding: 0.75rem clamp(1rem, 3vw, 2rem);
}

.sft-brand {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--sft-heading);
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 800;
  font-size: 1.05rem;
}

.sft-brand img {
  width: auto;
  height: 2.5rem;
  object-fit: contain;
}

.sft-brand span,
.sft-nav button,
.sft-logout {
  white-space: nowrap;
}

.sft-nav,
.sft-header-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.sft-nav button,
.sft-logout,
.sft-icon-button {
  border: 0;
  border-radius: 6px;
  min-height: 2.25rem;
  background: transparent;
  color: #475569;
  font: inherit;
  font-weight: 600;
  padding: 0.45rem 0.65rem;
  cursor: pointer;
}

.sft-nav button:hover,
.sft-nav button.active,
.sft-logout:hover,
.sft-icon-button:hover {
  color: var(--ui-primary);
  background: #f0fdfa;
}

.sft-icon-button {
  position: relative;
  width: 2.25rem;
  padding: 0;
}

.sft-icon-button::before {
  content: "";
  position: absolute;
  inset: 0.55rem;
  border: 2px solid currentColor;
  border-radius: 999px 999px 7px 7px;
}

.sft-bell {
  position: absolute;
  top: 0.1rem;
  right: 0.05rem;
  min-width: 1.15rem;
  height: 1.15rem;
  border-radius: 999px;
  background: var(--ui-primary);
  color: #fff;
  font-size: 0.68rem;
  line-height: 1.15rem;
}

.sft-panel h2,
.sft-hero h2,
.sft-reader h2 {
  display: block;
  margin: 0;
  color: var(--sft-heading);
  font-size: 1.35rem;
  line-height: 1.2;
}

.sft-panel h3,
.sft-reader h3 {
  margin: 0 0 0.75rem;
  color: var(--sft-heading);
  font-size: 1rem;
}

.sft-kicker {
  display: block;
  margin: 0 0 0.15rem;
  color: var(--ui-primary);
  font-weight: 700;
  font-size: 0.78rem;
  text-transform: uppercase;
}

.sft-muted {
  color: var(--ui-text-muted);
  margin: 0.35rem 0 0;
}

.sft-actions,
.sft-submit,
.sft-toolbar,
.sft-status-row,
.sft-row-meta {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.sft-main {
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem);
}

.sft-stack,
.sft-form,
.sft-mini-list,
.sft-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sft-panel,
.sft-hero,
.sft-response {
  padding: 1rem;
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  background: var(--ui-bg);
}

.sft-auth {
  max-width: 460px;
  margin-inline: auto;
}

.sft-auth-screen {
  width: 100%;
  display: flex;
  justify-content: center;
}

.sft-auth-card {
  width: min(100%, 450px);
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  background: var(--ui-bg);
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
  padding: 1.5rem;
}

.sft-auth-card-scroll {
  max-height: calc(100vh - 4rem);
  overflow: auto;
}

.sft-auth-head {
  text-align: center;
  margin-bottom: 1.5rem;
}

.sft-auth-head h2 {
  margin: 0.65rem 0 0.35rem;
  color: var(--sft-heading);
  font-size: 1.25rem;
  line-height: 1.2;
}

.sft-auth-head p,
.sft-auth-note,
.sft-auth-link {
  color: var(--ui-text-muted);
}

.sft-auth-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--sft-heading);
}

.sft-auth-icon.solid {
  width: 4rem;
  height: 4rem;
  border-radius: 16px;
  background: var(--ui-primary);
  color: #fff;
  box-shadow: 0 10px 15px -3px rgb(15 118 110 / 0.25);
}

.sft-auth-icon svg {
  width: 100%;
  height: 100%;
}

.sft-auth-card .sft-field {
  margin-bottom: 1.35rem;
}

.sft-auth-card .sft-field b {
  color: var(--ui-error);
}

.sft-check-inline {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0.25rem 0 1.25rem;
  color: var(--sft-text);
  font-size: 0.95rem;
}

.sft-check-inline input {
  width: 1rem;
  height: 1rem;
}

.sft-auth-submit {
  width: 100%;
  min-height: 2.5rem;
  border: 0;
  border-radius: 6px;
  background: #22c55e;
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.08);
}

.sft-auth-submit.compact {
  width: auto;
  min-height: 2.75rem;
  padding-inline: 1rem;
  background: var(--ui-primary);
}

.sft-auth-submit:disabled {
  cursor: wait;
  opacity: 0.72;
}

.sft-auth-note,
.sft-auth-link {
  margin: 1.6rem 0 0;
  text-align: center;
  font-size: 0.82rem;
}

.sft-auth-link button {
  border: 0;
  background: transparent;
  color: var(--ui-primary);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.sft-main-auth {
  min-height: max(640px, calc(100vh - 80px));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sft-main-auth .sft-auth,
.sft-main-auth .sft-message {
  width: min(100%, 460px);
}

.sft-hero {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.sft-page {
  width: 100%;
}

.sft-page-head {
  max-width: 72rem;
  margin: 0 auto 2rem;
}

.sft-page-head.with-action {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.sft-page-head h1 {
  margin: 0 0 0.5rem;
  color: var(--sft-heading);
  font-size: 2.25rem;
  line-height: 1.1;
  font-weight: 800;
}

.sft-page-head p {
  margin: 0;
  color: var(--ui-text-muted);
  font-size: 1.1rem;
}

.sft-dashboard {
  max-width: 72rem;
  margin: 0 auto;
}

.sft-new-case-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  background: #ecfdf5;
  color: var(--sft-heading);
  padding: 1.5rem;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.sft-new-case-card strong {
  display: block;
  color: var(--ui-primary);
  font-size: 1.5rem;
  margin-bottom: 0.2rem;
}

.sft-new-case-card small {
  color: var(--ui-primary);
  font-size: 0.95rem;
}

.sft-new-case-icon,
.sft-stat-icon,
.sft-report-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.sft-new-case-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 12px;
  background: var(--sft-primary-strong);
  color: #fff;
  box-shadow: 0 10px 15px -3px rgb(15 118 110 / 0.25);
}

.sft-new-case-icon svg,
.sft-stat-icon svg,
.sft-report-icon svg,
.sft-section-head svg {
  width: 1.5rem;
  height: 1.5rem;
}

.sft-grid,
.sft-stat-grid,
.sft-article-grid {
  display: grid;
  gap: 1rem;
}

.sft-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.sft-stat-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.sft-stat-grid.nuxt {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.sft-stat-grid.compact {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.sft-article-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.sft-span {
  grid-column: 1 / -1;
}

.sft-fieldset {
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  padding: 1rem;
  margin: 0;
}

.sft-fieldset legend {
  padding: 0 0.35rem;
  font-weight: 700;
}

.sft-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: var(--sft-text);
  font-size: 0.9rem;
  font-weight: 700;
}

.sft-input {
  width: 100%;
  min-height: 2.45rem;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
  background: var(--ui-bg);
  color: var(--sft-heading);
  padding: 0.55rem 0.7rem;
  font: inherit;
  font-weight: 500;
}

.sft-input::placeholder {
  color: #94a3b8;
  opacity: 1;
}

textarea.sft-input {
  min-height: auto;
  resize: vertical;
}

.sft-select-small {
  width: auto;
  min-width: 10rem;
}

.sft-check-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.sft-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.5rem;
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
}

.sft-stat {
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  background: var(--ui-bg);
  color: var(--sft-text);
  padding: 1rem;
  text-align: left;
}

button.sft-stat {
  cursor: pointer;
}

.sft-stat.nuxt {
  min-height: 11rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45rem;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.sft-stat.nuxt.highlight {
  background: #ecfdf5;
}

.sft-stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  background: var(--ui-primary);
  color: #fff;
}

.sft-stat-icon.muted {
  background: #ccfbf1;
  color: var(--ui-primary);
}

.sft-click-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-flex;
  align-items: center;
  min-height: 1.35rem;
  border-radius: 999px;
  background: var(--ui-primary);
  color: #fff;
  padding: 0 0.55rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.sft-stat span,
.sft-stat small {
  display: block;
  color: var(--ui-text-muted);
}

.sft-stat strong {
  display: block;
  margin: 0.35rem 0;
  font-size: 2rem;
}

.sft-stat.nuxt strong {
  margin: 0;
  color: var(--sft-heading);
  font-size: 2.35rem;
}

.sft-stat.nuxt.highlight strong,
.sft-stat.nuxt.highlight small {
  color: var(--ui-primary);
}

.sft-stat.nuxt em {
  color: var(--ui-text-muted);
  font-size: 0.78rem;
  font-style: normal;
}

.sft-stat.danger strong,
.sft-severity {
  color: var(--ui-error);
}

.sft-stat.success strong {
  color: var(--ui-success);
}

.sft-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  overflow: hidden;
}

.sft-row,
.sft-mini-list button {
  width: 100%;
  border: 0;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg);
  color: var(--sft-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1rem;
  text-align: left;
  cursor: pointer;
}

.sft-mini-list button {
  border: 1px solid var(--ui-border);
  border-radius: 6px;
}

.sft-row:hover,
.sft-mini-list button:hover,
.sft-stat:hover {
  background: var(--ui-bg-elevated);
}

.sft-row small,
.sft-mini-list small,
.sft-article-card small {
  display: block;
  color: var(--ui-text-muted);
  margin-top: 0.2rem;
}

.sft-status,
.sft-severity {
  display: inline-flex;
  align-items: center;
  min-height: 1.75rem;
  padding: 0 0.55rem;
  border-radius: 6px;
  border: 1px solid var(--ui-border);
  font-size: 0.8rem;
  font-weight: 700;
}

.sft-detail-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.sft-facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin: 1rem 0 0;
}

.sft-facts.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.sft-facts dt {
  color: var(--ui-text-muted);
  font-size: 0.8rem;
}

.sft-facts dd {
  margin: 0.2rem 0 0;
  font-weight: 700;
}

.sft-message,
.sft-empty {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.sft-message.ok {
  background: var(--ui-success-50);
  color: var(--ui-success-700);
}

.sft-message.error {
  background: var(--ui-error-50);
  color: var(--ui-error-700);
}

.sft-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.sft-section-head h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.25rem;
  color: var(--sft-heading);
  font-size: 1.5rem;
  font-weight: 800;
}

.sft-section-head p {
  margin: 0;
  color: var(--ui-text-muted);
}

.sft-outline-action {
  border: 1px solid var(--ui-primary);
  border-radius: 6px;
  background: transparent;
  color: var(--ui-primary);
  padding: 0.55rem 0.85rem;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.sft-article-grid.dashboard {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.sft-feature-article {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65rem;
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  background: var(--ui-bg);
  padding: 0;
  overflow: hidden;
  text-align: left;
  cursor: pointer;
}

.sft-feature-article img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.sft-feature-article > :not(img) {
  margin-inline: 1rem;
}

.sft-feature-article .sft-status {
  margin-top: 1rem;
}

.sft-feature-article strong {
  color: var(--sft-heading);
  font-weight: 800;
}

.sft-feature-article small,
.sft-feature-article em {
  color: var(--ui-text-muted);
  font-size: 0.85rem;
  font-style: normal;
}

.sft-feature-article em {
  margin-bottom: 1rem;
}

.sft-empty {
  margin: 0;
  color: var(--ui-text-muted);
}

.sft-bars > div {
  display: grid;
  grid-template-columns: 8rem 1fr 3rem;
  gap: 0.75rem;
  align-items: center;
}

.sft-bars div div {
  height: 0.75rem;
  border-radius: 999px;
  background: var(--ui-bg-elevated);
  overflow: hidden;
}

.sft-bars i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--ui-primary);
}

.sft-article-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  background: var(--ui-bg);
  color: var(--sft-text);
  padding: 0;
  text-align: left;
  cursor: pointer;
}

.sft-article-card img,
.sft-reader > img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  background: var(--ui-bg-elevated);
}

.sft-article-placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #f1f5f9;
}

.sft-article-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 1rem;
}

.sft-card-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sft-article-card h3,
.sft-article-card p {
  margin: 0;
}

.sft-article-card h3 {
  color: var(--sft-heading);
  font-size: 1.05rem;
  line-height: 1.35;
}

.sft-article-card p {
  color: var(--ui-text-muted);
  font-size: 0.92rem;
}

.sft-reader {
  max-width: 860px;
  margin-inline: auto;
}

.sft-reader > * + * {
  margin-top: 1rem;
}

.sft-reader section p {
  white-space: pre-line;
}

.sft-lead {
  font-size: 1.1rem;
  color: var(--ui-text-muted);
}

.sft-response {
  overflow: auto;
  white-space: pre-wrap;
  min-height: 12rem;
  font-size: 0.86rem;
}

.sft-article-controls {
  max-width: 72rem;
  margin: 0 auto 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sft-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sft-filter-row.status {
  border-top: 1px solid var(--ui-border);
  padding-top: 0.75rem;
  align-items: center;
}

.sft-filter-row.status > span {
  color: var(--ui-text-muted);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.sft-filter-chip {
  min-height: 2rem;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
  background: var(--ui-bg);
  color: var(--sft-text);
  padding: 0 0.7rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.sft-filter-chip.small {
  min-height: 1.75rem;
  font-size: 0.8rem;
}

.sft-filter-chip.active {
  border-color: var(--ui-primary);
  background: var(--ui-primary);
  color: #fff;
}

.sft-empty-state {
  max-width: 72rem;
  margin: 0 auto;
  text-align: center;
}

.sft-report-stats {
  max-width: 72rem;
  margin: 0 auto 2rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.sft-report-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  background: var(--ui-bg);
  padding: 1rem;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.sft-report-stat.critical {
  border-left: 4px solid #ef4444;
}

.sft-report-stat small {
  display: block;
  color: var(--ui-text-muted);
  font-size: 0.85rem;
}

.sft-report-stat strong {
  display: block;
  color: var(--sft-heading);
  font-size: 1.5rem;
}

.sft-report-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 10px;
  background: #fee2e2;
  color: #dc2626;
}

.sft-report-icon.yellow {
  background: #fef3c7;
  color: #ca8a04;
}

.sft-report-icon.green {
  background: #dcfce7;
  color: #16a34a;
}

.sft-report-icon.gray {
  background: #f1f5f9;
  color: #475569;
}

@media (max-width: 980px) {
  .sft-article-grid,
  .sft-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sft-stat-grid.nuxt,
  .sft-article-grid.dashboard {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .sft-nav {
    flex: 1 1 auto;
    overflow-x: auto;
    justify-content: flex-start;
  }

  .sft-brand span {
    display: none;
  }

  .sft-topbar-inner {
    gap: 0.5rem;
  }
}

@media (max-width: 760px) {
  .sft-topbar,
  .sft-topbar-inner,
  .sft-hero,
  .sft-page-head.with-action,
  .sft-section-head,
  .sft-detail-head,
  .sft-row,
  .sft-mini-list button {
    align-items: stretch;
    flex-direction: column;
  }

  .sft-grid,
  .sft-stat-grid,
  .sft-stat-grid.compact,
  .sft-stat-grid.nuxt,
  .sft-article-grid,
  .sft-article-grid.dashboard,
  .sft-check-grid,
  .sft-facts,
  .sft-facts.two,
  .sft-report-stats {
    grid-template-columns: 1fr;
  }

  .sft-page-head h1 {
    font-size: 1.85rem;
  }

  .sft-header-actions,
  .sft-new-case-card {
    align-items: stretch;
  }

  .sft-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
    overflow: visible;
  }

  .sft-nav button {
    width: 100%;
    white-space: normal;
    text-align: center;
  }

  .sft-header-actions {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .sft-bars > div {
    grid-template-columns: 1fr;
  }
}
</style>
