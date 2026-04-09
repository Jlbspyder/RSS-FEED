import { useEffect, useMemo, useState } from "react";
import { Loader } from "lucide-react";
import { Sidebar } from "./features/feeds/Sidebar";
import { Topbar } from "./components/Topbar";
import { ArticleList } from "./features/articles/ArticleList";
import { ReaderPanel } from "./features/reader/ReaderPanel";
import { fetchGuestFeeds } from "./lib/api";
import { buildGuestModelFromApi } from "./lib/transformGuestFeeds";
import { readStorage, writeStorage } from "./lib/storage";
import { getCategoryTitleClass } from "./lib/categoryStyles";

const READ_KEY = "frontpage-read";
const BOOKMARK_KEY = "frontpage-bookmarks";
const LAYOUT_KEY = "frontpage-layout";

function getViewMeta(view, model) {
  if (view.type === "digest") {
    return {
      title: "Catch up",
      subtitle: "Unread stories since your last visit.",
    };
  }

  if (view.type === "saved") {
    return { title: "Saved", subtitle: "Your bookmarked reading list." };
  }

  if (view.type === "category") {
    const category = model.categories.find((item) => item.id === view.id);
    return {
      title: category?.name || "Category",
      subtitle: "Articles filtered by category.",
    };
  }

  if (view.type === "feed") {
    const feed = model.feeds.find((item) => item.id === view.id);
    return {
      title: feed?.title || "Feed",
      subtitle: feed?.description || "Articles filtered by feed.",
    };
  }

  return {
    title: "All articles",
    subtitle:
      "Your guest dashboard, powered by live RSS feed data.",
  };
}

const emptyModel = {
  categories: [],
  feeds: [],
  articles: [],
  errors: [],
  stats: null,
  fetchedAt: null,
};

export default function Dashboard({ onExitGuest, goToHome }) {
  const [model, setModel] = useState(emptyModel);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [view, setView] = useState({ type: "all" });
  const [query, setQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [mobileReader, setMobileReader] = useState(false);
  const [readIds, setReadIds] = useState(() => readStorage(READ_KEY, []));
  const [bookmarkIds, setBookmarkIds] = useState(() =>
    readStorage(BOOKMARK_KEY, []),
  );
  const [layout, setLayout] = useState(() => readStorage(LAYOUT_KEY, "cards"));

  useEffect(() => {
    writeStorage(READ_KEY, readIds);
  }, [readIds]);

  useEffect(() => {
    writeStorage(BOOKMARK_KEY, bookmarkIds);
  }, [bookmarkIds]);

  useEffect(() => {
    writeStorage(LAYOUT_KEY, layout);
  }, [layout]);

  useEffect(() => {
    async function loadGuestDashboard() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetchGuestFeeds();
        const nextModel = buildGuestModelFromApi(response);

        setModel(nextModel);
      } catch (error) {
        setLoadError(error.message || "Failed to load guest dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    loadGuestDashboard();
  }, []);

  const isRead = (id) => readIds.includes(id);
  const isBookmarked = (id) => bookmarkIds.includes(id);

  const filteredArticles = useMemo(() => {
    let items = [...model.articles];

    if (view.type === "discover") {
      items = [...model.articles];
    }

    if (view.type === "digest") {
      items = items.filter((article) => !readIds.includes(article.id));
    }

    if (view.type === "saved") {
      items = items.filter((article) => bookmarkIds.includes(article.id));
    }

    if (view.type === "category") {
      const category = model.categories.find((cat) => cat.id === view.id);
      items = items.filter(
        (article) => article.categoryName === category?.name,
      );
    }

    if (view.type === "feed") {
      const feed = model.feeds.find((item) => item.id === view.id);
      items = items.filter((article) => article.feedId === feed?.id);
    }

    if (query.trim()) {
      const needle = query.toLowerCase();
      items = items.filter(
        (article) =>
          article.title.toLowerCase().includes(needle) ||
          article.excerpt.toLowerCase().includes(needle) ||
          article.feedTitle.toLowerCase().includes(needle) ||
          article.categoryName.toLowerCase().includes(needle),
      );
    }

    return items;
  }, [model, view, query, readIds, bookmarkIds]);

  function toggleRead(id) {
    setReadIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function toggleBookmark(id) {
    setBookmarkIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }
  function openArticle(article) {
    setSelectedArticle(article);

    setReadIds((current) =>
      current.includes(article.id) ? current : [...current, article.id],
    );

    if (window.innerWidth <= 1100) {
      setMobileReader(true);
    }
  }
  function markAllRead() {
    const idsToMark = filteredArticles.map((article) => article.id);
    setReadIds((current) => Array.from(new Set([...current, ...idsToMark])));
  }

  const unreadCount = (categoryId) => {
    if (categoryId === "all") {
      return model.articles.filter((article) => !readIds.includes(article.id))
        .length;
    }

    const category = model.categories.find((item) => item.id === categoryId);

    return model.articles.filter(
      (article) =>
        article.categoryName === category?.name &&
        !readIds.includes(article.id),
    ).length;
  };

  const feedUnreadCount = (feedId) => {
    return model.articles.filter(
      (article) => article.feedId === feedId && !readIds.includes(article.id),
    ).length;
  };

  const meta = getViewMeta(view, model);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center" style={{ padding: "2rem" }}>
          <h1 className="text-blue-600">Loading Frontpage...</h1>
          <Loader style={{ color: "blue", width: "2rem", height: "2rem" }} />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <main className="flex flex-col" style={{ padding: "2rem" }}>
          <h1>Error loading dashboard</h1>
          <p className="text-center mb-2">{loadError}</p>
          <button className="button button-primary" onClick={() => window.location.reload()}>
            Try again
          </button>
          <button
            className="button mt-2"
            onClick={onExitGuest}
          >
            Back to landing
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Topbar
        query={query}
        onQueryChange={setQuery}
        layout={layout}
        onLayoutChange={setLayout}
        activeView={view}
        goToHome={goToHome}
        onChangeView={setView}
        markAllRead={markAllRead}
        onRefresh={() => window.location.reload()}
      />

      <div className="app-shell">
        <Sidebar
          categories={model.categories}
          feeds={model.feeds}
          activeView={view}
          onChangeView={setView}
          unreadCount={unreadCount}
          feedUnreadCount={feedUnreadCount}
          bookmarkCount={bookmarkIds.length}
        />

        <main className="main-panel mt-45 md:mt-25 lg:mt-23">
          <div
            className="toolbar"
            style={{ marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}
          >
            <span className={`active px-1 rounded-sm ${getCategoryTitleClass(meta.title)}`}>
              {filteredArticles.length} articles
            </span>
          </div>

          <div className="content-header -mt-8 sm:-mt-4 md:-mt-4">
            <h2 className="content-title font-semibold">{meta.title}</h2>
            <p className="content-subtitle">{meta.subtitle}</p>
          </div>

          <ArticleList
            articles={filteredArticles}
            layout={layout}
            isRead={isRead}
            isBookmarked={isBookmarked}
            onOpen={openArticle}
            onToggleRead={toggleRead}
            onToggleBookmark={toggleBookmark}
          />
        </main>

        <aside className="reader-panel">
          <ReaderPanel
            article={selectedArticle}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
            onClose={() => setSelectedArticle(null)}
          />
        </aside>
      </div>

      {mobileReader && (
        <ReaderPanel
          article={selectedArticle}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          onClose={() => setMobileReader(false)}
          mobile
        />
      )}
    </div>
  );
}
