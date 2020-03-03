/*eslint no-console: 1*/

/**
 * The script for the EntryImage component. Mostly a container for an
 * <img> tag, with some dynamic attributes and display properties.
 * 
 * @author Mike W. Leavitt
 * @version 1.0.0
 */

import {mapState, mapGetters} from 'vuex';

export default {
    // Image src and the name of the production are passed from the
    // parent EventCard or EventEntry component.
    props: {
        src: String,
        name: String,
    },

    data() {
        return {};
    },

    computed: {
        // Whether or not to display the image as a thumbnail.
        isThumb() {
            return this.format == 'thumb';
        },
        // Whether or not the image is on an EventCard
        isCard() {
            return this.format == 'card';
        },
        // Whether the image has a src attribute
        hasSrc() {
            return this.src != '';
        },
        viewWidth() {
            return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        },
        imgStyleIE() {
            const val = this.viewWidth / 5;
            if (this.isIE) {
                return { width: `${val}px !important` };
            } 
            else {
                return {}
            }
        },
        ...mapState('events', [
            'format'
        ]),
        ...mapGetters('events', [
            'isIE',
        ])
    },

    methods: {
        doneLoad() {
            this.$emit('imgDone', this.$refs.img.naturalHeight);
        }
    }

    /*
    mounted() {
        this.$nextTick(() => {
            this.$emit('imgLoad');
        });
    }
    */
}