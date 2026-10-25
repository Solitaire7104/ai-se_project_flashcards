import { decks, getDeckByID } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";

// Select the template and gallery list
const cardTemplate = document.querySelector("#card-template");
const galleryList = document.querySelector(".gallery__list");

// Track the currently selected deck to avoid duplicate listeners
let currentDeck = null;

// Practice button handlers - one for the desktop header button and one for the mobile action bar.
const practiceButtons = [
  document.querySelector("#deck-view .gallery__header .gallery__practice-btn"),
  document.querySelector(".gallery__practice-btn_mobile"),
].filter(Boolean);

practiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!currentDeck) return;
    window.location.hash = `carousel/${currentDeck.id}`;
  });
});

// Select views for routing
const homeView = document.querySelector("#home");
const deckView = document.querySelector("#deck-view");
const newDeckView = document.querySelector("#new-deck-view");
const aboutView = document.querySelector("#about-view");
const carouselView = document.querySelector("#carousel-view");
const notFoundView = document.querySelector("#not-found-view");
const mainContent = document.querySelector(".page__main-content");
const page = document.querySelector(".page");

const homeNewDeckBtn = document.querySelector("#home .gallery__new-card-btn");
if (homeNewDeckBtn) {
  homeNewDeckBtn.addEventListener("click", () => {
    window.location.hash = "new-deck-view";
  });
}

function setMobileBarState(isHidden) {
  if (!page) return;
  page.classList.toggle("page_no-mobile-bar", isHidden);
}
/**
 * Creates a deck element by cloning the template and customizing it
 * @param {Object} item - The deck object containing name, cards, and color
 * @returns {HTMLElement} - The customized deck element
 */
function createCardEl(item) {
  const cardEl = cardTemplate.content.cloneNode(true);
  const cardTitle = cardEl.querySelector(".card__title");
  const cardCount = cardEl.querySelector(".card__count");
  const cardItem = cardEl.querySelector(".card");
  const cardLink = cardEl.querySelector(".card__link");
  const deleteBtn = cardEl.querySelector(".card__delete-btn");

  // Set the card link href and click behavior to open deck view
  if (cardLink) {
    cardLink.href = `#deck/${item.id}`;
    cardLink.addEventListener("click", (e) => {
      e.preventDefault();
      currentDeck = item;
      window.location.hash = `deck/${item.id}`;
    });
  }

  // Set the card title
  cardTitle.textContent = item.name;

  // Set the card count
  cardCount.textContent = `${item.cards.length} cards`;
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // remove any color modifiers then remove the card element from the DOM
    removeColorClasses(cardItem);
    cardItem.remove();
  });

  // Add the color class
  const colorName = hexToString(item.color);
  if (colorName) {
    removeColorClasses(cardItem);
    cardItem.classList.add(`card_color_${colorName}`);
  }

  return cardEl;
}

/**
 * Renders a deck element by creating it and prepending it to the deck list
 * @param {Object} item - The deck object
 */
function renderCardEl(item) {
  const cardEl = createCardEl(item);
  galleryList.prepend(cardEl);
}

/**
 * Routes to different views based on the current hash
 */
function router() {
  const hash = window.location.hash.slice(1) || "home";

  // Hide all views before showing only the active one
  if (homeView) homeView.hidden = true;
  if (deckView) deckView.hidden = true;
  if (newDeckView) newDeckView.hidden = true;
  if (aboutView) aboutView.hidden = true;
  if (carouselView) carouselView.hidden = true;
  if (notFoundView) notFoundView.hidden = true;

  // Remove carousel modifier from main content
  if (mainContent) {
    mainContent.classList.remove("page__main-content_location_carousel");
  }
  setMobileBarState(false);

  // Show the appropriate view
  if (hash === "home") {
    if (homeView) homeView.hidden = false;
  } else if (hash === "new-deck-view") {
    if (newDeckView) newDeckView.hidden = false;
  } else if (hash.startsWith("carousel/")) {
    setMobileBarState(true);
    const deckId = hash.split("/")[1];
    const deck = getDeckByID(deckId);
    if (deck) {
      renderCarouselView(deck);
      if (carouselView) carouselView.hidden = false;
    } else {
      setMobileBarState(true);
      if (notFoundView) notFoundView.hidden = false;
    }
  } else if (hash.startsWith("deck/")) {
    const deckId = hash.split("/")[1];
    const deck = getDeckByID(deckId);
    if (deck) {
      currentDeck = deck;
      renderDeckView(deck);
      if (deckView) deckView.hidden = false;
    } else {
      setMobileBarState(true);
      if (notFoundView) notFoundView.hidden = false;
    }
  } else {
    setMobileBarState(true);
    if (notFoundView) notFoundView.hidden = false;
  }
}

// Render all decks from the array
decks.forEach(renderCardEl);

// Set up hash routing
window.addEventListener("hashchange", router);
router();
