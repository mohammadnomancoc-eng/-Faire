# Website Theme Styling Guide

## Overview
This website supports both dark mode and light mode through a global theme system. The theme is applied by toggling CSS class names on the `document.documentElement` and updating CSS custom properties.

The current theme is stored in `localStorage` and the site also supports a `system` preference fallback. Theme selection is managed in `src/context/ThemeContext.jsx` and the toggle UI is located in `src/components/ui/ThemeToggle.jsx`.

## Theme Mechanism

- `ThemeContext` tracks:
  - `theme`: user-selected theme (`dark`, `light`, or `system`)
  - `resolvedTheme`: actual active theme after resolving `system`
- On theme change, the app updates:
  - `document.documentElement.classList` with `dark` or `light`
  - `document.documentElement.dataset.theme`
  - `document.documentElement.style.colorScheme`
  - CSS variables from `src/lib/themeTokens.js`
- Theme persists across refreshes via `localStorage`.

## CSS Variable Tokens

The website uses CSS custom properties for nearly all major colors, surface styles, and shadows.

### Dark Theme Tokens
- `--background`: `#202D43`
- `--background-secondary`: `#26354E`
- `--surface`: `#2B3B57`
- `--surface-hover`: `#32456C`
- `--card`: `#2B3B57`
- `--card-hover`: `#32456C`
- `--text-primary`: `#D9D9D9`
- `--text-secondary`: `#C6C8CC`
- `--text-muted`: `#9CA3AF`
- `--border`: `rgba(255, 255, 255, 0.08)`
- `--border-hover`: `rgba(62, 113, 192, 0.28)`
- `--primary`: `#3E71C0`
- `--primary-hover`: `#4D82D6`
- `--primary-soft`: `rgba(62, 113, 192, 0.12)`
- `--success`: `#6FCF97`
- `--warning`: `#F59E0B`
- `--danger`: `#F87171`
- `--shadow`: `0 14px 50px rgba(20, 34, 60, 0.18)`
- `--shadow-hover`: `0 18px 60px rgba(62, 113, 192, 0.18)`
- `--glass-background`: `rgba(21, 33, 57, 0.72)`
- `--glass-border`: `rgba(255, 255, 255, 0.08)`

### Light Theme Tokens
- `--background`: `#F8FAFC`
- `--background-secondary`: `#FFFFFF`
- `--surface`: `#FFFFFF`
- `--surface-hover`: `#F1F5F9`
- `--card`: `#FFFFFF`
- `--card-hover`: `#F8FAFC`
- `--text-primary`: `#111827`
- `--text-secondary`: `#4B5563`
- `--text-muted`: `#6B7280`
- `--border`: `#E5E7EB`
- `--border-hover`: `#CBD5E1`
- `--primary`: `#3E71C0`
- `--primary-hover`: `#3264AF`
- `--primary-soft`: `rgba(62, 113, 192, 0.12)`
- `--success`: `#22C55E`
- `--warning`: `#F59E0B`
- `--danger`: `#EF4444`
- `--shadow`: `0 18px 50px rgba(15, 23, 42, 0.08)`
- `--shadow-hover`: `0 22px 60px rgba(15, 23, 42, 0.12)`
- `--glass-background`: `rgba(255, 255, 255, 0.72)`
- `--glass-border`: `rgba(229, 231, 235, 0.6)`

## Visual Style

### Dark mode style
- Deep navy-blue background and secondary surfaces.
- Soft muted light text on dark surfaces.
- Glass-like panels with blurred translucent backgrounds.
- Subtle contrast on cards using layering of `--surface` and `--surface-hover`.
- Primary accent color is a bright royal blue.

### Light mode style
- Bright, airy white and near-white backgrounds.
- Dark charcoal text for strong readability.
- Soft border and hover colors to preserve visual hierarchy.
- The same blue primary accent is reused to keep branding consistent.
- Light glass panels are achieved with white translucency and soft gray borders.

## Component Styling

### Buttons and controls
- Primary action buttons: solid blue background with white text.
- Ghost buttons: transparent backgrounds and secondary text color.
- Standard buttons use subtle page accent background and border.
- All buttons have rounded corners, motion transitions, and hover elevation.

### Cards and glass surfaces
- `.glass-card` and `.glass-card-hover` use blurred translucent backgrounds.
- Cards use `--card`, `--border`, and `--shadow` for depth.
- Hover states lift cards gently and lighten borders.

### Forms and inputs
- Input fields use a semi-transparent background with border and placeholder text in muted color.
- Focus and hover states are handled through transition effects and subtle visual feedback.

## Theme Toggle UX

- The toggle is implemented in `src/components/ui/ThemeToggle.jsx`.
- It displays a moon or sun icon depending on the active theme.
- It animates the handle between left (dark) and right (light).
- Clicking the toggle switches between `dark` and `light` themes.
- If the stored theme is `system`, the active theme resolves based on the OS preference.

## Prompt Guidance

Use this file to build a prompt that asks users to switch themes in natural language. Focus on:
- The website offering both dark and light modes.
- Dark mode using deep blue/navy backgrounds with pale text.
- Light mode using bright white backgrounds with dark text.
- The theme toggle control in the top navigation.
- The app preserving the selected mode across reloads.

Example prompt idea:
"Switch the app between dark mode and light mode. Dark mode uses rich blue shadows, glass panels, and pale text; light mode uses white cards, soft gray borders, and dark text. Use the top navigation theme toggle."