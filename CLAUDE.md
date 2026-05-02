# LocalStay AI Orchestration

## Project Overview

LocalStay Manager — a homestay management platform (Vue 3 + NestJS + PostgreSQL/Supabase).

Issues are tracked in `localstay-mvp-issues.md`.
Agent personas are in `.github/agents/`.
Live events are appended to `.github/events.jsonl` (one JSON object per line).
Dashboard: `http://localhost:3333/workflow-dashboard.html` (run server from `.github/`)

---

## Event Log Format

Every action is appended to `.github/events.jsonl` as a single JSON line.

### Event Types

```jsonl
{"ts":"<ISO>","type":"orchestrator.start","issue":"ISSUE-001","title":"...","agents":["deploy-agent"],"agentLabels":{"deploy-agent":"Deploy / Infra"}}
{"ts":"<ISO>","type":"agent.start","agent":"deploy-agent","label":"Deploy / Infra","issue":"ISSUE-001"}
{"ts":"<ISO>","type":"agent.progress","agent":"deploy-agent","message":"Creating frontend scaffold..."}
{"ts":"<ISO>","type":"agent.file","agent":"deploy-agent","file":"frontend/package.json"}
{"ts":"<ISO>","type":"agent.done","agent":"deploy-agent","tokensIn":2100,"tokensOut":3800,"notes":"Monorepo scaffolded"}
{"ts":"<ISO>","type":"agent.error","agent":"deploy-agent","message":"npm not found"}
{"ts":"<ISO>","type":"orchestrator.done","issue":"ISSUE-001"}
{"ts":"<ISO>","type":"orchestrator.error","issue":"ISSUE-001","message":"..."}
```

**Always append — never overwrite** `.github/events.jsonl`.

To append an event, write it as a single line at the end of the file.

---

## Orchestration Commands

### `orchestrate start issue-<N>`

#### Step 1 — Parse the Issue

Read `localstay-mvp-issues.md`, find `ISSUE-00N`, extract:
- Title, description, tasks, acceptance criteria, labels

#### Step 2 — Classify Agents

| Label           | Agent        | Label string        |
|-----------------|--------------|---------------------|
| `[frontend]`    | fe-agent     | "Frontend"          |
| `[backend]`     | be-agent     | "Backend"           |
| `[database]`    | be-agent     | "Backend"           |
| `[devops]`      | deploy-agent | "Deploy / Infra"    |
| `[chore]`       | deploy-agent | "Deploy / Infra"    |
| `[integration]` | be-agent     | "Backend"           |

Deduplicate agents (two labels → same agent = run once).

Print plan to user:
```
📋 ISSUE-001 — <title>
🏷  Labels: [chore] [devops]
🤖 Agents: deploy-agent
```

#### Step 3 — Emit orchestrator.start

Append to `.github/events.jsonl`:
```json
{"ts":"<now ISO>","type":"orchestrator.start","issue":"ISSUE-001","title":"<title>","agents":["deploy-agent"],"agentLabels":{"deploy-agent":"Deploy / Infra"}}
```

#### Step 4 — Run Each Agent

For each agent in the plan:

**4a. Emit agent.start**
```json
{"ts":"<now ISO>","type":"agent.start","agent":"deploy-agent","label":"Deploy / Infra","issue":"ISSUE-001"}
```

**4b. Spawn the agent** via the Agent tool with this prompt:

```
You are <agent-name>.

<full content of .github/agents/<name>.agent.md>

---

## Your Task

Issue: ISSUE-<N> — <title>

**Description:** <description>

**Tasks:** <task checklist>

**Acceptance Criteria:** <criteria>

**Working directory:** /Users/npn/Documents/AI-Project/homestay

---

## Event Logging (REQUIRED)

As you work, append events to `.github/events.jsonl` after each significant action.
Each event is a single JSON line appended to the file. Use this exact format:

Progress update (before starting a task):
{"ts":"<ISO timestamp>","type":"agent.progress","agent":"<your-name>","message":"<what you are doing now>"}

File created or modified:
{"ts":"<ISO timestamp>","type":"agent.file","agent":"<your-name>","file":"<relative path from project root>"}

When done, append ONE final event:
{"ts":"<ISO timestamp>","type":"agent.done","agent":"<your-name>","tokensIn":<estimate>,"tokensOut":<estimate>,"notes":"<one line summary>"}

If you hit a fatal error, append:
{"ts":"<ISO timestamp>","type":"agent.error","agent":"<your-name>","message":"<error description>"}

Complete all tasks, write events as you go, then report back with:
DONE: <summary>
FILES: <comma-separated list>
TOKENS_IN: <estimate>
TOKENS_OUT: <estimate>
```

**4c. After agent returns**, parse its DONE/FILES/TOKENS report.
If the agent did NOT write its own `agent.done` event, append it yourself:
```json
{"ts":"<now ISO>","type":"agent.done","agent":"deploy-agent","tokensIn":2100,"tokensOut":3800,"notes":"<from agent report>"}
```

#### Step 5 — Emit orchestrator.done

```json
{"ts":"<now ISO>","type":"orchestrator.done","issue":"ISSUE-001"}
```

#### Step 6 — Report to User

Summarize: files built, acceptance criteria status, any follow-ups.

---

### `orchestrate monitor`

Confirm the dashboard server is running and print:
```
Dashboard → http://localhost:3333/workflow-dashboard.html
Events log → .github/events.jsonl (<N> events)
```

### `orchestrate status`

Read and summarize `.github/events.jsonl` — last run, agents, files created.

### `orchestrate clear`

Clear `.github/events.jsonl` (empty the file, keep it).
Use before starting a fresh set of issues.

---

## Task Creation Command

### `task-agent create: <description>`

When the user says `task-agent create: <requirement>`:

1. Read `.github/agents/task-agent.agent.md` to load the agent persona
2. Spawn it via the Agent tool with:
   - The full task-agent persona
   - The raw requirement from the user
   - Working directory: `/Users/npn/Documents/AI-Project/homestay`
3. The agent will:
   - Analyze labels, epic, story points, priority
   - Write a formatted issue block
   - Insert it at the correct position in `localstay-mvp-issues.md`
   - Append events to `.github/events.jsonl`
4. Report back the created issue summary to the user

---

## Orchestration Rules

1. **Append only** — never overwrite `events.jsonl`, only append lines
2. **Sequential by default** — one agent at a time
3. **Agents write their own events** — every agent must emit progress/file/done events as it works
4. **Orchestrator fills gaps** — if agent forgets to write `agent.done`, orchestrator writes it
5. **Context handoff** — pass be-agent's files list to fe-agent when be-agent runs first
6. **Acceptance criteria = exit condition**

---

## Agent Files

- `.github/agents/orchestrator.agent.md` — orchestrator persona
- `.github/agents/task-agent.agent.md` — create & prioritize issues in localstay-mvp-issues.md
- `.github/agents/fe-agent.agent.md` — Vue 3 + Vite + Vuetify frontend
- `.github/agents/be-agent.agent.md` — NestJS + Prisma backend
- `.github/agents/deploy-agent.agent.md` — Docker + CI/CD + infra

## Event & Dashboard Files

- `.github/events.jsonl` — append-only event log (source of truth)
- `.github/workflow-dashboard.html` — polls events.jsonl every 1s, no state file needed

---

## Tech Stack

- **Frontend**: Vue 3, Vite, Vuetify 3, TypeScript, Pinia, Vue Router
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Deploy**: Docker, GitHub Actions, DigitalOcean
- **Payments**: VNPay, MoMo
- **Notifications**: Zalo Business, SendGrid
