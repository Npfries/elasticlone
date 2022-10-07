/*
  Warnings:

  - Added the required column `name` to the `Migration` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Migration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "hostId" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    CONSTRAINT "Migration_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Migration" ("data", "hostId", "id") SELECT "data", "hostId", "id" FROM "Migration";
DROP TABLE "Migration";
ALTER TABLE "new_Migration" RENAME TO "Migration";
CREATE UNIQUE INDEX "Migration_id_key" ON "Migration"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
