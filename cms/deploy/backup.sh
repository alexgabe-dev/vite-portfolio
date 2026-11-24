#!/usr/bin/env bash
# Database + media backup with rotation. Run daily (systemd timer: deploy/systemd/).
# Keeps the last 14 daily and 8 weekly (Sunday) backups in BACKUP_DIR.
# NOTE: backups on the same VPS do NOT protect against losing the server. Set BACKUP_RCLONE_REMOTE
# (e.g. "b2:vizitor-backups/cms") to also copy each backup off the server with rclone.
set -euo pipefail
cd "$(dirname "$0")/.."
BACKUP_DIR=${BACKUP_DIR:-$PWD/backups}
KEEP_DAILY=${KEEP_DAILY:-14}
KEEP_WEEKLY=${KEEP_WEEKLY:-8}
set -a; . ./.env; set +a
stamp=$(date -u +%Y%m%dT%H%M%SZ)
target="$BACKUP_DIR/daily/$stamp"
mkdir -p "$target" "$BACKUP_DIR/weekly"
umask 077
# Consistent logical dump of the CMS database (custom format → selective, compressed restore).
docker compose exec -T db pg_dump -U "${POSTGRES_USER:-vizitor_cms}" -d "${POSTGRES_DB:-vizitor_cms}" -Fc --no-owner > "$target/db.dump"
# Original uploads from the media volume.
docker compose exec -T cms tar -C /data -czf - media > "$target/media.tar.gz"
( cd "$target" && sha256sum db.dump media.tar.gz > SHA256SUMS )
[ -s "$target/db.dump" ] || { echo "Empty database dump"; exit 1; }
if [ "$(date -u +%u)" = 7 ]; then cp -a "$target" "$BACKUP_DIR/weekly/$stamp"; fi
# Rotation (newest first, keep N).
prune() { find "$1" -mindepth 1 -maxdepth 1 -type d -print | sort -r | tail -n +$(($2 + 1)) | xargs -r rm -r --; }
prune "$BACKUP_DIR/daily" "$KEEP_DAILY"
prune "$BACKUP_DIR/weekly" "$KEEP_WEEKLY"
if [ -n "${BACKUP_RCLONE_REMOTE:-}" ]; then rclone copy "$target" "$BACKUP_RCLONE_REMOTE/daily/$stamp"; fi
echo "Backup written: $target ($(du -sh "$target" | cut -f1))"
