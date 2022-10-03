-- CreateTable
CREATE TABLE "Host" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "Pipeline" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inputHostId" INTEGER NOT NULL,
    "outputHostId" INTEGER NOT NULL,
    CONSTRAINT "Pipeline_inputHostId_fkey" FOREIGN KEY ("inputHostId") REFERENCES "Host" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pipeline_outputHostId_fkey" FOREIGN KEY ("outputHostId") REFERENCES "Host" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Host_id_key" ON "Host"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Host_url_key" ON "Host"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Pipeline_id_key" ON "Pipeline"("id");
