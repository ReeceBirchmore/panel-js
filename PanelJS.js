export class PanelJS {


    constructor() {      
        this._oldPosition = 0;
        this._snapPosition = 0
        this._lock = false;
        this._transitionSpeed = '0.2s';
        this._el = document.getElementById("panelJS"); //declare the element in use
        this._ns = document.getElementById("timesPreventScroll");
        this._fh = document.getElementById("fabholder");
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
        
        

        this.closeFull();
        
        //Run the initial start, make the element display as closed
    }


    noScrollStart(e) {
        this._lock = true;
        this._clientY = e.touches[0].clientY;
    }

    noScroll(e){
        this._clientYNew = e.touches[0].clientY;
        
        if(this._clientYNew > this._clientY && this._ns.scrollTop <= 0)
        {
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
        this._el.style.webkitTransition = "0s"; //reset transition
        this._el.style.transition = "0s"; //reset transition
        this._fh.style.webkitTransition = "0s";
        this._fh.style.transition = "0s";
        //console.log("TOUCHSTART")
        this._clientY = e.changedTouches[0].clientY; //initial touch point
    }


    touchMove(e) {
        this._clientYNew = e.touches[0].clientY; //new touch position coordinates
        this._fh.style.bottom = 0;
        //console.log("TOUCHMOVE")
        this._newPositionY = this._oldPosition + (this._clientY - this._clientYNew); //old position of the element + the difference in touch points
            //Define the limits of the user swiping to prevent the card coming off the screen
            if(this._newPositionY > 10 && this._newPositionY < window.innerHeight && this._lock == false) {
            this._el.style.webkitTransform = 'translateY(' + -this._newPositionY + 'px)';
            this._el.style.transform = 'translateY(' + -this._newPositionY + 'px)';
            this._el.style.mozTransform = 'translateY(' + -this._newPositionY + 'px)';
            this._el.style.oTransform = 'translateY(' + -this._newPositionY + 'px)';


            //Work out inner height, halve it
            let mathsNum = window.innerHeight / 2;

            if(this._newPositionY < mathsNum) {
            let fhPosition = -this._newPositionY -10;    
            this._fh.style.webkitTransform = 'translateY(' + fhPosition + 'px)';
            this._fh.style.transform = 'translateY(' + fhPosition + 'px)';
            this._fh.style.mozTransform = 'translateY(' + fhPosition + 'px)';
            this._fh.style.oTransform = 'translateY(' + fhPosition + 'px)';
            }
        } else {
            //console.log("Do not draw")
        }
    }


    //stage 2 expansion
    expandFull() {
        this._el.style.webkitTransition = this._transitionSpeed;
        this._el.style.transition = this._transitionSpeed;
        this._el.style.transform = 'translateY(-100%)';
        this._el.style.webkitTransform = 'translateY(-100%)';
        this._el.style.backgroundColor = "brown";
        this.coolMathGames(this._stage2Size);
        this._oldPosition = this._stagedPosition;
    }
    //stage 1 expansion
    expandHalf() {
        this._el.style.webkitTransition = this._transitionSpeed;
        this._el.style.transition = this._transitionSpeed;
        this._el.style.transform = 'translateY(-50%)';
        this._el.style.webkitTransform = 'translateY(-50%)';
        this._el.style.backgroundColor = "green";
        this.coolMathGames(this._stage1Size);
        this._oldPosition = this._stagedPosition;

        let fhPosition = -this._oldPosition -10;  
        this._fh.style.webkitTransition = this._transitionSpeed;
        this._fh.style.transition = this._transitionSpeed;
        this._fh.style.webkitTransform = 'translateY(' + fhPosition + 'px)';
        this._fh.style.transform = 'translateY(' + fhPosition + 'px)';
        this._fh.style.mozTransform = 'translateY(' + fhPosition + 'px)';
        this._fh.style.oTransform = 'translateY(' + fhPosition + 'px)';

    }
    //stage 0 expansion
    closeFull() {
        this._el.style.webkitTransition = this._transitionSpeed;
        this._el.style.transition = this._transitionSpeed;
        this._el.style.transform = 'translateY(-20%)';
        this._el.style.webkitTransform = 'translateY(-20%)';
        this._el.style.backgroundColor = "blue";
        this.coolMathGames(this._stage0Size);
        this._oldPosition = this._stagedPosition;

        let fhPosition = -this._oldPosition -10;  
        this._fh.style.webkitTransition = this._transitionSpeed;
        this._fh.style.transition = this._transitionSpeed;
        this._fh.style.webkitTransform = 'translateY(' + fhPosition + 'px)';
        this._fh.style.transform = 'translateY(' + fhPosition + 'px)';
        this._fh.style.mozTransform = 'translateY(' + fhPosition + 'px)';
        this._fh.style.oTransform = 'translateY(' + fhPosition + 'px)';
    }


    /*
    * This is where the touch ends, 
    * In here we can determine the direction, speed and distance of 
    * the position of the dropped element relative to its start point
    * which allows us to determine where the element should snap    
    */

    touchEnd(e) {
        //Find the direction the user swiped, useful for staging later
        this._clientYNew = e.changedTouches[0].clientY;

        let difference = this._clientY - this._clientYNew;
        if(this._lock == false) {
            if(difference == 0) {
                this._swipeDirection = 3; //no swipe, reject and give a fake value
            } 
            else if(difference > 100) {
                this._swipeDirection = 0; //upward swipe
            }
            else if(difference > 0) {
                this._swipeDirection = 3; //no swipe, reject and give a fake value
            }
            else if(difference < 100) {
                this._swipeDirection = 1; //downward swipe
            }
            else if(difference < 0) {
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
        alert("CANCELLED");
    } 
}