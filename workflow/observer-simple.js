/**
 * Simplified Observer for testing
 */
export class WorkflowObserver {
  constructor() {
    this.workflowMetrics = {
      startTime: new Date(),
      totalIssues: 0,
      completedIssues: 0,
      failedIssues: 0,
      totalTokens: 0,
      totalCost: 0,
      averageIssueTime: 0,
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
    };

    this.currentIssue = null;
    this.currentAgent = null;
  }

  startIssue(issueId) {
    console.log(`📊 [Observer] Starting issue: ${issueId}`);
    this.currentIssue = {
      issueId,
      startTime: new Date(),
      totalTokens: 0,
      totalCost: 0,
      status: "running",
    };
  }

  endIssue(status) {
    if (this.currentIssue) {
      this.currentIssue.status = status;
      this.currentIssue.endTime = new Date();
      console.log(`📊 [Observer] Issue ${this.currentIssue.issueId} ${status}`);
    }
    this.currentIssue = null;
  }

  startPhase(phase, metadata) {
    console.log(`📊 [Observer] Starting phase: ${phase}`);
  }

  endPhase(status, error) {
    console.log(`📊 [Observer] Phase ${status}${error ? ": " + error : ""}`);
  }

  startAgent(agentId, phase) {
    this.currentAgent = {
      agentId,
      phase,
      startTime: new Date(),
      success: false,
      tokensUsed: 0,
      cost: 0,
    };
    console.log(`🤖 [Observer] Started agent: ${agentId}`);
  }

  endAgent(success, error) {
    if (this.currentAgent) {
      this.currentAgent.success = success;
      console.log(
        `🤖 [Observer] ${success ? "✅" : "❌"} Agent ${this.currentAgent.agentId} ${success ? "completed" : "failed"}`,
      );
    }
    this.currentAgent = null;
  }

  recordAgentTokens(inputTokens, outputTokens, model = "claude-3-sonnet") {
    if (this.currentAgent) {
      const totalTokens = inputTokens + outputTokens;
      const cost = this.calculateCost(inputTokens, outputTokens, model);
      this.currentAgent.tokensUsed = totalTokens;
      this.currentAgent.cost = cost;
      console.log(
        `📊 [Observer] Agent ${this.currentAgent.agentId}: ${totalTokens} tokens, $${cost.toFixed(4)}`,
      );
    }
  }

  recordHandoff(fromAgent, toAgent, phase, dataSize) {
    this.multiAgentMetrics.totalHandoffs++;
    console.log(`🔄 [Observer] Handoff: ${fromAgent} → ${toAgent}`);
  }

  calculateCost(inputTokens, outputTokens, model) {
    const pricing = {
      "claude-3-sonnet": { input: 0.003, output: 0.015 },
    };
    const rates = pricing[model] || pricing["claude-3-sonnet"];
    return (
      (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output
    );
  }

  getWorkflowSnapshot() {
    return {
      overview: {
        totalIssues: this.workflowMetrics.totalIssues,
        completedIssues: this.workflowMetrics.completedIssues,
        failedIssues: this.workflowMetrics.failedIssues,
        successRate:
          this.workflowMetrics.totalIssues > 0
            ? (this.workflowMetrics.completedIssues /
                this.workflowMetrics.totalIssues) *
              100
            : 0,
        totalCost: this.workflowMetrics.totalCost,
        totalTokens: this.workflowMetrics.totalTokens,
        averageIssueTime: this.workflowMetrics.averageIssueTime,
      },
    };
  }

  getMultiAgentMetrics() {
    return this.multiAgentMetrics;
  }
}
