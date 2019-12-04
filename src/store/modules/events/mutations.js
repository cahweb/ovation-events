import Vue from 'vue';

export const mutations = {
    updateEvents(state, eventList) {
        Vue.set(state, 'eventList', eventList);
    },
    setFormat(state, format) {
        Vue.set(state, 'format', format);
    },
    setAtts(state, atts) {
        Vue.set(state, 'format', atts.format);
        Vue.set(state, 'appHeading', atts.appHeading);
    }
}