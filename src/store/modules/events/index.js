/*eslint no-undef: 1*/

/**
 * The primary file for the Events module. Defines initial values for
 * the Vuex state and aggregates the actions, getters, and mutations
 * from their respective files.
 * 
 * @author Mike W. Leavitt
 * @since 1.0.0
 */

import {actions} from './actions';
import {getters} from './getters';
import {mutations} from './mutations';

/**
 * Default values for the state. They are:
 * 
 *      - eventList  : an empty Array, which will eventually contain
 *                      the list of event objects.
 *      - apiUrl     : The URL for our RESTful queries to the OvationTix
 *                      API
 *      - ciUrl      : The base URL for links to individual event pages
 *      - ajaxUrl    : The URL for admin-ajax.php, for interacting with
 *                      the WordPress back-end.
 *      - nonce      : A WordPress nonce for additional security during
 *                      AJAX requests.
 *      - clientID   : The OvationTix Client ID. This one is for the
 *                      School of Performing Arts, but we could set
 *                      something in the WordPress options for deployment
 *                      in other departments.
 *      - format     : The format to use. Options are "card", "thumb" or 
 *                      "plaintext"
 * 
 *      - appHeading : The text to use for the heading at the top of the
 *                      app.
 *      - depts      : An Array of strings that will match the beginnings
 *                      of the Super Titles you want to filter out.
 * 
 * N.B. - The wpVars variable isn't defined in this script, but is instead
 * passed from WordPress via wp_localize_script().
 */
const state = {
    eventList: [],
    apiUrl: 'https://api.ovationtix.com/public/',
    ciUrl: 'https://ci.ovationtix.com/',
    ajaxError: false,
    ajaxUrl: wpVars.ajaxUrl,
    nonce: wpVars.security,
    clientID: 34486,
    format: '',
    blurb: false,
    depts: [ 'Theatre UCF', 'UCF Music', 'UCF Art Gallery', 'UCF Celebrates', 'Visual Arts' ],
    cardHeight: 0,
    cardHeights: [],
    cardsLoaded: 0,
};

const namespaced = true;

export const events = {
    state,
    namespaced,
    actions,
    getters,
    mutations
};