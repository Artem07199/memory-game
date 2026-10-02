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

function shuffle(array) {
  const shuffled = [...array];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index]
    ];
  }

  return shuffled;
}

function createCard(value) {
  const card = document.createElement('button');

  card.className = 'card';
  card.type = 'button';
  card.setAttribute('aria-label', 'Закрытая карточка');

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

  return card;
}

function renderCards() {
  gameBoard.replaceChildren();

  const cards = shuffle([
    ...cardValues,
    ...cardValues
  ]);

  cards.forEach((value) => {
    const card = createCard(value);

    gameBoard.append(card);
  });
}

renderCards();