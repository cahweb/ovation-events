import EntryImage from '../EntryImage';
import {mapState} from 'vuex';

export default {
    components: {
        'entry-image': EntryImage,
    },
    props: {
        info: Object
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
        url() {
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
                    returnStr += this.endDate.toLocaleDateString(this.lang, {day, year});
                }
                else {
                    returnStr += this.endDate.toLocaleDateString(this.lang, {month, day, year});
                }

                return returnStr;
            }

            return `${this.startDate.toLocaleDateString(this.lang, this.dateFormat)} &ndash; ${this.endDate.toLocaleDateString(this.lang, this.dateFormat)}`;
        },
        singlePerformance() {
            return (this.info.firstPerformanceDate == this.info.lastPerformanceDate) || this.info.performanceIdIfOnlyOneEventAvailable !== null;
        },
        ...mapState('events', [
            'ciUrl',
            'clientID',
            'format'
        ])
    }
}