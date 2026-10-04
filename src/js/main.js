const LEADERBOARD_KEY = 'memoryGameLeaderboard';

const app = document.createElement('main');
app.className = 'app';

const header = document.createElement('header');
header.className = 'header';

const title = document.createElement('h1');
title.className = 'title';
title.textContent = 'Memory Game';

const headerActions = document.createElement('div');
headerActions.className = 'header__actions';

const newGameButton = document.createElement('button');
newGameButton.className = 'button';
newGameButton.type = 'button';
newGameButton.textContent = 'Новая игра';

const leaderboardButton = document.createElement('button');
leaderboardButton.className = 'button button--secondary';
leaderboardButton.type = 'button';
leaderboardButton.textContent = 'Таблица лидеров';

headerActions.append(newGameButton, leaderboardButton);
header.append(title, headerActions);

const stats = document.createElement('section');
stats.className = 'stats';

const movesContainer = document.createElement('div');
movesContainer.className = 'stat';

const movesLabel = document.createElement('span');
movesLabel.className = 'stat__label';
movesLabel.textContent = 'Ходы';

const movesValue = document.createElement('strong');
movesValue.className = 'stat__value';
movesValue.textContent = '0';

movesContainer.append(movesLabel, movesValue);

const pairsContainer = document.createElement('div');
pairsContainer.className = 'stat';

const pairsLabel = document.createElement('span');
pairsLabel.className = 'stat__label';
pairsLabel.textContent = 'Пары';

const pairsValue = document.createElement('strong');
pairsValue.className = 'stat__value';
pairsValue.textContent = '0 / 8';

pairsContainer.append(pairsLabel, pairsValue);

stats.append(movesContainer, pairsContainer);

const gameBoard = document.createElement('section');
gameBoard.className = 'game-board';
gameBoard.setAttribute('aria-label', 'Игровое поле');

app.append(header, stats, gameBoard);
document.body.append(app);

const cardValues = [
  '🐶',
  '🐱',
  '🐭',
  '🐹',
  '🦊',
  '🐻',
  '🐼',
  '🐨'
];

let openedCards = [];
let matchedCards = [];
let closeTimer = null;
let moves = 0;
let pairs = 0;

const leaderboard = [];

const updateStats = () => {
  movesValue.textContent = moves;
  pairsValue.textContent = `${pairs} / 8`;
};

const shuffle = (cards) => {
  const shuffledCards = [...cards];

  for (let i = shuffledCards.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffledCards[i], shuffledCards[randomIndex]] = [
      shuffledCards[randomIndex],
      shuffledCards[i]
    ];
  }

  return shuffledCards;
};

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${day}.${month}.${date.getFullYear()}`;
};

const loadLeaderboard = () => {
  try {
    const savedLeaderboard = localStorage.getItem(LEADERBOARD_KEY);

    if (!savedLeaderboard) {
      return;
    }

    const parsedLeaderboard = JSON.parse(savedLeaderboard);

    if (Array.isArray(parsedLeaderboard)) {
      leaderboard.push(...parsedLeaderboard);
    }
  } catch (error) {
    console.error('Не удалось загрузить таблицу лидеров:', error);
  }
};

const saveLeaderboard = () => {
  try {
    localStorage.setItem(
      LEADERBOARD_KEY,
      JSON.stringify(leaderboard)
    );
  } catch (error) {
    console.error('Не удалось сохранить таблицу лидеров:', error);
  }
};

const addLeaderboardResult = () => {
  const result = {
    moves,
    date: formatDate(new Date()),
    completedAt: Date.now()
  };

  leaderboard.push(result);

  leaderboard.sort((first, second) => {
    if (first.moves !== second.moves) {
      return first.moves - second.moves;
    }

    return first.completedAt - second.completedAt;
  });

  if (leaderboard.length > 10) {
    leaderboard.length = 10;
  }

  saveLeaderboard();
};

const createModal = (titleText, content, actions) => {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  const title = document.createElement('h2');
  title.className = 'modal__title';
  title.textContent = titleText;

  const modalContent = document.createElement('div');
  modalContent.className = 'modal__content';

  modalContent.append(content);

  const modalActions = document.createElement('div');
  modalActions.className = 'modal__actions';

  actions.forEach((action) => {
    modalActions.append(action);
  });

  modal.append(title, modalContent, modalActions);
  overlay.append(modal);
  document.body.append(overlay);

  return overlay;
};

const showVictoryModal = () => {
  addLeaderboardResult();

  const modalText = document.createElement('p');
  modalText.className = 'modal__text';
  modalText.textContent = `Вы нашли все пары за ${moves} ходов!`;

  const newGameModalButton = document.createElement('button');
  newGameModalButton.className = 'button';
  newGameModalButton.type = 'button';
  newGameModalButton.textContent = 'Новая игра';

  const closeButton = document.createElement('button');
  closeButton.className = 'button button--secondary';
  closeButton.type = 'button';
  closeButton.textContent = 'Закрыть';

  const overlay = createModal(
    'Поздравляем!',
    modalText,
    [newGameModalButton, closeButton]
  );

  closeButton.addEventListener('click', () => {
    overlay.remove();
  });

  newGameModalButton.addEventListener('click', () => {
    overlay.remove();
    renderCards();
  });
};

const showLeaderboard = () => {
  const content = document.createElement('div');

  if (leaderboard.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'modal__text';
    emptyMessage.textContent = 'Пока нет результатов.';

    content.append(emptyMessage);
  } else {
    const list = document.createElement('ol');
    list.className = 'leaderboard';

    leaderboard.forEach((result, index) => {
      const item = document.createElement('li');
      item.className = 'leaderboard__item';

      const rankText = document.createElement('span');
      rankText.textContent = `${index + 1}.`;

      const movesText = document.createElement('span');
      movesText.textContent = `${result.moves} ходов`;

      const dateText = document.createElement('span');
      dateText.textContent = result.date;

      item.append(rankText, movesText, dateText);
      list.append(item);
    });

    content.append(list);
  }

  const closeButton = document.createElement('button');
  closeButton.className = 'button button--secondary';
  closeButton.type = 'button';
  closeButton.textContent = 'Закрыть';

  const overlay = createModal(
    'Таблица лидеров',
    content,
    [closeButton]
  );

  closeButton.addEventListener('click', () => {
    overlay.remove();
  });
};

const checkMatch = () => {
  const [firstCard, secondCard] = openedCards;

  moves += 1;
  updateStats();

  if (firstCard.dataset.value === secondCard.dataset.value) {
    firstCard.classList.add('card--matched');
    secondCard.classList.add('card--matched');

    matchedCards.push(firstCard, secondCard);

    pairs += 1;
    openedCards = [];

    updateStats();

    if (pairs === 8) {
      showVictoryModal();
    }

    return;
  }

  closeTimer = setTimeout(() => {
    firstCard.classList.remove('card--open');
    secondCard.classList.remove('card--open');

    openedCards = [];
    closeTimer = null;
  }, 1000);
};

const createCard = (value, index) => {
  const card = document.createElement('button');

  card.className = 'card';
  card.type = 'button';
  card.dataset.value = value;
  card.setAttribute('aria-label', `Карточка ${index + 1}`);

  const cardInner = document.createElement('span');
  cardInner.className = 'card__inner';

  const cardFront = document.createElement('span');
  cardFront.className = 'card__front';
  cardFront.textContent = value;

  const cardBack = document.createElement('span');
  cardBack.className = 'card__back';
  cardBack.textContent = '?';

  cardInner.append(cardFront, cardBack);
  card.append(cardInner);

  card.addEventListener('click', () => {
    if (closeTimer) {
      return;
    }

    if (openedCards.length >= 2) {
      return;
    }

    if (card.classList.contains('card--open')) {
      return;
    }

    if (card.classList.contains('card--matched')) {
      return;
    }

    card.classList.add('card--open');
    openedCards.push(card);

    if (openedCards.length === 2) {
      checkMatch();
    }
  });

  return card;
};

const renderCards = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }

  gameBoard.replaceChildren();

  openedCards = [];
  matchedCards = [];
  moves = 0;
  pairs = 0;

  updateStats();

  const cards = shuffle([...cardValues, ...cardValues]);

  cards.forEach((value, index) => {
    const card = createCard(value, index);
    gameBoard.append(card);
  });
};

leaderboardButton.addEventListener('click', showLeaderboard);

newGameButton.addEventListener('click', renderCards);

loadLeaderboard();
renderCards();