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


// Cards

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

const updateStats = () => {
  movesValue.textContent = moves;
  pairsValue.textContent = `${pairs} / 8`;
};


// Shuffle

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


// Check match

const checkMatch = () => {
  const [firstCard, secondCard] = openedCards;

  moves += 1;
  updateStats();

  if (firstCard.dataset.value === secondCard.dataset.value) {
    firstCard.classList.add('card--matched');
    secondCard.classList.add('card--matched');

    matchedCards.push(firstCard, secondCard);
    pairs += 1;

    updateStats();

    openedCards = [];

    return;
  }

  closeTimer = setTimeout(() => {
    firstCard.classList.remove('card--open');
    secondCard.classList.remove('card--open');

    openedCards = [];
    closeTimer = null;
  }, 1000);
};


// Create card

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


// Render cards

const renderCards = () => {
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

renderCards();