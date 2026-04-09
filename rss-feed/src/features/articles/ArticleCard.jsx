import { Bookmark, BookmarkCheck, CircleDot, Eye, EyeOff } from "lucide-react";

function timeAgo(value) {
  if (!value) return "No date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getCategoryTitleClass(categoryName = "") {
  const name = categoryName.toLowerCase();

  if (name.includes("frontend")) return "feed-text frontend active";
  if (name.includes("design")) return "feed-text design active";
  if (name.includes("backend")) return "feed-text backend active";
  if (name.includes("general")) return "feed-text general active";
  if (name.includes("ai")) return "feed-text ai active";

  return "feed-text default";
}

export function ArticleCard({
  article,
  isRead,
  isBookmarked,
  onOpen,
  onToggleBookmark,
  onToggleRead,
  layout,
}) {
  return (
    <article
      className={`article-row ${layout === "cards" ? "article-row-card" : ""} ${isRead ? "read" : "unread"}`}
    >
      <div
        className="article-row-main"
        onClick={() => onOpen(article)}
        role="button"
        tabIndex={0}
      >
        <div className="article-meta">
          <div className="flex items-center gap-1">
            {!isRead && <CircleDot size={10} className="article-unread-dot" />}
            <span className="article-source">{article.feedTitle}</span>
            <span>•</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
          <div className="article-actions">
            <button
              type="button"
              className="icon-button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleRead(article.id);
              }}
              aria-label={isRead ? "Mark as unread" : "Mark as read"}
              title={isRead ? "Mark as unread" : "Mark as read"}
            >
              {isRead ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleBookmark(article.id);
              }}
              aria-label={isBookmarked ? "Remove bookmark" : "Save article"}
              title={isBookmarked ? "Remove bookmark" : "Save article"}
            >
              {isBookmarked ? (
                <BookmarkCheck size={16} />
              ) : (
                <Bookmark size={16} />
              )}
            </button>
          </div>
        </div>
        <h3 className="article-title font-bold">{article.title}</h3>
        <p className="article-excerpt w-full">
          {article.excerpt || "No summary available for this article."}
        </p>
        <span
          className={`tag font-semibold ${getCategoryTitleClass(article.categoryName)}`}
        >
          {article.categoryName}
        </span>
      </div>
    </article>
  );
}
