const stopwords = [
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'has',
  'he',
  'in',
  'is',
  'it',
  'its',
  'of',
  'on',
  'that',
  'the',
  'to',
  'was',
  'were',
  'will',
  'with',
];

const highlightMatches = (text, query) => {
  // Ensure text is a string
  if (typeof text !== 'string' || !query) {
    return text; // Return as-is if not a string
  }

  // Escape special characters in the query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create a regular expression to match the query
  const regex = new RegExp(`${escapedQuery}`, 'gi');

  // Highlight the matches
  return text.replace(regex, '<mark>$&</mark>');
};

// Utulity function to highlight matches in a structured content
const highlightContent = (content, query) => {
  // Safeguard against invalid or non array content
  if (!content || !Array.isArray(content)) return content;

  return content.map((block) => {
    if (block.text) {
      return {
        ...block,
        text: highlightMatches(block.text, query),
      };
    }
    return block; // Return block unchanged if no text field exists
  });
};

export default {
  async search(ctx) {
    const query = ctx.query.query || '';
    const pageSize = ctx.query.pageSize || 5;

    // Remove stopwords from the query
    const filteredQuery = query
      .trim() // Remove leading/trailing spaces
      .split(' ')
      .filter((word) => !stopwords.includes(word.toLowerCase()))
      .join(' ');

    // Handle case where the query is completely filtered out
    if (!filteredQuery) {
      ctx.body = { events: [], pages: [] };
      return;
    }

    try {
      // Events
      const events = await strapi.entityService.findMany('api::event.event', {
        filters: {
          $or: [
            { title: { $contains: filteredQuery } },
            { content: { $contains: filteredQuery } },
          ],
        },
        limit: pageSize,
        fields: ['id', 'title', 'content'], // Return only these fields
      });

      // Pages
      const pages = await strapi.entityService.findMany('api::page.page', {
        filters: {
          $or: [
            { title: { $contains: filteredQuery } },
            { content: { $contains: filteredQuery } },
          ],
        },
        limit: pageSize,
        fields: ['id', 'title', 'content'],
      });

      // Highlight the matches
      const highlightedEvents = events.map((event) => ({
        ...event,
        title: highlightMatches(event.title, filteredQuery),
        content: highlightContent(event.content, filteredQuery),
      }));

      const highlightedPages = pages.map((page) => ({
        ...page,
        title: highlightMatches(page.title, filteredQuery),
        content: highlightContent(page.content, filteredQuery),
      }));

      // Combine and return the results
      ctx.body = {
        events: highlightedEvents,
        pages: highlightedPages,
      };
    } catch (error) {
      console.error('Error in customsearch', error);
      ctx.throw(500, error);
    }
  },
};
