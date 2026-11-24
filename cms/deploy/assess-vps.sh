#!/usr/bin/env bash
# Read-only VPS assessment for the Vizitor CMS. Changes nothing on the server.
# Usage (from your own computer):  ssh alexgabe@pry.hu 'bash -s' < cms/deploy/assess-vps.sh > vps-report.txt
set -u
section() { printf '\n===== %s =====\n' "$1"; }
have() { command -v "$1" >/dev/null 2>&1; }
section "System";        uname -a; cat /etc/os-release 2>/dev/null | grep -E '^(PRETTY_NAME|VERSION_ID)='; uptime
section "CPU";           nproc; grep -m1 'model name' /proc/cpuinfo
section "Memory";        free -m
section "Disk";          df -h -x tmpfs -x devtmpfs
section "Top memory";    ps -eo pid,user,rss,comm --sort=-rss | head -15
section "Runtimes";      for c in node npm pnpm bun python3 docker docker-compose podman pm2 nginx caddy apache2 psql pg_dump certbot; do printf '%-15s ' "$c"; if have "$c"; then "$c" --version 2>&1 | head -1; else echo '-'; fi; done
docker compose version 2>/dev/null
section "Listening ports"; (ss -ltnp 2>/dev/null || netstat -ltnp 2>/dev/null) | sed 's/users:.*//' 
section "Systemd services (running)"; systemctl list-units --type=service --state=running --no-pager --no-legend 2>/dev/null | awk '{print $1}'
section "Systemd timers"; systemctl list-timers --no-pager 2>/dev/null | head -20
section "Docker";        if have docker; then docker ps --format '{{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}' 2>&1; docker volume ls 2>&1 | head -30; docker network ls 2>&1; fi
section "PM2";           if have pm2; then pm2 ls 2>&1; fi
section "Nginx sites";   ls -la /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null; for f in /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*.conf; do [ -f "$f" ] && { echo "--- $f"; grep -E '^\s*(server_name|listen|proxy_pass|root|ssl_certificate)\b' "$f"; }; done 2>/dev/null
section "Caddy";         [ -f /etc/caddy/Caddyfile ] && grep -vE '^\s*#' /etc/caddy/Caddyfile
section "TLS certs";     ls /etc/letsencrypt/live 2>/dev/null
section "PostgreSQL";    ls /etc/postgresql 2>/dev/null; systemctl is-active postgresql 2>/dev/null; (sudo -n -u postgres psql -Atc "select datname from pg_database where not datistemplate" 2>/dev/null || echo "(listing databases needs sudo; skipped)")
section "Cron";          crontab -l 2>/dev/null; ls /etc/cron.d 2>/dev/null
section "Backup dirs";   ls -d /var/backups/* /backup* /srv/backup* 2>/dev/null; have rclone && rclone listremotes 2>/dev/null; have restic && echo restic present
section "Home";          ls -la ~ | head -40
section "Firewall";      (sudo -n ufw status 2>/dev/null || echo "(ufw status needs sudo; skipped)")
section "DNS of planned host"; getent hosts cms.vizitor.hu || echo "cms.vizitor.hu: no record yet"
