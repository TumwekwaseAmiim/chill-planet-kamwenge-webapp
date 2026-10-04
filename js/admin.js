/* =========================================================
   CHILL PLANET
   ADMIN CONTROL CENTER
   ========================================================= */

import { Store } from "./storage.js";

import {
  getFirebase
} from "./firebase-core.js";

import {
  counts,
  syncQuestionsFromFirestore,
  addCustomQuestion,
  deleteCustomQuestion
} from "./questions.js";

import {
  uploadSponsorImage,
  validateSponsorImage,
  createSponsorImagePreview,
  revokeSponsorImagePreview
} from "./cloudinary.js";


// =========================================================
// COLLECTIONS
// =========================================================

const SPONSOR_REQUESTS_COLLECTION =
  "sponsor_requests";

const SPONSORS_COLLECTION =
  "sponsors";


// =========================================================
// PAGE STATE
// =========================================================

const isLoginPage =
  location.pathname.endsWith("/login.html") ||
  location.pathname.endsWith("login.html");


// =========================================================
// IN-MEMORY DATA
// =========================================================

let sponsorRequests = [];

let activeSponsors = [];

let currentSponsorPreviewUrl = null;


// =========================================================
// LOCAL STORAGE HELPERS
// =========================================================

const getCustomQuestions = () =>
  Store.get(
    "cp_custom_questions",
    []
  );


const getCustomQuotes = () =>
  Store.get(
    "cp_custom_quotes",
    []
  );


// =========================================================
// ADMIN AUTH GUARD
// =========================================================

async function protectAdminPage() {

  if (isLoginPage) {
    return null;
  }


  try {

    const fb =
      await getFirebase();


    if (
      !fb.enabled ||
      !fb.auth ||
      !fb.db
    ) {

      throw new Error(
        "Firebase is not available."
      );

    }


    const {
      onAuthStateChanged,
      signOut
    } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"
    );


    const {
      doc,
      getDoc
    } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
    );


    const user =
      await new Promise(
        resolve => {

          const unsubscribe =
            onAuthStateChanged(
              fb.auth,
              currentUser => {

                unsubscribe();

                resolve(
                  currentUser
                );

              }
            );

        }
      );


    if (!user) {

      Store.remove(
        "cp_admin_session"
      );

      location.href =
        "login.html";

      return null;

    }


    const adminRef =
      doc(
        fb.db,
        "admins",
        user.uid
      );


    const adminSnapshot =
      await getDoc(
        adminRef
      );


    if (
      !adminSnapshot.exists()
    ) {

      console.error(
        "Signed-in user is not registered as a Chill Planet admin."
      );


      await signOut(
        fb.auth
      );


      Store.remove(
        "cp_admin_session"
      );


      location.href =
        "login.html";


      return null;

    }


    const adminData =
      adminSnapshot.data();


    if (
      adminData.active === false
    ) {

      await signOut(
        fb.auth
      );


      Store.remove(
        "cp_admin_session"
      );


      location.href =
        "login.html";


      return null;

    }


    Store.set(
      "cp_admin_session",
      {
        uid:
          user.uid,

        email:
          user.email,

        role:
          adminData.role ||
          "admin",

        mode:
          "firebase",

        at:
          Date.now()
      }
    );


    console.log(
      "Chill Planet admin verified:",
      user.email
    );


    return {
      user,
      adminData,
      firebase: fb
    };

  }

  catch (error) {

    console.error(
      "Admin verification failed:",
      error
    );


    Store.remove(
      "cp_admin_session"
    );


    location.href =
      "login.html";


    return null;

  }

}


// =========================================================
// TEXT HELPER
// =========================================================

function setText(
  selector,
  value
) {

  const element =
    document.querySelector(
      selector
    );


  if (element) {

    element.textContent =
      value;

  }

}


// =========================================================
// DASHBOARD STATISTICS
// =========================================================

function renderDashboardStats() {

  const questionCounts =
    counts();


  setText(
    "#kamwengeQuestionCount",
    questionCounts.kamwenge
  );


  setText(
    "#generalQuestionCount",
    questionCounts.general
  );


  setText(
    "#sportsQuestionCount",
    questionCounts.sports
  );


  setText(
    "#totalQuestionCount",
    questionCounts.kamwenge +
      questionCounts.general
  );


  setText(
    "#requestCount",
    sponsorRequests.filter(
      item =>
        item.status === "pending"
    ).length
  );


  setText(
    "#activeSponsorCount",
    activeSponsors.filter(
      item =>
        item.status === "active" &&
        isNotExpired(
          item.expiresAt
        )
    ).length
  );


  setText(
    "#playCount",
    Store.get(
      "cp_play_count",
      0
    )
  );

}


// =========================================================
// LOGOUT
// =========================================================

async function logoutAdmin() {

  const logoutButton =
    document.querySelector(
      "#logoutBtn"
    );


  if (logoutButton) {

    logoutButton.disabled =
      true;

    logoutButton.textContent =
      "Logging out...";

  }


  try {

    const fb =
      await getFirebase();


    if (
      fb.enabled &&
      fb.auth
    ) {

      const {
        signOut
      } = await import(
        "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"
      );


      await signOut(
        fb.auth
      );

    }

  }

  catch (error) {

    console.error(
      "Firebase logout failed:",
      error
    );

  }

  finally {

    Store.remove(
      "cp_admin_session"
    );


    location.href =
      "login.html";

  }

}


document
  .querySelector(
    "#logoutBtn"
  )
  ?.addEventListener(
    "click",
    logoutAdmin
  );


// =========================================================
// QUESTIONS
// =========================================================

const questionForm =
  document.querySelector(
    "#questionForm"
  );


function renderQuestions() {

  const list =
    document.querySelector(
      "#questionList"
    );


  if (!list) {
    return;
  }


  const questions =
    getCustomQuestions();


  if (!questions.length) {

    list.innerHTML = `
      <p class="muted">
        No custom questions yet.
        Chill Planet already includes generated
        Kamwenge and starter General questions.
      </p>
    `;

    return;

  }


  list.innerHTML =
    questions
      .map(
        question => `
          <div class="admin-item">

            <h4>
              ${safe(
                question.text
              )}
            </h4>

            <p>
              ${safe(
                question.category
              )}
              · Answer:
              ${safe(
                question.correct
              )}
            </p>

            <p class="muted">
              World:
              ${safe(
                question.world
              )}
            </p>

            ${
              question.id
                ? `
                  <button
                    class="btn btn-small btn-ghost"
                    type="button"
                    data-qdel="${safe(
                      question.id
                    )}"
                  >
                    Delete
                  </button>
                `
                : `
                  <span class="badge">
                    Local cache
                  </span>
                `
            }

          </div>
        `
      )
      .join("");


  list
    .querySelectorAll(
      "[data-qdel]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          async () => {

            const questionId =
              button.dataset.qdel;


            if (!questionId) {
              return;
            }


            const oldText =
              button.textContent;


            button.disabled =
              true;

            button.textContent =
              "Deleting...";


            try {

              await deleteCustomQuestion(
                questionId
              );


              renderQuestions();

              renderDashboardStats();

            }

            catch (error) {

              console.error(
                "Delete question failed:",
                error
              );


              alert(
                "Unable to delete the question."
              );


              button.disabled =
                false;

              button.textContent =
                oldText;

            }

          }
        );

      }
    );

}


// =========================================================
// REFRESH QUESTIONS
// =========================================================

async function refreshQuestions() {

  const list =
    document.querySelector(
      "#questionList"
    );


  if (list) {

    list.innerHTML = `
      <p class="muted">
        Loading questions from Chill Planet cloud...
      </p>
    `;

  }


  try {

    await syncQuestionsFromFirestore();

  }

  catch (error) {

    console.error(
      "Question synchronization failed:",
      error
    );

  }


  renderQuestions();

  renderDashboardStats();

}


// =========================================================
// ADD QUESTION
// =========================================================

questionForm?.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const world =
      document.querySelector(
        "#qWorld"
      );

    const category =
      document.querySelector(
        "#qCategory"
      );

    const questionText =
      document.querySelector(
        "#qText"
      );

    const correct =
      document.querySelector(
        "#qCorrect"
      );

    const wrong1 =
      document.querySelector(
        "#qWrong1"
      );

    const wrong2 =
      document.querySelector(
        "#qWrong2"
      );

    const wrong3 =
      document.querySelector(
        "#qWrong3"
      );


    if (
      !world ||
      !category ||
      !questionText ||
      !correct ||
      !wrong1 ||
      !wrong2 ||
      !wrong3
    ) {

      return;

    }


    const question = {

      world:
        world.value,

      category:
        category.value.trim(),

      text:
        questionText.value.trim(),

      correct:
        correct.value.trim(),

      wrong: [
        wrong1.value.trim(),
        wrong2.value.trim(),
        wrong3.value.trim()
      ]

    };


    if (
      !question.text ||
      !question.correct ||
      question.wrong.some(
        answer =>
          !answer
      )
    ) {

      alert(
        "Please complete all question fields."
      );

      return;

    }


    const submitButton =
      questionForm.querySelector(
        'button[type="submit"]'
      );


    const oldText =
      submitButton?.textContent;


    if (submitButton) {

      submitButton.disabled =
        true;

      submitButton.textContent =
        "Saving to Cloud...";

    }


    try {

      await addCustomQuestion(
        question
      );


      questionForm.reset();


      category.value =
        "General";


      renderQuestions();

      renderDashboardStats();

    }

    catch (error) {

      console.error(
        "Unable to save question:",
        error
      );


      alert(
        error?.code ===
          "permission-denied"
          ? "Firebase blocked the write. Check your admin UID and Firestore rules."
          : "Unable to save the question."
      );

    }

    finally {

      if (submitButton) {

        submitButton.disabled =
          false;

        submitButton.textContent =
          oldText ||
          "Add Question";

      }

    }

  }
);


// =========================================================
// LOAD SPONSORS FROM FIRESTORE
// =========================================================

async function loadSponsorsFromFirestore() {

  try {

    const fb =
      await getFirebase();


    if (
      !fb.enabled ||
      !fb.db
    ) {

      throw new Error(
        "Firestore is unavailable."
      );

    }


    const {
      collection,
      getDocs
    } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
    );


    const requestSnapshot =
      await getDocs(
        collection(
          fb.db,
          SPONSOR_REQUESTS_COLLECTION
        )
      );


    sponsorRequests =
      requestSnapshot.docs.map(
        document => ({

          firestoreId:
            document.id,

          ...document.data()

        })
      );


    const sponsorSnapshot =
      await getDocs(
        collection(
          fb.db,
          SPONSORS_COLLECTION
        )
      );


    activeSponsors =
      sponsorSnapshot.docs.map(
        document => ({

          firestoreId:
            document.id,

          ...document.data()

        })
      );


    console.log(
      "Sponsor requests:",
      sponsorRequests.length
    );


    console.log(
      "Active sponsors:",
      activeSponsors.length
    );

  }

  catch (error) {

    console.error(
      "Unable to load sponsors:",
      error
    );


    sponsorRequests = [];

    activeSponsors = [];

  }

}


// =========================================================
// POPULATE CLOUDINARY SPONSOR SELECT
// =========================================================

function populateSponsorImageSelector() {

  const select =
    document.querySelector(
      "#sponsorImageRequest"
    );


  if (!select) {
    return;
  }


  const previousValue =
    select.value;


  select.innerHTML = `
    <option value="">
      Select sponsor
    </option>

    ${
      sponsorRequests
        .map(
          sponsor => {

            const id =
              sponsor.firestoreId;

            const sponsorId =
              sponsor.sponsorId ||
              id;

            return `
              <option
                value="${safe(
                  id
                )}"
              >
                ${safe(
                  sponsor.business ||
                  "Unnamed Sponsor"
                )}
                — ${safe(
                  sponsorId
                )}
              </option>
            `;

          }
        )
        .join("")
    }
  `;


  if (
    previousValue &&
    sponsorRequests.some(
      sponsor =>
        sponsor.firestoreId ===
        previousValue
    )
  ) {

    select.value =
      previousValue;

  }

}


// =========================================================
// SPONSOR IMAGE PREVIEW
// =========================================================

function setupSponsorImagePreview() {

  const input =
    document.querySelector(
      "#sponsorImage"
    );


  const previewWrap =
    document.querySelector(
      "#sponsorImagePreviewWrap"
    );


  const preview =
    document.querySelector(
      "#sponsorImagePreview"
    );


  const status =
    document.querySelector(
      "#sponsorUploadStatus"
    );


  if (
    !input ||
    !previewWrap ||
    !preview
  ) {

    return;

  }


  input.addEventListener(
    "change",
    () => {

      if (
        currentSponsorPreviewUrl
      ) {

        revokeSponsorImagePreview(
          currentSponsorPreviewUrl
        );

        currentSponsorPreviewUrl =
          null;

      }


      const file =
        input.files?.[0];


      if (!file) {

        previewWrap.style.display =
          "none";

        preview.removeAttribute(
          "src"
        );

        return;

      }


      const validation =
        validateSponsorImage(
          file
        );


      if (
        !validation.valid
      ) {

        input.value = "";

        previewWrap.style.display =
          "none";


        if (status) {

          status.textContent =
            validation.message;

        }


        return;

      }


      currentSponsorPreviewUrl =
        createSponsorImagePreview(
          file
        );


      preview.src =
        currentSponsorPreviewUrl;


      previewWrap.style.display =
        "block";


      if (status) {

        status.textContent =
          "Image ready to upload.";

      }

    }
  );

}


// =========================================================
// UPLOAD SPONSOR IMAGE
// =========================================================

async function handleSponsorImageUpload() {

  const sponsorSelect =
    document.querySelector(
      "#sponsorImageRequest"
    );


  const fileInput =
    document.querySelector(
      "#sponsorImage"
    );


  const button =
    document.querySelector(
      "#uploadSponsorImage"
    );


  const status =
    document.querySelector(
      "#sponsorUploadStatus"
    );


  if (
    !sponsorSelect ||
    !fileInput ||
    !button
  ) {

    return;

  }


  const requestDocumentId =
    sponsorSelect.value;


  const file =
    fileInput.files?.[0];


  if (!requestDocumentId) {

    if (status) {

      status.textContent =
        "Please select a sponsor request first.";

    }

    return;

  }


  if (!file) {

    if (status) {

      status.textContent =
        "Please choose a sponsor image.";

    }

    return;

  }


  const request =
    sponsorRequests.find(
      item =>
        item.firestoreId ===
        requestDocumentId
    );


  if (!request) {

    if (status) {

      status.textContent =
        "Sponsor request could not be found.";

    }

    return;

  }


  const validation =
    validateSponsorImage(
      file
    );


  if (
    !validation.valid
  ) {

    if (status) {

      status.textContent =
        validation.message;

    }

    return;

  }


  const oldText =
    button.textContent;


  button.disabled =
    true;


  button.textContent =
    "Uploading...";


  if (status) {

    status.textContent =
      "Uploading image to Cloudinary...";

  }


  try {

    const uploaded =
      await uploadSponsorImage(
        file
      );


    if (
      !uploaded?.imageUrl ||
      !uploaded?.cloudinaryPublicId
    ) {

      throw new Error(
        "Cloudinary returned incomplete upload data."
      );

    }


    const fb =
      await getFirebase();


    const {
      doc,
      updateDoc,
      serverTimestamp
    } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
    );


    await updateDoc(
      doc(
        fb.db,
        SPONSOR_REQUESTS_COLLECTION,
        requestDocumentId
      ),
      {

        imageUrl:
          uploaded.imageUrl,

        cloudinaryPublicId:
          uploaded.cloudinaryPublicId,

        imageUploadedAt:
          serverTimestamp()

      }
    );


    /*
      If sponsor is already active,
      also update the public sponsor document.
    */

    const sponsorId =
      request.sponsorId ||
      requestDocumentId;


    const activeSponsor =
      activeSponsors.find(
        item =>
          item.firestoreId ===
            sponsorId ||
          item.sponsorId ===
            sponsorId
      );


    if (activeSponsor) {

      await updateDoc(
        doc(
          fb.db,
          SPONSORS_COLLECTION,
          sponsorId
        ),
        {

          imageUrl:
            uploaded.imageUrl,

          cloudinaryPublicId:
            uploaded.cloudinaryPublicId,

          imageUpdatedAt:
            serverTimestamp()

        }
      );

    }


    if (status) {

      status.textContent =
        "Sponsor image uploaded successfully.";

    }


    console.log(
      "Sponsor image uploaded:",
      uploaded
    );


    fileInput.value = "";


    if (
      currentSponsorPreviewUrl
    ) {

      revokeSponsorImagePreview(
        currentSponsorPreviewUrl
      );

      currentSponsorPreviewUrl =
        null;

    }


    await refreshSponsors();

  }

  catch (error) {

    console.error(
      "Sponsor image upload failed:",
      error
    );


    if (status) {

      status.textContent =
        error?.message ||
        "Unable to upload sponsor image.";

    }

  }

  finally {

    button.disabled =
      false;


    button.textContent =
      oldText ||
      "Upload Sponsor Image";

  }

}


// =========================================================
// CLOUDINARY UPLOAD BUTTON
// =========================================================

document
  .querySelector(
    "#uploadSponsorImage"
  )
  ?.addEventListener(
    "click",
    handleSponsorImageUpload
  );


// =========================================================
// RENDER SPONSOR REQUESTS
// =========================================================

function renderSponsors() {

  const list =
    document.querySelector(
      "#sponsorAdminList"
    );


  if (!list) {
    return;
  }


  if (!sponsorRequests.length) {

    list.innerHTML = `
      <p class="muted">
        No sponsor requests yet.
      </p>
    `;

    return;

  }


  const sorted =
    [...sponsorRequests]
      .sort(
        (a, b) =>
          timestampMilliseconds(
            b.createdAt
          ) -
          timestampMilliseconds(
            a.createdAt
          )
      );


  list.innerHTML =
    sorted
      .map(
        sponsor => {

          const sponsorId =
            sponsor.sponsorId ||
            sponsor.firestoreId;


          return `
            <div class="admin-item">

              <h4>
                ${safe(
                  sponsor.business
                )}

                <span class="badge">
                  ${safe(
                    sponsor.status ||
                    "pending"
                  )}
                </span>
              </h4>


              ${
                sponsor.imageUrl
                  ? `
                    <div
                      style="
                        margin:14px 0;
                      "
                    >
                      <img
                        src="${safe(
                          sponsor.imageUrl
                        )}"
                        alt="${safe(
                          sponsor.business
                        )}"
                        style="
                          width:140px;
                          max-height:100px;
                          object-fit:contain;
                          border-radius:14px;
                          background:#11172A;
                          padding:10px;
                        "
                      >
                    </div>
                  `
                  : `
                    <p class="muted">
                      No sponsor image uploaded yet.
                    </p>
                  `
              }


              <p>
                ${safe(
                  sponsor.message
                )}
              </p>


              <p>
                <strong>
                  Sponsor ID:
                </strong>

                ${safe(
                  sponsorId
                )}
              </p>


              <p>
                <strong>
                  Contact:
                </strong>

                ${safe(
                  sponsor.contact
                )}
                ·
                ${safe(
                  sponsor.phone
                )}
              </p>


              ${
                sponsor.link
                  ? `
                    <p>
                      <strong>
                        Link:
                      </strong>

                      ${safe(
                        sponsor.link
                      )}
                    </p>
                  `
                  : ""
              }


              ${
                sponsor.paymentStatus
                  ? `
                    <p>
                      <strong>
                        Payment:
                      </strong>

                      ${safe(
                        sponsor.paymentStatus
                      )}
                    </p>
                  `
                  : ""
              }


              ${
                sponsor.imageUrl
                  ? `
                    <p>
                      <strong>
                        Media:
                      </strong>

                      Cloudinary image ready
                    </p>
                  `
                  : ""
              }


              ${
                sponsor.expiresAt
                  ? `
                    <p>
                      <strong>
                        Expires:
                      </strong>

                      ${safe(
                        formatTimestamp(
                          sponsor.expiresAt
                        )
                      )}
                    </p>
                  `
                  : ""
              }


              <div class="admin-item-actions">

                <button
                  class="btn btn-small btn-primary"
                  type="button"
                  data-sponsor-activate="${safe(
                    sponsor.firestoreId
                  )}"
                >
                  Activate 7 Days
                </button>


                <button
                  class="btn btn-small btn-ghost"
                  type="button"
                  data-sponsor-pending="${safe(
                    sponsor.firestoreId
                  )}"
                >
                  Pending
                </button>


                <button
                  class="btn btn-small btn-ghost"
                  type="button"
                  data-sponsor-delete="${safe(
                    sponsor.firestoreId
                  )}"
                >
                  Delete
                </button>

              </div>

            </div>
          `;

        }
      )
      .join("");


  bindSponsorButtons();

}


// =========================================================
// SPONSOR BUTTONS
// =========================================================

function bindSponsorButtons() {

  document
    .querySelectorAll(
      "[data-sponsor-activate]"
    )
    .forEach(
      button => {

        button.onclick =
          async () => {

            const id =
              button.dataset
                .sponsorActivate;


            await handleSponsorButton(
              button,
              "Activating...",
              () =>
                activateSponsor(
                  id
                )
            );

          };

      }
    );


  document
    .querySelectorAll(
      "[data-sponsor-pending]"
    )
    .forEach(
      button => {

        button.onclick =
          async () => {

            const id =
              button.dataset
                .sponsorPending;


            await handleSponsorButton(
              button,
              "Updating...",
              () =>
                returnSponsorToPending(
                  id
                )
            );

          };

      }
    );


  document
    .querySelectorAll(
      "[data-sponsor-delete]"
    )
    .forEach(
      button => {

        button.onclick =
          async () => {

            const id =
              button.dataset
                .sponsorDelete;


            const confirmed =
              confirm(
                "Delete this sponsor request?"
              );


            if (!confirmed) {
              return;
            }


            await handleSponsorButton(
              button,
              "Deleting...",
              () =>
                deleteSponsorRequest(
                  id
                )
            );

          };

      }
    );

}


// =========================================================
// GENERIC SPONSOR BUTTON HANDLER
// =========================================================

async function handleSponsorButton(
  button,
  workingText,
  action
) {

  const oldText =
    button.textContent;


  button.disabled =
    true;


  button.textContent =
    workingText;


  try {

    await action();

    await refreshSponsors();

  }

  catch (error) {

    console.error(
      "Sponsor action failed:",
      error
    );


    alert(
      error?.code ===
        "permission-denied"
        ? "Firebase blocked this action. Check your admin UID and Firestore rules."
        : error?.message ||
          "Unable to complete the sponsor action."
    );


    button.disabled =
      false;


    button.textContent =
      oldText;

  }

}


// =========================================================
// ACTIVATE SPONSOR FOR 7 DAYS
// =========================================================

async function activateSponsor(
  requestDocumentId
) {

  const request =
    sponsorRequests.find(
      item =>
        item.firestoreId ===
        requestDocumentId
    );


  if (!request) {

    throw new Error(
      "Sponsor request not found."
    );

  }


  const fb =
    await getFirebase();


  const {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    Timestamp
  } = await import(
    "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
  );


  const requestRef =
    doc(
      fb.db,
      SPONSOR_REQUESTS_COLLECTION,
      requestDocumentId
    );


  const freshSnapshot =
    await getDoc(
      requestRef
    );


  if (
    !freshSnapshot.exists()
  ) {

    throw new Error(
      "Sponsor request no longer exists."
    );

  }


  const data =
    freshSnapshot.data();


  const sponsorId =
    data.sponsorId ||
    requestDocumentId;


  const expiresDate =
    new Date(
      Date.now() +
      7 *
      24 *
      60 *
      60 *
      1000
    );


  const sponsorRef =
    doc(
      fb.db,
      SPONSORS_COLLECTION,
      sponsorId
    );


  await setDoc(
    sponsorRef,
    {

      sponsorId,

      business:
        data.business || "",

      contact:
        data.contact || "",

      phone:
        data.phone || "",

      message:
        data.message || "",

      link:
        data.link || "",

      imageUrl:
        data.imageUrl || "",

      cloudinaryPublicId:
        data.cloudinaryPublicId || "",

      status:
        "active",

      activatedAt:
        serverTimestamp(),

      expiresAt:
        Timestamp.fromDate(
          expiresDate
        ),

      sourceRequestId:
        requestDocumentId

    },
    {
      merge: true
    }
  );


  await updateDoc(
    requestRef,
    {

      status:
        "active",

      paymentStatus:
        "verified",

      proofStatus:
        data.proofStatus ||
        "manual_whatsapp",

      activatedAt:
        serverTimestamp(),

      expiresAt:
        Timestamp.fromDate(
          expiresDate
        )

    }
  );


  console.log(
    "Sponsor activated:",
    sponsorId
  );

}


// =========================================================
// RETURN SPONSOR TO PENDING
// =========================================================

async function returnSponsorToPending(
  requestDocumentId
) {

  const request =
    sponsorRequests.find(
      item =>
        item.firestoreId ===
        requestDocumentId
    );


  if (!request) {

    throw new Error(
      "Sponsor request not found."
    );

  }


  const sponsorId =
    request.sponsorId ||
    requestDocumentId;


  const fb =
    await getFirebase();


  const {
    doc,
    updateDoc,
    deleteDoc
  } = await import(
    "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
  );


  await updateDoc(
    doc(
      fb.db,
      SPONSOR_REQUESTS_COLLECTION,
      requestDocumentId
    ),
    {

      status:
        "pending",

      paymentStatus:
        "pending",

      activatedAt:
        null,

      expiresAt:
        null

    }
  );


  try {

    await deleteDoc(
      doc(
        fb.db,
        SPONSORS_COLLECTION,
        sponsorId
      )
    );

  }

  catch (error) {

    console.warn(
      "Public sponsor record could not be removed:",
      error
    );

  }

}


// =========================================================
// DELETE SPONSOR REQUEST
// =========================================================

async function deleteSponsorRequest(
  requestDocumentId
) {

  const request =
    sponsorRequests.find(
      item =>
        item.firestoreId ===
        requestDocumentId
    );


  const sponsorId =
    request?.sponsorId ||
    requestDocumentId;


  const fb =
    await getFirebase();


  const {
    doc,
    deleteDoc
  } = await import(
    "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
  );


  try {

    await deleteDoc(
      doc(
        fb.db,
        SPONSORS_COLLECTION,
        sponsorId
      )
    );

  }

  catch (error) {

    console.warn(
      "No public sponsor document removed:",
      error
    );

  }


  await deleteDoc(
    doc(
      fb.db,
      SPONSOR_REQUESTS_COLLECTION,
      requestDocumentId
    )
  );

}


// =========================================================
// REFRESH SPONSORS
// =========================================================

async function refreshSponsors() {

  const list =
    document.querySelector(
      "#sponsorAdminList"
    );


  if (list) {

    list.innerHTML = `
      <p class="muted">
        Loading sponsors from Chill Planet cloud...
      </p>
    `;

  }


  await loadSponsorsFromFirestore();


  renderSponsors();


  populateSponsorImageSelector();


  renderDashboardStats();

}


// =========================================================
// MANUAL REFRESH BUTTON
// =========================================================

document
  .querySelector(
    "#refreshSponsors"
  )
  ?.addEventListener(
    "click",
    async event => {

      const button =
        event.currentTarget;


      const oldText =
        button.textContent;


      button.disabled =
        true;


      button.textContent =
        "Refreshing...";


      try {

        await refreshSponsors();

      }

      finally {

        button.disabled =
          false;


        button.textContent =
          oldText ||
          "Refresh";

      }

    }
  );


// =========================================================
// RELAX CONTENT
// =========================================================

function renderQuotes() {

  const list =
    document.querySelector(
      "#quoteAdminList"
    );


  if (!list) {
    return;
  }


  const quotes =
    getCustomQuotes();


  list.innerHTML =
    quotes.length
      ? quotes
          .map(
            (quote, index) => `
              <div class="admin-item">

                <h4>
                  ${safe(
                    quote.q
                  )}
                </h4>

                <p>
                  ${safe(
                    quote.r
                  )}
                </p>

                <button
                  class="btn btn-small btn-ghost"
                  type="button"
                  data-quotedel="${index}"
                >
                  Delete
                </button>

              </div>
            `
          )
          .join("")
      : `
          <p class="muted">
            No custom Relax content yet.
            Starter quotes are already available.
          </p>
        `;


  list
    .querySelectorAll(
      "[data-quotedel]"
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            const quotes =
              getCustomQuotes();


            const index =
              Number(
                button.dataset
                  .quotedel
              );


            quotes.splice(
              index,
              1
            );


            Store.set(
              "cp_custom_quotes",
              quotes
            );


            renderQuotes();

          };

      }
    );

}


// =========================================================
// ADD RELAX CONTENT
// =========================================================

document
  .querySelector(
    "#quoteForm"
  )
  ?.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const quote =
        document.querySelector(
          "#quoteInput"
        );


      const reflection =
        document.querySelector(
          "#reflectionInput"
        );


      if (
        !quote ||
        !reflection
      ) {

        return;

      }


      if (
        !quote.value.trim()
      ) {

        return;

      }


      const quotes =
        getCustomQuotes();


      quotes.push(
        {

          q:
            quote.value.trim(),

          r:
            reflection.value.trim(),

          createdAt:
            new Date()
              .toISOString()

        }
      );


      Store.set(
        "cp_custom_quotes",
        quotes
      );


      event.target.reset();


      renderQuotes();

    }
  );


// =========================================================
// EXPIRY HELPERS
// =========================================================

function isNotExpired(
  value
) {

  if (!value) {
    return true;
  }


  const date =
    timestampToDate(
      value
    );


  if (!date) {
    return true;
  }


  return (
    date.getTime() >
    Date.now()
  );

}


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

    return value.toDate();

  }


  if (
    typeof value.seconds ===
    "number"
  ) {

    return new Date(
      value.seconds *
      1000
    );

  }


  const date =
    new Date(
      value
    );


  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;

}


function timestampMilliseconds(
  value
) {

  return (
    timestampToDate(
      value
    )?.getTime() ||
    0
  );

}


function formatTimestamp(
  value
) {

  const date =
    timestampToDate(
      value
    );


  return date
    ? date.toLocaleString()
    : "";

}


// =========================================================
// HTML ESCAPE
// =========================================================

function safe(
  value
) {

  return String(
    value ?? ""
  ).replace(
    /[&<>"']/g,
    character => (
      {
        "&":
          "&amp;",

        "<":
          "&lt;",

        ">":
          "&gt;",

        '"':
          "&quot;",

        "'":
          "&#039;"
      }[character]
    )
  );

}


// =========================================================
// ADMIN INITIALIZATION
// =========================================================

async function initializeAdmin() {

  if (isLoginPage) {
    return;
  }


  const session =
    await protectAdminPage();


  if (!session) {
    return;
  }


  // Questions
  await refreshQuestions();


  // Sponsors
  await refreshSponsors();


  // Sponsor image preview
  setupSponsorImagePreview();


  // Relax content
  renderQuotes();


  // Dashboard
  renderDashboardStats();


  console.log(
    "Chill Planet Admin Control Center ready."
  );

}


// =========================================================
// START
// =========================================================

initializeAdmin();