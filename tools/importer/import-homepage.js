/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import columnsParser from './parsers/columns.js';
import cardsParser from './parsers/cards.js';
import storyCardParser from './parsers/story-card.js';
import dashboardCardParser from './parsers/dashboard-card.js';
import pressReleasesParser from './parsers/press-releases.js';

// TRANSFORMER IMPORTS
import abbvieCleanupTransformer from './transformers/abbvie-cleanup.js';
import abbvieSectionsTransformer from './transformers/abbvie-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'columns': columnsParser,
  'cards': cardsParser,
  'story-card': storyCardParser,
  'dashboard-card': dashboardCardParser,
  'press-releases': pressReleasesParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'AbbVie corporate homepage with hero banner, content sections, and promotional cards',
  urls: ['https://www.abbvie.com/'],
  blocks: [
    {
      name: 'hero',
      instances: ['.homepage-hero-controller .cmp-home-hero'],
    },
    {
      name: 'columns',
      instances: [
        '.container.homepage-overlap .grid.cmp-grid-custom',
        '.grid:has(.cardpagestory.card-dashboard):has(.dashboardcards)',
        '.container.default-radius.cmp-container-xxx-large .grid.cmp-grid-custom',
        '.grid:has(.cardpagestory.card-dashboard.medium-theme):has(.dashboardcards.light-theme-stroke)',
        '.container.large-radius.cmp-container-full-width .grid.cmp-grid-custom',
      ],
    },
    {
      name: 'cards',
      instances: ['.grid.cmp-grid-custom.no-bottom-margin:has(.cmp-image)'],
    },
    {
      name: 'story-card',
      instances: [
        '.cardpagestory.card-standard',
        '.cardpagestory.card-dashboard.show-image-hide-desc',
        '.cardpagestory.card-dashboard.medium-theme',
        '.cardpagestory.card-dashboard.hide-description',
      ],
    },
    {
      name: 'dashboard-card',
      instances: [
        '.dashboardcards.medium-theme.hide-image',
        '.dashboardcards.dark-theme.hide-image',
        '.dashboardcards.light-theme-stroke',
        '.dashboardcards.hide-image:not(.medium-theme):not(.dark-theme)',
        '.dashboardcards.light-theme-no-stroke',
      ],
    },
    {
      name: 'press-releases',
      instances: ['.carousel.cmp-carousel--rss'],
    },
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero Banner',
      selector: '.homepage-hero-controller',
      style: null,
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-news-featured',
      name: 'Press Releases & Featured Story',
      selector: '.container.homepage-overlap',
      style: null,
      blocks: ['columns', 'press-releases', 'story-card'],
      defaultContent: [],
    },
    {
      id: 'section-patients',
      name: 'Patients Teaser',
      selector: '.teaser:nth-of-type(1)',
      style: null,
      blocks: [],
      defaultContent: ['.teaser:first-of-type .cmp-teaser'],
    },
    {
      id: 'section-science',
      name: 'Science & Innovation',
      selector: ['.teaser:has(#section-science)', '.grid:has(.cardpagestory.card-dashboard):has(.dashboardcards)'],
      style: null,
      blocks: ['columns', 'story-card', 'dashboard-card'],
      defaultContent: ['.teaser:has(#section-science) .cmp-teaser'],
    },
    {
      id: 'section-podcast',
      name: 'Podcast Promo',
      selector: '.container.default-radius.cmp-container-xxx-large',
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'section-culture',
      name: 'Culture',
      selector: ['.teaser.light-theme', '.grid.cmp-grid-custom.no-bottom-margin:has(.cmp-image)'],
      style: 'light',
      blocks: ['cards'],
      defaultContent: ['.teaser.light-theme .cmp-teaser'],
    },
    {
      id: 'section-careers',
      name: 'Explore Opportunities',
      selector: '.container.abbvie-container.medium-radius.cmp-container-xxx-large.height-short',
      style: 'dark',
      blocks: [],
      defaultContent: ['.container.abbvie-container .cmp-teaser'],
    },
    {
      id: 'section-investors',
      name: 'Investor Resources',
      selector: ['.teaser:has(#section-investors)', '.grid:has(.cardpagestory.card-dashboard.medium-theme):has(.dashboardcards.light-theme-stroke)'],
      style: null,
      blocks: ['columns', 'story-card', 'dashboard-card'],
      defaultContent: ['.teaser:has(#section-investors) .cmp-teaser'],
    },
    {
      id: 'section-esg',
      name: 'ESG',
      selector: ['.teaser:has(#section-esg)', '.container.large-radius.cmp-container-full-width:has(.dashboardcards):has(.cardpagestory)'],
      style: null,
      blocks: ['columns', 'dashboard-card', 'story-card'],
      defaultContent: ['.teaser:has(#section-esg) .cmp-teaser'],
    },
  ],
};

// TRANSFORMER REGISTRY
// Section transformer runs after cleanup in afterTransform hook
const transformers = [
  abbvieCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [abbvieSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 * Processes blocks in a specific order: nested blocks (story-card, dashboard-card,
 * press-releases) before container blocks (columns) to avoid double-processing.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const processedElements = new Set();

  // Process nested/leaf blocks first, then container blocks
  const blockOrder = ['hero', 'story-card', 'dashboard-card', 'press-releases', 'cards', 'columns'];

  blockOrder.forEach((blockName) => {
    const blockDef = template.blocks.find((b) => b.name === blockName);
    if (!blockDef) return;

    blockDef.instances.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          // Skip elements already processed by a more specific parser
          if (processedElements.has(element)) return;

          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null,
          });
          processedElements.add(element);
        });
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`, e.message);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
