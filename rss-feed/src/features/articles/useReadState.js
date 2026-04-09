import { useEffect, useState } from 'react'
import { loadStoredArray, saveStoredArray } from '../../lib/storage'

const KEY = 'frontpage_read_articles'

export function useReadState() {
  const [readIds, setReadIds] = useState(() => loadStoredArray(KEY))

  useEffect(() => {
    saveStoredArray(KEY, readIds)
  }, [readIds])

  const markRead = (articleId) => {
    setReadIds((current) => (current.includes(articleId) ? current : [...current, articleId]))
  }

  const toggleRead = (articleId) => {
    setReadIds((current) =>
      current.includes(articleId)
        ? current.filter((id) => id !== articleId)
        : [...current, articleId]
    )
  }

  return { readIds, markRead, toggleRead }
}
