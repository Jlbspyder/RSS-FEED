import { useEffect, useState } from 'react'
import { loadStoredArray, saveStoredArray } from '../../lib/storage'

const KEY = 'frontpage_bookmarks'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => loadStoredArray(KEY))

  useEffect(() => {
    saveStoredArray(KEY, bookmarks)
  }, [bookmarks])

  const toggleBookmark = (articleId) => {
    setBookmarks((current) =>
      current.includes(articleId)
        ? current.filter((id) => id !== articleId)
        : [...current, articleId]
    )
  }

  return { bookmarks, toggleBookmark }
}
