/**
 * Workflow Observer Skill - Token usage tracking, phase activity monitoring, and performance analytics
 */

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number; // Estimated cost in USD
  model: string;
  timestamp: Date;
}

export interface PhaseActivity {
  phase: RAGPhase;
  startTime: Date;
  endTime?: Date;
  duration?: number; // milliseconds
  status: "running" | "completed" | "failed";
  tokenUsage?: TokenUsage;
  metadata: Record<string, any>;
  error?: string;
}

export interface IssueMetrics {
  issueId: string;
  startTime: Date;
  endTime?: Date;
  totalDuration?: number;
  phases: PhaseActivity[];
  totalTokens: number;
  totalCost: number;
  status: "running" | "completed" | "failed";
  qualityGateResults: QualityGateResult[];
}

export interface QualityGateResult {
  gate: string;
  passed: boolean;
  message: string;
  timestamp: Date;
  metrics?: Record<string, number>;
}

export interface AgentMetrics {
  agentId: string;
  phase: RAGPhase;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  success: boolean;
  tokensUsed: number;
  cost: number;
  error?: string;
}

export interface HandoffMetrics {
  fromAgent: string;
  toAgent: string;
  phase: RAGPhase;
  dataSize: number;
  timestamp: Date;
  latency: number;
}

export interface MultiAgentMetrics {
  totalHandoffs: number;
  agentPerformance: Map<
    string,
    {
      invocations: number;
      successRate: number;
      avgDuration: number;
      avgTokens: number;
      avgCost: number;
    }
  >;
  handoffHistory: HandoffMetrics[];
}

export type RAGPhase =
  | "retrieve"
  | "augment"
  | "generate"
  | "validate"
  | "test"
  | "deploy";

export interface WorkflowMetrics {
  startTime: Date;
  totalIssues: number;
  completedIssues: number;
  failedIssues: number;
  totalTokens: number;
  totalCost: number;
  averageIssueTime: number;
  issueMetrics: Map<string, IssueMetrics>;
  phasePerformance: Map<
    RAGPhase,
    {
      count: number;
      avgDuration: number;
      avgTokens: number;
      avgCost: number;
    }
  >;
}

export class WorkflowObserver {
  private workflowMetrics: WorkflowMetrics;
  private currentIssue: IssueMetrics | null = null;
  private currentPhase: PhaseActivity | null = null;
  private currentAgent: AgentMetrics | null = null;
  private multiAgentMetrics: MultiAgentMetrics;
  private alertThresholds: {
    maxTokensPerPhase: number;
    maxCostPerIssue: number;
    maxDurationPerIssue: number; // minutes
  };

  constructor() {
    this.workflowMetrics = {
      startTime: new Date(),
      totalIssues: 0,
      completedIssues: 0,
      failedIssues: 0,
      totalTokens: 0,
      totalCost: 0,
      averageIssueTime: 0,
      issueMetrics: new Map(),
      phasePerformance: new Map(),
    };

    this.alertThresholds = {
      maxTokensPerPhase: 50000, // Alert if a single phase uses >50k tokens
      maxCostPerIssue: 5.0, // Alert if an issue costs >$5
      maxDurationPerIssue: 15, // Alert if an issue takes >15 minutes
    };

    this.multiAgentMetrics = {
      totalHandoffs: 0,
      agentPerformance: new Map([
        [
          "retrieve",
          {
            invocations: 0,
            successRate: 0,
            avgDuration: 0,
            avgTokens: 0,
            avgCost: 0,
          },
        ],
        [
          "generate",
          {
            invocations: 0,
            successRate: 0,
            avgDuration: 0,
            avgTokens: 0,
            avgCost: 0,
          },
        ],
        [
          "validate",
          {
            invocations: 0,
            successRate: 0,
            avgDuration: 0,
            avgTokens: 0,
            avgCost: 0,
          },
        ],
        [
          "test",
          {
            invocations: 0,
            successRate: 0,
            avgDuration: 0,
            avgTokens: 0,
            avgCost: 0,
          },
        ],
      ]),
      handoffHistory: [],
    };

    this.initializePhasePerformance();
  }

  private initializePhasePerformance(): void {
    const phases: RAGPhase[] = [
      "retrieve",
      "augment",
      "generate",
      "validate",
      "test",
      "deploy",
    ];
    for (const phase of phases) {
      this.workflowMetrics.phasePerformance.set(phase, {
        count: 0,
        avgDuration: 0,
        avgTokens: 0,
        avgCost: 0,
      });
    }
  }

  /**
   * Start monitoring a new issue
   */
  startIssue(issueId: string): void {
    console.log(`📊 [Observer] Starting monitoring for ${issueId}`);

    this.currentIssue = {
      issueId,
      startTime: new Date(),
      phases: [],
      totalTokens: 0,
      totalCost: 0,
      status: "running",
      qualityGateResults: [],
    };

    this.workflowMetrics.totalIssues++;
    this.workflowMetrics.issueMetrics.set(issueId, this.currentIssue);
  }

  /**
   * Start monitoring a RAG phase
   */
  startPhase(phase: RAGPhase, metadata: Record<string, any> = {}): void {
    if (!this.currentIssue) {
      throw new Error("Cannot start phase without an active issue");
    }

    console.log(`📊 [Observer] Starting phase: ${phase}`);

    this.currentPhase = {
      phase,
      startTime: new Date(),
      status: "running",
      metadata,
    };

    this.currentIssue.phases.push(this.currentPhase);
  }

  /**
   * Update agent performance metrics
   */
  private updateAgentPerformance(agent: AgentMetrics): void {
    const existing = this.multiAgentMetrics.agentPerformance.get(agent.agentId);
    if (!existing) {
      this.multiAgentMetrics.agentPerformance.set(agent.agentId, {
        invocations: 1,
        successRate: agent.success ? 100 : 0,
        avgDuration: agent.duration || 0,
        avgTokens: agent.tokensUsed,
        avgCost: agent.cost,
      });
      return;
    }

    const newInvocations = existing.invocations + 1;
    const successCount =
      Math.round((existing.successRate * existing.invocations) / 100) +
      (agent.success ? 1 : 0);

    existing.invocations = newInvocations;
    existing.successRate = (successCount / newInvocations) * 100;
    existing.avgDuration =
      (existing.avgDuration * (newInvocations - 1) + (agent.duration || 0)) /
      newInvocations;
    existing.avgTokens =
      (existing.avgTokens * (newInvocations - 1) + agent.tokensUsed) /
      newInvocations;
    existing.avgCost =
      (existing.avgCost * (newInvocations - 1) + agent.cost) / newInvocations;
  }

  /**
   * Get multi-agent metrics
   */
  getMultiAgentMetrics(): MultiAgentMetrics {
    return {
      totalHandoffs: this.multiAgentMetrics.totalHandoffs,
      agentPerformance: new Map(this.multiAgentMetrics.agentPerformance),
      handoffHistory: [...this.multiAgentMetrics.handoffHistory],
    };
  }

  /**
   * Start tracking an agent within a phase
   */
  startAgent(
    agentId: string,
    phase: RAGPhase,
    metadata?: Record<string, any>,
  ): void {
    if (this.currentAgent) {
      console.warn(
        `📊 [Observer] Agent ${this.currentAgent.agentId} still running, force completing`,
      );
      this.endAgent(false, "Interrupted by new agent");
    }

    this.currentAgent = {
      agentId,
      phase,
      startTime: new Date(),
      success: false,
      tokensUsed: 0,
      cost: 0,
    };

    console.log(`🤖 [Observer] Started agent: ${agentId} for phase: ${phase}`);
  }

  /**
   * Complete agent tracking
   */
  endAgent(success: boolean, error?: string): void {
    if (!this.currentAgent) {
      console.warn("📊 [Observer] Cannot end agent - no active agent");
      return;
    }

    this.currentAgent.endTime = new Date();
    this.currentAgent.duration =
      this.currentAgent.endTime.getTime() -
      this.currentAgent.startTime.getTime();
    this.currentAgent.success = success;
    this.currentAgent.error = error;

    // Update agent performance metrics
    this.updateAgentPerformance(this.currentAgent);

    console.log(
      `🤖 [Observer] ${success ? "✅" : "❌"} Agent ${this.currentAgent.agentId} ${success ? "completed" : "failed"} (${this.currentAgent.duration}ms)`,
    );

    this.currentAgent = null;
  }

  /**
   * Record handoff between agents
   */
  recordHandoff(
    fromAgent: string,
    toAgent: string,
    phase: RAGPhase,
    dataSize: number,
  ): void {
    const handoff: HandoffMetrics = {
      fromAgent,
      toAgent,
      phase,
      dataSize,
      timestamp: new Date(),
      latency: 0, // Will be updated when toAgent starts
    };

    this.multiAgentMetrics.handoffHistory.push(handoff);
    this.multiAgentMetrics.totalHandoffs++;

    // Keep only last 50 handoffs
    if (this.multiAgentMetrics.handoffHistory.length > 50) {
      this.multiAgentMetrics.handoffHistory =
        this.multiAgentMetrics.handoffHistory.slice(-50);
    }

    console.log(
      `🔄 [Observer] Handoff: ${fromAgent} → ${toAgent} (${dataSize} bytes)`,
    );
  }

  /**
   * Record agent token usage
   */
  recordAgentTokens(
    inputTokens: number,
    outputTokens: number,
    model: string = "claude-3-sonnet",
  ): void {
    if (!this.currentAgent) {
      console.warn(
        "📊 [Observer] Cannot record agent tokens - no active agent",
      );
      return;
    }

    const totalTokens = inputTokens + outputTokens;
    const cost = this.calculateCost(inputTokens, outputTokens, model);

    this.currentAgent.tokensUsed = totalTokens;
    this.currentAgent.cost = cost;

    // Also record through existing system
    this.recordTokenUsage(inputTokens, outputTokens, model);

    console.log(
      `📊 [Observer] Agent ${this.currentAgent.agentId}: ${totalTokens} tokens, $${cost.toFixed(4)}`,
    );
  }
  recordTokenUsage(
    inputTokens: number,
    outputTokens: number,
    model: string = "claude-3-sonnet",
  ): void {
    if (!this.currentPhase) {
      console.warn("📊 [Observer] Cannot record tokens - no active phase");
      return;
    }

    const totalTokens = inputTokens + outputTokens;
    const cost = this.calculateCost(inputTokens, outputTokens, model);

    const tokenUsage: TokenUsage = {
      inputTokens,
      outputTokens,
      totalTokens,
      cost,
      model,
      timestamp: new Date(),
    };

    this.currentPhase.tokenUsage = tokenUsage;

    // Update current issue totals
    if (this.currentIssue) {
      this.currentIssue.totalTokens += totalTokens;
      this.currentIssue.totalCost += cost;
    }

    // Update workflow totals
    this.workflowMetrics.totalTokens += totalTokens;
    this.workflowMetrics.totalCost += cost;

    // Check for alerts
    this.checkTokenAlert(totalTokens, cost);

    console.log(
      `📊 [Observer] Tokens: ${inputTokens}→${outputTokens} (${totalTokens} total, $${cost.toFixed(4)})`,
    );
  }

  private calculateCost(
    inputTokens: number,
    outputTokens: number,
    model: string,
  ): number {
    // Pricing per 1K tokens (as of 2024)
    const pricing: Record<string, { input: number; output: number }> = {
      "claude-3-sonnet": { input: 0.003, output: 0.015 },
      "claude-3-haiku": { input: 0.00025, output: 0.00125 },
      "gpt-4": { input: 0.03, output: 0.06 },
      "gpt-3.5-turbo": { input: 0.001, output: 0.002 },
    };

    const rates = pricing[model] || pricing["claude-3-sonnet"];
    return (
      (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output
    );
  }

  private checkTokenAlert(tokens: number, cost: number): void {
    if (tokens > this.alertThresholds.maxTokensPerPhase) {
      console.warn(
        `🚨 [Observer] High token usage: ${tokens} tokens in single phase`,
      );
    }

    if (
      this.currentIssue &&
      this.currentIssue.totalCost > this.alertThresholds.maxCostPerIssue
    ) {
      console.warn(
        `🚨 [Observer] High cost issue: $${this.currentIssue.totalCost.toFixed(2)} for ${this.currentIssue.issueId}`,
      );
    }
  }

  /**
   * End the current phase
   */
  endPhase(status: "completed" | "failed" = "completed", error?: string): void {
    if (!this.currentPhase) {
      console.warn("📊 [Observer] Cannot end phase - no active phase");
      return;
    }

    this.currentPhase.endTime = new Date();
    this.currentPhase.duration =
      this.currentPhase.endTime.getTime() -
      this.currentPhase.startTime.getTime();
    this.currentPhase.status = status;

    if (error) {
      this.currentPhase.error = error;
    }

    // Update phase performance metrics
    this.updatePhasePerformance(this.currentPhase);

    console.log(
      `📊 [Observer] Completed phase: ${this.currentPhase.phase} (${this.currentPhase.duration}ms)`,
    );

    this.currentPhase = null;
  }

  private updatePhasePerformance(phase: PhaseActivity): void {
    const perf = this.workflowMetrics.phasePerformance.get(phase.phase)!;

    // Update running averages
    perf.count++;
    perf.avgDuration =
      (perf.avgDuration * (perf.count - 1) + (phase.duration || 0)) /
      perf.count;

    if (phase.tokenUsage) {
      perf.avgTokens =
        (perf.avgTokens * (perf.count - 1) + phase.tokenUsage.totalTokens) /
        perf.count;
      perf.avgCost =
        (perf.avgCost * (perf.count - 1) + phase.tokenUsage.cost) / perf.count;
    }
  }

  /**
   * Record quality gate results
   */
  recordQualityGate(
    gate: string,
    passed: boolean,
    message: string,
    metrics?: Record<string, number>,
  ): void {
    if (!this.currentIssue) {
      console.warn(
        "📊 [Observer] Cannot record quality gate - no active issue",
      );
      return;
    }

    const result: QualityGateResult = {
      gate,
      passed,
      message,
      timestamp: new Date(),
      metrics,
    };

    this.currentIssue.qualityGateResults.push(result);

    const status = passed ? "✅" : "❌";
    console.log(`📊 [Observer] Quality Gate ${status} ${gate}: ${message}`);
  }

  /**
   * End the current issue
   */
  endIssue(status: "completed" | "failed" = "completed"): void {
    if (!this.currentIssue) {
      console.warn("📊 [Observer] Cannot end issue - no active issue");
      return;
    }

    this.currentIssue.endTime = new Date();
    this.currentIssue.totalDuration =
      this.currentIssue.endTime.getTime() -
      this.currentIssue.startTime.getTime();
    this.currentIssue.status = status;

    // Update workflow metrics
    if (status === "completed") {
      this.workflowMetrics.completedIssues++;
    } else {
      this.workflowMetrics.failedIssues++;
    }

    // Update average issue time
    const completedMetrics = Array.from(
      this.workflowMetrics.issueMetrics.values(),
    ).filter((m) => m.status === "completed" && m.totalDuration);

    this.workflowMetrics.averageIssueTime =
      completedMetrics.length > 0
        ? completedMetrics.reduce((sum, m) => sum + (m.totalDuration || 0), 0) /
          completedMetrics.length
        : 0;

    // Check duration alert
    const durationMinutes =
      (this.currentIssue.totalDuration || 0) / (1000 * 60);
    if (durationMinutes > this.alertThresholds.maxDurationPerIssue) {
      console.warn(
        `🚨 [Observer] Slow issue: ${this.currentIssue.issueId} took ${durationMinutes.toFixed(1)} minutes`,
      );
    }

    console.log(
      `📊 [Observer] Completed issue: ${this.currentIssue.issueId} (${durationMinutes.toFixed(1)}min, ${this.currentIssue.totalTokens} tokens, $${this.currentIssue.totalCost.toFixed(4)})`,
    );

    this.currentIssue = null;
  }

  /**
   * Get current workflow snapshot for dashboard
   */
  getWorkflowSnapshot(): {
    overview: {
      totalIssues: number;
      completedIssues: number;
      failedIssues: number;
      successRate: number;
      totalCost: number;
      totalTokens: number;
      averageIssueTime: number; // minutes
      estimatedCompletion?: Date;
    };
    currentIssue?: {
      issueId: string;
      currentPhase?: RAGPhase;
      elapsedTime: number; // minutes
      tokensUsed: number;
      costSoFar: number;
    };
    phasePerformance: Array<{
      phase: RAGPhase;
      count: number;
      avgDuration: number; // seconds
      avgTokens: number;
      avgCost: number;
    }>;
    recentIssues: Array<{
      issueId: string;
      status: string;
      duration: number; // minutes
      tokens: number;
      cost: number;
      completedAt: Date;
    }>;
    alerts: string[];
  } {
    const successRate =
      this.workflowMetrics.totalIssues > 0
        ? (this.workflowMetrics.completedIssues /
            this.workflowMetrics.totalIssues) *
          100
        : 0;

    // Estimate completion time
    const remainingIssues =
      this.workflowMetrics.totalIssues -
      this.workflowMetrics.completedIssues -
      this.workflowMetrics.failedIssues;
    const estimatedCompletion =
      this.workflowMetrics.averageIssueTime > 0 && remainingIssues > 0
        ? new Date(
            Date.now() +
              remainingIssues * this.workflowMetrics.averageIssueTime,
          )
        : undefined;

    // Current issue info
    const currentIssue = this.currentIssue
      ? {
          issueId: this.currentIssue.issueId,
          currentPhase: this.currentPhase?.phase,
          elapsedTime:
            (Date.now() - this.currentIssue.startTime.getTime()) / (1000 * 60),
          tokensUsed: this.currentIssue.totalTokens,
          costSoFar: this.currentIssue.totalCost,
        }
      : undefined;

    // Phase performance
    const phasePerformance = Array.from(
      this.workflowMetrics.phasePerformance.entries(),
    ).map(([phase, perf]) => ({
      phase,
      count: perf.count,
      avgDuration: perf.avgDuration / 1000, // Convert to seconds
      avgTokens: perf.avgTokens,
      avgCost: perf.avgCost,
    }));

    // Recent issues (last 5 completed)
    const recentIssues = Array.from(this.workflowMetrics.issueMetrics.values())
      .filter((m) => m.status !== "running" && m.endTime)
      .sort((a, b) => b.endTime!.getTime() - a.endTime!.getTime())
      .slice(0, 5)
      .map((m) => ({
        issueId: m.issueId,
        status: m.status,
        duration: (m.totalDuration || 0) / (1000 * 60), // minutes
        tokens: m.totalTokens,
        cost: m.totalCost,
        completedAt: m.endTime!,
      }));

    // Generate alerts
    const alerts: string[] = [];
    if (successRate < 80 && this.workflowMetrics.totalIssues >= 5) {
      alerts.push(`Low success rate: ${successRate.toFixed(1)}%`);
    }
    if (this.workflowMetrics.totalCost > 50) {
      alerts.push(
        `High total cost: $${this.workflowMetrics.totalCost.toFixed(2)}`,
      );
    }

    return {
      overview: {
        totalIssues: this.workflowMetrics.totalIssues,
        completedIssues: this.workflowMetrics.completedIssues,
        failedIssues: this.workflowMetrics.failedIssues,
        successRate,
        totalCost: this.workflowMetrics.totalCost,
        totalTokens: this.workflowMetrics.totalTokens,
        averageIssueTime: this.workflowMetrics.averageIssueTime / (1000 * 60), // Convert to minutes
        estimatedCompletion,
      },
      currentIssue,
      phasePerformance,
      recentIssues,
      alerts,
    };
  }

  /**
   * Export detailed metrics for analysis
   */
  exportMetrics(): {
    workflow: WorkflowMetrics;
    issues: IssueMetrics[];
    phases: PhaseActivity[];
  } {
    const allIssues = Array.from(this.workflowMetrics.issueMetrics.values());
    const allPhases = allIssues.flatMap((issue) => issue.phases);

    return {
      workflow: this.workflowMetrics,
      issues: allIssues,
      phases: allPhases,
    };
  }

  /**
   * Reset all metrics (for testing)
   */
  reset(): void {
    this.workflowMetrics = {
      startTime: new Date(),
      totalIssues: 0,
      completedIssues: 0,
      failedIssues: 0,
      totalTokens: 0,
      totalCost: 0,
      averageIssueTime: 0,
      issueMetrics: new Map(),
      phasePerformance: new Map(),
    };
    this.initializePhasePerformance();
    this.currentIssue = null;
    this.currentPhase = null;
  }
}
