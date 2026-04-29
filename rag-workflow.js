#!/usr/bin/env node
/**
 * LocalStay RAG Multi-Agent Workflow System
 * Orchestrates specialized agents for automated MVP development
 *
 * Usage:
 *   node rag-workflow.js start                    # Start full workflow
 *   node rag-workflow.js status                   # Check status
 *   node rag-workflow.js dashboard                # Generate dashboard
 *   node rag-workflow.js test-issue ISSUE-001    # Test single issue
 */

import { IssueQueueManager } from "./workflow/issue-queue-simple.js";
import { WorkflowObserver } from "./workflow/observer-simple.js";
import { DashboardGenerator } from "./workflow/dashboard-simple.js";
import { RAGCoordinator } from "./workflow/coordinator-clean.js";

class RAGWorkflowRunner {
  constructor() {
    this.observer = new WorkflowObserver();
    this.coordinator = new RAGCoordinator(this.observer);
    this.issueQueue = new IssueQueueManager();
    this.dashboard = new DashboardGenerator(this.observer);

    console.log("🚀 LocalStay RAG Multi-Agent System initialized");
    console.log("📊 Dashboard: monitoring/dashboard.html");
  }

  /**
   * Run the complete multi-agent workflow
   */
  async runCompleteWorkflow() {
    console.log("🎯 Starting multi-agent RAG workflow for LocalStay MVP\n");

    try {
      // Load and parse issues
      await this.issueQueue.loadIssuesFromMarkdown("./localstay-mvp-issues.md");
      const stats = this.issueQueue.getStats();
      console.log(
        `📋 Loaded ${stats.totalIssues} issues across ${stats.totalEpics} epics`,
      );
      console.log(`   Story points: ${stats.totalStoryPoints} SP`);
      console.log(`   Estimated completion: ${stats.estimatedWeeks} weeks\n`);

      // Process each issue through multi-agent coordination
      let processedCount = 0;
      while (this.issueQueue.hasNextIssue()) {
        const issue = this.issueQueue.getNextIssue();
        if (!issue) break;

        processedCount++;
        console.log(
          `\n📝 [${processedCount}/${stats.totalIssues}] Processing ${issue.id}: ${issue.title}`,
        );

        const success = await this.coordinator.coordinateIssue(issue);

        if (success) {
          this.issueQueue.updateIssueStatus(issue.id, "completed");
          console.log(`✅ ${issue.id} completed successfully`);
        } else {
          this.issueQueue.updateIssueStatus(issue.id, "failed");
          console.log(`❌ ${issue.id} failed`);
        }

        // Update dashboard after each issue
        await this.dashboard.updateDashboard();
        await this.dashboard.writeDashboardToFile(
          "./monitoring/dashboard.html",
        );

        // Brief pause between issues
        await this.sleep(500);
      }

      await this.printFinalSummary();
    } catch (error) {
      console.error("❌ RAG workflow failed:", error);
    }
  }

  async showStatus() {
    console.log("📊 LocalStay RAG Multi-Agent System Status");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const snapshot = this.observer.getWorkflowSnapshot();
    const agentMetrics = this.observer.getMultiAgentMetrics();

    console.log(
      `Issues Processed: ${snapshot.overview.completedIssues}/${snapshot.overview.totalIssues}`,
    );
    console.log(`Success Rate: ${snapshot.overview.successRate.toFixed(1)}%`);
    console.log(`Total Cost: $${snapshot.overview.totalCost.toFixed(2)}`);
    console.log(`Agent Handoffs: ${agentMetrics.totalHandoffs}`);

    console.log("\n🤖 Agent Status:");
    agentMetrics.agentPerformance.forEach((metrics, agentId) => {
      console.log(
        `   ${agentId}: ${metrics.invocations} calls, ${metrics.successRate.toFixed(1)}% success`,
      );
    });

    console.log("\n✅ Multi-agent system is operational and ready!");
  }

  /**
   * Test a single issue with multi-agent coordination
   */
  async testSingleIssue(issueId) {
    console.log(
      `🧪 Testing single issue with multi-agent system: ${issueId}\n`,
    );

    try {
      await this.issueQueue.loadIssuesFromMarkdown("./localstay-mvp-issues.md");
      const issue = this.issueQueue.getIssueById(issueId);

      if (!issue) {
        console.error(`❌ Issue ${issueId} not found`);
        return;
      }

      console.log(`📝 Testing: ${issue.title}`);
      console.log(`🏷️  Labels: ${issue.labels.join(", ")}`);
      console.log(`📊 Story Points: ${issue.storyPoints}`);

      const success = await this.coordinator.coordinateIssue(issue);

      console.log(
        `\n${success ? "✅" : "❌"} Test ${success ? "completed" : "failed"} for ${issueId}`,
      );

      // Show coordination metrics
      const metrics = this.coordinator.getCoordinationMetrics();
      console.log("\n🤖 Agent Performance:");
      metrics.agentPerformance.forEach((perf, agentId) => {
        console.log(
          `   ${agentId}: ${perf.successRate.toFixed(1)}% success, ${perf.avgDuration.toFixed(0)}ms avg`,
        );
      });
    } catch (error) {
      console.error("❌ Test failed:", error);
    }
  }

  async generateDashboard() {
    console.log("📊 Generating multi-agent dashboard...");

    await this.dashboard.updateDashboard();
    await this.dashboard.writeDashboardToFile("./monitoring/dashboard.html");

    console.log("✅ Dashboard generated at monitoring/dashboard.html");
  }

  async printFinalSummary() {
    const snapshot = this.observer.getWorkflowSnapshot();
    const agentMetrics = this.observer.getMultiAgentMetrics();

    console.log("\n🎉 LocalStay RAG Multi-Agent Workflow Complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📊 Final Stats:`);
    console.log(
      `   Issues Completed: ${snapshot.overview.completedIssues}/${snapshot.overview.totalIssues}`,
    );
    console.log(
      `   Success Rate: ${snapshot.overview.successRate.toFixed(1)}%`,
    );
    console.log(`   Total Duration: ${snapshot.overview.totalDuration}ms`);
    console.log(`   Total Cost: $${snapshot.overview.totalCost.toFixed(2)}`);
    console.log(`   Agent Handoffs: ${agentMetrics.totalHandoffs}`);

    console.log("\n🤖 Agent Performance Summary:");
    agentMetrics.agentPerformance.forEach((perf, agentId) => {
      console.log(
        `   ${agentId}: ${perf.successRate.toFixed(1)}% success (${perf.invocations} calls)`,
      );
    });
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// CLI Interface
const command = process.argv[2] || "status";
const arg = process.argv[3];

const runner = new RAGWorkflowRunner();

console.log("🏠 LocalStay MVP - RAG Multi-Agent System");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

switch (command) {
  case "start":
    runner.runCompleteWorkflow().catch(console.error);
    break;

  case "status":
    runner.showStatus().catch(console.error);
    break;

  case "test-issue":
    if (!arg) {
      console.error("❌ Please provide an issue ID (e.g., ISSUE-001)");
      process.exit(1);
    }
    runner.testSingleIssue(arg).catch(console.error);
    break;

  case "dashboard":
    runner.generateDashboard().catch(console.error);
    break;

  default:
    console.log("Available commands:");
    console.log(
      "  start                    - Run complete multi-agent workflow",
    );
    console.log("  status                   - Show system status");
    console.log("  test-issue ISSUE-ID      - Test single issue processing");
    console.log("  dashboard                - Generate monitoring dashboard");
    console.log("\nExample: node rag-workflow.js test-issue ISSUE-001");
}
