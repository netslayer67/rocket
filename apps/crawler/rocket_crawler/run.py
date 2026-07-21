"""Friendly command wrapper that validates a seed before Scrapy starts."""

import argparse
import subprocess
import sys
from pathlib import Path

from rocket_crawler.target import PublicTargetError, require_public_http_url


def main() -> int:
    parser = argparse.ArgumentParser(description="Import an approved public page into Rocket knowledge.")
    parser.add_argument("--seed", required=True, help="One public HTTP(S) page URL")
    parser.add_argument("--source-label", default="", help="Optional label shown in Knowledge Library")
    parser.add_argument("--max-pages", type=int, default=None, help="One to twenty exact-domain pages")
    parser.add_argument("--api-url", default="", help="Existing Rocket API URL")
    args = parser.parse_args()
    try:
        require_public_http_url(args.seed)
    except PublicTargetError as error:
        parser.error(str(error))
    command = [sys.executable, "-m", "scrapy", "crawl", "public_page", "-a", f"seed={args.seed}"]
    for key, value in vars(args).items():
        if key != "seed" and value not in {None, ""}:
            command.extend(["-a", f"{key}={value}"])
    return subprocess.run(command, cwd=Path(__file__).resolve().parents[1], check=False).returncode


if __name__ == "__main__":
    raise SystemExit(main())
