// Count how many cards are flipped
quant = 0;

// Verify if the flipped cards are equal
window.pair1 = 0;
window.pair2 = 0;

// cardNumber/Number of Cards = Count how many cards exists in game
window.cardNumber = document.getElementsByClassName("card").length;

// How many cards per row
window.rowCards = cardNumber / 4;

// How many cards are remaining
window.remainingPairs = cardNumber / 2;

// BOOLEAN - Used to start timer
window.firstClick = 0;

let pairsElement = document.getElementById("remainingPairs");
pairsElement.innerHTML = remainingPairs;

// Responsive gameboard - The gameboard are prepared to recive diferent number of cards
// Could be changed to CSS flex-box, it would exclude this part of code
let screenWidth = document.body.clientWidth; // Screen Width
let usableWidth = screenWidth * .7; // Default value for Usable Width
if (rowCards == 6) { // Gameboards have a different usableWidht each size - 70%, 80% or 90%
  let usableWidth = screenWidth * .8;
} else if (rowCards == 7) {
  let usableWidth = screenWidth * .9;
}
let itemWidth = usableWidth / (rowCards * 2);
itemWidth = Math.floor(itemWidth) - 1; // Bug fixes
let itemwidthstring = String(itemWidth) + "px";
if (rowCards == 7) {
  margin = itemWidth / 4;
} else {
  margin = itemWidth / 2;
}
margin = Math.floor(margin) - 1; // Bug fixes
let marginstring = String(margin) + "px";

let item = document.getElementsByClassName("item");
for (let i = 0; i < item.length; i++) { // Set the right margins and size
  item[i].style.width = itemwidthstring;
  item[i].style.height = itemwidthstring;
  item[i].style.marginLeft = marginstring;
  item[i].style.marginRight = marginstring;
}
// Well done :D

// Sort cards Function
function sortCards() {
  deck = document.querySelectorAll('.wrapper .item');
  deck = Array.prototype.slice.call(deck);
  for (let i = deck.length - 1; i >= 0; i--) { // Shuffle deck
    randomIndex = Math.floor(Math.random() * (i + 1)); // Pick a random index
    itemAtIndex = deck[randomIndex]; // Get the value of that random index
    deck[randomIndex] = deck[i]; // Now swipe the values of the original index with the random index
    deck[i] = itemAtIndex;
  }
  return deck;
}
window.onload = function () {
  let div = document.querySelector('.wrapper');
  let newdeck = sortCards();
  newdeck.forEach(function (p) {
    div.appendChild(p);
  });
};

// Game timer
let interval;

function timer(op) {
  if (op == 1) {
    let s = 1;
    let m = 0;
    let h = 0;
    interval = window.setInterval(function () {
      if (s == 60) {
        m++;
        s = 0;
      }
      if (m == 60) {
        h++;
        s = 0;
        m = 0;
      }
      if (h > 0) {
        document.getElementById("hours").innerHTML = h + "h &nbsp;";
        window.saveHour = h + "h &nbsp;";
      }
      if (m > 0) {
        document.getElementById("minutes").innerHTML = m + "m&nbsp;";
        window.saveMinute = m + "m &nbsp;";
      }
      if (s > 0) {
        document.getElementById("seconds").innerHTML = s + "s";
        window.saveSecond = s + "s &nbsp;";
      }
      s++;
    }, 1000);
  }
  if (op == 0) {
    if (typeof saveHour !== 'undefined') {
      window.saveTime = saveHour + saveMinute + saveSecond;
    } else if (typeof saveMinute !== 'undefined') {
      window.saveTime = saveMinute + saveSecond;
    } else if (typeof saveSecond !== 'undefined') {
      window.saveTime = saveSecond;
    } else {
      window.saveTime = "";
    }
    window.clearInterval(interval);
  }
}

// Unflip cards
function unflip() {
  for (let i = 1; i <= cardNumber; i++) {
    if (document.getElementById(i).getAttribute('class') == 'card flipped') {
      document.getElementById(i).setAttribute('class', 'card');
    }
  }
  quant = 0;
  window.pair1 = 0;
  window.pair2 = 0;
}

// When pairs are right, disable the cards
function isOk() {
  for (let i = 1; i <= cardNumber; i++) {
    if (document.getElementById(i).getAttribute('class') == 'card flipped') {
      document.getElementById(i).setAttribute('class', 'card matched');
    }
  }
  quant = 0;
  window.pair1 = 0;
  window.pair2 = 0;
  window.remainingPairs -= 1;
  let pairsElement = document.getElementById("remainingPairs");
  pairsElement.innerHTML = remainingPairs;
  // If the game has been finished
  if (remainingPairs == 0) {
    timer(0);
    youWin();
  }
  // Show de finish message
}

function youWin() {
  document.getElementById("finaltime").innerHTML = saveTime;

  setTimeout(showPopup, 1);
  let el = document.getElementById("win-block");

  function fadeIn(el) {
    el.style.opacity = 0;
    let tick = function () {
      el.style.opacity = +el.style.opacity + 0.04;
      if (+el.style.opacity < 1) {
        (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
      }
    };
    setTimeout(tick, 10);
  }
  fadeIn(el);
}

function showPopup() {
  document.getElementById("win-block").style.display = "block";
  window.winblockon = 1;
}

// Function to reset the game
function reset() {
  if (winblockon == 1) {
    function hidePopup() {
      document.getElementById("win-block").style.display = "none";
    }
  }

  sortCards();

  for (let i = 1; i <= cardNumber; i++) {
    if (document.getElementById(i).getAttribute('class') == 'card') {
      document.getElementById(i).setAttribute('class', 'card');
    }
  }
  // Reset variables
  quant = 0;
  window.pair1 = 0;
  window.pair2 = 0;
  window.firstClick = 0;
}

// Main Funcition - active when click on any card
function flip(e) {

  if (e.getAttribute('class') == 'card') {
    window.firstClick++;
    // Timer starter
    if (firstClick == 1) {
      timer(1);
    }

    if (quant < 2) {
      if (quant == 0) {
        window.pair1 = e.getAttribute('par');
      } else if (quant > 0) {
        window.pair2 = e.getAttribute('par');
      }
      e.setAttribute('class', 'card flipped');
      quant = document.getElementsByClassName("card flipped").length;
      if (quant == 2) {
        if (pair1 == pair2) {
          setTimeout(isOk, 500);
        } else if (pair1 != pair2) {
          setTimeout(unflip, 500);
        }
      }
    } else if (quant > 2) { // Bug fixed. Now, won't tilt when user click faster
      quant = 0;
    }
  }
}