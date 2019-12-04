import {mapState} from 'vuex';

export default {
    props: {
        src: String,
        name: String,
    },
    data() {
        return {};
    },
    computed: {
        isThumb() {
            return this.format == 'thumb';
        },
        isCard() {
            return this.format == 'card';
        },
        hasSrc() {
            return this.src != '';
        },
        ...mapState('events', [
            'format'
        ])
    }
}