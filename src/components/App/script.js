/**
 * The main Application component. Uses the EventEntry and ScrollBox
 * components. Its computed properties and methods are all mapped from
 * the Vuex state, because this component doesn't do much in the way
 * of actual processing.
 * 
 * @author Mike W. Leavitt
 * @version 1.0.0
 */

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
            'ajaxError',
        ])
    },
    methods: {
        ...mapActions('events', [
            'listEvents',
            'getFormat',
            'changeFormat'
        ])
    },

    mounted() {
        this.$store.dispatch('events/listEvents');
    },
}