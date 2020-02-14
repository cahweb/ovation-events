/* eslint no-console: 1 */

/**
 * The mutations for the Vuex app. These mostly take information passed
 * from actions and update the state accordingly. These are necessarily
 * synchronous operations, so we want to keep them as short and
 * unobtrusive as possible.
 * 
 * @author Mike W. Leavitt
 * @since 1.0.0
 */

import Vue from 'vue';

export const mutations = {
    /**
     * Updates the list of Events in the state.
     * 
     * @param {Object} state    The Vuex state object. Default argument
     *                           passed to all mutations
     * @param {Array} eventList A list of Event objects passed from the
     *                           OvationTix REST API
     */
    updateEvents(state, eventList) {
        Vue.set(state, 'eventList', eventList);
    },

    /**
     * Sets a new format value in the state.
     * 
     * @param {Object} state  The Vuex state object. Default argument
     *                          passed to all mutations.
     * @param {String} format A string representing the format to set
     *                          in the app state.
     */
    setFormat(state, format) {
        Vue.set(state, 'format', format);
    },

    /**
     * Sets the attributes we get from the WordPress shortcode, so
     * the app will behave accordingly.
     * 
     * @param {Object} state  The Vuex state object. Default arugment
     *                          passed to all mutations.
     * @param {Object} atts   An object containing the attributes from
     *                          the WordPress shortcode.
     */
    setAtts(state, atts) {
        Vue.set(state, 'format', atts.format);
        Vue.set(state, 'blurb', atts.blurb);
        Vue.set(state, 'depts', atts.filter);
    },

    setCardHeight(state, cardHeight) {
        Vue.set(state, 'cardHeight', cardHeight);
    },

    incrementCardCount(state) {
        Vue.set(state, 'cardsLoaded', ++state.cardsLoaded);
    },

    addCardHeight(state, height) {
        const cardHeights = state.cardHeights;
        cardHeights.push(height);
        Vue.set(state, 'cardHeights', cardHeights);
    },

    throwAjaxError(state) {
        Vue.set(state, 'ajaxError', true);
    }
}