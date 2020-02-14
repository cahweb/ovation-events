/*eslint no-undef: 1*/
/*eslint no-console: 1*/
import _ from 'underscore';
import axios from 'axios';

/**
 * The actions for the Vuex app. These are often asynchronous, and
 * provide any kind of external information gathering/processing,
 * so that all the mutations have to do is update the state itself.
 * 
 * @author Mike W. Leavitt
 * @since 1.0.0
 */

export const actions = {
    /**
     * Gets the list of events based on state parameters from the 
     * OvationTix REST API, organizes them, and sends them to the 
     * mutations.updateEvents() to store them.
     * 
     * @param {commit, state} context  Generally this would be the entire
     *                                  context, but we only use state and
     *                                  commit for most of these, so 
     *                                  that's all we ask for.
     * 
     * @return {void}
     */
    async listEvents({commit, state}) {
        // Build the URL for our RESTful GET request.
        // We're asking for the series data so that we don't get a bunch
        // of duplicate performances clogging up the app display.
        const url = `${state.apiUrl}series/client(${state.clientID})`;

        // Run the GET request asynchronously with Axios and store the
        // results to the {events} variable.
        const events = await axios.get(url)
            .then(response => response.data)
            .catch((error) => { 
                commit('throwAjaxError');
                console.log(error.message);
            });

        if (events !== undefined) {
        
            // Sort the events by date, because their organization in the
            // returned JSON object from OvationTix is not reliably
            // chronological
            const eventList = events.seriesInformation.sort( (a, b) => {
                return a.firstPerformanceDate - b.firstPerformanceDate;
            });

            // If we have filters set for the Super Titles, filter through
            // them and only keep the ones that match, then commit the
            // results to mutations.updateEvents()
            const year = new Date().getFullYear();
            const celebStr = `^UCF Celebrates the Arts ${year} - (\\w+)$`;
            const celebPatt = new RegExp(celebStr, 'i');
            const subCats = ['Music', 'Theatre', 'SVAD'];
            if (state.depts.length) {
                const sortedEvents = eventList.filter(item => {
                    for (let i = 0; i < state.depts.length; i++) {
                        
                        // Keep VIP events from showing up in the feed.
                        if (/\bVIP\b/.test(item.seriesSuperTitle)) {
                            return false;
                        }

                        if (new RegExp(`^${state.depts[i]}`).test(item.seriesSuperTitle)) {
                            item.type = state.depts[i];
                            return true;
                        }
                        else {
                            const shortCat = state.depts[i].replace('UCF', '').trim();
                            const matches = item.seriesSuperTitle.match(celebPatt);
                            if (matches 
                                && matches.length 
                                && subCats.includes(matches[1]) 
                                && (shortCat == matches[1] 
                                    || (state.depts[i] == 'Visual Arts' 
                                        && matches[1] == 'SVAD'
                                        )
                                    )
                                ) 
                            {
                                item.type = state.depts[i];
                                return true;
                            }
                        }
                    }
                    return false;
                });

                commit('updateEvents', sortedEvents);
            }
            else {
                commit('updateEvents', eventList);
            }
        }
        else {
            console.log("Couldn't find any events!");
        }
        //dispatch('updateCardHeight');
    },


    async getEventData(context, url) {
        return await axios.get(url)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error(error);
            });
    },
    
    /**
     * Sets a new format in the Vuex state. Just a wrapper for
     * mutations.setFormat()
     * 
     * @param {function} commit  Generally this would be the entire 
     *                           context, but we only use commit
     * @param {String} newFormat A string representing the format to
     *                             set in the app state.
     */
    changeFormat({commit}, newFormat) {
        commit('setFormat', newFormat);
    },

    /**
     * 
     * @param {function} commit Generally this would be the entire
     *                              context, but we only use commit
     */
    getFormatData({commit}) {
        const options = JSON.parse( _.unescape( document.getElementById('vueOptions').value));

        commit('setAtts', options);
    },

    updateCardHeight({state, commit}/*, height*/) {
        const height = Math.max(...state.cardHeights);
        commit('setCardHeight', height);
    },

    cardLoaded({commit, dispatch}, height) {
        commit('addCardHeight', height);
        commit('incrementCardCount');
        dispatch('checkCardCount');  
    },

    checkCardCount({state, dispatch}) {
        if (state.cardsLoaded == state.eventList.length) {
            dispatch('updateCardHeight');
        }
    },

    doubleCheckCardHeight({state, commit}) {
        const height = Math.max(...Array.from(document.body.querySelectorAll('.event-card')).map(item => item.scrollHeight));

        if (height > state.cardHeight) {
            commit('setCardHeight', height);
        }
    }
};