import { decks, getDeckByID } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

// Select the template and deck list
const deckTemplate = document.querySelector("#deck-template");
const deckList = document.querySelector(".decks__list");

// Select views for routing
const homeView = document.querySelector("#home-view");
const carouselView = document.querySelector("#carousel-view");
const notFoundView = document.querySelector("#not-found-view");
const mainContent = document.querySelector(".page__main-content");
/**
 * Creates a deck element by cloning the template and customizing it
 * @param {Object} item - The deck object containing name, cards, and color
 * @returns {HTMLElement} - The customized deck element
 */
function createDeckEl(item) {
  const deckEl = deckTemplate.content.cloneNode(true);
  const deckTitle = deckEl.querySelector(".deck__title");
  const deckCount = deckEl.querySelector(".deck__count");
  const deckItem = deckEl.querySelector(".deck");
  const deckLink = deckEl.querySelector(".deck__link");
  const deleteBtn = deckEl.querySelector(".deck__delete-btn");

  // Set the deck link href
  deckLink.href = `#carousel/${item.id}`;

  // Set the deck title
  deckTitle.textContent = item.name;

  // Set the deck count
  deckCount.textContent = `${item.cards.length} cards`;
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // remove any color modifiers then remove the deck element from the DOM
    removeColorClasses(deckItem);
    deckItem.remove();
  });

  // Add the color class
  const colorName = hexToString(item.color);
  if (colorName) {
    removeColorClasses(deckItem);
    deckItem.classList.add(`deck_color_${colorName}`);
  }

  return deckEl;
}

/**
 * Renders a deck element by creating it and prepending it to the deck list
 * @param {Object} item - The deck object
 */
function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  deckList.prepend(deckEl);
}

/**
 * Routes to different views based on the current hash
 */
function router() {
  const hash = window.location.hash.slice(1) || "home";

  // Hide all views (use `.hidden` consistently)
  homeView.hidden = true;
  carouselView.hidden = true;
  notFoundView.hidden = true;
  // Remove carousel modifier from main content
  mainContent.classList.remove("page__main-content_location_carousel");

  // Show the appropriate view
  if (hash === "home") {
    homeView.hidden = false;
  } else if (hash.startsWith("carousel/")) {
    // Extract the deck ID from the URL
    const deckId = hash.split("/")[1];
    // Get the deck by ID
    const deck = getDeckByID(deckId);
    if (deck) {
      // Render the carousel view with the deck
      renderCarouselView(deck);
      carouselView.hidden = false;
    } else {
      notFoundView.hidden = false;
    }
  } else {
    notFoundView.hidden = false;
  }
}

// Render all decks from the array
decks.forEach(renderDeckEl);

// Set up hash routing
window.addEventListener("hashchange", router);
router();
