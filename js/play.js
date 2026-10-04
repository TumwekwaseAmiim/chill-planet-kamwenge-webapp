import {
  makeQuestion,
  counts,
  syncQuestionsFromFirestore
} from "./questions.js";

import { Store } from "./storage.js";

const els = {
  modeScreen: document.querySelector("#modeScreen"),
  quizScreen: document.querySelector("#quizScreen"),
  modeLabel: document.querySelector("#modeLabel"),
  changeMode: document.querySelector("#changeMode"),
  score: document.querySelector("#score"),
  streak: document.querySelector("#streak"),
  best: document.querySelector("#best"),
  category: document.querySelector("#category"),
  number: document.querySelector("#questionNumber"),
  progress: document.querySelector("#progressBar"),
  text: document.querySelector("#questionText"),
  answers: document.querySelector("#answers"),
  feedback: document.querySelector("#feedback"),
  next: document.querySelector("#nextBtn"),
  finish: document.querySelector("#finishBtn")
};

// Pull the newest custom questions from Firestore first.
// If Firestore is temporarily unavailable, questions.js falls back to its local cache.
await syncQuestionsFromFirestore();

const c = counts();

const localCount = document.querySelector("#localCount");
const generalCount = document.querySelector("#generalCount");

if (localCount) {
  localCount.textContent = `${c.kamwenge}+ local questions`;
}

if (generalCount) {
  generalCount.textContent = `${c.general}+ general questions · ${c.sports} Big Six`;
}

let mode = "mix";
let state = resetState();

if (els.best) {
  els.best.textContent = Store.get("cp_best_score", 0);
}

function resetState() {
  return {
    score: 0,
    streak: 0,
    bestStreak: 0,
    correct: 0,
    questions: 0,
    answered: false,
    current: null
  };
}

function selectMode(newMode) {
  mode = newMode;
  state = resetState();

  els.modeScreen?.classList.add("hidden");
  els.quizScreen?.classList.remove("hidden");

  if (els.modeLabel) {
    els.modeLabel.textContent =
      mode === "kamwenge"
        ? "KAMWENGE"
        : mode === "general"
          ? "GENERAL"
          : "MIX EVERYTHING";
  }

  if (els.score) els.score.textContent = "0";
  if (els.streak) els.streak.textContent = "0";

  renderQuestion();
}

document
  .querySelectorAll("[data-mode]")
  .forEach(button => {
    button.addEventListener("click", () => {
      selectMode(button.dataset.mode);
    });
  });

els.changeMode?.addEventListener("click", () => {
  els.quizScreen?.classList.add("hidden");
  els.modeScreen?.classList.remove("hidden");
});

function renderQuestion() {
  const previous = state.current?.text || "";
  state.current = makeQuestion(mode, previous);

  if (!state.current) {
    if (els.feedback) {
      els.feedback.textContent = "No questions are available right now.";
      els.feedback.className = "feedback bad";
    }
    return;
  }

  state.answered = false;
  state.questions += 1;

  if (els.category) els.category.textContent = state.current.category;
  if (els.number) els.number.textContent = String(state.questions);
  if (els.text) els.text.textContent = state.current.text;

  if (els.answers) els.answers.innerHTML = "";

  if (els.feedback) {
    els.feedback.textContent = "";
    els.feedback.className = "feedback";
  }

  if (els.next) els.next.disabled = true;

  if (els.progress) {
    els.progress.style.width = `${Math.min(
      100,
      (((state.questions - 1) % 10) + 1) * 10
    )}%`;
  }

  state.current.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = option;
    button.addEventListener("click", () => answer(option, button));
    els.answers?.appendChild(button);
  });
}

function answer(option, button) {
  if (state.answered || !state.current) return;

  state.answered = true;

  const buttons = [
    ...(els.answers?.querySelectorAll("button") || [])
  ];

  buttons.forEach(item => {
    item.disabled = true;

    if (item.textContent === state.current.correct) {
      item.classList.add("correct");
    }
  });

  if (option === state.current.correct) {
    state.correct += 1;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);

    const bonus = Math.min(5, state.streak);
    state.score += 10 + bonus;

    if (els.feedback) {
      els.feedback.textContent = `Correct! +${10 + bonus} points`;
      els.feedback.classList.add("good");
    }
  } else {
    state.streak = 0;
    button.classList.add("wrong");

    if (els.feedback) {
      els.feedback.textContent =
        `Not this time. The answer is ${state.current.correct}.`;
      els.feedback.classList.add("bad");
    }
  }

  if (els.score) els.score.textContent = String(state.score);
  if (els.streak) els.streak.textContent = String(state.streak);
  if (els.next) els.next.disabled = false;
}

function finish() {
  const result = {
    ...state,
    current: undefined,
    mode,
    finishedAt: new Date().toISOString()
  };

  Store.set("cp_last_result", result);
  Store.set(
    "cp_best_score",
    Math.max(Store.get("cp_best_score", 0), state.score)
  );
  Store.set(
    "cp_play_count",
    Store.get("cp_play_count", 0) + 1
  );

  location.href = "results.html";
}

els.next?.addEventListener("click", renderQuestion);
els.finish?.addEventListener("click", finish);

const requestedMode =
  new URLSearchParams(location.search).get("mode");

if (["kamwenge", "general", "mix"].includes(requestedMode)) {
  selectMode(requestedMode);
}
