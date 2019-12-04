/*eslint no-undef: 1*/

import EventCard from '../EventCard';
import {mapState} from 'vuex';

export default {
    components: {
        'event-card': EventCard
    },
    data() {
        return {
            scroller: this.$zenscroll.createScroller(this.scrollBox),
            scrollCounter: 0,
        };
    },
    computed: {
        scrollBox() {
            return document.body.querySelector('.scrollbox');
        },
        scrollInterval() {
            const card1 = this.scrollBox.querySelector('.event-card:first-child');
            const card2 = this.scrollBox.querySelector('.event-card:nth-child(2)');

            const gap = card2.offsetLeft - (card1.offsetWidth + card1.offsetLeft);
            const cardWidth = card1.offsetWidth;
            const numCardsVisible = Math.floor(this.scrollBox.clientWidth / (cardWidth + gap));
            
            // All that, just to get how far we need to scroll. Yeesh.
            return numCardsVisible * (cardWidth + gap);
        },
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
        smoothScrollAmount() {
            return this.scrollInterval / 100;
        },
        ...mapState('events', [
            'eventList'
        ])
    },
    methods: {
        goRight() {
            if(this.supportsSmoothScroll) {
                this.scrollBox.scrollLeft += this.scrollInterval;
            }
            else {
                this.smoothScroll(1);
            }
        },
        goLeft() {
            if(this.supportsSmoothScroll) {
                this.scrollBox.scrollLeft -= this.scrollInterval;
            }
            else {
                this.smoothScroll(-1);
            }
        },
        smoothScroll(direction, time = 200, start = this.scrollBox.scrollLeft) {
            const eAmt = direction >= 0 ? this.smoothScrollAmount : -this.smoothScrollAmount;
            let curTime = 0;
            this.scrollCounter = 0;
            
            while(curTime < time) {
                window.setTimeout(this.scrollCalc, curTime, this.scrollCounter, eAmt, start);
                curTime += time / 100;
                this.scrollCounter++;
            }
        },
        scrollCalc(sc, eAmt, start, element = this.scrollBox) {
            element.scrollLeft = (eAmt * sc) + start;
        }
    }
}