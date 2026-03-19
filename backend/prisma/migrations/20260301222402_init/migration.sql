-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "githubId" TEXT NOT NULL,
    "username" TEXT,
    "avatarUrl" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "goal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "githubRepoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PullRequest" (
    "id" TEXT NOT NULL,
    "githubPrId" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "reviewers" TEXT[],
    "openedAt" TIMESTAMP(3) NOT NULL,
    "mergedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "PullRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMetricSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "commits" INTEGER NOT NULL,
    "prsOpened" INTEGER NOT NULL,
    "prsMerged" INTEGER NOT NULL,
    "reviews" INTEGER NOT NULL,
    "activeHours" INTEGER NOT NULL,
    "afterHours" INTEGER NOT NULL,

    CONSTRAINT "UserMetricSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMetricSnapshot" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalCommits" INTEGER NOT NULL,
    "totalPRs" INTEGER NOT NULL,
    "avgLeadTime" DOUBLE PRECISION NOT NULL,
    "deploymentFreq" DOUBLE PRECISION NOT NULL,
    "changeFailureRate" DOUBLE PRECISION,

    CONSTRAINT "TeamMetricSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepoMetricSnapshot" (
    "id" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "commits" INTEGER NOT NULL,
    "prsOpened" INTEGER NOT NULL,
    "prsMerged" INTEGER NOT NULL,
    "avgReviewTime" DOUBLE PRECISION NOT NULL,
    "avgMergeTime" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RepoMetricSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");

-- CreateIndex
CREATE INDEX "WorkspaceMember_workspaceId_idx" ON "WorkspaceMember"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_userId_workspaceId_key" ON "WorkspaceMember"("userId", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_githubRepoId_key" ON "Repository"("githubRepoId");

-- CreateIndex
CREATE INDEX "PullRequest_repositoryId_idx" ON "PullRequest"("repositoryId");

-- CreateIndex
CREATE INDEX "PullRequest_openedAt_idx" ON "PullRequest"("openedAt");

-- CreateIndex
CREATE INDEX "PullRequest_mergedAt_idx" ON "PullRequest"("mergedAt");

-- CreateIndex
CREATE INDEX "UserMetricSnapshot_userId_date_idx" ON "UserMetricSnapshot"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "UserMetricSnapshot_userId_date_key" ON "UserMetricSnapshot"("userId", "date");

-- CreateIndex
CREATE INDEX "TeamMetricSnapshot_workspaceId_date_idx" ON "TeamMetricSnapshot"("workspaceId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMetricSnapshot_workspaceId_date_key" ON "TeamMetricSnapshot"("workspaceId", "date");

-- CreateIndex
CREATE INDEX "RepoMetricSnapshot_repositoryId_date_idx" ON "RepoMetricSnapshot"("repositoryId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "RepoMetricSnapshot_repositoryId_date_key" ON "RepoMetricSnapshot"("repositoryId", "date");

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PullRequest" ADD CONSTRAINT "PullRequest_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMetricSnapshot" ADD CONSTRAINT "UserMetricSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMetricSnapshot" ADD CONSTRAINT "TeamMetricSnapshot_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepoMetricSnapshot" ADD CONSTRAINT "RepoMetricSnapshot_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
