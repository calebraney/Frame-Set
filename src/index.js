import { attr } from './utilities';
import { hoverActive } from './interactions/hover-active';
import { initLenis } from './interactions/lenis';
import { load } from './interactions/load';
import { accordion } from './interactions/accordion';
import { marquee } from './interactions/marquee';
import { scrollIn } from './interactions/scroll-in';
import { scrolling } from './interactions/scrolling';
import { createSlider } from './interactions/slider';

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  console.log('Local Script');
  // register gsap plugins if available
  if (gsap.ScrollTrigger !== undefined) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (gsap.Flip !== undefined) {
    gsap.registerPlugin(Flip);
  }

  //////////////////////////////
  //Global Variables
  let lenis;

  //////////////////////////////
  //Slider instances
  const testimonialSlider = function () {
    const COMPONENT = '.testimonial_layout';
    const components = [...document.querySelectorAll(COMPONENT)];
    const options = {
      slidesPerView: 'auto',
      loop: true,
    };
    //apply a module with defaults settings (canc override them using the options object above)
    const modules = {
      navigation: true,
      pagination: true,
      scrollbar: false,
      autoplay: false,
    };
    const sliders = createSlider(components, options, modules);
  };
  //////////////////////////////
  //Control Functions on page load
  const gsapInit = function () {
    let mm = gsap.matchMedia();
    mm.add(
      {
        //This is the conditions object
        isMobile: '(max-width: 767px)',
        isTablet: '(min-width: 768px)  and (max-width: 991px)',
        isDesktop: '(min-width: 992px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (gsapContext) => {
        let { isMobile, isTablet, isDesktop, reduceMotion } = gsapContext.conditions;
        lenis = initLenis();
        load(gsapContext);
        accordion(gsapContext);
        marquee(gsapContext);
        testimonialSlider();

        //functional interactions
        hoverActive(gsapContext);
        //conditional interactions
        if (!reduceMotion) {
          scrolling(gsapContext);
        }
        if (!reduceMotion && !isMobile) {
          scrollIn(gsapContext);
        }
      }
    );
  };
  gsapInit();

  //reset gsap on click of reset triggers
  const scrollReset = function () {
    //selector
    const RESET_EL = '[data-ix-reset]';
    //time option
    const RESET_TIME = 'data-ix-reset-time';
    const resetScrollTriggers = document.querySelectorAll(RESET_EL);
    resetScrollTriggers.forEach(function (item) {
      item.addEventListener('click', function (e) {
        //reset scrolltrigger
        ScrollTrigger.refresh();
        //if item has reset timer reset scrolltriggers after timer as well.
        if (item.hasAttribute(RESET_TIME)) {
          let time = attr(1000, item.getAttribute(RESET_TIME));
          //get potential timer reset
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, time);
        }
      });
    });
  };
  scrollReset();

  const updaterFooterYear = function () {
    // set the fs-hacks selector
    const YEAR_SELECTOR = '[data-footer-year]';
    // get the the span element
    const yearSpan = document.querySelector(YEAR_SELECTOR);
    if (!yearSpan) return;
    // get the current year
    const currentYear = new Date().getFullYear();
    // set the year span element's text to the current year
    yearSpan.innerText = currentYear.toString();
  };
  updaterFooterYear();
});
