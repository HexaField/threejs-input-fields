import * as THREE from 'three'

export default class InputCursor
{
    constructor(attributes, params = {})
    {
        this.cursorSprite       = params.cursorSprite || '';
        this.canvas             = params.canvas || '';
        this.isDirty            = params.isDirty || true;

        this.blinkingFrequency  = params.blinkingFrequency || 0.5;
        this.blinkingLastChange = params.blinkingLastChange || 0;
        this.blinkingClock      = params.blinkingClock || '';

        this.positionX          = params.positionX || 0;
        this.positionY          = params.positionY || 0;
        this.visible            = params.visible || false;
        this.inputManager       = params.inputManager || false;


        this.blinkingClock = new THREE.Clock();
    }

    setInputManager( inputManager ) {

        this.inputManager = inputManager;
        return this;

    }

    getVisible() {
        return this.visible;
    }

    setVisible( visible ) {
        this.visible = visible;
        return this;
    }

    drawCursor( inputElement ) {

        if( this.visible ) {
            var positionX = inputElement.getCursorPosition() - inputElement.inputRealPosition.x - 2;
            var positionY = inputElement.getInputTextPosition().y; // - inputElement.getFontSize() / 2;
            inputElement.context.fillText( "|", positionX, positionY  );
        }

    }

    blink( inputElement ) {

        var lastBlinkGap = this.blinkingLastChange + this.blinkingFrequency;

        if( lastBlinkGap < this.blinkingClock.getElapsedTime() ) {

            this.visible = !this.visible;
            this.blinkingLastChange = this.blinkingClock.getElapsedTime();

            inputElement.isDirty = true;
            inputElement.makeTextSprite( null );
            inputElement.isDirty = false;

        }
    }

    getCursorPosition( inputElement ) {

        this.positionX = inputElement.getCursorPosition() - 2;
        this.positionY = inputElement.getInputTextPosition().y + inputElement.getInputPosition().y - inputElement.getFontSize() * 0.05;

    }

    getInputManager() {

        if( this.inputManager === false ) {
            console.error( 'The input manager has not been set correctly into inputCursor object' );
        } else {
            return this.inputManager;
        }

    }

    setCursorPosition( position ) {

        var inputField = this.getInputManager().getFocusedElement();

        if( typeof inputField !== 'undefined' && inputField !== false ) {

            if( position > inputField.getInputPosition().x + inputField.getInputFieldSize() - inputField.getBorderSize() * 3 ) {

                position = inputField.getInputPosition().x + inputField.getInputFieldSize() - inputField.getBorderSize() * 3;

            } else if( position < inputField.getInputPosition().x + inputField.getBorderSize() * 2 ) {

                position = inputField.getInputPosition().x + inputField.getBorderSize() * 2;

            }

            inputField.setCursorPosition( position );

        }

        return this;

    }

    /**
     * Set the cursor position on the correct x-coordinate
     *
     * @param position
     * @returns {inputTextClass}
     */
    setCursorTextPosition( position ) {

        var inputField = this.getInputManager().getFocusedElement();

        if( typeof inputField !== 'undefined' && inputField !== false ) {
            if( position < 0 ) {
                position = 0;
            } else if( position > inputField.getInputValue().length ) {
                position = inputField.getInputValue().length;
            }

            var oldPosition = inputField.getCursorTextPosition();
            var offsetedPosition = position;


            // Displace the position to assure at least one character of visibility
            if( oldPosition < position ) {
                if( ( position + 2 ) <= inputField.getInputValue().length ) {
                    inputField.incCursorTextPosition( 3 );
                    offsetedPosition += 2;
                } else if( ( position + 1 ) <= inputField.getInputValue().length ) {
                    inputField.incCursorTextPosition( 2 );
                    offsetedPosition++;
                }
            } else if( oldPosition > position ){
                if( ( position - 2 ) >= 0 ) {
                    inputField.decCursorTextPosition( 3 );
                    offsetedPosition -= 2;
                } else if( ( position - 1 ) >= 0 ) {
                    inputField.decCursorTextPosition( 2 );
                    offsetedPosition--;
                }
            }

            var needsToBeCleaned = !inputField.isDirty;

            var xCoordinatePosition = inputField.getInputCursorPositionXCoordinate( offsetedPosition, inputField.getInputValue() );
            var max = inputField.getInputPosition().x + inputField.getInputFieldSize() - inputField.getBorderSize() * 3;
            var min = inputField.getInputPosition().x + inputField.getBorderSize() * 2;

            if( xCoordinatePosition >= max ) {

                // Displace the text to show the next two or one characters
                // if( ( position + 2 ) <= inputField.getInputValue().length ) {
                //     inputField.incCursorTextPosition( 2 );
                // } else if( ( position + 1 ) <= inputField.getInputValue().length ) {
                //     inputField.incCursorTextPosition();
                // }

                inputField.displaceInputValue();

                xCoordinatePosition = inputField.getInputCursorPositionXCoordinate( position, inputField.getInputValue() );

            } else if( xCoordinatePosition <= min ) {

                // Displace the text to show the preview two or one characters
                // if( ( position - 2 ) >= 0 ) {
                //     inputField.decCursorTextPosition( 2 );
                // } else if( ( position - 1 ) >= 0 ) {
                //     inputField.decCursorTextPosition();
                // }

                inputField.displaceInputValue();

                xCoordinatePosition = inputField.getInputCursorPositionXCoordinate( position, inputField.getInputValue() );
            }

            // Since we may have displaced the cursor to show more characters is convenient to save the real cursor position again
            inputField.setCursorTextPosition( position );
            inputField.setCursorPosition( xCoordinatePosition );

            if( needsToBeCleaned ) {
                inputField.setIsDirty( true );
                inputField.makeTextSprite( inputField.getInputValue() );
                inputField.setIsDirty( false );
            }
        }

        return this;
    }

}