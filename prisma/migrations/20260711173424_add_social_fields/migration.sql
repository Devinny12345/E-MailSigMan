-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Signature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "loopingGifUrl" TEXT NOT NULL DEFAULT '',
    "landingPageUrl" TEXT NOT NULL DEFAULT '',
    "tag" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "companyLogoUrl" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT NOT NULL DEFAULT '',
    "youtubeUrl" TEXT NOT NULL DEFAULT '',
    "taglineLine1" TEXT NOT NULL DEFAULT '',
    "taglineLine2" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Signature" ("avatarUrl", "createdAt", "email", "id", "isActive", "landingPageUrl", "loopingGifUrl", "name", "phone", "tag", "title", "updatedAt") SELECT "avatarUrl", "createdAt", "email", "id", "isActive", "landingPageUrl", "loopingGifUrl", "name", "phone", "tag", "title", "updatedAt" FROM "Signature";
DROP TABLE "Signature";
ALTER TABLE "new_Signature" RENAME TO "Signature";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
