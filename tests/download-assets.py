"""Maintenance helper. Not needed to run the website."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import urllib.request
import re

root = Path(__file__).resolve().parents[1]
photos = {
    'hero-gloria': ('1517836357463-d25dfeac3438', 1920),
    'hero-laguna': ('1534438327276-14e5300c3a48', 1920),
    'gym': ('1534438327276-14e5300c3a48', 1000),
    'equipment': ('1540497077202-7c8a3999166f', 1000),
    'strength': ('1581009146145-b5ef050c2e1e', 1000),
    'functional': ('1599058917212-d750089bc07e', 900),
    'classes': ('1518611012118-696072aa579a', 900),
    'cardio': ('1538805060514-97d9cc17730c', 900),
    'mobility': ('1544367567-0f2fcb009e0b', 900),
    'conditioning': ('1571019613454-1cb2f99b2d8b', 900),
    'coach-one': ('1571019613454-1cb2f99b2d8b', 700),
    'coach-two': ('1548690312-e3b507d8c110', 700),
    'coach-three': ('1581009146145-b5ef050c2e1e', 700),
    'lockers': ('1571779547789-f1df8297bcda', 1000),
}

def fetch(item):
    name, (photo, width) = item
    url = f'https://images.unsplash.com/photo-{photo}?auto=format&fit=crop&w={width}&q=82&fm=webp'
    destination = root / 'assets/images' / f'{name}.webp'
    if not destination.exists():
        urllib.request.urlretrieve(url, destination)
    return f'{name}: {destination.stat().st_size // 1024} KB'

if __name__ == '__main__':
    with ThreadPoolExecutor(max_workers=6) as pool:
        for result in pool.map(fetch, photos.items()):
            print(result)
    for family, filename in [('Bebas+Neue', 'bebas-neue'), ('Oswald:wght@500', 'oswald'), ('Inter:wght@400;500;600;700', 'inter')]:
        req = urllib.request.Request('https://fonts.googleapis.com/css2?family=' + family + '&display=swap', headers={'User-Agent': 'Mozilla/5.0'})
        css = urllib.request.urlopen(req).read().decode()
        for block in re.findall(r'@font-face\s*\{([^}]+)\}', css):
            weight = re.search(r'font-weight:\s*(\d+)', block).group(1)
            url = re.search(r'url\((https://[^)]+)\)', block).group(1)
            ext = 'woff2' if '.woff2' in url else 'ttf'
            suffix = f'-{weight}' if filename == 'inter' and weight != '400' else ''
            urllib.request.urlretrieve(url, root / 'assets/fonts' / f'{filename}{suffix}.{ext}')
            print(filename + suffix, ext)
    for family in ['bebasneue', 'oswald', 'inter']:
        urllib.request.urlretrieve(f'https://raw.githubusercontent.com/google/fonts/main/ofl/{family}/OFL.txt', root / 'assets/fonts' / f'{family}-OFL.txt')
    credits = '# Fontes das fotografias\n\nFotografias ilustrativas do Unsplash; não representam a PULSE FITNESS nem as pessoas fictícias.\n\nLicença: https://unsplash.com/license\n\n'
    credits += '\n'.join(f'- {name}.webp: https://images.unsplash.com/photo-{photo}' for name, (photo, _) in photos.items())
    credits += '\n\nFontes: Google Fonts (Bebas Neue, Oswald e Inter), SIL Open Font License.\nhttps://github.com/google/fonts/tree/main/ofl/bebasneue\nhttps://github.com/google/fonts/tree/main/ofl/oswald\nhttps://github.com/google/fonts/tree/main/ofl/inter\n'
    (root / 'assets/CREDITS.md').write_text(credits, encoding='utf-8')
