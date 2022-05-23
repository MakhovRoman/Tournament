  let minutesValue = 0;
  let secondsValue = 0;
  let timeArray = [[1,0], [1,30], [2,0], [3,0]];

  let timerId;
  let isStart = false;
  let isRefresh = true;

  let minutes = document.querySelector('.minutes');
  let seconds = document.querySelector('.seconds');
  showTime();

  let timerListItems = document.querySelectorAll('.timerList__item');

  for(let i = 0; i < timerListItems.length; i++) {
    timerListItems[i].addEventListener('click', function setTimer() {
      if (isRefresh) {
        [minutesValue, secondsValue] = timeArray[i];
      }
      showTime();
    });
  }


  let timerControlsButtons = document.querySelectorAll('.timerControls__button');

  timerControlsButtons[0].addEventListener('click', function() {
    if(!isStart) {
      timerStart();
    }

    isStart = true;


    if((minutesValue >= 1 && secondsValue != -1)) {
      this.classList.add('timerControls__button_hidden');
      timerControlsButtons[2].classList.remove('timerControls__button_hidden');
    }
  })

  timerControlsButtons[2].addEventListener('click', function() {
    if(isStart) {
      timerStop();
    }

    isStart = false;


    this.classList.add('timerControls__button_hidden');
    timerControlsButtons[0].classList.remove('timerControls__button_hidden');
  })

  timerControlsButtons[1].addEventListener('click', timerClear);


  function showTime() {
    minutes.textContent = ("0" + minutesValue).slice(-2);
    seconds.textContent = ('0' + secondsValue).slice(-2);
  }

  function timerStart() {
    timerId = setInterval( () => {
      --secondsValue;

      if (minutesValue < 1 && secondsValue <= -1) {
        clearInterval(timerId);
        isStart = false;
        secondsValue = 0;
        minutesValue = 0;
        return;
      }

      if (secondsValue == -1) {
        secondsValue = 59;
        --minutesValue;
      }

      if (minutesValue == -1) {
        minutesValue = 0;
      }

      isRefresh = false;
      showTime();
    }, 1000)
  }

  function timerStop() {
    clearInterval(timerId);
    isStart = false;
    isRefresh = false;
  }

  function timerClear() {
    clearInterval(timerId);

    isRefresh = true;
    isStart = false;
    secondsValue = 0;
    minutesValue = 0;
    showTime();
  }
