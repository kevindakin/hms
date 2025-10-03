// GLOBAL VARIABLES
const durationFast = 0.4;
const durationBase = 0.8;
const durationSlow = 1;
const easeBase = "power3.out";

//
// FUNCTION DECLARATIONS
//

function disableScrolling() {
  document.body.classList.add("no-scroll");
}

function enableScrolling() {
  document.body.classList.remove("no-scroll");
}

function loader() {
  const polaroids = document.querySelector('[data-load="polaroids"]');
  const left = document.querySelector('[data-load="fade-left"]');
  const fade = document.querySelectorAll('[data-load="fade-in"]');
  const up = document.querySelectorAll('[data-load="fade-up"]');

  let tl = gsap.timeline({
    defaults: {
      duration: durationSlow,
      ease: easeBase,
    },
  });

  if (polaroids) {
    const first = polaroids.querySelector(".polaroid_contain:first-child");
    const second = polaroids.querySelector(".polaroid_contain:nth-child(2)");
    tl.to(second, {
      opacity: 1,
      scale: 1,
    }).to(
      first,
      {
        opacity: 1,
        rotate: -5,
        scale: 1,
      },
      0
    );
  }

  if (left) {
    tl.to(
      left,
      {
        opacity: 1,
        x: "0rem",
      },
      0.1
    );
  }

  if (up.length) {
    tl.to(
      up,
      {
        opacity: 1,
        y: "0rem",
        stagger: 0.1,
      },
      0.2
    );
  }

  if (fade.length) {
    tl.to(
      fade,
      {
        opacity: 1,
        stagger: 0.1,
      },
      0.4
    );
  }
}

function mobileMenu() {
  const nav = document.querySelector('[data-menu="nav"]');
  const menu = nav.querySelector(".nav_content");
  const links = menu.querySelectorAll(".nav_link-dropdown");
  const button = nav.querySelector('[data-menu="hamburger"]');
  const btnWrap = nav.querySelector(".nav_button-wrap");

  const lineTop = button.children[0];
  const lineMiddle = button.children[1];
  const lineBottom = button.children[2];

  gsap.set(links, { y: "4rem", opacity: 0 });
  gsap.set(btnWrap, { y: "4rem", opacity: 0 });

  let mobileMenuAnim = gsap.timeline({
    paused: true,
    defaults: {
      duration: durationBase,
      ease: "power3.out",
    },
  });

  mobileMenuAnim
    .to(lineTop, {
      y: 11.5,
      rotate: -45,
    })
    .to(
      lineMiddle,
      {
        x: 24,
        opacity: 0,
      },
      "<"
    )
    .fromTo(
      lineBottom,
      {
        y: 0,
        rotate: 0,
      },
      {
        y: -11.5,
        rotate: 45,
      },
      "<"
    )
    .to(
      menu,
      {
        opacity: 1,
        duration: 0.2,
      },
      "<"
    )
    .to(
      links,
      {
        y: "0rem",
        opacity: 1,
        stagger: 0.06,
      },
      "<-0.1"
    )
    .to(
      btnWrap,
      {
        y: "0rem",
        opacity: 1,
      },
      "<0.3"
    );

  button.addEventListener("click", () => {
    if (!menu.classList.contains("is-open")) {
      menu.style.display = "flex";
      menu.style.pointerEvents = "auto";
      requestAnimationFrame(() => {
        menu.classList.add("is-open");
        mobileMenuAnim.timeScale(1).play();
        disableScrolling();
      });
    } else {
      menu.classList.remove("is-open");
      menu.style.pointerEvents = "none";
      mobileMenuAnim
        .timeScale(2)
        .reverse()
        .eventCallback("onReverseComplete", () => {
          menu.style.display = "none";
        });
      enableScrolling();
    }
  });
}

function navScroll() {
  const nav = document.querySelector('[data-menu="nav"]');
  const border = nav.querySelector(".nav_border");
  const hero = document.querySelector('[data-menu="hero"]');

  const navHeight = nav.offsetHeight;

  let scrollAnim = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: `bottom ${navHeight}px`,
      toggleActions: "play none none reverse",
      onEnter: () => nav.classList.add("is-scrolled"),
      onLeaveBack: () => nav.classList.remove("is-scrolled"),
    },
    defaults: {
      duration: durationBase,
      ease: easeBase,
    },
  });

  scrollAnim.to(border, {
    opacity: 1,
  });
}

function copyright() {
  const copyrightDate = document.querySelector(
    '[data-element="copyright-date"]'
  );

  if (copyrightDate) {
    const currentYear = new Date().getFullYear();
    copyrightDate.textContent = currentYear;
  }
}

function imageReveal() {
  const wrapper = document.querySelectorAll('[data-scroll="image-reveal"]');

  wrapper.forEach((wrap) => {
    const img = wrap.querySelector(".u-cover-absolute");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        toggleActions: "play none none reverse",
      },
      defaults: {
        duration: durationSlow,
        ease: easeBase,
      },
    });

    tl.to(
      img,
      {
        scale: 1,
        filter: "blur(0px)",
      },
      "<0.2"
    );
  });
}

function fadeUp() {
  const fadeEls = document.querySelectorAll('[data-scroll="fade-up"]');

  fadeEls.forEach((el) => {
    let fadeUp = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      defaults: {
        duration: durationSlow,
        ease: easeBase,
      },
    });

    fadeUp.to(el, {
      opacity: 1,
      y: "0rem",
    });
  });
}

function fadeLeft() {
  const fadeEls = document.querySelectorAll('[data-scroll="fade-left"]');

  fadeEls.forEach((el) => {
    let fadeUp = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      defaults: {
        duration: durationSlow,
        ease: easeBase,
      },
    });

    fadeUp.to(el, {
      opacity: 1,
      x: "0rem",
    });
  });
}

function fade() {
  const fadeEls = document.querySelectorAll('[data-scroll="fade-in"]');

  fadeEls.forEach((el) => {
    let fadeUp = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      defaults: {
        duration: durationSlow,
        ease: easeBase,
      },
    });

    fadeUp.to(el, {
      opacity: 1,
    });
  });
}

function scaleIn() {
  const fadeEls = document.querySelectorAll('[data-scroll="scale-in"]');

  fadeEls.forEach((el) => {
    let fadeUp = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      defaults: {
        duration: durationSlow,
        ease: easeBase,
      },
    });

    fadeUp.to(el, {
      opacity: 1,
      scale: 1,
    });
  });
}

function rotateIn() {
  const fadeEls = document.querySelectorAll('[data-scroll="rotate-in"]');

  fadeEls.forEach((el) => {
    let fadeUp = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      defaults: {
        duration: durationSlow,
        ease: easeBase,
      },
    });

    fadeUp.to(el, {
      opacity: 1,
      rotate: 1,
    });
  });
}

//
// FUNCTION INITS
//

document.addEventListener("DOMContentLoaded", function () {
  loader();
  navScroll();
  copyright();
  imageReveal();
  fadeUp();
  fadeLeft();
  fade();
  scaleIn();
  rotateIn();

  gsap.matchMedia().add("(max-width: 991px)", () => {
    mobileMenu();
  });
});