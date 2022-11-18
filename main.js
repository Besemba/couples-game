(() => {

  const form = document.querySelector('.form');
  const input = document.querySelector('.input');
  const list = document.querySelector('.card-list');
  const area = document.querySelector('.area');

  function createTimer() {
    const timer = document.createElement('div');
    timer.classList.add('timer');
    timer.setAttribute('id', 'timer');
    timer.textContent = 60;
    area.prepend(timer);
  }

  function createCards(number) {
    for (let i = 0; i < number; i++) {
      const cardContainer = document.createElement('li');
      const card = document.createElement('div');
      const cardFace = document.createElement('div');
      const cardFaceBack = document.createElement('div');
      if (number == 4) {
        cardContainer.classList.add('card-container-2');
        list.classList.add('max-width-2');
      } else if (number == 16) {
        cardContainer.classList.add('card-container-4');
        list.classList.add('max-width-4');
      } else if (number == 36) {
        cardContainer.classList.add('card-container-6');
        list.classList.add('max-width-6');
      } else if (number == 64) {
        cardContainer.classList.add('card-container-8');
        list.classList.add('max-width-8');
      } else if (number == 100) {
        cardContainer.classList.add('card-container-10');
        list.classList.add('max-width-10');
      }
      card.classList.add('card');
      cardFace.classList.add('card-face');
      cardFace.textContent = '?';
      cardFaceBack.classList.add('card-face', 'back');
      card.append(cardFace);
      card.append(cardFaceBack);
      cardContainer.append(card);
      list.append(cardContainer);
    }
  }

  form.addEventListener('submit', function (e) {
    createTimer();
    e.preventDefault();
    let inputValue = input.value;
    if (inputValue >= 2 && inputValue <= 10 && inputValue % 2 == 0) {
      createCards(Math.pow(inputValue, 2));
    } else createCards(4);
    form.remove();
    game();
  });

  function game() {
    const cards = document.querySelectorAll('.card');
    const cardContent = document.querySelectorAll('.back');
    const findTimer = document.querySelector('.timer');

    const timerId = setInterval(timer, 1000);

    function timer() {
      let currentNumber = findTimer.textContent;
      if (currentNumber <= 0) {
        clearInterval(timerId);
        gameOver();
      } else {
        findTimer.textContent = currentNumber - 1;
      }
    }

    let digits = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8,];

    if (list.children.length == 4) {
      digits = digits.slice(0, -12);
    } else if (list.children.length == 36) {
      digits = ((digits.concat(digits)).concat(digits).slice(0, -12));
    } else if (list.children.length == 64) {
      digits = ((digits.concat(digits)).concat(digits.concat(digits)));
    } else if (list.children.length == 100) {
      digits = (((digits.concat(digits)).concat(digits.concat(digits))).concat(digits.concat(digits))).concat(digits).slice(0, -12);
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    shuffle(digits);

    for (let i in digits) {
      cardContent[i].textContent = digits[i];
      cards[i].content = digits[i]
    }

    let firstCard;
    let secondCard;
    let flippedCard = false;
    let blockCards = false;

    function flipCard() {
      if (blockCards) return;
      if (this === firstCard) return;
      this.classList.add('flip');
      if (flippedCard == false) {
        firstCard = this;
        flippedCard = true;
      } else {
        secondCard = this;
        comparison();
      }
    }

    function resetCards() {
      [blockCards, flippedCard] = [false, false];
      [firstCard, secondCard] = [null, null];
    }

    function comparison() {
      const match = firstCard.content == secondCard.content;
      match ? disableCards() : unflipCards();
    }

    function disableCards() {
      firstCard.removeEventListener('click', flipCard);
      secondCard.removeEventListener('click', flipCard);
      resetCards();
      const openedCard = document.querySelectorAll('.flip');
      if (openedCard.length == digits.length) {
        findTimer.textContent = 'Вы отлично справились! :)';
        clearInterval(timerId);
        createRestartButton();
      }
    }

    function unflipCards() {
      blockCards = true;
      setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetCards();
      }, 900);
    }

    cards.forEach(card => card.addEventListener('click', flipCard));

    function createRestartButton() {
      const button = document.createElement('button');
      button.textContent = 'Сыграть ещё раз';
      button.classList.add('restart-button');
      const area = document.querySelector('.area');
      area.append(button);
      button.addEventListener('click', restart);
    }

    function restart() {
      setTimeout(game, 100);
      resetCards();
      let allOpenedCards = document.querySelectorAll('.flip');
      allOpenedCards.forEach(card => card.classList.remove('flip'));
      const button = document.querySelector('.restart-button');
      button.remove();
      findTimer.textContent = 60;
    }

    function gameOver() {
      cards.forEach(card => card.removeEventListener('click', flipCard));
      findTimer.textContent = 'Время вышло :(';
      createRestartButton();
    }
  }
})();