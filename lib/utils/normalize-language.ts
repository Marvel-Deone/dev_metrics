const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Go: "#00ADD8",
  Python: "#3572A5",
  Java: "#b07219",
  Ruby: "#701516",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  "Objective-C": "#438eff",
  Rust: "#dea584",
};


interface RawLanguage {
  language: string;
  percentage: number;
}

interface DashboardLanguage {
  name: string;
  value: number;
  color: string;
}

export function toDashboardLanguages(
  raw: RawLanguage[],
  limit = 5
): DashboardLanguage[] {
  return raw
    .filter(l => l.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, limit)
    .map(l => ({
      name: l.language,
      value: l.percentage,
      color: LANGUAGE_COLORS[l.language] || "#94a3b8",
    }));
}
