import unittest

from rocket_crawler.target import PublicTargetError, require_public_http_url, same_domain


def public_resolver(host, port, type):
    return [(None, None, None, None, ("93.184.216.34", 0))]


def private_resolver(host, port, type):
    return [(None, None, None, None, ("127.0.0.1", 0))]


class PublicTargetTests(unittest.TestCase):
    def test_accepts_public_https_seed(self):
        parsed = require_public_http_url("https://example.com/news", public_resolver)
        self.assertEqual(parsed.hostname, "example.com")

    def test_rejects_private_resolved_seed(self):
        with self.assertRaises(PublicTargetError):
            require_public_http_url("https://example.com", private_resolver)

    def test_rejects_localhost_without_resolving(self):
        with self.assertRaises(PublicTargetError):
            require_public_http_url("http://localhost:4000", public_resolver)

    def test_keeps_links_on_exact_seed_domain(self):
        self.assertTrue(same_domain("https://example.com/a", "example.com"))
        self.assertFalse(same_domain("https://other.example.com/a", "example.com"))
