'use strict';

module.exports.func = async(event) => {

};

/**
 * https://gist.github.com/robinbb/10687275
 * @param stringToDecode
 * @returns {decoded string}
 */

function formURLDecodeComponent(stringToDecode) {
    return decodeURIComponent((stringToDecode + '').replace(/\+/g, ' '));
}