"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param array - input Array<T>
 * @param iteratee function deal with single T variables from array
 * @returns - outpur new Array<T>
 */
function map(array, iteratee) {
    let index = -1;
    const length = array == null ? 0 : array.length;
    const result = new Array(length);
    while (++index < length) {
        result[index] = iteratee(array[index], index, array);
    }
    return result;
}
exports.default = map;
