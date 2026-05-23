<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0
Bump rationale: MINOR — new Principle V (Documentation Language Standard) added

Principles defined:
  - I.   Code Quality Standards          [unchanged]
  - II.  Test-First Discipline           [unchanged]
  - III. UX Consistency                  [unchanged]
  - IV.  Performance Requirements        [unchanged]
  - V.   Documentation Language Standard [NEW]

Sections modified:
  - Governance: updated "four" → "five" core principles

Templates reviewed:
  - .specify/templates/plan-template.md       ✅ Summary/Technical Context authored in zh-TW per Principle V
  - .specify/templates/spec-template.md       ✅ User Scenarios and Requirements authored in zh-TW per Principle V
  - .specify/templates/tasks-template.md      ✅ Task descriptions authored in zh-TW per Principle V

Deferred TODOs: none
-->

# Heat Pump Dashboard Constitution

## Core Principles

### I. Code Quality Standards

Every file MUST be clean, reviewable, and maintainable at the time it is merged.

- Functions MUST have a single, well-defined responsibility; files exceeding 300 lines MUST be
  split unless justified in the PR description.
- Linting and formatting rules (ESLint, Prettier, or equivalent) MUST pass with zero warnings
  before a PR can be merged.
- Magic numbers and inline strings MUST be extracted into named constants or configuration;
  raw literals are only permitted in test fixtures.
- Dead code, commented-out blocks, and TODO markers left longer than one sprint MUST be removed
  or tracked as formal backlog items.
- Dependencies MUST be pinned to exact versions in lock files; unpinned ranges in production
  manifests are not permitted.

### II. Test-First Discipline (NON-NEGOTIABLE)

Tests are not optional; they are a delivery prerequisite.

- TDD MUST be followed: acceptance scenarios from `spec.md` are converted to failing tests
  before any implementation code is written.
- Unit test coverage for new business-logic modules MUST reach ≥ 80 % line coverage; coverage
  MUST NOT decrease from the baseline set at project start.
- Every user story MUST ship with at least one end-to-end (E2E) or integration test covering
  the primary happy path.
- Tests MUST be deterministic and isolated; flaky tests MUST be quarantined and fixed within
  one sprint of first failure.
- The CI pipeline MUST enforce all test gates; a red pipeline blocks merge unconditionally.

### III. UX Consistency

The dashboard MUST feel like a single, coherent product across all six pages.

- All pages MUST share a common design token set (colours, typography, spacing, border-radii)
  defined in a central theme file; no per-page overrides that diverge from the token set.
- Interactive elements (buttons, forms, modals, navigation) MUST follow the shared component
  library; duplicating UI logic outside the component library is not permitted.
- State feedback MUST be immediate: loading indicators MUST appear within 100 ms of a user
  action; error messages MUST be human-readable and actionable, never raw stack traces.
- Accessibility: all interactive components MUST meet WCAG 2.1 AA; keyboard navigation and
  screen-reader labels are required for every new component.
- Any change to a shared component MUST be reviewed for visual regression across all six pages
  before merge.

### IV. Performance Requirements

Performance is a feature, not an afterthought.

- Initial page load (LCP) MUST be ≤ 2.5 s on a simulated 4G connection; this is a hard gate
  enforced by CI Lighthouse checks.
- Time-to-interactive (TTI) MUST be ≤ 3.5 s on the same baseline.
- Data-fetching operations (API calls, sensor polling) MUST complete within 500 ms at the
  95th percentile under normal load; calls exceeding this threshold MUST display a user-visible
  progress indicator.
- Bundle size MUST NOT increase by more than 10 kB (gzip) per PR without an explicit
  performance-budget exception reviewed and approved in the PR.
- Real-time data streams (heat-pump telemetry) MUST degrade gracefully: the UI MUST remain
  usable and display the last-known-good state when the data source is unavailable.

### V. Documentation Language Standard (NON-NEGOTIABLE)

All project documentation visible to contributors or end-users MUST be authored in
Traditional Chinese (zh-TW).

- Every `spec.md`, `plan.md`, `research.md`, `data-model.md`, `tasks.md`, and `quickstart.md`
  MUST be written entirely in Traditional Chinese (zh-TW); English is permitted only for code
  identifiers, command names, file paths, and quoted API/library names.
- User-facing UI text (labels, error messages, tooltips, onboarding copy) displayed on the
  dashboard MUST be in Traditional Chinese (zh-TW).
- PR descriptions and commit messages SHOULD be in Traditional Chinese (zh-TW); English is
  acceptable when quoting technical terms with no widely accepted zh-TW equivalent.
- Translation of existing English documentation to Traditional Chinese (zh-TW) MUST be
  completed before the affected spec or plan is considered "ready" for implementation.
- This rule applies to all future features and to all documents amended after this principle
  was ratified (2026-05-23); pre-existing English content is grandfathered but MUST be
  translated when the owning document is next substantively edited.

## Quality Gates

These gates MUST be satisfied before any pull request is merged into the main branch:

- **Lint gate**: zero ESLint/Prettier violations (`npm run lint` exits 0).
- **Test gate**: all unit, integration, and E2E tests pass; coverage ≥ 80 % on changed modules.
- **Performance gate**: Lighthouse CI score ≥ 90 for Performance, ≥ 85 for Accessibility.
- **Constitution check**: at least one reviewer MUST confirm the PR does not violate any
  principle in this document; non-compliant code is blocked regardless of other gate results.

## Development Workflow

- Feature branches MUST be created from `master` and named `###-short-description`.
- Every feature MUST have a `spec.md`, `plan.md`, and `tasks.md` before implementation begins.
- Tasks MUST be ordered by dependency; foundational tasks (schema, auth, routing) MUST complete
  before user-story tasks start.
- Hotfixes bypass the spec/plan requirement but MUST include a test reproducing the bug before
  the fix is written.
- The `/speckit.constitution` command MUST be re-run whenever a new project-wide standard is
  adopted; ad-hoc verbal agreements do not amend the constitution.

## Governance

This constitution supersedes all other practices, style guides, and verbal agreements.
Amendments require:

1. A written proposal (PR description or spec entry) describing the change and its rationale.
2. Approval from at least one other contributor familiar with the affected area.
3. A version bump to this file following semantic versioning:
   - **PATCH** — clarifications, wording, typo fixes.
   - **MINOR** — new principle or section added.
   - **MAJOR** — principle removed, redefined, or made less restrictive in a breaking way.
4. All dependent templates (plan, spec, tasks) MUST be reviewed for alignment within the same PR.

All PRs and code reviews MUST verify compliance with the five core principles.
Complexity beyond what the specification requires MUST be justified in the PR description.

**Version**: 1.1.0 | **Ratified**: 2026-05-23 | **Last Amended**: 2026-05-23
