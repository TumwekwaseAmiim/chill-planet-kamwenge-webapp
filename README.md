# CHILL PLANET — FINAL V1 PROJECT

**Play. Relax. Share.**

Chill Planet is a colorful entertainment and relaxation PWA with an endless one-question-at-a-time quiz, local Kamwenge knowledge, general knowledge, Premier League Big Six sports, challenge links, relaxation tools, share cards and a manual sponsor system.

## Final content structure

### 1. Kamwenge
The Kamwenge question engine uses only useful local relationships extracted from the supplied Kibale East data:

- sub-counties and town councils
- parishes and wards
- local schools, churches, markets, trading centres and community places
- Kibale East
- Hon. Frank Tumwebaze

The original voter-count fields (male, female, voter totals and polling totals) are **not stored in the Chill Planet gameplay dataset**.

Clean local dataset currently contains:
- 9 sub-counties/town councils
- 37 parishes/wards
- 124 local place records
- generated question combinations from those relationships

### 2. General
Starter categories:
- Uganda
- Africa
- World
- Science
- Technology
- Mathematics
- Fun

### 3. Premier League Big Six
Sports questions focus on:
- Arsenal
- Chelsea
- Liverpool
- Manchester City
- Manchester United
- Tottenham Hotspur

The starter bank uses mostly stable club facts such as stadiums, nicknames and rivalries. Current players/managers/results should be updated through Admin because they change over time.

### 4. Mix Everything
Combines Kamwenge + General + Big Six questions and shuffles them endlessly.

## Gameplay

- One question appears at a time.
- Four possible answers.
- Correct answer gives points.
- Consecutive correct answers build a streak bonus.
- User can keep playing without a fixed final question.
- User chooses when to finish.
- Result saves score, correct answers, best streak, question count and selected mode.

## Relax Zone

Includes:
- hopeful quotes
- reflections
- breathing animation
- generated soft ambience
- unlimited “Give Me Another”

## Sponsors

Launch price: **UGX 10,000 per week**

Launch offer: **first two sponsors receive one week free**

Payment number: **0786598658**

WhatsApp number: **0786598658**

Flow:
1. Sponsor applies.
2. Chill Planet creates a Sponsor ID.
3. Sponsor pays UGX 10,000.
4. Sponsor sends Sponsor ID + payment screenshot to WhatsApp 0786598658.
5. Admin manually verifies payment.
6. Admin activates advert for 7 days.

## Admin demo

URL:
`/admin/login.html`

Demo credentials:
- Email: `admin@chillplanet.local`
- Password: `ChangeMe123!`

Remove/change demo login before public deployment.

## Backend

The project runs immediately in local demo mode using browser localStorage.

Production direction:
- Firebase Authentication — admin/user login
- Firestore — questions, scores, challenges, sponsors, quotes, settings
- Cloudflare R2 — larger sponsor graphics/media later

`js/firebase-core.js` is ready for your Firebase config.

## Main files

```text
chill-planet/
├── index.html
├── play.html
├── challenge.html
├── relax.html
├── results.html
├── create-card.html
├── sponsors.html
├── data/
│   └── kamwenge-data.js
├── admin/
│   ├── login.html
│   ├── dashboard.html
│   ├── questions.html
│   ├── sponsors.html
│   └── content.html
├── css/
│   ├── style.css
│   └── animations.css
├── js/
│   ├── firebase-core.js
│   ├── settings.js
│   ├── storage.js
│   ├── questions.js
│   ├── play.js
│   ├── challenge.js
│   ├── relax.js
│   ├── results.js
│   ├── card-generator.js
│   ├── sponsors.js
│   ├── admin.js
│   ├── auth.js
│   ├── home.js
│   ├── share.js
│   └── pwa.js
├── assets/
├── manifest.json
├── service-worker.js
├── firestore.rules
└── README.md
```

## Run locally

Use VS Code Live Server, or from the project directory:

```bash
python -m http.server 5500
```

Then open:

`http://localhost:5500`

## Identity

**CHILL PLANET**  
Play. Relax. Share.

Built by **Eng. Amiim Tumwekwase**


## Final navigation and home

The public app now uses the same navigation on:
- Home
- Play
- Challenge
- Relax
- Results
- Create & Share
- Sponsors

Mobile navigation uses a collapsible menu.

The Home page provides direct access to:
- Kamwenge
- General
- Mix Everything

The Admin Dashboard shows dynamic counts for:
- Kamwenge Questions
- General Questions
- Big Six Sports
- Total Questions
- Sponsor Requests
- Active Sponsors
- Local Plays


## Development cache note

The service worker uses network-first loading for HTML, JavaScript and CSS so fresh development changes are preferred. Firebase and CDN requests are never intercepted by the service worker.
