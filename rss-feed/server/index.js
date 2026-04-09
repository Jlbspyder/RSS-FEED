import express from 'express';
import cors from 'cors';
import Parser from 'rss-parser';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const parser = new Parser({
  timeout: 10000,
  customFields: {
    feed: ['language', 'image'],
    item: [
      'media:content',
      'content:encoded',
      'description',
      'summary',
      'published',
      'updated',
    ],
  },
});

const guestFeeds = [
  {
    category: 'Frontend',
    title: 'CSS-Tricks',
    feedUrl: 'https://css-tricks.com/feed/',
    siteUrl: 'https://css-tricks.com/',
  },
  {
    category: 'Frontend',
    title: 'Smashing Magazine',
    feedUrl: 'https://www.smashingmagazine.com/feed/',
    siteUrl: 'https://www.smashingmagazine.com/',
  },
  {
    category: 'Frontend',
    title: 'Josh W. Comeau',
    feedUrl: 'https://www.joshwcomeau.com/rss.xml',
    siteUrl: 'https://www.joshwcomeau.com/',
  },
  {
    category: 'Frontend',
    title: 'Kent C. Dodds',
    feedUrl: 'https://kentcdodds.com/blog/rss.xml',
    siteUrl: 'https://kentcdodds.com/',
  },
  {
    category: 'Frontend',
    title: 'web.dev',
    feedUrl: 'https://web.dev/feed.xml',
    siteUrl: 'https://web.dev/',
  },
  {
    category: 'Frontend',
    title: 'MDN Blog',
    feedUrl: 'https://developer.mozilla.org/en-US/blog/rss.xml',
    siteUrl: 'https://developer.mozilla.org/en-US/blog/',
  },
  {
    category: 'Design',
    title: 'Sidebar.io',
    feedUrl: 'https://sidebar.io/feed.xml',
    siteUrl: 'https://sidebar.io/',
  },
  {
    category: 'Design',
    title: 'Nielsen Norman Group',
    feedUrl: 'https://www.nngroup.com/feed/rss/',
    siteUrl: 'https://www.nngroup.com/',
  },
  {
    category: 'Design',
    title: 'Figma Blog',
    feedUrl: 'https://www.figma.com/blog/feed/',
    siteUrl: 'https://www.figma.com/blog/',
  },
  {
    category: 'Design',
    title: 'A List Apart',
    feedUrl: 'https://alistapart.com/main/feed/',
    siteUrl: 'https://alistapart.com/',
  },
  {
    category: 'Design',
    title: 'UX Collective',
    feedUrl: 'https://uxdesign.cc/feed',
    siteUrl: 'https://uxdesign.cc/',
  },
  {
    category: 'Backend & DevOps',
    title: 'Cloudflare Blog',
    feedUrl: 'https://blog.cloudflare.com/rss/',
    siteUrl: 'https://blog.cloudflare.com/',
  },
  {
    category: 'Backend & DevOps',
    title: 'Vercel Blog',
    feedUrl: 'https://vercel.com/atom',
    siteUrl: 'https://vercel.com/blog',
  },
  {
    category: 'Backend & DevOps',
    title: 'The GitHub Blog',
    feedUrl: 'https://github.blog/feed/',
    siteUrl: 'https://github.blog/',
  },
  {
    category: 'Backend & DevOps',
    title: 'Netlify Blog',
    feedUrl: 'https://www.netlify.com/blog/index.xml',
    siteUrl: 'https://www.netlify.com/blog/',
  },
  {
    category: 'General Tech',
    title: 'The Pragmatic Engineer',
    feedUrl: 'https://blog.pragmaticengineer.com/rss/',
    siteUrl: 'https://blog.pragmaticengineer.com/',
  },
  {
    category: 'General Tech',
    title: 'Hacker News Best',
    feedUrl: 'https://hnrss.org/best',
    siteUrl: 'https://news.ycombinator.com/',
  },
  {
    category: 'AI & ML',
    title: "Simon Willison's Weblog",
    feedUrl: 'https://simonwillison.net/atom/everything/',
    siteUrl: 'https://simonwillison.net/',
  },
  {
    category: 'AI & ML',
    title: 'Hugging Face Blog',
    feedUrl: 'https://huggingface.co/blog/feed.xml',
    siteUrl: 'https://huggingface.co/blog',
  },
];

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getExcerpt(item) {
  const raw =
    item.contentSnippet ||
    item.summary ||
    item.content ||
    item['content:encoded'] ||
    item.description ||
    '';

  return stripHtml(raw).slice(0, 220);
}

function getPublishedDate(item) {
  return item.isoDate || item.pubDate || item.published || item.updated || null;
}

function normalizeFeedItem(item, feedMeta, parsedFeed) {
  return {
    id: item.guid || item.id || item.link,
    title: item.title || 'Untitled article',
    url: item.link || '',
    source: parsedFeed.title || feedMeta.title || 'Unknown source',
    sourceUrl: parsedFeed.link || feedMeta.siteUrl || '',
    category: feedMeta.category,
    publishedAt: getPublishedDate(item),
    author: item.creator || item.author || null,
    excerpt: getExcerpt(item),
    content:
      item['content:encoded'] ||
      item.content ||
      item.summary ||
      item.description ||
      '',
    favicon: parsedFeed.image?.url || null,
    feedUrl: feedMeta.feedUrl,
  };
}

function getFeedHealth(parsedFeed) {
  const latestItem = parsedFeed.items?.[0];
  const latestDate = latestItem
    ? new Date(
        latestItem.isoDate ||
          latestItem.pubDate ||
          latestItem.published ||
          latestItem.updated ||
          0
      )
    : null;

  if (!latestDate || Number.isNaN(latestDate.getTime())) {
    return 'active';
  }

  const diffDays = (Date.now() - latestDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 30 ? 'stale' : 'active';
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Frontpage server is healthy.' });
});

app.get('/api/guest-meta', (_req, res) => {
  res.json({
    mode: 'guest',
    note: 'Server is returning guest metadata correctly.',
    curatedFeedCount: guestFeeds.length,
  });
});

app.get("/whoami", (req, res) => {
  res.json({ server: "THIS_IS_MY_CURRENT_BACKEND" });
});

app.post('/api/feed/parse', async (req, res) => {
  const { feedUrl } = req.body;cd

  if (!feedUrl) {
    return res.status(400).json({
      ok: false,
      message: 'feedUrl is required.',
    });
  }

  try {
    const feed = await parser.parseURL(feedUrl);

    const normalizedItems = (feed.items || []).map((item) =>
      normalizeFeedItem(
        item,
        { title: feed.title, siteUrl: feed.link, category: 'Custom', feedUrl },
        feed
      )
    );

    res.json({
      ok: true,
      feed: {
        title: feed.title || 'Untitled feed',
        description: feed.description || '',
        siteUrl: feed.link || '',
        feedUrl,
        itemCount: normalizedItems.length,
        health: getFeedHealth(feed),
        lastFetchedAt: new Date().toISOString(),
      },
      items: normalizedItems,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Failed to fetch or parse feed.',
      error: error.message,
    });
  }
});

app.get('/api/guest-feeds', async (_req, res) => {
  const results = await Promise.allSettled(
    guestFeeds.map(async (feedMeta) => {
      const parsedFeed = await parser.parseURL(feedMeta.feedUrl);

      const items = (parsedFeed.items || []).slice(0, 12).map((item) =>
        normalizeFeedItem(item, feedMeta, parsedFeed)
      );

      return {
        feed: {
          category: feedMeta.category,
          title: parsedFeed.title || feedMeta.title,
          description: parsedFeed.description || '',
          siteUrl: parsedFeed.link || feedMeta.siteUrl,
          feedUrl: feedMeta.feedUrl,
          itemCount: items.length,
          health: getFeedHealth(parsedFeed),
          lastFetchedAt: new Date().toISOString(),
        },
        items,
      };
    })
  );

  const feeds = [];
  const errors = [];

  results.forEach((result, index) => {
    const source = guestFeeds[index];

    if (result.status === 'fulfilled') {
      feeds.push(result.value);
    } else {
      errors.push({
        category: source.category,
        title: source.title,
        feedUrl: source.feedUrl,
        health: 'error',
        message: result.reason?.message || 'Unknown feed error',
      });
    }
  });

  res.json({
    ok: true,
    fetchedAt: new Date().toISOString(),
    feeds,
    errors,
    stats: {
      total: guestFeeds.length,
      successful: feeds.length,
      failed: errors.length,
    },
  });
});

app.listen(port, () => {
  console.log(`Frontpage server running on http://localhost:${port}`);
});