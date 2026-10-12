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

    titleEl.textContent = card.front || card.text || `Card ${idx + 1}`;

    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Open the carousel for this deck (carousel shows first card by default)
      window.location.hash = `carousel/${deck.id}`;
    });

    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      listItem.remove();
    });

    deckList.appendChild(node);
  });
}
