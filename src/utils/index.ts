
/**
 * Generates a URL slug from a page name.
 * Converts to lowercase, replaces non-alphanumeric sequences with a single hyphen,
 * and trims leading/trailing hyphens.
 */
export function createPageUrl(pageName: string) {
    const slug = pageName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return '/' + slug;
}
