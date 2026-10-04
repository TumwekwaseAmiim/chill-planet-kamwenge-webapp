import { Store } from "./storage.js";

import {
  getFirebase
} from "./firebase-core.js";


const form =
  document.querySelector(
    "#loginForm"
  );


form?.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const emailInput =
      document.querySelector(
        "#email"
      );


    const passwordInput =
      document.querySelector(
        "#password"
      );


    const message =
      document.querySelector(
        "#loginMessage"
      );


    const submitButton =
      form.querySelector(
        'button[type="submit"]'
      );


    const email =
      emailInput?.value.trim() || "";


    const password =
      passwordInput?.value || "";


    const originalButtonText =
      submitButton
        ?.textContent
        ?.trim() ||
      "Enter Dashboard";


    // =====================================================
    // VALIDATION
    // =====================================================

    if (
      !email ||
      !password
    ) {

      if (message) {

        message.textContent =
          "Please enter your email and password.";

        message.className =
          "feedback bad";

      }

      return;

    }


    // =====================================================
    // LOGIN STATE
    // =====================================================

    if (submitButton) {

      submitButton.disabled =
        true;

      submitButton.textContent =
        "Signing in...";

    }


    if (message) {

      message.textContent =
        "Connecting to Chill Planet...";

      message.className =
        "feedback";

    }


    // =====================================================
    // FIREBASE LOGIN
    // =====================================================

    try {

      const firebase =
        await getFirebase();


      if (
        !firebase.enabled ||
        !firebase.auth
      ) {

        throw new Error(
          "Firebase is not connected."
        );

      }


      const {
        signInWithEmailAndPassword
      } = await import(
        "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"
      );


      const credential =
        await signInWithEmailAndPassword(
          firebase.auth,
          email,
          password
        );


      const user =
        credential.user;


      // ===================================================
      // SAVE ADMIN SESSION
      // ===================================================

      Store.set(
        "cp_admin_session",
        {

          uid:
            user.uid,

          email:
            user.email,

          mode:
            "firebase",

          at:
            Date.now()

        }
      );


      if (message) {

        message.textContent =
          "Login successful. Opening dashboard...";

        message.className =
          "feedback good";

      }


      console.log(
        "Chill Planet admin signed in:",
        user.email
      );


      // ===================================================
      // REDIRECT
      // ===================================================

      setTimeout(
        () => {

          location.href =
            "dashboard.html";

        },
        500
      );

    }


    // =====================================================
    // LOGIN ERROR
    // =====================================================

    catch (error) {

      console.error(
        "Chill Planet admin login failed:",
        error
      );


      let userMessage =
        "Unable to sign in. Please check your email and password.";


      switch (
        error?.code
      ) {


        case "auth/invalid-credential":

        case "auth/wrong-password":

        case "auth/user-not-found":

          userMessage =
            "Incorrect email or password.";

          break;


        case "auth/invalid-email":

          userMessage =
            "Please enter a valid email address.";

          break;


        case "auth/too-many-requests":

          userMessage =
            "Too many failed attempts. Please wait and try again.";

          break;


        case "auth/network-request-failed":

          userMessage =
            "Network error. Check your internet connection and try again.";

          break;


        case "auth/user-disabled":

          userMessage =
            "This administrator account has been disabled.";

          break;


        case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":

          userMessage =
            "Firebase API key error. Check the Firebase configuration.";

          break;


        default:

          if (
            error?.message
          ) {

            userMessage =
              error.message;

          }

          break;

      }


      if (message) {

        message.textContent =
          userMessage;

        message.className =
          "feedback bad";

      }

    }


    // =====================================================
    // RESTORE BUTTON
    // =====================================================

    finally {

      if (submitButton) {

        submitButton.disabled =
          false;

        submitButton.textContent =
          originalButtonText;

      }

    }

  }
);