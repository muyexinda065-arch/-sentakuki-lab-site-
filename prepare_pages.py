"""Apply GitHub's assigned Pages URL to the static publication files."""
import argparse
import re
from pathlib import Path
from urllib.parse import urlsplit

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', required=True)
parser.add_argument('--directory', default='site')
args = parser.parse_args()
url = args.base_url.rstrip('/')
parts = urlsplit(url)
if parts.scheme != 'https' or not parts.hostname or parts.username or parts.password or parts.query or parts.fragment:
    raise SystemExit('A valid assigned HTTPS Pages URL is required')
prefix = parts.path.rstrip('/')
root = Path(args.directory)
for path in root.rglob('*'):
    if not path.is_file() or path.suffix not in ('.html', '.xml', '.txt'):
        continue
    text = path.read_text()
    if path.suffix == '.html':
        text = re.sub(r'((?:href|src)=([\"\x27]))/(?!/)', lambda m: m.group(1) + prefix + '/', text)
    text = text.replace('https://publish.invalid', url)
    path.write_text(text)
(root / '.nojekyll').touch()
print('Assigned Pages URL and project-relative links applied.')
