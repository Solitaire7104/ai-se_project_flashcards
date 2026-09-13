import { hexToString, removeColorClasses } from "./colors.js";

/**
 * Generates a carousel title string showing current position
 * @param {number} currentIndex - The current card index
 * @param {number} total - The total number of cards
 * @returns {string} - The formatted title string
 */
function getCarouselTitleString(currentIndex, total) {
  return `Lesson ${currentIndex + 1} of ${total}`;
}

/**
 * Renders the carousel view for a selected deck
 * @param {Object} deck - The deck object to display
 */
export function renderCarouselView(deck) {
  const carouselView = document.querySelector("#carousel-view");

  const carouselTitleDeck = document.querySelector(".carousel__title-deck");
  const carouselTitleCount = document.querySelector(".carousel__title-count");
  const carouselCard = document.querySelector(".carousel__card");
  const carouselCardText = document.querySelector(".carousel__card-text");
  const flipBtn = document.querySelector(".carousel__btn_type_flip");
  const leftBtn = document.querySelector(".carousel__btn_type_left");
  const rightBtn = document.querySelector(".carousel__btn_type_right");

  let currentIndex = 0;
  let showingQuestion = true;
  // Add carousel modifier to main content
  const mainContent = document.querySelector(".page__main-content");
  mainContent.classList.add("page__main-content_location_carousel");

  /**
   * Updates the carousel display with current card
   */
  function updateDisplay() {
    const currentCard = deck.cards[currentIndex];

    // Handle card color and text based on flipped state
    removeColorClasses(carouselCard);

    if (showingQuestion) {
      carouselCardText.textContent = currentCard.question;
      const colorName = hexToString(deck.color);
      if (colorName) {
        carouselCard.classList.add(`carousel__card_color_${colorName}`);
      }
    } else {
      carouselCardText.textContent = currentCard.answer;
      carouselCard.classList.add("carousel__card_color_white");
    }

    // Set deck name and lesson count
    carouselTitleDeck.textContent = deck.name;
    carouselTitleCount.textContent = getCarouselTitleString(
      currentIndex,
      deck.cards.length,
    );
  }

  /**
   * Navigate to the next card
   */
  function nextCard() {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex++;
      showingQuestion = true;
      updateDisplay();
    }
  }

  /**
   * Navigate to the previous card
   */
  function prevCard() {
    if (currentIndex > 0) {
      currentIndex--;
      showingQuestion = true;
      updateDisplay();
    }
  }

  /**
   * Flip the card
   */
  function flipCard() {
    showingQuestion = !showingQuestion;
    updateDisplay();
  }

  // Set up event listeners
  rightBtn.addEventListener("click", nextCard);
  leftBtn.addEventListener("click", prevCard);
  flipBtn.addEventListener("click", flipCard);

  // Initial display
  updateDisplay();
}
