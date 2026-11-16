(function () {
  var IMAGE_LINK_SELECTOR = 'figure a[href$=".jpg"], figure a[href$=".jpeg"], figure a[href$=".png"], figure a[href$=".webp"]';
  var INLINE_IMAGE_SELECTOR = '.fire-illustration img';

  function ensureLightbox() {
    var existing = document.getElementById('exhibit-lightbox');
    if (existing) return existing;

    var backdrop = document.createElement('div');
    backdrop.id = 'exhibit-lightbox';
    backdrop.className = 'lightbox-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-label', '이미지 확대 보기');

    backdrop.innerHTML =
      '<div class="lightbox-content">' +
        '<button type="button" class="lightbox-close" aria-label="확대 닫기">&times;</button>' +
        '<img src="" alt="">' +
        '<div class="lightbox-caption"></div>' +
      '</div>';

    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', function (event) {
      if (event.target === backdrop || event.target.classList.contains('lightbox-close')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && backdrop.classList.contains('is-open')) {
        closeLightbox();
      }
    });

    return backdrop;
  }

  function openLightbox(src, alt, caption) {
    var backdrop = ensureLightbox();
    var img = backdrop.querySelector('img');
    var cap = backdrop.querySelector('.lightbox-caption');
    img.src = src;
    img.alt = alt || caption || '';
    cap.textContent = caption || alt || '';
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    var closeBtn = backdrop.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    var backdrop = document.getElementById('exhibit-lightbox');
    if (!backdrop) return;
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    var img = backdrop.querySelector('img');
    if (img) img.src = '';
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest(IMAGE_LINK_SELECTOR) : null;
    if (link) {
      event.preventDefault();
      var figure = link.closest('figure');
      var innerImg = link.querySelector('img');
      var figcaption = figure ? figure.querySelector('figcaption') : null;
      var src = link.getAttribute('href') || (innerImg ? innerImg.getAttribute('src') : '');
      var alt = innerImg ? innerImg.getAttribute('alt') : '';
      var caption = figcaption ? figcaption.textContent.trim() : alt;
      if (src) openLightbox(src, alt, caption);
      return;
    }

    var inlineImg = event.target.closest ? event.target.closest(INLINE_IMAGE_SELECTOR) : null;
    if (inlineImg) {
      event.preventDefault();
      var step = inlineImg.closest('.step');
      var dt = step ? step.querySelector('dt') : null;
      var srcInline = inlineImg.getAttribute('src');
      var altInline = inlineImg.getAttribute('alt') || '';
      var captionInline = dt ? dt.textContent.trim() : altInline;
      if (srcInline) openLightbox(srcInline, altInline, captionInline);
    }
  });
})();
