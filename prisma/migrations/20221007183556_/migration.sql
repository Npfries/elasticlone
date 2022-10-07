/*
  Warnings:

  - Added the required column `updatedAt` to the `Migration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Host` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Pipeline` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Migration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "hostId" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Migration_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Migration" ("data", "hostId", "id", "name", "type") SELECT "data", "hostId", "id", "name", "type" FROM "Migration";
DROP TABLE "Migration";
ALTER TABLE "new_Migration" RENAME TO "Migration";
CREATE UNIQUE INDEX "Migration_id_key" ON "Migration"("id");
CREATE TABLE "new_Host" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Host" ("id", "name", "url") SELECT "id", "name", "url" FROM "Host";
DROP TABLE "Host";
ALTER TABLE "new_Host" RENAME TO "Host";
CREATE UNIQUE INDEX "Host_id_key" ON "Host"("id");
CREATE UNIQUE INDEX "Host_url_key" ON "Host"("url");
CREATE TABLE "new_Pipeline" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inputHostId" INTEGER NOT NULL,
    "outputHostId" INTEGER NOT NULL,
    "inputIndex" TEXT NOT NULL DEFAULT '',
    "outputIndex" TEXT NOT NULL DEFAULT '',
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pipeline_inputHostId_fkey" FOREIGN KEY ("inputHostId") REFERENCES "Host" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pipeline_outputHostId_fkey" FOREIGN KEY ("outputHostId") REFERENCES "Host" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pipeline" ("id", "inputHostId", "inputIndex", "outputHostId", "outputIndex") SELECT "id", "inputHostId", "inputIndex", "outputHostId", "outputIndex" FROM "Pipeline";
DROP TABLE "Pipeline";
ALTER TABLE "new_Pipeline" RENAME TO "Pipeline";
CREATE UNIQUE INDEX "Pipeline_id_key" ON "Pipeline"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
