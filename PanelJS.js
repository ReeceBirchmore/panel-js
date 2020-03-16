import { BehaviorSubject, Observable } from 'rxjs';


export class PanelJS {


    constructor() {      

        this._snapPositionSubject = new BehaviorSubject(0);
        this._currentSnapPosition = this._snapPositionSubject.asObservable();

        this._oldPosition = 0;

        

        this._snapPosition = 0;
        this._lock = false;
        this._transitionSpeed = '0.2s';
        this._el = document.getElementById("panelJS"); //declare the element in use
        
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
            //Do nothing
        }
        //Check if no scroll element exists
        if(this._ns){
            this._ns.addEventListener("touchmove", evt => this.noScroll(evt), true);
            this._ns.addEventListener("touchstart", evt => this.noScrollStart(evt), true);
        }

        this.closeFull();
        //Run the initial start, make the element display as closed
    }




    displayTimesLock() {
        this._ns = document.getElementById("timesPreventScroll");
        if(this._ns){
            this._ns.addEventListener("touchmove", evt => this.noScroll(evt), true);
            this._ns.addEventListener("touchstart", evt => this.noScrollStart(evt), true);
        }
    }


    noScrollStart(e) {
        this._lock = true;
        this._clientY = e.touches[0].clientY;
    }

    noScroll(e){
        this._clientYNew = e.touches[0].clientY;
        this._ns.style.overflow = "scroll";
        if(this._snapPosition === 1 && this._ns.scrollTop > 0 && this._clientYNew < this._clientY) {
            this._lock = false; 
            this._ns.style.overflow = "hidden";
            this.touchMove(e);

        } else if(this._clientYNew > this._clientY && this._ns.scrollTop <= 0) {
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
        this._stageSettingSize = -(-75 / 100) //work out the size for the settings
        this._mathsNum = window.innerHeight / 2; //grab the inner window height for the fabs


        this._stagedPosition = window.innerHeight * stageSize; //determine the position for snapped element
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
        document.documentElement.style.setProperty("--map-blur-transition", "0s");
        this._clientY = e.changedTouches[0].clientY; //initial touch point
        this._start = Date.now(); //start the timer for speed calculation
    }


    touchMove(e) {
        this._clientYNew = e.touches[0].clientY; //new touch position coordinates
        this._fh.style.bottom = 0;

        window.webkitRequestAnimationFrame(evt => this.animateMovement(this._clientYNew));
       
        e.preventDefault();
        
    }


    
    animateMovement(clientYNew) {


        this._newPositionY = this._oldPosition + (this._clientY - clientYNew); //old position of the element + the difference in touch points
        //Define the limits of the user swiping to prevent the card coming off the screen
        if(this._newPositionY > 10 && this._newPositionY < window.innerHeight && this._lock == false) {
            document.documentElement.style.setProperty("--move-value", 'translateY(' + -this._newPositionY + 'px)');
            document.documentElement.style.setProperty("--map-blur", `blur(${(this._newPositionY-170)/50}px)`);
            if(this._newPositionY < this._mathsNum) {
                document.documentElement.style.setProperty("--move-value-a", 'translateY(' + -this._newPositionY + 'px)');
                document.documentElement.style.setProperty("--map-blur", `blur(${(this._newPositionY-170)/50}px)`);
            }
        } else {
            //Do nothing
        }
    }





    //settingsLikePanel expansion
    expandSettings() {
        this.animatePanel('75', "silver", this._stageSettingSize);
        this._snapPosition = 4;
        this.mapBlur();
    }

    //stage 2 expansion
    expandFull() {
        this.animatePanel('100', "brown", this._stage2Size);
        this._snapPosition = 2;   
    }

    //stage 1 expansion
    expandHalf() {
        this.animatePanel('50', "green", this._stage1Size);
        let fhPosition = -this._oldPosition;  
        this.moveFab(fhPosition);
        this._snapPosition = 1;        
    }
    
    //stage 0 expansion
    closeFull() {
        this.animatePanel('20', "blue", this._stage0Size);
        let fhPosition = -this._oldPosition;  
        this.moveFab(fhPosition);
        this._snapPosition = 0;   
    }

    animatePanel(elPosition, color, stageSize) {
        if(!this._el.classList.contains("move")) {
            this._el.classList.add("move");
        }
        document.documentElement.style.setProperty("--transition-value", this._transitionSpeed);
        document.documentElement.style.setProperty("--move-value", 'translateY(-'+ elPosition +'%)');
        
        /* Weird ass hacky fix to get it working on Safari, if the bg colour
        isn't the colour passed thru, make it purple, tbh this shouldn't work
        but it does, so dont fuckin break it please */

        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

        if(iOS) {
            if(document.getElementById("panelJS").style.backgroundColor == color) {
                document.getElementById("panelJS").style.backgroundColor = "purple";
            } else {
            document.getElementById("panelJS").style.backgroundColor = color
            }
        }
        this.coolMathGames(stageSize);
        this._oldPosition = this._stagedPosition; 
    }

    moveFab(fhPosition) {
        this._fh.classList.add("final-fab-pos");
        document.documentElement.style.setProperty("--move-value-a", 'translateY(' + fhPosition + 'px)' )
        document.documentElement.style.backgroundColor="green";

        document.documentElement.style.setProperty("--map-blur", `blur(${(fhPosition-170)/50}px)`);


    }


    /*
    * This is where the touch ends, 
    * In here we can determine the direction, speed and distance of 
    * the position of the dropped element relative to its start point
    * which allows us to determine where the element should snap    
    */

    mapBlur() {
        document.documentElement.style.setProperty("--map-blur-transition", "0.5s");
        document.documentElement.style.setProperty("--map-blur", "blur(10px)");
    }

    touchEnd(e) {
        document.documentElement.style.setProperty("--map-blur-transition", "0.5s");
        this._clientYNew = e.changedTouches[0].clientY;
        let difference = this._clientY - this._clientYNew;
        const time = Date.now() - this._start;
        const speed = difference / time * 10; 

        //Find the direction the user swiped, useful for staging later

        if(this._lock == false) {
            if(difference == 0) {
                this._swipeDirection = 3; //no swipe, reject and give a fake value
            } 
            else if(difference > 1) {
                this._swipeDirection = 0; //upward swipe
                this.mapBlur();
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
            if(this._swipeDirection == '0' && this._snapPosition == 2) {
                this.expandFull();
            }


            if(this._swipeDirection == '0' && this._snapPosition == 1) {
                if(difference > 200) {
                this.expandFull();
                this._snapPosition = 2;

            } else {
                this.expandHalf();
                }
            }
            if(this._swipeDirection == '0' && this._snapPosition == 0) {
                                
                if(speed > 8 && difference > 40) {
                    this.expandFull();
                    this._snapPosition = 2;
                }

                else if (difference > 80) {
                    this.expandHalf();
                    this._snapPosition = 1;
 
                    } 
                else if(difference > 300) {
                    this.expandFull();
                    this._snapPosition = 2;
                   
                    } 
                else {
                    this.closeFull();
                    this._snapPosition = 0;
                }
            }
            


            //Settings page management
            if(this._swipeDirection == '0' && this._snapPosition == 4) {
                this.expandSettings();
                this._snapPosition = 4;
            }



            //Manage downward swipes



            //Settings page management



            if(this._swipeDirection == '1' && this._snapPosition == 0) {
                this.closeFull();
                this._snapPositionSubject.next(0);
                this._snapPosition = 0;
            }
            if(this._swipeDirection == '1' && this._snapPosition == 1) {
                this.closeFull();
                this._snapPositionSubject.next(0);
                this._snapPosition = 0;
            }

            if(this._swipeDirection == '1' && this._snapPosition == 2) {
                this.expandHalf();
                this._snapPosition = 1;
                if(difference < -400) {
                    this.closeFull();
                    this._snapPositionSubject.next(0);
                    this._snapPosition = 0;
                }
            }

            if(this._swipeDirection == '1' && this._snapPosition == 4) {
                this.expandSettings();
                this._snapPosition = 4;
                if(difference < -200) {
                    this.expandHalf();
                    this._snapPositionSubject.next(0);
                }
            }

            
        }
    }
    cancelTouch(e) {
        console.log("CANCELLED");
    }
}

