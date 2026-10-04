import { Store } from "./storage.js";
import { getFirebase } from "./firebase-core.js";

const canvas =
  document.querySelector("#shareCanvas");

const ctx =
  canvas.getContext("2d");

const result =
  Store.get(
    "cp_last_result",
    { score: 0 }
  );

const nameEl =
  document.querySelector("#cardName");

const scoreEl =
  document.querySelector("#cardScore");

const textEl =
  document.querySelector("#challengeText");

const photoInput =
  document.querySelector("#photoInput");

const generateButton =
  document.querySelector("#generateCard");

const downloadButton =
  document.querySelector("#downloadCard");

const shareButton =
  document.querySelector("#shareCard");


scoreEl.value =
  result.score || 0;


let photo = null;

let activeSponsor = null;

let sponsorLoaded = false;


// =========================================================
// PHOTO
// =========================================================

photoInput?.addEventListener(
  "change",
  event => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const image =
      new Image();

    image.onload =
      () => {

        photo =
          image;

        URL.revokeObjectURL(
          image.src
        );

        draw();

      };

    image.src =
      URL.createObjectURL(
        file
      );

  }
);


// =========================================================
// CANVAS HELPERS
// =========================================================

function roundedRect(
  x,
  y,
  width,
  height,
  radius
) {

  ctx.beginPath();

  ctx.roundRect(
    x,
    y,
    width,
    height,
    radius
  );

  ctx.fill();

}


// =========================================================
// FIRESTORE SPONSOR
// =========================================================

function timestampToMilliseconds(
  value
) {

  if (!value) {
    return null;
  }

  if (
    typeof value.toDate ===
    "function"
  ) {

    return value
      .toDate()
      .getTime();

  }

  if (
    typeof value.seconds ===
    "number"
  ) {

    return (
      value.seconds *
      1000
    );

  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return null;

  }

  return date.getTime();

}


async function loadActiveSponsor() {

  try {

    const firebase =
      await getFirebase();

    if (
      !firebase?.enabled ||
      !firebase?.db
    ) {

      activeSponsor =
        null;

      sponsorLoaded =
        true;

      return null;

    }


    const {
      collection,
      getDocs,
      query,
      where
    } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
    );


    const sponsorQuery =
      query(
        collection(
          firebase.db,
          "sponsors"
        ),
        where(
          "status",
          "==",
          "active"
        )
      );


    const snapshot =
      await getDocs(
        sponsorQuery
      );


    const now =
      Date.now();


    const validSponsors =
      snapshot.docs
        .map(
          document => ({
            id:
              document.id,

            ...document.data()
          })
        )
        .filter(
          sponsor => {

            if (
              sponsor.status !==
              "active"
            ) {

              return false;

            }


            if (
              !sponsor.expiresAt
            ) {

              return true;

            }


            const expiry =
              timestampToMilliseconds(
                sponsor.expiresAt
              );


            if (!expiry) {
              return false;
            }


            return (
              expiry >
              now
            );

          }
        );


    activeSponsor =
      validSponsors.length
        ? validSponsors[0]
        : null;


    sponsorLoaded =
      true;


    console.log(
      "Achievement card sponsor:",
      activeSponsor
        ? activeSponsor.business
        : "No active sponsor"
    );


    return activeSponsor;

  }

  catch (error) {

    console.error(
      "Unable to load achievement card sponsor:",
      error
    );


    activeSponsor =
      null;

    sponsorLoaded =
      true;


    return null;

  }

}


// =========================================================
// DRAW SPONSOR
// =========================================================

function drawSponsor() {

  if (
    !activeSponsor ||
    !activeSponsor.business
  ) {

    return;

  }


  const sponsorName =
    String(
      activeSponsor.business
    )
      .trim()
      .toUpperCase();


  if (!sponsorName) {
    return;
  }


  ctx.fillStyle =
    "rgba(255,209,102,.09)";

  roundedRect(
    150,
    1085,
    780,
    80,
    20
  );


  ctx.fillStyle =
    "#FFD166";

  ctx.font =
    "800 24px Arial";

  ctx.textAlign =
    "center";


  ctx.fillText(
    `SPONSORED BY • ${sponsorName}`,
    540,
    1134
  );

}


// =========================================================
// DRAW CARD
// =========================================================

function draw() {

  // -------------------------------------------------------
  // BACKGROUND
  // -------------------------------------------------------

  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      1080,
      1350
    );

  gradient.addColorStop(
    0,
    "#070B1A"
  );

  gradient.addColorStop(
    0.55,
    "#24124D"
  );

  gradient.addColorStop(
    1,
    "#0C1832"
  );


  ctx.fillStyle =
    gradient;

  ctx.fillRect(
    0,
    0,
    1080,
    1350
  );


  // -------------------------------------------------------
  // STARS
  // -------------------------------------------------------

  for (
    let i = 0;
    i < 80;
    i++
  ) {

    ctx.fillStyle =
      `rgba(255,255,255,${
        Math.random() * 0.35
      })`;

    ctx.beginPath();

    ctx.arc(
      Math.random() *
        1080,
      Math.random() *
        1350,
      Math.random() *
        2.2,
      0,
      Math.PI * 2
    );

    ctx.fill();

  }


  // -------------------------------------------------------
  // INNER CARD
  // -------------------------------------------------------

  ctx.fillStyle =
    "rgba(255,255,255,.07)";

  roundedRect(
    70,
    80,
    940,
    1190,
    42
  );


  // -------------------------------------------------------
  // BRAND
  // -------------------------------------------------------

  ctx.textAlign =
    "center";

  ctx.fillStyle =
    "#00D9FF";

  ctx.font =
    "800 34px Arial";

  ctx.fillText(
    "CHILL PLANET",
    540,
    150
  );


  // -------------------------------------------------------
  // SCORE TITLE
  // -------------------------------------------------------

  ctx.fillStyle =
    "#F7F8FF";

  ctx.font =
    "900 66px Arial";

  ctx.fillText(
    "I JUST SCORED",
    540,
    260
  );


  // -------------------------------------------------------
  // SCORE
  // -------------------------------------------------------

  ctx.font =
    "900 170px Arial";

  ctx.fillStyle =
    "#FFD166";

  ctx.fillText(
    String(
      scoreEl?.value ||
      0
    ),
    540,
    445
  );


  ctx.font =
    "700 34px Arial";

  ctx.fillStyle =
    "#AAB0C5";

  ctx.fillText(
    "POINTS",
    540,
    500
  );


  // -------------------------------------------------------
  // PHOTO
  // -------------------------------------------------------

  if (photo) {

    ctx.save();

    ctx.beginPath();

    ctx.arc(
      540,
      675,
      118,
      0,
      Math.PI * 2
    );

    ctx.clip();


    const size =
      Math.min(
        photo.width,
        photo.height
      );


    ctx.drawImage(
      photo,
      (
        photo.width -
        size
      ) / 2,
      (
        photo.height -
        size
      ) / 2,
      size,
      size,
      422,
      557,
      236,
      236
    );


    ctx.restore();

  }

  else {

    ctx.fillStyle =
      "#11172A";

    ctx.beginPath();

    ctx.arc(
      540,
      675,
      118,
      0,
      Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
      "#7C4DFF";

    ctx.font =
      "900 70px Arial";

    ctx.fillText(
      "✦",
      540,
      700
    );

  }


  // -------------------------------------------------------
  // PLAYER NAME
  // -------------------------------------------------------

  ctx.fillStyle =
    "#F7F8FF";

  ctx.font =
    "800 46px Arial";

  ctx.fillText(
    nameEl?.value ||
    "Chill Planet Player",
    540,
    855
  );


  // -------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------

  ctx.fillStyle =
    "#F7F8FF";

  ctx.font =
    "800 52px Arial";

  ctx.fillText(
    textEl?.value ||
    "Can you beat me?",
    540,
    970
  );


  // -------------------------------------------------------
  // TAGLINE
  // -------------------------------------------------------

  ctx.fillStyle =
    "#AAB0C5";

  ctx.font =
    "600 27px Arial";

  ctx.fillText(
    "Play. Relax. Share.",
    540,
    1030
  );


  // -------------------------------------------------------
  // SPONSOR
  // -------------------------------------------------------

  drawSponsor();


  // -------------------------------------------------------
  // DEVELOPER
  // -------------------------------------------------------

  ctx.fillStyle =
    "#AAB0C5";

  ctx.font =
    "600 22px Arial";

  ctx.fillText(
    "Built by Eng. Amiim Tumwekwase",
    540,
    1220
  );

}


// =========================================================
// DRAW WITH SPONSOR CHECK
// =========================================================

async function drawWithSponsor() {

  if (!sponsorLoaded) {

    await loadActiveSponsor();

  }

  draw();

}


// =========================================================
// LIVE FIELD UPDATES
// =========================================================

[
  nameEl,
  scoreEl,
  textEl
]
  .filter(Boolean)
  .forEach(
    element => {

      element.addEventListener(
        "input",
        draw
      );

    }
  );


// =========================================================
// UPDATE CARD
// =========================================================

generateButton?.addEventListener(
  "click",
  async () => {

    await drawWithSponsor();

  }
);


// =========================================================
// DOWNLOAD CARD
// =========================================================

downloadButton?.addEventListener(
  "click",
  async () => {

    await drawWithSponsor();


    const link =
      document.createElement(
        "a"
      );


    link.download =
      "chill-planet-result.png";


    link.href =
      canvas.toDataURL(
        "image/png"
      );


    link.click();

  }
);


// =========================================================
// SHARE CARD
// =========================================================

shareButton?.addEventListener(
  "click",
  async () => {

    await drawWithSponsor();


    canvas.toBlob(
      async blob => {

        if (!blob) {
          return;
        }


        const file =
          new File(
            [blob],
            "chill-planet-result.png",
            {
              type:
                "image/png"
            }
          );


        if (
          navigator.canShare?.({
            files: [file]
          })
        ) {

          try {

            await navigator.share({
              title:
                "My Chill Planet Result",

              text:
                "Can you beat me?",

              files:
                [file]
            });

          }

          catch (error) {

            if (
              error?.name !==
              "AbortError"
            ) {

              console.error(
                "Share failed:",
                error
              );

            }

          }

        }

        else {

          const link =
            document.createElement(
              "a"
            );


          link.download =
            file.name;


          link.href =
            URL.createObjectURL(
              blob
            );


          link.click();


          setTimeout(
            () => {

              URL.revokeObjectURL(
                link.href
              );

            },
            1000
          );

        }

      },
      "image/png"
    );

  }
);


// =========================================================
// INITIAL LOAD
// =========================================================

draw();

loadActiveSponsor()
  .then(
    () => {

      draw();

    }
  );