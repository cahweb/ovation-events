import EntryImage from '../EntryImage';
import {mapState} from 'vuex';

export default {
    components: {
        'entry-image': EntryImage
    },
    props: {
        info: Object,
    },
    data() {
        return {
            dateFormat: {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            },
            lang: document.documentElement.lang
        };
    },
    computed: {
        url: function() {
            return `${this.ciUrl}${this.clientID}/production/${this.info.productionId}`;
        },
        startDate() {
            return new Date(this.info.firstPerformanceDate);
        },
        endDate() {
            return new Date(this.info.lastPerformanceDate);
        },
        dateRange() {
            const year = 'numeric',
                month = 'long',
                day = 'numeric';

            if(this.singlePerformance) {
                return this.startDate.toLocaleDateString(this.lang, this.dateFormat);
            }
            
            if(this.startDate.getFullYear() == this.endDate.getFullYear()) {
                let returnStr = `${this.startDate.toLocaleDateString(this.lang, {month, day})} &ndash; `;

                if(this.startDate.getMonth() == this.endDate.getMonth()) {
                    returnStr += (this.endDate.getDay() + 1) + ', ' + this.endDate.getFullYear();
                }
                else {
                    returnStr += this.endDate.toLocaleDateString(this.lang, {month, day, year});
                }

                return returnStr;
            }

            return `${this.startDate.toLocaleDateString(this.lang, this.dateFormat)} &ndash; ${this.endDate.toLocaleDateString(this.lang, this.dateFormat)}`;
        },
        singlePerformance() {
            return (this.info.firstPerformanceDate == this.info.lastPerformanceDate ) || this.info.performanceIdIfOnlyOneEventAvailable !== null;
        },
        simpleDesc: function() {
            const theatrePatt = /^Theatre\sUCF/;
            if(theatrePatt.test(this.info.seriesSuperTitle)) {
                const rawDesc = new DOMParser()
                    .parseFromString(this.info.productionDescription, 'text/html');
                rawDesc.querySelector('body>div:first-child').remove();
                rawDesc.querySelector('body>b:first-child>div:first-child').remove();
                rawDesc.querySelectorAll('br').forEach( item => item.remove() );

                let descLines = [];
                rawDesc.body.querySelectorAll('b, i').forEach(function(item) {
                    const text = item.innerHTML;
                    if(text) {
                        descLines.push(text);
                    }
                    item.remove();
                });

                descLines.push(rawDesc.body.querySelector('div:last-child').textContent);

                const desc = new DOMParser().parseFromString('<div class="desc"></div>', 'text/html');

                let hasTag = false;

                for(let i = 0; i < descLines.length; i++) {
                    let text = descLines[i]
                    const patterns = [
                        'by',
                        'directed by',
                        'music by',
                        'lyrics by',
                        'book by',
                    ];

                    const newLine = desc.createElement('p');

                    for(let j = 0; j <= patterns.length; j++) {
                        if(j < patterns.length) {
                            const patt = new RegExp( '^' + patterns[j], 'i');

                            if(patt.test(text)) {
                                newLine.classList.add(patterns[j].replace(' ', '-'));
                                text = `<strong>${text}</strong>`;
                                break;
                            }
                        }
                        else if(!hasTag) {
                            newLine.classList.add('tagline');
                            text = `<em>${text}</em>`;
                            hasTag = true;
                        }
                        else if(hasTag && this.format == 'thumb') {
                            break;
                        }
                    }

                    newLine.innerHTML = text;

                    desc.querySelector('.desc').appendChild(newLine);

                    if( hasTag && this.format == 'thumb') break;
                }
                
                return desc.querySelector('.desc').innerHTML;
            }
            else {
                const rawHtml = new DOMParser()
                    .parseFromString(this.info.productionDescription, 'text/html');

                let text = '';

                if(this.format == 'thumb' && rawHtml.body.textContent.length > 200) {
                    const cutOff = rawHtml.body.textContent.indexOf('\n');

                    if( cutOff != -1) {
                        text = rawHtml.body.textContent.slice(0, cutOff - 1);
                    }
                    else {
                        text = rawHtml.body.textContent.slice(0, 200);
                        text += '&hellip;';
                    }
                }
                else {
                    text = rawHtml.body.innerHTML;
                }

                return text;
            }
        },
        emptyImage() {
            return this.format == 'thumb' && this.info.productionLogoLink == '';
        },
        ...mapState('events', [
            'ciUrl',
            'clientID',
            'format',
        ])
    }
}