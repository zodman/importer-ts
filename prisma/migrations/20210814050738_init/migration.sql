-- CreateTable
CREATE TABLE "company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "entry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "positions" INTEGER NOT NULL,
    "noc" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
