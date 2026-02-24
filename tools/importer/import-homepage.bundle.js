var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const activeSlide = element.querySelector(".cmp-home-hero__primary.active, .cmp-home-hero__primary");
    const sourceEl = activeSlide || element;
    const bgImg = sourceEl.querySelector("img.cmp-container__bg-image");
    let imgEl = null;
    if (bgImg) {
      imgEl = document.createElement("img");
      imgEl.src = bgImg.getAttribute("src") || bgImg.getAttribute("data-cmp-src") || "";
      imgEl.alt = bgImg.getAttribute("alt") || "";
    }
    const imageCell = document.createDocumentFragment();
    if (imgEl) {
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(imgEl);
    }
    const heading = sourceEl.querySelector("h1.cmp-title__text, h1, .cmp-title__text");
    const ctaLink = sourceEl.querySelector(".cmp-text a, .anchor-link a");
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.trim();
      textCell.appendChild(h1);
    }
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.getAttribute("href") || "";
      a.textContent = ctaLink.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    }
    const cells = [
      [imageCell],
      [textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const gridRow = element.querySelector(".grid-row, .grid-container > .grid-row");
    if (!gridRow) {
      const cells2 = [Array.from(element.children)];
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns", cells: cells2 });
      element.replaceWith(block2);
      return;
    }
    const gridCells = Array.from(gridRow.querySelectorAll(':scope > .grid-cell, :scope > [class*="grid-row__col"]'));
    const contentCells = gridCells.filter((cell) => {
      const isSmallSpacer = cell.classList.contains("grid-row__col-with-1");
      const hasContent = cell.children.length > 0;
      return !isSmallSpacer || hasContent;
    });
    const row = contentCells.map((cell) => {
      const frag = document.createDocumentFragment();
      Array.from(cell.children).forEach((child) => {
        frag.appendChild(child);
      });
      return frag;
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse3(element, { document }) {
    const cardItems = element.querySelectorAll(".grid-row__col-with-4.grid-cell, .grid-cell[data-priority]");
    const cells = [];
    cardItems.forEach((card) => {
      const imgWrapper = card.querySelector(".cmp-image");
      let imgEl = null;
      if (imgWrapper) {
        const realSrc = imgWrapper.getAttribute("data-cmp-src");
        const imgTag = imgWrapper.querySelector("img");
        imgEl = document.createElement("img");
        imgEl.src = realSrc || imgTag && imgTag.getAttribute("src") || "";
        imgEl.alt = imgTag && imgTag.getAttribute("alt") || "";
      }
      const imageCell = document.createDocumentFragment();
      if (imgEl) {
        imageCell.appendChild(document.createComment(" field:image "));
        imageCell.appendChild(imgEl);
      }
      const textParagraph = card.querySelector(".cmp-text p, .cmp-text");
      const ctaButton = card.querySelector("a.cmp-button, .button a");
      const ctaText = card.querySelector(".cmp-button__text");
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (textParagraph) {
        const p = document.createElement("p");
        p.textContent = textParagraph.textContent.trim();
        textCell.appendChild(p);
      }
      if (ctaButton) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = ctaButton.getAttribute("href") || "";
        a.textContent = ctaText && ctaText.textContent.trim() || ctaButton.textContent.trim();
        p.appendChild(a);
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/story-card.js
  function parse4(element, { document }) {
    const linkWrapper = element.querySelector("a[href]");
    const cardHref = linkWrapper ? linkWrapper.getAttribute("href") : "";
    const cardImg = element.querySelector("img.card-image, .card-image-container img");
    let imgEl = null;
    if (cardImg) {
      imgEl = document.createElement("img");
      imgEl.src = cardImg.getAttribute("src") || "";
      imgEl.alt = cardImg.getAttribute("alt") || "";
    }
    const imageCell = document.createDocumentFragment();
    if (imgEl) {
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(imgEl);
    }
    const eyebrow = element.querySelector('.card-metadata-tag, .card-eyebrow, span[role="heading"]');
    const title = element.querySelector("h4.card-title, .card-title");
    const description = element.querySelector("p.card-description, .card-description");
    const cta = element.querySelector('.card-cta-read-article, .card-cta, [class*="card-cta"]');
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (eyebrow) {
      const p = document.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      textCell.appendChild(p);
    }
    if (title) {
      const h4 = document.createElement("h4");
      h4.textContent = title.textContent.trim();
      textCell.appendChild(h4);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }
    if (cta) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = cardHref || "";
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    }
    const cells = [
      [imageCell],
      [textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "story-card", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/dashboard-card.js
  function parse5(element, { document }) {
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    const linkList = element.querySelector(".dashboard-card_link__list, .linkcard-links");
    if (linkList) {
      const eyebrow = element.querySelector(".linkcard-eyebrow");
      const title = element.querySelector("h5.linkcard-title, .linkcard-title");
      const links = element.querySelectorAll("a.linkcard-link");
      if (eyebrow) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textCell.appendChild(p);
      }
      if (title) {
        const h5 = document.createElement("h5");
        h5.textContent = title.textContent.trim();
        textCell.appendChild(h5);
      }
      if (links.length > 0) {
        const ul = document.createElement("ul");
        links.forEach((link) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = link.getAttribute("href") || "";
          const linkText = link.querySelector(".link-text");
          a.textContent = linkText ? linkText.textContent.trim() : link.textContent.trim();
          li.appendChild(a);
          ul.appendChild(li);
        });
        textCell.appendChild(ul);
      }
    } else {
      const eyebrow = element.querySelector(".eyebrow");
      const dataPoint = element.querySelector(".data-point");
      const suffix = element.querySelector(".data-point-suffix");
      const description = element.querySelector(".description");
      if (eyebrow) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textCell.appendChild(p);
      }
      if (dataPoint || suffix) {
        const p = document.createElement("p");
        const span = document.createElement("span");
        span.className = "data-point";
        span.textContent = dataPoint ? dataPoint.textContent.trim() : "";
        p.appendChild(span);
        if (suffix) {
          const suffixSpan = document.createElement("span");
          suffixSpan.className = "suffix";
          suffixSpan.textContent = suffix.textContent.trim();
          p.appendChild(suffixSpan);
        }
        textCell.appendChild(p);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.appendChild(p);
      }
    }
    const cells = [
      [textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "dashboard-card", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/press-releases.js
  function parse6(element, { document }) {
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    const slides = element.querySelectorAll(".splide__slide");
    if (slides.length > 0) {
      const ul = document.createElement("ul");
      slides.forEach((slide) => {
        const link = slide.querySelector("a.carousel-rss__link");
        const eyebrow = slide.querySelector(".carousel-rss__eyebrow");
        const title = slide.querySelector(".carousel-rss__title");
        if (link && title) {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = link.getAttribute("href") || "";
          let text = "";
          if (eyebrow) {
            text = eyebrow.textContent.trim() + " - ";
          }
          text += title.textContent.trim();
          a.textContent = text;
          li.appendChild(a);
          ul.appendChild(li);
        }
      });
      textCell.appendChild(ul);
    }
    const cells = [
      [textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "press-releases", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/abbvie-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[class*="cookie"]',
        ".cmp-modal",
        ".modal-overlay"
      ]);
      element.querySelectorAll("img[data-cmp-src]").forEach((img) => {
        const realSrc = img.getAttribute("data-cmp-src");
        if (realSrc && realSrc.includes("scene7.com")) {
          img.setAttribute("src", realSrc);
        }
      });
      WebImporter.DOMUtils.remove(element, [
        ".cmp-video.cmp-video--youtube.cmp-video--embed",
        ".video.cmp-video-full-width.ambient"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        ".breadcrumb",
        ".cmp-breadcrumb",
        "aside",
        ".social-share",
        ".back-to-top",
        "iframe",
        "link",
        "noscript",
        "script"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("data-analytics");
        el.removeAttribute("onclick");
        el.removeAttribute("data-cmp-is");
      });
    }
  }

  // tools/importer/transformers/abbvie-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero": parse,
    "columns": parse2,
    "cards": parse3,
    "story-card": parse4,
    "dashboard-card": parse5,
    "press-releases": parse6
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AbbVie corporate homepage with hero banner, content sections, and promotional cards",
    urls: ["https://www.abbvie.com/"],
    blocks: [
      {
        name: "hero",
        instances: [".homepage-hero-controller .cmp-home-hero"]
      },
      {
        name: "columns",
        instances: [
          ".container.homepage-overlap .grid.cmp-grid-custom",
          ".grid:has(.cardpagestory.card-dashboard):has(.dashboardcards)",
          ".container.default-radius.cmp-container-xxx-large .grid.cmp-grid-custom",
          ".grid:has(.cardpagestory.card-dashboard.medium-theme):has(.dashboardcards.light-theme-stroke)",
          ".container.large-radius.cmp-container-full-width .grid.cmp-grid-custom"
        ]
      },
      {
        name: "cards",
        instances: [".grid.cmp-grid-custom.no-bottom-margin:has(.cmp-image)"]
      },
      {
        name: "story-card",
        instances: [
          ".cardpagestory.card-standard",
          ".cardpagestory.card-dashboard.show-image-hide-desc",
          ".cardpagestory.card-dashboard.medium-theme",
          ".cardpagestory.card-dashboard.hide-description"
        ]
      },
      {
        name: "dashboard-card",
        instances: [
          ".dashboardcards.medium-theme.hide-image",
          ".dashboardcards.dark-theme.hide-image",
          ".dashboardcards.light-theme-stroke",
          ".dashboardcards.hide-image:not(.medium-theme):not(.dark-theme)",
          ".dashboardcards.light-theme-no-stroke"
        ]
      },
      {
        name: "press-releases",
        instances: [".carousel.cmp-carousel--rss"]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero Banner",
        selector: ".homepage-hero-controller",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-news-featured",
        name: "Press Releases & Featured Story",
        selector: ".container.homepage-overlap",
        style: null,
        blocks: ["columns", "press-releases", "story-card"],
        defaultContent: []
      },
      {
        id: "section-patients",
        name: "Patients Teaser",
        selector: ".teaser:nth-of-type(1)",
        style: null,
        blocks: [],
        defaultContent: [".teaser:first-of-type .cmp-teaser"]
      },
      {
        id: "section-science",
        name: "Science & Innovation",
        selector: [".teaser:has(#section-science)", ".grid:has(.cardpagestory.card-dashboard):has(.dashboardcards)"],
        style: null,
        blocks: ["columns", "story-card", "dashboard-card"],
        defaultContent: [".teaser:has(#section-science) .cmp-teaser"]
      },
      {
        id: "section-podcast",
        name: "Podcast Promo",
        selector: ".container.default-radius.cmp-container-xxx-large",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-culture",
        name: "Culture",
        selector: [".teaser.light-theme", ".grid.cmp-grid-custom.no-bottom-margin:has(.cmp-image)"],
        style: "light",
        blocks: ["cards"],
        defaultContent: [".teaser.light-theme .cmp-teaser"]
      },
      {
        id: "section-careers",
        name: "Explore Opportunities",
        selector: ".container.abbvie-container.medium-radius.cmp-container-xxx-large.height-short",
        style: "dark",
        blocks: [],
        defaultContent: [".container.abbvie-container .cmp-teaser"]
      },
      {
        id: "section-investors",
        name: "Investor Resources",
        selector: [".teaser:has(#section-investors)", ".grid:has(.cardpagestory.card-dashboard.medium-theme):has(.dashboardcards.light-theme-stroke)"],
        style: null,
        blocks: ["columns", "story-card", "dashboard-card"],
        defaultContent: [".teaser:has(#section-investors) .cmp-teaser"]
      },
      {
        id: "section-esg",
        name: "ESG",
        selector: [".teaser:has(#section-esg)", ".container.large-radius.cmp-container-full-width:has(.dashboardcards):has(.cardpagestory)"],
        style: null,
        blocks: ["columns", "dashboard-card", "story-card"],
        defaultContent: [".teaser:has(#section-esg) .cmp-teaser"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    const processedElements = /* @__PURE__ */ new Set();
    const blockOrder = ["hero", "story-card", "dashboard-card", "press-releases", "cards", "columns"];
    blockOrder.forEach((blockName) => {
      const blockDef = template.blocks.find((b) => b.name === blockName);
      if (!blockDef) return;
      blockDef.instances.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            if (processedElements.has(element)) return;
            pageBlocks.push({
              name: blockDef.name,
              selector,
              element,
              section: blockDef.section || null
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
