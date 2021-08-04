'use strict';

// Header menu
function initHeaderMenu() {
  const headerMenu = document.querySelector('.header-menu__list');
  const togglers = headerMenu.querySelectorAll('.header-menu__title');
  const menuActiveClass = 'header-menu__item_active';

  for (const toggler of togglers) {
    toggler.addEventListener('click', (ev) => {
      const toggler = ev.currentTarget;
      const menu = toggler.parentElement;

      if (!menu.classList.contains(menuActiveClass)) {
        showSubmenu(menu);
      } else {
        hideSubmenu(menu);
      }
    });
  }

  function showSubmenu(menu) {
    const toggler = menu.querySelector('.header-menu__title');
    const submenuWrapper = menu.querySelector('.header-menu__sub-list-wrapper');
    const submenu = menu.querySelector('.header-menu__sub-list-bg');
    const activeMenu = document.querySelector('.' + menuActiveClass);

    if (activeMenu) {
      hideSubmenu(activeMenu);
    }

    submenu.removeEventListener('transitionend', transitionListener);
    submenuWrapper.style.display = 'block';
    const reflow = submenuWrapper.offsetHeight;
    menu.classList.add(menuActiveClass);

    document.removeEventListener('click', documentClickListener);
    document.addEventListener('click', documentClickListener);

    toggler.ariaExpanded = true;
  }

  function hideSubmenu(menu) {
    const toggler = menu.querySelector('.header-menu__title');
    const submenu = menu.querySelector('.header-menu__sub-list-bg');

    document.removeEventListener('click', documentClickListener);

    submenu.addEventListener('transitionend', transitionListener);
    menu.classList.remove(menuActiveClass);

    toggler.ariaExpanded = false;
  }

  function transitionListener(ev) {
    if (ev.target.classList.contains('header-menu__sub-list-bg')) {
      const submenu = ev.target;
      const submenuWrapper = submenu.parentElement;

      submenu.removeEventListener('transitionend', transitionListener);
      submenuWrapper.style.display = null;
    }
  };

  function documentClickListener(ev) {
    const activeMenu = document.querySelector('.' + menuActiveClass);

    if (activeMenu) {
      if (!activeMenu.contains(ev.target)) {
        hideSubmenu(activeMenu);
      }
    }
  }
}

initHeaderMenu();

// Header menu simplebar
function initSimpleBars() {
  const simplebars = document.querySelectorAll('.header-menu__sub-list-inner');

  for (const simplebar of simplebars) {
    new SimpleBar(
      simplebar,
      {
        autoHide: false,
      }
    );
  }
}

initSimpleBars();

// Hero bg slideshow
function initHeroBG() {
  let timing = 10000;

  setInterval(changeHeroBG, timing);
}

function changeHeroBG() {
  let bgWrapper = document.querySelector('.hero__bg-wrapper');
  let bgs = bgWrapper.querySelectorAll('.hero__bg');
  let activeIndex = 0;

  bgs.forEach((bg, i) => {
    if (bg.classList.contains('hero__bg_active')) {
      activeIndex = i;
      bg.classList.remove('hero__bg_active');
    }
  });

  if (activeIndex < bgs.length - 1) {
    bgs[activeIndex + 1].classList.add('hero__bg_active');
  } else {
    bgs[0].classList.add('hero__bg_active');
  }
}

initHeroBG();

// Choices
var choicesGallery = new Choices('.gallery__select', {
  silent: true,
  searchEnabled: false,
  itemSelectText: '',
  classNames: {
    containerOuter: 'gallery-choices choices',
  },
});

// hide selected from accessability
choicesGallery.passedElement.element.addEventListener('showDropdown', function (ev) {
  var items = choicesGallery.dropdown.element.querySelectorAll('[data-choice]');
  var selectedItem = choicesGallery.dropdown.element.querySelector('[data-id="' + choicesGallery.getValue().choiceId + '"]');
  var firstSelectableItem = choicesGallery.dropdown.element.querySelector('[data-choice-selectable]');

  // make selected item not selectable
});


// Swiper in gallery
var gallerySwiper = new Swiper('.gallery-slider', {
  a11y: false,
  direction: 'horizontal',
  swipeHandler: '.gallery-slider__wrapper',
  pagination: {
    el: '.gallery-slider__pagination',
    type: 'custom',
    clickable: true,
    bulletClass: 'gallery-slider__bullet',
    bulletActiveClass: 'gallery-slider__bullet_active',
    renderCustom: function (swiper, current, total) {
      let generatedHtml = '';

      generatedHtml += '<span class="gallery-slider__fraction">' + current + '</span>';
      generatedHtml += ' / ';
      generatedHtml += '<span class="gallery-slider__fraction">' + total + '</span>';

      return generatedHtml;
    },
  },
  navigation: {
    disabledClass: 'gallery-slider__button_disabled',
    prevEl: '.gallery-slider__button_prev',
    nextEl: '.gallery-slider__button_next',
  },
  breakpoints: {
    320: {
      spaceBetween: 0,
      slidesPerView: 1,
      slidesPerColumnFill: 'row',
      slidesPerColumn: 1,
      slidesPerGroup: 1,
    },
    768: {
      spaceBetween: 34,
      slidesPerView: 2,
      slidesPerColumnFill: 'column',
      slidesPerColumn: 2,
      slidesPerGroup: 2,
    },
    1024: {
      spaceBetween: 34,
      slidesPerView: 2,
      slidesPerColumnFill: 'column',
      slidesPerColumn: 2,
      slidesPerGroup: 2,
    },
    1500: {
      spaceBetween: 34,
      slidesPerView: 3,
      slidesPerColumnFill: 'column',
      slidesPerColumn: 2,
      slidesPerGroup: 1,
    },
    1920: {
      spaceBetween: 50,
      slidesPerView: 3,
      slidesPerColumnFill: 'column',
      slidesPerColumn: 2,
      slidesPerGroup: 1,
    },
  },
  on: {
    breakpoint: function (swiper) {
      if (swiper.currentBreakpoint === '320') {
        for (var slide of swiper.slides) {
          slide.style.marginTop = null;
        }
      }
    }
  },
});

// Gallery pop-up
function initGalleryPopup() {
  const page = document.querySelector('.page');
  const openers = document.querySelectorAll('.gallery-slider__link');
  const overlay = document.querySelector('.gallery-overlay');
  const cards = document.querySelectorAll('.gallery-overlay__card');

  for (const opener of openers) {
    opener.addEventListener('click', () => {
      const id = opener.dataset.popupId;
      showPopup(id);
    });
  }

  overlay.addEventListener('click', (ev) => {
    if (ev.target.contains(overlay)) {
      hidePopup();
    }
  });

  function showPopup(id) {
    var closer;

    if (document.querySelector(`.gallery-overlay__card[data-popup-id="${id}"]`) === null) {
      throw 'Данные для карточки не найдены';
    }

    if (window.innerWidth < 1024 || window.innerWidth >= 1920) {
      page.classList.add('page_overflowed');
      toggleInertExeptThis(overlay);
    }

    for (const card of cards) {
      card.classList.remove('gallery-overlay__card_visible');

      if (card.dataset.popupId === id) {
        card.classList.add('gallery-overlay__card_visible');
        closer = card.querySelector('.gallery-overlay__closer');
      }
    }

    overlay.removeEventListener('transitionend', transitionListener);
    overlay.style.display = 'flex';
    const reflow = overlay.offsetHeight;
    overlay.classList.add('gallery__overlay_visible');

    closer.focus();

    closer.removeEventListener('click', closerListener);
    closer.addEventListener('click', closerListener);
  }

  function hidePopup() {
    const id = overlay.querySelector('.gallery-overlay__card_visible').dataset.popupId;

    overlay.addEventListener('transitionend', transitionListener);
    overlay.classList.remove('gallery__overlay_visible');

    if (window.innerWidth < 1024 || window.innerWidth >= 1920) {
      page.classList.remove('page_overflowed');
      toggleInertExeptThis(overlay);
    }

    document.querySelector(`.gallery-slider__link[data-popup-id="${id}"]`).focus();
  }

  function closerListener() {
    hidePopup();
  }

  function transitionListener() {
    overlay.removeEventListener('transitionend', transitionListener);
    overlay.style.display = null;
  }
}

initGalleryPopup();


// Catalog
(() => {
  // Catalog tabs
  // Unwrap first accordions
  (() => {
    const tabs = document.querySelectorAll('.catalog-viewer__nav');
    for (const tab of tabs) {
      tab.style.display = 'block';

      const accordion = tab.querySelector('.catalog-viewer-nav__inner');
      accordion.style.display = 'block';
      const reflow = accordion.offsetHeight;
      accordion.classList.add('catalog-viewer-nav__inner_active');
      accordion.style.maxHeight = accordion.scrollHeight + 'px';

      tab.style.display = null;

      accordion.previousElementSibling.classList.add('catalog-viewer-nav__button_active');
      accordion.previousElementSibling.ariaExpanded = true;
    }
  })();

  // Show initial tab
  (() => {
    const flag = document.querySelector('.catalog-tabs__flag');
    activateLang(flag, true);
  })();

  // Change tabs
  const flags = document.querySelectorAll('.catalog-tabs__flag');
  for (const flag of flags) {
    flag.addEventListener('click', (ev) => {
      activateLang(ev.currentTarget, false);
    })
  }

  function activateLang(flag, initial) {
    const lang = flag.dataset.lang;
    const tab = document.querySelector(`.catalog-viewer__nav[data-lang="${lang}"]`);

    // Deactivate previous flag
    const activeFlag = document.querySelector('.flag_active');
    if (activeFlag) {
      activeFlag.classList.remove('flag_active');
      activeFlag.ariaExpanded = false;
    }

    // Activate flag
    flag.classList.add('flag_active');
    flag.ariaExpanded = true;


    // Deactivate previous tab
    const activeTab = document.querySelector('.catalog-viewer__nav_active');
    if (activeTab) {
      activeTab.classList.remove('catalog-viewer__nav_active');
      activeTab.removeEventListener('transitionend', activeTabListener);
      activeTab.addEventListener('transitionend', activeTabListener);
    }

    // Hide tab on the end of transition
    function activeTabListener() {
      activeTab.removeEventListener('transitionend', activeTabListener);
      activeTab.style.display = null;
    }

    // Activate tab
    tab.style.display = 'block';
    const reflow = tab.offsetHeight;
    tab.classList.add('catalog-viewer__nav_active');

    // Resize nav wrapper
    const navWrapper = document.querySelector('.catalog-viewer__nav-wrapper');
    navWrapper.style.height = tab.scrollHeight + 'px';

    // Scroll to person when nav wrapper transition end
    if (!initial && window.innerWidth < 768) {
      navWrapper.removeEventListener('transitionend', navWrapperListener);
      navWrapper.addEventListener('transitionend', navWrapperListener);
    }

    function navWrapperListener(ev) {
      const navWrapper = ev.currentTarget;

      if (ev.target === navWrapper) {
        navWrapper.removeEventListener('transitionend', navWrapperListener);
        scrollToPerson();
      }
    }

    // Activate first person
    const firstLink = tab.querySelector('.catalog-viewer-nav__link');
    const firstPersonId = firstLink ? firstLink.dataset.id : 0;
    showPerson(firstPersonId);

    if (!initial && window.innerWidth < 768) {
      scrollToPerson();
    }
  }

  function scrollToPerson() {
    const personsWrapper = document.querySelector('.catalog-viewer__persons-wrapper');

    // Scroll window to person on nav wrapper animation end
    const personsWrapperBox = personsWrapper.getBoundingClientRect();

    window.scrollTo({
      top: personsWrapperBox.top + pageYOffset,
      behavior: 'smooth',
    });
  }

  function showPerson(id) {
    // Checking person id 
    id = document.querySelector(`.catalog-viewer__person[data-id="${id}"]`) ? id : 0;

    // Hide previous person
    const activePerson = document.querySelector('.catalog-viewer__person_active');

    if (activePerson) {
      activePerson.classList.remove('catalog-viewer__person_active');

      if (activePerson.dataset.id != id) {
        activePerson.removeEventListener('transitionend', personListener);
        activePerson.addEventListener('transitionend', personListener);

        function personListener(ev) {
          const activePerson = ev.currentTarget;

          if (ev.target === activePerson) {
            activePerson.removeEventListener('transitionend', personListener);
            activePerson.style.display = null;
          }
        }
      }
    }

    // Show person
    const person = document.querySelector(`.catalog-viewer__person[data-id="${id}"]`);
    const personsWrapper = document.querySelector('.catalog-viewer__persons-wrapper');

    person.style.display = 'block';
    const reflow = person.offsetHeight;
    person.classList.add('catalog-viewer__person_active');
    personsWrapper.style.height = person.scrollHeight + 'px';

    // Highlight person link
    // Unhighlight previous link 
    const activeLink = document.querySelector('.catalog-viewer-nav__link_active');
    if (activeLink) {
      activeLink.classList.remove('catalog-viewer-nav__link_active');
    }

    // Highlight link
    if (id != 0) {
      const link = document.querySelector(`.catalog-viewer-nav__link[data-id="${id}"]`);
      link.classList.add('catalog-viewer-nav__link_active')
    }
  }

  // Showing persons from link
  const links = document.querySelectorAll('.catalog-viewer-nav__link');

  for (const link of links) {
    link.addEventListener('click', (ev) => {
      const id = ev.currentTarget.dataset.id;

      showPerson(id);

      if (window.innerWidth < 768) {
        scrollToPerson();
      }
    });
  }

  // Accordion
  const buttons = document.querySelectorAll('.catalog-viewer-nav__button');
  for (const button of buttons) {
    button.addEventListener('click', () => {
      unwrapAccordion(button);
    });
  }

  function unwrapAccordion(button) {
    // Hide previous accordion
    const activeAccordion = button.parentElement.querySelector('.catalog-viewer-nav__inner_active');
    if (activeAccordion) {
      activeAccordion.classList.remove('catalog-viewer-nav__inner_active');
      activeAccordion.style.maxHeight = null;

      activeAccordion.removeEventListener('transitionend', activeAccordionListener);
      activeAccordion.addEventListener('transitionend', activeAccordionListener);

      activeAccordion.previousElementSibling.classList.remove('catalog-viewer-nav__button_active');
      activeAccordion.previousElementSibling.ariaExpanded = false;
    }

    function activeAccordionListener(ev) {
      const accordion = ev.currentTarget;
      if (ev.target === accordion) {
        accordion.removeEventListener('transitionend', activeAccordionListener);
        accordion.style.display = null;
      }
    }

    // Show accordion
    const accordion = button.nextElementSibling;
    accordion.style.display = 'block';
    const reflow = accordion.offsetHeight;
    accordion.classList.add('catalog-viewer-nav__inner_active');
    accordion.style.maxHeight = accordion.scrollHeight + 'px';

    accordion.removeEventListener('transitionend', accordionListener);
    accordion.addEventListener('transitionend', accordionListener);

    accordion.previousElementSibling.classList.add('catalog-viewer-nav__button_active');
    accordion.previousElementSibling.ariaExpanded = true;

    // Resizing nav wrapper
    function accordionListener(ev) {
      const accordion = ev.currentTarget;

      if (ev.target === accordion) {
        accordion.removeEventListener('transitionend', accordionListener);

        // Resize nav wrapper
        const tab = accordion.closest('.catalog-viewer__nav');
        const navWrapper = document.querySelector('.catalog-viewer__nav-wrapper');
        navWrapper.style.height = tab.scrollHeight + 'px';
      }
    }
  }
})();



// Swiper in events
let eventsSwiper;

function initEvents() {
  const sliderContainer = document.querySelector('.events__slider');
  const showMoreButton = document.querySelector('.events__more');

  adaptiveToggleEventsSwiper();
  window.addEventListener('resize', adaptiveToggleEventsSwiper);

  function adaptiveToggleEventsSwiper() {
    if (window.innerWidth < 768) {
      // unwrap slider container
      sliderContainer.style.maxHeight = 'none';

      if (eventsSwiper === undefined || eventsSwiper.destroyed === true) {
        initEventsSwiper();
      }

      uninertAllEvents();
    } else {
      if (eventsSwiper != undefined) {
        eventsSwiper.destroy(true, true);
      }

      setTimeout(() => {
        initEventsWrapper();  
      }, 300);
    }
  }

  function initEventsSwiper() {
    const eventsSwiperOptions = {
      a11y: {
        enabled: true,
      },
      direction: 'horizontal',
      pagination: {
        el: '.events-slider__pagination',
        type: 'custom',
        clickable: true,
        bulletClass: 'events-slider__bullet',
        bulletActiveClass: 'events-slider__bullet_active',
        renderCustom: function (swiper, current, total) {
          let generatedHtml = '';

          for (let i = 1; i <= total; i++) {
            const ariaHidden = i == current ? 'true' : 'false';
            const tabindex = i == current ? '-1' : '0';
            const className = i == current ? swiper.params.pagination.bulletClass + ' ' + swiper.params.pagination.bulletActiveClass : swiper.params.pagination.bulletClass;
            generatedHtml += `<button class="${className}" aria-label="Перейти к слайду ${i}" tabindex="${tabindex}" aria-hidden="${ariaHidden}"></button>`;
          }

          return generatedHtml;
        },
      },
      breakpoints: {
        320: {
          spaceBetween: 30,
          slidesPerView: 1,
          slidesPerGroup: 1,

        },
      },
    }

    eventsSwiper = new Swiper(sliderContainer, eventsSwiperOptions);
  }

  function initEventsWrapper() {
    const sliderContainer = document.querySelector('.events__slider');
    const showMoreButton = document.querySelector('.events__more');
    let visibleSlidesLen;

    // get visible slides number
    if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      visibleSlidesLen = 2;
    } else if (window.innerWidth >= 1024) {
      visibleSlidesLen = 3;
    }

    // get wrapped slider height
    const sliderInitHeight = document.querySelector('.events-slider__slide').offsetHeight;
    inertHiddenEvents();

    // wrap slider container
    sliderContainer.style.maxHeight = sliderInitHeight + 'px';
    showMoreButton.textContent = 'Все события';
    showMoreButton.ariaLabel = 'Все события';
  }

  // inert hidden slides for focus
  function inertHiddenEvents() {
    const slides = document.querySelectorAll('.events-slider__slide');
    let visibleSlidesLen;

    // get visible slides number
    if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      visibleSlidesLen = 2;
    } else if (window.innerWidth >= 1024) {
      visibleSlidesLen = 3;
    }

    slides.forEach((slide, i) => {
      if (i + 1 > visibleSlidesLen) {
        slide.inert = true;
      } else {
        slide.inert = false;
      }
    });
  }

  // uninert all slides for focus
  function uninertAllEvents() {
    const slides = document.querySelectorAll('.events-slider__slide');

    slides.forEach((slide) => {
      slide.inert = false;
    });
  }

  showMoreButton.removeEventListener('click', showHideMoreEvents);
  showMoreButton.addEventListener('click', showHideMoreEvents);

  function showHideMoreEvents() {
    if (showMoreButton.textContent == 'Все события') {
      sliderContainer.style.maxHeight = sliderContainer.scrollHeight + 'px';
      showMoreButton.textContent = 'Скрыть события';
      showMoreButton.ariaLabel = 'Скрыть события';

      uninertAllEvents();
    } else {
      // get wrapped slider height
      const sliderInitHeight = document.querySelector('.events-slider__slide').offsetHeight;
      sliderContainer.style.maxHeight = sliderInitHeight + 'px';
      showMoreButton.textContent = 'Все события';
      showMoreButton.ariaLabel = 'Все события';

      inertHiddenEvents();
    }
  }
}

initEvents();

// Editions filters
(() => {
  const filtersToggler = document.querySelector('.editions-filter__title');
  const checkboxWrappers = document.querySelectorAll('.editions-filter__checkbox-wrapper');
  const checkboxesWrapper = document.querySelector('.editions-filter__checkboxes-wrapper');

  adaptiveFiltersToggler();
  makeFiltersCheckboxesWrapperHeight();

  window.addEventListener('resize', function () {
    adaptiveFiltersToggler();
    makeFiltersCheckboxesWrapperHeight();
  });

  function makeFiltersToggler() {
    filtersToggler.innerHTML = '<button class="editions-filter__categories-toggler" type="button">' + filtersToggler.textContent + '<span class="editions-filter__categories-toggler-arrow"></span></button>';
    filtersToggler.addEventListener('click', toggleFilters);
    showHideFilters();
  }

  function destroyFiltersToggler() {
    filtersToggler.innerHTML = filtersToggler.textContent;
    filtersToggler.classList.remove('editions-filter__categories-toggler_active');
    filtersToggler.removeEventListener('click', toggleFilters);
    for (const wrapper of checkboxWrappers) {
      wrapper.style.maxHeight = 'unset';
      wrapper.style.visibility = 'unset';
    }
  }

  function showHideFilters() {
    if (filtersToggler.dataset.unwrapped) {
      for (const wrapper of checkboxWrappers) {
        if (wrapper.querySelector('input').checked === true) {
          continue;
        }

        wrapper.style.maxHeight = wrapper.scrollHeight + "px";
        wrapper.style.visibility = 'visible';
      }
    } else {
      for (const wrapper of checkboxWrappers) {
        if (wrapper.querySelector('input').checked === true) {
          continue;
        }
        wrapper.style.maxHeight = 0;
        // closuring wrapper to hide
        function hideWrapper(wrapper) {
          return function () {
            wrapper.style.visibility = 'hidden';
          }
        }

        setTimeout(hideWrapper(wrapper), 300);
      }
    }
  }

  function toggleFilters() {
    filtersToggler.classList.toggle('editions-filter__categories-toggler_active');

    if (!filtersToggler.dataset.unwrapped) {
      filtersToggler.dataset.unwrapped = 'true';
    } else {
      delete filtersToggler.dataset.unwrapped;
    }

    showHideFilters();
  }

  function adaptiveFiltersToggler() {
    if (!filtersToggler.dataset.initialized && window.innerWidth < 768) {
      makeFiltersToggler();
      filtersToggler.dataset.initialized = 'true';
      return;
    }

    if (filtersToggler.dataset.initialized && window.innerWidth >= 768 && window.innerWidth < 1024) {
      destroyFiltersToggler();
      delete filtersToggler.dataset.initialized;
    }
  }

  function makeFiltersCheckboxesWrapperHeight() {
    if (!filtersToggler.dataset.heighted && window.innerWidth >= 768 && window.innerWidth < 1024) {
      checkboxesWrapper.style.maxHeight = checkboxWrappers[0].scrollHeight * (checkboxWrappers.length / 3 + checkboxWrappers.length % 3) + 'px';

      filtersToggler.dataset.heighted = 'true';
      return;
    }

    if (filtersToggler.dataset.heighted && (window.innerWidth < 768 || window.innerWidth >= 1024)) {
      checkboxesWrapper.style.maxHeight = 'unset';
      delete filtersToggler.dataset.heighted;
    }
  }
})();

// Swiper in editions
(() => {
  const editionsSliderContainer = document.querySelector('.editions__slider');
  const editionsSwiperOptions = {
    a11y: false,
    direction: 'horizontal',
    pagination: {
      el: '.editions__slider-pagination',
      type: 'custom',
      clickable: true,
      renderCustom: function (swiper, current, total) {
        let generatedHtml = '';

        generatedHtml += '<span class="editions__slider-fraction">' + current + '</span>';
        generatedHtml += ' / ';
        generatedHtml += '<span class="editions__slider-fraction">' + total + '</span>';

        return generatedHtml;
      },
    },
    navigation: {
      disabledClass: 'editions__slider-button_disabled',
      prevEl: '.editions__slider-button_prev',
      nextEl: '.editions__slider-button_next',
    },
    breakpoints: {
      768: {
        spaceBetween: 34,
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
      1024: {
        spaceBetween: 50,
        slidesPerView: 2,
        slidesPerGroup: 2,
      },

      1920: {
        spaceBetween: 50,
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
    },
  }

  let swiperInitialized = false;
  let editionsSwiper;

  adaptiveEditionsSwiper();

  window.addEventListener('resize', function () {
    adaptiveEditionsSwiper();
  });

  // initialise and destroy events swiper depending on window width
  function adaptiveEditionsSwiper() {

    if (window.innerWidth < 768) {
      if (swiperInitialized) {
        editionsSwiper.destroy(true, true);
        swiperInitialized = false;
      }
    } else {
      if (!swiperInitialized) {
        editionsSwiper = new Swiper(editionsSliderContainer, editionsSwiperOptions);
        swiperInitialized = true;
      }
    }
  }
})();

// Tooltips
function initTooltips() {
  const tooltips = document.querySelectorAll('.tooltip');

  for (const tooltip of tooltips) {
    tooltip.addEventListener('mouseover', showTooltip);
    tooltip.addEventListener('focus', showTooltip);

    tooltip.addEventListener('mouseout', hideTooltip);
    tooltip.addEventListener('blur', hideTooltip);
  }

  function showTooltip(ev) {
    const tooltip = ev.currentTarget;
    const tooltipText = tooltip.querySelector('.tooltip__text');

    tooltipText.removeEventListener('transitionend', transitionListener);
    tooltipText.style.display = 'block';
    const reflow = tooltipText.offsetHeight;
    tooltip.classList.add('tooltip_visible');

    replaceTooltip(tooltip);
  }

  function hideTooltip(ev) {
    const tooltip = ev.currentTarget;
    const tooltipText = tooltip.querySelector('.tooltip__text');

    tooltipText.addEventListener('transitionend', transitionListener);
    tooltip.classList.remove('tooltip_visible');

    tooltip.blur();
  }

  function transitionListener(ev) {
    const tooltipText = ev.currentTarget;
    tooltipText.removeEventListener('transitionend', transitionListener);
    tooltipText.style.display = null;
  }

  function replaceTooltip(tooltip) {
    const tooltipText = tooltip.querySelector('span');
    const tooltipTextStyleLeft = parseInt(window.getComputedStyle(tooltipText, null).left);
    const tooltipTextRect = tooltipText.getBoundingClientRect();

    if (tooltipTextRect.left < 20) {
      tooltipText.style.left = tooltipTextStyleLeft - tooltipTextRect.left + 20 + 'px';
    } else if (window.innerWidth - tooltipTextRect.right < 20) {
      tooltipText.style.left = tooltipTextStyleLeft + window.innerWidth - tooltipTextRect.right - 20 + 'px';
    }
  };
}

initTooltips();

// Swiper in partners
function initPartnersSlider() {
  const partnersSwiper = new Swiper('.partners__slider', {
    a11y: false,
    direction: 'horizontal',
    navigation: {
      disabledClass: 'partners__slider-button_disabled',
      prevEl: '.partners__slider-button_prev',
      nextEl: '.partners__slider-button_next',
    },

    breakpoints: {
      320: {
        spaceBetween: 30,
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
      768: {
        spaceBetween: 34,
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
      1024: {
        spaceBetween: 50,
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
      1920: {
        spaceBetween: 50,
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
    }
  });
}

initPartnersSlider();

// Yandex map
ymaps.ready(init);
function init() {
  var coordinates = [55.75342035339826, 37.646919012897484];
  var myMap = new ymaps.Map('map', {
    center: coordinates,
    zoom: 16,
    controls: []
  });

  var myPlacemark = new ymaps.Placemark(
    coordinates,
    {

    },
    {
      iconLayout: 'default#image',
      iconImageHref: './img/map-pointer.png',
      iconImageSize: [20, 20],
      iconImageOffset: [-10, -10],
    }
  );

  myMap.geoObjects.add(myPlacemark);

  myMap.behaviors.disable('scrollZoom');
  myMap.behaviors.disable('drag');
}

// Inputmask
var selector = document.querySelector('.contacts-form__input[name="phone"]');
Inputmask({
  'mask': '+7 (999) 999-99-99',
  placeholder: "_"
}).mask(selector);

// Just-validate
JustValidate = new window.JustValidate('.contacts__form', {
  rules: {
    customName: {
      required: true,
      maxLength: 30,
    },
    customPhone: {
      required: true,
      function: () => {
        var phone = selector.inputmask.unmaskedvalue();
        return phone.length === 10;
      }
    },
  },
  messages: {
    customName: {
      required: 'Укажите Ваше имя',
      maxLength: 'Недопустимый формат',
    },
    customPhone: {
      required: 'Укажите Ваш телефон',
      function: 'Недопустимый формат',
    },
  },
  submitHandler: function (form) {
    let formData = new FormData(form);
    let xHR = new XMLHttpRequest();

    xHR.addEventListener('readystatechange', function () {
      if (xHR.readyState === 4) {
        if (xHR.status === 200) {
          console.log('Message has been sent');
        }
      }
    });

    xHR.open('POST', '../php/mail.php', true);
    xHR.send(formData);

    form.reset();

  }
});

// Helpers for inert
function toggleInertExeptThis(el) {
  getSiblings(el).forEach((sibling) => {
    sibling.inert = !sibling.inert;
  });

  if (el.parentNode != document.body) {
    toggleInertExeptThis(el.parentElement);
  }
}

function getSiblings(el) {
  var siblings = [];
  var sibling = el.parentElement.firstChild;

  while (sibling) {
    if (sibling.nodeType === 1 && sibling != el) {
      siblings.push(sibling);
    }
    sibling = sibling.nextElementSibling;
  }

  return siblings;
};

// Burger menu
function initBurgerMenu() {
  const opener = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__navigation');
  const page = document.querySelector('.page');
  const closer = document.querySelector('.header-navigation__closer');

  opener.addEventListener('click', openNav);
  closer.addEventListener('click', closeNav);

  function openNav() {
    nav.style.display = 'block';
    const reflow = nav.offsetHeight;
    nav.classList.add('header__navigation_unwrapped');
    nav.removeEventListener('transitionend', transitionListener);

    toggleInertExeptThis(nav);
    page.classList.add('page_overflowed');
    closer.focus();
  }

  function closeNav() {
    nav.classList.remove('header__navigation_unwrapped');
    nav.addEventListener('transitionend', transitionListener);

    toggleInertExeptThis(nav);
    page.classList.remove('page_overflowed');
    opener.focus();
  }

  function transitionListener(ev) {
    if (ev.target === nav) {
      nav.style.display = null;
      nav.removeEventListener('transitionend', transitionListener);
    }
  }
}

initBurgerMenu();

// Header nav scroll, hiding burger
(() => {
  const anchors = document.querySelectorAll('.header-navigation__link');

  for (let anchor of anchors) {
    anchor.addEventListener('click', (ev) => {
      ev.preventDefault();

      // Close menu 
      const nav = document.querySelector('.header__navigation');
      const page = document.querySelector('.page');
      nav.classList.remove('header__navigation_unwrapped');

      toggleInertExeptThis(nav);
      page.classList.remove('page_overflowed');

      const id = anchor.getAttribute('href').substr(2);

      document.getElementById(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    })
  }
})();

// Search
function initSearch() {
  const searchOpener = document.querySelector('.search-opener');
  const search = document.querySelector('.search');
  const searchInput = search.querySelector('.search__input');
  const searchCloser = search.querySelector('.search__closer');

  searchOpener.addEventListener('click', openSearch);
  searchCloser.addEventListener('click', closeSearch);


  window.addEventListener('resize', () => {
    if (search.classList.contains('header__search_unwrapped')) {
      adaptiveHidingSearchInput();
    }
  });

  function openSearch(ev) {
    search.style.display = 'block';
    const reflow = search.offsetHeight;
    search.classList.add('header__search_unwrapped');
    search.removeEventListener('transitionend', toggleListener);

    searchOpener.classList.add('header__search-opener_hidden');
    searchInput.focus();

    ev.stopPropagation();

    adaptiveHidingSearchInput();
  }

  function closeSearch() {
    search.classList.remove('header__search_unwrapped');
    search.addEventListener('transitionend', toggleListener);
    searchOpener.classList.remove('header__search-opener_hidden');
  }

  function toggleListener(ev) {
    if (ev.target === search) {
      search.style.display = null;
      search.removeEventListener('transitionend', toggleListener);
      searchOpener.focus();
    }
  }

  function hideSearchInput(ev) {
    const search = document.querySelector('.search');

    if (!search.contains(ev.target)) {
      document.removeEventListener('click', hideSearchInput);
      closeSearch();
    }
  }

  function adaptiveHidingSearchInput() {
    const searchInput = search.querySelector('.search__input');

    document.removeEventListener('click', hideSearchInput);
    if (window.innerWidth >= 1024 && window.innerWidth < 1920) {
      document.addEventListener('click', hideSearchInput);
    }
  }
}

initSearch();