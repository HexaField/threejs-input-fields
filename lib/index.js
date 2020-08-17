"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.POSITIONS = void 0;

var _InputText = _interopRequireDefault(require("./InputText"));

var _InputCursor = _interopRequireDefault(require("./InputCursor"));

var _Raycaster = _interopRequireDefault(require("./Raycaster"));

var _jquery = _interopRequireDefault(require("jquery"));

var _mousetrap = _interopRequireDefault(require("mousetrap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var POSITIONS = {
  POSITION_TOP_LEFT: 'tl',
  POSITION_TOP_RIGHT: 'tr',
  POSITION_BOTTOM_LEFT: 'bl',
  POSITION_BOTTOM_RIGHT: 'br',
  POSITION_TOP_CENTER: 'tc',
  POSITION_LEFT_CENTER: 'lc',
  POSITION_RIGHT_CENTER: 'rc',
  POSITION_BOTTOM_CENTER: 'bc',
  POSITION_CENTER: 'c'
};
exports.POSITIONS = POSITIONS;

class ThreeJSInputFields {
  constructor(attributes) {
    this.inputTypesEnabled = {
      'text': 1
    };
    this.inputsLoaded = {};
    this.focusedElement = '';
    this.isShiftPress = false;
    this.isCapsLocked = false;
    this.ignoreKey = false;
    this.cursorElement = false;
    this.lastCameraPosition = {
      x: 0,
      y: 0,
      z: 0
    };
    this.raycaster = false;
    this.camera = '';
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.setCamera(attributes.camera);
    this.setCanvasWidth(attributes.canvasWidth);
    this.setCanvasHeight(attributes.canvasHeight);
    this.raycaster = new _Raycaster.default({
      camera: this.getCamera(),
      inputManager: this
    });
    (0, _jquery.default)(document).keypress(function (event) {
      if (!this.ignoreKey) {
        var char = String.fromCharCode(event.which);

        if (this.isShifted(event)) {
          char = char.toLocaleUpperCase();
        } else {
          char = char.toLocaleLowerCase();
        }

        this.addKeyDownValue(char);
      }

      this.ignoreKey = false;
      return false;
    }.bind(this));
    /**
     * Disable backspace and delete key
     */

    (0, _jquery.default)(document).keydown(function (event) {
      if (event.which == 8 || event.which == 46) {
        return false;
      }
    }.bind(this));
    this.shiftPress = this.shiftPress.bind(this);
    this.shiftRelease = this.shiftRelease.bind(this);
    this.cursorDisplace = this.cursorDisplace.bind(this);
    this.cursorDisplace = this.cursorDisplace.bind(this);
    this.inputBackspace = this.inputBackspace.bind(this);
    this.inputDel = this.inputDel.bind(this);
    this.inputCursorEnd = this.inputCursorEnd.bind(this);
    this.inputCursorStart = this.inputCursorStart.bind(this);

    _mousetrap.default.bind('shift', this.shiftPress, 'keypress');

    _mousetrap.default.bind('shift', this.shiftRelease, 'keyup');

    _mousetrap.default.bind('left', this.cursorDisplace);

    _mousetrap.default.bind('right', this.cursorDisplace);

    _mousetrap.default.bind('backspace', this.inputBackspace);

    _mousetrap.default.bind('del', this.inputDel);

    _mousetrap.default.bind('end', this.inputCursorEnd);

    _mousetrap.default.bind('home', this.inputCursorStart);
  }

  shiftRelease() {
    this.isShiftPress = false;
  }

  shiftPress() {
    this.isShiftPress = true;
  }

  isShifted(event) {
    if (event) {
      // get key pressed
      var which = -1;

      if (event.which) {
        which = event.which;
      } else if (event.keyCode) {
        which = event.keyCode;
      } // get shift status


      var shift_status = false;

      if (event.shiftKey) {
        shift_status = event.shiftKey;
      } else if (event.modifiers) {
        shift_status = !!(event.modifiers & 4);
      }

      if (which >= 65 && which <= 90 && !shift_status || which >= 97 && which <= 122 && shift_status) {
        // uppercase, no shift key
        this.isCapsLocked = true;
      } else {
        this.isCapsLocked = false;
      }
    }

    return this.isCapsLocked || this.isShiftPress || false;
  }

  cursorDisplace(event) {
    this.ignoreKey = true;
    var focusedElement = this.getFocusedElement();

    if (focusedElement) {
      var inputCursor = this.getInputCursor();

      if (event.keyCode == 39) {
        // LEFT
        inputCursor.setCursorTextPosition(focusedElement.getCursorTextPosition() + 1);
      } else if (event.keyCode == 37) {
        // RIGHT
        inputCursor.setCursorTextPosition(focusedElement.getCursorTextPosition() - 1);
      }
    }
  }

  inputBackspace(event) {
    var focusedElement = this.getFocusedElement();

    if (focusedElement) {
      focusedElement.inputBackspace();
    }
  }

  inputDel(event) {
    var focusedElement = this.getFocusedElement();

    if (focusedElement) {
      focusedElement.inputDel();
    }
  }

  inputCursorEnd(event) {
    this.ignoreKey = true;
    var focusedElement = this.getFocusedElement();

    if (focusedElement) {
      focusedElement.inputCursorEnd();
    }
  }

  inputCursorStart(event) {
    this.ignoreKey = true;
    var focusedElement = this.getFocusedElement();

    if (focusedElement) {
      focusedElement.inputCursorStart();
    }
  }
  /**
   * Create the input field desired if it exists.
   *
   * Return   TRUE    if everything gone ok
   *          FALSE   if an error occurs
   *
   * @param type                  Type of input field
   * @param inputId               Input id
   *
   * @returns {boolean}
   */


  create(type, inputId, orthographicView, params) {
    if (!this.inputTypesEnabled.hasOwnProperty(type)) {
      console.error("-- inputManager:getInputType -- The input type '" + type + "' doesn't exists!");
      return false;
    }

    var inputFieldExists = true;

    switch (this.inputTypesEnabled[type]) {
      case this.inputTypesEnabled.text:
        var newElement = new _InputText.default({
          id: inputId,
          inputManager: this,
          orthographicView: orthographicView
        }, params);
        this.inputsLoaded[inputId] = newElement;
        break;

      default:
        console.error("-- inputManager:getInputType -- The input type '" + type + "' doesn't exists!");
        inputFieldExists = false;
    }

    if (inputFieldExists) {
      this.inputsLoaded[inputId].setInputManager(this);
    }

    return this.inputsLoaded[inputId];
  }

  getInput(inputId) {
    if (!this.inputsLoaded.hasOwnProperty(inputId)) {
      console.error("-- inputManager:getInput -- The input '" + inputId + "' doesn't exists!");
      return;
    }

    return this.inputsLoaded[inputId];
  }

  addKeyDownValue(value) {
    var focusedElement = this.getFocusedElement();

    if (false != focusedElement) {
      focusedElement.addKeyDownValue(value);
    }
  }

  thereIsAFocusedElement() {
    if (this.focusedElement != '') {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Check the focused input field and look if its dirty, in that case the input needs to be re-draw
   */


  requestAnimationFrame() {
    var focusedInput = this.getFocusedElement();

    if (false != focusedInput && focusedInput.isDirty) {
      focusedInput.drawInputElement();
    } // Show the text cursor if it is needed


    if (false != focusedInput && focusedInput.inputType == 'text') {
      if (focusedInput.hasCursor() && focusedInput.getHasFocus()) {
        this.cursorElement.blink(focusedInput);
      }
    }

    this.updateDirtyInputFields();
  }

  getInputCursor() {
    if (this.cursorElement === false) {
      this.cursorElement = new _InputCursor.default();
      this.cursorElement.setInputManager(this);
    }

    return this.cursorElement;
  }

  getFocusedElement() {
    var focusedElement = false;

    if (this.thereIsAFocusedElement()) {
      focusedElement = this.inputsLoaded[this.focusedElement];
      focusedElement = typeof focusedElement == 'undefined' ? false : focusedElement;
    }

    return focusedElement;
  }

  getInside3DEnviromentInputs() {
    var inputs = [];
    var inputLoaded = '';

    for (var _index in this.inputsLoaded) {
      inputLoaded = this.inputsLoaded[_index];

      if (inputLoaded.id && inputLoaded.getOrthographicView() == false) {
        inputs.push(inputLoaded.getInputElement());
      }
    }

    return inputs;
  }

  getOutside3DEnviromentInputs() {
    var inputs = [];
    var inputLoaded = '';

    for (var _index2 in this.inputsLoaded) {
      inputLoaded = this.inputsLoaded[_index2];

      if (inputLoaded.id && inputLoaded.getOrthographicView() == true) {
        inputs.push(inputLoaded);
      }
    }

    return inputs;
  }

  setFocusedElement(newFocusedElement) {
    var focusedElement = this.getFocusedElement();

    if (false != focusedElement) {
      focusedElement.setHasFocus(false);
      focusedElement.makeTextSprite();
    } // Setting the focused element for the vey first time


    if (typeof newFocusedElement.object == 'undefined') {
      // For sprite inputFields "outside" the scene
      newFocusedElement = this.inputsLoaded[newFocusedElement.name];
      this.focusedElement = newFocusedElement.id;
      newFocusedElement.setHasFocus(true);
      newFocusedElement.makeTextSprite();
    } else {
      newFocusedElement = this.inputsLoaded[newFocusedElement.object.name];
      this.focusedElement = newFocusedElement.id;
      newFocusedElement.setHasFocus(true);
      newFocusedElement.makeTextSprite();
    }

    return this;
  }

  updateOrthographicInputFieldsPositions() {
    var inputFields = this.getOutside3DEnviromentInputs();

    for (index in inputFields) {
      inputFields[index].onWindowResizeUpdatePosition();
    }
  }

  onDocumentMouseMove(event) {
    this.raycaster.onDocumentMouseMove(event);
    return this;
  }

  onDocumentMouseClick(event) {
    this.raycaster.onDocumentMouseClick(event);
    return this;
  }

  setCamera(camera) {
    if (typeof camera === 'undefined') {
      console.error('The camera is needed');
    } else {
      this.camera = camera;
    }

    return this;
  }

  getCamera() {
    return this.camera;
  }

  setCanvasWidth(canvasWidth) {
    if (typeof canvasWidth === 'undefined') {
      console.error('The canvasWidth is needed');
    } else {
      this.canvasWidth = canvasWidth;
    }

    return this;
  }

  getCanvasWidth() {
    return this.canvasWidth;
  }

  setCanvasHeight(canvasHeight) {
    if (typeof canvasHeight === 'undefined') {
      console.error('The canvasHeight is needed');
    } else {
      this.canvasHeight = canvasHeight;
    }

    return this;
  }

  getCanvasHeight() {
    return this.canvasHeight;
  }

  updateDirtyInputFields() {
    for (var index in this.inputsLoaded) {
      var inputElement = this.inputsLoaded[index];
      if (inputElement.id) if (inputElement.getIsDirty()) {
        inputElement.drawInputElement();
      }
    }
  }

}

exports.default = ThreeJSInputFields;