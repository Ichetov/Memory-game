

const cards = [
    {pairId:1,
     img: "./image/1.png",
       isOpen: false,
  isMatched: false,
    },
      {pairId:2,
    img: "./image/2.png",
       isOpen: false,
  isMatched: false,
    },
      {pairId:3,
     img: "./image/3.png",
       isOpen: false,
  isMatched: false,
    },
        {pairId:4,
    img: "./image/4.png",
       isOpen: false,
  isMatched: false,
    },
        {pairId:5,
     img: "./image/5.png",
       isOpen: false,
  isMatched: false,
    },
        {pairId:6,
     img: "./image/6.png",
       isOpen: false,
  isMatched: false,
    },
        {pairId:7,
     img: "./image/7.png",
       isOpen: false,
  isMatched: false,
    },
        {pairId:8,
      img: "./image/8.png",
       isOpen: false,
  isMatched: false,
    }
]



let body = document.querySelector("body");

const wraper = document.createElement("div");
wraper.classList.add("wraper");

const header = document.createElement("header")

header.classList.add("header")

header.prepend(wraper);

body.append(header)

const newGameButton = document.createElement("button");
newGameButton.classList.add("button", "header__button--new");
newGameButton.type = "button"
newGameButton.innerText = "Новая игра"

const leaderBoardButton = document.createElement("button");
leaderBoardButton.classList.add("button", "header__button--leader");
leaderBoardButton.type = "button"
leaderBoardButton.innerText = "Таблица лидеров"

let couter = document.createElement("div");
couter.classList.add("header__couter")

let pairsTitle = document.createElement("span")
pairsTitle.innerText = "Количество пар:"
let pairsCounter = document.createElement("span")

let movesTitle= document.createElement("span")
movesTitle.innerText = "Количество ходов:"
let movesCounter = document.createElement("span")

couter.append(pairsTitle.innerText, pairsCounter, movesTitle, movesCounter);




const wrapperHeader = document.createElement("div")
wrapperHeader.classList.add("header__wraper");
wrapperHeader.append(newGameButton, leaderBoardButton, couter);

wraper.append(wrapperHeader)

const main = document.createElement("main")

body.append(main)

const gameSection = document.createElement("section");
gameSection.classList.add("memory");

const gameWraper = document.createElement("div");
gameWraper.classList.add("wraper")

main.append(gameWraper)
gameWraper.append(gameSection);

const grid = document.createElement("div");
grid.classList.add("memory__grid");


gameSection.append(grid);

let modal = document.createElement("div");
modal.hidden = true;
modal.classList.add("modal");

let modalBackdrop = document.createElement("div");
modalBackdrop.classList.add("modal__backdrop");

modal.append(modalBackdrop);

let modalContent = document.createElement("div");
modalContent.classList.add("modal__content");

modal.append(modalContent)

body.append(modal)



let buttonClosedModal = document.createElement("button");
buttonClosedModal.classList.add("button")
buttonClosedModal.dataset.id = 'button-close';
buttonClosedModal.innerText = "Закрыть"

let buttonNewGameModal = document.createElement("button")
buttonNewGameModal.classList.add("button")
buttonNewGameModal.dataset.id = "button-new";
buttonNewGameModal.innerText = "Новая игра"

let titleModal = document.createElement('h2')
titleModal.classList.add('modal__title')
titleModal.innerText = "Вы победили!"

let movesModal = document.createElement("p");
movesModal.classList.add("modal__moves")


let gridModal = document.createElement("div")
gridModal.classList.add("modal__grid")



const gameCards = [];
let firstCardId = null;
let secondCardId = null;

let moves = 0;
let matchedPairs = 0;

let isLocked = false;
let closeTimer = null;

function setCounter() {
  pairsCounter.textContent = `${matchedPairs} из 8`;
  movesCounter.textContent = moves;
}

setCounter()

function startNewGame() {
      clearTimeout(closeTimer);
      closeTimer = null;
       firstCardId = null;
       secondCardId = null;
         moves = 0;
         matchedPairs = 0;
         isLocked = false;
        gameCards.forEach((card) => {
           card.isOpen = false;
           card.isMatched = false;
      });
       setCounter()
       shuffle(gameCards)
       grid.replaceChildren();
       renderGrid();
    //    renderCounters();
}

newGameButton.addEventListener("click", startNewGame)


function createLeadersTable(){
    if (!localStorage.getItem("leaders")) {
    localStorage.setItem(
      "leaders",
      JSON.stringify([])
    );
  }
}
createLeadersTable();


function closedCards(){
     gameCards.forEach(it=>{
        closeCard(it)
     })
}

function createCards(cards){
   cards.forEach((it, index)=>{
    gameCards.push({
        ...it,
        id: `${it.pairId}-a`
    })  
   })
      cards.forEach((it, index)=>{
    gameCards.push({
        ...it,
        id: `${it.pairId}-b`
    })  
   })

   shuffle(gameCards)
}

createCards(cards)


function shuffle(array) {
  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] =
      [array[j], array[i]];
  }
}


function renderGrid(){
    gameCards.forEach(it=>{

let gridItem = document.createElement("button");
gridItem.type = "button"
gridItem.dataset.id = it.id;
gridItem.classList.add("grid__item");

let gridInner = document.createElement("div")
gridInner.classList.add("grid__inner")

let imageGridFront = document.createElement("img");
imageGridFront.classList.add("grid__front");
imageGridFront.src = "./image/front.png"

let imageGridBack = document.createElement("img");
imageGridBack.classList.add("grid__back");
imageGridBack.src = it.img

gridInner.append(imageGridFront);
gridInner.append(imageGridBack)
gridItem.append(gridInner)
grid.append(gridItem)

    })
}

renderGrid()

grid.addEventListener("click", (e)=>{
    const cardElement = e.target.closest(".grid__item");
    console.log(cardElement)
      if (!cardElement) return;
const id = cardElement.dataset.id;

handleCardClick(id);
})


function handleCardClick(id) {
  if (isLocked) return;
  const card =
    gameCards.find((card) => card.id === id);
  if (card.isOpen) return;
  if (card.isMatched) return;

  openCard(card);

  if (firstCardId === null) {
    firstCardId = id;
    return;
  }

  secondCardId = id;
  moves++;
   setCounter();
  checkPair();
}


function openCard(card) {
  card.isOpen = true;

  const element =
    document.querySelector(
      `[data-id="${card.id}"]`
    );
  element.classList.add(
    'grid__item--open'
  );
}

function checkPair() {
  const firstCard =
    gameCards.find(
      (card) => card.id === firstCardId
    );

  const secondCard =
    gameCards.find(
      (card) => card.id === secondCardId
    );

  if (
    firstCard.pairId ===
    secondCard.pairId
  ) {
    handleMatch(
      firstCard,
      secondCard
    );
  } else {
    handleMismatch(
      firstCard,
      secondCard
    );
  }
}

function handleMismatch(
  firstCard,
  secondCard
) {
  isLocked = true;
  closeTimer = setTimeout(() => {
    closeCard(firstCard);
    closeCard(secondCard);

    resetSelection();

    isLocked = false;
    closeTimer = null;

  }, 1000);
}

function handleMatch(
  firstCard,
  secondCard
) {
  firstCard.isMatched = true;
  secondCard.isMatched = true;

  matchedPairs++;
  setCounter()
  resetSelection();
   console.log(matchedPairs)
  if (matchedPairs === 8) {
    finishGame();
  }
}


function closeCard(card) {
  card.isOpen = false;

  const element =
    document.querySelector(
      `[data-id="${card.id}"]`
    );
  console.log(element)
  element.classList.remove(
    'grid__item--open'
  );
}


function resetSelection() {
  firstCardId = null;
  secondCardId = null;
}


function finishGame() {
  saveLeader();
  openModal("victory");
}

function saveLeader() {
  const leadersArray =
    JSON.parse(localStorage.getItem("leaders")) || [];

  leadersArray.push({
    moves: moves,
    date: new Date().toLocaleDateString('ru-RU'),
    timestamp: Date.now()
  });

  leadersArray.sort((a, b) => {
    if (a.moves !== b.moves) {
      return a.moves - b.moves;
    }

    return a.timestamp - b.timestamp;
  });

  const bestLeaders = leadersArray.slice(0, 10);

  localStorage.setItem(
    "leaders",
    JSON.stringify(bestLeaders)
  );
}


function lockPageScroll() {
  document.body.classList.add('no-scroll');
  document.documentElement.classList.add('no-scroll');
}

function unlockPageScroll() {
  document.body.classList.remove('no-scroll');
  document.documentElement.classList.remove('no-scroll');
}


function openModal(type) {
  modalContent.replaceChildren();

  renderModalContent(type);

  modal.hidden = false;
  lockPageScroll();
}

function closeModal() {
  modal.hidden = true;
  unlockPageScroll();
}


function renderModalContent(type) {
  if (type === "victory") {
    titleModal.textContent = "Вы победили!";

    movesModal.textContent =
      `Ваше число ходов: ${moves}`;

    modalContent.append(
      titleModal,
      movesModal,
      buttonNewGameModal,
      buttonClosedModal
    );
    
    return;
  }

  if (type === "leaders") {
    renderLeadersModal();
  }
}


function renderLeadersModal() {
  const leadersArray = JSON.parse(localStorage.getItem("leaders")) || [];

  gridModal.replaceChildren();

  if (leadersArray.length === 0) {
    const message = document.createElement("p");
    message.classList.add("modal__empty");
    message.textContent = "Пока нет результатов";

    modalContent.append(
      message,
      buttonClosedModal
    );

    return;
  }

    const title = document.createElement("h2");
     title.innerText = "Таблица лидеров"

  const wrapper = document.createElement("div");
  wrapper.classList.add("modal__wrapper")



  wrapper.append(title)
  const tibleTitle = document.createElement("div")
  tibleTitle.classList.add("modal__table-title")
  let namePlace = document.createElement("span")
  namePlace.innerText = "Место"
  let nameCount = document.createElement("span")
  nameCount.classList.add("modal__count")
  nameCount.innerText = "Ходы"
  let nameDate = document.createElement("span")
  nameDate.innerText = "Дата"
  nameDate.classList.add("modal__date")
  tibleTitle.append(namePlace, nameCount, nameDate)
wrapper.append(tibleTitle)
  leadersArray.forEach((it, index) => {
    const gridItem =
      document.createElement("div");

    gridItem.classList.add("modal__grid-item");

    const place =
      document.createElement("span");

    place.textContent = index + 1;
    place.classList.add("modal__item")
    const count =
      document.createElement("span");

    count.textContent = it.moves;
    count.classList.add("modal__item")
    const date =
      document.createElement("span");

    date.textContent = it.date;
    date.classList.add("modal__item")
    gridItem.append(
      place,
      count,
      date
    );
     wrapper.append(gridItem)

  });
    gridModal.append(wrapper);
  modalContent.append(
    gridModal,
    buttonClosedModal
  );
}

buttonNewGameModal.addEventListener(
  "click",
  () => {
    closeModal();
    startNewGame();
  }
);

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    !modal.hidden
  ) {
    closeModal();
  }
});

modalBackdrop.addEventListener("click", () => {
  closeModal();
});


buttonClosedModal.addEventListener(
  "click",
  closeModal
);

leaderBoardButton.addEventListener("click", ()=>{
    openModal("leaders");
})