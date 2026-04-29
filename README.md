# LocalStay RAG Multi-Agent System

A sophisticated multi-agent RAG (Retrieve-Augment-Generate) workflow system for automating LocalStay MVP development using specialized AI agents.

## Architecture

The system uses **specialized agents** coordinated by a central orchestrator:

```
🎯 RAG Coordinator
├── 🔍 Retrieve Agent   - Context retrieval specialist
├── ⚡ Generate Agent   - Code generation specialist
├── ✅ Validate Agent   - Quality assurance specialist
└── 🧪 Test Agent       - Testing specialist
```

## Quick Start

```bash
# Run complete multi-agent workflow
node rag-workflow.js start

# Test single issue
node rag-workflow.js test-issue ISSUE-001

# Generate dashboard
node rag-workflow.js dashboard

# Check system status
node rag-workflow.js status
```

## Project Structure

```
.github/
├── copilot-instructions.md     # LocalStay project context
└── agents/                     # Specialized agent configurations
    ├── retrieve.agent.md       # Context retrieval agent
    ├── generate.agent.md       # Code generation agent
    ├── validate.agent.md       # Quality validation agent
    └── test.agent.md          # Testing agent

workflow/
├── coordinator.ts             # Multi-agent orchestrator
├── observer.ts               # Enhanced monitoring & metrics
├── issue-queue.ts           # Issue management
└── dashboard-generator.ts   # Real-time dashboard

localstay-mvp-issues.md      # 43 issues across 12 epics
rag-workflow.js             # Main entry point
monitoring/                 # Dashboard output
```

## Multi-Agent Workflow

1. **🔍 Retrieve Phase**: Agent searches for relevant code patterns and context
2. **⚡ Generate Phase**: Agent creates NestJS/Vue/Prisma code based on context
3. **✅ Validate Phase**: Agent runs quality gates (lint, typecheck, build)
4. **🧪 Test Phase**: Agent executes comprehensive testing

Each phase has:

- ✅ Specialized agent with focused expertise
- 🔄 Automatic handoffs with data validation
- 📊 Complete observability and metrics
- 🔁 Retry logic with progressive delays
- 💰 Token usage and cost tracking

## LocalStay Business Context

**Technology Stack:**

- Backend: NestJS + TypeScript + PostgreSQL (Prisma)
- Frontend: Vue 3 + Vuetify 3 + Composition API
- Architecture: Monorepo (frontend/ + backend/)

**Key Entities:**

- Properties (homestay locations)
- Rooms (bookable units)
- Bookings (guest reservations)
- Users (managers, staff, guests)

## Monitoring

Real-time dashboard available at `monitoring/dashboard.html` showing:

- Agent performance metrics
- Token usage and costs
- Issue processing progress
- Quality gate results
- System alerts and warnings

## Development

The system is designed for **orchestration**, not implementation. Each agent:

- Has a single, focused responsibility
- Integrates with VS Code agents or external AI services
- Provides structured handoffs to the next agent
- Maintains full observability through the enhanced observer

This approach enables easy extension, better reliability, and clear separation of concerns compared to monolithic processors.
D --> E[Validate Quality]
E --> F[Run Tests]
F --> G[Deploy/Next Issue]

    H[Observer] --> I[Track Tokens]
    H --> J[Monitor Performance]
    H --> K[Generate Dashboard]

````

## 📋 LocalStay MVP Issues

**Target Project:** Full-stack property management system
- **Backend:** NestJS + Prisma + PostgreSQL (Supabase)
- **Frontend:** Vue 3 + Vuetify + TypeScript
- **Deployment:** Railway (backend) + Cloudflare Pages (frontend)

**Issue Breakdown:**
- **EP-01** Project Setup & Infrastructure (5 issues, 10 SP)
- **EP-02** Auth & User Management (4 issues, 9 SP)
- **EP-03** Property & Room Management (4 issues, 9 SP)
- **EP-04** Availability Calendar (2 issues, 8 SP)
- **EP-05** Booking Management (4 issues, 13 SP)
- **EP-06** Front Desk Operations (4 issues, 10 SP)
- **EP-07** Payment Integration (4 issues, 12 SP)
- **EP-08** Messaging & Notifications (3 issues, 8 SP)
- **EP-09** Public Guest Booking (2 issues, 7 SP)
- **EP-10** Revenue Dashboard (2 issues, 4 SP)
- **EP-11** Polish & Testing (6 issues, 14 SP)
- **EP-12** Launch & Deployment (3 issues, 6 SP)

**Total:** 43 issues, 110 story points, 8-week timeline

## 🚀 Quick Start

### 1. Check System Status
```bash
node rag-workflow.js status
````

### 2. Generate Monitoring Dashboard

```bash
node rag-workflow.js dashboard
```

### 3. Start Complete RAG Workflow

```bash
node rag-workflow.js start
```

### 4. Test Single Issue (Optional)

```bash
node rag-workflow.js test-issue ISSUE-001
```

## 📊 Real-Time Monitoring

**Dashboard Features:**

- **Token Usage Tracking** - Monitor AI API costs per phase
- **Performance Metrics** - Issue processing times and bottlenecks
- **Quality Gates** - Lint, test, and build validation results
- **Progress Overview** - Completion percentage and ETA
- **Cost Analytics** - Real-time cost tracking with alerts
- **Phase Breakdown** - Performance metrics per RAG phase

**Access Dashboard:**
Open `monitoring/dashboard.html` in your browser for live updates.

## 🔧 RAG Workflow Phases

### Phase 1: Retrieve Context

- Semantic search across existing codebase
- Dependency analysis and pattern matching
- Template and example identification
- **Token usage:** ~2,500 input, ~1,200 output

### Phase 2: Augment Context

- AI-enhanced context analysis
- Cross-reference patterns and best practices
- Generate implementation strategy
- **Token usage:** ~4,200 input, ~2,800 output

### Phase 3: Generate Code

- AI-assisted code generation using templates
- Framework-specific implementation (NestJS/Vue)
- Multi-file generation with proper structure
- **Token usage:** ~5,800 input, ~4,200 output

### Phase 4: Validate Quality

- **Lint Checks** - ESLint + TypeScript validation
- **Type Checking** - Full TypeScript compilation
- **Build Validation** - Successful build verification
- **Quality Gates** - Automated pass/fail criteria

### Phase 5: Test & Deploy

- **Unit Tests** - Component-level validation
- **Integration Tests** - API endpoint testing
- **E2E Tests** - Full user flow validation
- **Coverage Validation** - Minimum 80% coverage requirement

## 💰 Cost Management

**Monitoring & Alerts:**

- **Per-issue cost limit:** $5.00 USD
- **Total workflow limit:** $100.00 USD
- **Token usage tracking** across all RAG phases
- **Real-time alerts** for high usage patterns

**Expected Costs (43 issues):**

- **Estimated total:** $35-60 USD
- **Average per issue:** $0.80-1.40 USD
- **Token efficiency:** ~8,400 tokens per issue

## 🧪 Quality Gates

**Automated Validation:**

- ✅ **Zero lint errors** required to proceed
- ✅ **Minimum 80% test coverage** required
- ✅ **Successful build** required for deployment
- ✅ **All tests passing** before next issue
- ⚡ **Maximum 15 minutes** per issue processing

**Rollback System:**

- Git-based automatic rollback on failure
- Clean state restoration for retry attempts
- Manual intervention points for complex issues

## 📁 Generated Output

**Expected Code Generation:**

- **Backend modules:** Controllers, services, DTOs, guards
- **Frontend components:** Pages, forms, layouts, routing
- **Database schemas:** Prisma models, migrations, seeds
- **Configuration files:** Environment, Docker, CI/CD
- **Test files:** Unit tests, integration tests, E2E tests

**File Structure:**

```
LocalStay-MVP/
├── backend/
│   ├── src/auth/           # Authentication module
│   ├── src/bookings/       # Booking management
│   ├── src/payments/       # Payment processing
│   └── prisma/schema.prisma # Database models
├── frontend/
│   ├── src/pages/          # Vue pages
│   ├── src/components/     # Reusable components
│   └── src/stores/         # Pinia stores
└── .github/workflows/      # CI/CD pipeline
```

## 🔍 Troubleshooting

### Common Issues

**High token usage:**

```bash
# Check token usage breakdown
node rag-workflow.js status
# Review dashboard for cost analytics
open monitoring/dashboard.html
```

**Quality gate failures:**

```bash
# Run validation manually
node validate-workflow.js
# Check specific issue logs
tail -f workflow-logs.txt
```

**Context retrieval issues:**

```bash
# Rebuild RAG index
rm -rf context-db/
node rag-workflow.js start
```

## 📈 Success Metrics

**Validation Results:** ✅ All systems operational

- **7/7 validation tests passed**
- **All 43 issues parsed successfully**
- **Dependency graph validated** (no circular dependencies)
- **Quality gates configured** and tested
- **Monitoring dashboard** fully functional

**Ready for Production:**

- 🎯 Process 43 LocalStay MVP issues automatically
- 📊 Real-time monitoring and cost tracking
- 🔧 Quality gates and automated validation
- 🚀 Full-stack TypeScript code generation
- ⚡ Estimated completion: 8-12 hours total

---

**🎉 RAG Workflow System Ready!**

Start your LocalStay MVP development journey:

```bash
node rag-workflow.js start
```

Monitor progress at: **monitoring/dashboard.html**
