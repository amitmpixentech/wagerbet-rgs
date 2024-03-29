#!/bin/sh

echo "Install bash and execute 'wait-for-it.sh' script"
apk add --update bash
./scripts/wait-for-it.sh $DB_HOST:5432 --timeout=30 --strict -- echo "postgres up and running"

npm run migration:run
pm2-runtime dist/rgs-service.js --name "wagerbet-rgs"