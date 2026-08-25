# Descarga local de la landing de MandalaTickets (solo homepage + assets).
from __future__ import annotations

import pathlib
import re
import ssl
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent
BASE = "https://mandalatickets.com/"
UA = "Mozilla/5.0 (compatible; MandalaLandingMirror/1.0)"
CTX = ssl.create_default_context()

SKIP_HOST_PARTS = (
    "google",
    "gstatic",
    "facebook",
    "doubleclick",
    "clarity.ms",
    "stripe.com",
    "trustpilot",
    "posthog",
    "i.posthog",
    "googletagmanager",
    "googleadservices",
    "connect.facebook",
)

CSS_URL_RE = re.compile(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", re.I)
IMPORT_RE = re.compile(r"@import\s+(?:url\()?['\"]([^'\"]+)['\"]\)?", re.I)
HTML_ATTR_RE = re.compile(
    r"""(?P<attr>\b(?:href|src|poster|data-src|data-lazy-src)\s*=\s*)(?P<q>['"])(?P<url>[^'"]+)(?P=q)""",
    re.I,
)
SRCSET_RE = re.compile(
    r"""(?P<attr>\b(?:srcset|data-srcset)\s*=\s*)(?P<q>['"])(?P<val>[^'"]+)(?P=q)""",
    re.I,
)


def should_skip(url: str) -> bool:
    host = urllib.parse.urlparse(url).netloc.lower()
    return any(part in host for part in SKIP_HOST_PARTS)


def abs_url(url: str, base: str) -> str | None:
    url = url.strip()
    if not url or url.startswith(("data:", "javascript:", "mailto:", "tel:", "#")):
        return None
    return urllib.parse.urljoin(base, url)


def local_path(url: str) -> pathlib.Path | None:
    parsed = urllib.parse.urlparse(url)
    if parsed.netloc and "mandalatickets.com" not in parsed.netloc.lower():
        return None
    path = urllib.parse.unquote(parsed.path)
    if path.endswith("/") or path == "":
        path = "/index.html"
    if path.startswith("/"):
        path = path[1:]
    return ROOT / path


def fetch(url: str) -> bytes | None:
    parsed = urllib.parse.urlparse(url)
    safe_path = urllib.parse.quote(parsed.path, safe="/")
    url = parsed._replace(path=safe_path).geturl()
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=45) as res:
            return res.read()
    except (urllib.error.URLError, TimeoutError, ssl.SSLError, ValueError) as exc:
        print("FAIL", url, exc)
        return None


def rewrite_css(css: str, css_url: str, queue: list[str]) -> str:
    def repl(match: re.Match[str]) -> str:
        raw = match.group(1)
        absu = abs_url(raw, css_url)
        if not absu or should_skip(absu):
            return match.group(0)
        dest = local_path(absu)
        if dest is None:
            return match.group(0)
        queue.append(absu)
        rel = pathlib.Path(
            urllib.parse.urlparse(css_url).path.lstrip("/")
        )
        if str(rel).endswith("/"):
            rel = rel / "x"
        from_dir = (ROOT / rel).parent
        rel_out = pathlib.Path(os_rel(from_dir, dest)).as_posix()
        quote = "'" if "'" not in match.group(0) else '"'
        return f"url({quote}{rel_out}{quote})"

    css = CSS_URL_RE.sub(repl, css)

    def repl_import(match: re.Match[str]) -> str:
        absu = abs_url(match.group(1), css_url)
        if not absu or should_skip(absu):
            return match.group(0)
        dest = local_path(absu)
        if dest is None:
            return match.group(0)
        queue.append(absu)
        from_dir = (ROOT / pathlib.Path(urllib.parse.urlparse(css_url).path.lstrip("/"))).parent
        rel_out = pathlib.Path(os_rel(from_dir, dest)).as_posix()
        return match.group(0).replace(match.group(1), rel_out)

    return IMPORT_RE.sub(repl_import, css)


def os_rel(from_dir: pathlib.Path, dest: pathlib.Path) -> str:
    try:
        return str(pathlib.Path(os_relpath(str(dest), str(from_dir))))
    except ValueError:
        return dest.as_posix()


def os_relpath(dest: str, start: str) -> str:
    import os

    return os.path.relpath(dest, start)


def rewrite_html(html: str, page_url: str, queue: list[str]) -> str:
    page_path = local_path(page_url)
    from_dir = page_path.parent if page_path else ROOT

    def to_local(raw: str) -> str:
        absu = abs_url(raw, page_url)
        if not absu or should_skip(absu):
            return raw
        dest = local_path(absu)
        if dest is None:
            return raw
        parsed = urllib.parse.urlparse(absu)
        is_asset = parsed.path.startswith("/assets/") or parsed.path.endswith(
            (".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".woff", ".woff2", ".ttf", ".eot", ".mp4", ".webm", ".ico")
        )
        if is_asset:
            queue.append(absu)
            return pathlib.Path(os_rel(from_dir, dest)).as_posix()
        # Enlaces de navegacion se quedan apuntando a produccion.
        return absu

    def attr_repl(match: re.Match[str]) -> str:
        return f"{match.group('attr')}{match.group('q')}{to_local(match.group('url'))}{match.group('q')}"

    html = HTML_ATTR_RE.sub(attr_repl, html)

    def srcset_repl(match: re.Match[str]) -> str:
        parts = []
        for chunk in match.group("val").split(","):
            chunk = chunk.strip()
            if not chunk:
                continue
            bits = chunk.split()
            bits[0] = to_local(bits[0])
            parts.append(" ".join(bits))
        return f"{match.group('attr')}{match.group('q')}{', '.join(parts)}{match.group('q')}"

    return SRCSET_RE.sub(srcset_repl, html)


def main() -> None:
    queue: list[str] = [BASE]
    seen: set[str] = set()

    while queue:
        url = queue.pop(0)
        parsed = urllib.parse.urlparse(url)
        url = parsed._replace(fragment="").geturl()
        if url in seen or should_skip(url):
            continue
        seen.add(url)

        dest = local_path(url)
        if dest is None:
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)

        is_text = dest.suffix.lower() in {".css", ".html", ".js", ""} or dest.name == "index.html"
        if dest.exists() and not is_text:
            continue

        print("GET", url)
        data = fetch(url)
        if data is None:
            continue

        ctype_guess = dest.suffix.lower()
        if ctype_guess in {".css"} or url.endswith(".css") or "text/css" in url:
            text = data.decode("utf-8", errors="replace")
            text = rewrite_css(text, url, queue)
            dest.write_text(text, encoding="utf-8")
        elif ctype_guess in {".html", ""} or dest.name == "index.html" or url.rstrip("/").endswith("mandalatickets.com"):
            text = data.decode("utf-8", errors="replace")
            text = rewrite_html(text, url, queue)
            dest.write_text(text, encoding="utf-8")
        elif ctype_guess in {".js"}:
            dest.write_bytes(data)
            text = data.decode("utf-8", errors="replace")
            for match in re.finditer(r"""['"](/assets/[^'"]+)['"]""", text):
                absu = abs_url(match.group(1), BASE)
                if absu:
                    queue.append(absu)
        else:
            dest.write_bytes(data)

    print("done", len(seen), "files")


if __name__ == "__main__":
    main()
