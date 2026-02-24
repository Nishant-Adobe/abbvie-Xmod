import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    moveInstrumentation(row, row);
    [...row.children].forEach((col) => {
      if (col.children.length === 1 && col.querySelector('picture')) {
        col.className = 'story-card-image';
      } else {
        col.className = 'story-card-body';
      }
    });
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
