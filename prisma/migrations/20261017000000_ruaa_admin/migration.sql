-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "RuaaCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RuaaCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuaaProduct" (
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "data" JSONB NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RuaaProduct_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "RuaaOrder" (
    "id" TEXT NOT NULL,
    "requestKey" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'requested',
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "tracking" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RuaaOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuaaMedia" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bytes" BYTEA NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RuaaMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuaaAdmin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RuaaAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RuaaSession" (
    "tokenHash" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RuaaSession_pkey" PRIMARY KEY ("tokenHash")
);

-- CreateTable
CREATE TABLE "RuaaRateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RuaaRateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "RuaaAudit" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RuaaAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RuaaCategory_name_key" ON "RuaaCategory"("name");

-- CreateIndex
CREATE INDEX "RuaaProduct_status_categoryId_idx" ON "RuaaProduct"("status", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "RuaaOrder_requestKey_key" ON "RuaaOrder"("requestKey");

-- CreateIndex
CREATE INDEX "RuaaOrder_createdAt_idx" ON "RuaaOrder"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RuaaAdmin_email_key" ON "RuaaAdmin"("email");

-- CreateIndex
CREATE INDEX "RuaaSession_expiresAt_idx" ON "RuaaSession"("expiresAt");

-- CreateIndex
CREATE INDEX "RuaaRateLimit_expiresAt_idx" ON "RuaaRateLimit"("expiresAt");

-- CreateIndex
CREATE INDEX "RuaaAudit_createdAt_idx" ON "RuaaAudit"("createdAt");

-- AddForeignKey
ALTER TABLE "RuaaProduct" ADD CONSTRAINT "RuaaProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RuaaCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RuaaSession" ADD CONSTRAINT "RuaaSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "RuaaAdmin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
