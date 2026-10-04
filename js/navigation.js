// =========================================================
// CHILL PLANET
// MOBILE + DESKTOP NAVIGATION
// =========================================================


// =========================================================
// ELEMENTS
// =========================================================

const nav =
  document.querySelector(
    ".topbar nav"
  );

const menuBtn =
  document.querySelector(
    "#menuToggle"
  );


// =========================================================
// CURRENT PAGE
// =========================================================

const currentPage =
  location.pathname
    .split("/")
    .pop() ||
  "index.html";


// =========================================================
// TOGGLE MENU
// =========================================================

function openMenu() {

  if (
    !nav ||
    !menuBtn
  ) {

    return;

  }


  nav.classList.add(
    "open"
  );


  menuBtn.setAttribute(
    "aria-expanded",
    "true"
  );


  menuBtn.textContent =
    "✕";


  menuBtn.setAttribute(
    "aria-label",
    "Close navigation"
  );

}


function closeMenu() {

  if (
    !nav ||
    !menuBtn
  ) {

    return;

  }


  nav.classList.remove(
    "open"
  );


  menuBtn.setAttribute(
    "aria-expanded",
    "false"
  );


  menuBtn.textContent =
    "☰";


  menuBtn.setAttribute(
    "aria-label",
    "Open navigation"
  );

}


function toggleMenu() {

  if (
    !nav ||
    !menuBtn
  ) {

    return;

  }


  if (
    nav.classList.contains(
      "open"
    )
  ) {

    closeMenu();

  }

  else {

    openMenu();

  }

}


// =========================================================
// MENU BUTTON
// =========================================================

if (
  menuBtn &&
  nav
) {

  menuBtn.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      toggleMenu();

    }
  );


  nav
    .querySelectorAll(
      "a"
    )
    .forEach(
      link => {

        link.addEventListener(
          "click",
          () => {

            closeMenu();

          }
        );

      }
    );

}


// =========================================================
// CLOSE MENU WHEN CLICKING OUTSIDE
// =========================================================

document.addEventListener(
  "click",
  event => {

    if (
      !nav ||
      !menuBtn ||
      !nav.classList.contains(
        "open"
      )
    ) {

      return;

    }


    const clickedInsideNav =
      nav.contains(
        event.target
      );


    const clickedMenuButton =
      menuBtn.contains(
        event.target
      );


    if (
      !clickedInsideNav &&
      !clickedMenuButton
    ) {

      closeMenu();

    }

  }
);


// =========================================================
// CLOSE MENU WITH ESCAPE KEY
// =========================================================

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Escape"
    ) {

      closeMenu();

    }

  }
);


// =========================================================
// ACTIVE NAV LINK
// =========================================================

document
  .querySelectorAll(
    ".topbar nav a"
  )
  .forEach(
    link => {

      const href =
        link
          .getAttribute(
            "href"
          )
          ?.split("?")[0]
          ?.split("#")[0]
          ?.split("/")
          .pop();


      if (
        href ===
        currentPage
      ) {

        link.classList.add(
          "active"
        );

      }

    }
  );


// =========================================================
// PAGE HELPERS
// =========================================================

function isAdminPage() {

  return location.pathname.includes(
    "/admin/"
  );

}


function isHomePage() {

  return (
    currentPage ===
      "index.html" ||
    currentPage ===
      ""
  );

}


// =========================================================
// CREATE BACK BUTTON
// =========================================================

function createBackButton() {

  if (
    isHomePage() ||
    isAdminPage()
  ) {

    return;

  }


  if (
    document.querySelector(
      "#cpBackButton"
    )
  ) {

    return;

  }


  const button =
    document.createElement(
      "button"
    );


  button.id =
    "cpBackButton";


  button.className =
    "cp-back-button";


  button.type =
    "button";


  button.setAttribute(
    "aria-label",
    "Go back"
  );


  button.innerHTML = `
    <span
      class="cp-back-icon"
      aria-hidden="true"
    >
      ←
    </span>

    <span
      class="cp-back-text"
    >
      Back
    </span>
  `;


  button.addEventListener(
    "click",
    () => {

      if (
        history.length >
        1
      ) {

        history.back();

      }

      else {

        location.href =
          "index.html";

      }

    }
  );


  document.body.appendChild(
    button
  );

}


// =========================================================
// MOBILE BOTTOM NAV
// =========================================================

function createBottomNavigation() {

  if (
    isAdminPage()
  ) {

    return;

  }


  if (
    document.querySelector(
      "#cpBottomNav"
    )
  ) {

    return;

  }


  const bottomNav =
    document.createElement(
      "nav"
    );


  bottomNav.id =
    "cpBottomNav";


  bottomNav.className =
    "cp-bottom-nav";


  bottomNav.setAttribute(
    "aria-label",
    "Mobile navigation"
  );


  bottomNav.innerHTML = `

    <a
      href="index.html"
      data-page="index.html"
      class="cp-bottom-link"
    >
      <span class="cp-bottom-icon">
        ⌂
      </span>

      <span>
        Home
      </span>
    </a>


    <a
      href="play.html"
      data-page="play.html"
      class="cp-bottom-link"
    >
      <span class="cp-bottom-icon">
        ▶
      </span>

      <span>
        Play
      </span>
    </a>


    <a
      href="relax.html"
      data-page="relax.html"
      class="cp-bottom-link"
    >
      <span class="cp-bottom-icon">
        ☁
      </span>

      <span>
        Relax
      </span>
    </a>


    <a
      href="challenge.html"
      data-page="challenge.html"
      class="cp-bottom-link"
    >
      <span class="cp-bottom-icon">
        ⚔
      </span>

      <span>
        Challenge
      </span>
    </a>


    <button
      type="button"
      id="cpBottomMore"
      class="cp-bottom-link cp-bottom-more"
      aria-label="More navigation"
    >
      <span class="cp-bottom-icon">
        ☰
      </span>

      <span>
        More
      </span>
    </button>

  `;


  document.body.appendChild(
    bottomNav
  );


  bottomNav
    .querySelectorAll(
      "[data-page]"
    )
    .forEach(
      link => {

        if (
          link.dataset.page ===
          currentPage
        ) {

          link.classList.add(
            "active"
          );

        }

      }
    );


  const moreButton =
    document.querySelector(
      "#cpBottomMore"
    );


  moreButton
    ?.addEventListener(
      "click",
      () => {

        if (
          nav
        ) {

          toggleMenu();

        }

      }
    );

}


// =========================================================
// MOBILE NAV BODY SPACING
// =========================================================

function setupMobileNavSpacing() {

  if (
    isAdminPage()
  ) {

    return;

  }


  document.body.classList.add(
    "has-cp-bottom-nav"
  );

}


// =========================================================
// HANDLE RESIZE
// =========================================================

window.addEventListener(
  "resize",
  () => {

    if (
      window.innerWidth >
      900
    ) {

      closeMenu();

    }

  }
);


// =========================================================
// INITIALIZE
// =========================================================

function initializeNavigation() {

  createBackButton();

  createBottomNavigation();

  setupMobileNavSpacing();


  console.log(
    "Chill Planet navigation ready."
  );

}


initializeNavigation();