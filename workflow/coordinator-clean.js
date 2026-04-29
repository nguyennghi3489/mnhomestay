/**
 * RAG Workflow Coordinator - Multi-agent orchestration for LocalStay MVP
 */

export class RAGCoordinator {
  constructor(observer) {
    this.observer = observer;
    this.agentChain = [
      {
        id: "retrieve",
        phase: "retrieve",
        description: "Context retrieval specialist",
        nextAgent: "generate",
        retryCount: 3,
      },
      {
        id: "generate",
        phase: "generate",
        description: "Code generation specialist",
        nextAgent: "validate",
        retryCount: 2,
      },
      {
        id: "validate",
        phase: "validate",
        description: "Quality assurance specialist",
        nextAgent: "test",
        retryCount: 2,
      },
      {
        id: "test",
        phase: "test",
        description: "Testing and final validation",
        retryCount: 1,
      },
    ];
  }

  async coordinateIssue(issue) {
    console.log(
      `🎯 [Coordinator] Starting multi-agent workflow for ${issue.id}: ${issue.title}`,
    );
    this.observer.startIssue(issue.id);

    let workflowData = { issue };
    let success = true;

    try {
      for (const agentConfig of this.agentChain) {
        console.log(
          `🤖 [Coordinator] Invoking ${agentConfig.id} agent (${agentConfig.description})`,
        );

        this.observer.startPhase(agentConfig.phase, {
          agentId: agentConfig.id,
          issueId: issue.id,
          description: agentConfig.description,
        });
        this.observer.startAgent(agentConfig.id, agentConfig.phase);

        const result = await this.executeAgentWithRetry(
          agentConfig,
          workflowData,
        );

        if (!result.success) {
          success = false;
          this.observer.endAgent(false, result.error);
          this.observer.endPhase("failed", result.error);
          console.error(
            `❌ [Coordinator] Agent ${agentConfig.id} failed: ${result.error}`,
          );
          break;
        }

        workflowData = this.updateWorkflowData(
          workflowData,
          agentConfig.id,
          result.data,
        );

        this.observer.recordAgentTokens(
          result.tokensUsed.input,
          result.tokensUsed.output,
        );
        this.observer.endAgent(true);
        this.observer.endPhase("completed");

        if (agentConfig.nextAgent) {
          const dataSize = JSON.stringify(workflowData).length;
          this.observer.recordHandoff(
            agentConfig.id,
            agentConfig.nextAgent,
            agentConfig.phase,
            dataSize,
          );
        }

        console.log(
          `✅ [Coordinator] Agent ${agentConfig.id} completed successfully`,
        );
      }

      this.observer.endIssue(success ? "completed" : "failed");
      console.log(
        `${success ? "✅" : "❌"} [Coordinator] Multi-agent workflow ${success ? "completed" : "failed"} for ${issue.id}`,
      );

      return success;
    } catch (error) {
      this.observer.endIssue("failed");
      console.error(
        `❌ [Coordinator] Critical workflow error for ${issue.id}:`,
        error,
      );
      return false;
    }
  }

  async executeAgentWithRetry(agentConfig, workflowData) {
    const maxRetries = agentConfig.retryCount || 2;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `🔄 [Agent:${agentConfig.id}] Attempt ${attempt}/${maxRetries}`,
        );

        const result = await this.callAgent(agentConfig.id, workflowData);
        if (result.success) {
          return result;
        } else {
          throw new Error(result.error || "Agent execution failed");
        }
      } catch (error) {
        lastError = error;
        console.warn(
          `⚠️ [Agent:${agentConfig.id}] Attempt ${attempt} failed:`,
          error.message,
        );

        if (attempt < maxRetries) {
          const delay = 1000 * attempt;
          console.log(`⏳ [Agent:${agentConfig.id}] Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    return {
      success: false,
      data: null,
      tokensUsed: { input: 0, output: 0, total: 0 },
      duration: 0,
      error: `Agent ${agentConfig.id} failed after ${maxRetries} attempts: ${lastError?.message}`,
    };
  }

  async callAgent(agentId, workflowData) {
    const startTime = Date.now();

    try {
      // Simulate agent execution - Replace with actual implementations
      switch (agentId) {
        case "retrieve":
          await this.sleep(2000 + Math.random() * 1000); // 2-3 seconds
          return {
            success: true,
            data: {
              relevantFiles: [
                `${workflowData.issue.title.toLowerCase().replace(/ /g, "-")}.controller.ts`,
              ],
              patterns: this.detectPatterns(workflowData.issue.labels),
              context: `Retrieved context for ${workflowData.issue.title}`,
              dependencies: this.extractDependencies(workflowData.issue.labels),
            },
            tokensUsed: { input: 2500, output: 1200, total: 3700 },
            duration: Date.now() - startTime,
          };

        case "generate":
          await this.sleep(3000 + Math.random() * 2000); // 3-5 seconds
          const frameworks = this.detectFrameworks(workflowData.issue.labels);
          return {
            success: true,
            data: {
              files: frameworks.map((fw) => ({
                path: `${fw}/${workflowData.issue.title.toLowerCase().replace(/ /g, "-")}.${fw === "backend" ? "ts" : "vue"}`,
                content: `// Generated ${fw} code for ${workflowData.issue.title}`,
                framework: fw,
              })),
              summary: `Generated code for ${frameworks.join(", ")} frameworks`,
            },
            tokensUsed: { input: 5800, output: 4200, total: 10000 },
            duration: Date.now() - startTime,
          };

        case "validate":
          await this.sleep(1500 + Math.random() * 1000); // 1.5-2.5 seconds
          const validationSuccess = Math.random() > 0.1; // 90% success rate
          return {
            success: validationSuccess,
            data: {
              lintPassed: validationSuccess,
              typecheckPassed: validationSuccess,
              buildPassed: validationSuccess,
              coverage: validationSuccess ? 85 + Math.random() * 10 : 65,
              qualityScore: validationSuccess ? 0.9 : 0.6,
            },
            tokensUsed: { input: 0, output: 0, total: 0 },
            duration: Date.now() - startTime,
            error: validationSuccess
              ? undefined
              : "Code quality standards not met",
          };

        case "test":
          await this.sleep(2000 + Math.random() * 1500); // 2-3.5 seconds
          const testSuccess = Math.random() > 0.05; // 95% success rate
          return {
            success: testSuccess,
            data: {
              unitTests: testSuccess ? "passed" : "failed",
              integrationTests: testSuccess ? "passed" : "failed",
              testsPassed: testSuccess
                ? 12 + Math.floor(Math.random() * 8)
                : Math.floor(Math.random() * 5),
              testsFailed: testSuccess ? 0 : 1 + Math.floor(Math.random() * 3),
              coverage: testSuccess
                ? 80 + Math.random() * 15
                : 60 + Math.random() * 15,
            },
            tokensUsed: { input: 0, output: 0, total: 0 },
            duration: Date.now() - startTime,
            error: testSuccess ? undefined : "Test execution failed",
          };

        default:
          throw new Error(`Unknown agent: ${agentId}`);
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        tokensUsed: { input: 0, output: 0, total: 0 },
        duration: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  updateWorkflowData(currentData, agentId, agentResult) {
    return {
      ...currentData,
      [agentId]: agentResult,
      lastUpdate: new Date(),
      completedAgents: [...(currentData.completedAgents || []), agentId],
    };
  }

  detectPatterns(labels) {
    const patterns = [];
    if (labels.includes("backend"))
      patterns.push("nestjs-controller", "nestjs-service");
    if (labels.includes("frontend"))
      patterns.push("vue-component", "vuetify-page");
    if (labels.includes("database")) patterns.push("prisma-model");
    return patterns;
  }

  detectFrameworks(labels) {
    const frameworks = [];
    if (labels.includes("backend")) frameworks.push("backend");
    if (labels.includes("frontend")) frameworks.push("frontend");
    if (labels.includes("database")) frameworks.push("database");
    return frameworks.length > 0 ? frameworks : ["backend"];
  }

  extractDependencies(labels) {
    const deps = [];
    if (labels.includes("backend")) deps.push("@nestjs/common", "@nestjs/core");
    if (labels.includes("frontend")) deps.push("vue", "vuetify");
    if (labels.includes("database")) deps.push("@prisma/client");
    return deps;
  }

  getCoordinationMetrics() {
    const multiAgentMetrics = this.observer.getMultiAgentMetrics();

    return {
      agentChainLength: this.agentChain.length,
      totalCoordinatedWorkflows:
        this.observer.getWorkflowSnapshot().overview.totalIssues,
      ...multiAgentMetrics,
    };
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
