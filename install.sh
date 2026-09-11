#!/usr/bin/env bash
set -Eeuo pipefail

# ============================================================
# SkyFam Installer
# Target: Debian 13 (Trixie)
# ============================================================

if [[ ${EUID:-$(id -u)} -ne 0 ]]; then
    echo "ERROR: Please run this installer as root or with sudo."
    exit 1
fi

if [[ ! -f /etc/os-release ]]; then
    echo "ERROR: Unable to determine operating system."
    exit 1
fi

. /etc/os-release

if [[ "${ID:-}" != "debian" ]]; then
    echo "ERROR: SkyFam currently supports Debian."
    exit 1
fi

if [[ "${VERSION_ID:-}" != "13" ]]; then
    echo "ERROR: SkyFam currently targets Debian 13 (Trixie)."
    echo "Detected: ${PRETTY_NAME:-unknown}"
    exit 1
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

echo
echo "============================================================"
echo "                     SkyFam Installer"
echo "============================================================"
echo
echo "Detected: ${PRETTY_NAME}"
echo

# ------------------------------------------------------------
# Confirm installation
# ------------------------------------------------------------

read -r -p "Install SkyFam on this server? [Y/n]: " answer
answer="${answer:-Y}"

if [[ ! "$answer" =~ ^[Yy]$ ]]; then
    echo "Installation cancelled."
    exit 0
fi

# ------------------------------------------------------------
# Install operating-system dependencies
# ------------------------------------------------------------

echo
echo "Installing required Debian packages..."

apt update

apt install -y \
    python3 \
    python3-flask \
    python3-requests \
    python3-opencv \
    python3-werkzeug \
    curl \
    ca-certificates

# ------------------------------------------------------------
# Create application directories
# ------------------------------------------------------------

echo
echo "Installing SkyFam application files..."

install -d /opt/dashboard
install -d /opt/familychat
install -d /opt/skyfam-radio

cp -a "${SCRIPT_DIR}/dashboard/." /opt/dashboard/
cp -a "${SCRIPT_DIR}/familychat/." /opt/familychat/
cp -a "${SCRIPT_DIR}/radio/." /opt/skyfam-radio/

# Runtime directories
install -d /opt/dashboard/static/photos
install -d /opt/familychat/static/uploads

# ------------------------------------------------------------
# Administrator password
# ------------------------------------------------------------

echo
echo "SkyFam uses an administrator password for protected settings."
echo

while true; do
    read -r -s -p "Create SkyFam administrator password: " ADMIN_PASSWORD
    echo
    read -r -s -p "Confirm administrator password: " ADMIN_PASSWORD_CONFIRM
    echo

    if [[ -z "$ADMIN_PASSWORD" ]]; then
        echo "Password cannot be blank."
        continue
    fi

    if [[ "$ADMIN_PASSWORD" != "$ADMIN_PASSWORD_CONFIRM" ]]; then
        echo "Passwords do not match. Try again."
        continue
    fi

    break
done

umask 077
cat > /etc/skyfam-admin.env <<EOF_ADMIN
SKYFAM_ADMIN_PASSWORD=${ADMIN_PASSWORD}
EOF_ADMIN
chmod 600 /etc/skyfam-admin.env
unset ADMIN_PASSWORD ADMIN_PASSWORD_CONFIRM

# ------------------------------------------------------------
# Optional YouTube API key
# ------------------------------------------------------------

echo
echo "SkyFam can optionally use the YouTube Data API for"
echo "Ryan Hall live-stream detection."
echo
read -r -p "Configure a YouTube API key now? [y/N]: " youtube_answer

if [[ "$youtube_answer" =~ ^[Yy]$ ]]; then
    read -r -s -p "YouTube API key: " YOUTUBE_API_KEY
    echo

    if [[ -n "$YOUTUBE_API_KEY" ]]; then
        umask 077
        cat > /etc/skyfam-youtube.env <<EOF_YOUTUBE
YOUTUBE_API_KEY=${YOUTUBE_API_KEY}
EOF_YOUTUBE
        chmod 600 /etc/skyfam-youtube.env
    fi

    unset YOUTUBE_API_KEY
fi

# ------------------------------------------------------------
# systemd services
# ------------------------------------------------------------

echo
echo "Creating systemd services..."

cat > /etc/systemd/system/dashboard.service <<'EOF_DASHBOARD'
[Unit]
Description=SkyFam Dashboard
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/dashboard
EnvironmentFile=-/etc/skyfam-admin.env
EnvironmentFile=-/etc/skyfam-youtube.env
EnvironmentFile=-/etc/skyfam-public.env
ExecStart=/usr/bin/python3 /opt/dashboard/app.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF_DASHBOARD

cat > /etc/systemd/system/familychat.service <<'EOF_CHAT'
[Unit]
Description=SkyFam FamilyChat
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/familychat
EnvironmentFile=-/etc/skyfam-admin.env
EnvironmentFile=-/etc/skyfam-public.env
ExecStart=/usr/bin/python3 /opt/familychat/app.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF_CHAT

cat > /etc/systemd/system/skyfam-radio.service <<'EOF_RADIO'
[Unit]
Description=SkyFam Radio
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/skyfam-radio
EnvironmentFile=-/etc/skyfam-admin.env
EnvironmentFile=-/etc/skyfam-public.env
ExecStart=/usr/bin/python3 /opt/skyfam-radio/server.py
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF_RADIO

systemctl daemon-reload

systemctl enable --now \
    dashboard.service \
    familychat.service \
    skyfam-radio.service

# ------------------------------------------------------------
# Verify local services
# ------------------------------------------------------------

echo
echo "Checking SkyFam..."

sleep 2

INSTALL_OK=true

for entry in \
    "Dashboard:5000" \
    "FamilyChat:5050" \
    "Radio:5080"
do
    name="${entry%%:*}"
    port="${entry##*:}"

    if curl -fsS "http://127.0.0.1:${port}/" >/dev/null; then
        echo "  ✓ ${name} is responding on port ${port}"
    else
        echo "  ✗ ${name} did not respond on port ${port}"
        INSTALL_OK=false
    fi
done

# ------------------------------------------------------------
# Optional Caddy setup
# ------------------------------------------------------------

echo
echo "============================================================"
echo "Public HTTPS access"
echo "============================================================"
echo
echo "SkyFam already works on your local network."
echo
echo "Caddy can optionally provide HTTPS for your own domain."
echo
echo "You may also skip this and use Nginx, Nginx Proxy Manager,"
echo "Traefik, Cloudflare Tunnel, or another reverse proxy."
echo

echo "1) Set up Caddy"
echo "2) I will use my own reverse proxy"
echo "3) LAN access only"
echo

read -r -p "Choose [1-3]: " proxy_choice

case "$proxy_choice" in
    1)
        echo
        echo "Before continuing:"
        echo "  - Your DNS records must point to this server's public IP."
        echo "  - TCP ports 80 and 443 must reach this server."
        echo

        read -r -p "Dashboard hostname (example: skyfam.example.com): " DASH_DOMAIN
        read -r -p "FamilyChat hostname (example: chat.example.com): " CHAT_DOMAIN
        read -r -p "Radio hostname (example: radio.example.com): " RADIO_DOMAIN

        valid_hostname() {
            local host="$1"

            [[ -n "$host" ]] &&
            [[ "$host" =~ ^([A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$ ]]
        }

        if ! valid_hostname "$DASH_DOMAIN" ||
           ! valid_hostname "$CHAT_DOMAIN" ||
           ! valid_hostname "$RADIO_DOMAIN"; then
            echo
            echo "One or more hostnames are invalid."
            echo
            echo "Enter hostnames only, for example:"
            echo "  skyfam.example.com"
            echo "  chat.example.com"
            echo "  radio.example.com"
            echo
            echo "Do not include https:// or a path."
            echo
            echo "Skipping Caddy configuration."
        else
            echo
            echo "Installing Caddy..."

            apt install -y caddy

            if [[ -f /etc/caddy/Caddyfile ]]; then
                cp -a /etc/caddy/Caddyfile \
                    "/etc/caddy/Caddyfile.backup.$(date +%Y%m%d-%H%M%S)"
            fi

            cat > /etc/caddy/Caddyfile <<EOF_CADDY
${DASH_DOMAIN} {
    reverse_proxy 127.0.0.1:5000
}

${CHAT_DOMAIN} {
    reverse_proxy 127.0.0.1:5050
}

${RADIO_DOMAIN} {
    reverse_proxy 127.0.0.1:5080
}
EOF_CADDY

            if ! caddy validate --config /etc/caddy/Caddyfile; then
                echo
                echo "ERROR: Caddy configuration validation failed."
                echo "The previous Caddy configuration was not started."
                exit 1
            fi

            systemctl enable caddy
            systemctl restart caddy

            umask 077
            cat > /etc/skyfam-public.env <<EOF_PUBLIC
SKYFAM_DASHBOARD_URL=https://${DASH_DOMAIN}
SKYFAM_CHAT_URL=https://${CHAT_DOMAIN}
SKYFAM_RADIO_URL=https://${RADIO_DOMAIN}
EOF_PUBLIC
            chmod 600 /etc/skyfam-public.env

            systemctl restart \
                dashboard.service \
                familychat.service \
                skyfam-radio.service

            echo
            echo "Caddy configuration installed."
            echo
            echo "Dashboard:  https://${DASH_DOMAIN}"
            echo "FamilyChat: https://${CHAT_DOMAIN}"
            echo "Radio:      https://${RADIO_DOMAIN}"
            echo
            echo "Caddy will obtain HTTPS certificates automatically"
            echo "once DNS and ports 80/443 are reachable."
        fi
        ;;

    2)
        echo
        echo "Use these SkyFam backend addresses with your reverse proxy:"
        echo
        echo "  Dashboard:  http://127.0.0.1:5000"
        echo "  FamilyChat: http://127.0.0.1:5050"
        echo "  Radio:      http://127.0.0.1:5080"
        echo
        echo "Enter the public URLs that your reverse proxy will provide."
        echo "Example: https://skyfam.example.com"
        echo

        read -r -p "Dashboard public URL: " DASH_PUBLIC_URL
        read -r -p "FamilyChat public URL: " CHAT_PUBLIC_URL
        read -r -p "Radio public URL: " RADIO_PUBLIC_URL

        valid_public_url() {
            local url="$1"

            [[ "$url" =~ ^https?://[^[:space:]]+$ ]]
        }

        if ! valid_public_url "$DASH_PUBLIC_URL" ||
           ! valid_public_url "$CHAT_PUBLIC_URL" ||
           ! valid_public_url "$RADIO_PUBLIC_URL"; then
            echo
            echo "One or more public URLs are invalid."
            echo "No SkyFam public URL configuration was written."
        else
            umask 077

            cat > /etc/skyfam-public.env <<EOF_PUBLIC
SKYFAM_DASHBOARD_URL=${DASH_PUBLIC_URL}
SKYFAM_CHAT_URL=${CHAT_PUBLIC_URL}
SKYFAM_RADIO_URL=${RADIO_PUBLIC_URL}
EOF_PUBLIC

            chmod 600 /etc/skyfam-public.env

            systemctl restart                 dashboard.service                 familychat.service                 skyfam-radio.service

            echo
            echo "SkyFam public URLs configured."
            echo "Dashboard:  ${DASH_PUBLIC_URL}"
            echo "FamilyChat: ${CHAT_PUBLIC_URL}"
            echo "Radio:      ${RADIO_PUBLIC_URL}"
        fi
        ;;

    *)
        echo
        echo "Skipping public reverse-proxy configuration."
        ;;
esac

# ------------------------------------------------------------
# Finish
# ------------------------------------------------------------

SERVER_IP="$(hostname -I 2>/dev/null | awk '{print $1}')"

echo
echo "============================================================"

if [[ "$INSTALL_OK" == true ]]; then
    echo "SkyFam installation completed successfully."
else
    echo "SkyFam installed, but one or more services need attention."
fi

echo "============================================================"

if [[ -n "${SERVER_IP:-}" ]]; then
    echo
    echo "Local addresses:"
    echo "  Dashboard:  http://${SERVER_IP}:5000"
    echo "  FamilyChat: http://${SERVER_IP}:5050"
    echo "  Radio:      http://${SERVER_IP}:5080"
fi

echo
echo "Service status:"
echo "  systemctl status dashboard"
echo "  systemctl status familychat"
echo "  systemctl status skyfam-radio"
echo
