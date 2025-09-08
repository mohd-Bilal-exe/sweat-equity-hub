export function createPageUrl(pageName: string, id?: string) {
  const basePage = pageName.toLowerCase().replace(/ /g, '-');
  return id ? `/${basePage}/${id}` : `/${basePage}`;
}
