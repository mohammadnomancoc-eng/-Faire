# Changelog 📋

All notable changes to the **À Faire** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-09-09

### Added
- **UI Primitives**:
  - `Avatar.jsx`: User profile avatar with initials fallback and presence indicator.
  - `Spinner.jsx`: Accessible animated loader with size and color variants.
  - `Card.jsx`: Glassmorphism card container with `Header`, `Body`, and `Footer` subcomponents.
  - `Alert.jsx`: Animated alert banner with status themes and dismiss support.
  - `BackToTop.jsx`: Floating action button with smooth viewport scrolling.
- **Custom React Hooks**:
  - `useDocumentTitle.js`: Dynamic document title updater.
  - `useCopyToClipboard.js`: Auto-resetting clipboard copy handler.
  - `useKeyPress.js`: Global and scoped keyboard shortcut listener.
  - `useOnlineStatus.js`: Real-time network connectivity monitor.
- **Utility Modules**:
  - `stringUtils.js`: Text truncation, title casing, and slug generation.
  - `numberUtils.js`: Safe percentage calculation, bounds clamping, and number formatting.

---

## [1.0.0] - Initial Release

### Features
- Daily task management with start/end times and reminders.
- Long-term goals and landmark milestones tracking.
- Supabase authentication (OAuth & Email) and local guest mode.
- Dark theme styling with Tailwind CSS and Framer Motion micro-interactions.
