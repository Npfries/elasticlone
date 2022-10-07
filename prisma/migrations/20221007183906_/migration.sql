/*
  Warnings:

  - You are about to drop the column `createAt` on the `Migration` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Migration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "hostId" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Migration_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Migration" ("data", "hostId", "id", "name", "type", "updatedAt") SELECT "data", "hostId", "id", "name", "type", "updatedAt" FROM "Migration";
DROP TABLE "Migration";
ALTER TABLE "new_Migration" RENAME TO "Migration";
CREATE UNIQUE INDEX "Migration_id_key" ON "Migration"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
