/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero block.
 * Base: hero. Source: https://www.abbvie.com/
 * Model: image (reference), imageAlt (collapsed), text (richtext) → 2 rows
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  // Extract background image from the active hero slide
  const activeSlide = element.querySelector('.cmp-home-hero__primary.active, .cmp-home-hero__primary');
  const sourceEl = activeSlide || element;

  // Get background image (Scene7 CDN)
  const bgImg = sourceEl.querySelector('img.cmp-container__bg-image');
  let imgEl = null;
  if (bgImg) {
    imgEl = document.createElement('img');
    imgEl.src = bgImg.getAttribute('src') || bgImg.getAttribute('data-cmp-src') || '';
    imgEl.alt = bgImg.getAttribute('alt') || '';
  }

  // Build image cell with field hint
  const imageCell = document.createDocumentFragment();
  if (imgEl) {
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(imgEl);
  }

  // Extract text content (heading + CTA)
  const heading = sourceEl.querySelector('h1.cmp-title__text, h1, .cmp-title__text');
  const ctaLink = sourceEl.querySelector('.cmp-text a, .anchor-link a');

  // Build text cell with field hint
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));

  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    textCell.appendChild(h1);
  }

  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.getAttribute('href') || '';
    a.textContent = ctaLink.textContent.trim();
    p.appendChild(a);
    textCell.appendChild(p);
  }

  const cells = [
    [imageCell],
    [textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
