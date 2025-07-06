// =========== ДАННЫЕ ВОПРОСОВ ===============
const questionsDB = [
  {
    hy: { q: "Որն է Հայաստանի մայրաքաղաքը", options: ["Երևան", "Գյումրի", "Վանաձոր", "Սևան"], answer: "Երևան" },
    ru: { q: "Столица Армении?", options: ["Ереван", "Гюмри", "Ванадзор", "Севан"], answer: "Ереван" },
    en: { q: "What is the capital of Armenia?", options: ["Gyumri", "Yerevan", "Vanadzor", "Sevan"], answer: "Yerevan" }
  },
  {
    hy: { q: "Որն է Ֆրանսիայի մայրաքաղաքը", options: ["Մարսել", "Բորդո", "Փարիզ", "Լիոն"], answer: "Փարիզ" },
    ru: { q: "Столица Франции?", options: ["Марсель", "Париж", "Лион", "Ницца"], answer: "Париж" },
    en: { q: "What is the capital of France?", options: ["Marseille", "Paris", "Lyon", "Nice"], answer: "Paris" }
  },
  {
    hy: { q: "Որն է Իտալիայի մայրաքաղաքը", options: ["Միլան", "Նեապոլ", "Ռոմ", "Ֆլորենցիա"], answer: "Ռոմ" },
    ru: { q: "Столица Италии?", options: ["Милан", "Неаполь", "Рим", "Флоренция"], answer: "Рим" },
    en: { q: "What is the capital of Italy?", options: ["Milan", "Naples", "Rome", "Florence"], answer: "Rome" }
  },
  {
    hy: { q: "Որն է Ճապոնիայի մայրաքաղաքը", options: ["Օսակա", "Կյոտո", "Տոկիո", "Հիրոշիմա"], answer: "Տոկիո" },
    ru: { q: "Столица Японии?", options: ["Осака", "Киото", "Токио", "Хиросима"], answer: "Токио" },
    en: { q: "What is the capital of Japan?", options: ["Osaka", "Kyoto", "Tokyo", "Hiroshima"], answer: "Tokyo" }
  },
  {
    hy: { q: "Որն է Գերմանիայի մայրաքաղաքը", options: ["Մյունխեն", "Բեռլին", "Համբուրգ", "Ֆրանկֆուրտ"], answer: "Բեռլին" },
    ru: { q: "Столица Германии?", options: ["Мюнхен", "Берлин", "Гамбург", "Франкфурт"], answer: "Берлин" },
    en: { q: "What is the capital of Germany?", options: ["Munich", "Berlin", "Hamburg", "Frankfurt"], answer: "Berlin" }
  },
  {
    hy: { q: "Որն է Մեքսիկայի մայրաքաղաքը", options: ["Գուադալահարա", "Մեխիկո", "Կանկուն", "Մոնտեռեյ"], answer: "Մեխիկո" },
    ru: { q: "Столица Мексики?", options: ["Гвадалахара", "Мехико", "Канкун", "Монтеррей"], answer: "Мехико" },
    en: { q: "What is the capital of Mexico?", options: ["Guadalajara", "Mexico City", "Cancun", "Monterrey"], answer: "Mexico City" }
  },
  {
    hy: { q: "Որն է Կանադայի մայրաքաղաքը", options: ["Տորոնտո", "Վանկուվեր", "Օտտավա", "Մոնրեալ"], answer: "Օտտավա" },
    ru: { q: "Столица Канады?", options: ["Торонто", "Ванкувер", "Оттава", "Монреаль"], answer: "Оттава" },
    en: { q: "What is the capital of Canada?", options: ["Toronto", "Vancouver", "Ottawa", "Montreal"], answer: "Ottawa" }
  },
  {
    hy: { q: "Որն է Բրազիլիայի մայրաքաղաքը", options: ["Ռիո դե Ժանեյրո", "Բրազիլիա", "Սան Պաուլու", "Բելեն"], answer: "Բրազիլիա" },
    ru: { q: "Столица Бразилии?", options: ["Рио-де-Жанейро", "Бразилиа", "Сан-Паулу", "Белем"], answer: "Бразилиа" },
    en: { q: "What is the capital of Brazil?", options: ["Rio de Janeiro", "Brasilia", "Sao Paulo", "Belem"], answer: "Brasilia" }
  },
  {
    hy: { q: "Որն է Հնդկաստանի մայրաքաղաքը", options: ["Մումբայ", "Դելի", "Կալկաթա", "Չեննայ"], answer: "Դելի" },
    ru: { q: "Столица Индии?", options: ["Мумбаи", "Дели", "Калькутта", "Ченнаи"], answer: "Дели" },
    en: { q: "What is the capital of India?", options: ["Mumbai", "Delhi", "Kolkata", "Chennai"], answer: "Delhi" }
  },
  {
    hy: { q: "Որն է Ավստրալիայի մայրաքաղաքը", options: ["Սիդնի", "Մելբուռն", "Քենբերրա", "Բրիսբեն"], answer: "Քենբերրա" },
    ru: { q: "Столица Австралии?", options: ["Сидней", "Мельбурн", "Канберра", "Брисбен"], answer: "Канберра" },
    en: { q: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], answer: "Canberra" }
  },
  {
    hy: { q: "Որն է Եգիպտոսի մայրաքաղաքը", options: ["Կահիրե", "Ալեքսանդրիա", "Գիզա", "Լուքսոր"], answer: "Կահիրե" },
    ru: { q: "Столица Египта?", options: ["Каир", "Александрия", "Гиза", "Луксор"], answer: "Каир" },
    en: { q: "What is the capital of Egypt?", options: ["Cairo", "Alexandria", "Giza", "Luxor"], answer: "Cairo" }
  },
  {
    hy: { q: "Որն է Ռուսաստաի մայրաքաղաքը", options: ["Մոսկվա", "Սանկտ Պետերբուրգ", "Կազան", "Նովոսիբիրսկ"], answer: "Մոսկվա" },
    ru: { q: "Столица России?", options: ["Москва", "Санкт-Петербург", "Казань", "Новосибирск"], answer: "Москва" },
    en: { q: "What is the capital of Russia?", options: ["Moscow", "Saint Petersburg", "Kazan", "Novosibirsk"], answer: "Moscow" }
  },
  {
    hy: { q: "Որն է Մեծ Բրիտանիայի մայրաքաղաքը", options: ["Մանչեսթեր", "Լիվերպուլ", "Լոնդոն", "Բիրմինգհեմ"], answer: "Լոնդոն" },
    ru: { q: "Столица Великобритании?", options: ["Манчестер", "Ливерпуль", "Лондон", "Бирмингем"], answer: "Лондон" },
    en: { q: "What is the capital of United Kingdom?", options: ["Manchester", "Liverpool", "London", "Birmingham"], answer: "London" }
  },
  {
    hy: { q: "Որն է Կորեայի մայրաքաղաքը", options: ["Բուսան", "Ինչոն", "Սեուլ", "Դեգու"], answer: "Սեուլ" },
    ru: { q: "Столица Южной Кореи?", options: ["Пусан", "Инчхон", "Сеул", "Тэгу"], answer: "Сеул" },
    en: { q: "What is the capital of South Korea?", options: ["Busan", "Incheon", "Seoul", "Daegu"], answer: "Seoul" }
  },
  {
    hy: { q: "Որն է Թուրքիի մայրաքաղաքը", options: ["Իզմիր", "Անթալիա", "Կայսերի", "Անկարան"], answer: "Անկարան" },
    ru: { q: "Столица Турции?", options: ["Измир", "Анталия", "Кайсери", "Анкара"], answer: "Анкара" },
    en: { q: "What is the capital of Turkey?", options: ["Izmir", "Antalya", "Kayseri", "Ankara"], answer: "Ankara" }
  },
  {
    hy: { q: "Որն է Հունաստանի մայրաքաղաքը", options: ["Սալոնիկ", "Հերակլիոն", "Ատենք", "Պատրաս"], answer: "Ատենք" },
    ru: { q: "Столица Греции?", options: ["Салоники", "Ираклион", "Афины", "Патры"], answer: "Афины" },
    en: { q: "What is the capital of Greece?", options: ["Thessaloniki", "Heraklion", "Athens", "Patras"], answer: "Athens" }
  },
  {
    hy: { q: "Որն է Հնդկոնկի մայրաքաղաքը", options: ["Տոնգ Կու", "Հոնկոնկ", "Կաո", "Շենջեն"], answer: "Հոնկոնկ" },
    ru: { q: "Столица Гонконга?", options: ["Тонг Ку", "Гонконг", "Као", "Шэньчжэнь"], answer: "Гонконг" },
    en: { q: "What is the capital of Hong Kong?", options: ["Tong Ku", "Hong Kong", "Kao", "Shenzhen"], answer: "Hong Kong" }
  },
  {
    hy: { q: "Որն է Պորտուգալիայի մայրաքաղաքը", options: ["Պորտու", "Կոիմբրա", "Լիսաբոն", "Ֆարո"], answer: "Լիսաբոն" },
    ru: { q: "Столица Португалии?", options: ["Порту", "Коимбра", "Лиссабон", "Фаро"], answer: "Лиссабон" },
    en: { q: "What is the capital of Portugal?", options: ["Porto", "Coimbra", "Lisbon", "Faro"], answer: "Lisbon" }
  },
  {
    hy: { q: "Որն է Շվեյցարիայի մայրաքաղաքը", options: ["Ցյուրիխ", "Բազել", "Լյուցեռն", "Բեռն"], answer: "Բեռն" },
    ru: { q: "Столица Швейцарии?", options: ["Цюрих", "Базель", "Люцерн", "Берн"], answer: "Берн" },
    en: { q: "What is the capital of Switzerland?", options: ["Zurich", "Basel", "Lucerne", "Bern"], answer: "Bern" }
  },
  {
    hy: { q: "Որն է Նորվեգիայի մայրաքաղաքը", options: ["Բերգեն", "Օսլո", "Տրոնհեյմ", "Ստավանգեր"], answer: "Օսլո" },
    ru: { q: "Столица Норвегии?", options: ["Берген", "Осло", "Тронхейм", "Ставангер"], answer: "Осло" },
    en: { q: "What is the capital of Norway?", options: ["Bergen", "Oslo", "Trondheim", "Stavanger"], answer: "Oslo" }
  },
  {
    hy: { q: "Որն է Շվեդիայի մայրաքաղաքը", options: ["Մալմյո", "Գյոթեբորգ", "Ուպսալա", "Ստոկհոլմ"], answer: "Ստոկհոլմ" },
    ru: { q: "Столица Швеции?", options: ["Мальмё", "Гётеборг", "Уппсала", "Стокгольм"], answer: "Стокгольм" },
    en: { q: "What is the capital of Sweden?", options: ["Malmo", "Gothenburg", "Uppsala", "Stockholm"], answer: "Stockholm" }
  },
  {
    hy: { q: "Որն է Ֆինլանդիայի մայրաքաղաքը", options: ["Տուրկու", "Օուլու", "Հելսinki", "Տամպերե"], answer: "Հելսinki" },
    ru: { q: "Столица Финляндии?", options: ["Турку", "Оулу", "Хельсинки", "Тампере"], answer: "Хельсинки" },
    en: { q: "What is the capital of Finland?", options: ["Turku", "Oulu", "Helsinki", "Tampere"], answer: "Helsinki" }
  },
  {
    hy: { q: "Որն է Դանիայի մայրաքաղաքը", options: ["Օդենսե", "Օրհուս", "Կոպենհագեն", "Ռոսկիլդե"], answer: "Կոպենհագեն" },
    ru: { q: "Столица Дании?", options: ["Оденсе", "Орхус", "Копенгаген", "Роскилле"], answer: "Копенгаген" },
    en: { q: "What is the capital of Denmark?", options: ["Odense", "Aarhus", "Copenhagen", "Roskilde"], answer: "Copenhagen" }
  },
  {
    hy: { q: "Որն է Բելգիայի մայրաքաղաքը", options: ["Անտվերպեն", "Գենտ", "Բրյուսել", "Լյուվեն"], answer: "Բրյուսել" },
    ru: { q: "Столица Бельгии?", options: ["Антверпен", "Гент", "Брюссель", "Лёвен"], answer: "Брюссель" },
    en: { q: "What is the capital of Belgium?", options: ["Antwerp", "Ghent", "Brussels", "Leuven"], answer: "Brussels" }
  },
  {
    hy: { q: "Որն է Չեխիայի մայրաքաղաքը", options: ["Բրնո", "Պրահա", "Օստրավա", "Պիլզեն"], answer: "Պրահա" },
    ru: { q: "Столица Чехии?", options: ["Брно", "Прага", "Острава", "Пльзень"], answer: "Прага" },
    en: { q: "What is the capital of Czech Republic?", options: ["Brno", "Prague", "Ostrava", "Plzen"], answer: "Prague" }
  },
  {
    hy: { q: "Որն է Աֆղանստանի մայրաքաղաքը", options: ["Կաբուլ", "Կանդահար", "Հերաթ", "Մազար-Շարաֆ"], answer: "Կաբուլ" },
    ru: { q: "Столица Афганистана?", options: ["Кабул", "Кандагар", "Герат", "Мазар-и-Шариф"], answer: "Кабул" },
    en: { q: "What is the capital of Afghanistan?", options: ["Kabul", "Kandahar", "Herat", "Mazar-i-Sharif"], answer: "Kabul" }
  },
  {
    hy: { q: "Որն է Վիետնամի մայրաքաղաքը", options: ["Հանոյ", "Հոշի Մինհ", "Դանա Ան", "Կյան Ան"], answer: "Հանոյ" },
    ru: { q: "Столица Вьетнама?", options: ["Ханой", "Хошимин", "Дананг", "Куанг Ан"], answer: "Ханой" },
    en: { q: "What is the capital of Vietnam?", options: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Quang An"], answer: "Hanoi" }
  },
  {
    hy: { q: "Որն է Պակիստանի մայրաքաղաքը", options: ["Կարաչի", "Լահոր", "Իսլամաբադ", "Քվետա"], answer: "Իսլամաբադ" },
    ru: { q: "Столица Пакистана?", options: ["Карачи", "Лахор", "Исламабад", "Кветта"], answer: "Исламабад" },
    en: { q: "What is the capital of Pakistan?", options: ["Karachi", "Lahore", "Islamabad


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
