#!/bin/sh
set -e

mkdir -p "$(dirname "${DATABASE_PATH:-/data/leads.db}")"

node /app/server/index.js &
exec nginx -g 'daemon off;'
