import * as THREE from 'three'

export default class Raycaster
{
    constructor(attributes, params = {})
    {   
        this.inputManager = ''
        this.camera = ''
        this.mouseX = ''
        this.mouseY = ''
        this.inner3DSpaceMouseX = ''
        this.inner3DSpaceMouseY = ''
        this.isDirty = false
        this.raycaster = ''
        this.intersectedElement = false
        
        this.setCamera(attributes.camera);
        this.setInputManager(attributes.inputManager);

        // initialize object to perform world/screen calculations
        this.raycaster = new THREE.Raycaster();
    }

    setCamera( camera ) {

        if( typeof camera === 'undefined' ) {
            console.error( 'The camera is needed' );
        } else {
            this.camera = camera;
        }

        return this;
    }

    getCamera() {

        return this.camera;

    }

    setInputManager( inputManager ) {

        if( typeof inputManager === 'undefined' ) {
            console.error( 'The inputManager is needed' );
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

    onDocumentMouseMove( event ) {

        // update the mouse variable
        this.inner3DSpaceMouseX = ( event.clientX / this.getCanvasWidth() ) * 2 - 1;
        this.inner3DSpaceMouseY = - ( event.clientY / this.getCanvasHeight() ) * 2 + 1;

        this.mouseX = event.clientX;
        this.mouseY = event.clientY;

        this.isDirty = true;
    }

    onDocumentMouseClick( event ) {

        this.checkIfElementHasBeenClicked();

        if( false != this.intersectedElement ) {

            this.getInputManager().setFocusedElement( this.intersectedElement );

        }

    }

    requestAnimationFrame() {

        this.checkIfElementHasBeenClicked();

    }

    checkIfElementHasBeenClicked() {

        if( this.isDirty ) {

            this.intersectedElement = this.getIntersectedInputField();

            this.isDirty = false;
        }

    }

    getIntersectedInputField() {

        var inputElement = false;
        var intersectedElement = false;

        intersectedElement = this.getIntersectedInputFieldOutside3DSpace();
        if( intersectedElement != false ) {
            inputElement = intersectedElement;
        }

        if( false == inputElement ) {

            intersectedElement = this.getIntersectedInputFieldInside3DSpace();
            if( intersectedElement != false ) {
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

        for( var index in outside3DEnviromentInputs ) {

            inputField = outside3DEnviromentInputs[ index ];
            inputFieldPosition = inputField.getInputPosition();
            inputFieldElement = inputField.getInputElement();

            xIni = inputFieldPosition.x - inputFieldElement.scale.x / 2;
            xEnd = ( inputFieldPosition.x + inputFieldElement.scale.x / 2);
            yIni = this.getCanvasHeight() - ( inputFieldPosition.y + inputFieldElement.scale.y / 2 );
            yEnd = this.getCanvasHeight() - ( inputFieldPosition.y - inputFieldElement.scale.y / 2 );

            if(
                ( xIni <= this.mouseX && this.mouseX <= xEnd ) &&
                ( yIni <= this.mouseY && this.mouseY <= yEnd )
            ) {
                intersectedElement = inputFieldElement ;
                break;
            }

        }

        return intersectedElement;


    }

    getIntersectedInputFieldInside3DSpace(){

        var intersectedElement = false;

        var inside3DEnviromentInputs = this.getInputManager().getInside3DEnviromentInputs();

        this.raycaster.setFromCamera( new THREE.Vector2( this.inner3DSpaceMouseX, this.inner3DSpaceMouseY), this.camera );

        var intersects = this.raycaster.intersectObjects( inside3DEnviromentInputs );

        // INTERSECTED = the object in the scene currently closest to the camera
        //		and intersected by the Ray projected from the mouse position

        // if there is one (or more) intersections
        if ( intersects.length > 0 )
        {
            intersectedElement = intersects[ 0 ];
        }

        return intersectedElement;

    }

}