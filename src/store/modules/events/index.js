/*eslint no-undef: 1*/

import {actions} from './actions';
import {getters} from './getters';
import {mutations} from './mutations';

const state = {
    eventList: {},
    apiUrl: 'https://api.ovationtix.com/public/',
    ciUrl: 'https://ci.ovationtix.com/',
    ajaxUrl: wpVars.ajaxUrl,
    nonce: wpVars.security,
    clientID: 34486,
    format: '',
    appHeading: '',
    depts: [ 'Theatre UCF', 'UCF Music', 'UCF Art Gallery', 'UCF Celebrates' ]
};

const namespaced = true;

export const events = {
    state,
    namespaced,
    actions,
    getters,
    mutations
};