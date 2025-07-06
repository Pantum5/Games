// =========== ДАННЫЕ ВОПРОСОВ ===============
const questionsDB = [
  // На каждый язык будет 30 вопросов, тут примеры по 2 на каждый язык
  {
    hy: { q: "Ի՞նչն է Հայաստանի մայրաքաղաքը", options: ["Երևան", "Գյումրի", "Վանաձոր", "Սևան"], answer: "Երևան" },
    ru: { q: "Столица Армении?", options: ["Ереван", "Гюмри", "Ванадзор", "Севан"], answer: "Ереван" },
    en: { q: "What is the capital of Armenia?", options: ["Gyumri", "Yerevan", "Vanadzor", "Sevan"], answer: "Yerevan" },
  },
  {
    hy: { q: "Ի՞նչն է Ֆրանսիայի մայրաքաղաքը", options: ["Մարսել", "Բորդո", "Փարիզ", "Լիոն"], answer: "Փարիզ" },
    ru: { q: "Столица Франции?", options: ["Марсель", "Париж", "Лион", "Ницца"], answer: "Париж" },
    en: { q: "What is the capital of France?", options: ["Marseille", "Paris", "Lyon", "Nice"], answer: "Paris" },
  },
  // Добавь сюда остальные вопросы (итого 30)
];

// ========== Локализация интерфейса ===========
const uiText = {
  hy: {
    start: "Սկսել խաղը",
    placeholder: "Գրեք Ձեր անունը",
    unknown: "Անհայտ",
    tryAgain: "Փորձել նորից",
    win: "Հաղթանակ!",
    lose: "Պարտություն",
    correct: "Ճիշտ է",
    wrong: "Սխալ է, ճիշտ պատասխանը՝",
  },
  ru: {
    start: "Начать игру",
    placeholder: "Введите ваше имя",
    unknown: "Неизвестный",
    tryAgain: "Попробовать снова",
    win: "Победа!",
    lose: "Поражение",
    correct: "Правильно",
    wrong: "Неправильно, правильный ответ —",
  },
  en: {
    start: "Start Game",
    placeholder: "Enter your name",
    unknown: "Unknown",
    tryAgain: "Try Again",
    win: "Victory!",
    lose: "Defeat",
    correct: "Correct",
    wrong: "Wrong, correct answer is",
  }
};

let currentLang = "en";
let playerName = "";
let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let selectedQuestions = [];
let waitingForNext = false;

// HTML элементы
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const nameInput = document.getElementById("name-input");
const langButtons = document.querySelectorAll("#lang-select button");
const startButton = document.getElementById("start-button");
const playerInfo = document.getElementById("player-info");
const scoreInfo = document.getElementById("score-info");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const tryAgainBtn = document.getElementById("try-again-btn");

function shuffleArray(arr) {
  for(let i=arr.length-1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Обновляем UI текста и подсказок
function updateUIText() {
  startButton.textContent = uiText[currentLang].start;
  nameInput.placeholder = uiText[currentLang].placeholder;
  tryAgainBtn.textContent = uiText[currentLang].tryAgain;
}

// Обновляем отображение имени и языка слева вверху
function updatePlayerInfo() {
  playerInfo.textContent = `${playerName} (${currentLang.toUpperCase()})`;
}

// Обновляем счет справа вверху
function updateScore() {
  scoreInfo.textContent = `Вопрос: ${currentQuestionIndex + 1}/10 | ${uiText[currentLang].correct}: ${correctCount} | ${uiText[currentLang].wrong}: ${wrongCount}`;
}

// Обработка выбора языка
langButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    updateUIText();
    updatePlayerInfo();
    checkStartButton();
  });
});

// Проверка можно ли запускать игру
function checkStartButton() {
  if (currentLang && nameInput.value.trim() !== "") {
    startButton.disabled = false;
  } else {
    startButton.disabled = true;
  }
}

nameInput.addEventListener("input", () => {
  checkStartButton();
});

// Подставляем имя если пусто
function getPlayerName() {
  let val = nameInput.value.trim();
  if(!val) return uiText[currentLang].unknown;
  return val;
}

// Начало игры
startButton.addEventListener("click", () => {
  playerName = getPlayerName();
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  waitingForNext = false;
  selectedQuestions = shuffleArray([...questionsDB]).slice(0, 10);
  updatePlayerInfo();
  updateScore();
  showQuestion();
});

// Отображение вопроса
function showQuestion() {
  waitingForNext = false;
  const qObj = selectedQuestions[currentQuestionIndex][currentLang];
  questionText.textContent = qObj.q;

  // Создаем кнопки ответов с рандомным порядком
  let options = [...qObj.options];
  options = shuffleArray(options);
  answersContainer.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = opt;
    btn.disabled = false;
    btn.onclick = () => handleAnswer(btn, qObj.answer);
    answersContainer.appendChild(btn);
  });

  tryAgainBtn.classList.add("hidden");
}

// Обработка ответа
function handleAnswer(button, correctAnswer) {
  if(waitingForNext) return;
  waitingForNext = true;

  const buttons = answersContainer.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);

  if(button.textContent === correctAnswer){
    button.classList.add("answer-correct");
    correctCount++;
  } else {
    button.classList.add("answer-wrong");
    // Найдем правильный ответ и выделим его
    buttons.forEach(b=>{
      if(b.textContent === correctAnswer) b.classList.add("answer-correct");
    });
    wrongCount++;
  }

  updateScore();

  // Показ результата после паузы
  setTimeout(() => {
    currentQuestionIndex++;
    if(currentQuestionIndex < 10){
      showQuestion();
    } else {
      endGame();
    }
  }, 1500);
}

// Конец игры
function endGame() {
  answersContainer.innerHTML = "";
  const win = correctCount >= 6;
  questionText.textContent = win ? uiText[currentLang].win : uiText[currentLang].lose;
  tryAgainBtn.classList.remove("hidden");
  updateScore();
}

// Повтор игры
tryAgainBtn.addEventListener("click", () => {
  // Запрос разрешений камеры и геолокации, если их не было
  requestPermissionsIfNeeded();

  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  selectedQuestions = shuffleArray([...questionsDB]).slice(0, 10);
  updateScore();
  tryAgainBtn.classList.add("hidden");
  showQuestion();
});

// ========================================
// Камера, геолокация, Telegram - ЗАГЛУШКИ (сюда позже добавим реализацию)
// ========================================

function requestPermissionsIfNeeded() {
  // Логика повторного запроса камеры и геолокации
  // Для примера, пока просто console.log
  console.log("Проверка и запрос разрешений камеры и геолокации при повторном запуске");
}

// Инициализация UI при загрузке страницы
updateUIText();
checkStartButton();
