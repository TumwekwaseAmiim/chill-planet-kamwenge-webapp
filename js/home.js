import { getFirebase } from "./firebase-core.js";

async function loadHomeSponsor() {
  const sponsorName = document.querySelector("#sponsorName");
  const sponsorText = document.querySelector("#sponsorText");

  if (!sponsorName || !sponsorText) return;

  try {
    const fb = await getFirebase();

    if (!fb.enabled || !fb.db) return;

    const {
      collection,
      getDocs,
      query,
      where
    } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
    );

    const snapshot = await getDocs(
      query(
        collection(fb.db, "sponsors"),
        where("status", "==", "active")
      )
    );

    const active = snapshot.docs
      .map(document => ({
        id: document.id,
        ...document.data()
      }))
      .filter(sponsor => !isExpired(sponsor.expiresAt));

    if (!active.length) return;

    const sponsor =
      active[Math.floor(Math.random() * active.length)];

    sponsorName.textContent = sponsor.business || "Chill Planet Sponsor";
    sponsorText.textContent = sponsor.message || "Sponsored on Chill Planet";
  } catch (error) {
    console.warn("Home sponsor could not be loaded:", error);
  }
}

function isExpired(value) {
  if (!value) return false;

  let date = null;

  if (typeof value.toDate === "function") {
    date = value.toDate();
  } else if (typeof value.seconds === "number") {
    date = new Date(value.seconds * 1000);
  } else {
    date = new Date(value);
  }

  return Number.isNaN(date.getTime())
    ? false
    : date.getTime() <= Date.now();
}

loadHomeSponsor();

let ctx;
let osc;
let gain;
let playing = false;

const soundToggle = document.querySelector("#soundToggle");

soundToggle?.addEventListener("click", () => {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    osc = ctx.createOscillator();
    gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 82;
    gain.gain.value = 0.015;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    playing = true;
  } else {
    playing = !playing;
    gain.gain.value = playing ? 0.015 : 0;
  }

  soundToggle.textContent = playing ? "♫" : "♩";
});
