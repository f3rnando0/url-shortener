-- CreateTable
CREATE TABLE "ClickMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortenId" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClickMetric_shortenId_fkey" FOREIGN KEY ("shortenId") REFERENCES "Url" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
