-- CreateTable
CREATE TABLE "Migration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hostId" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    CONSTRAINT "Migration_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Migration_id_key" ON "Migration"("id");
