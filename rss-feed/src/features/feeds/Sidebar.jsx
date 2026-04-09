import { Bookmark, Home, Newspaper } from "lucide-react";
import { getCategoryBadgeClass, getCategoryTitleBadgeClass, getCategoryTitleClass } from "../../lib/categoryStyles";


function isActiveView(activeView, type, id = null) {
  if (!activeView) return false;
  if (activeView.type !== type) return false;
  if (id === null) return true;
  return activeView.id === id;
}
function getFeedInitial(title = "") {
  return title.trim().charAt(0).toUpperCase();
}

export function Sidebar({
  categories,
  feeds,
  activeView,
  onChangeView,
  unreadCount,
  feedUnreadCount,
  bookmarkCount,
}) {
  const totalUnread = unreadCount("all");

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="badge">Frontpage</div>
        <h1 className="sidebar-heading">Your reading dashboard</h1>
        <p className="sidebar-copy">
          Guest mode is loaded with curated feeds so the product feels alive
          from the first click.
        </p>
      </div>

      <div className="sidebar-block">
        <div className="sidebar-label">Views</div>

        <div className="nav-list">
          <button
            className={`nav-item ${isActiveView(activeView, "all") ? "active" : ""}`}
            onClick={() => onChangeView({ type: "all" })}
            type="button"
          >
            <span className="nav-item-left">
              <Home size={16} />
              Unread articles
            </span>
            <span className="count-pill">{totalUnread}</span>
          </button>

          <button
            className={`nav-item ${isActiveView(activeView, "digest") ? "active" : ""}`}
            onClick={() => onChangeView({ type: "digest" })}
            type="button"
          >
            <span className="nav-item-left">
              <Newspaper size={16} />
              Catch up
            </span>
          </button>

          <button
            className={`nav-item ${isActiveView(activeView, "saved") ? "active" : ""}`}
            onClick={() => onChangeView({ type: "saved" })}
            type="button"
          >
            <span className="nav-item-left">
              <Bookmark size={16} />
              Saved
            </span>
            <span className="count-pill">{bookmarkCount}</span>
          </button>
        </div>
      </div>

      <div className="sidebar-block">
        <div className="sidebar-label">Categories</div>

        <div className="category-groups">
          {categories.map((category) => {
            const categoryFeeds = feeds.filter(
              (feed) => feed.categoryId === category.id,
            );

            return (
              <section className="category-group" key={category.id}>
                <button
                  className={`category-row ${
                    isActiveView(activeView, "category", category.id)
                      ? `active ${getCategoryTitleClass(category.name)}`
                      : ""
                  }`}
                  onClick={() =>
                    onChangeView({ type: "category", id: category.id })
                  }
                  type="button"
                >
                  <div className="flex items-center gap-6 w-full">
                    <span
                      className={getCategoryTitleBadgeClass(category.name)}
                    ></span>
                    <span
                      className={`font-bold -ml-3 ${getCategoryTitleClass(category.name)}`}
                    >
                      {category.name}
                    </span>
                  </div>
                  <span className="count-pill">{unreadCount(category.id)}</span>
                </button>

                <div className="feed-list">
                  {feeds
                    .filter((feed) => feed.categoryId === category.id)
                    .map((feed) => (
                      <button
                        key={feed.id}
                        className={`nav-item feed-item ${
                          activeView.type === "feed" &&
                          activeView.id === feed.id
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          onChangeView({ type: "feed", id: feed.id })
                        }
                        type="button"
                      >
                        <div className="flex items-center w-full">
                          <span
                            className={getCategoryBadgeClass(category.name)}
                          >
                            {getFeedInitial(feed.title)}
                          </span>
                          <span className="ml-2">{feed.title}</span>
                        </div>
                        <span className="count-pill">
                          {feedUnreadCount(feed.id)}
                        </span>
                      </button>
                    ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
