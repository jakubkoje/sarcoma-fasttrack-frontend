<template>
  <UApp :portal="false" class="light sft-shell">
    <header class="sft-topbar">
      <button class="sft-brand" type="button" @click="go(token ? 'dashboard' : 'login')">
        <span class="sft-kicker">Sarkom FastTrack</span>
        <strong>{{ title }}</strong>
      </button>
      <nav class="sft-actions">
        <template v-if="token">
          <UButton size="sm" variant="ghost" icon="i-lucide-layout-dashboard" @click="go('dashboard')">Dashboard</UButton>
          <UButton size="sm" variant="ghost" icon="i-lucide-list" @click="go('reports')">Overview</UButton>
          <UButton v-if="isDoctor" size="sm" variant="ghost" icon="i-lucide-plus" @click="go('new')">New record</UButton>
          <UButton v-if="isSpecialist" size="sm" variant="ghost" icon="i-lucide-chart-column" @click="go('analytics')">Analytics</UButton>
          <UButton size="sm" variant="ghost" icon="i-lucide-book-open" @click="go('articles')">Articles</UButton>
          <UButton size="sm" variant="ghost" icon="i-lucide-flask-conical" @click="go('api-tester')">API</UButton>
          <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-log-out" @click="logout">Log out</UButton>
        </template>
        <template v-else>
          <UButton size="sm" variant="ghost" icon="i-lucide-log-in" @click="go('login')">Log in</UButton>
          <UButton size="sm" variant="ghost" icon="i-lucide-user-plus" @click="go('signup')">Sign up</UButton>
          <UButton size="sm" variant="ghost" icon="i-lucide-book-open" @click="go('articles')">Articles</UButton>
        </template>
      </nav>
    </header>

    <main class="sft-main">
      <div v-if="message" class="sft-message" :class="message.kind">{{ message.text }}</div>

      <section v-if="visibleView === 'login'" class="sft-panel sft-auth">
        <div>
          <p class="sft-kicker">Access</p>
          <h2>Log in to the system</h2>
          <p class="sft-muted">Use a local seed account or a newly registered user.</p>
        </div>
        <form class="sft-form" @submit.prevent="login">
          <label class="sft-field">
            <span>Email</span>
            <input v-model="loginForm.email" class="sft-input" autocomplete="username" type="email" required />
          </label>
          <label class="sft-field">
            <span>Password</span>
            <input v-model="loginForm.password" class="sft-input" autocomplete="current-password" type="password" required />
          </label>
          <div class="sft-submit">
            <UButton type="submit" icon="i-lucide-log-in" :loading="loading">Log in</UButton>
            <UButton color="neutral" variant="outline" icon="i-lucide-user-plus" @click="go('signup')">Create account</UButton>
          </div>
        </form>
      </section>

      <section v-else-if="visibleView === 'signup'" class="sft-panel sft-auth">
        <div>
          <p class="sft-kicker">Sign up</p>
          <h2>New user</h2>
          <p class="sft-muted">Local sign-up creates a user in the Go API store.</p>
        </div>
        <form class="sft-form" @submit.prevent="signup">
          <label class="sft-field">
            <span>Email</span>
            <input v-model="signupForm.email" class="sft-input" type="email" autocomplete="username" required />
          </label>
          <label class="sft-field">
            <span>Role</span>
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
            <span>Password</span>
            <input v-model="signupForm.password" class="sft-input" type="password" autocomplete="new-password" required />
          </label>
          <label class="sft-field">
            <span>Confirm password</span>
            <input v-model="signupForm.confirm_password" class="sft-input" type="password" autocomplete="new-password" required />
          </label>
          <div class="sft-submit">
            <UButton type="submit" icon="i-lucide-user-plus" :loading="loading">Sign up</UButton>
            <UButton color="neutral" variant="outline" icon="i-lucide-log-in" @click="go('login')">Log in</UButton>
          </div>
        </form>
      </section>

      <section v-else-if="visibleView === 'dashboard'" class="sft-stack">
        <div class="sft-hero">
          <div>
            <p class="sft-kicker">Dashboard</p>
            <h2>Quick overview of all sarcoma cases</h2>
            <p class="sft-muted">Data is loaded from the Go API. The user role controls available actions in the same way as in the original Nuxt application.</p>
          </div>
          <div class="sft-submit">
            <UButton v-if="isDoctor" icon="i-lucide-plus" @click="go('new')">New case</UButton>
            <UButton v-if="isSpecialist" color="neutral" variant="outline" icon="i-lucide-chart-column" @click="go('analytics')">Analytics</UButton>
          </div>
        </div>

        <div class="sft-stat-grid">
          <button class="sft-stat danger" type="button" @click="go('reports')">
            <span>Pending cases</span>
            <strong>{{ dashboardStats.pending }}</strong>
            <small>Require assessment</small>
          </button>
          <button class="sft-stat" type="button" @click="go('reports')">
            <span>Total cases</span>
            <strong>{{ dashboardStats.total }}</strong>
            <small>Visible for current role</small>
          </button>
          <button class="sft-stat success" type="button" @click="go('reports')">
            <span>Processed</span>
            <strong>{{ dashboardStats.completed }}</strong>
            <small>DONE or SENT</small>
          </button>
          <button class="sft-stat" type="button" @click="go('articles')">
            <span>Expert articles</span>
            <strong>{{ articles.length }}</strong>
            <small>Educational materials</small>
          </button>
        </div>

        <div class="sft-grid">
          <article class="sft-panel">
            <h3>Latest reports</h3>
            <div class="sft-mini-list">
              <button v-for="report in recentReports" :key="report.id" type="button" @click="openReport(report.id)">
                <span>#{{ report.id }} {{ patientNames[report.patient_id] || `Patient #${report.patient_id}` }}</span>
                <small>{{ statusLabels[report.status] || report.status }}</small>
              </button>
              <p v-if="!recentReports.length" class="sft-muted">No reports loaded.</p>
            </div>
          </article>
          <article class="sft-panel">
            <h3>Recommended materials</h3>
            <div class="sft-mini-list">
              <button v-for="article in featuredArticles" :key="article.id" type="button" @click="openArticle(article.id)">
                <span>{{ article.title }}</span>
                <small>{{ article.category }} · {{ formatDateOnly(article.date) }}</small>
              </button>
            </div>
          </article>
        </div>
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

      <section v-else-if="visibleView === 'analytics'" class="sft-stack">
        <div class="sft-hero">
          <div>
            <p class="sft-kicker">Analytics</p>
            <h2>Visual effectiveness analysis</h2>
            <p class="sft-muted">Web component version of the analytics screen with current API counts and static impact metrics.</p>
          </div>
          <strong class="sft-impact">86%</strong>
        </div>
        <div class="sft-grid">
          <article class="sft-panel">
            <h3>Status distribution</h3>
            <div class="sft-bars">
              <div v-for="row in statusChartRows" :key="row.label">
                <span>{{ row.label }}</span>
                <div><i :style="{ width: `${row.percent}%` }" /></div>
                <b>{{ row.count }}</b>
              </div>
            </div>
          </article>
          <article class="sft-panel">
            <h3>Monthly trends</h3>
            <div class="sft-bars">
              <div v-for="row in monthlyTrend" :key="row.month">
                <span>{{ row.month }}</span>
                <div><i :style="{ width: `${row.cases}%` }" /></div>
                <b>{{ row.cases }}</b>
              </div>
            </div>
          </article>
          <article class="sft-panel">
            <h3>Time reduction</h3>
            <dl class="sft-facts two">
              <div v-for="item in timeComparison" :key="item.metric">
                <dt>{{ item.metric }}</dt>
                <dd>{{ item.before }} days → {{ item.after }} days</dd>
              </div>
            </dl>
          </article>
          <article class="sft-panel">
            <h3>Center performance</h3>
            <div class="sft-mini-list">
              <button v-for="hospital in hospitalPerformance" :key="hospital.hospital" type="button">
                <span>{{ hospital.hospital }}</span>
                <small>{{ hospital.cases }} cases · {{ hospital.avgTime }} days average</small>
              </button>
            </div>
          </article>
        </div>
      </section>

      <section v-else-if="visibleView === 'articles'" class="sft-stack">
        <div class="sft-hero">
          <div>
            <p class="sft-kicker">Educational materials</p>
            <h2>Expert articles on sarcomas</h2>
            <p class="sft-muted">Current information and guidelines for the diagnosis and treatment of sarcomas in the Czech Republic.</p>
          </div>
          <span class="sft-status">{{ filteredArticles.length }} / {{ articles.length }} articles</span>
        </div>

        <div class="sft-toolbar">
          <input v-model="articleSearch" class="sft-input" placeholder="Search articles..." />
          <select v-model="articleCategory" class="sft-input sft-select-small">
            <option value="all">All categories</option>
            <option v-for="category in articleCategories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>

        <div class="sft-article-grid">
          <article v-for="article in filteredArticles" :key="article.id" class="sft-article-card">
            <img :src="article.image" :alt="article.title" loading="lazy" />
            <div>
              <span class="sft-status">{{ article.category }}</span>
              <h3>{{ article.title }}</h3>
              <p>{{ article.description }}</p>
              <small>{{ formatDateOnly(article.date) }} · {{ article.author }}</small>
              <UButton size="sm" variant="outline" icon="i-lucide-arrow-right" @click="openArticle(article.id)">Open</UButton>
            </div>
          </article>
        </div>
      </section>

      <section v-else-if="visibleView === 'article'" class="sft-stack">
        <article class="sft-panel sft-reader">
          <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" @click="go('articles')">Back to articles</UButton>
          <img :src="selectedArticle.image" :alt="selectedArticle.title" loading="lazy" />
          <p class="sft-kicker">{{ selectedArticle.category }}</p>
          <h2>{{ selectedArticle.title }}</h2>
          <p class="sft-lead">{{ selectedArticle.description }}</p>
          <p class="sft-muted">{{ formatDateOnly(selectedArticle.date) }} · {{ selectedArticle.readTime }} · {{ selectedArticle.author }}</p>
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

      <section v-else class="sft-stack">
        <div class="sft-toolbar">
          <input v-model="query" class="sft-input" placeholder="Search patient, organization or status" />
          <UButton icon="i-lucide-refresh-cw" color="neutral" variant="outline" :loading="loading" @click="loadReports">Refresh</UButton>
        </div>

        <div class="sft-stat-grid compact">
          <span class="sft-stat"><span>Total</span><strong>{{ reports.length }}</strong></span>
          <span class="sft-stat danger"><span>Active</span><strong>{{ dashboardStats.pending }}</strong></span>
          <span class="sft-stat success"><span>Done</span><strong>{{ dashboardStats.completed }}</strong></span>
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
  </UApp>
</template>

<script setup lang="ts">
import type { PatientRead, ReportRead, TokenResponse, UserRead } from "../types/api";
import { articles, normalizeApiBase, pathToView, patientDisplayName, statusLabels, viewToPath } from "./sarcoma-wc-utils.js";

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
type View = "login" | "signup" | "dashboard" | "reports" | "new" | "detail" | "analytics" | "articles" | "article" | "api-tester";
type ApiProbeOptions = RequestInit & { raw?: boolean };

const knownViews = new Set<View>(["login", "signup", "dashboard", "reports", "new", "detail", "analytics", "articles", "article", "api-tester"]);
const publicViews = new Set<View>(["login", "signup", "articles", "article"]);
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
const patientNames = ref<Record<number, string>>({});
const organizationNames = ref<Record<number, string>>({});
const query = ref("");
const feedbackText = ref("");
const articleSearch = ref("");
const articleCategory = ref("all");
const apiTesterLoading = ref(false);
const apiTesterResponse = ref("");

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

const monthlyTrend = [
  { month: "January", cases: 42 },
  { month: "February", cases: 58 },
  { month: "March", cases: 67 },
  { month: "April", cases: 80 },
  { month: "May", cases: 92 },
  { month: "June", cases: 100 },
];

const timeComparison = [
  { metric: "Expert consultation", before: 28, after: 4 },
  { metric: "Request processing", before: 14, after: 2 },
  { metric: "First consultation", before: 21, after: 3 },
  { metric: "Total time", before: 35, after: 5 },
];

const hospitalPerformance = [
  { hospital: "Motol University Hospital", cases: 178, avgTime: 2.8 },
  { hospital: "University Hospital Brno", cases: 89, avgTime: 3.2 },
  { hospital: "University Hospital Olomouc", cases: 45, avgTime: 4.1 },
  { hospital: "Other", cases: 35, avgTime: 4.5 },
];

const apiRoot = computed(() => normalizeApiBase(props.apiBase));
const isDoctor = computed(() => role.value === "doctor" || role.value === "admin");
const isSpecialist = computed(() => role.value === "specialist" || role.value === "admin");
const visibleView = computed<View>(() => (!token.value && !publicViews.has(view.value) ? "login" : view.value));
const title = computed(() => {
  const labels: Record<View, string> = {
    login: "Login",
    signup: "Sign up",
    dashboard: "Dashboard",
    reports: "Reports overview",
    new: "New record",
    detail: "Report detail",
    analytics: "Analytics",
    articles: "Expert articles",
    article: "Article detail",
    "api-tester": "API Tester",
  };
  return labels[visibleView.value];
});
const userNames = computed(() => Object.fromEntries(users.value.map((user) => [user.id, user.email])));
const selectedReport = computed(() => reports.value.find((report) => report.id === selectedReportId.value) || null);
const selectedArticle = computed(() => articles.find((article) => article.id === selectedArticleId.value) || articles[0]);
const featuredArticles = computed(() => articles.slice(0, 3));
const articleCategories = computed(() => [...new Set(articles.map((article) => article.category))]);
const filteredArticles = computed(() => {
  const needle = articleSearch.value.trim().toLowerCase();
  return articles.filter((article) => {
    const categoryMatch = articleCategory.value === "all" || article.category === articleCategory.value;
    const textMatch = !needle || [article.title, article.description, article.category, article.author].join(" ").toLowerCase().includes(needle);
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
const recentReports = computed(() => [...reports.value].sort((a, b) => b.id - a.id).slice(0, 5));
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
const statusChartRows = computed(() => {
  const total = Math.max(reports.value.length, 1);
  return statusOptions.map((option) => {
    const count = reports.value.filter((report) => report.status === option.value).length;
    return { label: option.label, count, percent: Math.max(4, Math.round((count / total) * 100)) };
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
    await loadReports();
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
  if (token.value) void loadReports();
});

onUnmounted(() => {
  window.removeEventListener("popstate", syncViewFromLocation);
});
</script>

<style scoped>
.sft-shell {
  min-height: 100%;
  color: var(--ui-text);
  background: var(--ui-bg);
}

.sft-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem clamp(1rem, 3vw, 2rem);
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg);
}

.sft-brand {
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.sft-brand strong,
.sft-panel h2,
.sft-hero h2,
.sft-reader h2 {
  display: block;
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.2;
}

.sft-panel h3,
.sft-reader h3 {
  margin: 0 0 0.75rem;
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
}

.sft-hero {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.sft-impact {
  color: var(--ui-primary);
  font-size: clamp(2.5rem, 8vw, 5rem);
  line-height: 1;
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
  font-size: 0.9rem;
  font-weight: 700;
}

.sft-input {
  width: 100%;
  min-height: 2.45rem;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
  background: var(--ui-bg);
  color: inherit;
  padding: 0.55rem 0.7rem;
  font: inherit;
  font-weight: 500;
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
  color: inherit;
  padding: 1rem;
  text-align: left;
}

button.sft-stat {
  cursor: pointer;
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
  color: inherit;
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
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  background: var(--ui-bg);
}

.sft-article-card img,
.sft-reader > img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  background: var(--ui-bg-elevated);
}

.sft-article-card div {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 1rem;
}

.sft-article-card h3,
.sft-article-card p {
  margin: 0;
}

.sft-reader {
  max-width: 860px;
}

.sft-reader > * + * {
  margin-top: 1rem;
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

@media (max-width: 980px) {
  .sft-stat-grid,
  .sft-article-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .sft-topbar,
  .sft-hero,
  .sft-detail-head,
  .sft-row,
  .sft-mini-list button {
    align-items: stretch;
    flex-direction: column;
  }

  .sft-grid,
  .sft-stat-grid,
  .sft-stat-grid.compact,
  .sft-article-grid,
  .sft-check-grid,
  .sft-facts,
  .sft-facts.two {
    grid-template-columns: 1fr;
  }

  .sft-bars > div {
    grid-template-columns: 1fr;
  }
}
</style>
