window.addEventListener("DOMContentLoaded", () => {
  //Анимации на JavaScript для модального окна
  // fadeIn function
  function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += 0.1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }
  // fadeOut function
  function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
      if ((el.style.opacity -= 0.1) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  // Модальное окно
  let modal = document.querySelector(".modal");
  let modalOpen = document.querySelectorAll(".modal-open");
  let modalClose = document.querySelectorAll(".modal__close");
  let modalOverlay = document.querySelector(".modal__overlay");

  //Открыть модальное окно при клике на кнопки с классом .modal-open
  modalOpen.forEach((mdl) => {
    mdl.addEventListener("click", () => {
      fadeIn(modal, "block");
      document.body.style.overflow = "hidden";
    });
  });

  //Закрыть модальное окно при клике на крестик
  modalClose.forEach((close) => {
    close.addEventListener("click", (event) => {
      event.preventDefault();
      fadeOut(modal);
      document.body.style.overflow = "";
    });
  });

  // Закрыть модальное окно при нажатии на клавишу Ecs
  document.addEventListener(
    "keydown",
    function (event) {
      if (event.code === "Escape") {
        event.preventDefault();
        fadeOut(modal);
        document.body.style.overflow = "";
      }
    },
    false
  );

  // Закрыть модальное окно при нажатии на подложку
  modalOverlay.addEventListener("click", function (event) {
    if (event.target == modalOverlay) {
      event.preventDefault();
      fadeOut(modal);
      document.body.style.overflow = "";
    }
  });

  //Smooth Scroll

  function scrollTo() {
    const links = document.querySelectorAll(".header-top__menu-link");
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
  let menuItem = document.querySelectorAll(".header__menu-link");

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

  new TypeIt("#typeItElement", {
    speed: 150,
    loop: true,
    // cursorChar: '$',
    waitUntilVisible: true,
  })
    .type("сайт", { delay: 1000 })
    .pause(1000)
    .delete(4)
    .type("лендинг", { delay: 1300 })
    .pause(2300)
    .delete(7)
    .type("сайт-визитку")
    .pause(2300)
    .delete(12)
    .type("корпоративный сайт")
    .pause(2300)
    .go();

  // Формы
  const forms = () => {
    const form = document.querySelectorAll(".form"),
      inputs = document.querySelectorAll("input"),
      phoneImputs = document.querySelectorAll('input[name="user_phone"]'),
      modalMessage = document.querySelector(".modal-thanks__header"),
      thanksModal = document.querySelector(".modal-thanks");

    phoneImputs.forEach((item) => {
      item.addEventListener("input", () => {
        item.value = item.value.replace(/[^\d]/g, "");
      });
    });

    const message = {
      loading: "Отправка заявки", //можно указать url картинки
      success: "Отлично! Скоро я с Вами свяжусь!",
      failure: "К сожалению, что-то пошло не так...попробуйте еще раз позже",
    };

    const postData = async (url, data) => {
      modalMessage.textContent = message.loading;
      let res = await fetch(url, {
        method: "POST",
        body: data,
      });

      return await res.text();
    };

    const clearInputs = () => {
      inputs.forEach((item) => {
        if (item.hasAttribute("placeholder")) {
          item.value = "";
        }
      });
    };

    form.forEach((item) => {
      item.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(item);

        postData("mail.php", formData)
          .then((res) => {
            console.log(res);
            fadeOut(modal);
            fadeIn(thanksModal);
            modalMessage.textContent = message.success;
          })
          .catch(() => (modalMessage.textContent = message.failure))
          .finally(() => {
            clearInputs();
            setTimeout(() => {
              fadeOut(thanksModal);
              document.body.style.overflow = "";
            }, 3000);
          });
      });
    });
  };

  forms();
});
