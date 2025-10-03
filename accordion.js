function accordion() {
  const accordionLists = document.querySelectorAll(".accordion-list_component");

  if (!accordionLists) {
    return;
  }

  accordionLists.forEach((list) => {
    const accordionItems = gsap.utils.toArray(".accordion_wrap");

    accordionItems.forEach((item) => {
      const content = item.querySelector(".accordion_content");
      const icon = item.querySelector(".accordion_icon-wrap");

      gsap.set(content, { height: 0, display: "none" });
      item.classList.remove("is-open");
      gsap.set(icon, { rotate: 0 });
    });

    const firstItem = accordionItems[0];
    const firstContent = firstItem.querySelector(".accordion_content");
    const firstIcon = firstItem.querySelector(".accordion_icon-wrap");

    gsap.set(firstContent, { height: "auto", display: "block" });
    firstItem.classList.add("is-open");
    gsap.set(firstIcon, { rotation: 180 });

    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion_title");
      const content = item.querySelector(".accordion_content");
      const icon = item.querySelector(".accordion_icon-wrap");

      header.addEventListener("click", () => {
        accordionItems.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherContent = otherItem.querySelector(".accordion_content");
            const otherIcon = otherItem.querySelector(".accordion_icon-wrap");

            if (otherItem.classList.contains("is-open")) {
              otherItem.classList.remove("is-open");

              gsap.to(otherContent, {
                height: 0,
                duration: 0.5,
                ease: easeBase,
                onComplete: () => {
                  gsap.set(otherContent, { display: "none" });
                },
              });

              gsap.to(otherIcon, {
                rotate: 0,
                duration: 0.5,
                ease: easeBase,
              });
            }
          }
        });

        if (!item.classList.contains("is-open")) {
          item.classList.add("is-open");
          gsap.set(content, { display: "block" });
          gsap.to(content, {
            height: "auto",
            duration: 0.5,
            ease: easeBase,
          });

          gsap.to(icon, {
            rotate: 180,
            duration: 0.5,
            ease: easeBase,
          });
        } else {
          item.classList.remove("is-open");
          gsap.to(content, {
            height: 0,
            duration: 0.5,
            ease: easeBase,
            onComplete: () => {
              gsap.set(content, { display: "none" });
            },
          });

          gsap.to(icon, {
            rotate: 0,
            duration: 0.5,
            ease: easeBase,
          });
        }
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  accordion();
});
