#!/usr/bin/env bash
# Discover candidate URLs only. Run from Bash/WSL with NUTCH_HOME configured.
set -euo pipefail

usage() {
  echo "Usage: NUTCH_HOME=/path/to/nutch bash scripts/nutch-discover.sh <public-seed-url> [top-n]" >&2
  exit 2
}

seed="${1:-}"
top_n="${2:-10}"
[[ -n "$seed" && "$top_n" =~ ^[1-9][0-9]?$ ]] || usage
[[ -n "${NUTCH_HOME:-}" && -x "$NUTCH_HOME/bin/nutch" ]] || {
  echo "Set NUTCH_HOME to a prepared Apache Nutch runtime." >&2
  exit 2
}

host="$(python3 - "$seed" <<'PY'
import ipaddress
import socket
import sys
from urllib.parse import urlsplit

parsed = urlsplit(sys.argv[1])
host = parsed.hostname
if parsed.scheme not in {"http", "https"} or not host or parsed.username or parsed.password:
    raise SystemExit("Seed must be a complete public HTTP(S) URL without credentials.")
if host.lower() == "localhost" or host.lower().endswith((".localhost", ".local")):
    raise SystemExit("Seed must use a public hostname.")
try:
    addresses = {item[4][0] for item in socket.getaddrinfo(host, None, type=socket.SOCK_STREAM)}
except OSError as error:
    raise SystemExit(f"Seed hostname could not be resolved: {error}") from error
if not addresses or any(not ipaddress.ip_address(address).is_global for address in addresses):
    raise SystemExit("Seed must resolve only to public IP addresses.")
print(host.lower())
PY
)"

work_dir="$(mktemp -d "${TMPDIR:-/tmp}/rocket-nutch.XXXXXX")"
trap 'rm -rf "$work_dir"' EXIT
mkdir -p "$work_dir/urls" "$work_dir/crawl/segments"
cp -R "$NUTCH_HOME/conf" "$work_dir/conf"
printf '%s\n' "$seed" > "$work_dir/urls/seed.txt"

escaped_host="${host//./\\.}"
cat > "$work_dir/conf/regex-urlfilter.txt" <<EOF
+^https?://$escaped_host(:[0-9]+)?/
-.
EOF

python3 - "$work_dir/conf/nutch-site.xml" <<'PY'
import sys
import xml.etree.ElementTree as ET

path = sys.argv[1]
tree = ET.parse(path)
root = tree.getroot()
settings = {
    "http.agent.name": "RocketProjectCrawler",
    "fetcher.threads.fetch": "1",
}
for name, value in settings.items():
    for property_node in root.findall("property"):
        if property_node.findtext("name") == name:
            property_node.find("value").text = value
            break
    else:
        property_node = ET.SubElement(root, "property")
        ET.SubElement(property_node, "name").text = name
        ET.SubElement(property_node, "value").text = value
tree.write(path, encoding="utf-8", xml_declaration=True)
PY

export NUTCH_CONF_DIR="$work_dir/conf"
crawl_dir="$work_dir/crawl"
"$NUTCH_HOME/bin/nutch" inject "$crawl_dir/crawldb" "$work_dir/urls"
"$NUTCH_HOME/bin/nutch" generate "$crawl_dir/crawldb" "$crawl_dir/segments" -topN "$top_n"
segment="$(find "$crawl_dir/segments" -mindepth 1 -maxdepth 1 -type d | sort | tail -n 1)"
[[ -n "$segment" ]] || { echo "Nutch generated no crawl segment." >&2; exit 1; }
"$NUTCH_HOME/bin/nutch" fetch "$segment"
"$NUTCH_HOME/bin/nutch" parse "$segment"
"$NUTCH_HOME/bin/nutch" updatedb "$crawl_dir/crawldb" "$segment"
"$NUTCH_HOME/bin/nutch" readdb "$crawl_dir/crawldb" -dump "$work_dir/candidates" >/dev/null

echo "Candidate URLs (review one, then import it with Scrapy):"
find "$work_dir/candidates" -type f -exec cat {} + | cut -f1 | sort -u
