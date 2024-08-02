/*
  Warnings:

  - Made the column `expiresAt` on table `Url` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Url" (
    "id" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Url" ("createdAt", "expiresAt", "id", "originalUrl", "updatedAt") SELECT "createdAt", "expiresAt", "id", "originalUrl", "updatedAt" FROM "Url";
DROP TABLE "Url";
ALTER TABLE "new_Url" RENAME TO "Url";
CREATE UNIQUE INDEX "Url_id_key" ON "Url"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
