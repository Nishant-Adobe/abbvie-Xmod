/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AbbVie site-wide cleanup.
 * Selectors verified from captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent, overlays, and modals (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '.cmp-modal',
      '.modal-overlay',
    ]);

    // Fix lazy-loaded images: copy data-cmp-src to src for Scene7 images
    element.querySelectorAll('img[data-cmp-src]').forEach((img) => {
      const realSrc = img.getAttribute('data-cmp-src');
      if (realSrc && realSrc.includes('scene7.com')) {
        img.setAttribute('src', realSrc);
      }
    });

    // Remove ambient video elements (not authorable content)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-video.cmp-video--youtube.cmp-video--embed',
      '.video.cmp-video-full-width.ambient',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome (header, footer, nav, breadcrumbs)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      '.breadcrumb',
      '.cmp-breadcrumb',
      'aside',
      '.social-share',
      '.back-to-top',
      'iframe',
      'link',
      'noscript',
      'script',
    ]);

    // Remove tracking/analytics attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('onclick');
      el.removeAttribute('data-cmp-is');
    });
  }
}
