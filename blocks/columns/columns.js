import { decorateBlock, loadBlock } from '../../scripts/aem.js';

export default async function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // Find and decorate nested blocks anywhere in the columns block
  const knownBlocks = ['story-card', 'dashboard-card', 'press-releases'];
  const nestedBlocks = [];
  knownBlocks.forEach((blockName) => {
    block.querySelectorAll(`.${blockName}`).forEach((nested) => {
      if (!nested.classList.contains('block')) {
        decorateBlock(nested);
        nestedBlocks.push(nested);
      }
    });
  });

  // Load all nested blocks sequentially
  await nestedBlocks.reduce(
    (promise, nested) => promise.then(() => loadBlock(nested)),
    Promise.resolve(),
  );
}
