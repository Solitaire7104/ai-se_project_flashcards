const deckView = document.querySelector("#deck-view");
const flashcardTemplate = document.querySelector("#flashcard-template");
const deckList = deckView.querySelector(".gallery__list");
const deckTitle = deckView.querySelector(".gallery__title");

/**
 * Render the deck view for a given deck object.
 * Populates the deck title and the list of flashcards.
 * @param {Object} deck
 */
export function renderDeckView(deck) {
  if (!deck) return;

  const page = document.querySelector(".page");
  if (page) {
    page.classList.remove("page_no-mobile-bar");
  }

  const backBtn = document.querySelector(".gallery__back-btn");
  if (backBtn) {
    backBtn.addEventListener(
      "click",
      () => {
        window.location.hash = "home";
      },
      { once: true },
    );
  }

  // Set current title
  deckTitle.textContent = deck.name || "";

  // Clear existing list
  deckList.innerHTML = "";

  // Populate flashcards
  (deck.cards || []).forEach((card, idx) => {
    const node = flashcardTemplate.content.cloneNode(true);
    const titleEl = node.querySelector(".card__title");
    const openBtn = node.querySelector(".card__open-btn");
    const deleteBtn = node.querySelector(".card__delete-btn");
    const listItem = node.querySelector(".card");

    import { hexToString, removeColorClasses } from "./colors.js";
    let showingQuestion = true;

    function renderSide() {
      removeColorClasses(listItem);
      if (showingQuestion) {
        titleEl.textContent = card.question || `Card ${idx + 1}`;
        listItem.classList.add(`card_color_${DeckColorName}`);
      } else {
        titleEl.textContent = card.answer;
        listItem.classList.add("card_color_white");
      }
    }

    renderSide();

    openBtn.addEventListener("click", () => {
      showingQuestion = !showingQuestion;
      renderSide();
    });

    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      listItem.remove();
    });

    deckList.appendChild(node);
  });
}
