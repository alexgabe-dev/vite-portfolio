
# Ghost CMS Deployment Guide regarding Ubuntu VPS

This guide allows you to set up Ghost CMS on your VPS at `https://pry.hu:4114`.

## Prerequisites on VPS
1.  **Docker** and **Docker Compose** installed.
2.  **SSL Certificates** for `pry.hu` (e.g. from LetsEncrypt/Certbot).
    -   You need `fullchain.pem` and `privkey.pem`.

## Setup Steps

### 1. Copy Files to VPS
Upload this `deploy/ghost` folder to your VPS (e.g., to `/opt/ghost`).
```bash
# Run this from your local machine
scp -r ./deploy/ghost user@pry.hu:/opt/ghost
```

### 2. Prepare SSL Certificates
On your VPS, copy your SSL certificates to the `ssl` folder inside your ghost directory.
```bash
# On VPS
cd /opt/ghost
mkdir ssl
cp /etc/letsencrypt/live/pry.hu/fullchain.pem ./ssl/
cp /etc/letsencrypt/live/pry.hu/privkey.pem ./ssl/
```

### 3. Configure Environment Variables
Create a `.env` file in `/opt/ghost`:
```bash
# /opt/ghost/.env
MYSQL_ROOT_PASSWORD=super_secure_root_password
MYSQL_PASSWORD=super_secure_db_password
```

### 4. Run Services
Start the specific containers:
```bash
docker-compose up -d
```

### 5. Finish Setup
1.  Open `https://pry.hu:4114/ghost` in your browser.
2.  Create your admin account.
3.  Go to **Settings -> Integrations**.
4.  Add a **New Custom Integration** (e.g., "Vite Portfolio").
5.  Copy the **Content API Key** and **API URL**.
6.  Paste them into your local `.env` file in the Vite project:
    ```
    VITE_GHOST_API_URL=https://pry.hu:4114
    VITE_GHOST_CONTENT_API_KEY=your_key_here
    ```
