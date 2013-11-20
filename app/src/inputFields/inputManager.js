/**
 *
 * User: Fernando Villar Perez
 * Date: 02/10/13
 * Time: 09:30
 *
 * This is the class that manages all the inputs showed
 *
 */


define(
    [
        'backbone',
        'threejs',
        'inputFields/views/inputText',
        'inputFields/views/inputCursor',
        'mousetrap'
    ],
    function(
        Backbone,
        THREE,
        InputText,
        InputCursor,
        Mousetrap
        ) {

    inputManagerClass = Backbone.Model.extend({

        inputTypesEnabled           :   {
            'text'      :     1
        },

        inputsLoaded                :   {},
        focusedElement              :   '',
        isShiftPress                :   false,
        isCapsLocked                :   false,
        ignoreKey                   :   false,
        cursorElement               :   false,
        lastCameraPosition          :   { x: 0, y: 0, z: 0 },
        camera                      :   '',
        cameraOrtho                 :   '',
        sceneOrtho                  :   '',

        initialize: function() {

//            this.setCamera( this.attributes.camera );
//            this.setCameraOrtho( this.attributes.cameraOrtho );
//            this.setSceneOrtho( this.attributes.sceneOrtho );

            inputManagerClassTHIS = this;

            $( document ).keypress(function( event ) {

                if( !inputManagerClassTHIS.ignoreKey ) {
                    var char = String.fromCharCode( event.which );

                    if( inputManagerClassTHIS.isShifted( event ) ) {
                        char = char.toLocaleUpperCase();
                    } else {
                        char = char.toLocaleLowerCase();
                    }

                    inputManagerClassTHIS.addKeyDownValue( char );
                }

                inputManagerClassTHIS.ignoreKey = false;

                return false;
            });

            /**
             * Disable backspace and delete key
             */
            $( document ).keydown(function( event ) {
                if( event.which == 8 || event.which == 46 ) {
                    return false;
                }
            });

            Mousetrap.bind( 'shift',        inputManagerClassTHIS.shiftPress, 'keypress' );
            Mousetrap.bind( 'shift',        inputManagerClassTHIS.shiftRelease, 'keyup' );

            Mousetrap.bind( 'left',         inputManagerClassTHIS.cursorDisplace );
            Mousetrap.bind( 'right',        inputManagerClassTHIS.cursorDisplace );
            Mousetrap.bind( 'backspace',    inputManagerClassTHIS.inputBackspace );
            Mousetrap.bind( 'del',          inputManagerClassTHIS.inputDel );
            Mousetrap.bind( 'end',          inputManagerClassTHIS.inputCursorEnd );
            Mousetrap.bind( 'home',          inputManagerClassTHIS.inputCursorStart );

            window.addEventListener( 'resize', this.onWindowResize, false );

        },

        shiftRelease: function() {
            inputManagerClassTHIS.isShiftPress = false;
        },

        shiftPress: function() {
            inputManagerClassTHIS.isShiftPress = true;
        },

        isShifted: function( event ) {

            if( event ) {
                // get key pressed
                var which = -1;
                if (event.which) {
                    which = event.which;
                } else if (event.keyCode) {
                    which = event.keyCode;
                }
                // get shift status
                var shift_status = false;
                if (event.shiftKey) {
                    shift_status = event.shiftKey;
                } else if (event.modifiers) {
                    shift_status = !!(event.modifiers & 4);
                }
                if (((which >= 65 && which <=  90) && !shift_status) ||
                    ((which >= 97 && which <= 122) && shift_status)) {
                    // uppercase, no shift key
                    inputManagerClassTHIS.isCapsLocked = true;
                } else {
                    inputManagerClassTHIS.isCapsLocked = false;
                }
            }

            return inputManagerClassTHIS.isCapsLocked || inputManagerClassTHIS.isShiftPress || false;
        },

        cursorDisplace: function( event ) {

            inputManagerClassTHIS.ignoreKey = true;
            var focusedElement = inputManagerClassTHIS.getFocusedElement();

            if( focusedElement ) {

                var inputCursor = inputManagerClassTHIS.getInputCursor();

                if( event.keyCode == 39 ) {             // LEFT
                    inputCursor.setCursorTextPosition( focusedElement.getCursorTextPosition() + 1 );
                } else if( event.keyCode == 37 ) {      // RIGHT
                    inputCursor.setCursorTextPosition( focusedElement.getCursorTextPosition() - 1 );
                }
            }
        },

        inputBackspace: function( event ) {

            var focusedElement = inputManagerClassTHIS.getFocusedElement();

            if( focusedElement ) {

                focusedElement.inputBackspace();

            }

        },

        inputDel: function( event ) {

            var focusedElement = inputManagerClassTHIS.getFocusedElement();

            if( focusedElement ) {

                focusedElement.inputDel();

            }

        },

        inputCursorEnd: function( event ) {

            inputManagerClassTHIS.ignoreKey = true;
            var focusedElement = inputManagerClassTHIS.getFocusedElement();

            if( focusedElement ) {

                focusedElement.inputCursorEnd();

            }
        },

        inputCursorStart: function( event ) {

            inputManagerClassTHIS.ignoreKey = true;
            var focusedElement = inputManagerClassTHIS.getFocusedElement();

            if( focusedElement ) {

                focusedElement.inputCursorStart();

            }
        },

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
        create: function( type, inputId ) {

            if( !this.inputTypesEnabled.hasOwnProperty( type ) ) {

                console.error( "-- inputManager:getInputType -- The input type '" + type + "' doesn't exists!" );
                return false;

            }

            var inputFieldExists = true;

            switch( this.inputTypesEnabled[ type ] )
            {
                case this.inputTypesEnabled.text :

                    this.inputsLoaded[ inputId ] = new InputText( { id: inputId, inputManager: this } );
                    break;

                default:
                    console.error( "-- inputManager:getInputType -- The input type '" + type + "' doesn't exists!" );
                    inputFieldExists = false;
            }

            if( inputFieldExists ) {

                this.inputsLoaded[ inputId ].setInputManager( this );

            }


            return this.inputsLoaded[ inputId ];
        },

        getInput: function( inputId ) {

            if( !this.inputsLoaded.hasOwnProperty( inputId ) ) {

                console.error( "-- inputManager:getInput -- The input '" + inputId + "' doesn't exists!" );
                return;

            }

            return this.inputsLoaded[ inputId ];
        },

        addKeyDownValue: function( value ) {

            var focusedElement = this.getFocusedElement();

            if( false != focusedElement ) {
                focusedElement.addKeyDownValue( value );
            }

        },

        thereIsAFocusedElement: function() {

            if( this.focusedElement != '' ){
                return true;
            } else {
                return false;
            }

        },

        /**
         * Check the focused input field and look if its dirty, in that case the input needs to be re-draw
         */
        requestAnimationFrame: function() {

            var focusedInput = this.getFocusedElement();
            if( false != focusedInput && focusedInput.isDirty ) {

                focusedInput.drawInputElement();

            }

            // Show the text cursor if it is needed
            if( false != focusedInput && focusedInput.inputType == 'text' ) {

                if( focusedInput.hasCursor() && focusedInput.getHasFocus() ) {

                    this.cursorElement.blink( focusedInput );

                }

            }

        },

        getInputCursor: function() {

            if( this.cursorElement === false ) {
                this.cursorElement = new InputCursor();
                this.cursorElement.setInputManager( this );
            }

            return this.cursorElement;

        },

        getFocusedElement: function() {
            var focusedElement = false;

            if( inputManagerClassTHIS.thereIsAFocusedElement() ) {
                focusedElement = inputManagerClassTHIS.inputsLoaded[ inputManagerClassTHIS.focusedElement ];

                focusedElement = typeof focusedElement == 'undefined' ? false : focusedElement
            }

            return focusedElement;

        },

        getInside3DEnviromentInputs: function() {

            var inputs = [];
            var inputLoaded = '';

            for( index in this.inputsLoaded ) {

                inputLoaded = this.inputsLoaded[ index ];
                if( inputLoaded.getUseScreenCoordinates() == false ) {
                    inputs.push( inputLoaded.getInputElement() );
                }

            }

            return inputs;

        },

        getOutside3DEnviromentInputs: function() {

            var inputs = [];
            var inputLoaded = '';

            for( index in this.inputsLoaded ) {

                inputLoaded = this.inputsLoaded[ index ];
                if( inputLoaded.getUseScreenCoordinates() == true ) {
                    inputs.push( inputLoaded.getInputElement() );
                }

            }

            return inputs;

        },

        setCamera: function( camera ) {

            if( typeof camera === 'undefined' ) {
                console.log( 'The camera is needed' );
            } else {
                this.camera = camera;
            }

            return this;
        },

        getCamera: function() {

            return this.camera;

        },

        setCameraOrtho: function( cameraOrtho ) {

            if( typeof camera === 'undefined' ) {
                console.log( 'The cameraOrtho is needed' );
            } else {
                this.cameraOrtho = cameraOrtho;
            }

            return this;
        },

        getCameraOrtho: function() {

            return this.cameraOrtho;

        },

        setSceneOrtho: function( sceneOrtho ) {

            if( typeof scene === 'undefined' ) {
                console.log( 'The sceneOrtho is needed' );
            } else {
                this.sceneOrtho = sceneOrtho;
            }

            return this;
        },

        getSceneOrtho: function() {

            return this.sceneOrtho;

        },

        setFocusedElement: function( newFocusedElement ) {

            var focusedElement = this.getFocusedElement();

            if( false != focusedElement ) {

                focusedElement.setHasFocus( false );
                focusedElement.makeTextSprite();

            }

            if( typeof newFocusedElement.object == 'undefined' ) {

                // For sprite inputFields "outside" the scene
                newFocusedElement = this.inputsLoaded[ newFocusedElement.id ];
                newFocusedElement.setHasFocus( true );
                this.focusedElement = newFocusedElement.id;

            } else {

                newFocusedElement = this.inputsLoaded[ newFocusedElement.object.id ];
                newFocusedElement.setHasFocus( true );
                this.focusedElement = newFocusedElement.id;

            }


            return this;

        },

        onWindowResize: function() {

            inputManagerClassTHIS.cameraOrtho.right = window.innerWidth;
            inputManagerClassTHIS.cameraOrtho.top = window.innerHeight;
            inputManagerClassTHIS.cameraOrtho.updateProjectionMatrix();

            inputManagerClassTHIS.updateHUDSprites();

        }

    });

    return inputManagerClass;

});
