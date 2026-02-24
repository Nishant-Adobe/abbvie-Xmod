/* eslint-disable */
/* global WebImporter */
/**
 * Parser for dashboard-card block.
 * Base: cards. Source: https://www.abbvie.com/
 * Model: text (richtext) → 1 row
 * Handles two variants: stat cards (eyebrow + data-point + suffix + description)
 * and link cards (eyebrow + title + link list)
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));

  // Detect variant: link card vs stat card
  const linkList = element.querySelector('.dashboard-card_link__list, .linkcard-links');

  if (linkList) {
    // Link card variant
    const eyebrow = element.querySelector('.linkcard-eyebrow');
    const title = element.querySelector('h5.linkcard-title, .linkcard-title');
    const links = element.querySelectorAll('a.linkcard-link');

    if (eyebrow) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      textCell.appendChild(p);
    }

    if (title) {
      const h5 = document.createElement('h5');
      h5.textContent = title.textContent.trim();
      textCell.appendChild(h5);
    }

    if (links.length > 0) {
      const ul = document.createElement('ul');
      links.forEach((link) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.getAttribute('href') || '';
        const linkText = link.querySelector('.link-text');
        a.textContent = linkText ? linkText.textContent.trim() : link.textContent.trim();
        li.appendChild(a);
        ul.appendChild(li);
      });
      textCell.appendChild(ul);
    }
  } else {
    // Stat card variant
    const eyebrow = element.querySelector('.eyebrow');
    const dataPoint = element.querySelector('.data-point');
    const suffix = element.querySelector('.data-point-suffix');
    const description = element.querySelector('.description');

    if (eyebrow) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      textCell.appendChild(p);
    }

    if (dataPoint || suffix) {
      const p = document.createElement('p');
      const span = document.createElement('span');
      span.className = 'data-point';
      span.textContent = dataPoint ? dataPoint.textContent.trim() : '';
      p.appendChild(span);

      if (suffix) {
        const suffixSpan = document.createElement('span');
        suffixSpan.className = 'suffix';
        suffixSpan.textContent = suffix.textContent.trim();
        p.appendChild(suffixSpan);
      }
      textCell.appendChild(p);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }
  }

  const cells = [
    [textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'dashboard-card', cells });
  element.replaceWith(block);
}
