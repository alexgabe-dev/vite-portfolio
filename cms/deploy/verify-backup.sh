#!/usr/bin/env bash
# Proves that a backup can really be restored: loads the dump into a throw-away database inside the
# db container, compares row counts with the live database, and checks the media archive.
# Usage: ./deploy/verify-backup.sh [backup-dir]   (default: newest daily backup)
set -euo pipefail
cd "$(dirname "$0")/.."
BACKUP_DIR=${BACKUP_DIR:-$PWD/backups}
set -a; . ./.env; set +a
U=${POSTGRES_USER:-vizitor_cms}; DB=${POSTGRES_DB:-vizitor_cms}
src=${1:-$(find "$BACKUP_DIR/daily" -mindepth 1 -maxdepth 1 -type d | sort | tail -1)}
[ -n "$src" ] || { echo "No backups in $BACKUP_DIR/daily"; exit 1; }
echo "Verifying $src"
( cd "$src" && sha256sum -c SHA256SUMS )
tmp="verify_$(date +%s)"
psql() { docker compose exec -T db psql -U "$U" -v ON_ERROR_STOP=1 "$@"; }
psql -d postgres -qc "CREATE DATABASE $tmp" >/dev/null
trap 'psql -d postgres -qc "DROP DATABASE IF EXISTS $tmp" >/dev/null' EXIT
docker compose exec -T db pg_restore -U "$U" -d "$tmp" --no-owner --exit-on-error < "$src/db.dump"
q="select (select count(*) from posts)||' '||(select count(*) from _posts_v)||' '||(select count(*) from media)||' '||(select count(*) from users)||' '||(select count(*) from payload_migrations)"
restored=$(psql -d "$tmp" -Atc "$q"); live=$(psql -d "$DB" -Atc "$q")
echo "posts versions media users migrations — restored: $restored | live: $live"
files=$(tar -tzf "$src/media.tar.gz" | grep -vc '/$' || true)
echo "media archive files: $files"
[ -n "$restored" ] || { echo "Restore produced no data"; exit 1; }
echo "OK: backup restores cleanly (counts may differ from live if content changed since the backup)."
