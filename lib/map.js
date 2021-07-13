"use strict";
exports.__esModule = true;
/**
 *
 * @param array - input Array<T>
 * @param iteratee function deal with single T variables from array
 * @returns - outpur new Array<T>
 */
function map(array, iteratee) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var result = new Array(length);
    while (++index < length) {
        result[index] = iteratee(array[index], index, array);
    }
    return result;
}
exports["default"] = map;
