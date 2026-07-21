"""Import creator-approved public pages through the existing API boundary."""

import json
from os import getenv
from urllib.request import Request, urlopen

import scrapy

from rocket_crawler.target import PublicTargetError, require_public_http_url, same_domain


class PublicPageSpider(scrapy.Spider):
    name = "public_page"

    def __init__(self, seed=None, api_url=None, source_label=None, max_pages=None, **kwargs):
        super().__init__(**kwargs)
        if not seed:
            raise PublicTargetError("Pass one approved URL with -a seed=https://example.com.")
        parsed = require_public_http_url(seed)
        self.start_urls = [parsed.geturl()]
        self.allowed_domains = [parsed.hostname]
        self.seed_host = parsed.hostname
        self.api_url = (api_url or getenv("CRAWLER_API_URL", "http://localhost:4000")).rstrip("/")
        self.source_label = source_label or ""
        self.max_pages = _bounded_pages(max_pages)
        self.visited_pages = 0

    def parse(self, response):
        if not same_domain(response.url, self.seed_host):
            self.logger.warning("Skipped redirect outside approved domain.")
            return
        self.visited_pages += 1
        if _is_html(response):
            self._import_page(response)
        if self.visited_pages < self.max_pages:
            yield from self._same_domain_links(response)

    def _import_page(self, response):
        text = _page_text(response)
        if not text:
            self.logger.info("Skipped page without readable text: %s", response.url)
            return
        title = _first_text(response.css("title::text").getall())
        payload = {
            "sourceLabel": (self.source_label or title or response.url)[:80],
            "sourceUrl": response.url,
            "content": text,
        }
        request = Request(
            f"{self.api_url}/knowledge/import",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urlopen(request, timeout=20) as api_response:
                self.logger.info("Imported pattern from %s (API %s).", response.url, api_response.status)
        except OSError as error:
            self.logger.error("Knowledge import failed for %s: %s", response.url, error.reason)

    def _same_domain_links(self, response):
        for href in response.css("a::attr(href)").getall():
            candidate = response.urljoin(href)
            if same_domain(candidate, self.seed_host):
                yield scrapy.Request(candidate, callback=self.parse)


def _bounded_pages(value) -> int:
    requested = int(value or getenv("CRAWLER_MAX_PAGES", "1"))
    return max(1, min(requested, 20))


def _is_html(response) -> bool:
    content_type = response.headers.get(b"Content-Type", b"").decode("latin-1").lower()
    return "text/html" in content_type or "application/xhtml+xml" in content_type


def _page_text(response) -> str:
    parts = (part.strip() for part in response.css("body *::text").getall())
    return " ".join(part for part in parts if part)[:12000]


def _first_text(values) -> str:
    return " ".join(value.strip() for value in values if value.strip())[:160]
