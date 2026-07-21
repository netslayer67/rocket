"""Safe defaults for a manually approved crawl."""

from os import environ, getenv
from pathlib import Path


def _load_local_env() -> None:
    path = Path(__file__).resolve().parents[1] / ".env"
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        key, separator, value = line.partition("=")
        if separator and key and not key.lstrip().startswith("#"):
            environ.setdefault(key.strip(), value.strip())


_load_local_env()

BOT_NAME = "rocket_crawler"
SPIDER_MODULES = ["rocket_crawler.spiders"]
NEWSPIDER_MODULE = "rocket_crawler.spiders"
ROBOTSTXT_OBEY = True
USER_AGENT = getenv("CRAWLER_USER_AGENT", "RocketProjectCrawler/0.1")
COOKIES_ENABLED = False
REDIRECT_ENABLED = False
DOWNLOAD_DELAY = float(getenv("CRAWLER_DOWNLOAD_DELAY", "2"))
DOWNLOAD_TIMEOUT = float(getenv("CRAWLER_TIMEOUT_SECONDS", "15"))
DOWNLOAD_MAXSIZE = int(getenv("CRAWLER_MAX_RESPONSE_BYTES", "1000000"))
CONCURRENT_REQUESTS_PER_DOMAIN = 1
AUTOTHROTTLE_ENABLED = True
AUTOTHROTTLE_START_DELAY = DOWNLOAD_DELAY
AUTOTHROTTLE_MAX_DELAY = float(getenv("CRAWLER_MAX_DELAY_SECONDS", "12"))
AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
LOG_LEVEL = "INFO"
