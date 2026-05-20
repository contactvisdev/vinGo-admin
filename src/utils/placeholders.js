// Base64-encoded minimal gray SVG placeholder (avoids external dependency on placehold.co)
const svgPlaceholder = (w, h) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'%3E%3Crect width='100%25' height='100%25' fill='%23e9ecef'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236c757d' font-family='sans-serif' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E`;

export const PLACEHOLDER_50 = svgPlaceholder(50, 50);
export const PLACEHOLDER_80x50 = svgPlaceholder(80, 50);
export const PLACEHOLDER_AVATAR = svgPlaceholder(120, 120);
