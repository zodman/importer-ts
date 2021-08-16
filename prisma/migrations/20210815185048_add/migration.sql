/*
  Warnings:

  - You are about to drop the column `noc` on the `entry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city_id` to the `entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_address` to the `entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_zipcode` to the `entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noc_id` to the `entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phase` to the `entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `entry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "noc" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "province" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "city" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "province_id" INTEGER NOT NULL,
    FOREIGN KEY ("province_id") REFERENCES "province" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_entry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "positions" INTEGER NOT NULL,
    "noc_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "city_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "phase" TEXT NOT NULL,
    "company_address" TEXT NOT NULL,
    "company_zipcode" TEXT NOT NULL,
    FOREIGN KEY ("noc_id") REFERENCES "noc" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("city_id") REFERENCES "city" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_entry" ("company_id", "id", "positions") SELECT "company_id", "id", "positions" FROM "entry";
DROP TABLE "entry";
ALTER TABLE "new_entry" RENAME TO "entry";
CREATE UNIQUE INDEX "entry.positions_noc_id_company_id_city_id_year_phase_company_address_company_zipcode_unique" ON "entry"("positions", "noc_id", "company_id", "city_id", "year", "phase", "company_address", "company_zipcode");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "noc.name_unique" ON "noc"("name");

-- CreateIndex
CREATE UNIQUE INDEX "province.name_unique" ON "province"("name");

-- CreateIndex
CREATE UNIQUE INDEX "city.name_unique" ON "city"("name");

-- CreateIndex
CREATE UNIQUE INDEX "company.name_unique" ON "company"("name");
