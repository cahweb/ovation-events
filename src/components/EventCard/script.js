/*eslint no-unreachable: 1*/

/**
 * The script for the EventCard component. Handles the data for
 * displaying an individual card. Scrolling behavior is handled in
 * the ScrollBox component.
 * 
 * @author Mike W. Leavitt
 * @version 1.0.0
 */

import EntryImage from '../EntryImage';
import {mapState, mapActions, mapGetters} from 'vuex';

export default {
    components: {
        'entry-image': EntryImage,
    },
    // An object containing the information for a single production.
    props: {
        info: Object
    },
    data() {
        return {
            // Default formatting object for Date.toLocaleDateString()
            dateFormat: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            // The language code for the given page (most likely 'en-us')
            lang: document.documentElement.lang,
            contentHeight: '',
            imgLoaded: false,
            imgHeight: 0,
            selfHeight: 0,
            displaySubtitle: '',
            titleFontSize: '',
            subtitleFontSize: '',
        };
    },
    computed: {
        // The URL for the individual production.
        url() {
            return `${this.ciUrl}${this.clientID}/production/${this.info.productionId}`;
        },

        minHeight() {
            return `height: ${this.cardHeight}px`;
        },

        isOffCampus() {
            return this.info.productionVenue.name !== 'University of Central Florida';
        },

        labelText() {
            let labelText = '';
            this.depts.forEach(dept => {
                if (dept == this.info.type) {
                    switch(dept) {
                        case 'Theatre UCF':
                            labelText = 'Theatre';
                            break;
                        case 'UCF Music':
                            labelText = 'Music';
                            break;
                        case 'UCF Art Gallery':
                            labelText = 'UCF Art Gallery';
                            break;
                        case 'UCF Celebrates':
                            labelText = 'UCF Celebrates the Arts';
                            break;
                    }
                }
            });
            return labelText;
        },

        displayTitle() {
            //return this.info.productionName;
            const baseName = this.info.productionName;
            const patts = [
                /(Opening\sNight\sReception)/,
                /(:)/,
                /(\s-\s)/
            ];

            let output = "";

            let matches = null;
            patts.forEach(patt => {
                if(patt.test(baseName)) {
                    matches = baseName.match(patt);
                }
            });

            if(matches != null && matches[1] != 'Opening Night Reception') {
                const titleArr = baseName.split(matches[1]);
                if (titleArr.length > 1) {
                    let subtitle = '';
                    titleArr.forEach((item, index) => {
                        if (index > 0 ) {
                            if (index == 1 && item[0] == ' ') {
                                subtitle += item.substring(1);
                            }
                            else {
                                subtitle += item;
                            }
                        }
                    });

                    this.displaySubtitle = subtitle;
                }
                output = titleArr[0].trim();
            }
            else if (matches != null && matches[1] == 'Opening Night Reception') {
                this.displaySubtitle = 'Opening Night Reception';
                output =  baseName.split(matches[1])[0];
            }
            else {
                output = this.info.productionName;
            }

            return output;

        },
        // Wrapper for makeDate() on the starting timestamp.

        // The advantage of doing these as separate computed properties
        // means that they'll only be evaluated if the information
        // changes--so probably only once each. Methods get evaluated
        // every time they're called.
        startDate() {
            return this.makeDate(this.info.firstPerformanceDate);
        },
        // Wrapper for makeDate() on the ending timestamp.
        endDate() {
            return this.makeDate(this.info.lastPerformanceDate);
        },
        // Determines the range of dates, if applicable, and returns
        // an appropriately formatted string.
        dateRange() {
            // Setting some defaults to make calls to
            // Date.toLocaleDateString() a bit less verbose
            const year = 'numeric',
                month = 'short',
                day = 'numeric';

            let returnStr = "";

            // If there's only one performance, we only need one date.
            if(this.singlePerformance) {
                returnStr = this.startDate.toLocaleDateString(this.lang, this.dateFormat);
            }
            // Testing to see if the years match. If so, we'll only
            // display the year once, at the end.
            else if(this.startDate.getFullYear() == this.endDate.getFullYear()) {
                returnStr = `${this.startDate.toLocaleDateString(this.lang, {month, day})} &ndash; `;

                // Testing to see if the months match. If so, we'll only
                // display the month once, at the beginning.
                if(this.startDate.getMonth() == this.endDate.getMonth()) {
                    let str = this.endDate.toLocaleDateString(this.lang, {day, year});

                    const s1 = str.indexOf(" ");

                    returnStr += str.slice(0, s1) + "," + str.slice(s1);
                }
                // If not, we'll display the date normally.
                else {
                    returnStr += this.endDate.toLocaleDateString(this.lang, this.dateFormat);
                }
            }
            // If all else fails, return both dates in full.
            else returnStr = `${this.startDate.toLocaleDateString(this.lang, this.dateFormat)} &ndash; ${this.endDate.toLocaleDateString(this.lang, this.dateFormat)}`;

            if (this.singlePerformance) {
                const timeHour = (this.startDate.getHours() > 12 ? this.startDate.getHours() - 12 : this.startDate.getHours());
                const timeMinutes = (this.startDate.getMinutes() > 0 ? ("0" + this.startDate.getMinutes()).slice(-2) : 0);
                const amPm = (this.startDate.getHours() > 11 ? "PM" : "AM");

                returnStr += `, ${timeHour}${timeMinutes ? `:${timeMinutes}` : ""}${amPm}`;
            }
            else {
                returnStr += `, <small>Multiple Performances</small>`;
            }

            // Return the result
            return returnStr;
        },
        // Determines if there is only one performance.
        singlePerformance() {
            return (this.info.firstPerformanceDate == this.info.lastPerformanceDate) || this.info.performanceIdIfOnlyOneEventAvailable !== null;
        },
        // Parses the ugly HTML we get from OvationTix into something
        // that looks less like a bag of @$$
        simpleDesc() {
            const rawHTML = new DOMParser()
                .parseFromString(this.info.productionDescription, 'text/html');
        
            let text = '';

            const maxLength = 80;
        
            const theatrePatt = /^Theatre\sUCF/;
            if (theatrePatt.test(this.info.seriesSuperTitle)) {

                let rawStr = this.info.productionDescription;

                let newStr = rawStr.replace(/<br\s?\/?>/g, "\n");
                newStr = newStr.replace(/<\/?[bi]>/g, "");
                newStr = newStr.replace(/<\/?div>/g, "");
                newStr = newStr.replace("\n\n", "\n");

                const directorPatt = /Directed\sby\s[\w\s]+\n/;

                const matches = newStr.match(directorPatt);

                if (matches.length) {
                    let i = newStr.indexOf(matches[0]) + matches[0].length;
                    
                    newStr = newStr.slice(i);

                    const blurbPatt = /^.+\./;
                    const blurbMatch = newStr.match(blurbPatt);

                    if (blurbMatch) {
                        let tmpText = blurbMatch[0].trim();
                        text = tmpText.replace("\n", "");
                    }
                }
            }
            else {
                text = rawHTML.body.textContent;
            }

            if (text.length > maxLength) {
                const cutoff = text.slice(0, maxLength).indexOf('.');
                if (cutoff !== -1) {
                    text = text.substring(0, cutoff + 1);
                }
                else {
                    const endPatt = /\b(\w+)\b\s?\w*$/;
                    const matches = text.substring(0, maxLength).match(endPatt);

                    if (matches != null) {
                        const seam = text.substring(0, maxLength).length - matches[0].length;
                        text = text.substring(0, seam) + matches[1] + '&hellip;';
                    }
                    else {
                        text = text.slice(0, maxLength);
                    }
                }
            }

            if (this.isIE) {
                if (text[text.length / 2] == ' '
                    || text[(text.length / 2) - 1] == ' '
                    || text[(text.length / 2) + 1] == ' '
                ) {
                    text = text.slice(0, text.length / 2) + '<br>' + text.slice(text.length / 2, text.length);
                }
                else {
                    text = text.slice(0, text.length / 2) + '-<br>' + text.slice(text.length / 2, text.length);
                }
            }
        
            return text;
        },
        
        ...mapState('events', [
            'ciUrl',
            'clientID',
            'format',
            'blurb',
            'cardHeight',
            'depts',
        ]),
        ...mapGetters('events', [
            'isIE',
        ])
    },

    methods: {
        /**
         * Turns a Unix timestamp into a JavaScript Date object.
         * 
         * @param {number} timestamp A Unix timestamp
         * 
         * @return {Date} A JavaScript Date object.
         */
        makeDate(timestamp) {
            return new Date(timestamp);
        },

        imgLoadDone(height) {
            this.imgHeight = height;
            this.imgLoaded = true;
        },

        titleSize() {

            let maxLength, elem, text;

            for (const type of ['title', 'subtitle']) {
                maxLength = type == 'subtitle' ? 45 : 30;
                elem = this.$refs[type];

                text = elem.textContent;

                const currentSize = parseInt(window.getComputedStyle(elem).fontSize);

                if (text.length > maxLength) {
                    const diff = text.length - maxLength;
                    const fontSize = currentSize - (parseInt(diff / 5) * 2);
                    this[`${type}FontSize`] = `font-size: ${fontSize}px;`;
                }
            }
        },

        ...mapActions('events', [
            'cardLoaded',
        ]),
    },

    watch: {
        imgLoaded() {
            this.cardLoaded(this.$refs.card.scrollHeight);
        },
    },

    mounted() {
        if(!this.info.productionLogoLink) {
            this.$emit('cardLoad', this.$refs.card.offsetHeight);
        }

        this.titleSize();
    },

    updated() {
        this.$store.dispatch('events/doubleCheckCardHeight');
    }
}