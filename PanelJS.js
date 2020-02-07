
export class PanelJS {


    constructor() {      
        this._oldPosition = 0;
        this._snapPosition = 0;
        this._lock = false;
        this._transitionSpeed = '0.2s';
        this._el = document.getElementById("panelJS"); //declare the element in use
        this._ns = document.getElementById("timesPreventScroll");
        this._fh = document.getElementById("fabholder");
        this._height = window.innerHeight;
        this.startup();
    }


    startup() {

        //Check if panelJS element exists
        if(this._el){
            this._el.addEventListener("touchstart", evt => this.touchStart(evt), true);
            this._el.addEventListener("touchmove", evt => this.touchMove(evt), true);
            this._el.addEventListener("touchend", evt => this.touchEnd(evt), true);
            this._el.addEventListener("touchcancel", evt => this.cancelTouch(evt), true);
        } else {
            console.log("No element found with id panelJS");
        }
        //Check if no scroll element exists
        if(this._ns){
            this._ns.addEventListener("touchmove", evt => this.noScroll(evt), true);
            this._ns.addEventListener("touchstart", evt => this.noScrollStart(evt), true);
            //console.log(this._ns.scrollHeight, "scroll height")
        }

        this.expandHalf();
        
        //Run the initial start, make the element display as closed
    }


    noScrollStart(e) {
        this._lock = true;
        this._clientY = e.touches[0].clientY;
    }

    noScroll(e){
        this._clientYNew = e.touches[0].clientY;
        
        if(this._clientYNew > this._clientY && this._ns.scrollTop <= 0) {
            this._lock = false; 
            this.touchMove(e);  
        }

    }

    /*
    * This is the function that will sort out the sizing of elements dependant
    * on the size of the screen or configured options
    */

    coolMathGames(stageSize) {
        //determine staging sizes and translations
        this._stage0Size = -(-20 / 100); //work out the size for the closed state
        this._stage1Size = -(-50 / 100); //work out the size for the half state
        this._stage2Size = -(-100 / 100); //work out the size for the full state

        this._stagedPosition = window.innerHeight * stageSize; //determine the position for snapped element
        //console.log(window);
        return this._stagedPosition;
    }
    /*
    * This is activated whenever the user presses a finger on the screen
    * we will take the following information:
    * - The current position of the object, relative to the screen size
    * - The initial touching point (where the finger is first placed)
    *  
    * We use this information as the initial setup for the final touchend 
    * function to allow the logic to determine where the element should snap
    */

    touchStart(e) {
        this._lock = false;
        document.documentElement.style.setProperty("--transition-value", "0s"); //reset transition   
        this._clientY = e.changedTouches[0].clientY; //initial touch point
    }


    touchMove(e) {
        this._clientYNew = e.touches[0].clientY; //new touch position coordinates
        this._fh.style.bottom = 0;
        
        this._newPositionY = this._oldPosition + (this._clientY - this._clientYNew); //old position of the element + the difference in touch points
        //Define the limits of the user swiping to prevent the card coming off the screen
        if(this._newPositionY > 10 && this._newPositionY < window.innerHeight && this._lock == false) {
            document.documentElement.style.setProperty("--move-value", 'translateY(' + -this._newPositionY + 'px)');

            //Work out inner height, halve it
            let mathsNum = window.innerHeight / 2;

            if(this._newPositionY < mathsNum) {
                let fhPosition = -this._newPositionY; 
                document.documentElement.style.setProperty("--move-value-a", 'translateY(' + fhPosition + 'px)')
            }
        } else {
        //console.log("Do not draw")
        }
    }


    //stage 2 expansion
    expandFull() {
        this.animatePanel('100', "brown", this._stage2Size);
    }

    //stage 1 expansion
    expandHalf() {
        this.animatePanel('50', "green", this._stage1Size);

        let fhPosition = -this._oldPosition;  
        this.moveFab(fhPosition);
    }
    
    //stage 0 expansion
    closeFull() {
        this.animatePanel('20', "blue", this._stage0Size);

        let fhPosition = -this._oldPosition;  
        this.moveFab(fhPosition);
        console.log(this._oldPosition, "2")
    }

    animatePanel(elPosition, color, stageSize) {
        if(!this._el.classList.contains("move")) {
            this._el.classList.add("move");
        }
        document.documentElement.style.setProperty("--transition-value", this._transitionSpeed);
        document.documentElement.style.setProperty("--move-value", 'translateY(-'+ elPosition +'%)');
        document.documentElement.style.setProperty("--background-color", color);
        console.log(color);
        this.coolMathGames(stageSize);
        this._oldPosition = this._stagedPosition;
        console.log(this._oldPosition, "1")
    }

    moveFab(fhPosition) {
        this._fh.classList.add("final-fab-pos");
        document.documentElement.style.setProperty("--move-value-a", 'translateY(' + fhPosition + 'px)' )
        document.documentElement.style.backgroundColor="green";
        console.log(this._oldPosition, "3")
    }


    /*
    * This is where the touch ends, 
    * In here we can determine the direction, speed and distance of 
    * the position of the dropped element relative to its start point
    * which allows us to determine where the element should snap    
    */

    touchEnd(e) {
        //this._fh.style.bottom = null;
        //Find the direction the user swiped, useful for staging later
        this._clientYNew = e.changedTouches[0].clientY;

        let difference = this._clientY - this._clientYNew;
        if(this._lock == false) {
            if(difference == 0) {
                this._swipeDirection = 3; //no swipe, reject and give a fake value
            } 
            else if(difference > 1) {
                this._swipeDirection = 0; //upward swipe
            }
            else if(difference == 0) {
                this._swipeDirection = 3; //no swipe, reject and give a fake value
            }
            else if(difference < 0) {
                this._swipeDirection = 1; //downward swipe
            }
            else if(difference == 0) {
                this._swipeDirection = 3; //no swipe, reject and give a fake value
            }

            //Manage upward swipes
            if(this._swipeDirection == '0' && this._snapPosition == 1) {
                this.expandFull();
                this._snapPosition = 2;
            }
            if(this._swipeDirection == '0' && this._snapPosition == 0) {
                this.expandHalf();
                this._snapPosition = 1;
                if(difference > 300) {
                    this.expandFull();
                    this._snapPosition = 2;
                }
            }
            if(this._swipeDirection == '0' && this._snapPosition == 2) {
                this.expandFull();
            }

            //Manage downward swipes
            if(this._swipeDirection == '1' && this._snapPosition == 1) {
                this.closeFull();
                this._snapPosition = 0;
            }
            if(this._swipeDirection == '1' && this._snapPosition == 2) {
                this.expandHalf();
                this._snapPosition = 1;
                if(difference < -400) {
                    this.closeFull();
                    this._snapPosition = 0;
                }
            }
            if(this._swipeDirection == '1' && this._snapPosition == 0) {
                this.closeFull();
                this._snapPosition = 0;
            }
        }
    }
    cancelTouch(e) {
        console.log("CANCELLED");
    }
}

