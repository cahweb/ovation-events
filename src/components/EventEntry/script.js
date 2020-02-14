/**
 * The script for the EventEntry component. Handles the data for a non-
 * scrolling event display, formatted more conventionally.
 */

import EntryImage from '../EntryImage';
import {mapState} from 'vuex';

export default {
    components: {
        'entry-image': EntryImage
    },
    // An object containing the information for a single production.
    props: {
        info: Object,
    },
    data() {
        return {
            // Default formatting object for Date.toLocaleDateString()
            dateFormat: {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            },
            // The language code for the given page (most likely 'en-us')
            lang: document.documentElement.lang
        };
    },
    computed: {
        // The URL for the individual production.
        url: function() {
            return `${this.ciUrl}${this.clientID}/production/${this.info.productionId}`;
        },
        // Wrapper for makeDate() on the starting timestamp.

        // The advantage of doing these as separate computed properties
        // means that they'll only be evaluated if the information
        // changes--so probably only once each. Methods get evaluated
        // every time they're called.
        startDate() {
            return new Date(this.info.firstPerformanceDate);
        },
        // Wrapper for makeDate() on the ending timestamp.
        endDate() {
            return new Date(this.info.lastPerformanceDate);
        },
        // Determines the range of dates, if applicable, and returns
        // an appropriately formatted string.
        dateRange() {
            // Setting some defaults to make calls to
            // Date.toLocaleDateString() a bit less verbose
            const year = 'numeric',
                month = 'long',
                day = 'numeric';

            let returnStr = '';

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
                    returnStr += this.endDate.toLocaleDateString(this.lang, {month, day, year});
                }
            }
            // If all else fails, return both dates in full.
            else returnStr = `${this.startDate.toLocaleDateString(this.lang, this.dateFormat)} &ndash; ${this.endDate.toLocaleDateString(this.lang, this.dateFormat)}`;

            if (this.singlePerformance) {
                const hour = this.startDate.getHours() > 12 ? this.startDate.getHours() - 12 : this.startDate.getHours();
                const min = ("0" + this.startDate.getMinutes()).slice(-2);
                const amPm = this.startDate.getHours() > 11 ? "p.m." : "a.m.";

                returnStr += `, ${hour}:${min} ${amPm}`;
            }
            else {
                returnStr += `, <small>Multiple Performances</small>`;
            }

            // Return the result
            return returnStr;
        },
        // Determines if there is only one performance.
        singlePerformance() {
            return (this.info.firstPerformanceDate == this.info.lastPerformanceDate ) || this.info.performanceIdIfOnlyOneEventAvailable !== null;
        },
        // Parses the ugly HTML we get from OvationTix into something
        // that looks less like a bag of @$$
        simpleDesc: function() {
            // It's only like this for Theatre productions, so we'll
            // test for that first and ignore everything else.
            const theatrePatt = /^Theatre\sUCF/;
            if(theatrePatt.test(this.info.seriesSuperTitle) && this.format == 'thumb') {
                
                // Create a new DOM Parser and feed the HTML into it.
                const rawDesc = new DOMParser()
                    .parseFromString(this.info.productionDescription, 'text/html');
                
                // Get rid of all the extraneous tags that Ovation includes, for some reason.
                rawDesc.body.innerHTML = rawDesc.body.innerHTML.replace(/<br\s?\/?>/g, "");
                rawDesc.body.innerHTML = rawDesc.body.innerHTML.replace(/<\/?[bi]>/g, "");
                rawDesc.body.innerHTML = rawDesc.body.innerHTML.replace(/<div>/g, "");
                rawDesc.body.innerHTML = rawDesc.body.innerHTML.replace(/<\/div>/g, "\n");

                // Create an array to hold the lines of text.
                let descLines = rawDesc.body.textContent.split("\n");

                // Get rid of spaces. String.trim() wasn't enough, apparently.
                descLines = descLines.map(s => {
                    let returnStr = '';
                    returnStr = s.replace(/^\s*/g, "");
                    returnStr = returnStr.replace(/\s*$/g, "");

                    return returnStr;
                });
                
                // Get rid of the first line, which is the "Buy our Season Tickets!" copy.
                descLines.shift();

                // Create a new DOM Parser for organizing our new HTML
                // content.
                const desc = new DOMParser().parseFromString('<div class="desc"></div>', 'text/html');

                // We want to emphasize the tagline, but not any of the
                // other lines.
                let hasTag = false;

                for (let line of descLines) {

                    // We don't want it if it's empty.
                    if (!line.length) continue;

                    // Set defaults
                    let text = "";
                    let isByLine = false;

                    // Array of bylines to test.
                    const patterns = [
                        'directed by',
                        'music by',
                        'lyrics by',
                        'book by',
                        'by'
                    ];

                    // Create a new <p> element.
                    const newLine = desc.createElement('p');

                    // Test all the possible bylines and see if this line fits one.
                    for (const patt of patterns) {

                        const test = new RegExp(`^${patt}`, 'i');

                        // If we find it, assign the correct class and make it <strong>.
                        // Then we break out of the loop, because we don't need to
                        // check anything else.
                        if (test.test(line)) {
                            newLine.classList.add(patt.replace(' ', '-'));
                            text = `<strong>${line}<strong>`;
                            isByLine = true;
                            break;
                        }
                    }

                    // The first sentence/paragraph beyond the bylines is generally a good
                    // tagline for the show, so we grab that and mark it as such.
                    if (!isByLine && !hasTag) {
                        newLine.classList.add('tagline');
                        const matches = line.match(/^[^.]+\./);
                        if (matches.length) {
                            text = matches[0];
                        }
                        text = `<em>${text}</em>`;
                        hasTag = true;
                    }

                    // Update and append the new <p> tag.
                    newLine.innerHTML = text;
                    desc.querySelector('.desc').appendChild(newLine);

                    // If we're in the thumbnail version, we want to keep things short,
                    // so we break out as soon as we have the tagline.
                    if (hasTag && this.format == 'thumb') break;
                }
                
                // Return all the HTML we just put in our temporary doc
                return desc.querySelector('.desc').innerHTML;
            }

            // If it's not a theatre thing, this gets a lot easier.
            else {
                // We still want to parse the HTML
                const rawHtml = new DOMParser()
                    .parseFromString(this.info.productionDescription, 'text/html');

                // Initialize our text
                let text = '';

                // If we're doing the thumbnails version and the
                // description is long, we either take just the first
                // paragraph or, if there are no line breaks, the first
                // 200 characters.
                if(this.format == 'thumb' && rawHtml.body.textContent.length > 150) {
                    let tempText = rawHtml.body.innerHTML.replace(/<br\s?\/?>/g, "\n");
                    rawHtml.body.innerHTML = tempText;

                    const cutOff = rawHtml.body.textContent.indexOf('\n');
                    let newCutOff;

                    if( cutOff != -1 && cutOff < 150) {
                        text = rawHtml.body.textContent.slice(0, cutOff);
                    }
                    else {
                        text = rawHtml.body.textContent.slice(0, 150);
                        const lastWord = text.match(/\s\b\w+$/);
                        if (lastWord) {
                            newCutOff = text.indexOf(lastWord[0]);
                            text = text.slice(0, newCutOff);
                        }
                        text += '&hellip;';
                    }
                }
                // If it's short, we just put it in without modification.
                else {
                    text = rawHtml.body.innerHTML;
                }

                // And return the text.
                return text;
            }
        },
        // Determines whether the image will choose not to display, so we
        // can give it a placeholder.
        emptyImage() {
            return this.format == 'thumb' && this.info.productionLogoLink == '';
        },
        ...mapState('events', [
            'ciUrl',
            'clientID',
            'format',
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
        }
    }
}