import os

base_dir = r'C:UsersPokerConnectOneDriveDesktopCoding ProjectsAffiliate Softwareelite-playsrc'

SKIP_PARTS = [
    'App.jsx', 'Layout.jsx',
    'AIAdvisorCTA.jsx', 'FeaturedSites.jsx',
    'LatestArticles.jsx', 'NewHeroSection.jsx',
    'TopRatedSection.jsx', 'TrustIndicators.jsx',
    'GIALogo.jsx',
    'WhatsAppFloatingButton.jsx',
    'index.css', 'tailwind.config.js',
]

REPLACEMENTS = [
    ('emerald-950','blue-950'),('emerald-900','blue-950'),('emerald-800','blue-900'),
    ('emerald-700','blue-800'),('emerald-600','blue-600'),('emerald-500','blue-500'),
    ('emerald-400','blue-400'),('emerald-300','blue-300'),('emerald-200','blue-200'),
    ('emerald-100','blue-100'),('emerald-50','blue-50'),
    ('cyan-950','blue-950'),('cyan-900','blue-950'),('cyan-800','blue-900'),
    ('cyan-700','blue-800'),('cyan-600','blue-600'),('cyan-500','blue-500'),
    ('cyan-400','blue-400'),('cyan-300','blue-300'),('cyan-200','blue-200'),
    ('cyan-100','blue-100'),('cyan-50','blue-50'),
    ('teal-700','blue-800'),('teal-600','blue-600'),('teal-500','blue-500'),
    ('teal-400','blue-400'),('teal-300','blue-300'),('teal-200','blue-200'),
    ('from-slate-950','from-[#080C14]'),('to-slate-950','to-[#080C14]'),('via-slate-950','via-[#080C14]'),
    ('from-slate-900','from-[#0D1424]'),('to-slate-900','to-[#0D1424]'),('via-slate-900','via-[#0D1424]'),
    ('from-slate-800','from-[#141E35]'),('to-slate-800','to-[#141E35]'),('via-slate-800','via-[#141E35]'),
    ('from-gray-950','from-[#080C14]'),('to-gray-950','to-[#080C14]'),('via-gray-950','via-[#080C14]'),
    ('from-gray-900','from-[#0D1424]'),('to-gray-900','to-[#0D1424]'),('via-gray-900','via-[#0D1424]'),
    ('from-gray-800','from-[#141E35]'),('to-gray-800','to-[#141E35]'),('via-gray-800','via-[#141E35]'),
    ('hover:bg-slate-900','hover:bg-[#0D1424]'),('hover:bg-slate-800','hover:bg-[#141E35]'),
    ('hover:bg-slate-700','hover:bg-[#1E2D4A]'),('hover:bg-gray-900','hover:bg-[#0D1424]'),
    ('hover:bg-gray-800','hover:bg-[#141E35]'),('hover:bg-gray-700','hover:bg-[#1E2D4A]'),
    ('bg-slate-950','bg-[#080C14]'),('bg-slate-900','bg-[#0D1424]'),
    ('bg-slate-800','bg-[#141E35]'),('bg-slate-700','bg-[#1E2D4A]'),
    ('bg-slate-50','bg-[#141E35]'),('bg-slate-100','bg-[#141E35]'),
    ('bg-gray-950','bg-[#080C14]'),('bg-gray-900','bg-[#0D1424]'),
    ('bg-gray-800','bg-[#141E35]'),('bg-gray-700','bg-[#1E2D4A]'),
    ('border-slate-900','border-white/10'),('border-slate-800','border-white/10'),
    ('border-slate-700','border-white/10'),('border-slate-600','border-white/15'),
    ('border-gray-900','border-white/10'),('border-gray-800','border-white/10'),
    ('border-gray-700','border-white/10'),('border-gray-600','border-white/15'),
    ('ring-slate-700','ring-blue-500/30'),('ring-slate-800','ring-blue-500/20'),
    ('ring-gray-700','ring-blue-500/30'),('ring-gray-800','ring-blue-500/20'),
    ('divide-slate-700','divide-white/10'),('divide-gray-700','divide-white/10'),
    ('text-slate-900','text-white'),('text-slate-800','text-gray-100'),
    ('text-slate-700','text-gray-200'),('text-slate-600','text-gray-400'),
    ('focus:border-slate-600','focus:border-blue-500'),('focus:border-slate-500','focus:border-blue-500'),
    ('focus:border-gray-600','focus:border-blue-500'),('focus:border-gray-500','focus:border-blue-500'),
    ('focus:ring-slate-500','focus:ring-blue-500'),('focus:ring-gray-500','focus:ring-blue-500'),
]

files_changed = []

for root, dirs, files in os.walk(base_dir):
    dirs[:] = [d for d in dirs if d != 'node_modules']
    for fname in files:
        if not fname.endswith(('.jsx', '.tsx', '.js', '.ts')):
            continue
        fpath = os.path.join(root, fname)
        if any(s in fpath for s in SKIP_PARTS):
            continue
        try:
            with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
                original = f.read()
            content = original
            for old, new in REPLACEMENTS:
                content = content.replace(old, new)
            if content != original:
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(content)
                files_changed.append(os.path.relpath(fpath, base_dir))
        except Exception as e:
            print(f'ERROR {fpath}: {e}')

print(f'MIGRATION COMPLETE')
print(f'Files changed: {len(files_changed)}')
for f in sorted(files_changed):
    print(f'  {f}')
