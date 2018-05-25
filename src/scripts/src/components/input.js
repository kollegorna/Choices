import { calcWidthOfInput } from '../lib/utils';

export default class Input {
  constructor({ element, type, classNames, placeholderValue }) {
    Object.assign(this, { element, type, classNames, placeholderValue });

    this.element = element;
    this.classNames = classNames;
    this.isFocussed = this.element === document.activeElement;
    this.isDisabled = false;

    // Bind event listeners
    this._onPaste = this._onPaste.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  set placeholder(placeholder) {
    this.element.placeholder = placeholder;
  }

  set value(value) {
    this.element.value = value;
  }

  get value() {
    return this.element.value;
  }

  addEventListeners() {
    this.element.addEventListener('input', this._onInput);
    this.element.addEventListener('paste', this._onPaste);
    this.element.addEventListener('focus', this._onFocus);
    this.element.addEventListener('blur', this._onBlur);
  }

  removeEventListeners() {
    this.element.removeEventListener('input', this._onInput);
    this.element.removeEventListener('paste', this._onPaste);
    this.element.removeEventListener('focus', this._onFocus);
    this.element.removeEventListener('blur', this._onBlur);
  }

  enable() {
    this.element.removeAttribute('disabled');
    this.isDisabled = false;
  }

  disable() {
    this.element.setAttribute('disabled', '');
    this.isDisabled = true;
  }

  focus() {
    if (!this.isFocussed) {
      this.element.focus();
    }
  }

  blur() {
    if (this.isFocussed) {
      this.element.blur();
    }
  }

  /**
   * Set value of input to blank
   * @return {Object} Class instance
   * @public
   */
  clear(setWidth = true) {
    if (this.element.value) {
      this.element.value = '';
    }

    if (setWidth) {
      this.setWidth();
    }

    return this;
  }

  /**
   * Set the correct input width based on placeholder
   * value or input value
   * @return
   */
  setWidth(enforceWidth) {
    if (this._placeholderValue) {
      // If there is a placeholder, we only want to set the width of the input when it is a greater
      // length than 75% of the placeholder. This stops the input jumping around.
      if (
        (this.element.value &&
        this.element.value.length >= (this._placeholderValue.length / 1.25)) ||
        enforceWidth
      ) {
        this.element.style.width = this.calcWidth();
      }
    } else {
      // If there is no placeholder, resize input to contents
      this.element.style.width = this.calcWidth();
    }
  }

  calcWidth() {
    return calcWidthOfInput(this.element);
  }

  setActiveDescendant(activeDescendantID) {
    this.element.setAttribute('aria-activedescendant', activeDescendantID);
  }

  removeActiveDescendant() {
    this.element.removeAttribute('aria-activedescendant');
  }

  /**
   * Input event
   * @return
   * @private
   */
  _onInput() {
    if (this.type !== 'select-one') {
      this.setWidth();
    }
  }

  /**
   * Paste event
   * @param  {Object} e Event
   * @return
   * @private
   */
  _onPaste(e) {
    // Disable pasting into the input if option has been set
    if (e.target === this.element && this.preventPaste) {
      e.preventDefault();
    }
  }

  _onFocus() {
    this.isFocussed = true;
  }

  _onBlur() {
    this.isFocussed = false;
  }
}
