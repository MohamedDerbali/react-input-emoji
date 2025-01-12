// @ts-check

export const TRANSPARENT_GIF =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 * Replace all text with emoji with an image html tag
 * @param {string} text
 * @return {string}
 */
export function replaceAllTextEmojis(text) {
  let allEmojis = getAllEmojisFromText(text);
  const allEmojiStyle = getAllEmojiStyle();

  if (allEmojis) {
    allEmojis = [...new Set(allEmojis)]; // remove duplicates

    allEmojis.forEach(emoji => {
      const style = allEmojiStyle[emoji];

      if (!style) return;

      text = replaceAll(
        text,
        emoji,
        `<img
            style="${style}"
            data-emoji="${emoji}"
            src="${TRANSPARENT_GIF}"
          />`
      );
    });
  }

  return text;
}

/**
 * Replace all occurrencies in a string
 * @param {string} str
 * @param {string} find
 * @param {string} replace
 * @return {string}
 */
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}

/**
 * Get all emojis from the text
 * @param {string} text
 * @return {string[]}
 */
function getAllEmojisFromText(text) {
  return text.match(
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g
  );
}

/**
 * Get all emoji stlye from emoji mart
 * @return {Object.<string, string>}
 */
function getAllEmojiStyle() {
  /** @type {NodeListOf<Element>} */
  const allEmojiButton = Array.prototype.slice.call(
    document.querySelectorAll(".emoji-mart-category-list > li > button")
  );

  /** @type {Object.<string, string>} */
  const allEmojiStyle = {};

  allEmojiButton.forEach(emojiButton => {
    const label = emojiButton.getAttribute("aria-label");
    const [emoji] = label.split(",");

    const emojiSpanEl = emojiButton.querySelector("span");

    const style = replaceAll(emojiSpanEl.style.cssText, '"', "'");

    allEmojiStyle[emoji] = style;
  });

  return allEmojiStyle;
}

/**
 * Replace all img emoji to string
 * @param {HTMLDivElement} inputEl
 * @param {React.MutableRefObject<string>} cleanedTextRef
 * @param {HTMLDivElement} placeholderEl
 * @param {function(): void} emitChange
 */
export function replaceAllTextEmojiToString(
  inputEl,
  cleanedTextRef,
  placeholderEl,
  emitChange
) {
  if (!inputEl) {
    cleanedTextRef.current = "";
  }

  const container = document.createElement("div");
  container.innerHTML = inputEl.innerHTML;

  const images = Array.prototype.slice.call(container.querySelectorAll("img"));

  images.forEach(image => {
    image.outerHTML = image.dataset.emoji;
  });

  let text = container.innerText;

  // remove all ↵ for safari
  text = text.replace(/\n/gi, "");

  cleanedTextRef.current = text;

  emitChange();
}
