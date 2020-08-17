"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var THREE = _interopRequireWildcard(require("three"));

var _InputField = _interopRequireDefault(require("./InputField"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class InputText extends _InputField.default {
  constructor(attributes) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(attributes, params);
    this.fontSize = 18;
    this.fontFamily = 'Arial';
    this.fontColor = {
      r: 0,
      g: 0,
      b: 0,
      a: 1.0
    };
    this.spriteAlignment = '', //THREE.SpriteAlignment.topLeft,
    this.borderSize = 1, this.borderColor = {
      r: 0,
      g: 0,
      b: 0,
      a: 1.0
    };
    this.backgroundColor = {
      r: 255,
      g: 255,
      b: 255,
      a: 1.0
    };
    this.borderRadius = 6;
    this.borderColorReadOnly = {
      r: 153,
      g: 153,
      b: 153,
      a: 1.0
    };
    this.fontColorReadOnly = {
      r: 102,
      g: 102,
      b: 102,
      a: 1.0
    };
    this.textIndex = 0;
    this.currentMessageWidth = 0;
    this.cursorPosition = 0;
    this.cursorTextPosition = 0; // To know where the text is as an offset of the input field position

    this.inputTextPosition = {
      x: 0,
      y: 0,
      z: 0
    };
    this.inputTextBorderOffset = 2;
    this.inputTextBorderOffsetFactor = 2;
    this.context = '';
    this.canvas = '';
    this.inputCanvasId = '';
    this.inside3DSpaceCollisionDetector = '';
    this.readOnly = false;
    this.inputType = 'text';
    this.getInputCursor().setCursorPosition(0);
    this.setInputTextPosition(0, 0, 0);
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    this.context = context;
    this.canvas = canvas;
  }
  /**
   *
   * Getters and Setters
   *
   */


  setFontSize(size) {
    if (isNaN(size)) {
      console.error("-- inputField:setFontSize -- The size must be a number");
      return false;
    }

    this.fontSize = size;
    return this;
  }

  getFontSize() {
    return this.fontSize;
  }

  setFontFamily(value) {
    this.fontFamily = value;
    return this;
  }

  getFontFamily() {
    return this.fontFamily;
  }

  setSpriteAlignment(alignemt) {
    this.spriteAlignment = alignemt;
    return this;
  }

  setFontColor(red, green, blue, alpha) {
    this.fontColor = {
      r: red,
      g: green,
      b: blue,
      a: alpha
    };
    return this;
  }

  getFontColor() {
    return this.fontColor;
  }

  getSpriteAlignment() {
    return this.spriteAlignment;
  }

  setBorderSize(size) {
    if (isNaN(size)) {
      console.error("-- inputField:setBorderSize -- The size must be a number");
      return false;
    }

    this.borderSize = size;
    this.resetBorderOffset();
    return this;
  }

  getBorderSize() {
    return this.borderSize;
  }

  setBackgroundColor(red, green, blue, alpha) {
    this.backgroundColor = {
      r: red,
      g: green,
      b: blue,
      a: alpha
    };
    return this;
  }

  getBackgroundColor() {
    return this.backgroundColor;
  }

  setBorderRadius(radius) {
    this.borderRadius = radius;
    return this;
  }

  getBorderRadius() {
    return this.borderRadius;
  }

  setInputFieldSize(size) {
    this.inputFieldSize = size;
    return this;
  }

  getInputFieldSize() {
    return this.inputFieldSize;
  }

  setInputTextBorderOffsetFactor(factor) {
    this.inputTextBorderOffsetFactor = factor;
    return this;
  }

  getInputTextBorderOffsetFactor() {
    return this.inputTextBorderOffsetFactor;
  }

  resetBorderOffset() {
    this.inputTextBorderOffset = this.getBorderSize() * this.getInputTextBorderOffsetFactor();
    return this;
  }

  getBorderOffset() {
    return this.inputTextBorderOffset;
  }

  setCursorPosition(cursorPosition) {
    this.cursorPosition = cursorPosition;
    return this;
  }

  setCursorTextPosition(cursorTextPosition) {
    this.cursorTextPosition = cursorTextPosition;
    return this;
  }

  getInputCursorPositionXCoordinate(position, message) {
    var tmpMessage = message.substring(0, position);
    var position_x = this.context.measureText(tmpMessage).width + this.getInputTextPosition().x + this.getInputPosition().x;
    return position_x;
  }

  getCursorTextPosition() {
    return this.cursorTextPosition;
  }

  getCursorPosition() {
    return this.cursorPosition;
  }

  setInputTextPosition(xp, yp, zp) {
    this.inputTextPosition = {
      x: xp,
      y: yp,
      z: zp
    };
    return this;
  }

  setInputTextPositionX(xp) {
    this.inputTextPosition.x = xp;
    return this;
  }

  setInputTextPositionY(yp) {
    this.inputTextPosition.y = yp;
    return this;
  }

  setInputTextPositionZ(zp) {
    this.inputTextPosition.z = zp;
    return this;
  }

  getInputTextPosition() {
    var inputTextPosition = {
      x: 0,
      y: 0,
      z: 0
    };
    inputTextPosition.x = this.inputTextPosition.x + this.getBorderOffset();
    inputTextPosition.y = this.inputTextPosition.y + this.getBorderOffset();
    inputTextPosition.z = this.inputTextPosition.z;
    return inputTextPosition;
  }

  getInputValue() {
    return this.value;
  }

  setValue(value) {
    this.isDirty = true;
    this.value = value;
    this.cursorTextPosition = value.length;
    this.initializeInputTextCursorPosition();
    return this;
  }

  getInputCursor() {
    return this.getInputManager().getInputCursor();
  }

  setReadOnly(readOnly) {
    this.readOnly = readOnly;
    return this;
  }

  getReadOnly() {
    return this.readOnly;
  }
  /**
   *
   * Abstract methods
   *
   */


  drawInputElement() {
    var inputElement = this.makeTextSprite(this.value);

    if (inputElement !== false) {
      // inputElement.id = this.id;
      this.inputElement = inputElement;
    }

    this.isDirty = false;
  }

  addKeyDownValue(value) {
    if (!this.getReadOnly()) {
      this.isDirty = true;

      if (this.getCursorTextPosition() != this.getInputValue().length) {
        this.value = this.value.substring(0, this.getCursorTextPosition()) + value + this.value.substring(this.getCursorTextPosition(), this.getInputValue().length);
      } else {
        this.value += value;
      }

      this.incCursorTextPosition();
    }

    return this;
  }

  hasCursor() {
    return true;
  }

  initializeInputTextCursorPosition() {
    this.getInputCursorPositionXCoordinate(this.cursorTextPosition, this.value);
  }

  inputBackspace() {
    if (!this.getReadOnly()) {
      var value = this.getInputValue();
      var message = value.substring(0, this.getCursorTextPosition() - 1);
      message += value.substring(this.getCursorTextPosition(), this.getCursorTextPosition().length);
      this.value = message;
      this.cursorTextPosition--;
      this.isDirty = true;
      this.makeTextSprite();
      this.isDirty = false;
    }
  }

  inputDel() {
    if (!this.getReadOnly()) {
      var value = this.getInputValue();
      var message = value.substring(0, this.getCursorTextPosition());
      message += value.substring(this.getCursorTextPosition() + 1, this.getCursorTextPosition().length);
      this.value = message;
      this.isDirty = true;
      this.makeTextSprite();
      this.isDirty = false;
    }
  }

  inputCursorStart() {
    this.cursorTextPosition = 0;
    this.isDirty = true;
    this.makeTextSprite();
    this.isDirty = false;
  }

  inputCursorEnd() {
    this.cursorTextPosition = this.getInputValue().length;
    this.isDirty = true;
    this.makeTextSprite();
    this.isDirty = false;
  }
  /**
   *
   * Object methods
   *
   */


  incCursorTextPosition(incVal) {
    if (typeof incVal === 'undefined') {
      this.cursorTextPosition++;
    } else {
      this.cursorTextPosition += incVal;
    }
  }

  decCursorTextPosition(decVal) {
    if (typeof decVal === 'undefined') {
      this.cursorTextPosition--;
    } else {
      this.cursorTextPosition -= decVal;
    }
  }

  makeTextSprite(message) {
    if (null == message) {
      message = this.getInputValue();
    }

    this.resetBorderOffset();
    var borderThickness = this.getBorderSize();
    var context = this.context;
    var canvas = this.canvas;
    var realInputHeight = this.getFontSize() + this.getBorderOffset() * 2 + borderThickness;
    canvas.width = this.getInputFieldSize();
    canvas.height = realInputHeight;
    context.font = this.getFontSize() + 'px ' + this.getFontFamily();
    context.textBaseline = "top";

    if (this.isDirty) {
      this.displaceInputValue();

      if (this.getHasFocus()) {
        this.getInputCursor().setCursorTextPosition(this.getCursorTextPosition());
      }
    }

    this.roundRect(context, borderThickness / 2, borderThickness / 2, this.getInputFieldSize() - borderThickness, realInputHeight - borderThickness, this.getBorderRadius());
    this.setInputTextValue(context, message);
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var inputElement = false;

    if (this.inputCanvasId === '') {
      if (this.getOrthographicView()) {
        var inputElementMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true
        });
        inputElement = new THREE.Sprite(inputElementMaterial);
        var random = Math.round(Math.random() * 100000000);
        this.inputCanvasId = 'inputText-' + random;
        inputElement.name = this.id;
        inputElement.scale.set(this.getInputFieldSize(), realInputHeight, 0);
        inputElement.position.set(this.getInputPosition().x, this.getInputPosition().y, this.getInputPosition().z);
      } else {
        var random = Math.round(Math.random() * 100000000);
        this.inputCanvasId = 'inputText-' + random;
        inputElement = new THREE.Mesh(new THREE.PlaneGeometry(this.getInputFieldSize(), realInputHeight), new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true
        }));
        inputElement.name = this.id;
        inputElement.position.set(this.getInputPosition().x + this.getInputFieldSize() / 2, this.getInputPosition().y - realInputHeight / 2, this.getInputPosition().z);
      }
    } else {
      this.inputElement.material.map = texture;
    }

    return inputElement;
  }
  /**
   * function for drawing rounded rectangles
   *
   * @param ctx   Context
   * @param x     x start position
   * @param y     y start position
   * @param w     width
   * @param h     height
   * @param r     radius
   */


  roundRect(ctx, x, y, w, h, r) {
    // background color
    ctx.fillStyle = "rgba(" + this.backgroundColor.r + "," + this.backgroundColor.g + "," + this.backgroundColor.b + "," + this.backgroundColor.a + ")"; // border color

    if (!this.getReadOnly()) {
      ctx.strokeStyle = "rgba(" + this.borderColor.r + "," + this.borderColor.g + "," + this.borderColor.b + "," + this.borderColor.a + ")";
    } else {
      ctx.strokeStyle = "rgba(" + this.borderColorReadOnly.r + "," + this.borderColorReadOnly.g + "," + this.borderColorReadOnly.b + "," + this.borderColorReadOnly.a + ")";
    }

    ctx.lineWidth = this.getBorderSize();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  setInputTextValue(context, message) {
    if (!this.getReadOnly()) {
      context.fillStyle = "rgba(" + this.fontColor.r + ", " + this.fontColor.g + ", " + this.fontColor.b + ", " + this.fontColor.a + ")";
    } else {
      context.fillStyle = "rgba(" + this.fontColorReadOnly.r + ", " + this.fontColorReadOnly.g + ", " + this.fontColorReadOnly.b + ", " + this.fontColorReadOnly.a + ")";
    }

    context.fillText(message, this.getInputTextPosition().x, this.getInputTextPosition().y);

    if (this.getHasFocus()) {
      this.getInputCursor().drawCursor(this);
    }
  }

  displaceInputValue() {
    var message = this.getInputValue();
    var tmpMessage = message.substring(0, this.getCursorTextPosition());
    var textWidth = this.context.measureText(tmpMessage).width + this.getBorderOffset() * 3;
    var textMovedWith = textWidth + this.inputTextPosition.x;

    if (textMovedWith >= this.getInputFieldSize()) {
      // Displace the text to the left
      this.setInputTextPositionX(this.getInputFieldSize() - textWidth);
    } else if (textMovedWith < this.getBorderOffset() * 2) {
      // Displace the text to the right
      this.setInputTextPositionX(this.inputTextPosition.x + Math.abs(textMovedWith) + this.getBorderOffset() * 3);
    } else if (textMovedWith > this.getBorderOffset() * 2) {
      // Set the max right displacement position of text to the start of the input field
      this.setInputTextPositionX(0);
    }
  }

}

exports.default = InputText;