#!/usr/bin/env bash
# Restore database and media from a backup directory. DESTRUCTIVE: replaces the current CMS data.
# Usage: ./deploy/restore.sh <backup-dir> --yes
set -euo pipefail
cd "$(dirname "$0")/.."
src=${1:?backup directory, e.g. backups/daily/20261124T030000Z}
[ "${2:-}" = "--yes" ] || { echo "This replaces the live CMS database and media with $src. Re-run with --yes."; exit 1; }
set -a; . ./.env; set +a
U=${POSTGRES_USER:-vizitor_cms}; DB=${POSTGRES_DB:-vizitor_cms}
( cd "$src" && sha256sum -c SHA256SUMS )
./deploy/backup.sh   # safety copy of the current state first
docker compose stop cms
docker compose exec -T db psql -U "$U" -d postgres -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS $DB WITH (FORCE)" -c "CREATE DATABASE $DB OWNER $U"
docker compose exec -T db pg_restore -U "$U" -d "$DB" --no-owner --exit-on-error < "$src/db.dump"
docker compose run --rm --no-deps -T --entrypoint sh cms -c 'find /data/media -mindepth 1 -delete && tar -C /data -xzf -' < "$src/media.tar.gz"
docker compose up -d cms
echo "Restored from $src. Check https://cms.vizitor.hu/admin and the Élesítési napló."
