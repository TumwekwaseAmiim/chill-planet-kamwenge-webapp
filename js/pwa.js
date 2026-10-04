// =========================================================
// CHILL PLANET PWA
// Service Worker + Install Prompt
// =========================================================

let deferredInstallPrompt = null;


// =========================================================
// REGISTER SERVICE WORKER
// =========================================================

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    async () => {

      try {

        const registration =
          await navigator.serviceWorker.register(
            "service-worker.js",
            {
              updateViaCache: "none"
            }
          );


        await registration.update();


        console.log(
          "Chill Planet service worker registered."
        );

      }

      catch (error) {

        console.warn(
          "Chill Planet service worker registration failed:",
          error
        );

      }

    }
  );

}


// =========================================================
// CREATE INSTALL POPUP
// =========================================================

function createInstallPopup() {

  if (
    document.querySelector(
      "#chillPlanetInstallPopup"
    )
  ) {

    return;

  }


  const popup =
    document.createElement(
      "div"
    );


  popup.id =
    "chillPlanetInstallPopup";


  popup.innerHTML = `
    <div
      style="
        position:fixed;
        left:16px;
        right:16px;
        bottom:18px;
        z-index:99999;
        max-width:520px;
        margin:0 auto;
        background:rgba(17,23,42,.96);
        border:1px solid rgba(124,77,255,.45);
        border-radius:22px;
        padding:16px;
        box-shadow:0 20px 60px rgba(0,0,0,.45);
        backdrop-filter:blur(18px);
        -webkit-backdrop-filter:blur(18px);
        color:#F7F8FF;
        font-family:inherit;
      "
    >

      <div
        style="
          display:flex;
          align-items:center;
          gap:14px;
        "
      >

        <img
          src="assets/icons/icon-192.png"
          alt="Chill Planet"
          style="
            width:58px;
            height:58px;
            border-radius:16px;
            object-fit:cover;
            flex-shrink:0;
          "
        >


        <div
          style="
            flex:1;
            min-width:0;
          "
        >

          <div
            style="
              font-weight:800;
              font-size:1.05rem;
              margin-bottom:4px;
            "
          >
            Install Chill Planet
          </div>


          <div
            style="
              color:#AAB0C5;
              font-size:.9rem;
              line-height:1.4;
            "
          >
            Add Chill Planet to your phone for faster access.
          </div>

        </div>

      </div>


      <div
        style="
          display:flex;
          gap:10px;
          margin-top:14px;
        "
      >

        <button
          id="chillPlanetInstallButton"
          type="button"
          style="
            flex:1;
            border:none;
            border-radius:14px;
            padding:12px 16px;
            cursor:pointer;
            font:inherit;
            font-weight:800;
            color:#070B1A;
            background:linear-gradient(
              135deg,
              #00D9FF,
              #39E58C
            );
          "
        >
          Install
        </button>


        <button
          id="chillPlanetInstallLater"
          type="button"
          style="
            border:1px solid rgba(255,255,255,.16);
            border-radius:14px;
            padding:12px 16px;
            cursor:pointer;
            font:inherit;
            font-weight:700;
            color:#F7F8FF;
            background:transparent;
          "
        >
          Later
        </button>

      </div>

    </div>
  `;


  document.body.appendChild(
    popup
  );


  document
    .querySelector(
      "#chillPlanetInstallButton"
    )
    ?.addEventListener(
      "click",
      installChillPlanet
    );


  document
    .querySelector(
      "#chillPlanetInstallLater"
    )
    ?.addEventListener(
      "click",
      () => {

        hideInstallPopup();

        sessionStorage.setItem(
          "cp_install_dismissed",
          "1"
        );

      }
    );

}


// =========================================================
// SHOW INSTALL POPUP
// =========================================================

function showInstallPopup() {

  if (
    sessionStorage.getItem(
      "cp_install_dismissed"
    ) === "1"
  ) {

    return;

  }


  createInstallPopup();


  const popup =
    document.querySelector(
      "#chillPlanetInstallPopup"
    );


  if (popup) {

    popup.style.display =
      "block";

  }

}


// =========================================================
// HIDE INSTALL POPUP
// =========================================================

function hideInstallPopup() {

  const popup =
    document.querySelector(
      "#chillPlanetInstallPopup"
    );


  if (popup) {

    popup.remove();

  }

}


// =========================================================
// CAPTURE BROWSER INSTALL PROMPT
// =========================================================

window.addEventListener(
  "beforeinstallprompt",
  event => {

    event.preventDefault();


    deferredInstallPrompt =
      event;


    setTimeout(
      () => {

        showInstallPopup();

      },
      2500
    );

  }
);


// =========================================================
// INSTALL APP
// =========================================================

async function installChillPlanet() {

  if (
    !deferredInstallPrompt
  ) {

    return;

  }


  try {

    deferredInstallPrompt.prompt();


    const choice =
      await deferredInstallPrompt.userChoice;


    console.log(
      "Chill Planet install choice:",
      choice.outcome
    );


    if (
      choice.outcome ===
      "accepted"
    ) {

      hideInstallPopup();

    }


    deferredInstallPrompt =
      null;

  }

  catch (error) {

    console.warn(
      "Chill Planet installation failed:",
      error
    );

  }

}


// =========================================================
// APP INSTALLED
// =========================================================

window.addEventListener(
  "appinstalled",
  () => {

    console.log(
      "Chill Planet installed successfully."
    );


    deferredInstallPrompt =
      null;


    hideInstallPopup();

  }
);


// =========================================================
// IOS DETECTION
// =========================================================

function isIOS() {

  return (
    /iphone|ipad|ipod/i.test(
      navigator.userAgent
    )
  );

}


// =========================================================
// CHECK IF APP IS ALREADY INSTALLED
// =========================================================

function isStandalone() {

  return (
    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||
    window.navigator.standalone === true
  );

}


// =========================================================
// IOS INSTALL MESSAGE
// =========================================================

function showIOSInstallMessage() {

  if (
    !isIOS() ||
    isStandalone()
  ) {

    return;

  }


  if (
    sessionStorage.getItem(
      "cp_ios_install_dismissed"
    ) === "1"
  ) {

    return;

  }


  if (
    document.querySelector(
      "#chillPlanetIOSInstall"
    )
  ) {

    return;

  }


  const popup =
    document.createElement(
      "div"
    );


  popup.id =
    "chillPlanetIOSInstall";


  popup.innerHTML = `
    <div
      style="
        position:fixed;
        left:16px;
        right:16px;
        bottom:18px;
        z-index:99999;
        max-width:520px;
        margin:0 auto;
        background:rgba(17,23,42,.96);
        border:1px solid rgba(0,217,255,.35);
        border-radius:22px;
        padding:16px;
        box-shadow:0 20px 60px rgba(0,0,0,.45);
        backdrop-filter:blur(18px);
        -webkit-backdrop-filter:blur(18px);
        color:#F7F8FF;
        font-family:inherit;
      "
    >

      <div
        style="
          font-weight:800;
          font-size:1.05rem;
          margin-bottom:6px;
        "
      >
        Install Chill Planet
      </div>


      <div
        style="
          color:#AAB0C5;
          line-height:1.5;
          font-size:.92rem;
        "
      >
        Tap the Share button in Safari,
        then choose
        <strong style="color:#F7F8FF;">
          Add to Home Screen
        </strong>.
      </div>


      <button
        id="chillPlanetIOSClose"
        type="button"
        style="
          width:100%;
          margin-top:14px;
          border:none;
          border-radius:14px;
          padding:11px 14px;
          cursor:pointer;
          font:inherit;
          font-weight:800;
          color:#070B1A;
          background:#00D9FF;
        "
      >
        Got It
      </button>

    </div>
  `;


  document.body.appendChild(
    popup
  );


  document
    .querySelector(
      "#chillPlanetIOSClose"
    )
    ?.addEventListener(
      "click",
      () => {

        popup.remove();


        sessionStorage.setItem(
          "cp_ios_install_dismissed",
          "1"
        );

      }
    );

}


// =========================================================
// START IOS CHECK
// =========================================================

window.addEventListener(
  "load",
  () => {

    if (
      isStandalone()
    ) {

      return;

    }


    setTimeout(
      () => {

        showIOSInstallMessage();

      },
      3500
    );

  }
);