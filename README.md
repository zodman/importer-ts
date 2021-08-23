### Importer data from csv with prisma



```
rm -f prisma/dev.*
echo "DATABASE_URL='file:./dev.db'" > .env
yarn run prisma db push
yarn run download-csv
yarn run importer
```

TODO:

 - [ ] Missing eslint
