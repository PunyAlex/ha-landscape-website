'use strict';

/* ==========================================================================
   HA Landscape — Site Script
   Sections: Header/scroll, Mobile nav, Smooth scroll + active nav,
   Scroll reveal, Gallery filter (with quote prefill) + lightbox,
   Contact form validation.
   ========================================================================== */

(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------ Utilities ------------------------------ */
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }
  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }
  function throttleRaf(fn) {
    var ticking = false;
    return function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        fn();
        ticking = false;
      });
    };
  }

  /* ------------------------------- Header --------------------------------- */
  var header = qs('#site-header');
  var topBar = qs('#top-bar');
  var SCROLL_THRESHOLD = 24;

  function updateHeaderState() {
    var isScrolled = window.scrollY > SCROLL_THRESHOLD;
    header.classList.toggle('is-scrolled', isScrolled);
    if (topBar) topBar.classList.toggle('is-scrolled', isScrolled);
  }
  window.addEventListener('scroll', throttleRaf(updateHeaderState), { passive: true });
  updateHeaderState();

  /* ---------------------------- Hero slideshow ------------------------------ */
  var heroSlides = qsa('.hero-slide');
  if (heroSlides.length > 1 && !prefersReducedMotion) {
    var heroIndex = 0;
    window.setInterval(function () {
      heroSlides[heroIndex].classList.remove('is-active');
      heroIndex = (heroIndex + 1) % heroSlides.length;
      heroSlides[heroIndex].classList.add('is-active');
    }, 6000);
  }

  /* ----------------------------- Mobile nav -------------------------------- */
  var navToggle = qs('#nav-toggle');
  var navMobile = qs('#nav-mobile');
  var lastFocusedBeforeMenu = null;

  function openMobileNav() {
    lastFocusedBeforeMenu = document.activeElement;
    navMobile.classList.add('is-open');
    header.classList.add('is-menu-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('no-scroll');
    var firstLink = qs('.nav-mobile-link', navMobile);
    if (firstLink) firstLink.focus();
    document.addEventListener('keydown', onMobileNavKeydown);
  }

  function closeMobileNav() {
    navMobile.classList.remove('is-open');
    header.classList.remove('is-menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onMobileNavKeydown);
    if (lastFocusedBeforeMenu) lastFocusedBeforeMenu.focus();
    updateHeaderState();
  }

  function onMobileNavKeydown(e) {
    if (e.key === 'Escape') {
      closeMobileNav();
      return;
    }
    if (e.key === 'Tab') {
      var focusable = qsa('a, button', navMobile).filter(function (el) {
        return el.offsetParent !== null;
      });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  navToggle.addEventListener('click', function () {
    var isOpen = navMobile.classList.contains('is-open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  qsa('.nav-mobile-link', navMobile).forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  /* --------------------------- Smooth scroll nav --------------------------- */
  function getScrollTarget(hash) {
    if (!hash || hash === '#') return null;
    try {
      return document.querySelector(hash);
    } catch (err) {
      return null;
    }
  }

  qsa('a[data-scroll]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var hash = link.getAttribute('href');
      var target = getScrollTarget(hash);
      if (!target) return;
      e.preventDefault();
      if (navMobile.classList.contains('is-open')) {
        closeMobileNav();
      }
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      window.setTimeout(function () {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }, prefersReducedMotion ? 0 : 450);
    });
  });

  /* ------------------------------ Active nav ------------------------------- */
  var navSections = ['home', 'services', 'about', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = qsa('.nav-link');

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      var match = href === '#' + id || href === id + '.html';
      link.classList.toggle('is-active', match);
      if (match) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if ('IntersectionObserver' in window && navSections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    navSections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ------------------------------ Scroll reveal ----------------------------- */
  var revealEls = qsa('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  var serviceSelect = qs('#field-service');
  qsa('[data-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      var value = link.getAttribute('data-service');
      if (serviceSelect && value) {
        serviceSelect.value = value;
      }
    });
  });

  /* -------------------------------- Gallery --------------------------------- */
  var filterButtons = qsa('.filter-btn');
  var galleryItems = qsa('.gallery-item');
  var filterMetaText = qs('#filter-meta-text');
  var filterMetaQuote = qs('#filter-meta-quote');
  var filterMetaQuoteLabel = qs('#filter-meta-quote-label');
  var galleryTrack = qs('#gallery-grid');
  var galleryPrev = qs('#gallery-prev');
  var galleryNext = qs('#gallery-next');

  function galleryStep() {
    var item = galleryTrack.querySelector('.gallery-item:not(.is-hidden)');
    if (!item) return galleryTrack.clientWidth;
    var gap = parseFloat(getComputedStyle(galleryTrack).gap) || 0;
    return item.getBoundingClientRect().width + gap;
  }

  if (galleryPrev && galleryNext && galleryTrack) {
    galleryPrev.addEventListener('click', function () {
      galleryTrack.scrollBy({ left: -galleryStep(), behavior: 'smooth' });
    });
    galleryNext.addEventListener('click', function () {
      galleryTrack.scrollBy({ left: galleryStep(), behavior: 'smooth' });
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      var label = btn.textContent.trim();
      filterButtons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      galleryItems.forEach(function (item) {
        var match = filter === 'all' || item.getAttribute('data-category') === filter;
        item.classList.toggle('is-hidden', !match);
      });
      if (galleryTrack) galleryTrack.scrollTo({ left: 0, behavior: 'auto' });
      if (filterMetaText && filterMetaQuote && filterMetaQuoteLabel) {
        if (filter === 'all') {
          filterMetaText.textContent = 'Browsing all of our work.';
          filterMetaQuote.setAttribute('data-service', '');
          filterMetaQuoteLabel.textContent = 'Get a Quote';
        } else {
          filterMetaText.textContent = 'Browsing our ' + label + ' work.';
          filterMetaQuote.setAttribute('data-service', label);
          filterMetaQuoteLabel.textContent = 'Get a Quote for ' + label;
        }
      }
    });
  });

  /* -------------------------------- Lightbox --------------------------------- */
  var lightbox = qs('#lightbox');
  var lightboxImg = qs('#lightbox-img');
  var lightboxCaption = qs('#lightbox-caption');
  var lightboxClose = qs('#lightbox-close');
  var lightboxPrev = qs('#lightbox-prev');
  var lightboxNext = qs('#lightbox-next');
  var lastFocusedBeforeLightbox = null;
  var currentGalleryList = [];
  var currentIndex = 0;

  function visibleGalleryItems() {
    return galleryItems.filter(function (item) { return !item.classList.contains('is-hidden'); });
  }

  /* Everything the lightbox shows already lives in the gallery item's own
     markup, so there's nothing to duplicate onto the button as data
     attributes: the category comes from the hover overlay's eyebrow, and the
     photo's own alt text describes this specific shot. */
  function renderLightbox() {
    var item = currentGalleryList[currentIndex];
    if (!item) return;
    var photo = qs('img', item);
    var category = qs('.gallery-item-cat', item).textContent;
    lightboxImg.src = photo.getAttribute('src');
    lightboxImg.alt = photo.alt;
    lightboxCaption.textContent = category + ' — ' + photo.alt;
  }

  function openLightbox(item) {
    currentGalleryList = visibleGalleryItems();
    currentIndex = currentGalleryList.indexOf(item);
    if (currentIndex === -1) currentIndex = 0;
    lastFocusedBeforeLightbox = document.activeElement;
    renderLightbox();
    lightbox.classList.add('is-open');
    document.body.classList.add('no-scroll');
    lightboxClose.focus();
    document.addEventListener('keydown', onLightboxKeydown);
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onLightboxKeydown);
    lightboxImg.src = '';
    if (lastFocusedBeforeLightbox) lastFocusedBeforeLightbox.focus();
  }

  function showNext() {
    if (!currentGalleryList.length) return;
    currentIndex = (currentIndex + 1) % currentGalleryList.length;
    renderLightbox();
  }

  function showPrev() {
    if (!currentGalleryList.length) return;
    currentIndex = (currentIndex - 1 + currentGalleryList.length) % currentGalleryList.length;
    renderLightbox();
  }

  function onLightboxKeydown(e) {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    } else if (e.key === 'Tab') {
      var focusable = [lightboxClose, lightboxPrev, lightboxNext];
      var idx = focusable.indexOf(document.activeElement);
      e.preventDefault();
      var nextIdx = e.shiftKey
        ? (idx <= 0 ? focusable.length - 1 : idx - 1)
        : (idx === -1 || idx === focusable.length - 1 ? 0 : idx + 1);
      focusable[nextIdx].focus();
    }
  }

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () { openLightbox(item); });
  });

  if (lightbox && lightboxClose && lightboxNext && lightboxPrev) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNext);
    lightboxPrev.addEventListener('click', showPrev);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ---------------------------------- Form ----------------------------------- */
  var form = qs('#quote-form');
  var formStatus = qs('#form-status');

  if (form) {
    var validators = {
      name: function (value) { return value.trim().length > 0; },
      phone: function (value) { return /^[0-9+()\-.\s]{7,}$/.test(value.trim()); },
      email: function (value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()); },
      service: function (value) { return value.trim().length > 0; },
      message: function (value) { return value.trim().length >= 10; }
    };

    function setFieldValid(fieldName, isValid) {
      var wrapper = qs('[data-field="' + fieldName + '"]', form);
      if (!wrapper) return;
      var input = qs('input, select, textarea', wrapper);
      wrapper.classList.toggle('is-invalid', !isValid);
      if (input) input.setAttribute('aria-invalid', String(!isValid));
    }

    function validateField(fieldName) {
      var input = form.elements[fieldName];
      if (!input) return true;
      var isValid = validators[fieldName] ? validators[fieldName](input.value) : true;
      setFieldValid(fieldName, isValid);
      return isValid;
    }

    Object.keys(validators).forEach(function (fieldName) {
      var input = form.elements[fieldName];
      if (!input) return;
      input.addEventListener('blur', function () { validateField(fieldName); });
      input.addEventListener('input', function () {
        var wrapper = qs('[data-field="' + fieldName + '"]', form);
        if (wrapper && wrapper.classList.contains('is-invalid')) {
          validateField(fieldName);
        }
      });
    });

    /* ------------------------------ Photo upload ----------------------------- */
    var photosInput = qs('#field-photos');
    var photosField = qs('[data-field="photos"]', form);
    var photosError = qs('#error-photos');
    var photosPreviewList = qs('#upload-preview-list');
    var MAX_PHOTOS = 3;
    var MAX_PHOTO_SIZE = 5 * 1024 * 1024;
    var ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    var selectedPhotos = [];

    function setPhotosError(message) {
      photosError.textContent = message || '';
      photosField.classList.toggle('is-invalid', Boolean(message));
    }

    function syncPhotosInput() {
      var dataTransfer = new DataTransfer();
      selectedPhotos.forEach(function (photo) { dataTransfer.items.add(photo.file); });
      photosInput.files = dataTransfer.files;
    }

    function removePhoto(index) {
      URL.revokeObjectURL(selectedPhotos[index].url);
      selectedPhotos.splice(index, 1);
      syncPhotosInput();
      renderPhotoPreviews();
    }

    function renderPhotoPreviews() {
      photosPreviewList.innerHTML = '';
      selectedPhotos.forEach(function (photo, index) {
        var item = document.createElement('li');
        item.className = 'upload-preview-item';

        var img = document.createElement('img');
        img.src = photo.url;
        img.alt = '';
        item.appendChild(img);

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'upload-remove-btn';
        removeBtn.setAttribute('aria-label', 'Remove ' + photo.file.name);
        removeBtn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-close"></use></svg>';
        removeBtn.addEventListener('click', function () { removePhoto(index); });
        item.appendChild(removeBtn);

        photosPreviewList.appendChild(item);
      });
    }

    function resetPhotos() {
      selectedPhotos.forEach(function (photo) { URL.revokeObjectURL(photo.url); });
      selectedPhotos = [];
      syncPhotosInput();
      renderPhotoPreviews();
      setPhotosError('');
    }

    photosInput.addEventListener('change', function () {
      var error = '';

      Array.prototype.slice.call(photosInput.files).forEach(function (file) {
        if (selectedPhotos.length >= MAX_PHOTOS) {
          error = 'You can attach up to ' + MAX_PHOTOS + ' photos.';
          return;
        }
        if (ALLOWED_PHOTO_TYPES.indexOf(file.type) === -1) {
          error = file.name + ' isn’t a supported photo type (use JPG, PNG, or WEBP).';
          return;
        }
        if (file.size > MAX_PHOTO_SIZE) {
          error = file.name + ' is over the 5MB limit.';
          return;
        }
        selectedPhotos.push({ file: file, url: URL.createObjectURL(file) });
      });

      syncPhotosInput();
      renderPhotoPreviews();
      setPhotosError(error);
    });

    function showFormStatus(message, type) {
      formStatus.textContent = message;
      formStatus.classList.remove('is-success', 'is-error');
      formStatus.classList.add('is-visible', type === 'success' ? 'is-success' : 'is-error');
    }

    /**
     * Sign up free at https://web3forms.com, then create one Access Key per
     * recipient email (Access Key > New Access Key). Paste both keys below.
     * Every quote request is sent to ALL keys listed here, so every lead
     * reaches every inbox — add or remove a key to change who gets notified.
     */
    var WEB3FORMS_ACCESS_KEYS = [
      '718cd8bc-8908-4418-a0d4-a4931b243957', // Alex
      '9544c81c-ddc5-4c8b-afe8-5de368cdb5e6'  // Dad
    ];

    /**
     * Submission point for the quote request. Sends directly to Web3Forms
     * from the browser — no server of our own needed. Fires one request per
     * access key above so every lead reaches every configured inbox.
     * The field values ride along in FormData(form); only the photos need
     * re-attaching by hand, under the name Web3Forms expects.
     */
    function submitQuoteRequest(photos) {
      var requests = WEB3FORMS_ACCESS_KEYS.map(function (accessKey) {
        var body = new FormData(form);

        body.set('access_key', accessKey);
        body.set('subject', 'New Quote Request — ' + (form.elements.service.value || 'HA Landscape Inc.'));
        body.set('replyto', form.elements.email.value.trim());

        body.delete('photos');
        photos.forEach(function (file) {
          body.append('attachment', file);
        });

        return fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: body
        })
          .then(function (response) { return response.json(); })
          .then(function (result) {
            if (!result.success) { throw new Error(result.message || 'Submission failed'); }
            return result;
          });
      });

      return Promise.all(requests);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fieldNames = Object.keys(validators);
      var allValid = fieldNames.reduce(function (valid, fieldName) {
        var fieldValid = validateField(fieldName);
        return valid && fieldValid;
      }, true);

      if (!allValid) {
        showFormStatus('Please fix the highlighted fields and try again.', 'error');
        var firstInvalid = qs('.form-field.is-invalid input, .form-field.is-invalid select, .form-field.is-invalid textarea', form);
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var submitBtn = qs('button[type="submit"]', form);
      var photos = selectedPhotos.map(function (photo) { return photo.file; });

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      submitQuoteRequest(photos)
        .then(function () {
          showFormStatus('Thanks — your request has been received. We\'ll be in touch soon.', 'success');
          form.reset();
          fieldNames.forEach(function (fieldName) { setFieldValid(fieldName, true); });
          resetPhotos();
        })
        .catch(function () {
          showFormStatus('Something went wrong sending your request. Please call or email us directly.', 'error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request a Call Back';
        });
    });
  }

  /* --------------------------------- Footer ----------------------------------- */
  var footerYear = qs('#footer-year');
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());
})();
