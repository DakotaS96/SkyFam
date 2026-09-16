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
    opencv-data \
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

INSTALL_OK=true

for entry in \
    "Dashboard:5000" \
    "FamilyChat:5050" \
    "Radio:5080"
do
    name="${entry%%:*}"
    port="${entry##*:}"
    service_ready=false

    for attempt in $(seq 1 15); do
        if curl -fsS \
            --connect-timeout 1 \
            --max-time 3 \
            "http://127.0.0.1:${port}/" \
            >/dev/null
        then
            service_ready=true
            break
        fi

        if [[ "$attempt" -lt 15 ]]; then
            sleep 2
        fi
    done

    if [[ "$service_ready" == true ]]; then
        echo "  ✓ ${name} is responding on port ${port}"
    else
        echo "  ✗ ${name} did not respond within 30 seconds"
        INSTALL_OK=false
    fi
done

# ------------------------------------------------------------
# Remote access
# ------------------------------------------------------------

echo
echo "============================================================"
echo "Remote access"
echo "============================================================"
echo
echo "SkyFam is ready for use on your local network."
echo
echo "SkyFam may contain private family messages, photos, and videos."
echo "Do not forward ports 5000, 5050, or 5080 through your router."
echo "HTTPS alone does not make SkyFam private."
echo

echo "1) Keep SkyFam on the local network only (recommended)"
echo "2) Install Tailscale for private remote access"
echo "3) I already have protected remote access (advanced)"
echo

read -r -p "Choose [1-3, default 1]: " remote_choice
remote_choice="${remote_choice:-1}"

case "$remote_choice" in
    1)
        echo
        echo "SkyFam will remain available only on your local network."
        echo "This is the safest default."
        ;;

    2)
        echo
        echo "Tailscale creates a private connection between approved devices."
        echo "Each remote phone, tablet, or computer must also use Tailscale."
        echo "Do not enable Tailscale Funnel for SkyFam."
        echo

        if command -v tailscale >/dev/null 2>&1; then
            echo "Tailscale is already installed."
        else
            echo "Installing Tailscale from its official installer..."

            if ! curl -fsSL https://tailscale.com/install.sh | sh; then
                echo
                echo "WARNING: Tailscale installation failed."
                echo "SkyFam is still available on the local network."
                remote_choice="1"
            fi
        fi

        if [[ "$remote_choice" == "2" ]]; then
            echo
            echo "Tailscale will now display a sign-in link."
            echo "Open it and approve this SkyFam server."
            echo

            if tailscale up; then
                TAILSCALE_IP="$(tailscale ip -4 2>/dev/null | head -n 1)"

                if [[ -n "$TAILSCALE_IP" ]]; then
                    echo
                    echo "Tailscale private access is ready:"
                    echo "  Dashboard:  http://${TAILSCALE_IP}:5000"
                    echo "  FamilyChat: http://${TAILSCALE_IP}:5050"
                    echo "  Radio:      http://${TAILSCALE_IP}:5080"
                    echo
                    echo "Install Tailscale on each approved remote device and"
                    echo "sign in to the same Tailscale network."
                else
                    echo
                    echo "WARNING: Tailscale connected, but no private IP was found."
                    echo "SkyFam remains available on the local network."
                fi
            else
                echo
                echo "WARNING: Tailscale setup was not completed."
                echo "SkyFam remains available on the local network."
            fi
        fi
        ;;

    3)
        echo
        echo "Advanced remote access requires authentication in front of"
        echo "every SkyFam service. Recommended examples include:"
        echo "  - Cloudflare Tunnel protected by Cloudflare Access and MFA"
        echo "  - An authenticated reverse proxy"
        echo "  - A private VPN"
        echo
        echo "Caddy or HTTPS by itself does not restrict who can view SkyFam."
        echo "A Cloudflare Tunnel without Cloudflare Access is not private."
        echo "Do not forward SkyFam ports directly through your router."
        echo

        read -r -p "Have you protected all three URLs with authentication? [y/N]: " protected_answer

        if [[ "$protected_answer" =~ ^[Yy]$ ]]; then
            echo
            read -r -p "Dashboard protected URL: " DASH_PUBLIC_URL
            read -r -p "FamilyChat protected URL: " CHAT_PUBLIC_URL
            read -r -p "Radio protected URL: " RADIO_PUBLIC_URL

            valid_protected_url() {
                local url="$1"

                [[ "$url" =~ ^https://[^[:space:]]+$ ]]
            }

            if ! valid_protected_url "$DASH_PUBLIC_URL" ||
               ! valid_protected_url "$CHAT_PUBLIC_URL" ||
               ! valid_protected_url "$RADIO_PUBLIC_URL"; then
                echo
                echo "One or more protected URLs are invalid."
                echo "All three must begin with https://."
                echo "No remote URL configuration was written."
            else
                umask 077

                cat > /etc/skyfam-public.env <<EOF_PUBLIC
SKYFAM_DASHBOARD_URL=${DASH_PUBLIC_URL}
SKYFAM_CHAT_URL=${CHAT_PUBLIC_URL}
SKYFAM_RADIO_URL=${RADIO_PUBLIC_URL}
EOF_PUBLIC
                chmod 600 /etc/skyfam-public.env

                systemctl restart \
                    dashboard.service \
                    familychat.service \
                    skyfam-radio.service

                echo
                echo "Protected remote URLs configured."
                echo "Dashboard:  ${DASH_PUBLIC_URL}"
                echo "FamilyChat: ${CHAT_PUBLIC_URL}"
                echo "Radio:      ${RADIO_PUBLIC_URL}"
                echo
                echo "Test each URL in a private browser window."
                echo "The authentication screen must appear before SkyFam."
            fi
        else
            echo
            echo "Skipping remote URL configuration."
            echo "SkyFam remains available on the local network."
        fi
        ;;

    *)
        echo
        echo "Unknown choice. SkyFam will remain local-network only."
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
