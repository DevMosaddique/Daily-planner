const schedule = [
  { time: '14:00 - 16:00', task: 'Study Session-1' },
  { time: '16:00 - 16:15', task: 'Quick Break (Stretch/Hydrate)' },
  { time: '16:15 - 18:15', task: 'Study Session-2' },
  { time: '18:15 - 18:30', task: 'Study Break (Relax)' },
  { time: '18:30 - 20:00', task: 'Study Session-3' },
  { time: '20:00 - 22:00', task: 'Break (Dinner)' },
  { time: '22:00 - 00:00', task: 'Study Session-4' },
  { time: '00:00 - 00:15', task: 'Quick Break (Stretch/Hydrate)' },
  { time: '00:15 - 02:15', task: 'Study Session-5' },
  { time: '02:15 - 02:30', task: 'Study Break (Relax)' },
  { time: '02:30 - 04:30', task: 'Study Session-6' },
  { time: '04:30 - 04:45', task: 'Quick Break (Relax)' },
  { time: '04:45 - 06:45', task: 'Study Session-7' },
  { time: '06:45 - 07:00', task: 'Review/Recap Session' },
];

function displaySchedule() {
  const scheduleContainer = document.getElementById('schedule');
  const currentTime = new Date();

  schedule.forEach((item, index) => {
    const scheduleItem = document.createElement('div');
    scheduleItem.classList.add('schedule-item');
    scheduleItem.innerHTML = `<strong>${item.time}</strong>: <span>${item.task}</span>`;
    scheduleItem.addEventListener('mousedown', () =>
      handleMouseDown(scheduleItem, index)
    );
    scheduleItem.addEventListener('mouseup', handleMouseUp);
    scheduleItem.addEventListener('mouseleave', handleMouseUp);

    const [startHour, startMinute] = item.time
      .split(' - ')[0]
      .split(':')
      .map(Number);
    const [endHour, endMinute] = item.time
      .split(' - ')[1]
      .split(':')
      .map(Number);
    const startTime = new Date();
    const endTime = new Date();

    startTime.setHours(startHour, startMinute, 0);
    endTime.setHours(endHour, endMinute, 0);

    if (currentTime >= startTime && currentTime <= endTime) {
      scheduleItem.classList.add('highlight');
      notifyUser(item.task);
    } else if (currentTime > endTime) {
      scheduleItem.classList.add('past-task');
    }

    scheduleContainer.appendChild(scheduleItem);
  });

  fetchMotivationalQuote();
  setInterval(fetchMotivationalQuote, 28800000); // Update every 8 hours
}

let holdTimeout;

function handleMouseDown(scheduleItem, index) {
  holdTimeout = setTimeout(() => {
    scheduleItem.classList.add('completed');
    markTaskAsCompleted(index);
  }, 5000);
}

function handleMouseUp() {
  clearTimeout(holdTimeout);
}

function markTaskAsCompleted(index) {
  let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || {};
  completedTasks[index] = true;
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

function notifyUser(task) {
  if (Notification.permission === 'granted') {
    new Notification('Current Task', {
      body: task,
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('Current Task', {
          body: task,
        });
      }
    });
  }
}

function fetchMotivationalQuote() {
  fetch('https://zenquotes.io/api/today')
    .then((response) => response.json())
    .then((data) => {
      const quoteContainer = document.getElementById('motivational-quote');
      quoteContainer.innerHTML = `<p class="quote">${data[0].quote}</p><p class="author">- ${data[0].author}</p>`;
    });
}

function countdownTimer() {
  const countdownElement = document.getElementById('countdown');
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 40);
  const countdownInterval = setInterval(() => {
    const now = new Date();
    const distance = targetDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    countdownElement.innerHTML = `${days} days remaining`;

    if (distance < 0) {
      clearInterval(countdownInterval);
      countdownElement.innerHTML = "Time's up!";
    }
  }, 1000);
}

countdownTimer();
displaySchedule();
