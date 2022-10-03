-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pipeline" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inputHostId" INTEGER NOT NULL,
    "outputHostId" INTEGER NOT NULL,
    "inputIndex" TEXT NOT NULL DEFAULT '',
    "outputIndex" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Pipeline_inputHostId_fkey" FOREIGN KEY ("inputHostId") REFERENCES "Host" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pipeline_outputHostId_fkey" FOREIGN KEY ("outputHostId") REFERENCES "Host" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pipeline" ("id", "inputHostId", "outputHostId") SELECT "id", "inputHostId", "outputHostId" FROM "Pipeline";
DROP TABLE "Pipeline";
ALTER TABLE "new_Pipeline" RENAME TO "Pipeline";
CREATE UNIQUE INDEX "Pipeline_id_key" ON "Pipeline"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
