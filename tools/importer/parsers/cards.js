/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards block.
 * Base: cards. Source: https://www.abbvie.com/
 * Model: card item with image (reference) + text (richtext) → N rows of 2 columns
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  // Find all card items (grid cells with images)
  const cardItems = element.querySelectorAll('.grid-row__col-with-4.grid-cell, .grid-cell[data-priority]');

  const cells = [];

  cardItems.forEach((card) => {
    // Extract image - handle lazy-loaded Scene7 images
    const imgWrapper = card.querySelector('.cmp-image');
    let imgEl = null;
    if (imgWrapper) {
      const realSrc = imgWrapper.getAttribute('data-cmp-src');
      const imgTag = imgWrapper.querySelector('img');
      imgEl = document.createElement('img');
      imgEl.src = realSrc || (imgTag && imgTag.getAttribute('src')) || '';
      imgEl.alt = (imgTag && imgTag.getAttribute('alt')) || '';
    }

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    if (imgEl) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(imgEl);
    }

    // Extract text content (description + CTA)
    const textParagraph = card.querySelector('.cmp-text p, .cmp-text');
    const ctaButton = card.querySelector('a.cmp-button, .button a');
    const ctaText = card.querySelector('.cmp-button__text');

    // Build text cell with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    if (textParagraph) {
      const p = document.createElement('p');
      p.textContent = textParagraph.textContent.trim();
      textCell.appendChild(p);
    }

    if (ctaButton) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaButton.getAttribute('href') || '';
      a.textContent = (ctaText && ctaText.textContent.trim()) || ctaButton.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
