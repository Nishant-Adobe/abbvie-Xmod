/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AbbVie site-wide cleanup.
 * Aggressively removes non-content elements from captured DOM.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent, overlays, modals, popups
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '.cmp-modal',
      '.modal-overlay',
      '.popup-disclaimer',
      '[class*="popup"]',
      '.back-to-top',
      '.scroll-to-top',
    ]);

    // Remove video player elements entirely (Brightcove, YouTube embeds)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-video',
      '.video-js',
      '.video-wrapper',
      '.brightcove-video',
      'video',
      '.video.cmp-video-full-width.ambient',
      '[data-player]',
      '[data-video-id]',
    ]);

    // Fix lazy-loaded images: copy data-cmp-src to src for Scene7 images
    element.querySelectorAll('img[data-cmp-src]').forEach((img) => {
      const realSrc = img.getAttribute('data-cmp-src');
      if (realSrc && realSrc.includes('scene7.com')) {
        img.setAttribute('src', realSrc);
      }
    });

    // Remove images with blob: URLs (dynamically generated, not real assets)
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.startsWith('blob:')) {
        img.remove();
      }
    });

    // Remove tracking images (twitter, analytics, ad pixels)
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('t.co/') || src.includes('analytics.twitter.com')
        || src.includes('adsct') || src.includes('facebook.net')
        || src.includes('doubleclick.net') || src.includes('google-analytics.com')
        || src.includes('bat.bing.com')) {
        img.remove();
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site chrome
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
      'style',
    ]);

    // Remove footer-like content that leaks into body
    WebImporter.DOMUtils.remove(element, [
      '.footer-container',
      '[class*="footer"]',
      '.social-links',
      '[class*="social-icon"]',
      '.disclaimer-popup',
      '[class*="disclaimer"]',
    ]);

    // Remove "No results found" placeholders and popup text
    element.querySelectorAll('p').forEach((p) => {
      const text = p.textContent.trim();
      if (text === 'No results found' || text.includes('Change your search criteria')
        || text === 'CLOSE' || text.includes('You are about to leave')
        || text === 'No, I disagree' || text === 'Yes, I agree') {
        const parent = p.parentElement;
        p.remove();
        if (parent && parent.children.length === 0 && parent.textContent.trim() === '') {
          parent.remove();
        }
      }
    });

    // Remove remaining blob: and tracking images
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.startsWith('blob:') || src.includes('t.co/')
        || src.includes('analytics.twitter.com')
        || src.includes('adsct')) {
        const p = img.closest('p');
        if (p) p.remove();
        else img.remove();
      }
    });

    // Remove tracking/analytics attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('onclick');
      el.removeAttribute('data-cmp-is');
    });

    // Remove empty paragraphs and divs left after cleanup
    element.querySelectorAll('p, div').forEach((el) => {
      if (el.children.length === 0 && el.textContent.trim() === '') {
        el.remove();
      }
    });
  }
}
