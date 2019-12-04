/*eslint no-undef: 1*/
/*eslint no-console: 1*/

import qs from 'qs';

export const actions = {
    async listEvents({commit, state}) {
        const url = `${state.apiUrl}series/client(${state.clientID})`;

        const events = await axios.get(url)
            .then(response => {
                return response.data;
            })
            .catch(error => console.error(error));
        
        const eventList = events.seriesInformation.sort( (a, b) => {
            return a.firstPerformanceDate - b.firstPerformanceDate;
        });

        if(state.depts.length) {
            const sortedEvents = eventList.filter(item => {
                for(let i = 0; i < state.depts.length; i++) {
                    if(new RegExp(`^${state.depts[i]}`).test(item.seriesSuperTitle)) {
                        return true;
                    }
                }
                return false;
            });

            commit('updateEvents', sortedEvents);
        }
        else {
            commit('updateEvents', eventList);
        }
    },
    async getShortcodeAtts({commit, state}) {
        const url = state.ajaxUrl;
        const method = 'post';
        const data = {
            action: 'spa_events',
            nonce: state.nonce
        };
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }

        const options = {method, url, data: qs.stringify(data), headers};

        const atts = await axios(options)
            .then( response => {
                if(response.data.code == 1) {
                    return {
                        format: response.data.format,
                        appHeading: response.data.appHeading
                    };
                }
                else if(response.data.code == -1) {
                    throw new Error(response.data.error);
                }
            })
            .catch( (error) => {
                console.error(error);
                return {
                    format: "card",
                    appHeading: "Upcoming Events"
                };
            });

        commit('setAtts', atts);
    },
    changeFormat({commit}, newFormat) {
        commit('setFormat', newFormat);
    }
};