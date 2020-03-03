/**
 * The main file for getters, which are essentially computed properties
 * which can be mapped to constituent components, as needed. I didn't
 * end up needing any for this app, though.
 * 
 * @author Mike W. Leavitt
 * @since 1.0.0
 */

export const getters = {
    isIE: () => {
        return /*@cc_on!@*/false || !!document.documentMode;
    },
};