

#!/usr/bin/env bash

set -euo pipefail

url_line=$(grep -m1 '^VITE_API_URL=' .env || true)
if [[ -z "$url_line" ]]; then
  echo "Error: VITE_API_URL not found in .env" >&2
  exit 1
fi

URL=${url_line#*=}
if [[ -z "$URL" ]]; then
  echo "Error: VITE_API_URL is empty" >&2
  exit 1
fi

if ! wget -q -O openapi.json "$URL/api-docs/openapi.json"; then
  echo "Error: Failed to download openapi.json from $URL" >&2
  exit 1
fi

if [[ -d ./src/lib/client ]]; then
  rm -rf ./src/lib/client
fi

if ! bun x openapi-ts; then
  echo "Error: openapi-ts generation failed" >&2
  exit 1
fi

mkdir -p ./src/lib
if [[ ! -d ./client ]]; then
  echo "Error: ./client directory does not exist" >&2
  exit 1
fi

mv ./client ./src/lib