/* =========================================================
   CHILL PLANET
   SPONSORS — FIRESTORE VERSION
   ========================================================= */

import { uid } from "./storage.js";
import { getFirebase } from "./firebase-core.js";


// =========================================================
// CONSTANTS
// =========================================================

const SPONSOR_REQUESTS_COLLECTION =
  "sponsor_requests";

const ACTIVE_SPONSORS_COLLECTION =
  "sponsors";

const SPONSOR_PRICE =
  "UGX 10,000 / week";

const PAYMENT_PHONE =
  "0786598658";

const WHATSAPP_NUMBER =
  "256786598658";


// =========================================================
// ELEMENTS
// =========================================================

const form =
  document.querySelector(
    "#sponsorForm"
  );

const sponsorGrid =
  document.querySelector(
    "#sponsorGrid"
  );

const sponsorResult =
  document.querySelector(
    "#sponsorResult"
  );


// =========================================================
// FIRESTORE HELPERS
// =========================================================

async function getFirestoreTools() {

  const fb =
    await getFirebase();


  if (
    !fb.enabled ||
    !fb.db
  ) {

    throw new Error(
      "Firestore is not connected."
    );

  }


  const firestore =
    await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
    );


  return {
    db: fb.db,
    ...firestore
  };

}


// =========================================================
// LOAD ACTIVE SPONSORS
// =========================================================

async function loadActiveSponsors() {

  try {

    const {
      db,
      collection,
      getDocs,
      query,
      where
    } =
      await getFirestoreTools();


    const sponsorsQuery =
      query(
        collection(
          db,
          ACTIVE_SPONSORS_COLLECTION
        ),
        where(
          "status",
          "==",
          "active"
        )
      );


    const snapshot =
      await getDocs(
        sponsorsQuery
      );


    const sponsors =
      snapshot.docs
        .map(
          document => {

            const data =
              document.data();


            return {
              id:
                document.id,

              business:
                data.business || "",

              message:
                data.message || "",

              link:
                data.link || "",

              imageUrl:
                data.imageUrl || "",

              status:
                data.status || "active",

              activatedAt:
                timestampToDate(
                  data.activatedAt
                ),

              expiresAt:
                timestampToDate(
                  data.expiresAt
                )
            };

          }
        )
        .filter(
          sponsor =>
            isSponsorStillActive(
              sponsor
            )
        );


    return sponsors;

  }

  catch (error) {

    console.error(
      "Failed to load active sponsors:",
      error
    );


    return [];

  }

}


// =========================================================
// SPONSOR ACTIVE CHECK
// =========================================================

function isSponsorStillActive(
  sponsor
) {

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
    new Date(
      sponsor.expiresAt
    );


  if (
    Number.isNaN(
      expiry.getTime()
    )
  ) {

    return true;

  }


  return expiry >
    new Date();

}


// =========================================================
// RENDER SPONSORS
// =========================================================

async function renderSponsors() {

  if (!sponsorGrid) {
    return;
  }


  sponsorGrid.innerHTML = `
    <div class="feature-card gold">
      <span class="sponsor-label">
        LOADING
      </span>

      <h3>
        Checking Chill Planet sponsors...
      </h3>

      <p>
        Please wait.
      </p>
    </div>
  `;


  const sponsors =
    await loadActiveSponsors();


  if (!sponsors.length) {

    sponsorGrid.innerHTML = `
      <div class="feature-card gold">

        <span class="sponsor-label">
          OPEN SLOT
        </span>

        <h3>
          Your brand here
        </h3>

        <p>
          Become one of the first
          Chill Planet sponsors.
        </p>

        <p class="muted">
          ${escapeHtml(
            SPONSOR_PRICE
          )}
        </p>

      </div>
    `;


    return;

  }


  sponsorGrid.innerHTML =
    sponsors
      .map(
        sponsor =>
          buildSponsorCard(
            sponsor
          )
      )
      .join("");

}


// =========================================================
// BUILD SPONSOR CARD
// =========================================================

function buildSponsorCard(
  sponsor
) {

  const business =
    escapeHtml(
      sponsor.business
    );


  const message =
    escapeHtml(
      sponsor.message
    );


  const safeLink =
    sanitizeUrl(
      sponsor.link
    );


  const safeImage =
    sanitizeUrl(
      sponsor.imageUrl
    );


  const imageHtml =
    safeImage
      ? `
        <div class="sponsor-card-image-wrap">
          <img
            class="sponsor-card-image"
            src="${safeImage}"
            alt="${business}"
            loading="lazy"
          >
        </div>
      `
      : "";


  const inner = `
    ${imageHtml}

    <span class="sponsor-label">
      SPONSORED
    </span>

    <h3>
      ${business}
    </h3>

    <p>
      ${message}
    </p>
  `;


  if (safeLink) {

    return `
      <a
        class="feature-card gold"
        href="${safeLink}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${inner}
      </a>
    `;

  }


  return `
    <div
      class="feature-card gold"
    >
      ${inner}
    </div>
  `;

}


// =========================================================
// SUBMIT SPONSOR APPLICATION
// =========================================================

form?.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const businessNameInput =
      document.querySelector(
        "#businessName"
      );


    const contactNameInput =
      document.querySelector(
        "#contactName"
      );


    const phoneInput =
      document.querySelector(
        "#phone"
      );


    const adMessageInput =
      document.querySelector(
        "#adMessage"
      );


    const sponsorLinkInput =
      document.querySelector(
        "#sponsorLink"
      );


    if (
      !businessNameInput ||
      !contactNameInput ||
      !phoneInput ||
      !adMessageInput
    ) {

      showResult(
        "Sponsor form fields are missing.",
        true
      );

      return;

    }


    const business =
      businessNameInput
        .value
        .trim();


    const contact =
      contactNameInput
        .value
        .trim();


    const phone =
      phoneInput
        .value
        .trim();


    const message =
      adMessageInput
        .value
        .trim();


    const link =
      sponsorLinkInput
        ?.value
        .trim() || "";


    if (
      !business ||
      !contact ||
      !phone ||
      !message
    ) {

      showResult(
        "Please complete all required sponsor fields.",
        true
      );

      return;

    }


    const submitButton =
      form.querySelector(
        'button[type="submit"]'
      );


    const originalButtonText =
      submitButton
        ?.textContent || "";


    if (submitButton) {

      submitButton.disabled =
        true;


      submitButton.textContent =
        "Submitting...";

    }


    const sponsorId =
      uid("SP");


    try {

      const {
        db,
        doc,
        setDoc,
        serverTimestamp
      } =
        await getFirestoreTools();


      const sponsorRequest = {

        sponsorId,

        business,

        contact,

        phone,

        message,

        link,

        status:
          "pending",

        paymentStatus:
          "pending",

        proofStatus:
          "not_submitted",

        createdAt:
          serverTimestamp(),

        activatedAt:
          null,

        expiresAt:
          null,

        imageUrl:
          "",

        cloudinaryPublicId:
          ""

      };


      await setDoc(
        doc(
          db,
          SPONSOR_REQUESTS_COLLECTION,
          sponsorId
        ),

        sponsorRequest
      );


      showApplicationSuccess(
        sponsorId
      );


      form.reset();


      console.log(
        "Sponsor application submitted:",
        sponsorId
      );

  }

  catch (error) {

    console.error(
      "Sponsor application failed:",
      error
    );


    if (
      error?.code ===
      "permission-denied"
    ) {

      showResult(
        "Firebase blocked the sponsor request. Check your Firestore rules.",
        true
      );

    }

    else {

      showResult(
        "Unable to submit your sponsorship request. Check your internet connection and try again.",
        true
      );

    }

  }

  finally {

    if (submitButton) {

      submitButton.disabled =
        false;


      submitButton.textContent =
        originalButtonText ||
        "Apply for Sponsorship";

    }

  }

});


// =========================================================
// SUCCESS MESSAGE
// =========================================================

function showApplicationSuccess(
  sponsorId
) {

  if (!sponsorResult) {
    return;
  }


  const whatsappText =
    encodeURIComponent(
      `Hello Chill Planet, I have paid for sponsorship. My Sponsor ID is: ${sponsorId}`
    );


  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;


  sponsorResult.classList.remove(
    "hidden"
  );


  sponsorResult.innerHTML = `

    <strong>
      Application received.
    </strong>

    <p>
      Your Sponsor ID is
      <b>
        ${escapeHtml(
          sponsorId
        )}
      </b>.
    </p>

    <p>
      <strong>
        Sponsorship:
      </strong>

      ${escapeHtml(
        SPONSOR_PRICE
      )}
    </p>

    <p>
      <strong>
        Payment & WhatsApp:
      </strong>

      ${escapeHtml(
        PAYMENT_PHONE
      )}
    </p>

    <p>
      After payment, send this
      Sponsor ID together with your
      payment screenshot on WhatsApp.
      Activation is manual.
    </p>

    <a
      class="btn btn-small btn-primary"
      href="${whatsappUrl}"
      target="_blank"
      rel="noopener noreferrer"
    >
      Send Proof on WhatsApp
    </a>

  `;

}


// =========================================================
// ERROR / INFORMATION MESSAGE
// =========================================================

function showResult(
  message,
  isError = false
) {

  if (!sponsorResult) {
    return;
  }


  sponsorResult.classList.remove(
    "hidden"
  );


  sponsorResult.innerHTML = `
    <p class="${
      isError
        ? "feedback bad"
        : "feedback good"
    }">
      ${escapeHtml(
        message
      )}
    </p>
  `;

}


// =========================================================
// FIRESTORE TIMESTAMP HELPER
// =========================================================

function timestampToDate(
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
      .toISOString();

  }


  return value;

}


// =========================================================
// SAFE URL
// =========================================================

function sanitizeUrl(
  value
) {

  if (!value) {
    return "";
  }


  try {

    const url =
      new URL(
        value
      );


    if (
      url.protocol !==
        "http:" &&
      url.protocol !==
        "https:"
    ) {

      return "";

    }


    return url.href;

  }

  catch {

    return "";

  }

}


// =========================================================
// HTML ESCAPE
// =========================================================

function escapeHtml(
  value
) {

  return String(
    value ?? ""
  ).replace(
    /[&<>"']/g,
    character => (
      {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[character]
    )
  );

}


// =========================================================
// INITIALIZE
// =========================================================

renderSponsors();