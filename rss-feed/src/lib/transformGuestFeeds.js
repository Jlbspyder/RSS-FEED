function slugify(value = '') {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function buildGuestModelFromApi(data) {
  const feedEntries = data?.feeds ?? [];

  const categoriesMap = new Map();
  const feeds = [];
  const articles = [];

  feedEntries.forEach((entry) => {
    const feed = entry.feed;
    const items = entry.items ?? [];
    const categoryId = slugify(feed.category);
    const feedId = slugify(`${feed.category}-${feed.title}`);

    if (!categoriesMap.has(categoryId)) {
      categoriesMap.set(categoryId, {
        id: categoryId,
        name: feed.category,
      });
    }

    feeds.push({
      id: feedId,
      title: feed.title,
      description: feed.description || '',
      siteUrl: feed.siteUrl || '',
      feedUrl: feed.feedUrl,
      categoryId,
      categoryName: feed.category,
      health: feed.health,
      itemCount: feed.itemCount,
      lastFetchedAt: feed.lastFetchedAt,
    });

    items.forEach((item, index) => {
      articles.push({
        id: item.id || `${feedId}-${index}`,
        title: item.title || 'Untitled article',
        url: item.url || '',
        excerpt: item.excerpt || '',
        content: item.content || '',
        publishedAt: item.publishedAt || null,
        author: item.author || null,
        favicon: item.favicon || null,
        feedTitle: item.source || feed.title,
        feedId,
        categoryName: item.category || feed.category,
        categoryId,
        sourceUrl: item.sourceUrl || feed.siteUrl || '',
      });
    });
  });

  articles.sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });

  return {
    categories: Array.from(categoriesMap.values()),
    feeds,
    articles,
    errors: data?.errors ?? [],
    stats: data?.stats ?? null,
    fetchedAt: data?.fetchedAt ?? null,
  };
}