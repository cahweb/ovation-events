/*eslint no-undef: 1*/

/**
 * The script for the ScrollBox component, which holds the EventCards and
 * allows the user to scroll through them horizontally in a way that
 * doesn't look like crap
 * 
 * @author Mike W. Leavitt
 * @version 1.0.0
 */

import EventCard from '../EventCard';
import {mapState} from 'vuex';

// FontAwesome stuff
import {library} from '@fortawesome/fontawesome-svg-core';
import {faAngleRight, faAngleLeft} from '@fortawesome/free-solid-svg-icons';

library.add(faAngleRight, faAngleLeft);

export default {
    components: {
        'event-card': EventCard
    },
    data() {
        return {
            maxCardHeight: 0,
            cardsLoaded: 0,
            isRButtonDown: false,
            isLButtonDown: false,
        };
    },
    computed: {
        // A reference to the ScrollBox DOM element.
        scrollBox() {
            return document.body.querySelector('.scrollbox');
        },
        // The interval we'll have to scroll, in pixels. We determine
        // this programmatically based on the width of the ScrollBox
        // and the width/spacing of the EventCards.
        scrollInterval() {
            // Reference to the first card
            const card1 = this.scrollBox.querySelector('.event-card:first-child');
            // Reference to the second card
            const card2 = this.scrollBox.querySelector('.event-card:nth-child(2)');

            // Determine the gap between them
            const gap = card2.offsetLeft - (card1.offsetWidth + card1.offsetLeft);
            // Determine the width of a single card.
            const cardWidth = card1.offsetWidth;
            // Determine the number of cards that are fully visible
            // in the ScrollBox
            const numCardsVisible = Math.floor(this.scrollBox.clientWidth / (cardWidth + gap));
            
            // The interval is the width of one card plus the gap between
            // cards multiplied by the number of cards we can see.
            return numCardsVisible * (cardWidth + gap);

            // All that, just to get how far we need to scroll. Yeesh.
        },
        // Checks to see if the user's browser supports the CSS
        // scroll-behavior property (only Firefox and Chrome right now)
        supportsSmoothScroll() {

            // Check if Firefox or Chrome, respectively.
            if( typeof InstallTrigger !== 'undefined'
                || (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)))
            {
                return true;
            }
            else {
                return false;
            }
        },
        // If we're doing the fake smooth scrolling, this is the amount
        // we'll scroll each tick
        smoothScrollAmount() {
            return this.scrollInterval / 100;
        },
        ...mapState('events', [
            'eventList'
        ])
    },
    methods: {
        /**
         * Fires when the user clicks the right arrow button.
         */
        goRight() {
            if(this.supportsSmoothScroll) {
                this.scrollBox.scrollLeft += this.scrollInterval;
            }
            else {
                this.smoothScroll(1);
            }
        },
        /**
         * Fires when the user click the left arrow button.
         */
        goLeft() {
            if(this.supportsSmoothScroll) {
                this.scrollBox.scrollLeft -= this.scrollInterval;
            }
            else {
                this.smoothScroll(-1);
            }
        },
        /**
         * 
         * @param {number} direction Either 1 (right) or -1 (left)
         * @param {number} time  Amount of time the scroll should take,
         *                          in milliseconds
         * @param {number} start Our current position in the ScrollBox
         */
        smoothScroll(direction, time = 200, start = this.scrollBox.scrollLeft) {
            // Get our increment amount, with the apprpriate directional
            // sign
            const eAmt = direction >= 0 ? this.smoothScrollAmount : -this.smoothScrollAmount;
            // Set the elapsed time to zero and the tick counter to zero
            let curTime = 0,
                scrollCounter = 0;
            
            // while the current time is less than the max time of the
            // animation
            while(curTime < time) {
                // Set a series of incremented timers to scroll the window
                // along bit by bit
                window.setTimeout(this.scrollCalc, curTime, scrollCounter, eAmt, start);
                curTime += time / 100;
                scrollCounter++;
            }
        },
        /**
         * Handles setting the scroll position based on information
         * received from smoothScroll(), above.
         * 
         * @param {number} sc The current count of scheduled scroll events
         * @param {number} eAmt The increment amount
         * @param {number} start The starting position of the ScrollBox
         * @param {DOM Element} element A reference to the ScrollBox
         */
        scrollCalc(sc, eAmt, start, element = this.scrollBox) {
            element.scrollLeft = (eAmt * sc) + start;
        },

        cardLoad() {
            this.cardsLoaded++;
        },

        clickRespDown(direction) {
            switch(direction) {
                case 'right':
                    this.isRButtonDown = true;
                    break;
                case 'left':
                    this.isLButtonDown = true;
                    break;
            }
        },

        clickRespUp(direction) {
            switch(direction) {
                case 'right':
                    this.isRButtonDown = false;
                    break;
                case 'left':
                    this.isLButtonDown = false;
                    break;
            }
        },
    },
    watch: {
        cardsLoaded() {
            if (this.cardsLoaded == this.eventList.length) {
                this.$store.dispatch('events/updateCardHeight'/*, this.maxCardHeight*/);
            }
        },
    }
}