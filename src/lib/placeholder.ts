export function ph(label: string, from: string, to: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100" viewBox="0 0 900 1100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="900" height="1100" fill="url(#g)"/><text x="450" y="535" font-family="Georgia,serif" font-size="52" font-weight="bold" fill="#fff7ec" text-anchor="middle">${label}</text><text x="450" y="600" font-family="Arial,sans-serif" font-size="24" fill="#fff7ec" opacity="0.85" text-anchor="middle">Nutty Delight · replace with photo</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
