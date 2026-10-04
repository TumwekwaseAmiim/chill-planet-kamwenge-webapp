import { Store } from "./storage.js";


// =========================================================
// LOAD LAST GAME RESULT
// =========================================================

const result = Store.get(
  "cp_last_result",
  {
    score: 0,
    correct: 0,
    bestStreak: 0,
    questions: 0,
    mode: "mix"
  }
);


// =========================================================
// SAFE VALUES
// =========================================================

const score =
  Number(result.score) || 0;

const correct =
  Number(result.correct) || 0;

const bestStreak =
  Number(result.bestStreak) || 0;

const questions =
  Number(result.questions) || 0;


// =========================================================
// RESULT ELEMENTS
// =========================================================

const finalScore =
  document.querySelector(
    "#finalScore"
  );

const finalCorrect =
  document.querySelector(
    "#finalCorrect"
  );

const finalStreak =
  document.querySelector(
    "#finalStreak"
  );

const finalQuestions =
  document.querySelector(
    "#finalQuestions"
  );

const resultMode =
  document.querySelector(
    "#resultMode"
  );

const badgeTitle =
  document.querySelector(
    "#badgeTitle"
  );

const badgeText =
  document.querySelector(
    "#badgeText"
  );


// =========================================================
// DISPLAY GAME STATISTICS
// =========================================================

if (finalScore) {
  finalScore.textContent =
    score;
}

if (finalCorrect) {
  finalCorrect.textContent =
    correct;
}

if (finalStreak) {
  finalStreak.textContent =
    bestStreak;
}

if (finalQuestions) {
  finalQuestions.textContent =
    questions;
}


// =========================================================
// GAME MODE LABEL
// =========================================================

let modeLabel =
  "MIX EVERYTHING";


switch (result.mode) {

  case "kamwenge":

    modeLabel =
      "KAMWENGE";

    break;


  case "general":

    modeLabel =
      "GENERAL";

    break;


  case "mix":

  case "mixed":

  case "all":

    modeLabel =
      "MIX EVERYTHING";

    break;


  default:

    modeLabel =
      "MIX EVERYTHING";

}


if (resultMode) {

  resultMode.textContent =
    modeLabel;

}


// =========================================================
// ACHIEVEMENT BADGE
// =========================================================

let title =
  "Cosmic Starter";

let text =
  "Every great streak begins somewhere.";


// ---------------------------------------------------------
// SCORE LEVELS
// ---------------------------------------------------------

if (score >= 500) {

  title =
    "Chill Planet Master";

  text =
    "You have reached another level of the planet.";

}

else if (score >= 300) {

  title =
    "Cosmic Champion";

  text =
    "Your knowledge is travelling across the galaxy.";

}

else if (score >= 200) {

  title =
    "Planet Legend";

  text =
    "That score belongs in orbit.";

}

else if (score >= 150) {

  title =
    "Galaxy Runner";

  text =
    "You are moving through Chill Planet with serious energy.";

}

else if (score >= 100) {

  title =
    "Star Runner";

  text =
    "You are building serious momentum.";

}

else if (score >= 75) {

  title =
    "Orbit Climber";

  text =
    "You are getting closer to the stars.";

}

else if (score >= 50) {

  title =
    "Glow Getter";

  text =
    "Your streak is starting to shine.";

}

else if (score >= 25) {

  title =
    "Rising Star";

  text =
    "The journey has started. Keep going.";

}

else if (score >= 10) {

  title =
    "Planet Explorer";

  text =
    "You are beginning to explore Chill Planet.";

}


// =========================================================
// SPECIAL STREAK RECOGNITION
// =========================================================

if (
  bestStreak >= 20 &&
  score < 500
) {

  title =
    "Streak Master";

  text =
    `${bestStreak} correct answers in your best streak. Incredible focus.`;

}

else if (
  bestStreak >= 10 &&
  score < 200
) {

  title =
    "Hot Streak";

  text =
    `${bestStreak} in a row. You were on fire.`;

}


// =========================================================
// PERFECT RUN
// =========================================================

if (
  questions > 0 &&
  correct === questions
) {

  title =
    "Perfect Orbit";

  text =
    `Perfect run — ${correct} out of ${questions} correct.`;

}


// =========================================================
// DISPLAY BADGE
// =========================================================

if (badgeTitle) {

  badgeTitle.textContent =
    title;

}


if (badgeText) {

  badgeText.textContent =
    text;

}


// =========================================================
// SAVE ACHIEVEMENT INFORMATION
// Used later by achievement/share card
// =========================================================

Store.set(
  "cp_last_achievement",
  {
    title,
    text,
    score,
    correct,
    bestStreak,
    questions,
    mode:
      result.mode ||
      "mix"
  }
);


// =========================================================
// DEBUG
// =========================================================

console.log(
  "Chill Planet result:",
  {
    score,
    correct,
    bestStreak,
    questions,
    mode:
      result.mode,
    badge:
      title
  }
);