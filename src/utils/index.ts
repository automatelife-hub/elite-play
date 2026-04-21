


export function createPageUrl(pageName: string) {
    const slug = pageName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return '/' + slug;
}