# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 frontend application using Vue 3 and TypeScript. The project follows a minimal starter structure and is configured with Nuxt's auto-import capabilities.

Please load nuxt documentation from: https://nuxt.com/docs/4.x/getting-started/

Keep Nuxt default architecture in mind when writing code, keep conventions, casing, etc.

Use as much existing components and code as possible.

Use tailwindcss for styling, tailwind version: "@nuxtjs/tailwindcss": "^6.14.0".

Dont use emojis in the code.

## Description of the project

### Project Overview

- Presentation by representatives from Motto University Hospital in Prague
- Goal: Create a simple, safe, user-friendly application to expedite patient transfers to specialized sarcoma centers
- The application aims to bridge the gap between patient care and healthcare provider workflow

### Problem Statement

- Sarcoma cases (400-600 diagnosed annually in the Czech Republic) require specialized center treatment
- Effective communication needed between practitioners, surgeons, and specialized centers
- Current process for patient referrals appears to be inefficient

### Application Features

- Simple interface designed not to distract doctors from patient referral tasks
- Ability to input basic patient information, image analysis, and laboratory results
- Clear case status display for tracking progress
- Consultation functionality between healthcare providers
- Documentation sharing capabilities

### User Roles

- Primary care physicians: Can conduct initial research, basic sonography, or refer to specialists
- Surgeons: Can refer patients to specialized centers
- Coordinators: The critical link receiving requirements from field doctors and connecting with multidisciplinary teams
- Option for primary care physicians to contact coordinators directly to expedite the process

### Technical Specifications

- Modern but intentionally simple web application
- Intuitive interface designed specifically for healthcare workers
- Enhanced security features to protect patient data
- Prototype already developed for documentation sharing

### Future Development

- Planning for future extensions and automatic data population
- Designed to be motivating for doctors to use, avoiding unnecessary complexity
- Potential for integration with existing healthcare information systems

## Development Commands

Install dependencies:
```bash
npm install
```

Start development server (runs on http://localhost:3000):
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

Generate static site:
```bash
npm run generate
```

## Project Structure

- `app/` - Main application code
  - `app.vue` - Root application component
  - `pages/` - File-based routing pages
    - `login.vue` - Login page with UAuthForm
    - `signup.vue` - Signup page with UAuthForm
    - `dashboard.vue` - Main dashboard with sarcoma form link
    - `sarcoma-form.vue` - Multi-step patient form using UStepper
  - `layouts/` - Application layouts
    - `default.vue` - Default layout with UHeader and navigation
  - `assets/css/` - CSS files
    - `main.css` - Tailwind CSS v4 imports and custom theme
- `public/` - Static assets served directly (favicon.ico, robots.txt)
- `.nuxt/` - Auto-generated Nuxt build artifacts (do not edit)
- `nuxt.config.ts` - Nuxt configuration file

## Architecture Notes

### Nuxt 4 Conventions

This project uses Nuxt 4 which follows these conventions:
- **Auto-imports**: Components, composables, and utilities are auto-imported. No need for explicit imports from `~/components`, `~/composables`, etc.
- **File-based routing**: Create `.vue` files in `app/pages/` directory to define routes automatically
- **Layouts**: Create layouts in `app/layouts/` directory
- **Composables**: Create composables in `app/composables/` directory
- **Components**: Create components in `app/components/` directory
- **Server API**: Create API endpoints in `server/api/` directory

### TypeScript Configuration

TypeScript is configured using project references pointing to auto-generated configs in `.nuxt/`:
- `tsconfig.app.json` - App code configuration
- `tsconfig.server.json` - Server code configuration
- `tsconfig.shared.json` - Shared configuration
- `tsconfig.node.json` - Node environment configuration

Do not modify the root `tsconfig.json` or files in `.nuxt/` as they are auto-generated.

### Development Workflow

After installing dependencies, `nuxt prepare` runs automatically (via postinstall script) to generate TypeScript types and auto-import definitions.

When adding new directories like `pages/`, `components/`, or `composables/`, restart the dev server to ensure Nuxt properly detects and configures them.

## Application Features

### Authentication
- Login page at `/login` with email/password and social auth providers (Google, GitHub)
- Signup page at `/signup` with password confirmation
- After successful login, redirects to `/dashboard`

### Sarcoma Patient Form
- Multi-step form at `/sarcoma-form` using Nuxt UI's UStepper component
- **Step 1**: Patient type selection (new patient vs. existing patient)
- **Step 2**: Medical data collection (imaging, medical history, diagnosis)
  - Conditional fields based on patient type
  - Support for multiple imaging types with individual date/description
  - Blood thinners tracking (new patients)
  - Histological verification (new patients)
  - Basic diagnosis + summary (existing patients)
- **Step 3**: Patient contact information
  - Personal details (name, address, birth number)
  - Insurance company selection
  - Phone and email
  - File attachments support
- Form validation using Zod schemas
- Czech language labels and messages
- Warning if imaging not performed before proceeding

### UI Components
This project uses Nuxt UI v4 (https://ui.nuxt.com) components:
- `UAuthForm` - Authentication forms with built-in validation
- `UStepper` - Multi-step form navigation
- `UCard` - Card containers
- `UButton` - Buttons with variants
- `UInput`, `UTextarea`, `USelect` - Form inputs
- `URadioGroup`, `UCheckbox` - Selection inputs
- `UFormGroup` - Form field groups with labels
- `UHeader` - Page headers
- `UAlert` - Alert notifications
- `UToast` - Toast notifications (via `useToast()` composable)

### Styling
- Tailwind CSS v4 with custom theme configuration
- Czech text throughout the application
- Responsive design with mobile-first approach
- Consistent spacing and typography using Tailwind utilities
