function getCategoryKey(categoryName = "") {
  const name = categoryName.toLowerCase();

  if (name.includes("frontend")) return "frontend";
  if (name.includes("design")) return "design";
  if (name.includes("backend")) return "backend";
  if (name.includes("general")) return "general";
  if (name.includes("ai")) return "ai";

  return "default";
}

export function getCategoryBadgeClass(categoryName = "") {
  return `feed-badge ${getCategoryKey(categoryName)}`;
}

export function getCategoryTitleBadgeClass(categoryName = "") {
  return `feed-pointer ${getCategoryKey(categoryName)}`;
}

export function getCategoryTitleClass(categoryName = "") {
  return `feed-text ${getCategoryKey(categoryName)}`;
}