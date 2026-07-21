"""Public-target checks shared by manual crawler commands."""

from ipaddress import ip_address
from socket import SOCK_STREAM, getaddrinfo
from urllib.parse import SplitResult, urlsplit


class PublicTargetError(ValueError):
    """Raised when a crawl target could reach a non-public network."""


def require_public_http_url(value: str, resolver=getaddrinfo) -> SplitResult:
    parsed = urlsplit(value.strip())
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise PublicTargetError("Seed must be a complete public HTTP(S) URL.")
    if parsed.username or parsed.password or _is_local_name(parsed.hostname):
        raise PublicTargetError("Seed must not include credentials or a local hostname.")
    addresses = _resolve(parsed.hostname, resolver)
    if not addresses or any(not ip_address(address).is_global for address in addresses):
        raise PublicTargetError("Seed must resolve only to public IP addresses.")
    return parsed


def same_domain(url: str, host: str) -> bool:
    parsed = urlsplit(url)
    return parsed.scheme in {"http", "https"} and parsed.hostname == host


def _is_local_name(hostname: str) -> bool:
    lowered = hostname.lower()
    return lowered == "localhost" or lowered.endswith((".localhost", ".local"))


def _resolve(hostname: str, resolver) -> set[str]:
    try:
        return {item[4][0] for item in resolver(hostname, None, type=SOCK_STREAM)}
    except OSError as error:
        raise PublicTargetError("Seed hostname could not be resolved.") from error
