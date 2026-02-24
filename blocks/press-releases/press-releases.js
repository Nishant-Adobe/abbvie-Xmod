export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      col.className = 'press-releases-body';
    });
  });
}
