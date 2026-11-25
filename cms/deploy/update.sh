#!/usr/bin/env bash
# Install or update the CMS on the VPS. Safe to re-run; data lives in Docker volumes.
# Usage (on the server, inside <repo>/cms):  ./deploy/update.sh
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .env ] || { echo "Missing .env — copy .env.example to .env and fill it in (chmod 600 .env)."; exit 1; }
chmod 600 .env
if [ -d ../.git ]; then
  branch=$(git -C .. rev-parse --abbrev-ref HEAD)
  # Production follows main; a leftover feature branch would silently miss merged fixes.
  if [ "$branch" != "main" ] && [ "${ALLOW_BRANCH:-}" != "$branch" ]; then
    echo "The checkout is on '$branch', not 'main'. Switch with: git -C .. fetch origin main && git -C .. checkout main"
    echo "(or run with ALLOW_BRANCH=$branch to deploy this branch on purpose)"; exit 1
  fi
  git -C .. pull --ff-only
fi
# Take a backup before changing anything (skipped on the very first install).
if docker compose ps --status running --services 2>/dev/null | grep -qx db; then ./deploy/backup.sh; fi
docker compose build cms
docker compose up -d db
docker compose up -d cms          # migrations run automatically when the new container starts
port=$(grep -E '^CMS_PORT=' .env | cut -d= -f2 | cut -d' ' -f1); port=${port:-3010}
for i in $(seq 1 60); do
  if curl -fsS "http://127.0.0.1:${port}/api/health" >/dev/null 2>&1; then echo "CMS healthy on 127.0.0.1:${port}"; exit 0; fi
  sleep 2
done
echo "CMS did not become healthy. Logs:"; docker compose logs --tail=80 cms; exit 1
