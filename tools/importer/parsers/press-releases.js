/* eslint-disable */
/* global WebImporter */
/**
 * Parser for press-releases block.
 * Base: carousel. Source: https://www.abbvie.com/
 * Model: text (richtext) → 1 row
 * Extracts RSS carousel items as a list of press release links
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));

  // Extract individual press release slides
  const slides = element.querySelectorAll('.splide__slide');

  if (slides.length > 0) {
    const ul = document.createElement('ul');

    slides.forEach((slide) => {
      const link = slide.querySelector('a.carousel-rss__link');
      const eyebrow = slide.querySelector('.carousel-rss__eyebrow');
      const title = slide.querySelector('.carousel-rss__title');

      if (link && title) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.getAttribute('href') || '';
        // Combine date and title
        let text = '';
        if (eyebrow) {
          text = eyebrow.textContent.trim() + ' - ';
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
    [textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'press-releases', cells });
  element.replaceWith(block);
}
