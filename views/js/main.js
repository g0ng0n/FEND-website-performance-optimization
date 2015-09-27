/**
 Welcome to the 60fps project! Your goal is to make Cam's Pizzeria website run
 jank-free at 60 frames per second.

 There are two major issues in this code that lead to sub-60fps performance. Can
 you spot and fix both?


 Built into the code, you'll find a few instances of the User Timing API
 (window.performance), which will be console.log()ing frame rate data into the
 browser console. To learn more about User Timing API, check out:
 http://www.html5rocks.com/en/tutorials/webperformance/usertiming/

 Creator:
 Cameron Pittman, Udacity Course Developer
 cameron *at* udacity *dot* com
 */

var sliderLabel = document.getElementById('pizzaSize');

/**
 * Changes the value for the size of the pizza above the slider
 */
function changeSliderLabel(size) {
    switch (size) {
        case '1':
            sliderLabel.innerHTML = 'Small';
            return;
        case '2':
            sliderLabel.innerHTML = 'Medium';
            return;
        case '3':
            sliderLabel.innerHTML = 'Large';
            return;
        default:
            console.log('bug in changeSliderLabel');
    }
}

/**
 * TODO: change to 3 sizes? no more xl?
 *  Changes the slider value to a percent width
 */
function sizeSwitcher(size) {
    switch (size) {
        case '1':
            return 0.25;
        case '2':
            return 0.3333;
        case '3':
            return 0.5;
        default:
            console.log('bug in sizeSwitcher');
    }
}

/**
 *  Returns the size difference to change a pizza element from one size to another. Called by changePizzaSlices(size).
 */
function determineDx(elem, size) {
    var oldWidth = elem.offsetWidth;
    var windowWidth = document.querySelector('#randomPizzas').offsetWidth;
    var oldSize = oldWidth / windowWidth;
    var newSize = sizeSwitcher(size);
    var dx = (newSize - oldSize) * windowWidth;
    return dx;
}

/**
 *  Iterates through pizza elements on the page and changes their widths
 */
function changePizzaSizes(size) {
    var pizzaContainer = document.getElementsByClassName('randomPizzaContainer');
    var dx = determineDx(pizzaContainer[0], size);
    var newWidth = (pizzaContainer[0].offsetWidth + dx) + 'px';
    for (var i = 0, l = pizzaContainer.length; i < l; i++) {
        pizzaContainer[i].style.width = newWidth;
    }
}


/**
 *  resizePizzas(size) is called when the slider in the 'Our Pizzas' section of the website moves.
 */
var resizePizzas = function(size) {

    window.performance.mark(MARK_START_RESIZE); // User Timing API function

    // Changes the value for the size of the pizza above the slider
    changeSliderLabel(size);
    changePizzaSizes(size);
    // User Timing API is awesome
    window.performance.mark(MARK_END_RESIZE);
    window.performance.measure(MEASURE_PIZZA_RESIZE, MARK_START_RESIZE, MARK_END_RESIZE);
    var timeToResize = window.performance.getEntriesByName(MEASURE_PIZZA_RESIZE);
    console.log('Time to resize pizzas: ' + timeToResize[0].duration + 'ms');
};

window.performance.mark(MARK_START_GENERATING); // collect timing data

// This for-loop actually creates and appends all of the pizzas when the page loads
var pizzasDiv = document.getElementById('randomPizzas');
for (var i = 2; i < 100; i++) {
    pizzasDiv.appendChild(pizzaElementGenerator(i));
}

// User Timing API again. These measurements tell you how long it took to generate the initial pizzas

window.performance.mark(MARK_END_GENERATING);


window.performance.measure(MEASURE_PIZZA_GENERATION, MARK_START_GENERATING, MARK_END_GENERATING);
var timeToGenerate = window.performance.getEntriesByName(MEASURE_PIZZA_GENERATION);
console.log('Time to generate pizzas on load: ' + timeToGenerate[0].duration + 'ms');
var frame = 0;
var lastScrollY = 0;
var animating = false;


/**
 *  Iterator for number of times the pizzas in the background have scrolled.
 *  Used by updatePositions() to decide when to log the average time per frame
 *
 *  Logs the average amount of time per 10 frames needed to move the sliding background pizzas on scroll.
 */
function logAverageFrame(times) { // times is the array of User Timing measurements from updatePositions()
    var numberOfEntries = times.length;
    var sum = 0;
    for (var i = numberOfEntries - 1; i > numberOfEntries - 11; i--) {
        sum = sum + times[i].duration;
    }
    console.log('Average time to generate last 10 frames: ' + sum / 10 + 'ms');
}


/**
 *  The following code for sliding background pizzas was pulled from Ilya's demo found at:
 *  https://www.igvita.com/slides/2012/devtools-tips-and-tricks/jank-demo.html
 *
 *  Moves the sliding background pizzas based on scroll position
 */
function updatePositions() {
    animating = false;
    frame++;
    window.performance.mark(MARK_START_FRAME);
    var currentScrollY = lastScrollY;

    var items = document.getElementsByClassName('.mover');
    for (var i = 0; i < items.length; i++) {
        var phase = Math.sin((currentScrollY / 1250) + (i % 5));
        items[i].style.transform = 'translateX(' + 100 * phase + 'px)'; //animate on translate property - increased performance
    }


    // User Timing API to the rescue again. Seriously, it's worth learning.
    // Super easy to create custom metrics.
    window.performance.mark(MARK_END_FRAME);
    window.performance.measure(MEASURE_FRAME_DURATION, MARK_START_FRAME, MARK_END_FRAME);
    if (frame % 10 === 0) {
        var timesToUpdatePosition = window.performance.getEntriesByName(MEASURE_FRAME_DURATION);
        logAverageFrame(timesToUpdatePosition);
    }
}


/**
 *  function That request the frame to scroll using the requestionAnimationFrame function
 */
function requestFrame() {
    if (!animating) {
        requestAnimationFrame(updatePositions);
    }
    animating = true;
}


/**
 *  Function that calls the requestFrame function
 */
function onScroll() {
    lastScrollY = window.scrollY;
    requestFrame();
}


/**
 *  runs updatePositions on scroll.
 */
window.addEventListener('scroll', onScroll, false);

//

/**
 *  Generates the sliding pizzas when the page loads.
 */
document.addEventListener('DOMContentLoaded', function() {
    var screenWidth = screen.availWidth;
    var screenHeight = screen.availHeight;
    var s = 256;
    var cols = (screenWidth / s) + 1;
    var rows = screenHeight / s; // Generate pizza total based on available screen dimensions
    var totalPizza = Math.ceil(cols * rows); // ceil err on the side of good visuals
    var movingPizzas = document.getElementById('movingPizzas1');
    for (var i = 0; i < totalPizza; i++) {
        var elem = document.createElement('img');
        elem.className = 'mover';
        elem.src = PIZZA_IMAGE;
        //using traslate in order to be more performant
        elem.style.transform = 'translate3d(0, 0, 0) translate(0px)';
        elem.height = '100';
        elem.width = '73';
        elem.style.height = elem.height + 'px';
        elem.style.width = elem.width + 'px';
        elem.basicLeft = (i % cols) * s;
        elem.style.left = elem.basicLeft + 'px';
        elem.style.top = (Math.floor(i / cols) * s) + 'px';
        movingPizzas.appendChild(elem);
    }
    updatePositions();
});


