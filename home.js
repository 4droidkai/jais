/* ========================================
   PASSWORD PROTECTION
======================================== */

const passwordUnlocked =
    sessionStorage.getItem("passwordUnlocked");

if (passwordUnlocked !== "true") {

    window.location.replace("index.html");

} else {

    /*
     * Consume the permission.
     *
     * This means:
     * index → password → home
     *
     * but refreshing home.html
     * requires the password again.
     */

    sessionStorage.removeItem("passwordUnlocked");

}


/* ========================================
   PAGE ELEMENTS
======================================== */

const timerWrapper =
    document.getElementById("timerWrapper");

const content =
    document.querySelector(".content");

const quadrants =
    document.querySelectorAll(".quadrant");

const cardWrapper =
    document.getElementById("cardWrapper");

const monthsaryIntro =
    document.getElementById("monthsaryIntro");

const monthsaryText =
    document.getElementById("monthsaryText");


/* ========================================
   TIMER
======================================== */

const startDate =
    new Date("August 10, 2026 15:03:00");

let timerStarted = false;
let timerInterval = null;


/*
 * Show the timer at zero.
 */

function showZero() {

    document.getElementById("days").textContent =
        "0";

    document.getElementById("hours").textContent =
        "00";

    document.getElementById("minutes").textContent =
        "00";

    document.getElementById("seconds").textContent =
        "00";
}


/*
 * Convert seconds into
 * days / hours / minutes / seconds.
 */

function getTimeValues(totalSeconds) {

    const days =
        Math.floor(
            totalSeconds / 86400
        );

    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;


    return {
        days,
        hours,
        minutes,
        seconds
    };
}


/*
 * Display a timer value.
 */

function displayTime(totalSeconds) {

    const time =
        getTimeValues(totalSeconds);


    document.getElementById("days").textContent =
        time.days;


    document.getElementById("hours").textContent =
        String(time.hours).padStart(2, "0");


    document.getElementById("minutes").textContent =
        String(time.minutes).padStart(2, "0");


    document.getElementById("seconds").textContent =
        String(time.seconds).padStart(2, "0");

}


/*
 * Calculate and display the
 * actual elapsed time.
 */

function updateTimer() {

    const now =
        new Date();


    const difference =
        Math.max(
            0,
            Math.floor(
                (now - startDate) / 1000
            )
        );


    displayTime(difference);

}


/*
 * Animate from ZERO
 * to the actual elapsed time.
 */

function animateTimer() {

    const now =
        new Date();


    const targetSeconds =
        Math.max(
            0,
            Math.floor(
                (now - startDate) / 1000
            )
        );


    if (targetSeconds <= 0) {

        showZero();

        return;

    }


    /*
     * 2 second count-up animation.
     */

    const duration = 2000;

    const animationStart =
        performance.now();


    function animate(currentTime) {

        const elapsed =
            currentTime - animationStart;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        /*
         * Ease-out:
         * fast at first,
         * slower near the end.
         */

        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const currentSeconds =
            Math.floor(
                targetSeconds *
                easedProgress
            );


        displayTime(currentSeconds);


        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        } else {

            /*
             * End exactly on the
             * real current time.
             */

            updateTimer();


            /*
             * Continue normally.
             */

            timerInterval =
                setInterval(
                    updateTimer,
                    1000
                );

        }

    }


    requestAnimationFrame(
        animate
    );

}


/*
 * Start the timer.
 */

function startTimer() {

    if (timerStarted) {
        return;
    }


    timerStarted = true;


    /*
     * Always begin visually at zero.
     */

    showZero();


    /*
     * Then animate to the
     * real elapsed time.
     */

    animateTimer();

}


/*
 * Timer stays at zero while
 * the intro is showing.
 */

showZero();


/* ========================================
   MONTHSARY INTRO
======================================== */

if (
    monthsaryIntro &&
    monthsaryText
) {

    monthsaryText.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            /*
             * Prevent multiple clicks
             * during the animation.
             */

            if (
                monthsaryIntro.classList.contains(
                    "breaking"
                )
            ) {

                return;

            }


            /*
             * Start the timer's
             * ZERO → REAL TIME animation.
             */

            startTimer();


            /*
             * Start intro animation.
             */

            monthsaryIntro.classList.add(
                "breaking"
            );


            /*
             * Remove intro after
             * its 1 second animation.
             */

            setTimeout(
                function() {

                    monthsaryIntro.remove();

                },
                1000
            );

        }
    );

}


/* ========================================
   SCROLL EFFECT
======================================== */

window.addEventListener(
    "scroll",
    function() {

        const scrolled =
            window.scrollY > 20;


        /*
         * Move timer to the
         * bottom-left when scrolling.
         */

        if (timerWrapper) {

            timerWrapper.classList.toggle(
                "scrolled",
                scrolled
            );

        }


        /*
         * Fade and move the
         * homepage introduction.
         */

        if (content) {

            const fade =
                Math.min(
                    window.scrollY / 250,
                    1
                );


            const move =
                Math.min(
                    (window.scrollY / 250) * 35,
                    35
                );


            content.style.opacity =
                1 - fade;


            content.style.transform =
                `translateY(-${move}px)`;

        }

    }
);


/* ========================================
   QUADRANT EXPANSION
======================================== */

quadrants.forEach(
    function(quadrant) {

        quadrant.addEventListener(
            "click",
            function(event) {

                /*
                 * IMPORTANT:
                 *
                 * If the click happened inside
                 * the fullscreen content, do NOT
                 * let the quadrant click handler
                 * do anything.
                 *
                 * This allows the close button,
                 * card, Spotify, photos, etc.
                 * to have their own behavior.
                 */

                if (
                    event.target.closest(
                        ".fullscreen-content"
                    )
                ) {

                    return;

                }


                /*
                 * Close other quadrants.
                 */

                quadrants.forEach(
                    function(other) {

                        if (
                            other !== quadrant
                        ) {

                            other.classList.remove(
                                "expanded"
                            );

                        }

                    }
                );


                /*
                 * Expand clicked quadrant.
                 */

                quadrant.classList.add(
                    "expanded"
                );


                document.body.classList.add(
                    "section-open"
                );

            }
        );

    }
);


/* ========================================
   CLOSE BUTTONS
======================================== */

/*
 * Your HTML uses:
 *
 * class="close-section"
 *
 * NOT:
 *
 * class="close"
 */

document
    .querySelectorAll(".close-section")
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const quadrant =
                        button.closest(
                            ".quadrant"
                        );


                    if (quadrant) {

                        quadrant.classList.remove(
                            "expanded"
                        );

                    }


                    document.body.classList.remove(
                        "section-open"
                    );

                }
            );

        }
    );


/* ========================================
   LETTER CARD
======================================== */

if (cardWrapper) {

    cardWrapper.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            cardWrapper.classList.toggle(
                "open"
            );

        }
    );

}