import { ArticleCard } from './ArticleCard'

export function ArticleList({
  articles,
  layout,
  isRead,
  isBookmarked,
  onOpen,
  onToggleBookmark,
  onToggleRead,
}) {
  return (
    <>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          layout={layout}
          isRead={isRead(article.id)}
          isBookmarked={isBookmarked(article.id)}
          onOpen={onOpen}
          onToggleBookmark={onToggleBookmark}
          onToggleRead={onToggleRead}
        />
      ))}
    </>
  )
}