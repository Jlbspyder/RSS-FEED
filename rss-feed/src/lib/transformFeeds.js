import sampleFeeds from '../sampleFeeds.json';

function slugify(value) {
  return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function createDemoArticles(feed, categoryName, feedIndex) {
  return Array.from({ length: 4 }, (_, itemIndex) => {
    const publishedAt = new Date(Date.now() - (feedIndex * 6 + itemIndex + 1) * 3600 * 1000).toISOString();
    return {
      id: `${slugify(feed.title)}-${itemIndex + 1}`,
      feedTitle: feed.title,
      feedUrl: feed.feedUrl,
      siteUrl: feed.siteUrl,
      categoryName,
      title: `${feed.title}: sample article ${itemIndex + 1}`,
      excerpt: feed.description,
      content: `<p>${feed.description}</p><p>This is guest-mode demo content generated from your original JSON without modifying the source file. Later, the backend feed parser will replace this with live RSS/Atom content.</p>`,
      publishedAt,
      format: feed.format,
      notes: feed.notes || '',
      author: feed.title,
      url: feed.siteUrl
    };
  });
}

export function getRawFeedData() {
  return sampleFeeds;
}

export function buildGuestModel() {
  const categories = sampleFeeds.categories.map((category, categoryIndex) => {
    const feeds = category.feeds.map((feed, feedIndex) => ({
      ...feed,
      id: `${slugify(category.name)}-${slugify(feed.title)}`,
      categoryName: category.name,
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(feed.siteUrl).hostname}&sz=64`,
      articles: createDemoArticles(feed, category.name, categoryIndex * 10 + feedIndex)
    }));

    return {
      id: slugify(category.name),
      name: category.name,
      feeds
    };
  });

  const articles = categories
    .flatMap((category) => category.feeds.flatMap((feed) => feed.articles))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return {
    meta: {
      title: sampleFeeds.title,
      description: sampleFeeds.description,
      generated: sampleFeeds.generated,
      edgeCases: sampleFeeds.edgeCases
    },
    categories,
    feeds: categories.flatMap((category) => category.feeds),
    articles
  };
}
