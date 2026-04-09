import { Compass, Newspaper, Rss, RefreshCw } from "lucide-react";
import { SearchBar } from "../features/search/SearchBar";
import { LayoutToggle } from "../features/layout/LayoutToggle"
import { useAuth } from "../context/AuthContext";

function isTabActive(activeView, tab) {
  if (tab === "feed") {
    return (
      activeView.type === "all" ||
      activeView.type === "category" ||
      activeView.type === "feed"
    );
  }

  if (tab === "digest") {
    return activeView.type === "digest";
  }

  if (tab === "discover") {
    return activeView.type === "discover";
  }

  return false;
}

export function Topbar({
  query,
  onQueryChange,
  layout,
  onLayoutChange,
  goToHome,
  activeView,
  onChangeView,
  markAllRead,
  onRefresh,
}) {
  const { user, logout } = useAuth();

  return (
  <>
  <div className="fixed flex justify-center top-2 right-2 z-50 bg-white/80 backdrop-blur-sm">
    <LayoutToggle layout={layout} onChange={onLayoutChange} />
  </div>
    <header className="app-header">
      <div className="app-header-top">
        <div className="sm:w-[80%] flex justify-start items-center gap-3">
          <div onClick={goToHome} className="app-brand">
            <div className="app-brand-mark">F</div>
            <div className="app-brand-text">
              <h1 className="hidden sm:block app-brand-title font-bold">
                Frontpage
              </h1>
            </div>
          </div>
          <div className="app-header-tabs">
            <button
              type="button"
              className={`header-tab ${isTabActive(activeView, "feed") ? "active" : ""}`}
              onClick={() => onChangeView({ type: "all" })}
            >
              <Rss size={16} />
              Feed
            </button>
            <button
              type="button"
              className={`header-tab ${isTabActive(activeView, "digest") ? "active" : ""}`}
              onClick={() => onChangeView({ type: "digest" })}
            >
              <Newspaper size={16} />
              Digest
            </button>
            <button
              type="button"
              className={`header-tab ${isTabActive(activeView, "discover") ? "active" : ""}`}
              onClick={() => onChangeView({ type: "discover" })}
            >
              <Compass size={16} />
              Discover
            </button>
          </div>
        </div>
        <div className="app-header-actions w-full">
          <div className="app-header-search">
            <SearchBar value={query} onChange={onQueryChange} />
          </div>
          <div className="flex w-full gap-2">
            <button
              type="button"
              className="flex items-center justify-center gap-1 button button-secondary w-[40%] sm:w-[20%]"
              onClick={onRefresh}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              type="button"
              className="button flex justify-center w-[50%] sm:w-[20%] lg:w-[30%]"
              onClick={markAllRead}
            >
              Mark all read
            </button>
            <div className="flex items-center justify-end gap-2 w-[50%]">
          <span className="welcome">
            Hi {user?.firstName || "User"}
          </span>

          {user && (
            <div className="text-blue-500 cursor-pointer hover:text-blue-600" onClick={logout}>
              Logout
            </div>
          )}
        </div>
          </div>
        </div>
      </div>
    </header>
  </>
  );
}
