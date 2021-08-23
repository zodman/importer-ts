-- RedefineIndex
DROP INDEX "entry.positions_noc_id_company_id_city_id_year_phase_company_address_company_zipcode_unique";
CREATE UNIQUE INDEX "identify" ON "entry"("positions", "noc_id", "company_id", "city_id", "year", "phase", "company_address", "company_zipcode");
