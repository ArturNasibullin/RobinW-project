window.addEventListener("DOMContentLoaded", () => {
  //Smooth Scroll

  function scrollTo() {
    const links = document.querySelectorAll(".header-menu__link");
    links.forEach((each) => (each.onclick = scrollAnchors));
  }

  function scrollAnchors(e, respond = null) {
    const distanceToTop = (el) => Math.floor(el.getBoundingClientRect().top);
    e.preventDefault();
    var targetID = respond
      ? respond.getAttribute("href")
      : this.getAttribute("href");
    const targetAnchor = document.querySelector(targetID);
    if (!targetAnchor) return;
    const originalTop = distanceToTop(targetAnchor);
    window.scrollBy({ top: originalTop - 30, left: 0, behavior: "smooth" });
    const checkIfDone = setInterval(function () {
      const atBottom =
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 2;
      if (distanceToTop(targetAnchor) === 0 || atBottom) {
        targetAnchor.tabIndex = "-1";
        targetAnchor.focus();
        window.history.pushState("", "", targetID);
        clearInterval(checkIfDone);
      }
    }, 100);
  }
  scrollTo();

  // Кнопка menu
  let btn = document.querySelector(".header__nav-btn");
  let menu = document.querySelector(".header-menu");
  let menuItem = document.querySelectorAll(".header-menu__link");

  btn.addEventListener("click", () => {
    menu.classList.toggle("active");
    btn.classList.toggle("active");

    menuItem.forEach((item) => {
      item.addEventListener("click", () => {
        btn.classList.remove("active");
        menu.classList.remove("active");
      });
    });
    // Блокировать прокрутку экрана при активном Меню
    if (menu.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  let animatedItem = document.querySelectorAll(".animate__animated");
  animatedItem.forEach((item) => {
    item.style.opacity = 0;
    let effect = item.dataset.effect;
    var waypoint = new Waypoint({
      element: item,
      handler: function (direction) {
        if (effect === "fadeInUp") {
          item.classList.add("animate__fadeInUp");
        } else if (effect === "fadeInLeft") {
          item.classList.add("animate__fadeInLeft");
        } else if (effect === "fadeInRight") {
          item.classList.add("animate__fadeInRight");
        } else if (effect === "flipInX") {
          item.classList.add("animate__flipInX");
          item.style.opacity = 1;
        } else if (effect === "zoomIn") {
          item.classList.add("animate__zoomIn");
          item.style.opacity = 1;
        } else if (effect === "pulse") {
          item.classList.add("animate__pulse");
          item.style.opacity = 1;
        }
      },
      offset: "75%",
    });
  });
});
