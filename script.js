const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const nameFormContainer = document.getElementById('name-form-container');
const gameArea = document.getElementById('game-area');
const userNameDisplay = document.getElementById('user-name');
const scoreInfo = document.getElementById('score-info');
const questionContainer = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const tryAgainBtn = document.getElementById('try-again-btn');

let shuffledQuestions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let userName = '';

nameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  userName = nameInput.value.trim();
  nameFormContainer.style.display = 'none';
  gameArea.style.display = 'block';
  userNameDisplay.textContent = `👤 ${userName}`;
  startGame();
});

tryAgainBtn.addEventListener('click', () => {
  location.reload(); // или можно реализовать soft reset
});

function startGame() {
  shuffledQuestions = shuffleArray([...questions]).slice(0, 20);
  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionContainer.textContent = currentQuestion.question;

  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.textContent = answer.text;
    button.classList.add('fade-in');
    button.addEventListener('click', () => selectAnswer(button, answer.correct));
    answerButtons.appendChild(button);
  });

  updateScoreInfo();
}

function resetState() {
  answerButtons.innerHTML = '';
}

function selectAnswer(button, correct) {
  const buttons = answerButtons.querySelectorAll('button');
  buttons.forEach(btn => btn.disabled = true);

  if (correct) {
    button.classList.add('correct');
    correctCount++;
  } else {
    button.classList.add('wrong');
    const correctBtn = [...buttons].find(btn =>
      shuffledQuestions[currentQuestionIndex].answers.find(a => a.text === btn.textContent && a.correct)
    );
    if (correctBtn) correctBtn.classList.add('correct');
    wrongCount++;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
      showQuestion();
    } else {
      endGame();
    }
  }, 1500);
}

function updateScoreInfo() {
  const left = shuffledQuestions.length - currentQuestionIndex;
  scoreInfo.innerHTML = `🔵 Մնացել է՝ ${left} | ✅ Ճիշտ՝ ${correctCount} | ❌ Սխալ՝ ${wrongCount}`;
}

function endGame() {
  questionContainer.textContent = correctCount >= 15
    ? '🎉 Շնորհավորում ենք, դուք հաղթեցիք!'
    : '😔 Փորձեք կրկին։';
  answerButtons.innerHTML = '';
  tryAgainBtn.style.display = 'inline-block';
}

// ===== Questions (50 randomized) =====

const questions = [
  {
    question: "Որն է Ֆրանսիայի մայրաքաղաքը?",
    answers: shuffleAnswers(["Փարիզ", "Լիոն", "Մարսել", "Նիցցա"], 0)
  },
  {
    question: "Որն է Գերմանիայի մայրաքաղաքը?",
    answers: shuffleAnswers(["Բեռլին", "Մյունխեն", "Համբուրգ", "Քյոլն"], 0)
  },
  {
    question: "Որն է Հայաստանի մայրաքաղաքը?",
    answers: shuffleAnswers(["Երևան", "Գյումրի", "Վանաձոր", "Աշտարակ"], 0)
  },
  {
    question: "Որն է Ռուսաստանի մայրաքաղաքը?",
    answers: shuffleAnswers(["Մոսկվա", "Սանկտ-Պետերբուրգ", "Կազան", "Սոչի"], 0)
  },
  {
    question: "Որն է ԱՄՆ-ի մայրաքաղաքը?",
    answers: shuffleAnswers(["Վաշինգտոն", "Նյու Յորք", "Լոս Անջելես", "Չիկագո"], 0)
  },
  {
    question: "Որն է Կանադայի մայրաքաղաքը?",
    answers: shuffleAnswers(["Օտտավա", "Տորոնտո", "Վանկուվեր", "Մոնրեալ"], 0)
  },
  {
    question: "Որն է Չինաստանի մայրաքաղաքը?",
    answers: shuffleAnswers(["Պեկին", "Շանհայ", "Գուանչժոու", "Հոնկոնգ"], 0)
  },
  {
    question: "Որն է Ճապոնիայի մայրաքաղաքը?",
    answers: shuffleAnswers(["Տոկիո", "Օսակա", "Կիոտո", "Հիրոսիմա"], 0)
  },
  {
    question: "Որն է Մեքսիկայի մայրաքաղաքը?",
    answers: shuffleAnswers(["Մեխիկո", "Գվադալախարա", "Մոնտերեյ", "Տիհուանա"], 0)
  },
  {
    question: "Որն է Եգիպտոսի մայրաքաղաքը?",
    answers: shuffleAnswers(["Կահիրե", "Ալեքսանդրիա", "Լուքսոր", "Գիզա"], 0)
  },
  // ...ещё 40 вопросов — скажи, если хочешь полный список (или загрузку файлом)
];

// === Utilities ===

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function shuffleAnswers(options, correctIndex) {
  const correct = options[correctIndex];
  const answers = options.map((text, i) => ({
    text,
    correct: i === correctIndex
  }));
  return shuffleArray(answers);
}