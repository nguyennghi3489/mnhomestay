/**
 * Simplified Issue Queue for testing
 */
export class IssueQueueManager {
  constructor() {
    this.issues = [];
    this.currentIndex = 0;
  }

  async loadIssuesFromMarkdown(filePath) {
    // Simulate loading issues for testing
    this.issues = [
      {
        id: "ISSUE-001",
        title: "Initialize monorepo project structure",
        description:
          "Set up the monorepo with separate frontend/ and backend/ workspaces.",
        labels: ["chore", "devops"],
        storyPoints: 2,
        status: "pending",
      },
      {
        id: "ISSUE-002",
        title: "Set up PostgreSQL database on Supabase",
        description:
          "Provision the managed PostgreSQL instance and connect it to the NestJS backend.",
        labels: ["database", "devops"],
        storyPoints: 2,
        status: "pending",
      },
    ];
    console.log(`📋 [IssueQueue] Loaded ${this.issues.length} test issues`);
  }

  getStats() {
    const completed = this.issues.filter(
      (i) => i.status === "completed",
    ).length;
    const failed = this.issues.filter((i) => i.status === "failed").length;
    const pending = this.issues.filter((i) => i.status === "pending").length;

    return {
      totalIssues: this.issues.length,
      completedIssues: completed,
      failedIssues: failed,
      pendingIssues: pending,
      totalEpics: 12,
      totalStoryPoints: this.issues.reduce(
        (sum, issue) => sum + issue.storyPoints,
        0,
      ),
      estimatedWeeks: 8,
    };
  }

  hasNextIssue() {
    return this.currentIndex < this.issues.length;
  }

  getNextIssue() {
    if (this.hasNextIssue()) {
      return this.issues[this.currentIndex++];
    }
    return null;
  }

  getIssueById(issueId) {
    return this.issues.find((issue) => issue.id === issueId);
  }

  updateIssueStatus(issueId, status, error) {
    const issue = this.getIssueById(issueId);
    if (issue) {
      issue.status = status;
      if (error) issue.error = error;
      console.log(`📋 [IssueQueue] Updated ${issueId} status to ${status}`);
    }
  }
}
