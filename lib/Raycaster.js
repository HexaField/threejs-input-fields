"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var THREE = _interopRequireWildcard(require("three"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Raycaster {
  constructor(attributes) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.inputManager = '';
    this.camera = '';
    this.mouseX = '';
    this.mouseY = '';
    this.inner3DSpaceMouseX = '';
    this.inner3DSpaceMouseY = '';
    this.isDirty = false;
    this.raycaster = '';
    this.intersectedElement = false;
    this.setCamera(attributes.camera);
    this.setInputManager(attributes.inputManager); // initialize object to perform world/screen calculations

    this.raycaster = new THREE.Raycaster();
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

  getCanvasWidth() {
    return this.getInputManager().getCanvasWidth();
  }

  getCanvasHeight() {
    return this.getInputManager().getCanvasHeight();
  }

  onDocumentMouseMove(event) {
    // update the mouse variable
    this.inner3DSpaceMouseX = event.clientX / this.getCanvasWidth() * 2 - 1;
    this.inner3DSpaceMouseY = -(event.clientY / this.getCanvasHeight()) * 2 + 1;
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.isDirty = true;
  }

  onDocumentMouseClick(event) {
    this.checkIfElementHasBeenClicked();

    if (false != this.intersectedElement) {
      this.getInputManager().setFocusedElement(this.intersectedElement);
    }
  }

  requestAnimationFrame() {
    this.checkIfElementHasBeenClicked();
  }

  checkIfElementHasBeenClicked() {
    if (this.isDirty) {
      this.intersectedElement = this.getIntersectedInputField();
      this.isDirty = false;
    }
  }

  getIntersectedInputField() {
    var inputElement = false;
    var intersectedElement = false;
    intersectedElement = this.getIntersectedInputFieldOutside3DSpace();

    if (intersectedElement != false) {
      inputElement = intersectedElement;
    }

    if (false == inputElement) {
      intersectedElement = this.getIntersectedInputFieldInside3DSpace();

      if (intersectedElement != false) {
        inputElement = intersectedElement;
      }
    }

    return inputElement;
  }

  getIntersectedInputFieldOutside3DSpace() {
    var outside3DEnviromentInputs = this.getInputManager().getOutside3DEnviromentInputs();
    var inputField = false;
    var inputFieldPosition = false;
    var inputFieldElement = false;
    var intersectedElement = false;
    var xIni = 0;
    var xEnd = 0;
    var yIni = 0;
    var yEnd = 0;

    for (var index in outside3DEnviromentInputs) {
      inputField = outside3DEnviromentInputs[index];
      inputFieldPosition = inputField.getInputPosition();
      inputFieldElement = inputField.getInputElement();
      xIni = inputFieldPosition.x - inputFieldElement.scale.x / 2;
      xEnd = inputFieldPosition.x + inputFieldElement.scale.x / 2;
      yIni = this.getCanvasHeight() - (inputFieldPosition.y + inputFieldElement.scale.y / 2);
      yEnd = this.getCanvasHeight() - (inputFieldPosition.y - inputFieldElement.scale.y / 2);

      if (xIni <= this.mouseX && this.mouseX <= xEnd && yIni <= this.mouseY && this.mouseY <= yEnd) {
        intersectedElement = inputFieldElement;
        break;
      }
    }

    return intersectedElement;
  }

  getIntersectedInputFieldInside3DSpace() {
    var intersectedElement = false;
    var inside3DEnviromentInputs = this.getInputManager().getInside3DEnviromentInputs();
    this.raycaster.setFromCamera(new THREE.Vector2(this.inner3DSpaceMouseX, this.inner3DSpaceMouseY), this.camera);
    var intersects = this.raycaster.intersectObjects(inside3DEnviromentInputs); // INTERSECTED = the object in the scene currently closest to the camera
    //		and intersected by the Ray projected from the mouse position
    // if there is one (or more) intersections

    if (intersects.length > 0) {
      intersectedElement = intersects[0];
    }

    return intersectedElement;
  }

}

exports.default = Raycaster;