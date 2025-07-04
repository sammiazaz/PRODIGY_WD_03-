
  (() => {
    const timeDisplay = document.getElementById('time-display');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');
    const lapBtn = document.getElementById('lap-btn');
    const lapList = document.getElementById('lap-list');

    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval;
    let running = false;

    function formatTime(time) {
      const milliseconds = time % 1000;
      const totalSeconds = Math.floor(time / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return (
        String(minutes).padStart(2, '0') +
        ':' +
        String(seconds).padStart(2, '0') +
        '.' +
        String(milliseconds).padStart(3, '0')
      );
    }

    function updateDisplay() {
      elapsedTime = Date.now() - startTime;
      timeDisplay.textContent = formatTime(elapsedTime);
    }

    function start() {
      if (running) return;
      startTime = Date.now() - elapsedTime;
      timerInterval = setInterval(updateDisplay, 25);
      running = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      resetBtn.disabled = false;
      lapBtn.disabled = false;
    }

    function stop() {
      if (!running) return;
      clearInterval(timerInterval);
      updateDisplay();
      running = false;
      startBtn.disabled = false;
      stopBtn.disabled = true;
      resetBtn.disabled = false;
      lapBtn.disabled = true;
    }

    function reset() {
      clearInterval(timerInterval);
      elapsedTime = 0;
      timeDisplay.textContent = "00:00.000";
      lapList.innerHTML = '';
      running = false;
      startBtn.disabled = false;
      stopBtn.disabled = true;
      resetBtn.disabled = true;
      lapBtn.disabled = true;
    }

    function addLap() {
      const li = document.createElement('li');
      li.textContent = formatTime(elapsedTime);
      lapList.prepend(li);
    }

    
    startBtn.addEventListener('click', start);
    stopBtn.addEventListener('click', stop);
    resetBtn.addEventListener('click', reset);
    lapBtn.addEventListener('click', addLap);
  })();
