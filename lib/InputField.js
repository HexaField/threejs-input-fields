"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("./index");

class InputField {
  constructor(attributes) {
    this.id = attributes.id;
    this.value = '';
    this.inputType = '';
    this.isDirty = false;
    this.size = 10;
    this.canvasContainer = '';
    this.inputPosition = {
      x: 0,
      y: 0,
      z: 0
    };
    this.inputRealPosition = '';
    this.inputManager = '';
    this.inputElement = '';
    this.hasFocus = false;
    this.position = 'tl';
    this.orthographicView = false;
    this.inputFieldSize = 200;
    this.onBlurParameters = {
      owner: '',
      callback: '',
      parameters: ''
    };
    this.onFocusParameters = {
      owner: '',
      callback: '',
      parameters: ''
    };
    this.setInputManager(attributes.inputManager);
    this.setOrthographicView(attributes.orthographicView);
  }
  /**
   *
   * Abstract methods
   *
   */


  drawInputElement() {
    console.error("-- inputField -- There is an object that doesn't rewrites the 'drawInputElement' function");
  }

  addKeyDownValue(value) {
    console.error("-- inputField -- There is an object that doesn't rewrites the 'addKeyDownValue' function");
  }

  hasCursor() {
    console.error("-- inputField -- There is an object that doesn't rewrites the 'hasCursor' function");
    return false;
  }

  initializeInputTextCursorPosition() {
    console.error("-- inputField -- There is an object that doesn't rewrites the 'initializeInputCursorPosition' function");
  }

  inputBackspace() {
    console.error("-- inputField -- There is an object that doesn't rewrites the 'inputBackspace' function");
  }

  inputDel() {
    console.error("-- inputField -- There is an object that doesn't rewrites the 'inputDel' function");
  }

  inputCursorStart() {
    console.error("-- inputField -- There is an object that doesn't rewrites the 'inputCursorStart' function");
  }

  inputCursorEnd() {
    console.error("-- inputField -- There is an object that doesn't rewrites the 'inputCursorEnd' function");
  }

  setInputFieldSize(size) {
    console.error("-- inputField -- There is an object that doesn't rewrites the 'setInputFieldSize' function");
  }

  getInputFieldSize() {
    console.error("-- inputField -- There is an object that doesn't rewrites the 'getInputFieldSize' function");
  }
  /**
   *
   * Public methods
   *
   */


  getElement() {
    if (this.isDirty == true) {
      this.drawInputElement();
    }

    this.isDirty = false;
    return this.inputElement;
  }

  setValue(value) {
    this.value = value;

    if (this.hasCursor()) {
      this.initializeInputTextCursorPosition();
    }

    return this;
  }

  getInputType() {
    if (this.inputType == '') {
      var inputClass = typeof this;
      console.error("-- " + inputClass + " -- Doesn't have defined its input type.");
      return false;
    }

    return this.inputType;
  }

  setSize(size) {
    this.isDirty = true;
    this.size = size;
    return this;
  }

  setInputPosition(px, py, pz, position) {
    this.isDirty = true;
    this.inputPosition = {
      x: px,
      y: py,
      z: pz
    };
    this.setPosition(position);
    this.inputRealPosition = false;
    return this;
  }

  getInputPosition() {
    if (this.inputRealPosition == false) {
      this.inputRealPosition = this.calculateOfsetCoordinatesByPosition();
    }

    return this.inputRealPosition;
  }

  setCanvasContainer(canvas) {
    if (typeof canvas === 'undefined') {
      console.error('The canvas is needed');
    } else {
      this.canvasContainer = canvas;
    }

    return this;
  }

  getCanvasContainer() {
    return this.canvasContainer;
  }

  setInputManager(inputManager) {
    if (typeof inputManager === 'undefined') {
      console.error('The inputManager is needed');
    } else {
      this.inputManager = inputManager;
    }

    return this;
  }

  getInputManager() {
    return this.inputManager;
  }

  setOrthographicView(orthographicView) {
    if (typeof orthographicView === 'undefined') {
      this.orthographicView = false;
    } else {
      this.orthographicView = orthographicView;
    }

    return this;
  }

  getOrthographicView() {
    return this.orthographicView;
  }

  getIsDirty() {
    return this.isDirty;
  }

  setIsDirty(isDirty) {
    this.isDirty = isDirty;
    return this;
  }

  setInputElement(inputElement) {
    this.inputElement = inputElement;
    return this;
  }

  getInputElement() {
    return this.inputElement;
  }

  setHasFocus(value) {
    this.isDirty = true;

    if (value == true && this.hasCursor()) {
      this.getInputCursor().setVisible(true);
    }

    if (this.hasFocus == true && value == false) {
      this.triggerEvent('blur');
    } else if (this.hasFocus == false && value == true) {
      this.triggerEvent('focus');
    }

    this.hasFocus = value;
    this.drawInputElement();
    this.isDirty = false;
    return this;
  }

  getHasFocus() {
    return this.hasFocus;
  }

  setPosition(position) {
    if (this.orthographicView) {
      var inputManager = this.getInputManager();
      var positionExists = position === _index.POSITIONS.POSITION_TOP_LEFT;
      positionExists = positionExists || position === _index.POSITIONS.POSITION_TOP_RIGHT;
      positionExists = positionExists || position === _index.POSITIONS.POSITION_BOTTOM_LEFT;
      positionExists = positionExists || position === _index.POSITIONS.POSITION_BOTTOM_RIGHT;
      positionExists = positionExists || position === _index.POSITIONS.POSITION_CENTER;
      positionExists = positionExists || position === _index.POSITIONS.POSITION_TOP_CENTER;
      positionExists = positionExists || position === _index.POSITIONS.POSITION_RIGHT_CENTER;
      positionExists = positionExists || position === _index.POSITIONS.POSITION_BOTTOM_CENTER;
      positionExists = positionExists || position === _index.POSITIONS.POSITION_LEFT_CENTER;

      if (!positionExists) {
        console.error('The given position for the input field does not exists.');
      } else {
        this.position = position;
      }
    }

    return this;
  }

  getPosition() {
    return this.position;
  }

  getCanvasWidth() {
    return this.getInputManager().getCanvasWidth();
  }

  getCanvasHeight() {
    return this.getInputManager().getCanvasHeight();
  }
  /**
   * Calculate the input displacement to set it on the correct position desired by the corners and center position
   *
   * @returns { x, y, z }
   */


  calculateOfsetCoordinatesByPosition() {
    var offset = {
      x: this.inputPosition.x,
      y: this.inputPosition.y,
      z: this.inputPosition.z
    };

    if (this.orthographicView) {
      var inputManager = this.getInputManager();
      var offsetXDirection = 1;
      var offsetYDirection = 1;

      if (this.position == _index.POSITIONS.POSITION_BOTTOM_RIGHT || this.position == _index.POSITIONS.POSITION_TOP_RIGHT || this.position == _index.POSITIONS.POSITION_RIGHT_CENTER) {
        offsetXDirection = -1;
      }

      if (this.position == _index.POSITIONS.POSITION_BOTTOM_LEFT || this.position == _index.POSITIONS.POSITION_BOTTOM_RIGHT || this.position == _index.POSITIONS.POSITION_BOTTOM_CENTER) {
        offsetYDirection = -1;
      }

      if (this.position == _index.POSITIONS.POSITION_TOP_LEFT || this.position == _index.POSITIONS.POSITION_TOP_RIGHT || this.position == _index.POSITIONS.POSITION_TOP_CENTER) {
        // Invert the position on the Y coordinates to draw the input on a consistent way
        offset.y = offset.y * -1;
        offset.y = offsetYDirection * offset.y + (this.getCanvasHeight() - this.canvas.height / 2);
      }

      if (this.position == _index.POSITIONS.POSITION_BOTTOM_LEFT || this.position == _index.POSITIONS.POSITION_BOTTOM_RIGHT || this.position == _index.POSITIONS.POSITION_BOTTOM_CENTER) {
        offset.y = offsetYDirection * offset.y + this.canvas.height / 2;
      }

      if (this.position == _index.POSITIONS.POSITION_TOP_LEFT || this.position == _index.POSITIONS.POSITION_BOTTOM_LEFT || this.position == _index.POSITIONS.POSITION_LEFT_CENTER) {
        offset.x = offsetXDirection * offset.x + this.canvas.width / 2;
      }

      if (this.position == _index.POSITIONS.POSITION_TOP_RIGHT || this.position == _index.POSITIONS.POSITION_BOTTOM_RIGHT || this.position == _index.POSITIONS.POSITION_RIGHT_CENTER) {
        // Invert the position on the X coordinates to draw the input on a consistent way
        offset.x = offset.x * -1;
        offset.x = offsetXDirection * offset.x + (this.getCanvasWidth() - this.canvas.width / 2);
      }

      if (this.position == _index.POSITIONS.POSITION_CENTER) {
        offset.x += this.getCanvasWidth() * 0.5;
        offset.y += this.getCanvasHeight() * 0.5;
      }

      if (this.position == _index.POSITIONS.POSITION_TOP_CENTER || this.position == _index.POSITIONS.POSITION_BOTTOM_CENTER) {
        offset.x += this.getCanvasWidth() * 0.5;
      }

      if (this.position == _index.POSITIONS.POSITION_RIGHT_CENTER || this.position == _index.POSITIONS.POSITION_LEFT_CENTER) {
        offset.y += this.getCanvasHeight() * 0.5;
      }
    }

    return offset;
  }

  onWindowResizeUpdatePosition() {
    this.inputRealPosition = false;
    var position = this.getInputPosition();
    var element = this.getElement();
    element.position.set(position.x, position.y, position.z);
  }

  onBlur(callback, parameters) {
    if (typeof callback !== 'function' || typeof parameters === 'undefined') {
      console.error('The onBlur parameters must be declared');
    } else {
      var parameters = {
        owner: this,
        callback: callback,
        parameters: parameters
      };
      this.onBlurParameters = parameters;
    }

    return this;
  }

  onFocus(callback, parameters) {
    if (typeof callback !== 'function' || typeof parameters === 'undefined') {
      console.error('The onFocus parameters must be declared');
    } else {
      var parameters = {
        owner: this,
        callback: callback,
        parameters: parameters
      };
      this.onFocusParameters = parameters;
    }

    return this;
  }

  triggerEvent(event) {
    switch (event.toLowerCase()) {
      case 'blur':
        if (typeof this.onBlurParameters.callback == 'function') this.onBlurParameters.callback({
          object: this.onBlurParameters.owner,
          parameters: this.onBlurParameters.parameters
        });
        break;

      case 'focus':
        if (typeof this.onFocusParameters.callback == 'function') this.onFocusParameters.callback({
          object: this.onFocusParameters.owner,
          parameters: this.onFocusParameters.parameters
        });
        break;

      default:
        console.error('The event:"' + event + '" does not exists.');
        break;
    }
  }

}

exports.default = InputField;