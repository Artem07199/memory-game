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


// Card values

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


// Create card

const createCard = (value, index) => {
  const card = document.createElement('button');
  card.className = 'card';
  card.type = 'button';
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
    card.classList.toggle('card--open');
  });

  return card;
};


// Render cards

const renderCards = () => {
  gameBoard.replaceChildren();

  const cards = shuffle([...cardValues, ...cardValues]);

  cards.forEach((value, index) => {
    const card = createCard(value, index);
    gameBoard.append(card);
  });
};

renderCards();