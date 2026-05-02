#!/bin/bash

# =============================================================================
# LocalStay Cloudflare DNS + SSL Verification
# =============================================================================

set -euo pipefail

DOMAIN="${CLOUDFLARE_DOMAIN:-localstay.vn}"
APP_HOST="app.${DOMAIN}"
API_HOST="api.${DOMAIN}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo -e "${RED}Missing required command: $1${NC}"
    exit 1
  fi
}

check_cmd curl

check_dns() {
  local host="$1"
  if command -v dig >/dev/null 2>&1; then
    dig +short "$host" | head -n 1
  elif command -v nslookup >/dev/null 2>&1; then
    nslookup "$host" | awk '/^Address: / { print $2; exit }'
  else
    echo ""
  fi
}

check_https() {
  local host="$1"
  echo -e "${BLUE}Checking HTTPS for ${host}${NC}"

  local headers
  headers=$(curl -sSI "https://${host}" || true)

  if [ -z "$headers" ]; then
    echo -e "${RED}No HTTPS response from ${host}${NC}"
    return 1
  fi

  if echo "$headers" | grep -qi "HTTP/.* 200\|HTTP/.* 301\|HTTP/.* 302"; then
    echo -e "${GREEN}HTTPS reachable for ${host}${NC}"
  else
    echo -e "${YELLOW}HTTPS responded with unexpected status for ${host}${NC}"
    echo "$headers" | head -n 1
  fi

  if echo "$headers" | grep -qi "server: cloudflare\|cf-ray"; then
    echo -e "${GREEN}Cloudflare edge headers present for ${host}${NC}"
  else
    echo -e "${YELLOW}Cloudflare edge headers not detected for ${host}${NC}"
  fi
}

echo "Verifying LocalStay domain configuration for ${DOMAIN}"

echo -e "${BLUE}Resolving DNS...${NC}"
app_dns=$(check_dns "$APP_HOST")
api_dns=$(check_dns "$API_HOST")

if [ -n "$app_dns" ]; then
  echo -e "${GREEN}${APP_HOST} resolves to ${app_dns}${NC}"
else
  echo -e "${YELLOW}${APP_HOST} does not currently resolve${NC}"
fi

if [ -n "$api_dns" ]; then
  echo -e "${GREEN}${API_HOST} resolves to ${api_dns}${NC}"
else
  echo -e "${YELLOW}${API_HOST} does not currently resolve${NC}"
fi

check_https "$APP_HOST"
check_https "$API_HOST"

echo -e "${GREEN}Verification script completed.${NC}"
