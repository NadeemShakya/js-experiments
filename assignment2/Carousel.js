// declaring variables
let leftDirection = true;
let rightDirection = false;
const IMAGE_HEIGHT = 300;
const IMAGE_COUNT = 4;
const FPS = 60;
const CAROUSEL_CONTAINER_WIDTH = 49; // 49view port width.
const SLIDER_ARROW_WIDTH = SLIDER_ARROW_HEIGHT = 40;

class Carousel {
  constructor(carouselContainer, carouselImgWrapper, animationTime, holdTime) {

    this.ANIMATION_TIME = animationTime; // set the transition animation time.
    this.HOLD_TIME = holdTime;      // set the image hold(display) time.
    this.currentIndex = 0;          // set currentImage index.
    this.marginLeft = 0;            // set marginLeft property to 0 initially.

    // defining some booleans.
    this.isHolding = false;         
    this.isTransiting = false;
    this.isButtonTransiting = false;
    this.isAutomaticAnimation;

    // accessing DOM elements.
    this.carouselContainer = carouselContainer;
    this.carouselImgWrapper = carouselImgWrapper;

    // setting css properties

    // styling carousel container
    this.carouselContainer.style.width = `${CAROUSEL_CONTAINER_WIDTH}vw`;
    this.carouselContainer.style.height = `${IMAGE_HEIGHT}px`;
    this.carouselContainer.style.overflow = "hidden";
    this.carouselContainer.style.position = "relative";
    this.carouselContainer.style.float = "left";
    this.carouselContainer.style.marginLeft = this.carouselContainer.style.marginRight = "auto";
    this.carouselContainer.style.marginTop = this.carouselContainer.style.marginBottom = `${0}px`;

    // get the image node collections.
    this.images = this.carouselImgWrapper.querySelectorAll('img');

    // appending arrows

    // appending left arrow.
    this.leftButton = document.createElement('div');
    this.imgHolder = document.createElement('img');
    this.imgHolder.src = `./images/left-arrow.png`;
    this.imgHolder.style.height = `${SLIDER_ARROW_HEIGHT}px`;
    this.imgHolder.style.width = `${SLIDER_ARROW_WIDTH}px`;
    this.imgHolder.style.marginTop = `${20}px`;
    this.leftButton.appendChild(this.imgHolder);
    this.leftButton.className = "leftSliderArrow";
    this.leftButton.style.position = "absolute";
    this.leftButton.style.display = "block";
    this.leftButton.style.height = `${80}px`;
    this.leftButton.style.width = `${50}px`;
    this.leftButton.style.top = `${50}%`;
    this.leftButton.style.transform = `translate(${0}, ${-50}%)`;
    this.leftButton.style.background= `rgba(${255}, ${255}, ${255}, ${0.6})`;
    this.leftButton.style.cursor = `pointer`;
    this.carouselContainer.appendChild(this.leftButton);     

    // appending right arrow.
    this.rightButton = document.createElement('div');
    this.imgHolder = document.createElement('img');
    this.imgHolder.src = `./images/right-arrow.png`;
    this.imgHolder.style.height = `${SLIDER_ARROW_HEIGHT}px`;
    this.imgHolder.style.width = `${SLIDER_ARROW_WIDTH}px`;
    this.imgHolder.style.marginTop = `${20}px`;
    this.imgHolder.style.marginLeft = `${10}px`;
    this.rightButton.appendChild(this.imgHolder);
    this.rightButton.className = "rightSliderArrow";
    this.rightButton.style.position = "absolute";
    this.rightButton.style.display = "block";
    this.rightButton.style.height = `${80}px`;
    this.rightButton.style.width = `${50}px`;
    this.rightButton.style.top = `${50}%`;
    this.rightButton.style.right = `${0}px`;
    this.rightButton.style.transform = `translate(${0}, ${-50}%)`;
    this.rightButton.style.background= `rgba(${255}, ${255}, ${255}, ${0.6})`;
    this.rightButton.style.cursor = `pointer`;
    this.carouselContainer.appendChild(this.rightButton);   

    // appending indicator dots holder container.
    this.dotHolder = document.createElement('div');
    this.dotHolder.className = "this.dotHolder";
    this.dotHolder.style.display = "inline-block";
    this.dotHolder.style.position = "absolute";
    this.dotHolder.style.left =  `${50}%`;
    this.dotHolder.style.transform = `translate(${-50}%, ${0}%)`;
    this.dotHolder.style.bottom =  `${0}px`;
    this.dotHolder.margin = `${0}, auto`;
    this.carouselContainer.appendChild(this.dotHolder);
    this.dot;

    // append indicator dots.
    this.appendIndicatorDots();
    this.init();
    this.initializeImageStyle();
  }

  // set the carousel's images styling.
  initializeImageStyle() {

    for(let i = 0; i < this.images.length; i++) {

      this.images[i].style.width = `${this.carouselContainer.clientWidth}px`;
      this.images[i].style.height = `${this.carouselContainer.clientHeight}px`;
      this.images[i].style.marginRight = `${-4}px`;
    }
  }

  // add indicator dots.
  appendIndicatorDots() {

    for(let i = 0; i < IMAGE_COUNT; i++) {
      this.dot = document.createElement('div');
      this.dot.className = "dot";
      this.dot.style.display = "inline-block";
      this.dot.style.height = `${10}px`;
      this.dot.style.width = `${10}px`;
      this.dot.style.background= `rgba(${255}, ${255}, ${255}, ${0.7})`;
      this.dot.style.borderRadius = `${50}%`;
      this.dot.style.marginRight = `${5}px`;
      this.dot.style.cursor = `pointer`;
      this.dotHolder.appendChild(this.dot);
      this.dot.style.left = `${i * 20}px`;
      this.dot.addEventListener('click', () => {
        if(!this.isTransiting) {

          this.jumpToImage(i);
          clearInterval(this.isAutomaticAnimation);
          this.isAutomaticAnimation = null;
        }      
      });
    }
  }

  // move carousel in left direction.
  moveInLeftDirection() {

    if(this.currentIndex === IMAGE_COUNT - 1) {
      this.transition(this.currentIndex, 0);
      this.currentIndex = 0;
    }else {
      this.transition(this.currentIndex, this.currentIndex + 1)
      this.currentIndex++;
    }
  }

  // move carousel in right direction.
  moveInRightDirection() {
    if(this.currentIndex == 0) {
      this.transition(this.currentIndex, IMAGE_COUNT - 1);
      this.currentIndex = IMAGE_COUNT - 1;
    }else {
      this.transition(this.currentIndex, this.currentIndex - 1)
      this.currentIndex--;
    }
  }

  // initialize event handlers and intervals.
  init() {

    // event listener attachment to leftButton.
    this.leftButton.addEventListener("click",() => {

      if(!this.isTransiting) {
        this.isButtonTransiting = true;
        this.moveInRightDirection();
        clearInterval(this.isAutomaticAnimation);
        this.isAutomaticAnimation = null;
      }
    });

    // event listener attachment to right button.
    this.rightButton.addEventListener("click",() => {

      if(!this.isTransiting) {
        this.isButtonTransiting = true;
        this.moveInLeftDirection();
        clearInterval(this.isAutomaticAnimation);
        this.isAutomaticAnimation = null;
      }
    });

    // change the indicator dots' color depending on current image index.
    setInterval(() => {

      var tempDot = this.carouselContainer.querySelector(`.dot:nth-child(${this.currentIndex+1})`);
      var dots = this.carouselContainer.querySelectorAll('.dot');
      for(let i = 0; i < dots.length; i++) {
        dots[i].style.background = "rgba(255, 255, 255, 0.4)";
      }
      tempDot.style.background = "rgba(255, 20, 55, 1)";
    }, 16.667);

    // resize image on resizing the window. [for responsiveness]
    window.addEventListener("resize", () => {
     this.initializeImageStyle();        
    });

    // set the isAutomaticAnimation counter.
    this.isAutomaticAnimation = setInterval(this.animate.bind(this), this.HOLD_TIME);

  }

  // jumps from current image index to the next image index.
  jumpToImage(nextIndex) {
    this.transition(this.currentIndex, nextIndex);
    this.currentIndex = nextIndex;
  }

  // function to animate the slider
  animate() {

    // set the direction of animation.
    if(this.currentIndex == 0) {
      rightDirection = false;
      leftDirection = true;
    }else if(this.currentIndex == IMAGE_COUNT - 1) {
      leftDirection = false;
      rightDirection = true;
    }

    // animate the carousel depending on the direction.
    if(leftDirection) {
    var nextIndex = this.currentIndex + 1;
      this.transition(this.currentIndex, nextIndex)
      this.currentIndex++;
    }
    if(rightDirection) {
      var nextIndex = this.currentIndex - 1;
      this.transition(this.currentIndex, nextIndex)
      this.currentIndex--;
    } 

  }

  // function for transition of the images
  transition(currentIndex, nextIndex) {

    // set the old margin value.
    let oldMarginValue = this.marginLeft;

    // remove the automatic animation of the image now.
    clearInterval(this.isAutomaticAnimation);
    this.isAutomaticAnimation = null;

    // if no transition is taking place
    if(!this.isTransiting) {


    var transitionTimer = setInterval(() => {

    // set transitioning to true now.
    this.isTransiting = true;

    // compute the change in index.
    let indexDifference = (nextIndex - currentIndex);

    // compute the total margin(distance) to be moved.
    let distance = indexDifference * this.carouselContainer.clientWidth;

    // compute the Velocity with which the marginis to be moved.
    this.marginLeft -= (distance / this.ANIMATION_TIME);

    // set the marginLeft in the DOM element.
    this.carouselImgWrapper.style.marginLeft = `${this.marginLeft}px`;

    // compute the change in margin after shifting the image 
    // using certain velocity.

    let changeInMargin = oldMarginValue - this.marginLeft;

    if(indexDifference > 0) {
      // if changeInMargin is more or equal to distance, then 
      // the frame has reached its destination point.
      if(changeInMargin >= distance) {

        this.marginLeft = -nextIndex * this.carouselContainer.clientWidth;
        this.carouselImgWrapper.style.marginLeft = `${this.marginLeft}px`;

        // transition is finished
        this.isTransiting = false;

        // clear the transition timer.
        clearInterval(transitionTimer);

        // reset the automatic animation.
        if(!this.isAutomaticAnimation) {

        this.isAutomaticAnimation = setInterval(this.animate.bind(this), this.HOLD_TIME);
        }
      }
    }else if(indexDifference < 0) {
      if(changeInMargin <= distance) {

        this.marginLeft = -nextIndex * this.carouselContainer.clientWidth;
        this.carouselImgWrapper.style.marginLeft = `${this.marginLeft}px`;

        // transition is finished
        this.isTransiting = false;

        // clear the transition timer.
        clearInterval(transitionTimer);

        // reset the automatic animation.
        if(!this.isAutomaticAnimation) {

        this.isAutomaticAnimation = setInterval(this.animate.bind(this), this.HOLD_TIME);
        }
      }      
    }
    }, (1000 / FPS))     
    }
  }  
}