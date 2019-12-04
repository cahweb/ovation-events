import EventEntry from '../EventEntry';
import ScrollBox from '../ScrollBox';
import {mapState, mapActions} from 'vuex';

export default {
    name: 'app',
    components: {
        'event-entry': EventEntry,
        'scroll-box': ScrollBox
    },
    data() {
        return {};
    },
    computed: {
        ...mapState('events', [
            'eventList',
            'format',
            'appHeading'
        ])
    },
    methods: {
        ...mapActions('events', [
            'listEvents',
            'getFormat',
            'changeFormat'
        ])
    }
}