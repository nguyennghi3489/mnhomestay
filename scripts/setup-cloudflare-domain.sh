#!/bin/bash

# =============================================================================
# LocalStay Cloudflare Domain + SSL + R2 Bootstrap
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

required_vars=(
  CLOUDFLARE_API_TOKEN
  CLOUDFLARE_ACCOUNT_ID
  CLOUDFLARE_ZONE_ID
  RAILWAY_PUBLIC_HOST
)

for var_name in "${required_vars[@]}"; do
  if [ -z "${!var_name:-}" ]; then
    echo -e "${RED}Missing required env var: ${var_name}${NC}"
    exit 1
  fi
done

if ! command -v curl >/dev/null 2>&1; then
  echo -e "${RED}curl is required but not installed.${NC}"
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo -e "${RED}jq is required but not installed.${NC}"
  exit 1
fi

DOMAIN="${CLOUDFLARE_DOMAIN:-localstay.vn}"
PAGES_PROJECT="${CLOUDFLARE_PROJECT_NAME:-localstay-app}"
PAGES_TARGET="${PAGES_PROJECT}.pages.dev"
R2_BUCKET="${CLOUDFLARE_R2_BUCKET:-localstay-photos}"

api_call() {
  local method="$1"
  local endpoint="$2"
  local payload="${3:-}"

  if [ -n "$payload" ]; then
    curl -sS -X "$method" "https://api.cloudflare.com/client/v4${endpoint}" \
      -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
      -H "Content-Type: application/json" \
      --data "$payload"
  else
    curl -sS -X "$method" "https://api.cloudflare.com/client/v4${endpoint}" \
      -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
      -H "Content-Type: application/json"
  fi
}

upsert_cname() {
  local name="$1"
  local target="$2"

  local full_name="${name}.${DOMAIN}"
  local existing
  existing=$(api_call GET "/zones/${CLOUDFLARE_ZONE_ID}/dns_records?type=CNAME&name=${full_name}")

  local record_id
  record_id=$(echo "$existing" | jq -r '.result[0].id // empty')

  local payload
  payload=$(jq -nc \
    --arg type "CNAME" \
    --arg name "$name" \
    --arg content "$target" \
    --argjson proxied true \
    '{type: $type, name: $name, content: $content, proxied: $proxied}')

  if [ -n "$record_id" ]; then
    echo -e "${BLUE}Updating DNS record ${full_name} -> ${target}${NC}"
    api_call PUT "/zones/${CLOUDFLARE_ZONE_ID}/dns_records/${record_id}" "$payload" | jq -e '.success == true' >/dev/null
  else
    echo -e "${BLUE}Creating DNS record ${full_name} -> ${target}${NC}"
    api_call POST "/zones/${CLOUDFLARE_ZONE_ID}/dns_records" "$payload" | jq -e '.success == true' >/dev/null
  fi
}

echo -e "${BLUE}Configuring SSL mode: Full (Strict)${NC}"
api_call PATCH "/zones/${CLOUDFLARE_ZONE_ID}/settings/ssl" '{"value":"strict"}' | jq -e '.success == true' >/dev/null

echo -e "${BLUE}Enabling Always Use HTTPS${NC}"
api_call PATCH "/zones/${CLOUDFLARE_ZONE_ID}/settings/always_use_https" '{"value":"on"}' | jq -e '.success == true' >/dev/null

upsert_cname "app" "$PAGES_TARGET"
upsert_cname "api" "$RAILWAY_PUBLIC_HOST"

echo -e "${BLUE}Attempting R2 bucket creation: ${R2_BUCKET}${NC}"
if command -v npx >/dev/null 2>&1; then
  if npx --yes wrangler@latest r2 bucket create "$R2_BUCKET" --config /dev/null >/dev/null 2>&1; then
    echo -e "${GREEN}R2 bucket ensured: ${R2_BUCKET}${NC}"
  else
    echo -e "${YELLOW}Could not auto-create R2 bucket via wrangler. Create manually in Cloudflare Dashboard.${NC}"
  fi
else
  echo -e "${YELLOW}npx not available, skipping R2 bucket creation.${NC}"
fi

echo -e "${GREEN}Cloudflare DNS + SSL baseline configured.${NC}"
echo -e "${YELLOW}Manual steps still required:${NC}"
echo "1) Point domain nameservers to Cloudflare registrar-provided values"
echo "2) Attach app.${DOMAIN} in Cloudflare Pages custom domains"
echo "3) Attach api.${DOMAIN} in Railway custom domains"
