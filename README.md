# Portal UI

## Goal

Ship a standalone React SPA that models our internal tenant-provisioning portal. The app should run entirely on mocked data/services; no real API calls or auth flows.

### Context

Portal operators use this tool to spin up or manage tenants on the TeamWeave platform. These users care about:

- Quickly confirming tenant state and recent provisioning events.
- Safely onboarding new tenants with validated metadata (client URL slug, region, isolation tier, etc. More information on these further down)
- Exporting audit information and cleaning up stale tenants.

Future phases will plug this UI into real APIs; for now, produce believable fake data and workflows that make it easy to swap in actual requests later.

### Scope

- Tenants directory with search, filtering, expandable detail drawers, and inline health/audit signals.
- Five-step onboarding wizard that captures the metadata operators need before triggering provisioning.
- Mocked AWS Step Functions history, Cognito client info, audit log download, and tenant deletion flows.
- Responsive layout and accessible components suitable for a modular operations console.

## Domain Model

### Tenant Core Fields

| Field                       | Type           | Notes                                                                                                                |
| --------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------- |
| `tenant_id`                 | string (uuid)  | Internal identifier - generate mock UUIDs.                                                                           |
| `slug`                      | string         | Lowercase letters/numbers/hyphens, 3–32 chars, must not start/end with a hyphen. Reserved: `demo`, `staging`, `api`. |
| `display_name`              | string         | 3–80 chars; show as primary label.                                                                                   |
| `industry`                  | enum           | Start with `Construction`, `Consulting`; treat as dynamic options provided by the future API.                        |
| `region`                    | enum           | Start with `us-east-1` and `ca-central-1`; treat as dynamic options provided by the future API.                      |
| `isolation_tier`            | enum           | `tier_a_shared` (render as “Tier A - Shared”) or `tier_b_dedicated` (“Tier B - Dedicated”).                          |
| `status`                    | enum           | `STARTING`, `IN_PROGRESS`, `HEALTHY`, `UNHEALTHY`, `DISABLED`. See status meanings below.                            |
| `auth_mode`                 | enum           | Currently `PASSWORD` or `SSO`; default to password.                                                                  |
| `root_user_email`           | string         | Valid email; show in detail drawer.                                                                                  |
| `ip_allow_list`             | string[]       | Optional CIDR blocks; empty means unrestricted.                                                                      |
| `created_at` / `updated_at` | ISO timestamps | Use for timeline ordering.                                                                                           |
| `workspace_count`           | number         | Aggregated count of workspaces associated with the tenant.                                                           |
| `project_count`             | number         | Aggregated count of projects associated with the tenant.                                                             |
| `resource_count`            | number         | Aggregated count of provisioned resources tied to the tenant.                                                        |

### AWS Step Functions History Events

Represent each execution step with:

```typescript
type StepEvent = {
  id: string;
  state:
    | "SELECT_ARTIFACT"
    | "PROVISION_INFRA"
    | "CREATE_DATABASE"
    | "CONFIGURE_COGNITO"
    | "SETUP_ROUTING"
    | "CONFIGURE_ASYNC"
    | "VERIFY"
    | "ROLLBACK"
    | "COMPLETE";
  status: "SUCCEEDED" | "FAILED" | "RUNNING";
  timestamp: string; // ISO
  operator?: string; // e.g., 'ryan@teamweave.io'
  notes?: string;
};
```

### Tenant Deletion Flow

Provide a guarded delete flow:

1. Primary "Delete Tenant" button
2. Modal with summary and explicit warnings
3. Require typing the tenant slug to confirm
4. Second confirmation (checkbox acknowledging irreversible action)
5. Show success/failure toast (via React Toastify, already installed)

No actual deletion happens - just update local state.

## Primary Views & Interactions

### Tenant Directory

- Table Columns:
  - `display_name`
  - `slug`
  - `industry`
  - `region`
  - `isolation_tier`
  - `status`
  - `root_user_email`
  - `auth_mode`
  - `workspace_count`
  - `project_count`
  - `resource_count`
- Search
  - Single input filtering `slug` and `display_name` (case-insensitive, debounced).
- Filters
  - Status: multi-select
  - Isolation Tier: multi-select
  - Region: multi-select
  - Industry: multi-select
  - Persist filter state in URL query params so reloading preserves selections.
  - Populate filter options via the same mocked reference data service used by forms so API-provided lists can plug in later.
- Row Expansion: clicking a row opens an inline panel with:
  - Summary stats (created/updated timestamps, operator notes)
  - Aggregated metrics (workspace, project, resource counts)
  - AWS Step Functions timeline
  - Cognito App Client info
  - IP Allow List pills
  - Cost & usage overview (see Cost & Usage View section)
  - Buttons: Download Audit Log, Delete Tenant
    - Deletion should require \*at least **2\*** confirmation steps.
- Highlight `status="UNHEALTHY"` tenants (warning icon).

#### Tenant Detail Drawer UX

- Group content with headings: "Provisioning Timeline", "Authentication", "Networking"
- If a tenant is `IN_PROGRESS`, surface current step
- If `UNHEALTHY`, surface prominent alert with last failed step and notes.

### New Tenant Onboarding Wizard

Five steps; each step validates before moving forward. Disabled next button until step passes validation.

- Profile
  - `display_name` (string input)
  - `industry` select (seed with `Construction` and `Consulting`; load options via mocked reference data service)
  - `tenant_slug` (input). Show derived URL preview `https://<slug>.teamweave.io`.
  - Inline validation:
    - Regex `^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$`
    - Reserved slug check with clear message. (reserved slugs are `["demo", "staging", "api"]`).
- Region & Isolation
  - Region picker (use `["us-east-1", "ca-central-1"]` for now; options delivered by mocked reference data service)
  - Isolation tier radio buttons (Tier A - Shared, Tier B - Dedicated; options delivered by mocked reference data service)
- Access & Auth
  - `auth_mode` select one of `["PASSWORD", "SSO"]`
  - Root operator email (one), first name, and last name. Enforce proper capitalization
- Networking & Compliance
  - IP allow list editor. Let operators add/delete CIDR strings; validate simple CIDR pattern.
- Review and Submit
  - Summarize all inputs grouped by step.
  - "Back" option to edit.

Require a final confirmation checkbox.

"Submit" button triggers fake provisioning (use `Promise`) to return `STARTING` status, update directory list, append the baseline Step Functions history (including current operator when available), and show success toast via Toastify).

After submission, redirect to the base directory with the new tenant briefly highlighted.

## Mock Data Strategy

- Store sample tenants via JSON in `src/mocks/tenants.json`
- Provide a simple data access layer (`TenantService`) exposing methods: `listTenants`, `fetchTenantById`, `createTenant`, `deleteTenant`, `downloadAuditLog`.
  - **Keep the service interface asynchronous**
- Seed 8 tenants spanning statuses, tiers, industries and regions.
- Include at least one `UNHEALTHY` tenant with a Step Functions failure example.
- For Step Functions, use arrays of history events; include at least one with partial failure requiring rollback.
- Ensure `createTenant` returns new tenants with consistent mocked Cognito client metadata, audit log payloads, aggregation metric defaults, cost placeholders, IP allow list defaults, and baseline Step Functions events so detail drawers stay coherent.
- Mock `downloadAuditLog` with believable data even though no external services are called.
- Provide a mocked reference data layer that surfaces selectable options (industries, regions, isolation tiers, statuses) so the UI can swap to API-provided lists without refactoring.
- Provide a mocked cost/usage service that returns per-tenant cost breakdowns and usage counters while clearly isolating the data contract for future backend wiring.
- Treat all API payloads as provisional: shape mocked data in a sensible, extensible format, and avoid hard-wiring UI layout assumptions that would make future contract adjustments painful.

## Notes

- Function over style!! The app doesn't need to look _that_ pretty. Priority is make it easy to use while staying responsive and accessible.
- Generously use Toastify for success and error notifications across onboarding, deletion, and downloads; reserve modals for confirmation flows only.
- Form hints: show helper text near inputs (on hover) like slug regex expectations (plain english), IP formatting, etc.
- No need to worry about unit tests currently

## Cost & Usage View

- Present a dedicated cost panel within the tenant detail drawer that includes:
  - Direct AWS cost totals for isolation tier B resources tagged to the tenant.
  - Shared isolation tier A costs apportioned per tenant per region, alongside the regional pool total for context.
- Leave room for future trend indicators (sparklines or summary deltas) so longitudinal data can drop in without redesign.

## Development

- Framework: React + TypeScript (Vite-generated Vite scaffold). Stick with this stack; changes to the app framework, build tooling, or architecture need Ryan's approval.
- Package manager: `pnpm`. Manage dependencies via `pnpm` commands only, and clear any new library additions with Ryan before installing.
- Styling: SCSS. The shared styles in `index.scss` and `theme.scss` should only change when absolutely necessary—prefer local/page-level styles like `src/pages/home/Home.scss`. Adjustments here don't typically require approval, but coordinate with Ryan before making anything beyond minor touch-ups.

### Getting Started

- Install `pnpm` by following the instructions at https://pnpm.io/installation.
- Install project dependencies: `pnpm install`.

### Running the Dev Server

- Start the development server: `pnpm run dev`.
- Open your browser to http://localhost:3000.
