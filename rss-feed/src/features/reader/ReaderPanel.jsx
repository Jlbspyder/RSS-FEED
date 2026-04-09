import { Bookmark, BookmarkCheck, ExternalLink, X } from 'lucide-react'

function formatDate(value) {
  if (!value) return 'No date'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'No date'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function ReaderPanel({
  article,
  isBookmarked,
  onToggleBookmark,
  onClose,
  mobile = false,
}) {
  if (!article) {
    return (
      <div className={`reader ${mobile ? 'reader-mobile' : ''}`}>
        <div className="reader-empty">
          <h2>Select an article</h2>
          <p>Choose a story from the feed to read it here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`reader ${mobile ? 'reader-mobile' : ''}`}>
      <div className="reader-header">
        <button type="button" className="icon-button" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="reader-actions">
          <button
            type="button"
            className="icon-button"
            onClick={() => onToggleBookmark(article.id)}
          >
            {isBookmarked(article.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>

          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="icon-button"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      <div className="reader-body">
        <div className="reader-meta">
          <span>{article.feedTitle}</span>
          <span>•</span>
          <span>{article.categoryName}</span>
          <span>•</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        <h2 className="reader-title">{article.title}</h2>

        {article.content ? (
          <div
            className="reader-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : (
          <p className="reader-content">
            {article.excerpt || 'No article content available.'}
          </p>
        )}
      </div>
    </div>
  )
}