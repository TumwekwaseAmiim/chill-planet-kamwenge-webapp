import { Store } from "./storage.js";
import { getFirebase } from "./firebase-core.js";

import {
  KAMWENGE_AREAS,
  LOCAL_LEADER_FACTS
} from "../data/kamwenge-data.js";


// =========================================================
// FIRESTORE COLLECTION
// =========================================================

const QUESTIONS_COLLECTION = "questions";


// =========================================================
// GENERAL QUESTIONS
// =========================================================

export const GENERAL_QUESTIONS = [

  {
    category: "Uganda",
    text: "What is the capital city of Uganda?",
    correct: "Kampala",
    wrong: [
      "Mbarara",
      "Jinja",
      "Gulu"
    ]
  },

  {
    category: "Uganda",
    text: "Which currency is used in Uganda?",
    correct: "Uganda shilling",
    wrong: [
      "Uganda pound",
      "East African dollar",
      "Uganda franc"
    ]
  },

  {
    category: "Africa",
    text: "Which is the largest continent by land area?",
    correct: "Asia",
    wrong: [
      "Africa",
      "Europe",
      "South America"
    ]
  },

  {
    category: "Africa",
    text: "Which ocean lies east of Africa?",
    correct: "Indian Ocean",
    wrong: [
      "Atlantic Ocean",
      "Pacific Ocean",
      "Arctic Ocean"
    ]
  },

  {
    category: "World",
    text: "Which planet is known as the Red Planet?",
    correct: "Mars",
    wrong: [
      "Venus",
      "Jupiter",
      "Mercury"
    ]
  },

  {
    category: "World",
    text: "Which is the largest ocean on Earth?",
    correct: "Pacific Ocean",
    wrong: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean"
    ]
  },

  {
    category: "Science",
    text: "What gas do plants mainly absorb from the atmosphere?",
    correct: "Carbon dioxide",
    wrong: [
      "Oxygen",
      "Hydrogen",
      "Helium"
    ]
  },

  {
    category: "Science",
    text: "Which organ pumps blood around the human body?",
    correct: "Heart",
    wrong: [
      "Liver",
      "Kidney",
      "Lung"
    ]
  },

  {
    category: "Technology",
    text: "What does CPU stand for?",
    correct: "Central Processing Unit",
    wrong: [
      "Computer Personal Unit",
      "Central Program Utility",
      "Core Processing User"
    ]
  },

  {
    category: "Technology",
    text: "What does URL stand for?",
    correct: "Uniform Resource Locator",
    wrong: [
      "Universal Routing Link",
      "User Resource Login",
      "Unified Readable Location"
    ]
  },

  {
    category: "Mathematics",
    text: "What is 12 × 8?",
    correct: "96",
    wrong: [
      "88",
      "104",
      "108"
    ]
  },

  {
    category: "Fun",
    text: "How many days are in a leap year?",
    correct: "366",
    wrong: [
      "365",
      "364",
      "367"
    ]
  }

];


// =========================================================
// PREMIER LEAGUE BIG SIX
// =========================================================

export const BIG6_SPORTS = [

  {
    category: "Premier League Big Six",
    text: "Which Big Six club plays its home matches at Anfield?",
    correct: "Liverpool",
    wrong: [
      "Arsenal",
      "Chelsea",
      "Manchester United"
    ]
  },

  {
    category: "Premier League Big Six",
    text: "Which Big Six club plays at Old Trafford?",
    correct: "Manchester United",
    wrong: [
      "Manchester City",
      "Chelsea",
      "Tottenham Hotspur"
    ]
  },

  {
    category: "Premier League Big Six",
    text: "Which Big Six club plays at the Emirates Stadium?",
    correct: "Arsenal",
    wrong: [
      "Chelsea",
      "Liverpool",
      "Manchester City"
    ]
  },

  {
    category: "Premier League Big Six",
    text: "Which Big Six club plays at Stamford Bridge?",
    correct: "Chelsea",
    wrong: [
      "Arsenal",
      "Liverpool",
      "Tottenham Hotspur"
    ]
  },

  {
    category: "Premier League Big Six",
    text: "Which Big Six club plays at the Etihad Stadium?",
    correct: "Manchester City",
    wrong: [
      "Manchester United",
      "Arsenal",
      "Chelsea"
    ]
  },

  {
    category: "Premier League Big Six",
    text: "Which Big Six club plays at Tottenham Hotspur Stadium?",
    correct: "Tottenham Hotspur",
    wrong: [
      "Liverpool",
      "Chelsea",
      "Manchester City"
    ]
  },

  {
    category: "Premier League Big Six",
    text: "Which two Big Six clubs contest the North London derby?",
    correct: "Arsenal and Tottenham Hotspur",
    wrong: [
      "Chelsea and Liverpool",
      "Manchester City and Manchester United",
      "Arsenal and Chelsea"
    ]
  },

  {
    category: "Premier League Big Six",
    text: "Which two Big Six clubs contest the Manchester derby?",
    correct: "Manchester City and Manchester United",
    wrong: [
      "Liverpool and Everton",
      "Arsenal and Chelsea",
      "Chelsea and Tottenham Hotspur"
    ]
  },

  {
    category: "Premier League Big Six",
    text: "Which Big Six club is commonly nicknamed the Reds and is based at Anfield?",
    correct: "Liverpool",
    wrong: [
      "Chelsea",
      "Arsenal",
      "Tottenham Hotspur"
    ]
  },

  {
    category: "Premier League Big Six",
    text: "Which Big Six club is commonly known as the Gunners?",
    correct: "Arsenal",
    wrong: [
      "Chelsea",
      "Manchester City",
      "Liverpool"
    ]
  },

  {
    category: "Premier League Big Six",
    text: "Which Big Six club is commonly known as the Blues?",
    correct: "Chelsea",
    wrong: [
      "Liverpool",
      "Arsenal",
      "Manchester United"
    ]
  },

  {
    category: "Premier League Big Six",
    text: "Which Big Six club is commonly known as the Red Devils?",
    correct: "Manchester United",
    wrong: [
      "Liverpool",
      "Manchester City",
      "Tottenham Hotspur"
    ]
  }

];


// =========================================================
// GENERAL HELPERS
// =========================================================

export function shuffle(array) {

  return [...array].sort(
    () => Math.random() - 0.5
  );

}


function pickWrong(
  items,
  correct,
  count = 3
) {

  return shuffle(
    [
      ...new Set(
        items.filter(
          item =>
            item &&
            item !== correct
        )
      )
    ]
  ).slice(
    0,
    count
  );

}


// =========================================================
// KAMWENGE GENERATED QUESTION BANK
// =========================================================

function localQuestionBank() {

  const subcounties =
    KAMWENGE_AREAS.map(
      area =>
        area.subcounty
    );


  const parishes =
    KAMWENGE_AREAS.flatMap(
      area =>
        area.parishes.map(
          parish =>
            parish.name
        )
    );


  const bank = [
    ...LOCAL_LEADER_FACTS
  ];


  KAMWENGE_AREAS.forEach(
    subcounty => {

      subcounty.parishes.forEach(
        parish => {

          // -----------------------------------------
          // PARISH -> SUBCOUNTY
          // -----------------------------------------

          const wrongSub =
            pickWrong(
              subcounties,
              subcounty.subcounty
            );


          if (
            wrongSub.length === 3
          ) {

            bank.push(
              {
                category:
                  "Kamwenge · Parish & Sub-county",

                text:
                  `${parish.name} belongs to which sub-county or town council in Kibale East?`,

                correct:
                  subcounty.subcounty,

                wrong:
                  wrongSub
              }
            );

          }


          // -----------------------------------------
          // PLACE -> PARISH
          // -----------------------------------------

          const siblingParishes =
            subcounty.parishes.map(
              item =>
                item.name
            );


          const wrongParishes =
            pickWrong(
              parishes.filter(
                item =>
                  !siblingParishes.includes(
                    item
                  )
              ),

              parish.name
            );


          parish.places.forEach(
            place => {

              if (
                wrongParishes.length === 3
              ) {

                bank.push(
                  {
                    category:
                      "Kamwenge · Local Places",

                    text:
                      `${place} is listed under which parish or ward?`,

                    correct:
                      parish.name,

                    wrong:
                      wrongParishes
                  }
                );

              }

            }
          );

        }
      );


      // -----------------------------------------
      // AREA RECOGNITION
      // -----------------------------------------

      if (
        subcounty.parishes.length >= 2
      ) {

        const correct =
          subcounty.parishes[
            Math.floor(
              Math.random() *
              subcounty.parishes.length
            )
          ].name;


        const outsiders =
          parishes.filter(
            item =>
              !subcounty.parishes.some(
                parish =>
                  parish.name === item
              )
          );


        const wrong =
          pickWrong(
            outsiders,
            correct
          );


        if (
          wrong.length === 3
        ) {

          bank.push(
            {
              category:
                "Kamwenge · Areas",

              text:
                `Which of these is a parish or ward in ${subcounty.subcounty}?`,

              correct,

              wrong
            }
          );

        }

      }

    }
  );


  return bank;

}


// =========================================================
// LOCAL FIRESTORE CACHE
// =========================================================

function getCachedCustomQuestions() {

  return Store.get(
    "cp_custom_questions",
    []
  );

}


function saveCachedCustomQuestions(
  questions
) {

  Store.set(
    "cp_custom_questions",
    questions
  );

}


// =========================================================
// LOAD CUSTOM QUESTIONS FROM FIRESTORE
// =========================================================

export async function syncQuestionsFromFirestore() {

  try {

    const fb =
      await getFirebase();


    if (
      !fb.enabled ||
      !fb.db
    ) {

      console.warn(
        "Firestore unavailable. Using cached custom questions."
      );

      return getCachedCustomQuestions();

    }


    const {
      collection,
      getDocs,
      query
    } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
    );


    const snapshot =
      await getDocs(
        query(
          collection(
            fb.db,
            QUESTIONS_COLLECTION
          )
        )
      );


    const questions =
      snapshot.docs
        .map(
          document => {

            const data =
              document.data();


            return {
              id:
                document.id,

              world:
                data.world || "general",

              category:
                data.category || "General",

              text:
                data.text || "",

              correct:
                data.correct || "",

              wrong:
                Array.isArray(
                  data.wrong
                )
                  ? data.wrong
                  : [],

              active:
                data.active !== false,

              source:
                "firestore"
            };

          }
        )
        .filter(
          question =>
            question.active &&
            question.text &&
            question.correct &&
            question.wrong.length >= 3
        );


    saveCachedCustomQuestions(
      questions
    );


    console.log(
      `Loaded ${questions.length} custom Chill Planet questions from Firestore.`
    );


    return questions;

  }

  catch (error) {

    console.error(
      "Failed to load Firestore questions:",
      error
    );


    return getCachedCustomQuestions();

  }

}


// =========================================================
// ADD CUSTOM QUESTION TO FIRESTORE
// =========================================================

export async function addCustomQuestion(
  question
) {

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


  const {
    addDoc,
    collection,
    serverTimestamp
  } = await import(
    "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
  );


  const cleanQuestion = {

    world:
      question.world === "kamwenge"
        ? "kamwenge"
        : "general",

    category:
      String(
        question.category || "General"
      ).trim(),

    text:
      String(
        question.text || ""
      ).trim(),

    correct:
      String(
        question.correct || ""
      ).trim(),

    wrong:
      Array.isArray(
        question.wrong
      )
        ? question.wrong
            .map(
              item =>
                String(
                  item || ""
                ).trim()
            )
            .filter(Boolean)
            .slice(0, 3)
        : [],

    active:
      true,

    createdAt:
      serverTimestamp()

  };


  if (
    !cleanQuestion.text ||
    !cleanQuestion.correct ||
    cleanQuestion.wrong.length !== 3
  ) {

    throw new Error(
      "Question, correct answer and three wrong answers are required."
    );

  }


  const documentRef =
    await addDoc(
      collection(
        fb.db,
        QUESTIONS_COLLECTION
      ),

      cleanQuestion
    );


  await syncQuestionsFromFirestore();


  return documentRef.id;

}


// =========================================================
// DELETE CUSTOM QUESTION FROM FIRESTORE
// =========================================================

export async function deleteCustomQuestion(
  questionId
) {

  if (!questionId) {

    throw new Error(
      "Question ID is required."
    );

  }


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


  const {
    deleteDoc,
    doc
  } = await import(
    "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
  );


  await deleteDoc(
    doc(
      fb.db,
      QUESTIONS_COLLECTION,
      questionId
    )
  );


  await syncQuestionsFromFirestore();


  return true;

}


// =========================================================
// QUESTION BANK
// =========================================================

export function getQuestionBank(
  mode = "mix"
) {

  const custom =
    getCachedCustomQuestions();


  const local =
    localQuestionBank();


  const general = [
    ...GENERAL_QUESTIONS,
    ...BIG6_SPORTS
  ];


  if (
    mode === "kamwenge"
  ) {

    return [
      ...local,

      ...custom.filter(
        question =>
          question.world === "kamwenge"
      )
    ];

  }


  if (
    mode === "general"
  ) {

    return [
      ...general,

      ...custom.filter(
        question =>
          question.world !== "kamwenge"
      )
    ];

  }


  return [
    ...local,
    ...general,
    ...custom
  ];

}


// =========================================================
// MAKE RANDOM QUESTION
// =========================================================

export function makeQuestion(
  mode = "mix",
  previousText = ""
) {

  const bank =
    getQuestionBank(
      mode
    );


  if (!bank.length) {

    return null;

  }


  let pool =
    bank.filter(
      question =>
        question.text !== previousText
    );


  if (!pool.length) {

    pool =
      bank;

  }


  const question =
    pool[
      Math.floor(
        Math.random() *
        pool.length
      )
    ];


  return {
    ...question,

    options:
      shuffle(
        [
          question.correct,
          ...question.wrong
        ]
      )
  };

}


// =========================================================
// COUNTS
// =========================================================

export function counts() {

  const custom =
    getCachedCustomQuestions();


  const customKamwenge =
    custom.filter(
      question =>
        question.world === "kamwenge"
    ).length;


  const customGeneral =
    custom.filter(
      question =>
        question.world !== "kamwenge"
    ).length;


  return {

    kamwenge:
      localQuestionBank().length +
      customKamwenge,

    general:
      GENERAL_QUESTIONS.length +
      BIG6_SPORTS.length +
      customGeneral,

    sports:
      BIG6_SPORTS.length,

    custom:
      custom.length

  };

}