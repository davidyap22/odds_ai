# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16.1.0 website built with React 19, TypeScript, and Tailwind CSS 4. The project uses the App Router architecture and is configured for modern Next.js development.

## Development Commands

**Start development server:**
```bash
npm run dev
```
Opens at http://localhost:3000 with hot reload enabled.

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm run start
```
Run after `npm run build` to serve the production build.

**Lint code:**
```bash
npm run lint
```
Uses ESLint with Next.js TypeScript configuration.

## Architecture

### App Router Structure
- Uses Next.js App Router (app directory)
- `app/layout.tsx`: Root layout with Geist font configuration and global CSS
- `app/page.tsx`: Homepage component
- `app/globals.css`: Global styles with Tailwind CSS and CSS variables for theming

### Styling System
- **Tailwind CSS 4** with PostCSS integration
- CSS variables defined in `globals.css` for theming (`--background`, `--foreground`)
- Custom theme configuration using `@theme inline` directive
- Dark mode support via `prefers-color-scheme` media query
- Geist Sans and Geist Mono fonts loaded from `next/font/google`

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Target: ES2017
- Module resolution: bundler

### ESLint Configuration
- Uses modern ESLint flat config format (`eslint.config.mjs`)
- Next.js core-web-vitals and TypeScript presets enabled
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Key Files

- `next.config.ts`: Next.js configuration (currently minimal)
- `tsconfig.json`: TypeScript compiler options
- `postcss.config.mjs`: PostCSS configuration for Tailwind
- `eslint.config.mjs`: ESLint flat config
- `public/`: Static assets (SVG icons and images)

## Development Patterns

When adding new pages or components:
- Create new route segments in `app/` directory following App Router conventions
- Use Server Components by default (no "use client" directive)
- Add "use client" directive only when using hooks, event handlers, or browser APIs
- Follow existing styling patterns with Tailwind utility classes
- Reference CSS variables (`var(--background)`, `var(--foreground)`) for theme consistency
