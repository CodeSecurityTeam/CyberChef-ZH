/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {toBase64, ALPHABET_OPTIONS} from "../lib/Base64.mjs";

/**
 * To Base64 operation
 */
class ToBase64 extends Operation {

    /**
     * ToBase64 constructor
     */
    constructor() {
        super();

        this.name = "To Base64";
        this.module = "Default";
        this.description = "Base64 是一种使用受限符号集来编码任意字节数据的表示法，便于人类使用并可由计算机处理。<br><br>该操作将原始数据编码为 ASCII Base64 字符串。<br><br>例如：<code>hello</code> 变为 <code>aGVsbG8=</code>";
        this.infoURL = "https://wikipedia.org/wiki/Base64";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "字母表",
                type: "editableOption",
                value: ALPHABET_OPTIONS
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const alphabet = args[0];
        return toBase64(input, alphabet);
    }

    /**
     * Highlight to Base64
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        pos[0].start = Math.floor(pos[0].start / 3 * 4);
        pos[0].end = Math.ceil(pos[0].end / 3 * 4);
        return pos;
    }

    /**
     * Highlight from Base64
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        pos[0].start = Math.ceil(pos[0].start / 4 * 3);
        pos[0].end = Math.floor(pos[0].end / 4 * 3);
        return pos;
    }
}

export default ToBase64;
