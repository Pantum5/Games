const questionsPool = [
  {
    question: "Ի՞նչ է մայրաքաղաքը Հայաստանի։",
    answers: [
      { text: "Երևան", correct: true },
      { text: "Գյումրի", correct: false },
      { text: "Վանաձոր", correct: false },
      { text: "Աշտարակ", correct: false },
    ]
  },
  {
    question: "Ի՞նչ է մայրաքաղաքը Ֆրանսիայի։",
    answers: [
      { text: "Մարսել", correct: false },
      { text: "Փարիզ", correct: true },
      { text: "Լիոն", correct: false },
      { text: "Բորդո", correct: false },
    ]
  },
  {
    question: "Ի՞նչ է մայրաքաղաքը Գերմանիայի։",
    answers: [
      { text: "Բեռլին", correct: true },
      { text: "Համբուրգ", correct: false },
      { text: "Մյունխեն", correct: false },
      { text: "Քյոլն", correct: false },
    ]
  },
  {
    question: "Ի՞նչ է մայրաքաղաքը Իտալիայի։",
    answers: [
      { text: "Միլան", correct: false },
      { text: "Նեապոլ", correct: false },
      { text: "Հռոմ", correct: true },
      { text: "Ֆլորենցիա", correct: false },
    ]
  },
  {
    question: "Ի՞նչ է մայրաքաղաքը Ռուսաստանին։",
    answers: [
      { text: "Սանկտ Պետերբուրգ", correct: false },
      { text: "Մոսկվա", correct: true },
      { text: "Եկատերինբուրգ", correct: false },
      { text: "Նովոսիբիրսկ", correct: false },
    ]
  },
  {
    question: "Ի՞նչ է մայրաքաղաքը Իրանի։",
    answers: [
      { text: "Շիրազ", correct: false },
      { text: "Թեհրան", correct: true },
      { text: "Իսֆահան", correct: false },
      { text: "Թաբրիզ", correct: false },
    ]
  },
  {
    question: "Ի՞նչ է մայրաքաղաքը ԱՄՆ-ի։",
    answers: [
      { text: "Նյու Յորք", correct: false },
      { text: "Լոս Անջելես", correct: false },
      { text: "Վաշինգտոն", correct: true },
      { text: "Չիկագո", correct: false },
    ]
  },
  {
    question: "Ի՞նչ է մայրաքաղաքը Ճապոնիայի։",
    answers: [
      { text: "Տոկիո", correct: true },
      { text: "Օսակա", correct: false },
      { text: "Նագոյա", correct: false },
      { text: "Կյոտո", correct: false },
    ]
  },
  {
    question: "Ի՞նչ է մայրաքաղաքը Չինաստանի։",
    answers: [
      { text: "Շանհայ", correct: false },
      { text: "Պեկին", correct: true },
      { text: "Չենդու", correct: false },
      { text: "Գուանչժոու", correct: false },
    ]
  },
  {
    question: "Ի՞նչ է մայրաքաղաքը Մեծ Բրիտանիայի։",
    answers: [
      { text: "Լիվերպուլ", correct: false },
      { text: "Լոնդոն", correct: true },
      { text: "Մանչեսթեր", correct: false },
      { text: "Բրիստոլ", correct: false },
    ]
  }
];

// Shuffle array
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const userNameDisplay = document.getElementById('user-name');
const scoreInfo = document.getElementById('score-info');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const tryAgainBtn = document.getElementById('try-again-btn');

let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let userName = '';
let questions = [];

nameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  userName = nameInput.value.trim();
  if (!userName) return;

  document.getElementById('name-form-container').style.display = 'none';
  document.getElementById('game-area').style.display = 'block';
  userNameDisplay.textContent = `👤 ${userName}`;

  startGame();
});

function startGame() {
  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  questions = shuffle([...questionsPool]);
  showQuestion();
}

function showQuestion() {
  resetState();

  const q = questions[currentQuestionIndex];
  questionElement.textContent = q.question;

  const shuffledAnswers = shuffle(q.answers);
  shuffledAnswers.forEach((ans) => {
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.textContent = ans.text;
    if (ans.correct) btn.dataset.correct = true;
    btn.addEventListener('click', selectAnswer);
    answerButtons.appendChild(btn);
  });

  updateScore();
}

function resetState() {
  answerButtons.innerHTML = '';
  tryAgainBtn.style.display = 'none';
}

function selectAnswer(e) {
  const selected = e.target;
  const isCorrect = selected.dataset.correct === 'true';

  Array.from(answerButtons.children).forEach(btn => {
    const correct = btn.dataset.correct === 'true';
    btn.classList.add(correct ? 'correct' : 'wrong');
    btn.disabled = true;
  });

  if (isCorrect) correctCount++;
  else wrongCount++;

  updateScore();

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1500);
}

function updateScore() {
  const remaining = questions.length - (correctCount + wrongCount);
  scoreInfo.textContent = `Մնաց՝ ${remaining} | Ճիշտ՝ ${correctCount} | Սխալ՝ ${wrongCount}`;
}

function showResult() {
  questionElement.textContent = correctCount >= 5 ? '🏆 Հաղթանակ!' : '❌ Պարտություն';
  answerButtons.innerHTML = '';
  tryAgainBtn.style.display = 'block';
}

tryAgainBtn.addEventListener('click', () => {
  document.getElementById('game-area').style.display = 'none';
  document.getElementById('name-form-container').style.display = 'block';
  nameInput.value = '';
});
