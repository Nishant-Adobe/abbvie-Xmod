/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns block.
 * Base: columns. Source: https://www.abbvie.com/
 * Columns blocks do NOT require field hints (per xwalk hinting rules).
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  // Find the grid row containing columns
  const gridRow = element.querySelector('.grid-row, .grid-container > .grid-row');
  if (!gridRow) {
    // Fallback: treat element itself as a single-row layout
    const cells = [Array.from(element.children)];
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
    element.replaceWith(block);
    return;
  }

  // Extract grid cells (columns), skipping spacer columns (col-with-1)
  const gridCells = Array.from(gridRow.querySelectorAll(':scope > .grid-cell, :scope > [class*="grid-row__col"]'));
  const contentCells = gridCells.filter((cell) => {
    // Skip empty spacer columns (typically col-with-1)
    const isSmallSpacer = cell.classList.contains('grid-row__col-with-1');
    const hasContent = cell.children.length > 0;
    return !isSmallSpacer || hasContent;
  });

  // Build a single row with each column's content
  const row = contentCells.map((cell) => {
    const frag = document.createDocumentFragment();
    // Move all children into the fragment
    Array.from(cell.children).forEach((child) => {
      frag.appendChild(child);
    });
    return frag;
  });

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
