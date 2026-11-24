import { decks } from "./decks.js";
import { stringToHex } from "./colors.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const form = document.querySelector("#new-deck-form");
const submitBtn = form.querySelector(".new-deck-view__submit");
const textarea = form.querySelector(".new-deck-view__textarea");
const errorModal = document.querySelector("#error-modal");
const errorModalCloseBtn = errorModal?.querySelector(".modal__close");
const errorMessage = errorModal?.querySelector(".modal__error");

errorModalCloseBtn?.addEventListener("click", () => {
    errorModal.classList.remove("modal_visible");
});

export function disableSubmitBtn() {
    submitBtn.disabled = false;
}

/**
* Converts a string to a URL-safe slug: lowercase with any run of
* non-alphanumeric characters replaced by a single hyphen, and no leading or
* trailing hyphens.
*
* @param {string} str
* @returns {string}
*/
function slugify(str) {
return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
* Returns a consistent lowercase hex color string with a leading "#".
* Accepts values with or without a leading "#". Returns "#64d583" as a
* fallback if the value is missing or not a valid 6-digit hex.
*
* @param {string|undefined} color
* @returns {string}
*/
function normalizeColor(color) {
if (!color) return "#64d583";
const hex = color.startsWith("#") ? color.slice(1) : color;
if (!HEX_DIGITS.test(hex)) return "#64d583";
return "#" + hex.toLowerCase();
}

function validateName(name) {
    if (typeof name !== "string" || name.length < 2 || name.length > 80) {
        return null;
    }
    return name;
}

function parseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        return null;
    }
}

function showError(message) {
    if (!errorModal || !errorMessage) return;
    errorMessage.textContent = message;
    errorModal.classList.add("modal_visible");
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const jsonData = parseJSON(textarea.value);

    if (jsonData === null) {
        showError("Invalid JSON. Please check the JSON syntax and try again.");
        return;
    }

    const name = validateName(jsonData.name);
    if (name === null) {
        showError("The deck name must be a string between 2 and 80 characters.");
        return;
    }

    if (!Array.isArray(jsonData.cards)) {
        showError("The cards field must be an array.");
        return;
    }

    const colorValue = data["deck-color"];
    if (typeof jsonData.color === "string") {
        if (jsonData.color.toLowerCase() !== colorValue.toLowerCase()) {
            showError("The JSON color does not match the color selected in the color picker.");
            return;
        }
    }

    const color = normalizeColor(stringToHex(colorValue));
    const id = slugify(`${name}-${Date.now()}`);

    decks.push({ id, color, name, cards: jsonData.cards });
    window.location.hash = "deck/" + id;
});

export { parseJSON, validateName, showError };