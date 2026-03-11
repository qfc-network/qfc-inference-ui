# CLAUDE.md — QFC Inference UI

## Project Overview

QFC Inference UI is the frontend for the QFC decentralized AI inference marketplace. Users submit inference tasks (text prompts) to on-chain AI models, miners pick up and execute tasks, and results are delivered with cryptographic proofs. This app is the primary interface for task submission, miner leaderboards, model browsing, and user profile management on the QFC testnet.

**Live at:** inference.testnet.qfc.network

## Tech Stack

- **Framework:** Next.js 14 (App Router) with React 18
- **Language:** TypeScript 5.3 (strict mode)
- **Styling:** Tailwind CSS 3.4 (dark theme, custom `qfc.cyan`/`qfc.blue` colors)
- **Web3:** ethers.js 6 (MetaMask wallet, contract calls)
- **Linting:** ESLint with next/core-web-vitals
- **Port:** 3270 (dev and production)

## Commands

```bash
npm run dev        # Dev server on localhost:3270
npm run build      # Production build (standalone output)
npm start          # Serve production build on port 3270
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

No test framework is configured yet.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (Navbar, Footer, WalletProvider)
│   ├── page.tsx            # Home — submit task + live feed
│   ├── globals.css         # Tailwind directives, custom scrollbar, gradients
│   ├── tasks/page.tsx      # Task feed with filters & detail modal
│   ├── models/page.tsx     # Model cards grid
│   ├── miners/page.tsx     # Miner leaderboard with tier filters & profile modal
│   └── profile/page.tsx    # User dashboard, task history, miner registration
├── components/             # Reusable UI components
│   ├── Navbar.tsx          # Top nav with mobile menu
│   ├── Footer.tsx          # Footer links (Explorer, Faucet, Docs, GitHub)
│   ├── WalletConnect.tsx   # Connect/disconnect wallet button
│   ├── SubmitTaskForm.tsx  # Inference task submission form
│   ├── ModelCard.tsx       # Model display card
│   ├── StatsCard.tsx       # Generic stats display
│   ├── LiveFeed.tsx        # Tasks table
│   ├── TaskStatusBadge.tsx # Colored status pill
│   └── MinerBadge.tsx      # Tier + address badge
├── hooks/                  # Custom React hooks (data fetching)
│   ├── useTasks.ts         # Tasks with filters + auto-refresh
│   ├── useModels.ts        # Models list
│   └── useMiners.ts        # Miners with tier filter
├── lib/                    # Utilities and config
│   ├── types.ts            # TypeScript interfaces (Task, Miner, Model, enums)
│   ├── constants.ts        # RPC URL, chain ID, contract addresses, chain config
│   ├── contracts.ts        # ABIs + contract factory helpers (ethers.js)
│   ├── format.ts           # shortenAddress, formatQfc, formatTimeAgo, tierLabel
│   └── mock-data.ts        # Mock tasks/models/miners (placeholder until contracts live)
├── providers/
│   └── WalletProvider.tsx  # React context for wallet state (MetaMask)
└── types/
    └── global.d.ts         # Window.ethereum type augmentation
```

## Key Files

- **`src/lib/constants.ts`** — Contract addresses, RPC URL, chain config. Update here when contracts are deployed.
- **`src/lib/contracts.ts`** — ABIs and `getTaskRegistry()`, `getMinerRegistry()`, `getModelRegistry()` helpers. This is where on-chain reads/writes are wired up.
- **`src/lib/mock-data.ts`** — All hooks currently return mock data. Replace with real contract calls when contracts are deployed.
- **`src/providers/WalletProvider.tsx`** — Wallet connection logic, chain switching, account change listeners.
- **`src/lib/types.ts`** — Core data types. TaskStatus enum: Pending → Assigned → Completed | Failed | Cancelled.

## Environment Variables

All prefixed `NEXT_PUBLIC_` (client-side accessible). Defined in `.env.local`:

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_RPC_URL` | QFC testnet RPC endpoint | `https://rpc.testnet.qfc.network` |
| `NEXT_PUBLIC_CHAIN_ID` | Chain ID | `9000` |
| `NEXT_PUBLIC_TASK_REGISTRY_ADDRESS` | TaskRegistry contract | `0x000...` (placeholder) |
| `NEXT_PUBLIC_MINER_REGISTRY_ADDRESS` | MinerRegistry contract | `0x000...` (placeholder) |
| `NEXT_PUBLIC_MODEL_REGISTRY_ADDRESS` | ModelRegistry contract | `0x000...` (placeholder) |
| `NEXT_PUBLIC_FEE_ESCROW_ADDRESS` | FeeEscrow contract | `0x000...` (placeholder) |

## Adding New Pages

1. Create `src/app/<route>/page.tsx` — add `'use client'` directive for interactive pages
2. Wrap in `<Suspense>` if needed (see existing pages)
3. Add nav link in `src/components/Navbar.tsx`
4. Use existing components from `src/components/` and hooks from `src/hooks/`

## Adding New Components

1. Create in `src/components/<Name>.tsx` with `'use client'` if interactive
2. Use Tailwind classes — follow dark theme conventions: `bg-gray-950`, `bg-gray-900`, `border-gray-800`, `text-white`
3. Accent colors: `cyan-400`/`cyan-500` and `blue-500`/`blue-600` gradients

## Contract Integration

Four smart contracts power the marketplace:

| Contract | Key Functions | Purpose |
|---|---|---|
| **TaskRegistry** | `submitTask()`, `cancelTask()`, `getTask()`, `nextTaskId` | Submit and track inference tasks |
| **MinerRegistry** | `registerMiner()`, `getMiner()`, `minerCount` | Miner registration and lookup |
| **ModelRegistry** | `getModel()`, `modelCount`, `getBaseFee()` | Available AI models and pricing |
| **FeeEscrow** | `getEscrow()` | Fee management for task payments |

**Pattern:** `src/lib/contracts.ts` exports factory functions like `getTaskRegistry(signerOrProvider)` that return typed ethers.js Contract instances. Currently, hooks in `src/hooks/` return mock data — look for TODO comments marking where to wire in real contract calls.

**Wallet flow:** MetaMask → `BrowserProvider` → signer → contract call. Chain auto-switching to QFC testnet (chain ID 0x2328) is handled by `WalletProvider`.

## Deployment

- **Docker:** Multi-stage build (`node:20-alpine`). Next.js standalone output. Exposes port 3270.
- **CI/CD:** GitHub Actions (`.github/workflows/docker.yml`) triggers on push to `staging` branch or `v*` tags.
- **Registry:** Images pushed to `ghcr.io` (multi-platform: amd64 + arm64).
- **Post-build:** Dispatches webhook to `qfc-testnet` repo to trigger deployment.
- **URL:** inference.testnet.qfc.network

Build locally: `docker build -t qfc-inference-ui .`

## Gotchas

- **Mock data everywhere:** Hooks return mock data from `src/lib/mock-data.ts`. Contract addresses are all zeros. This is intentional until contracts are deployed on testnet.
- **No test suite:** No testing framework configured. Add vitest or jest if needed.
- **Path alias:** Use `@/` imports (maps to `src/`). Configured in `tsconfig.json`.
- **Port 3270:** Both dev and prod run on 3270, not the Next.js default 3000.
- **All pages are client-rendered:** Every page uses `'use client'` since they depend on wallet state and interactive features.
- **`next.config.js` uses `output: 'standalone'`:** Required for Docker deployment. Don't remove.
