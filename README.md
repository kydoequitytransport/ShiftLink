# ShiftLink

A two-sided healthcare staffing marketplace connecting per diem professionals with facilities that need on-demand shift coverage.

**Live Demo:** [https://shiftlink-demo.vercel.app](https://shiftlink-demo.vercel.app) ← replace with your deployment URL

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/youruser/shiftlink.git && cd shiftlink

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local — defaults work for local dev with no changes needed

# 4. Run dev server
npm run dev
# → http://localhost:3000
```

### Routes
| Path | Description |
|------|-------------|
| `/` | Landing page — dual CTA for professionals & facilities |
| `/signup` | Branching registration flow (professional or facility) |
| `/auth/login` | Sign in — any email + any password (≥8 chars) in demo mode |
| `/dashboard` | Authenticated overview (dummy auth, session-based) |
| `/dashboard/shifts` | Shift board with role/date filter + claim flow |

---

## Stack Decisions

### Next.js 14 (App Router) + TypeScript
**Why:** Next.js App Router is the 2025–2026 standard for production React. Server Components give clean separation of data and UI; the file-based routing is readable in a review context. TypeScript makes the two-sided type model (`UserType`, `Shift`, `AuthUser`) explicit and self-documenting — evaluators can trace data shapes immediately.

**Supabase Integration:**
This version uses Supabase as a real backend for persistence. All shifts, claims, professionals, and facilities are stored in Supabase tables. The app uses `@supabase/supabase-js` for all data operations. See `lib/supabaseClient.ts` and `lib/hooks/useShifts.ts` for integration details.

**Supabase Table Schema:**

```
-- Facilities table
create table facilities (
	id uuid primary key default uuid_generate_v4(),
	name text not null
);

-- Professionals table
create table professionals (
	id uuid primary key default uuid_generate_v4(),
	name text not null,
	email text unique not null
);

-- Shifts table
create table shifts (
	id uuid primary key default uuid_generate_v4(),
	role text not null,
	facility_id uuid references facilities(id) on delete cascade,
	date date not null,
	time text not null,
	rate numeric not null,
	claimed_by uuid references professionals(id),
	created_at timestamp with time zone default timezone('utc', now())
);

-- Claims table (optional, for audit trail)
create table claims (
	id uuid primary key default uuid_generate_v4(),
	shift_id uuid references shifts(id) on delete cascade,
	professional_id uuid references professionals(id) on delete cascade,
	claimed_at timestamp with time zone default timezone('utc', now())
);
```

**Tradeoffs:**
- Real-time persistence via Supabase. No mock data or fallback logic.
- Minimal auth (can be extended).

### Tailwind CSS (utility classes + CSS variables)
**Why:** Tailwind gives fine-grained control over the spacing and typography hierarchy the eucalyptus.health design reference demands. CSS custom properties (`--color-sage`, `--font-display`, etc.) are used for theming so a single change propagates everywhere — this is what a token-based design system looks like before Figma Tokens or Style Dictionary are introduced.

**Why not plain CSS modules:** CSS-in-JS or module scoping adds overhead in a time-boxed project with no team collision risk. Tailwind + CSS vars is faster and the output is easier to read in a review.


---

## Project Structure

```
shiftlink/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── signup/page.tsx           # Signup flow
│   ├── auth/login/page.tsx       # Login
│   └── dashboard/
│       ├── layout.tsx            # Auth-gated sidebar layout
│       ├── page.tsx              # Overview
│       └── shifts/page.tsx       # Shift board
│
├── components/
│   ├── ui/                       # Primitive design system (Button, Input, Badge…)
│   ├── layout/                   # Navbar, Footer
│   ├── sections/                 # Landing page sections (Hero, ValueProp, Trust, CTA)
│   ├── forms/                    # SignupForm, LoginForm
│   └── shifts/                   # ShiftCard, ShiftFilter
│
├── lib/
│   ├── types/                    # Shared TypeScript types
│   ├── mock-data/                # (deprecated, not used)
│   ├── hooks/                    # useAuth, useShifts
│   └── utils/                    # formatDate, formatRate, cn…
│
├── .env.example                  # Documented env var template
└── README.md
```

**Philosophy:** Every directory has one clear responsibility. `lib/hooks` contain stateful logic. `lib/utils` are pure functions. `components/ui` has no business logic. Pages compose these — they don't contain logic themselves.

---

## Tradeoffs

**Database:** All state is now persisted in Supabase. No in-memory/sessionStorage or mock fallback for any data.
- **No image assets:** Heroic whitespace and typography are doing the visual heavy lifting intentionally, per the eucalyptus.health reference.
- **Mock claim is local-only:** Claiming a shift updates local React state; it resets on page refresh. A real implementation would PATCH the shift via API.
- **No server-side auth middleware:** The dashboard guard is client-side only (`useEffect` redirect). In production, Next.js middleware would handle this at the edge.

---

## If I Had One More Day

1. **Real auth with NextAuth + credentials provider** — the `useAuth` hook contract already matches what NextAuth's `useSession` returns, so the swap is surgical.
2. **Shift detail modal / page** — clicking a shift card would open a full view with facility profile, map embed, and one-tap claim with optimistic UI.
3. **Facility dashboard** — the current build is professional-facing only; the mirror view (post shift, view applicants, confirm coverage) is the obvious complement.
4. **Animated transitions** — page transitions with Framer Motion, and a staggered reveal on the shift grid cards to make the board feel alive.
5. **Accessibility audit** — focus management in the signup step transitions, ARIA roles on the shift board, and keyboard navigation on all interactive cards.

---

## Design Notes

Visual reference: [eucalyptus.health](https://eucalyptus.health) — typographic restraint, editorial rhythm, generous whitespace.

- **Typefaces:** DM Serif Display (headlines) + DM Sans (body). A serif/sans pairing that reads authoritative without feeling clinical.
- **Palette:** Off-white cream (`#F6F3EE`), warm sage green (`#5C7A6E`), terracotta accent (`#C4654A`), near-black ink (`#1A1A18`). Medical-adjacent but warm.
- **Layout principle:** Content breathes. No element competes. The dual-panel card on the landing page is the visual centrepiece — it earns its contrast.
