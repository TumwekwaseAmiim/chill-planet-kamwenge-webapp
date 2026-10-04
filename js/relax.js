import { Store } from "./storage.js";


// =========================================================
// CHILL PLANET
// LARGE BUILT-IN RELAX CONTENT LIBRARY
// =========================================================

const seed = [

  // =======================================================
  // HOPE
  // =======================================================

  {
    q: "You do not need to solve your whole life today.",
    r: "Do the next kind and useful thing you can manage."
  },

  {
    q: "A difficult hour is not the same thing as a difficult life.",
    r: "Give this moment permission to pass."
  },

  {
    q: "Better moments can still be ahead.",
    r: "You do not need to see the whole road to continue walking."
  },

  {
    q: "A slow season is still a season of your life.",
    r: "Not every chapter has to move quickly to matter."
  },

  {
    q: "Tomorrow does not have to look like today.",
    r: "Life can change through small decisions, new opportunities and time."
  },

  {
    q: "You can begin again from where you are.",
    r: "A new beginning does not require a perfect starting point."
  },

  {
    q: "There is still more life beyond this moment.",
    r: "Do not judge your entire journey by one difficult part."
  },

  {
    q: "Some good things take longer than expected.",
    r: "Delay does not always mean that nothing is happening."
  },

  {
    q: "You have not seen every good day that will come.",
    r: "Leave some room in your mind for possibilities you cannot see yet."
  },

  {
    q: "Hope can be quiet.",
    r: "Sometimes hope is simply choosing to continue."
  },


  // =======================================================
  // REST
  // =======================================================

  {
    q: "Rest is part of progress.",
    r: "A calmer mind can see choices that stress hides."
  },

  {
    q: "You are allowed to slow down.",
    r: "Moving slowly for a while does not mean you have stopped moving."
  },

  {
    q: "You do not have to earn every moment of rest.",
    r: "Rest can simply be part of taking care of yourself."
  },

  {
    q: "A pause is not the end of the journey.",
    r: "Sometimes stopping briefly helps you continue better."
  },

  {
    q: "Leave something for tomorrow.",
    r: "Not everything needs to be completed tonight."
  },

  {
    q: "Your mind deserves quiet moments too.",
    r: "Step away from unnecessary noise for a little while."
  },

  {
    q: "You can rest without abandoning your goals.",
    r: "Recovery and ambition can exist together."
  },

  {
    q: "You are allowed to have an ordinary day.",
    r: "Every day does not need to be productive, exciting or impressive."
  },

  {
    q: "Sometimes doing less is the wiser choice.",
    r: "Protecting your energy can help you handle what matters most."
  },

  {
    q: "A peaceful moment is not wasted time.",
    r: "Quiet can restore what constant activity drains."
  },


  // =======================================================
  // PROGRESS
  // =======================================================

  {
    q: "Your pace does not cancel your progress.",
    r: "Small steps still count."
  },

  {
    q: "Progress is not always dramatic.",
    r: "Sometimes progress looks like understanding something a little better than yesterday."
  },

  {
    q: "One step is still movement.",
    r: "You do not need a giant breakthrough every day."
  },

  {
    q: "Small improvements can become big changes.",
    r: "Consistency often matters more than intensity."
  },

  {
    q: "You are allowed to learn slowly.",
    r: "Understanding takes different amounts of time for different people."
  },

  {
    q: "You do not have to rush your growth.",
    r: "Strong foundations often take time."
  },

  {
    q: "Keep building what you can.",
    r: "A little progress repeated many times becomes something meaningful."
  },

  {
    q: "Not every achievement needs an audience.",
    r: "Quiet progress is still real progress."
  },

  {
    q: "You may be further than you think.",
    r: "Look back occasionally and notice what you can do now that once felt difficult."
  },

  {
    q: "Improvement does not require perfection.",
    r: "Being a little better is enough to keep moving."
  },


  // =======================================================
  // STARTING AGAIN
  // =======================================================

  {
    q: "Start again as many times as you need.",
    r: "Beginning again is still movement."
  },

  {
    q: "A mistake does not remove your next opportunity.",
    r: "Learn what you can and continue."
  },

  {
    q: "You can change direction.",
    r: "Realizing something is not working is useful information."
  },

  {
    q: "Starting over does not erase what you learned.",
    r: "You carry experience into every new attempt."
  },

  {
    q: "One failed attempt is not a final answer.",
    r: "Adjust the approach and try again when you are ready."
  },

  {
    q: "You are allowed to rewrite the plan.",
    r: "Plans are tools, not prisons."
  },

  {
    q: "There is courage in trying again.",
    r: "A second attempt can begin with more wisdom than the first."
  },

  {
    q: "You can rebuild slowly.",
    r: "Strong things do not always have to be rebuilt quickly."
  },

  {
    q: "Begin with what remains.",
    r: "You do not need everything you once had to make another start."
  },

  {
    q: "A new path can still lead somewhere meaningful.",
    r: "Different does not automatically mean worse."
  },


  // =======================================================
  // STRESS
  // =======================================================

  {
    q: "You do not have to carry every problem at once.",
    r: "Choose one thing to handle first."
  },

  {
    q: "Not every thought needs an immediate answer.",
    r: "Some thoughts can simply pass without becoming decisions."
  },

  {
    q: "Give your mind one task instead of ten.",
    r: "Reducing the number of things you focus on can make the next step clearer."
  },

  {
    q: "You can deal with this one piece at a time.",
    r: "Breaking a large problem into smaller parts can make it less overwhelming."
  },

  {
    q: "You are not required to respond to everything immediately.",
    r: "A thoughtful response can be better than a rushed one."
  },

  {
    q: "Step away from the noise for a moment.",
    r: "A little distance can make a situation easier to understand."
  },

  {
    q: "What feels urgent is not always important.",
    r: "Take a moment to decide what genuinely needs your attention."
  },

  {
    q: "You can simplify today.",
    r: "Choose the few things that truly matter and let the rest wait."
  },

  {
    q: "Take this moment one breath at a time.",
    r: "You only need to handle the moment you are currently in."
  },

  {
    q: "The mind becomes tired too.",
    r: "Give yourself a short break before forcing another decision."
  },


  // =======================================================
  // CONFIDENCE
  // =======================================================

  {
    q: "You can learn what you do not know.",
    r: "Not knowing something today does not mean you cannot understand it tomorrow."
  },

  {
    q: "You do not need everyone's approval to move forward.",
    r: "Good decisions can still be unpopular decisions."
  },

  {
    q: "Your voice deserves space.",
    r: "Speak clearly without believing you must be louder than everyone else."
  },

  {
    q: "You have handled unfamiliar things before.",
    r: "Remember that many things you know today were once new to you."
  },

  {
    q: "Confidence can grow through action.",
    r: "You do not always have to feel ready before beginning."
  },

  {
    q: "Your abilities can improve.",
    r: "Skill is something you can build through practice."
  },

  {
    q: "You do not need to compare every step.",
    r: "Someone else's progress does not reduce the value of yours."
  },

  {
    q: "You are allowed to take yourself seriously.",
    r: "Your ideas and goals deserve thoughtful effort."
  },

  {
    q: "You can be uncertain and still move forward.",
    r: "Confidence does not require knowing every answer."
  },

  {
    q: "Give yourself credit for what you have learned.",
    r: "Growth becomes easier to notice when you remember where you started."
  },


  // =======================================================
  // PATIENCE
  // =======================================================

  {
    q: "Some answers arrive after the noise becomes quiet.",
    r: "You can give yourself space before deciding."
  },

  {
    q: "Not everything needs to happen immediately.",
    r: "Some things become clearer with time."
  },

  {
    q: "Let the process have its time.",
    r: "Rushing does not always bring the result closer."
  },

  {
    q: "You can wait without giving up.",
    r: "Patience and persistence can exist together."
  },

  {
    q: "A delay can still contain useful lessons.",
    r: "Use waiting periods to prepare for what comes next."
  },

  {
    q: "You do not have to force every outcome.",
    r: "Do your part and allow some things to unfold naturally."
  },

  {
    q: "Slow progress can still build strong results.",
    r: "What matters is that the direction remains meaningful."
  },

  {
    q: "Time can reveal what pressure hides.",
    r: "Give important decisions enough room to become clearer."
  },

  {
    q: "Patience is not doing nothing.",
    r: "Sometimes patience means continuing your work without demanding immediate results."
  },

  {
    q: "Let today be one part of the process.",
    r: "You do not need the final result before appreciating today's effort."
  },


  // =======================================================
  // GRATITUDE
  // =======================================================

  {
    q: "Today can be unfinished and still be meaningful.",
    r: "Notice one thing that went right."
  },

  {
    q: "You are allowed to enjoy a small good moment.",
    r: "Let one peaceful minute be enough for now."
  },

  {
    q: "Small good things still matter.",
    r: "A kind message, a meal, a laugh or a quiet moment can still add something valuable to your day."
  },

  {
    q: "Notice something that made today lighter.",
    r: "Gratitude does not require pretending everything is perfect."
  },

  {
    q: "There may be something ordinary worth appreciating.",
    r: "Sometimes the familiar things become valuable when we finally notice them."
  },

  {
    q: "A peaceful minute deserves to be noticed.",
    r: "Do not rush past every calm moment."
  },

  {
    q: "Appreciate what is working while you improve what is not.",
    r: "Gratitude and ambition can exist together."
  },

  {
    q: "One kind person can change the feeling of a day.",
    r: "Remember the people who have made things a little easier."
  },

  {
    q: "There is value in simple things.",
    r: "Not every meaningful moment needs to be extraordinary."
  },

  {
    q: "Pause long enough to notice what is okay.",
    r: "Difficulties can be real while good things are also present."
  },


  // =======================================================
  // OVERTHINKING
  // =======================================================

  {
    q: "You do not have to answer every possibility in your head.",
    r: "Focus on what is actually happening now."
  },

  {
    q: "A thought is not automatically a fact.",
    r: "Give yourself room to question assumptions before believing them."
  },

  {
    q: "You can stop rehearsing conversations that have not happened.",
    r: "Return your attention to what you can actually influence."
  },

  {
    q: "Not every future problem needs to be solved today.",
    r: "Prepare where useful, then return to the present."
  },

  {
    q: "Clarity sometimes comes after you stop forcing it.",
    r: "Give your mind time to settle."
  },

  {
    q: "You do not need a perfect answer before taking a reasonable step.",
    r: "Good decisions can be adjusted as new information appears."
  },

  {
    q: "Let uncertainty exist without filling it with fear.",
    r: "Something being unknown does not mean it will go badly."
  },

  {
    q: "Your mind can take a break from predicting everything.",
    r: "You are allowed to experience the present instead."
  },

  {
    q: "Not every silence has a hidden meaning.",
    r: "Avoid creating explanations when you do not yet have information."
  },

  {
    q: "Give yourself fewer questions for a moment.",
    r: "Sometimes peace begins when you stop demanding immediate answers."
  },


  // =======================================================
  // WORK & STUDY
  // =======================================================

  {
    q: "You do not need to finish everything in one sitting.",
    r: "Choose a useful stopping point and return later with more energy."
  },

  {
    q: "One focused hour can matter more than many distracted hours.",
    r: "Give one task your attention before moving to the next."
  },

  {
    q: "Learning takes repetition.",
    r: "Needing to review something again does not mean you are failing."
  },

  {
    q: "Take the difficult task one section at a time.",
    r: "Large projects become manageable when divided into smaller actions."
  },

  {
    q: "Your work does not need to be perfect to be useful.",
    r: "Complete a strong version first, then improve it."
  },

  {
    q: "A break can improve the work.",
    r: "Returning with a clearer mind can save more time than forcing yourself through exhaustion."
  },

  {
    q: "Focus on the next useful action.",
    r: "You do not need to think about every remaining task at once."
  },

  {
    q: "You can learn difficult things.",
    r: "Complex ideas become easier when you stay with them long enough."
  },

  {
    q: "Some days are for progress, others are for preparation.",
    r: "Both can contribute to your larger goal."
  },

  {
    q: "Finish what matters before worrying about what looks impressive.",
    r: "Useful work often matters more than visible busyness."
  },


  // =======================================================
  // FAILURE & SETBACKS
  // =======================================================

  {
    q: "A setback can teach you where the plan needs improvement.",
    r: "Use the information instead of turning it into a judgment about yourself."
  },

  {
    q: "Failure can be feedback.",
    r: "Ask what happened, what can change and what your next attempt should look like."
  },

  {
    q: "One rejection does not decide every future opportunity.",
    r: "Continue looking for doors that fit your abilities and direction."
  },

  {
    q: "You can be disappointed without giving up.",
    r: "Allow the disappointment, then decide what comes next."
  },

  {
    q: "Something not working does not mean nothing will work.",
    r: "Sometimes the solution is a different approach."
  },

  {
    q: "You are allowed to learn from a bad decision.",
    r: "Wisdom often grows from decisions we would make differently now."
  },

  {
    q: "Do not turn one mistake into a permanent identity.",
    r: "You are still capable of choosing differently next time."
  },

  {
    q: "The result matters, but so does what you learn from it.",
    r: "Experience can become useful even when the outcome was not what you wanted."
  },

  {
    q: "You can recover from an imperfect day.",
    r: "Tomorrow does not require today's mistakes to continue."
  },

  {
    q: "Try again with more information.",
    r: "The next attempt does not have to repeat the previous one."
  },


  // =======================================================
  // PEACE
  // =======================================================

  {
    q: "You do not need to participate in every argument.",
    r: "Protecting your peace can sometimes mean choosing not to respond."
  },

  {
    q: "Quiet does not always need to be filled.",
    r: "Allow yourself a moment without noise."
  },

  {
    q: "You can choose calm even when everything around you is busy.",
    r: "Bring your attention back to your breathing and your immediate surroundings."
  },

  {
    q: "Not every problem belongs to you.",
    r: "Be careful not to carry responsibilities that are not yours."
  },

  {
    q: "Peace can begin with one boundary.",
    r: "You are allowed to protect your time and attention."
  },

  {
    q: "You can step away before responding.",
    r: "A calmer response can protect both your peace and your relationships."
  },

  {
    q: "Some things become smaller when you stop feeding them attention.",
    r: "Choose carefully what deserves your mental energy."
  },

  {
    q: "You can let today become quiet.",
    r: "The world can continue while you rest for a while."
  },

  {
    q: "There is no prize for carrying unnecessary tension.",
    r: "Release what you can."
  },

  {
    q: "A calm mind does not mean a problem-free life.",
    r: "It means creating moments where problems do not control all of your attention."
  },


  // =======================================================
  // COURAGE
  // =======================================================

  {
    q: "You can do something important while still feeling nervous.",
    r: "Courage often appears before confidence."
  },

  {
    q: "Being afraid does not automatically mean stop.",
    r: "Sometimes fear simply means something matters to you."
  },

  {
    q: "Take the next brave step, not every step at once.",
    r: "Courage becomes easier when the task is smaller."
  },

  {
    q: "You can ask the question.",
    r: "You may discover that the answer is better than the fear of asking."
  },

  {
    q: "You can try before you feel fully ready.",
    r: "Readiness often grows after we begin."
  },

  {
    q: "Your future may require a version of you that is still developing.",
    r: "Allow yourself to grow into the opportunities you want."
  },

  {
    q: "You can walk into unfamiliar spaces.",
    r: "Every familiar place was unfamiliar once."
  },

  {
    q: "One courageous conversation can change a situation.",
    r: "Speak respectfully and clearly when something important needs to be said."
  },

  {
    q: "You do not need to know everything before beginning.",
    r: "Learn the next part when you reach it."
  },

  {
    q: "Give yourself permission to try.",
    r: "An attempt can teach you things that thinking alone cannot."
  },


  // =======================================================
  // DAILY LIFE
  // =======================================================

  {
    q: "Today does not need to be extraordinary.",
    r: "A normal day can still be a good day."
  },

  {
    q: "Do one useful thing, then another.",
    r: "Simple actions can create momentum."
  },

  {
    q: "You are allowed to change today's plan.",
    r: "Adjusting to reality is often wiser than forcing the original schedule."
  },

  {
    q: "Leave some space in your day.",
    r: "Not every minute needs to be occupied."
  },

  {
    q: "You can enjoy something without turning it into productivity.",
    r: "Some moments can simply be enjoyable."
  },

  {
    q: "A good day can contain difficult moments.",
    r: "One frustrating event does not need to take ownership of the entire day."
  },

  {
    q: "Do not rush past everything.",
    r: "Notice where you are while you are getting where you want to go."
  },

  {
    q: "Your day can improve from this point.",
    r: "A difficult morning does not decide the evening."
  },

  {
    q: "Choose what deserves today's energy.",
    r: "You cannot give maximum attention to everything at the same time."
  },

  {
    q: "End the day without demanding perfection from it.",
    r: "Take the lessons and leave the rest."
  }

];


// =========================================================
// GET ALL RELAX CONTENT
// =========================================================

function allQuotes() {

  const custom =
    Store.get(
      "cp_custom_quotes",
      []
    );

  return [
    ...seed,
    ...custom
  ];

}


// =========================================================
// RANDOM MESSAGE SYSTEM
// =========================================================

let remainingQuotes = [];
let lastQuoteText = "";


function refillQuotes() {

  remainingQuotes =
    [...allQuotes()]
      .sort(
        () =>
          Math.random() - 0.5
      );

}


function getNextQuote() {

  if (!remainingQuotes.length) {
    refillQuotes();
  }


  if (
    remainingQuotes.length > 1 &&
    remainingQuotes[
      remainingQuotes.length - 1
    ]?.q === lastQuoteText
  ) {

    const swapIndex =
      Math.floor(
        Math.random() *
        (
          remainingQuotes.length -
          1
        )
      );


    const temp =
      remainingQuotes[
        remainingQuotes.length - 1
      ];


    remainingQuotes[
      remainingQuotes.length - 1
    ] =
      remainingQuotes[
        swapIndex
      ];


    remainingQuotes[
      swapIndex
    ] =
      temp;

  }


  const quote =
    remainingQuotes.pop();


  lastQuoteText =
    quote?.q || "";


  return quote;

}


// =========================================================
// SHOW QUOTE
// =========================================================

function showQuote() {

  const quoteText =
    document.querySelector(
      "#quoteText"
    );


  const reflectionText =
    document.querySelector(
      "#reflectionText"
    );


  if (
    !quoteText ||
    !reflectionText
  ) {
    return;
  }


  const message =
    getNextQuote();


  if (!message) {

    quoteText.textContent =
      "Take a quiet moment.";

    reflectionText.textContent =
      "Give yourself a little space before continuing.";

    return;

  }


  quoteText.textContent =
    message.q;


  reflectionText.textContent =
    message.r || "";

}


// =========================================================
// ANOTHER MESSAGE
// =========================================================

document
  .querySelector(
    "#anotherQuote"
  )
  ?.addEventListener(
    "click",
    showQuote
  );


// =========================================================
// BREATHING
// =========================================================

let breathing = true;


const breathingButton =
  document.querySelector(
    "#breathingToggle"
  );


const breathingOrb =
  document.querySelector(
    "#breathingOrb"
  );


const breathingText =
  document.querySelector(
    "#breathingText"
  );


breathingButton
  ?.addEventListener(
    "click",
    () => {

      breathing =
        !breathing;


      breathingOrb
        ?.classList.toggle(
          "paused",
          !breathing
        );


      breathingButton.textContent =
        breathing
          ? "Pause Breathing"
          : "Resume Breathing";

    }
  );


// =========================================================
// BREATHING PHASES
// =========================================================

const phases = [

  [
    "Breathe In",
    4000
  ],

  [
    "Hold",
    2000
  ],

  [
    "Breathe Out",
    6000
  ]

];


let phaseIndex = 0;


function breathingCycle() {

  const current =
    phases[
      phaseIndex
    ];


  if (
    breathing &&
    breathingText
  ) {

    breathingText.textContent =
      current[0];

  }


  const delay =
    current[1];


  phaseIndex =
    (
      phaseIndex + 1
    ) %
    phases.length;


  setTimeout(
    breathingCycle,
    delay
  );

}


breathingCycle();


// =========================================================
// REAL CHILL PLANET AMBIENT AUDIO + BACKGROUNDS
// =========================================================

let ambientAudio = null;
let currentSound = null;


// =========================================================
// RELAX WORLDS
// =========================================================

const relaxWorlds = {

  rain: {
    name: "Rain",
    icon: "☂",
    audio: "assets/audio/rain.mp3",
    image: "assets/images/relax/rain.jpg"
  },

  waves: {
    name: "Waves",
    icon: "≈",
    audio: "assets/audio/waves.mp3",
    image: "assets/images/relax/waves.jpg"
  },

  space: {
    name: "Space",
    icon: "✦",
    audio: "assets/audio/space.mp3",
    image: "assets/images/relax/space.jpg"
  },

  forest: {
    name: "Forest",
    icon: "♧",
    audio: "assets/audio/forest.mp3",
    image: "assets/images/relax/forest.jpg"
  },

  lofi: {
    name: "Lo-fi Chill",
    icon: "♫",
    audio: "assets/audio/lofi-chill.mp3",
    image: "assets/images/relax/lofi-chill.jpg"
  }

};


// =========================================================
// ELEMENTS
// =========================================================

const currentSoundText =
  document.querySelector(
    "#currentSoundText"
  );


const currentSoundIcon =
  document.querySelector(
    "#currentSoundIcon"
  );


const ambientToggle =
  document.querySelector(
    "#ambientToggle"
  );


// =========================================================
// STOP AUDIO
// =========================================================

function stopAmbientSound() {

  if (ambientAudio) {

    ambientAudio.pause();

    ambientAudio.currentTime = 0;

    ambientAudio.removeAttribute(
      "src"
    );

    ambientAudio.load();

    ambientAudio = null;

  }


  currentSound = null;

}


// =========================================================
// BACKGROUND IMAGE
// =========================================================

function setRelaxBackground(
  imagePath
) {

  if (!imagePath) {

    document.body.style
      .removeProperty(
        "background-image"
      );

    document.body.style
      .removeProperty(
        "background-size"
      );

    document.body.style
      .removeProperty(
        "background-position"
      );

    document.body.style
      .removeProperty(
        "background-repeat"
      );

    document.body.style
      .removeProperty(
        "background-attachment"
      );

    return;

  }


  document.body.style.setProperty(
    "background-image",
    `
      linear-gradient(
        rgba(7,11,26,.48),
        rgba(7,11,26,.72)
      ),
      url("${imagePath}")
    `,
    "important"
  );


  document.body.style.setProperty(
    "background-size",
    "cover",
    "important"
  );


  document.body.style.setProperty(
    "background-position",
    "center",
    "important"
  );


  document.body.style.setProperty(
    "background-repeat",
    "no-repeat",
    "important"
  );


  document.body.style.setProperty(
    "background-attachment",
    "fixed",
    "important"
  );


  console.log(
    "Relax background:",
    imagePath
  );

}


// =========================================================
// UPDATE SOUND DISPLAY
// =========================================================

function updateSoundDisplay(
  type
) {

  if (type === "off") {

    if (currentSoundText) {
      currentSoundText.textContent =
        "Silence";
    }


    if (currentSoundIcon) {
      currentSoundIcon.textContent =
        "■";
    }


    return;

  }


  const world =
    relaxWorlds[type];


  if (!world) {
    return;
  }


  if (currentSoundText) {

    currentSoundText.textContent =
      `Playing ${world.name}`;

  }


  if (currentSoundIcon) {

    currentSoundIcon.textContent =
      world.icon;

  }

}


// =========================================================
// PLAY REAL MP3
// =========================================================

async function playAmbientSound(
  type
) {

  if (type === "off") {

    stopAmbientSound();

    setRelaxBackground(
      null
    );

    updateSoundDisplay(
      "off"
    );


    document
      .querySelectorAll(
        ".sound-btn"
      )
      .forEach(
        button => {

          button
            .classList
            .remove(
              "active"
            );

        }
      );


    if (ambientToggle) {

      ambientToggle.textContent =
        "♫ Play Space Ambience";

    }


    return;

  }


  const world =
    relaxWorlds[type];


  if (!world) {

    console.error(
      "Unknown Chill Planet sound:",
      type
    );

    return;

  }


  stopAmbientSound();


  setRelaxBackground(
    world.image
  );


  updateSoundDisplay(
    type
  );


  ambientAudio =
    new Audio(
      world.audio
    );


  ambientAudio.loop =
    true;


  ambientAudio.volume =
    0.55;


  ambientAudio.preload =
    "auto";


  ambientAudio.addEventListener(
    "loadeddata",
    () => {

      console.log(
        "Chill Planet audio loaded:",
        world.audio
      );

    }
  );


  ambientAudio.addEventListener(
    "playing",
    () => {

      console.log(
        "Chill Planet playing:",
        world.name
      );

    }
  );


  ambientAudio.addEventListener(
    "error",
    () => {

      console.error(
        "AUDIO FILE NOT FOUND OR CANNOT PLAY:",
        world.audio,
        ambientAudio?.error
      );


      if (currentSoundText) {

        currentSoundText.textContent =
          `${world.name} audio could not load`;

      }

    }
  );


  try {

    await ambientAudio.play();


    currentSound =
      type;


    if (ambientToggle) {

      ambientToggle.textContent =
        type === "space"
          ? "■ Stop Space Ambience"
          : "♫ Play Space Ambience";

    }

  }

  catch (error) {

    console.error(
      "Browser prevented audio playback:",
      error
    );


    if (currentSoundText) {

      currentSoundText.textContent =
        "Tap the sound again to play";

    }

  }

}


// =========================================================
// SOUND BUTTONS
// =========================================================

document
  .querySelectorAll(
    ".sound-btn"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        async () => {

          const type =
            button.dataset.sound;


          document
            .querySelectorAll(
              ".sound-btn"
            )
            .forEach(
              otherButton => {

                otherButton
                  .classList
                  .remove(
                    "active"
                  );

              }
            );


          if (
            type !== "off"
          ) {

            button
              .classList
              .add(
                "active"
              );

          }


          await playAmbientSound(
            type
          );

        }
      );

    }
  );


// =========================================================
// TOP SPACE AMBIENCE BUTTON
// =========================================================

ambientToggle
  ?.addEventListener(
    "click",
    async () => {

      if (
        currentSound ===
        "space"
      ) {

        await playAmbientSound(
          "off"
        );

        return;

      }


      document
        .querySelectorAll(
          ".sound-btn"
        )
        .forEach(
          button => {

            button.classList.toggle(
              "active",
              button.dataset.sound ===
                "space"
            );

          }
        );


      await playAmbientSound(
        "space"
      );

    }
  );


// =========================================================
// INITIAL RELAX MESSAGE
// =========================================================

refillQuotes();

showQuote();