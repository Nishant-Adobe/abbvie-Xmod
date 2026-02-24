/* eslint-disable */
/* global WebImporter */
/**
 * Parser for story-card block.
 * Base: cards. Source: https://www.abbvie.com/
 * Model: image (reference), imageAlt (collapsed), text (richtext) → 2 rows
 * Handles variants: card-standard, card-dashboard with/without image
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  // Extract link wrapper (the entire card is wrapped in an <a> tag)
  const linkWrapper = element.querySelector('a[href]');
  const cardHref = linkWrapper ? linkWrapper.getAttribute('href') : '';

  // Extract image
  const cardImg = element.querySelector('img.card-image, .card-image-container img');
  let imgEl = null;
  if (cardImg) {
    imgEl = document.createElement('img');
    imgEl.src = cardImg.getAttribute('src') || '';
    imgEl.alt = cardImg.getAttribute('alt') || '';
  }

  // Build image cell with field hint
  const imageCell = document.createDocumentFragment();
  if (imgEl) {
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(imgEl);
  }

  // Extract text content
  const eyebrow = element.querySelector('.card-metadata-tag, .card-eyebrow, span[role="heading"]');
  const title = element.querySelector('h4.card-title, .card-title');
  const description = element.querySelector('p.card-description, .card-description');
  const cta = element.querySelector('.card-cta-read-article, .card-cta, [class*="card-cta"]');

  // Build text cell with field hint
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));

  if (eyebrow) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    textCell.appendChild(p);
  }

  if (title) {
    const h4 = document.createElement('h4');
    h4.textContent = title.textContent.trim();
    textCell.appendChild(h4);
  }

  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    textCell.appendChild(p);
  }

  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cardHref || '';
    a.textContent = cta.textContent.trim();
    p.appendChild(a);
    textCell.appendChild(p);
  }

  const cells = [
    [imageCell],
    [textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'story-card', cells });
  element.replaceWith(block);
}
